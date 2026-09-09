import React, { useState, useEffect } from 'react';
import StructuredMealLog from './components/StructuredMealLog';
import AnalysisResult from './components/AnalysisResult';
import UserProfile from './components/UserProfile';
import InsightsDashboard from './components/InsightsDashboard';
import OnboardingWizard from './components/OnboardingWizard';

function App() {
  const [activeTab, setActiveTab] = useState('analyze');
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const hasCompleted = localStorage.getItem('hasCompletedOnboarding');
    if (!hasCompleted) {
      setShowOnboarding(true);
    }
  }, []);

  const handleOnboardingComplete = () => {
    localStorage.setItem('hasCompletedOnboarding', 'true');
    setShowOnboarding(false);
  };

  const handleAnalyze = async (dailyLogs, daysLogged) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:8000/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ daily_logs: dailyLogs, days_logged: daysLogged }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze diet. Please make sure the backend is running and API key is set.');
      }

      const data = await response.json();
      setAnalysisResult(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setAnalysisResult(null);
    setError(null);
  };

  return (
    <div className="container">
      {showOnboarding && <OnboardingWizard onComplete={handleOnboardingComplete} />}
      <header className="header animate-fade-in" style={{ paddingBottom: '2rem' }}>
        <h1 className="text-gradient">AI Nutrition Planner</h1>
        <p style={{ fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto', marginBottom: '2rem' }}>
          Discover what nutrients you're missing from your weekly diet and get personalized, actionable supplement recommendations powered by AI.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <button onClick={() => setActiveTab('analyze')} className="btn-primary" style={{ background: activeTab === 'analyze' ? '' : 'rgba(255,255,255,0.05)', color: 'white', border: activeTab === 'analyze' ? '' : '1px solid var(--glass-border)' }}>Analyze</button>
          <button onClick={() => setActiveTab('profile')} className="btn-primary" style={{ background: activeTab === 'profile' ? '' : 'rgba(255,255,255,0.05)', color: 'white', border: activeTab === 'profile' ? '' : '1px solid var(--glass-border)' }}>Profile</button>
          <button onClick={() => setActiveTab('dashboard')} className="btn-primary" style={{ background: activeTab === 'dashboard' ? '' : 'rgba(255,255,255,0.05)', color: 'white', border: activeTab === 'dashboard' ? '' : '1px solid var(--glass-border)' }}>Dashboard</button>
        </div>
      </header>

      <main style={{ maxWidth: '800px', margin: '0 auto' }}>
        {error && (
          <div className="glass-panel animate-fade-in" style={{ padding: '1.5rem', marginBottom: '2rem', border: '1px solid var(--danger)', background: 'rgba(239, 68, 68, 0.1)' }}>
            <p style={{ color: '#fca5a5', fontWeight: '500' }}>Error: {error}</p>
          </div>
        )}

        {activeTab === 'analyze' && (
          !analysisResult ? (
            <StructuredMealLog onAnalyze={handleAnalyze} isLoading={isLoading} />
          ) : (
            <AnalysisResult result={analysisResult} onReset={handleReset} />
          )
        )}

        {activeTab === 'profile' && <UserProfile />}
        
        {activeTab === 'dashboard' && <InsightsDashboard />}
      </main>
    </div>
  );
}

export default App;
