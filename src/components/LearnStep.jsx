import React from 'react';
import { Sparkles, CheckCircle2, HelpCircle, AlertTriangle, ArrowRight, RotateCcw, Compass, ArrowUpRight } from 'lucide-react';
import { synthesizeLearnings } from '../engine/researchInterpreter';

export default function LearnStep({ results, onApplyNextHypothesis, onRestart }) {
  if (!results) return null;

  const learnings = synthesizeLearnings(results);
  if (!learnings) return null;

  return (
    <div className="animate-fade-in">
      <div className="step-header">
        <span className="step-badge badge-learn">Step 5: Epistemic Learning & Synthesis</span>
        <h2 className="step-title">Evidence & Intellectual Honesty</h2>
        <p className="step-subtitle">
          Distinguishing between what the raw empirical data demonstrates versus what the system infers or concludes.
        </p>
      </div>

      {/* Dual Column: Data Facts vs Reasoned Conclusions */}
      <div className="learn-grid">
        {/* Column 1: Facts */}
        <div className="glass-card learn-col-facts">
          <div className="learn-col-title" style={{ color: 'var(--success)' }}>
            <CheckCircle2 size={20} />
            <span>What the Data Actually Shows (Empirical Facts)</span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            Strictly verifiable mathematical observations from 10 years of NIFTY 50 daily bars:
          </p>
          <ul className="facts-list">
            {learnings.empiricalFacts.map((fact, idx) => (
              <li key={idx} className="fact-item">
                <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>•</span>
                <span>{fact}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 2: Inferences */}
        <div className="glass-card learn-col-inferences">
          <div className="learn-col-title" style={{ color: 'var(--font-accent)' }}>
            <Compass size={20} />
            <span>What We Can Reasonably Conclude (System Beliefs)</span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            Contextual interpretation, theoretical considerations, and market nuance:
          </p>
          <div>
            {learnings.reasonedConclusions.map((inf, idx) => (
              <div key={idx} className="inference-item">
                <div className="inference-title">{inf.title}</div>
                <div className="inference-desc">{inf.description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Critical Risks & Epistemic Biases Box */}
      <div className="risks-box">
        <div className="risks-header">
          <AlertTriangle size={18} />
          <span>What Could Go Wrong? (Risks, Biases, and Blindspots)</span>
        </div>
        <div className="risks-grid">
          {learnings.epistemicRisks.map((risk, idx) => (
            <div key={idx} className="risk-card">
              <div className="risk-name">{risk.risk}</div>
              <div className="risk-detail">{risk.assessment}</div>
            </div>
          ))}
        </div>
      </div>

      {/* What Should We Investigate Next? */}
      <div className="next-hypotheses-container">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={18} color="var(--accent-primary)" />
              What Should We Investigate Next?
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              True research is iterative. Select a follow-up hypothesis below to re-calibrate and test immediately:
            </p>
          </div>
          <button className="btn-secondary" onClick={onRestart}>
            <RotateCcw size={14} /> Start New Research
          </button>
        </div>

        <div className="next-grid">
          {learnings.nextHypotheses.map((hypo, idx) => (
            <div
              key={idx}
              className="next-card"
              onClick={() => onApplyNextHypothesis(hypo.appliedConfig)}
            >
              <div>
                <span className="next-badge">{hypo.tag}</span>
                <div className="next-title">{hypo.title}</div>
                <div className="next-prompt">“{hypo.prompt}”</div>
              </div>
              <div className="next-btn-text">
                <span>Test this hypothesis</span> <ArrowUpRight size={15} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
