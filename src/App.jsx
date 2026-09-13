import React, { useState } from 'react';
import Navbar from './components/Navbar';
import AskStep from './components/AskStep';
import ClarifyStep from './components/ClarifyStep';
import DefineStep from './components/DefineStep';
import TestStep from './components/TestStep';
import LearnStep from './components/LearnStep';
import { NIFTY_50_DAILY } from './data/niftyData';
import { runExperiment } from './engine/backtester';
import { parseQuestion } from './engine/researchInterpreter';

export default function App() {
  const [currentStep, setCurrentStep] = useState('ask');
  const [query, setQuery] = useState('Does buying NIFTY after a sharp fall work?');
  const [parsed, setParsed] = useState(() => parseQuestion('Does buying NIFTY after a sharp fall work?'));
  const [config, setConfig] = useState(() => parsed.matchedPreset.defaultConfig);
  const [results, setResults] = useState(null);

  // Tracks maximum step unlocked
  const [maxStepReached, setMaxStepReached] = useState('ask');

  const stepOrder = ['ask', 'clarify', 'define', 'test', 'learn'];

  const canNavigateTo = (stepId) => {
    const targetIdx = stepOrder.indexOf(stepId);
    const maxIdx = stepOrder.indexOf(maxStepReached);
    return targetIdx <= maxIdx;
  };

  const updateMaxStep = (newStep) => {
    const newIdx = stepOrder.indexOf(newStep);
    const maxIdx = stepOrder.indexOf(maxStepReached);
    if (newIdx > maxIdx) {
      setMaxStepReached(newStep);
    }
  };

  // 1. From Ask to Clarify
  const handleQuerySubmit = (newQuery) => {
    const parsedData = parseQuestion(newQuery);
    setParsed(parsedData);
    setConfig(parsedData.matchedPreset.defaultConfig);
    setCurrentStep('clarify');
    updateMaxStep('clarify');
  };

  // 2. From Clarify to Define
  const handleProceedToDefine = () => {
    setCurrentStep('define');
    updateMaxStep('define');
  };

  // 3. From Define to Test (Executes Backtest)
  const handleRunTest = () => {
    const testResults = runExperiment(NIFTY_50_DAILY, config);
    setResults(testResults);
    setCurrentStep('test');
    updateMaxStep('test');
  };

  // 4. From Test to Learn
  const handleProceedToLearn = () => {
    setCurrentStep('learn');
    updateMaxStep('learn');
  };

  // 5. From Learn: Apply Next Hypothesis
  const handleApplyNextHypothesis = (newConfig) => {
    setConfig(newConfig);
    const newResults = runExperiment(NIFTY_50_DAILY, newConfig);
    setResults(newResults);
    // Jump straight to test or define to see new results
    setCurrentStep('test');
  };

  // Restart flow
  const handleRestart = () => {
    setCurrentStep('ask');
  };

  return (
    <div className="app-container">
      <Navbar
        currentStep={currentStep}
        setStep={setCurrentStep}
        canNavigateTo={canNavigateTo}
      />

      <main>
        {currentStep === 'ask' && (
          <AskStep
            query={query}
            setQuery={setQuery}
            onProceed={handleQuerySubmit}
          />
        )}

        {currentStep === 'clarify' && (
          <ClarifyStep
            parsed={parsed}
            config={config}
            setConfig={setConfig}
            onProceed={handleProceedToDefine}
            onBack={() => setCurrentStep('ask')}
          />
        )}

        {currentStep === 'define' && (
          <DefineStep
            parsed={parsed}
            config={config}
            onRunTest={handleRunTest}
            onBack={() => setCurrentStep('clarify')}
          />
        )}

        {currentStep === 'test' && (
          <TestStep
            results={results}
            onProceed={handleProceedToLearn}
            onBack={() => setCurrentStep('define')}
          />
        )}

        {currentStep === 'learn' && (
          <LearnStep
            results={results}
            onApplyNextHypothesis={handleApplyNextHypothesis}
            onRestart={handleRestart}
          />
        )}
      </main>
    </div>
  );
}
