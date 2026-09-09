import React, { useState, useEffect } from 'react';
import { Home, BarChart2, MoreHorizontal, Plus, ChevronDown } from 'lucide-react';
import StructuredMealLog from './components/StructuredMealLog';
import AnalysisResult from './components/AnalysisResult';
import UserProfile from './components/UserProfile';
import InsightsDashboard from './components/InsightsDashboard';
import OnboardingWizard from './components/OnboardingWizard';
import DiaryView from './components/DiaryView';
import MeasurementsView from './components/MeasurementsView';
import SleepView from './components/SleepView';

function App() {
  const [activeTab, setActiveTab] = useState('today');
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const hasCompleted = localStorage.getItem('hasCompletedOnboarding');
    if (!hasCompleted) {
      setShowOnboarding(true);
    }
    
    // Load profile for the dashboard
    fetch('http://localhost:8000/api/profile')
      .then(res => res.json())
      .then(data => setProfile(data))
      .catch(err => console.error(err));
  }, []);

  const handleOnboardingComplete = () => {
    localStorage.setItem('hasCompletedOnboarding', 'true');
    setShowOnboarding(false);
    // Reload profile
    fetch('http://localhost:8000/api/profile')
      .then(res => res.json())
      .then(data => setProfile(data));
  };

  const handleAnalyze = async (dailyLogs, daysLogged) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:8000/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ daily_logs: dailyLogs, days_logged: daysLogged }),
      });

      if (!response.ok) throw new Error('Failed to analyze diet.');
      const data = await response.json();
      setAnalysisResult(data);
      setActiveTab('analyze_result'); // move to result view
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: 0, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {showOnboarding && <OnboardingWizard onComplete={handleOnboardingComplete} />}
      
      {/* TOP APP BAR */}
      <header style={{ 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
        padding: '1.5rem', position: 'sticky', top: 0, 
        backgroundColor: 'var(--bg-dark)', zIndex: 10,
        borderBottom: '1px solid rgba(255,255,255,0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <h1 style={{ fontSize: '1.5rem', margin: 0 }}>Today</h1>
          <ChevronDown size={20} color="var(--text-secondary)" />
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
        {error && (
          <div className="glass-panel animate-fade-in" style={{ padding: '1.5rem', marginBottom: '2rem', border: '1px solid var(--danger)', background: 'rgba(239, 68, 68, 0.1)' }}>
            <p style={{ color: '#fca5a5', fontWeight: '500' }}>Error: {error}</p>
          </div>
        )}

        {activeTab === 'today' && <DiaryView profile={profile} onNavigate={setActiveTab} />}
        
        {activeTab === 'progress' && <InsightsDashboard />}
        
        {activeTab === 'more' && <UserProfile />}

        {activeTab === 'log' && (
          <StructuredMealLog onAnalyze={handleAnalyze} isLoading={isLoading} />
        )}

        {activeTab === 'analyze_result' && analysisResult && (
          <AnalysisResult result={analysisResult} onReset={() => setActiveTab('today')} />
        )}

        {activeTab === 'measurements' && <MeasurementsView profile={profile} onBack={() => setActiveTab('today')} />}
        
        {activeTab === 'sleep' && <SleepView onBack={() => setActiveTab('today')} />}
      </main>

      {/* BOTTOM NAVIGATION BAR */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        backgroundColor: '#1a1f2e', borderTop: '1px solid rgba(255,255,255,0.05)',
        display: 'flex', justifyContent: 'space-around', alignItems: 'center',
        padding: '0.75rem 1rem 1.5rem 1rem', zIndex: 100
      }}>
        <button 
          onClick={() => setActiveTab('today')}
          style={{ background: 'none', border: 'none', color: activeTab === 'today' ? 'white' : 'var(--text-secondary)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', cursor: 'pointer' }}
        >
          <Home size={24} />
          <span style={{ fontSize: '0.75rem' }}>Today</span>
        </button>
        
        <button 
          onClick={() => setActiveTab('progress')}
          style={{ background: 'none', border: 'none', color: activeTab === 'progress' ? 'white' : 'var(--text-secondary)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', cursor: 'pointer', marginRight: '2rem' }}
        >
          <BarChart2 size={24} />
          <span style={{ fontSize: '0.75rem' }}>Progress</span>
        </button>

        {/* Floating Action Button (FAB) */}
        <button 
          onClick={() => setActiveTab('log')}
          style={{
            position: 'absolute', top: '-24px', left: '50%', transform: 'translateX(-50%)',
            background: 'var(--accent-primary)', border: 'none', color: 'white',
            width: '56px', height: '56px', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)', cursor: 'pointer', zIndex: 101
          }}
        >
          <Plus size={32} />
        </button>
        
        <button 
          onClick={() => setActiveTab('more')}
          style={{ background: 'none', border: 'none', color: activeTab === 'more' ? 'white' : 'var(--text-secondary)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', cursor: 'pointer', marginLeft: '2rem' }}
        >
          <MoreHorizontal size={24} />
          <span style={{ fontSize: '0.75rem' }}>More</span>
        </button>
      </div>

    </div>
  );
}

export default App;
