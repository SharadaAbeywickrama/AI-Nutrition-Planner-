import React, { useState } from 'react';
import { Plus, Minus, Droplets } from 'lucide-react';

/**
 * WaterTracker component — tracks cups of water drunk today.
 * Stores state in localStorage so it persists across refreshes.
 */
const WaterTracker = () => {
  const todayKey = `water_${new Date().toISOString().slice(0, 10)}`;
  const [cups, setCups] = useState(() => parseInt(localStorage.getItem(todayKey) || '0', 10));
  const GOAL = 8;

  const update = (delta) => {
    const next = Math.max(0, Math.min(16, cups + delta));
    setCups(next);
    localStorage.setItem(todayKey, String(next));
  };

  const pct = Math.min(cups / GOAL, 1);
  const messages = [
    'You must be thirsty! 🥵',
    'Good start, keep going!',
    'Making progress 💧',
    'Almost halfway there!',
    'Halfway to your goal!',
    'Great hydration! 💪',
    "Almost there, one more!",
    'Daily goal reached! 🎉',
    'Excellent hydration! ⭐'
  ];
  const msg = messages[Math.min(cups, messages.length - 1)];

  return (
    <div className="glass-panel" style={{ padding: '1.25rem', borderRadius: '16px', marginBottom: '0.75rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Droplets size={20} color="#3b82f6" />
          <span style={{ fontWeight: '600', fontSize: '1rem' }}>Water</span>
        </div>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{cups} / {GOAL} cups</span>
      </div>

      {/* Cup icons */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
        {Array.from({ length: GOAL }).map((_, i) => (
          <div key={i} style={{
            width: '28px', height: '28px', borderRadius: '6px',
            background: i < cups ? '#3b82f6' : 'rgba(255,255,255,0.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.9rem', transition: 'background 0.3s'
          }}>
            💧
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div style={{ height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', marginBottom: '0.75rem', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct * 100}%`, background: '#3b82f6', borderRadius: '3px', transition: 'width 0.4s ease' }} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{msg}</span>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={() => update(-1)} style={{
            background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: '8px',
            width: '32px', height: '32px', display: 'flex', alignItems: 'center',
            justifyContent: 'center', cursor: 'pointer', color: 'white'
          }}>
            <Minus size={16} />
          </button>
          <button onClick={() => update(1)} style={{
            background: '#3b82f6', border: 'none', borderRadius: '8px',
            width: '32px', height: '32px', display: 'flex', alignItems: 'center',
            justifyContent: 'center', cursor: 'pointer', color: 'white'
          }}>
            <Plus size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default WaterTracker;
