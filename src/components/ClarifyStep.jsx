import React from 'react';
import { HelpCircle, Sparkles, Check, ArrowRight, ArrowLeft, Sliders, ShieldCheck } from 'lucide-react';

export default function ClarifyStep({ parsed, config, setConfig, onProceed, onBack }) {
  const handleConfigChange = (key, val) => {
    setConfig(prev => ({
      ...prev,
      [key]: val
    }));
  };

  return (
    <div className="animate-fade-in">
      <div className="step-header">
        <span className="step-badge badge-clarify">Step 2: Clarify & Disambiguate</span>
        <h2 className="step-title">Exposing Ambiguity & Grounding Assumptions</h2>
        <p className="step-subtitle">
          Natural questions leave critical parameters unspecified. We separate what you stated from what the system inferred, allowing you to review or fine-tune every variable.
        </p>
      </div>

      <div className="glass-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '14px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '16px' }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Investigating Query
            </span>
            <div style={{ fontSize: '1.15rem', fontWeight: 600, color: '#f8fafc', marginTop: '2px' }}>
              “{parsed.rawQuestion}”
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <span className="badge-user">User Stated</span>
            <span className="badge-assumed">AI Assumed Baseline</span>
          </div>
        </div>

        <table className="clarify-table">
          <thead>
            <tr>
              <th style={{ width: '22%' }}>Parameter</th>
              <th style={{ width: '25%' }}>What You Said</th>
              <th style={{ width: '30%' }}>System Assumption & Rationale</th>
              <th style={{ width: '23%' }}>Interactive Control</th>
            </tr>
          </thead>
          <tbody>
            {parsed.ambiguities.map((item, idx) => (
              <tr key={idx}>
                <td>
                  <strong style={{ color: 'var(--text-primary)', fontSize: '0.92rem' }}>{item.parameter}</strong>
                </td>
                <td>
                  <span className="badge-user" style={{ whiteSpace: 'normal', textAlign: 'left' }}>
                    {item.userSaid}
                  </span>
                </td>
                <td>
                  <div style={{ marginBottom: '4px' }}>
                    <span className="badge-assumed">{item.aiAssumed}</span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                    {item.rationale}
                  </div>
                </td>
                <td>
                  {item.key === 'dropThreshold' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <select
                        id="select-drop-threshold"
                        className="custom-select"
                        value={config.dropThreshold}
                        onChange={(e) => handleConfigChange('dropThreshold', parseFloat(e.target.value))}
                      >
                        <option value={-1.0}>-1.0% (Mild Dip)</option>
                        <option value={-1.5}>-1.5% (Standard Fall - Default)</option>
                        <option value={-2.0}>-2.0% (Sharp Selloff)</option>
                        <option value={-2.5}>-2.5% (Severe Crash)</option>
                        <option value={-3.0}>-3.0% (Extreme Panic)</option>
                      </select>
                      <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                        Selected: {Math.abs(config.dropThreshold)}% daily decline
                      </span>
                    </div>
                  )}

                  {item.key === 'entryTiming' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <select
                        id="select-entry-timing"
                        className="custom-select"
                        value={config.entryTiming}
                        onChange={(e) => handleConfigChange('entryTiming', e.target.value)}
                      >
                        <option value="next_open">Next Day Open (9:15 AM - Realistic)</option>
                        <option value="same_close">Same Day Close (3:25 PM - Theoretical)</option>
                      </select>
                      <span style={{ fontSize: '0.72rem', color: config.entryTiming === 'next_open' ? '#10b981' : '#f59e0b' }}>
                        {config.entryTiming === 'next_open' ? '✓ Zero Look-Ahead Bias' : '⚠ Requires MOC order'}
                      </span>
                    </div>
                  )}

                  {item.key === 'holdingPeriod' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <select
                        id="select-holding-period"
                        className="custom-select"
                        value={config.holdingPeriod}
                        onChange={(e) => handleConfigChange('holdingPeriod', parseInt(e.target.value))}
                      >
                        <option value={2}>2 Trading Days (Quick Scalp)</option>
                        <option value={3}>3 Trading Days (Short Swing)</option>
                        <option value={5}>5 Trading Days (1 Week - Default)</option>
                        <option value={7}>7 Trading Days (Multi-day)</option>
                        <option value={10}>10 Trading Days (2 Weeks)</option>
                      </select>
                      <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                        Holding duration: {config.holdingPeriod} sessions
                      </span>
                    </div>
                  )}

                  {item.key === 'trendFilter' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <select
                        id="select-trend-filter"
                        className="custom-select"
                        value={config.trendFilter}
                        onChange={(e) => handleConfigChange('trendFilter', e.target.value)}
                      >
                        <option value="none">No Filter (All 10 Years)</option>
                        <option value="above_200_sma">Bull Regime Only (Above 200 SMA)</option>
                      </select>
                      <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                        {config.trendFilter === 'above_200_sma' ? 'Filters out bear crashes' : 'Exposes to all regimes'}
                      </span>
                    </div>
                  )}

                  {item.key === 'costBps' && (
                    <span style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono)', color: '#a5b4fc', padding: '4px 8px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '4px' }}>
                      0.08% / trade (STT + Slippage)
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
        <button className="btn-secondary" onClick={onBack}>
          <ArrowLeft size={16} /> Edit Question
        </button>
        <button id="btn-proceed-define" className="btn-primary" onClick={onProceed}>
          Formulate Research Experiment <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
