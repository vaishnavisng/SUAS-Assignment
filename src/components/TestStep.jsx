import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, TrendingUp, ShieldAlert, BarChart3, Clock, Percent, ListFilter, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import EquityChart from './EquityChart';

export default function TestStep({ results, onProceed, onBack }) {
  const [showTradeLog, setShowTradeLog] = useState(false);
  const [filterType, setFilterType] = useState('all'); // 'all', 'wins', 'losses'

  if (!results) return null;
  const { metrics, trades, equityCurve, config } = results;

  const filteredTrades = trades.filter(t => {
    if (filterType === 'wins') return t.isWin;
    if (filterType === 'losses') return !t.isWin;
    return true;
  });

  return (
    <div className="animate-fade-in">
      <div className="step-header">
        <span className="step-badge badge-test">Step 4: Test & Backtest Evidence</span>
        <h2 className="step-title">Empirical Backtest Results (2016 – 2026)</h2>
        <p className="step-subtitle">
          Tested across 2,467 trading days of NIFTY 50 historical data with real transaction frictions.
        </p>
      </div>

      {/* Metric Cards Grid */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-title">
            <span>Strategy Return</span>
            <TrendingUp size={16} color="var(--primary)" />
          </div>
          <div className={`metric-val ${metrics.strategyTotalReturn >= 0 ? 'positive' : 'negative'}`}>
            {metrics.strategyTotalReturn >= 0 ? '+' : ''}{metrics.strategyTotalReturn}%
          </div>
          <div className="metric-sub">
            CAGR: {metrics.strategyCAGR}% / yr
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-title">
            <span>Win Rate</span>
            <Percent size={16} color="var(--positive)" />
          </div>
          <div className="metric-val positive">
            {metrics.winRate}%
          </div>
          <div className="metric-sub">
            {metrics.winningTradesCount} Wins / {metrics.losingTradesCount} Losses
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-title">
            <span>Profit Factor</span>
            <BarChart3 size={16} color="var(--primary)" />
          </div>
          <div className="metric-val" style={{ color: 'var(--foreground)' }}>
            {metrics.profitFactor}x
          </div>
          <div className="metric-sub">
            Gross gains / Gross losses
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-title">
            <span>Strategy Max Drawdown</span>
            <ShieldAlert size={16} color="var(--negative)" />
          </div>
          <div className="metric-val negative">
            {metrics.maxDrawdown}%
          </div>
          <div className="metric-sub">
            vs {metrics.benchmarkMaxDrawdown}% (Buy & Hold)
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-title">
            <span>Total Signals</span>
            <Clock size={16} color="var(--foreground-muted)" />
          </div>
          <div className="metric-val">
            {metrics.totalTrades}
          </div>
          <div className="metric-sub">
            Avg {round(metrics.totalTrades / 9.8)} trades / year
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-title">
            <span>Market Exposure</span>
            <Percent size={16} color="var(--foreground-muted)" />
          </div>
          <div className="metric-val" style={{ color: 'var(--foreground)' }}>
            {metrics.exposureTimePct}%
          </div>
          <div className="metric-sub">
            In cash {(100 - metrics.exposureTimePct).toFixed(0)}% of time
          </div>
        </div>
      </div>

      {/* Equity Chart */}
      <EquityChart data={equityCurve} />

      {/* Trade Log Accordion */}
      <div className="glass-card" style={{ padding: '24px 28px', marginBottom: '24px' }}>
        <div
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
          onClick={() => setShowTradeLog(!showTradeLog)}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ListFilter size={18} color="var(--primary)" />
            <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--foreground)' }}>
              Individual Trade Execution Log ({trades.length} trades recorded)
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.84rem', color: 'var(--foreground-muted)' }}>
            <span>{showTradeLog ? 'Collapse' : 'Expand'}</span>
            {showTradeLog ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        </div>

        {showTradeLog && (
          <div style={{ marginTop: '16px' }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
              <button
                className={`btn-secondary ${filterType === 'all' ? 'active' : ''}`}
                style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                onClick={() => setFilterType('all')}
              >
                All ({trades.length})
              </button>
              <button
                className={`btn-secondary ${filterType === 'wins' ? 'active' : ''}`}
                style={{ padding: '6px 14px', fontSize: '0.8rem', color: 'var(--positive)' }}
                onClick={() => setFilterType('wins')}
              >
                Wins ({metrics.winningTradesCount})
              </button>
              <button
                className={`btn-secondary ${filterType === 'losses' ? 'active' : ''}`}
                style={{ padding: '6px 14px', fontSize: '0.8rem', color: 'var(--negative)' }}
                onClick={() => setFilterType('losses')}
              >
                Losses ({metrics.losingTradesCount})
              </button>
            </div>

            <div className="trade-log-container">
              <table className="trade-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Signal Date</th>
                    <th>Entry Date & Price</th>
                    <th>Exit Date & Price</th>
                    <th>Net Return %</th>
                    <th>P&L (₹)</th>
                    <th>Held</th>
                    <th>Exit Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTrades.map((t) => (
                    <tr key={t.id}>
                      <td style={{ color: 'var(--text-dim)' }}>{t.id}</td>
                      <td>{t.signalDate}</td>
                      <td>
                        {t.entryDate} <span style={{ color: 'var(--foreground-muted)' }}>(₹{t.entryPrice})</span>
                      </td>
                      <td>
                        {t.exitDate} <span style={{ color: 'var(--foreground-muted)' }}>(₹{t.exitPrice})</span>
                      </td>
                      <td style={{ color: t.isWin ? 'var(--positive)' : 'var(--negative)', fontWeight: 600 }}>
                        {t.netReturnPct >= 0 ? '+' : ''}{t.netReturnPct}%
                      </td>
                      <td style={{ color: t.isWin ? 'var(--positive)' : 'var(--negative)' }}>
                        {t.pnlAmount >= 0 ? '+' : ''}₹{t.pnlAmount.toLocaleString()}
                      </td>
                      <td>{t.daysHeld}d</td>
                      <td style={{ color: 'var(--foreground-muted)' }}>{t.exitReason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
        <button className="btn-secondary" onClick={onBack}>
          <ArrowLeft size={16} /> Back to Parameters
        </button>
        <button id="btn-proceed-learn" className="btn-primary" onClick={onProceed}>
          Proceed to Epistemic Learnings <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}

function round(val) {
  return Math.round(val * 10) / 10;
}
