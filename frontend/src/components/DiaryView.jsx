import React, { useState } from 'react';
import { ChevronDown, Plus } from 'lucide-react';
import WaterTracker from './WaterTracker';
import MacroRing from './MacroRing';

const DiaryView = ({ profile, onNavigate = () => {} }) => {
  const today = new Date();
  const days = ['S','M','T','W','T','F','S'];
  const todayIdx = today.getDay();

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '100px' }}>
      
      {/* Date Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
        {days.map((day, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: i === todayIdx ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: i === todayIdx ? '700' : '400' }}>{day}</span>
            <div style={{ 
              width: '12px', height: '12px', borderRadius: '50%', 
              border: i === todayIdx ? '2px dashed var(--accent-primary)' : '2px solid var(--glass-border)',
              background: i === todayIdx ? 'rgba(59,130,246,0.2)' : 'transparent'
            }} />
          </div>
        ))}
      </div>
      <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '1.5rem' }}>
        {today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
      </p>

      {/* Calories Card */}
      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1rem', borderRadius: '16px' }}>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Calories</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1rem' }}>
          <div>
            <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>0</span> <span style={{ color: 'var(--text-secondary)' }}>cal</span>
            <span style={{ color: 'var(--text-secondary)', marginLeft: '0.5rem', fontSize: '0.9rem' }}>/ {profile?.goal_weight_kg ? 1850 : 2000}</span>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{profile?.goal_weight_kg ? 1850 : 2000}</span> <span style={{ color: 'var(--text-secondary)' }}>left</span>
          </div>
        </div>
        <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: '0%', background: 'var(--accent-primary)' }} />
        </div>
      </div>

      {/* Macros Card */}
      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem', borderRadius: '16px', display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ flex: 1, paddingRight: '1rem' }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Carbs</p>
          <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>0 g <span style={{ fontWeight: 'normal', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>/ 231</span></p>
          <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px' }}><div style={{ height: '100%', width: '0%', background: '#3b82f6' }}/></div>
        </div>
        <div style={{ flex: 1, padding: '0 0.5rem' }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Fat</p>
          <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>0 g <span style={{ fontWeight: 'normal', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>/ 62</span></p>
          <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px' }}><div style={{ height: '100%', width: '0%', background: '#8b5cf6' }}/></div>
        </div>
        <div style={{ flex: 1, paddingLeft: '1rem' }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Protein</p>
          <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>0 g <span style={{ fontWeight: 'normal', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>/ 93</span></p>
          <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px' }}><div style={{ height: '100%', width: '0%', background: '#10b981' }}/></div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '1.25rem' }}>Diary</h3>
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>View all</span>
      </div>

      {['Breakfast', 'Lunch', 'Dinner', 'Snacks'].map(meal => (
        <div key={meal} className="glass-panel" style={{ padding: '1.25rem', marginBottom: '0.75rem', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '24px', height: '24px', opacity: 0.5 }}>🍽️</div>
            <span style={{ fontSize: '1.1rem', fontWeight: '500' }}>{meal}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ color: 'var(--text-secondary)', letterSpacing: '2px' }}>•••</span>
            <button style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#3b82f6', border: 'none', padding: '0.5rem 1rem', borderRadius: '20px', fontWeight: 'bold', cursor: 'pointer' }}>Log</button>
          </div>
        </div>
      ))}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', marginTop: '1.5rem' }}>
        <h3 style={{ fontSize: '1.25rem' }}>Healthy habits</h3>
      </div>
      <WaterTracker />

      <div className="glass-panel" style={{ borderRadius: '12px', overflow: 'hidden', marginBottom: '1.5rem' }}>
        <div style={{ padding: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }} onClick={() => onNavigate('sleep')}>
          <div>
            <div style={{ fontSize: '1.1rem', fontWeight: '500', marginBottom: '0.25rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>Sleep <span style={{ background: '#3b82f6', color: 'white', padding: '0.1rem 0.4rem', borderRadius: '4px', fontSize: '0.6rem' }}>NEW</span></div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Track food impact on sleep</div>
          </div>
          <div style={{ color: 'var(--text-secondary)' }}>&gt;</div>
        </div>
        <div style={{ padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }} onClick={() => onNavigate('measurements')}>
          <div>
            <div style={{ fontSize: '1.1rem', fontWeight: '500', marginBottom: '0.25rem' }}>Steps</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Connect a device</div>
          </div>
          <div style={{ color: 'var(--text-secondary)' }}>&gt;</div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '1.25rem' }}>Weight</h3>
      </div>
      <div className="glass-panel" style={{ padding: '1.25rem', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', cursor: 'pointer' }} onClick={() => onNavigate('measurements')}>
        <div>
          <div style={{ fontSize: '1.1rem', fontWeight: '500', marginBottom: '0.25rem' }}>{profile?.weight_kg ? Math.round(profile.weight_kg * 2.20462) : 150} lbs</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Logged today</div>
        </div>
        <div style={{ color: 'var(--text-secondary)' }}>&gt;</div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '1.25rem' }}>Notes</h3>
      </div>
      <div className="glass-panel" style={{ padding: '1.25rem', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div style={{ color: 'var(--text-secondary)' }}>Add a note</div>
        <div style={{ color: 'var(--text-secondary)' }}>✏️</div>
      </div>
    </div>
  );
};

export default DiaryView;
