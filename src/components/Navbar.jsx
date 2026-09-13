import React from 'react';
import { Compass, CheckCircle2, ChevronRight, Activity } from 'lucide-react';

export default function Navbar({ currentStep, setStep, canNavigateTo }) {
  const steps = [
    { id: 'ask', label: '1. Ask' },
    { id: 'clarify', label: '2. Clarify' },
    { id: 'define', label: '3. Define' },
    { id: 'test', label: '4. Test' },
    { id: 'learn', label: '5. Learn' }
  ];

  return (
    <header className="navbar">
      <div className="nav-brand">
        <div className="nav-logo-icon">
          <Activity size={20} />
        </div>
        <div>
          <span className="brand-title">NIFTY AlphaLab</span>
        </div>
        <span className="brand-badge">Research Platform</span>
      </div>

      <nav className="stepper-nav" aria-label="Research workflow steps">
        {steps.map((s, idx) => {
          const isActive = currentStep === s.id;
          const isEnabled = canNavigateTo(s.id);
          const isCompleted = steps.findIndex(x => x.id === currentStep) > idx;

          return (
            <React.Fragment key={s.id}>
              {idx > 0 && <span className="step-divider"><ChevronRight size={14} /></span>}
              <button
                id={`nav-step-${s.id}`}
                className={`step-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                onClick={() => isEnabled && setStep(s.id)}
                disabled={!isEnabled}
                title={isEnabled ? `Go to ${s.label}` : 'Complete prior steps first'}
              >
                {isCompleted && <CheckCircle2 size={13} />}
                <span>{s.label}</span>
              </button>
            </React.Fragment>
          );
        })}
      </nav>
    </header>
  );
}
