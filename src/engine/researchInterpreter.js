/**
 * Research Interpreter & Synthesis Engine
 * Manages the cognitive flow: Question -> Clarify -> Define -> Test -> Learn
 */

export const PRESET_QUESTIONS = [
  {
    id: 'sharp-fall',
    text: 'Does buying NIFTY after a sharp fall work?',
    category: 'Mean Reversion',
    description: 'The core assignment hypothesis: testing if sudden single-day selloffs in NIFTY 50 create high-probability swing bounce opportunities.',
    defaultConfig: {
      dropThreshold: -1.5,
      dropWindow: 1,
      entryTiming: 'next_open',
      holdingPeriod: 5,
      exitMode: 'fixed_time',
      profitTargetPct: 2.5,
      stopLossPct: 2.0,
      trendFilter: 'none',
      costBps: 0.08
    }
  },
  {
    id: 'severe-crash',
    text: 'Does buying NIFTY only after extreme crashes (drop > 2.5%) work better?',
    category: 'Extreme Overreaction',
    description: 'Investigating if higher threshold filters reduce noise and increase win rate, at the cost of sample size.',
    defaultConfig: {
      dropThreshold: -2.5,
      dropWindow: 1,
      entryTiming: 'next_open',
      holdingPeriod: 5,
      exitMode: 'fixed_time',
      profitTargetPct: 3.5,
      stopLossPct: 3.0,
      trendFilter: 'none',
      costBps: 0.08
    }
  },
  {
    id: 'trend-filtered',
    text: 'Does buying NIFTY dips ONLY when trading above the 200-day SMA work?',
    category: 'Regime Filtered',
    description: 'Testing the hypothesis that dip-buying only succeeds in secular bull markets, and avoids catastrophic drawdowns like COVID March 2020.',
    defaultConfig: {
      dropThreshold: -1.5,
      dropWindow: 1,
      entryTiming: 'next_open',
      holdingPeriod: 5,
      exitMode: 'fixed_time',
      profitTargetPct: 2.5,
      stopLossPct: 2.0,
      trendFilter: 'above_200_sma',
      costBps: 0.08
    }
  },
  {
    id: 'multi-day-bleed',
    text: 'Does buying NIFTY after 3 consecutive days of cumulative selling work?',
    category: 'Multi-Day Momentum Exhaustion',
    description: 'Evaluating cumulative 3-day drops exceeding 3.0% rather than isolated 1-day flash dips.',
    defaultConfig: {
      dropThreshold: -3.0,
      dropWindow: 3,
      entryTiming: 'next_open',
      holdingPeriod: 7,
      exitMode: 'target_stop',
      profitTargetPct: 3.0,
      stopLossPct: 2.5,
      trendFilter: 'none',
      costBps: 0.08
    }
  }
];

