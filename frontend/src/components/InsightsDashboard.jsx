import React, { useState } from 'react';

const InsightsDashboard = ({ profile }) => {
  const [subTab, setSubTab] = useState('Overview');

  const dailyGoal = profile?.goal_weight_kg ? 1850 : 2000;
  const weeklyGoal = dailyGoal * 7;
  const netAverage = 0; 
  const underWeeklyGoal = weeklyGoal - (netAverage * 7);

  // Dynamic Macro Targets (50% Carbs, 30% Fat, 20% Protein)
  const proteinGoal = Math.round((dailyGoal * 0.20) / 4);
  const carbsGoal = Math.round((dailyGoal * 0.50) / 4);
  const fatGoal = Math.round((dailyGoal * 0.30) / 9);
  const currentWeightLbs = profile?.weight_kg ? Math.round(profile.weight_kg * 2.20462) : 150;
  const startWeightLbs = currentWeightLbs + 5; // Mock starting weight for demonstration

  const SubNav = () => (
    <div style={{ display: 'flex', gap: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
      {['Overview', 'Calories', 'Nutrients', 'Macros'].map(tab => (
        <button 
          key={tab} 
          onClick={() => setSubTab(tab)}
          style={{ 
            background: 'none', border: 'none', color: subTab === tab ? 'white' : 'var(--text-secondary)',
            fontWeight: subTab === tab ? 'bold' : 'normal', borderBottom: subTab === tab ? '2px solid white' : 'none',
            paddingBottom: '0.25rem', cursor: 'pointer', whiteSpace: 'nowrap'
          }}
        >
          {tab}
        </button>
      ))}
    </div>
  );

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '100px' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.75rem', margin: 0 }}>Progress</h2>
        <button style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>📄</button>
      </div>

      <SubNav />

      {subTab === 'Overview' && (
        <div className="animate-fade-in">
          {/* Calories Chart */}
          <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '16px', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Calories</span>
              <span style={{ color: 'var(--text-secondary)' }}>&gt;</span>
            </div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>7-day avg</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>0 cal</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: '100px', gap: '0.5rem' }}>
              {['W', 'T', 'F', 'S', 'S', 'M', 'T'].map((day, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '100%', flex: 1, background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }} />
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>{day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Weight */}
          <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '16px', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Weight</span>
              <span style={{ color: 'var(--text-secondary)' }}>&gt;</span>
            </div>
            <div style={{ display: 'flex', gap: '2rem' }}>
              <div style={{ flex: 1 }}>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Start</div>
                <div style={{ fontWeight: 'bold', marginBottom: '1rem' }}>{startWeightLbs} lbs</div>
                
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Current (Today)</div>
                <div style={{ fontWeight: 'bold', marginBottom: '1rem' }}>{currentWeightLbs} lbs</div>
                
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Change</div>
                <div style={{ fontWeight: 'bold' }}>{currentWeightLbs - startWeightLbs} lbs</div>
              </div>
              <div style={{ flex: 2, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', position: 'relative', height: '30px' }}>
                  <span style={{ position: 'absolute', top: '-10px', left: 0, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{startWeightLbs + 5}</span>
                </div>
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', position: 'relative', height: '30px' }}>
                  <span style={{ position: 'absolute', top: '-10px', left: 0, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{startWeightLbs}</span>
                </div>
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', position: 'relative', height: '30px', display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}>
                  <span style={{ position: 'absolute', top: '-10px', left: 0, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{currentWeightLbs}</span>
                  <div style={{ width: '12px', height: '12px', border: '3px solid var(--success)', borderRadius: '50%', background: 'var(--bg-dark)', marginTop: '-6px' }} />
                </div>
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', position: 'relative', height: '30px' }}>
                  <span style={{ position: 'absolute', top: '-10px', left: 0, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{currentWeightLbs - 5}</span>
                </div>
                <div style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.75rem' }}>Today</div>
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <span style={{ color: '#3b82f6', fontWeight: 'bold', cursor: 'pointer' }}>Manage my goals</span>
          </div>
        </div>
      )}

      {subTab === 'Calories' && (
        <div className="animate-fade-in">
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', overflow: 'hidden' }}>
              <button style={{ padding: '0.5rem 1.5rem', background: 'transparent', border: 'none', color: 'var(--text-secondary)' }}>Total</button>
              <button style={{ padding: '0.5rem 1.5rem', background: '#3b82f6', border: 'none', color: 'white', fontWeight: 'bold' }}>Net</button>
            </div>
          </div>
          
          <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Net Calories Under Weekly Goal</span>
              <span style={{ fontWeight: 'bold' }}>{underWeeklyGoal.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Net Average</span>
              <span style={{ fontWeight: 'bold' }}>{netAverage.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Goal</span>
              <span style={{ color: '#3b82f6', fontWeight: 'bold' }}>{dailyGoal.toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}

      {subTab === 'Nutrients' && (
        <div className="animate-fade-in">
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '2rem', marginBottom: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            <span>Avg</span>
            <span>Goal</span>
            <span>Left</span>
          </div>

          {[
            { name: 'Protein', goal: `${proteinGoal} g`, left: `${proteinGoal} g` },
            { name: 'Carbohydrates', goal: `${carbsGoal} g`, left: `${carbsGoal} g` },
            { name: 'Fiber', goal: '30 g', left: '30 g' },
            { name: 'Sugar', goal: '<50 g', left: '50 g' },
            { name: 'Fat', goal: `${fatGoal} g`, left: `${fatGoal} g` }
          ].map((nut, i) => (
            <div key={i} style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '1rem 0' }}>
              <div style={{ flex: 1, fontWeight: '500' }}>{nut.name}</div>
              <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', gap: '2rem', color: 'var(--text-secondary)' }}>
                <span>0</span>
                <span>{nut.goal}</span>
                <span>{nut.left}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {subTab === 'Macros' && (
        <div className="animate-fade-in">
          <h3 style={{ marginBottom: '1rem' }}>Macros</h3>
          {['Carbs', 'Fat', 'Protein'].map((macro, idx) => (
            <div key={macro} className="glass-panel" style={{ padding: '1.5rem', borderRadius: '16px', marginBottom: '1rem' }}>
              <div style={{ color: idx === 0 ? '#3b82f6' : (idx === 1 ? '#8b5cf6' : '#10b981'), marginBottom: '0.5rem' }}>{macro}</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>7-day avg</div>
              <div style={{ fontWeight: 'bold', marginBottom: '1rem' }}>0g</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: '60px', gap: '0.5rem' }}>
                {['W', 'T', 'F', 'S', 'S', 'M', 'T'].map((day, i) => (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '100%', flex: 1, background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }} />
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Premium "Foods Highest In" Sections */}
          <div style={{ marginTop: '2rem' }}>
            {['Carbohydrates', 'Fat', 'Protein'].map((macro) => (
              <div key={`highest-${macro}`} className="glass-panel" style={{ padding: '1.5rem', borderRadius: '16px', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Foods Highest in {macro}</h3>
                  <span style={{ color: '#fbbf24' }}>👑</span>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', paddingBottom: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <span>Rice Bowl (example)</span>
                  <span style={{ color: 'var(--text-secondary)' }}>43 g</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                  <span>Tomato Soup (example)</span>
                  <span style={{ color: 'var(--text-secondary)' }}>30 g</span>
                </div>

                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem', lineHeight: '1.4' }}>
                  Go Premium to see which of the foods you've logged rank highest in {macro}
                </p>

                <button style={{ 
                  width: '100%', padding: '1rem', background: '#3b82f6', color: 'white', 
                  border: 'none', borderRadius: '24px', fontWeight: 'bold', 
                  display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' 
                }}>
                  <span style={{ color: '#fbbf24' }}>👑</span> Analyze My Foods
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default InsightsDashboard;
