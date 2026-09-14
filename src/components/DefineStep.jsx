import React from 'react';
import { ArrowLeft, Play, FileText, CheckCircle, Sliders, Shield } from 'lucide-react';

export default function DefineStep({ parsed, config, onRunTest, onBack }) {
  const formalHypothesis = `Following a single-day drop of ≥ ${Math.abs(config.dropThreshold)}% in NIFTY 50, market overreaction creates a statistically favorable mean-reversion opportunity, allowing a ${config.holdingPeriod}-day long position entered at ${config.entryTiming === 'next_open' ? 'next day open' : 'same day close'} to produce positive risk-adjusted excess returns over buy-and-hold${config.trendFilter === 'above_200_sma' ? ' when filtered by the 200-day SMA' : ''}.`;

  return (
    <div className="animate-fade-in">
      <div className="step-header">
        <span className="step-badge badge-define">Step 3: Define Experiment</span>
        <h2 className="step-title">Structured Research Experiment Canvas</h2>
        <p className="step-subtitle">
          The natural language query has been translated into a verifiable, falsifiable scientific experiment ready for empirical execution.
        </p>
      </div>

      <div className="hypothesis-box">
        <div className="hypothesis-tag">
          <FileText size={16} /> Formal Scientific Hypothesis
        </div>
        <p className="hypothesis-statement">
          “{formalHypothesis}”
        </p>
      </div>

      <div className="glass-card">
        <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sliders size={18} color="var(--accent-primary)" />
          Experiment Parameters & Boundary Conditions
        </h3>

        <div className="experiment-canvas">
          <div className="canvas-card">
            <div className="canvas-card-label">Market / Asset</div>
            <div className="canvas-card-val">NIFTY 50 Index</div>
            <div className="canvas-card-desc">Daily OHLCV bars (India benchmark cash/ETF proxy)</div>
          </div>

          <div className="canvas-card">
            <div className="canvas-card-label">Condition (Signal)</div>
            <div className="canvas-card-val" style={{ color: '#f43f5e' }}>
              Daily Close Drop ≤ {config.dropThreshold}%
            </div>
            <div className="canvas-card-desc">
              Close-to-Close return {config.dropWindow > 1 ? `over ${config.dropWindow} days` : 'on signal day'}
            </div>
          </div>

          <div className="canvas-card">
            <div className="canvas-card-label">Entry Execution</div>
            <div className="canvas-card-val" style={{ color: '#10b981' }}>
              {config.entryTiming === 'next_open' ? 'Market Open (t+1)' : 'Market Close (t)'}
            </div>
            <div className="canvas-card-desc">
              {config.entryTiming === 'next_open' ? 'Executed at 9:15 AM (eliminates look-ahead bias)' : 'Theoretical execution at 3:25 PM'}
            </div>
          </div>

          <div className="canvas-card">
            <div className="canvas-card-label">Exit Condition</div>
            <div className="canvas-card-val">
              {config.exitMode === 'fixed_time' ? `Fixed ${config.holdingPeriod} Days` : `Target +${config.profitTargetPct}% / Stop -${config.stopLossPct}%`}
            </div>
            <div className="canvas-card-desc">
              {config.exitMode === 'fixed_time' ? `Close position at Close(t+${config.holdingPeriod})` : 'Exits intraday on trigger or time limit'}
            </div>
          </div>

          <div className="canvas-card">
            <div className="canvas-card-label">Holding Period</div>
            <div className="canvas-card-val">{config.holdingPeriod} Trading Days</div>
            <div className="canvas-card-desc">Approximately 1 calendar week holding window</div>
          </div>

          <div className="canvas-card">
            <div className="canvas-card-label">Test Period Horizon</div>
            <div className="canvas-card-val">10 Years (2016 – 2026)</div>
            <div className="canvas-card-desc">2,467 real daily trading sessions across all regimes</div>
          </div>

          <div className="canvas-card">
            <div className="canvas-card-label">Cost Assumptions</div>
            <div className="canvas-card-val">0.08% Round-Trip</div>
            <div className="canvas-card-desc">8 basis points per trade for STT, turnover, and slippage</div>
          </div>

          <div className="canvas-card">
            <div className="canvas-card-label">Regime Filter</div>
            <div className="canvas-card-val" style={{ color: config.trendFilter === 'above_200_sma' ? 'var(--font-accent)' : 'var(--text-muted)' }}>
              {config.trendFilter === 'above_200_sma' ? '200-day SMA Bull Filter' : 'None (All Regimes)'}
            </div>
            <div className="canvas-card-desc">
              {config.trendFilter === 'above_200_sma' ? 'Only buy when Close > 200 SMA' : 'Includes secular bull, bear, and crisis crashes'}
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
        <button className="btn-secondary" onClick={onBack}>
          <ArrowLeft size={16} /> Back to Clarify
        </button>
        <button id="btn-run-backtest" className="btn-primary" onClick={onRunTest}>
          <Play size={16} fill="currentColor" /> Run Backtest Against 10-Yr Data
        </button>
      </div>
    </div>
  );
}
