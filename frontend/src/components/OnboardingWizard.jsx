import React, { useState, useEffect } from 'react';

const GOAL_OPTIONS = [
  "Lose weight",
  "Maintain weight",
  "Gain weight",
  "Gain muscle",
  "Modify my diet",
  "Manage stress",
  "Increase step count"
];

const OnboardingWizard = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [selectedGoals, setSelectedGoals] = useState([]);
  const [userName, setUserName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Try to fetch existing profile to get name
  useEffect(() => {
    fetch('http://localhost:8000/api/profile')
      .then(res => res.json())
      .then(data => {
        if (data && data.name) {
          setUserName(data.name);
        }
      })
      .catch(err => console.error("Could not fetch profile", err));
  }, []);

  const toggleGoal = (goal) => {
    if (selectedGoals.includes(goal)) {
      setSelectedGoals(selectedGoals.filter(g => g !== goal));
    } else {
      if (selectedGoals.length < 3) {
        setSelectedGoals([...selectedGoals, goal]);
      }
    }
  };

  const handleFinish = async () => {
    setIsSaving(true);
    try {
      // First, get the current profile to not overwrite other fields
      const res = await fetch('http://localhost:8000/api/profile');
      let currentProfile = {};
      if (res.ok) {
        currentProfile = await res.json();
      }

      // Update just the dietary_goal field
      currentProfile.dietary_goal = selectedGoals.join(', ');

      await fetch('http://localhost:8000/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentProfile)
      });
      
      onComplete();
    } catch (err) {
      console.error(err);
      onComplete(); // proceed anyway if backend fails
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'var(--bg-dark)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div className="glass-panel animate-fade-in" style={{ 
        maxWidth: '500px', 
        width: '100%', 
        padding: '2.5rem',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '400px'
      }}>
        
        {step === 1 && (
          <div className="animate-fade-in" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem', lineHeight: '1.3' }}>
              Great! You've just taken a big step on your journey.
            </h2>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '1.5rem' }}>
              Did you know that tracking your food is a scientifically proven method to being successful? It's called "self-monitoring" and the more consistent you are, the more likely you are to hit your goals.
            </p>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-primary)', fontWeight: '500', marginTop: 'auto', marginBottom: '2rem' }}>
              Now, let's talk about your goals.
            </p>
            <button 
              className="btn-primary" 
              style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', justifyContent: 'center' }}
              onClick={() => setStep(2)}
            >
              NEXT
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-in" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
              Thanks {userName ? userName : 'there'}! Now for your goals.
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Select up to 3 that are important to you, including one weight goal.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem', flex: 1, overflowY: 'auto' }}>
              {GOAL_OPTIONS.map(goal => {
                const isSelected = selectedGoals.includes(goal);
                return (
                  <button
                    key={goal}
                    onClick={() => toggleGoal(goal)}
                    style={{
                      padding: '1rem',
                      background: isSelected ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
                      border: isSelected ? '1px solid var(--success)' : '1px solid var(--glass-border)',
                      color: 'var(--text-primary)',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    {goal}
                  </button>
                )
              })}
            </div>

            <button 
              className="btn-primary" 
              style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', justifyContent: 'center', opacity: selectedGoals.length === 0 ? 0.5 : 1 }}
              disabled={selectedGoals.length === 0 || isSaving}
              onClick={handleFinish}
            >
              {isSaving ? 'Saving...' : 'NEXT'}
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default OnboardingWizard;