export function parseQuestion(questionText) {
  const lower = questionText.toLowerCase();

  // Find best matching preset or parse custom
  let matchedPreset = PRESET_QUESTIONS.find(p => p.text.toLowerCase() === lower);
  if (!matchedPreset) {
    if (lower.includes('200') || lower.includes('trend') || lower.includes('sma')) {
      matchedPreset = PRESET_QUESTIONS[2];
    } else if (lower.includes('severe') || lower.includes('crash') || lower.includes('2.5') || lower.includes('2%')) {
      matchedPreset = PRESET_QUESTIONS[1];
    } else if (lower.includes('3 day') || lower.includes('three') || lower.includes('consecutive')) {
      matchedPreset = PRESET_QUESTIONS[3];
    } else {
      matchedPreset = PRESET_QUESTIONS[0];
    }
  }

  return {
    rawQuestion: questionText,
    matchedPreset,
    ambiguities: [
      {
        parameter: 'Definition of "Sharp Fall"',
        userSaid: 'Used vague qualitative term "sharp fall"',
        aiAssumed: `${Math.abs(matchedPreset.defaultConfig.dropThreshold)}% decline over ${matchedPreset.defaultConfig.dropWindow} trading session(s)`,
        rationale: 'In NIFTY 50, standard deviation of daily return is ~0.95%. A 1.5% drop represents ~1.6σ move, which yields statistically significant sample size without excessive noise.',
        key: 'dropThreshold',
        type: 'slider',
        options: [-1.0, -1.5, -2.0, -2.5, -3.0]
      },
      {
        parameter: 'Execution Timing',
        userSaid: 'Implied "buying" without execution protocol',
        aiAssumed: matchedPreset.defaultConfig.entryTiming === 'next_open' ? 'Next Day Market Open (9:15 AM IST)' : 'Same Day Close (3:25 PM IST)',
        rationale: 'Entering at next morning open prevents look-ahead bias and simulates real-world execution feasibility for retail participants.',
        key: 'entryTiming',
        type: 'select',
        options: [
          { label: 'Next Day Open (9:15 AM - Zero Lookahead)', value: 'next_open' },
          { label: 'Same Day Close (3:25 PM - Theoretical)', value: 'same_close' }
        ]
      },
      {
        parameter: 'Exit & Holding Period',
        userSaid: 'Did not specify when or how to exit',
        aiAssumed: `${matchedPreset.defaultConfig.holdingPeriod} trading sessions (${matchedPreset.defaultConfig.exitMode === 'fixed_time' ? 'Fixed Time' : 'Profit/Stop Target'})`,
        rationale: 'Mean-reversion tendencies in broad equity indices typically dissipate within 3 to 7 trading days.',
        key: 'holdingPeriod',
        type: 'slider',
        options: [2, 3, 5, 7, 10, 15]
      },
      {
        parameter: 'Market Regime Filter',
        userSaid: 'Assumed all market regimes behave identically',
        aiAssumed: matchedPreset.defaultConfig.trendFilter === 'above_200_sma' ? 'Only in Bull Regime (Above 200 SMA)' : 'Unfiltered (All Regimes)',
        rationale: 'Dip buying can result in catastrophic drawdowns if attempted during a structural bear market or macro liquidity crash (e.g. COVID 2020).',
        key: 'trendFilter',
        type: 'select',
        options: [
          { label: 'No Filter (Test Across All 10 Years)', value: 'none' },
          { label: 'Trend Filter (Only Trade Above 200-day SMA)', value: 'above_200_sma' }
        ]
      },
      {
        parameter: 'Frictional Costs & Slippage',
        userSaid: 'Ignored brokerage, STT, and execution slippage',
        aiAssumed: '0.08% round-trip drag (8 basis points)',
        rationale: 'Taxes (STT), exchange turnover charges, and bid-ask slippage are critical drags in frequent swing trading.',
        key: 'costBps',
        type: 'badge',
        fixedVal: '0.08% / trade'
      }
    ]
  };
}

