import React, { useState } from 'react';
import { ChevronDown, Plus } from 'lucide-react';

const DiaryView = ({ profile }) => {
  return (
    <div className="animate-fade-in" style={{ paddingBottom: '100px' }}>
      
      {/* Date Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: i === 1 ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{day}</span>
            <div style={{ 
              width: '12px', height: '12px', borderRadius: '50%', 
              border: i === 1 ? '2px dashed var(--text-primary)' : '2px solid var(--glass-border)',
              background: 'transparent'
            }} />
          </div>
        ))}
      </div>

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
    </div>
  );
};

export default DiaryView;
