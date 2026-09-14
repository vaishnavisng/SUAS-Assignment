import React from 'react';
import { Search, Sparkles, ArrowRight, Lightbulb } from 'lucide-react';
import { PRESET_QUESTIONS } from '../engine/researchInterpreter';

export default function AskStep({ query, setQuery, onProceed }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onProceed(query);
    }
  };

  const handleSelectPreset = (preset) => {
    setQuery(preset.text);
    onProceed(preset.text);
  };

  return (
    <div className="animate-fade-in ask-hero">
      <div className="ask-badge">
        <Sparkles size={14} /> AI-Native Quantitative Research Engine
      </div>
      
      <h1>From Ambiguous Idea to Falsifiable Experiment</h1>
      <p>
        Enter any trading intuition or hypothesis. The platform demystifies ambiguity, tests against 10 years of NIFTY 50 data, and provides balanced empirical conclusions.
      </p>

      <form onSubmit={handleSubmit} className="query-input-container">
        <Search size={20} className="query-search-icon" />
        <input
          id="research-query-input"
          type="text"
          className="query-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. Does buying NIFTY after a sharp fall work?"
          autoFocus
        />
        <button id="btn-submit-query" type="submit" className="btn-primary">
          Investigate <ArrowRight size={16} />
        </button>
      </form>

      <div>
        <p className="preset-pills-label">
          <Lightbulb size={14} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '4px' }} />
          Or explore curated research hypotheses:
        </p>
        <div className="preset-pills-grid">
          {PRESET_QUESTIONS.map((preset) => (
            <div
              key={preset.id}
              className="preset-card"
              onClick={() => handleSelectPreset(preset)}
            >
              <div className="preset-tag">{preset.category}</div>
              <div className="preset-text">“{preset.text}”</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