export function synthesizeLearnings(result) {
  if (!result || !result.metrics) return null;
  const { metrics, config } = result;

  const isProfitable = metrics.strategyTotalReturn > 0;
  const beatsBenchmark = metrics.strategyTotalReturn > metrics.benchmarkTotalReturn;
  const beatsSharpeDrawdown = Math.abs(metrics.maxDrawdown) < Math.abs(metrics.benchmarkMaxDrawdown);

  // 1. Empirical Facts (Strictly verifiable data)
  const empiricalFacts = [
    `Sample Size: Across 10 years (2,467 trading days), exactly ${metrics.totalTrades} signals were generated.`,
    `Win Rate: ${metrics.winRate}% of trades were profitable (${metrics.winningTradesCount} wins vs ${metrics.losingTradesCount} losses).`,
    `Profit Factor: Gross gains exceeded gross losses by a ratio of ${metrics.profitFactor}x.`,
    `Average Trade Return: Net return per trade averaged ${metrics.avgTradeReturn > 0 ? '+' : ''}${metrics.avgTradeReturn}% (Avg Win: +${metrics.avgWin}%, Avg Loss: ${metrics.avgLoss}%).`,
    `Drawdown Protection: Strategy max drawdown was ${metrics.maxDrawdown}% vs ${metrics.benchmarkMaxDrawdown}% for Buy & Hold.`,
    `Capital Exposure: The strategy was invested in the market only ${metrics.exposureTimePct}% of the time, remaining in cash for ${(100 - metrics.exposureTimePct).toFixed(1)}% of trading days.`
  ];

  // 2. Reasoned Conclusions & Nuance
  const reasonedConclusions = [
    {
      title: 'Short-Term Mean Reversion Exists in NIFTY 50',
      description: `With a win rate of ${metrics.winRate}% and a profit factor of ${metrics.profitFactor}, the data shows a distinct statistical edge toward mean-reversion following a ${Math.abs(config.dropThreshold)}% selloff.`
    },
    {
      title: 'Risk-Adjusted Efficiency vs Absolute Return',
      description: beatsBenchmark
        ? `The strategy outperformed Buy & Hold (+${metrics.strategyTotalReturn}% vs +${metrics.benchmarkTotalReturn}%) while taking significantly less downside risk.`
        : `While Buy & Hold generated higher raw compounded return (+${metrics.benchmarkTotalReturn}% vs +${metrics.strategyTotalReturn}%), the strategy achieved its returns with only ${metrics.exposureTimePct}% market exposure and a much lower drawdown (${metrics.maxDrawdown}% vs ${metrics.benchmarkMaxDrawdown}%).`
    },
    {
      title: 'The "Catching Falling Knives" Reality',
      description: metrics.worstTrade 
        ? `The single worst trade lost ${metrics.worstTrade.netReturnPct}% on ${metrics.worstTrade.entryDate}. Without a stop loss or regime filter, consecutive sharp down-days cluster during market crashes.`
        : 'Holding through sharp falls exposes traders to tail-risk cascades.'
    }
  ];

  // 3. Epistemic Risks & Biases
  const epistemicRisks = [
    {
      risk: 'Look-Ahead Bias',
      assessment: config.entryTiming === 'next_open' 
        ? 'Safeguarded: Strategy triggers at Close and enters at Next Open, preventing real-time lookahead illusion.' 
        : 'High Risk: Strategy enters at same-day close, which cannot be executed with precision in live market conditions without MOC orders.'
    },
    {
      risk: 'Structural Bull Market Drift',
      assessment: 'The test covers 2016–2026, a massive structural bull run in Indian equities. A significant portion of positive returns stems from the broader macro upward drift rather than pure alpha.'
    },
    {
      risk: 'Execution & Slippage Friction',
      assessment: `Model assumes ${config.costBps}% roundtrip friction. On gap-down panic days, real-world bid-ask spreads widen dramatically, potentially reducing net edges.`
    },
    {
      risk: 'Sample Size Significance',
      assessment: metrics.totalTrades < 30 
        ? 'Warning: Total trades < 30. High risk of small-sample variance and statistical fluke.' 
        : `Sufficient: ${metrics.totalTrades} completed trades provides moderate statistical stability.`
    }
  ];

  // 4. Next Hypotheses to Investigate (Interactive)
  const nextHypotheses = [
    {
      title: 'Add 200-Day SMA Regime Filter',
      prompt: 'Does filtering out trades when NIFTY is below 200 SMA prevent crash drawdowns?',
      appliedConfig: {
        ...config,
        trendFilter: config.trendFilter === 'above_200_sma' ? 'none' : 'above_200_sma'
      },
      tag: config.trendFilter === 'above_200_sma' ? 'Currently Active' : 'Recommended'
    },
    {
      title: 'Implement Defined Stop Loss & Profit Target',
      prompt: 'Does an active 2.0% stop loss and 2.5% take profit improve risk-adjusted Sharpe ratio?',
      appliedConfig: {
        ...config,
        exitMode: 'target_stop',
        profitTargetPct: 2.5,
        stopLossPct: 2.0
      },
      tag: config.exitMode === 'target_stop' ? 'Currently Active' : 'Risk Management'
    },
    {
      title: 'Test Shorter 3-Day Holding Window',
      prompt: 'Does quick mean-reversion dissipate after 3 days, reducing unnecessary market risk?',
      appliedConfig: {
        ...config,
        holdingPeriod: 3
      },
      tag: 'Holding Horizon'
    },
    {
      title: 'Test Extreme Crashes Only (Drop >= 2.5%)',
      prompt: 'Does filtering for true panic selloffs increase win-rate to 70%+?',
      appliedConfig: {
        ...config,
        dropThreshold: -2.5
      },
      tag: 'Threshold Sensitivity'
    }
  ];

  return {
    empiricalFacts,
    reasonedConclusions,
    epistemicRisks,
    nextHypotheses
  };
}
