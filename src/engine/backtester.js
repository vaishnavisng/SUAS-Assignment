/**
 * NIFTY 50 Research Backtesting Engine
 * Deterministic, vector-friendly simulation running against 10 years of daily bars.
 */

/**
 * Calculates Simple Moving Average (SMA)
 */
export function calculateSMA(data, period) {
  const sma = new Array(data.length).fill(null);
  let sum = 0;
  for (let i = 0; i < data.length; i++) {
    sum += data[i].close;
    if (i >= period) {
      sum -= data[i - period].close;
      sma[i] = sum / period;
    } else if (i === period - 1) {
      sma[i] = sum / period;
    }
  }
  return sma;
}

/**
 * Executes a simulated trading experiment on daily OHLC data.
 */
export function runExperiment(data, config) {
  const {
    dropThreshold = -1.5, // e.g., -1.5%
    dropWindow = 1, // 1 day drop vs 3 day drop
    entryTiming = 'next_open', // 'next_open' (avoids lookahead) or 'same_close'
    holdingPeriod = 5, // days
    exitMode = 'fixed_time', // 'fixed_time' | 'target_stop'
    profitTargetPct = 2.5,
    stopLossPct = 2.0,
    trendFilter = 'none', // 'none' | 'above_200_sma'
    costBps = 0.08, // 8 basis points (0.08%) roundtrip friction
    initialCapital = 100000
  } = config;

  if (!data || data.length === 0) {
    return null;
  }

  // Pre-calculate 200 SMA if trend filter is requested
  const sma200 = trendFilter === 'above_200_sma' ? calculateSMA(data, 200) : null;

  const trades = [];
  let inPosition = false;
  let currentTrade = null;

  let capital = initialCapital;
  const equityCurve = [];
  
  // Track peak capital for max drawdown
  let peakCapital = initialCapital;
  let maxDrawdown = 0;

  // Benchmark tracking (Buy & Hold NIFTY)
  const initialBenchmarkPrice = data[0].close;
  let benchmarkUnits = initialCapital / initialBenchmarkPrice;
  let peakBenchmark = initialCapital;
  let maxBenchmarkDrawdown = 0;

  for (let i = 0; i < data.length; i++) {
    const currentBar = data[i];
    const prevBar = i > 0 ? data[i - 1] : null;

    // Check if we have an open position to evaluate for exit
    if (inPosition && currentTrade) {
      currentTrade.daysHeld += 1;
      let exitTriggered = false;
      let exitPrice = currentBar.close;
      let exitReason = 'Holding Period Reached';

      if (exitMode === 'target_stop') {
        // Evaluate intraday High/Low for stop/target
        const highReturnPct = ((currentBar.high - currentTrade.entryPrice) / currentTrade.entryPrice) * 100;
        const lowReturnPct = ((currentBar.low - currentTrade.entryPrice) / currentTrade.entryPrice) * 100;

        if (lowReturnPct <= -stopLossPct) {
          exitTriggered = true;
          // Approximate exit at stop loss level or open if gap down
          exitPrice = currentBar.open < (currentTrade.entryPrice * (1 - stopLossPct / 100))
            ? currentBar.open
            : currentTrade.entryPrice * (1 - stopLossPct / 100);
          exitReason = `Stop Loss Hit (-${stopLossPct}%)`;
        } else if (highReturnPct >= profitTargetPct) {
          exitTriggered = true;
          exitPrice = currentBar.open > (currentTrade.entryPrice * (1 + profitTargetPct / 100))
            ? currentBar.open
            : currentTrade.entryPrice * (1 + profitTargetPct / 100);
          exitReason = `Profit Target Reached (+${profitTargetPct}%)`;
        } else if (currentTrade.daysHeld >= holdingPeriod) {
          exitTriggered = true;
          exitPrice = currentBar.close;
          exitReason = `Time Exit (${holdingPeriod} Days)`;
        }
      } else {
        // Standard Fixed Holding Period
        if (currentTrade.daysHeld >= holdingPeriod) {
          exitTriggered = true;
          exitPrice = currentBar.close;
          exitReason = `Fixed Hold (${holdingPeriod} Days)`;
        }
      }

      if (exitTriggered) {
        const rawReturnPct = ((exitPrice - currentTrade.entryPrice) / currentTrade.entryPrice) * 100;
        const netReturnPct = rawReturnPct - costBps;
        const tradePnl = currentTrade.positionCapital * (netReturnPct / 100);
        capital = currentTrade.positionCapital + tradePnl;

        trades.push({
          id: trades.length + 1,
          signalDate: currentTrade.signalDate,
          entryDate: currentTrade.entryDate,
          entryPrice: roundTo2(currentTrade.entryPrice),
          exitDate: currentBar.date,
          exitPrice: roundTo2(exitPrice),
          rawReturnPct: roundTo2(rawReturnPct),
          netReturnPct: roundTo2(netReturnPct),
          pnlAmount: roundTo2(tradePnl),
          daysHeld: currentTrade.daysHeld,
          exitReason,
          isWin: netReturnPct > 0,
          capitalAfter: roundTo2(capital)
        });

        inPosition = false;
        currentTrade = null;
      }
    }

    // If NOT in position, check if we should enter
    if (!inPosition && i >= dropWindow) {
      // Calculate drop over dropWindow
      let dropPct = 0;
      if (dropWindow === 1) {
        dropPct = currentBar.change_pct; // Daily change from prev close
      } else {
        const baseBar = data[i - dropWindow];
        dropPct = ((currentBar.close - baseBar.close) / baseBar.close) * 100;
      }

      // Check condition (e.g. drop <= -1.5%)
      const isSharpFall = dropPct <= dropThreshold;

      // Check optional trend filter
      let passesTrendFilter = true;
      if (trendFilter === 'above_200_sma') {
        passesTrendFilter = sma200[i] !== null && currentBar.close > sma200[i];
      }

      if (isSharpFall && passesTrendFilter) {
        if (entryTiming === 'same_close') {
          // Enter at same day close
          inPosition = true;
          currentTrade = {
            signalDate: currentBar.date,
            entryDate: currentBar.date,
            entryPrice: currentBar.close,
            positionCapital: capital,
            daysHeld: 0
          };
        } else {
          // Enter at next day's open (avoids lookahead bias)
          if (i + 1 < data.length) {
            const nextBar = data[i + 1];
            inPosition = true;
            currentTrade = {
              signalDate: currentBar.date,
              entryDate: nextBar.date,
              entryPrice: nextBar.open,
              positionCapital: capital,
              daysHeld: 0
            };
          }
        }
      }
    }

    // Benchmark valuation
    const benchmarkEquity = benchmarkUnits * currentBar.close;
    if (benchmarkEquity > peakBenchmark) {
      peakBenchmark = benchmarkEquity;
    }
    const benchmarkDrawdown = ((benchmarkEquity - peakBenchmark) / peakBenchmark) * 100;
    if (benchmarkDrawdown < maxBenchmarkDrawdown) {
      maxBenchmarkDrawdown = benchmarkDrawdown;
    }

    // Strategy equity valuation
    let currentEquity = capital;
    if (inPosition && currentTrade && currentTrade.daysHeld > 0) {
      const unrealizedRaw = ((currentBar.close - currentTrade.entryPrice) / currentTrade.entryPrice) * 100;
      currentEquity = currentTrade.positionCapital * (1 + (unrealizedRaw - (costBps / 2)) / 100);
    }
    if (currentEquity > peakCapital) {
      peakCapital = currentEquity;
    }
    const currentDrawdown = ((currentEquity - peakCapital) / peakCapital) * 100;
    if (currentDrawdown < maxDrawdown) {
      maxDrawdown = currentDrawdown;
    }

    equityCurve.push({
      date: currentBar.date,
      strategyEquity: roundTo2(currentEquity),
      benchmarkEquity: roundTo2(benchmarkEquity),
      benchmarkPrice: currentBar.close,
      inPosition,
      drawdownPct: roundTo2(currentDrawdown),
      benchmarkDrawdownPct: roundTo2(benchmarkDrawdown)
    });
  }

  // Compute aggregate statistics
  const totalTrades = trades.length;
  const winningTrades = trades.filter(t => t.isWin);
  const losingTrades = trades.filter(t => !t.isWin);
  const winRate = totalTrades > 0 ? (winningTrades.length / totalTrades) * 100 : 0;

  const grossGains = winningTrades.reduce((acc, t) => acc + t.pnlAmount, 0);
  const grossLosses = Math.abs(losingTrades.reduce((acc, t) => acc + t.pnlAmount, 0));
  const profitFactor = grossLosses > 0 ? grossGains / grossLosses : (grossGains > 0 ? 99.0 : 0);

  const finalStrategyEquity = equityCurve[equityCurve.length - 1].strategyEquity;
  const finalBenchmarkEquity = equityCurve[equityCurve.length - 1].benchmarkEquity;

  const strategyTotalReturn = ((finalStrategyEquity - initialCapital) / initialCapital) * 100;
  const benchmarkTotalReturn = ((finalBenchmarkEquity - initialCapital) / initialCapital) * 100;

  // Approx years
  const numYears = data.length / 250;
  const strategyCAGR = numYears > 0 ? (Math.pow(finalStrategyEquity / initialCapital, 1 / numYears) - 1) * 100 : 0;
  const benchmarkCAGR = numYears > 0 ? (Math.pow(finalBenchmarkEquity / initialCapital, 1 / numYears) - 1) * 100 : 0;

  const avgTradeReturn = totalTrades > 0 ? trades.reduce((acc, t) => acc + t.netReturnPct, 0) / totalTrades : 0;
  const avgWin = winningTrades.length > 0 ? winningTrades.reduce((acc, t) => acc + t.netReturnPct, 0) / winningTrades.length : 0;
  const avgLoss = losingTrades.length > 0 ? losingTrades.reduce((acc, t) => acc + t.netReturnPct, 0) / losingTrades.length : 0;

  // Days in market
  const daysInMarket = equityCurve.filter(e => e.inPosition).length;
  const exposureTimePct = (daysInMarket / data.length) * 100;

  // Best & Worst trades
  let bestTrade = null;
  let worstTrade = null;
  if (totalTrades > 0) {
    bestTrade = [...trades].sort((a, b) => b.netReturnPct - a.netReturnPct)[0];
    worstTrade = [...trades].sort((a, b) => a.netReturnPct - b.netReturnPct)[0];
  }

  return {
    config,
    metrics: {
      totalTrades,
      winningTradesCount: winningTrades.length,
      losingTradesCount: losingTrades.length,
      winRate: roundTo2(winRate),
      profitFactor: roundTo2(profitFactor),
      strategyTotalReturn: roundTo2(strategyTotalReturn),
      strategyCAGR: roundTo2(strategyCAGR),
      benchmarkTotalReturn: roundTo2(benchmarkTotalReturn),
      benchmarkCAGR: roundTo2(benchmarkCAGR),
      maxDrawdown: roundTo2(maxDrawdown),
      benchmarkMaxDrawdown: roundTo2(maxBenchmarkDrawdown),
      avgTradeReturn: roundTo2(avgTradeReturn),
      avgWin: roundTo2(avgWin),
      avgLoss: roundTo2(avgLoss),
      exposureTimePct: roundTo2(exposureTimePct),
      bestTrade,
      worstTrade,
      startYear: data[0].date.substring(0, 4),
      endYear: data[data.length - 1].date.substring(0, 4),
      totalBars: data.length
    },
    trades,
    equityCurve
  };
}

function roundTo2(val) {
  return Math.round((val + Number.EPSILON) * 100) / 100;
}
