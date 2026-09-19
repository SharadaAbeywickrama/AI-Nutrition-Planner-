import React, { useState } from 'react';

const InsightsDashboard = ({ profile }) => {
  const [subTab, setSubTab] = useState('Overview');

  const dailyGoal = profile?.goal_weight_kg ? 1850 : 2000;
  const weeklyGoal = dailyGoal * 7;
  const netAverage = dailyGoal - 85; 
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
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>{(dailyGoal - 85).toLocaleString()} cal</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: '100px', gap: '0.5rem' }}>
              {['W', 'T', 'F', 'S', 'S', 'M', 'T'].map((day, i) => {
                const heightPercent = 60 + (i * 5) + (i % 2 === 0 ? 10 : -10);
                return (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '100%', height: `${heightPercent}%`, background: '#3b82f6', borderRadius: '4px' }} />
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>{day}</span>
                  </div>
                );
              })}
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
        <div className="animate-fade-in glass-panel" style={{ padding: '1.5rem', borderRadius: '16px' }}>
          {/* Header Row */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '2fr 1fr 1fr 1fr', 
            gap: '1rem', 
            marginBottom: '1rem', 
            color: 'var(--text-secondary)', 
            fontSize: '0.9rem',
            textAlign: 'right',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            paddingBottom: '0.75rem'
          }}>
            <span style={{ textAlign: 'left' }}>Nutrient</span>
            <span>Avg</span>
            <span>Goal</span>
            <span>Left</span>
          </div>

          {/* Data Rows */}
          {[
            { name: 'Protein', avg: `${proteinGoal - 5} g`, goal: `${proteinGoal} g`, left: '5 g', color: '#10b981' },
            { name: 'Carbohydrates', avg: `${carbsGoal - 12} g`, goal: `${carbsGoal} g`, left: '12 g', color: '#3b82f6' },
            { name: 'Fiber', avg: '22 g', goal: '30 g', left: '8 g', color: '#8b5cf6' },
            { name: 'Sugar', avg: '41 g', goal: '<50 g', left: '9 g', color: '#ef4444' },
            { name: 'Fat', avg: `${fatGoal - 4} g`, goal: `${fatGoal} g`, left: '4 g', color: '#f59e0b' }
          ].map((nut, i) => (
            <div key={i} style={{ 
              display: 'grid', 
              gridTemplateColumns: '2fr 1fr 1fr 1fr', 
              gap: '1rem', 
              borderBottom: i < 4 ? '1px solid rgba(255,255,255,0.05)' : 'none', 
              padding: '1rem 0',
              alignItems: 'center',
              textAlign: 'right'
            }}>
              <div style={{ textAlign: 'left', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: nut.color }}></span>
                {nut.name}
              </div>
              <div style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>{nut.avg}</div>
              <div style={{ color: 'var(--text-secondary)' }}>{nut.goal}</div>
              <div style={{ color: nut.color, fontWeight: '600' }}>{nut.left}</div>
            </div>
          ))}
        </div>
      )}

      {subTab === 'Macros' && (
        <div className="animate-fade-in">
          <h3 style={{ marginBottom: '1rem' }}>Macros</h3>
          {['Carbs', 'Fat', 'Protein'].map((macro, idx) => {
            const avgVal = idx === 0 ? (carbsGoal - 12) : (idx === 1 ? (fatGoal - 4) : (proteinGoal - 5));
            return (
              <div key={macro} className="glass-panel" style={{ padding: '1.5rem', borderRadius: '16px', marginBottom: '1rem' }}>
                <div style={{ color: idx === 0 ? '#3b82f6' : (idx === 1 ? '#8b5cf6' : '#10b981'), marginBottom: '0.5rem' }}>{macro}</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>7-day avg</div>
                <div style={{ fontWeight: 'bold', marginBottom: '1rem' }}>{avgVal}g</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: '60px', gap: '0.5rem' }}>
                  {['W', 'T', 'F', 'S', 'S', 'M', 'T'].map((day, i) => {
                    const heightPercent = 50 + (i * 6) + (i % 2 === 0 ? 15 : -15);
                    return (
                      <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: '100%', height: `${heightPercent}%`, background: idx === 0 ? '#3b82f6' : (idx === 1 ? '#8b5cf6' : '#10b981'), borderRadius: '4px' }} />
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Unlocked "Foods Highest In" Sections */}
          <div style={{ marginTop: '2rem' }}>
            {[
              { macro: 'Carbohydrates', color: '#3b82f6', foods: [{name: 'Kithul Roti', val: '45 g'}, {name: 'Kurakkan Roti', val: '42 g'}, {name: 'Red Rice (Samba)', val: '38 g'}] },
              { macro: 'Fat', color: '#8b5cf6', foods: [{name: 'Pol Sambol (Coconut)', val: '22 g'}, {name: 'Kukul Mas Curry (Chicken)', val: '18 g'}, {name: 'Parippu (Dhal with Coconut Milk)', val: '14 g'}] },
              { macro: 'Protein', color: '#10b981', foods: [{name: 'Kukul Mas Curry (Chicken)', val: '25 g'}, {name: 'Kakuluwo (Crab Curry)', val: '20 g'}, {name: 'Dhal Curry (Lentils)', val: '12 g'}] }
            ].map(({macro, color, foods}) => (
              <div key={`highest-${macro}`} className="glass-panel" style={{ padding: '1.5rem', borderRadius: '16px', marginBottom: '1rem', borderTop: `4px solid ${color}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Foods Highest in {macro}</h3>
                </div>
                
                {foods.map((food, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: i < 2 ? '0.75rem' : '0', paddingBottom: i < 2 ? '0.75rem' : '0', borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                    <span style={{ color: 'var(--text-primary)' }}>{i+1}. {food.name}</span>
                    <span style={{ color: color, fontWeight: 'bold' }}>{food.val}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default InsightsDashboard;
