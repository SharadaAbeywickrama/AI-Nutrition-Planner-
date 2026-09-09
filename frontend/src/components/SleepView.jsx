import React from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, ChevronDown, Info, BookOpen } from 'lucide-react';

const SleepView = ({ onBack, onNavigateLog }) => {
  return (
    <div className="animate-fade-in" style={{ paddingBottom: '100px', display: 'flex', flexDirection: 'column', height: '100%' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <ArrowLeft size={24} style={{ cursor: 'pointer' }} onClick={onBack} />
        <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Sleep</h2>
      </div>

      {/* Date Selector */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 1rem', marginBottom: '2rem' }}>
        <ChevronLeft size={20} color="var(--text-secondary)" cursor="pointer" />
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold' }}>
          Yesterday <ChevronDown size={16} />
        </div>
        <ChevronRight size={20} color="var(--text-secondary)" cursor="pointer" />
      </div>

      {/* Sleep Chart Area */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2rem', marginBottom: '3rem' }}>
        {/* Circle */}
        <div style={{ 
          width: '180px', height: '180px', borderRadius: '50%', 
          border: '12px solid rgba(255,255,255,0.05)', 
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
        }}>
          <span style={{ fontSize: '1.5rem', color: '#8b5cf6', marginBottom: '0.25rem' }}>🌙</span>
          <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>0h 0min</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Total Sleep <Info size={14} />
          </div>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
            <div style={{ width: '4px', height: '16px', background: '#ef4444', borderRadius: '2px', marginTop: '4px' }}></div>
            <div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Awake</div>
              <div style={{ fontWeight: 'bold' }}>N/A</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
            <div style={{ width: '4px', height: '16px', background: '#8b5cf6', borderRadius: '2px', marginTop: '4px' }}></div>
            <div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>REM</div>
              <div style={{ fontWeight: 'bold' }}>N/A</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
            <div style={{ width: '4px', height: '16px', background: '#3b82f6', borderRadius: '2px', marginTop: '4px' }}></div>
            <div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Light</div>
              <div style={{ fontWeight: 'bold' }}>N/A</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
            <div style={{ width: '4px', height: '16px', background: '#1e3a8a', borderRadius: '2px', marginTop: '4px' }}></div>
            <div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Deep</div>
              <div style={{ fontWeight: 'bold' }}>N/A</div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Sleep Insights */}
      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem', borderRadius: '12px' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>✨</span> AI Sleep & Diet Insights
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', borderLeft: '4px solid #10b981', borderRadius: '8px' }}>
            <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
              <strong style={{ color: '#10b981' }}>Positive Trend:</strong> When you eat high-protein dinners, your Deep Sleep increases by an average of 45 minutes.
            </p>
          </div>
          <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderLeft: '4px solid #ef4444', borderRadius: '8px' }}>
            <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
              <strong style={{ color: '#ef4444' }}>Watch out:</strong> Late-night snacks with high sugar content are correlating with a 20% drop in your REM sleep. Try a handful of nuts instead!
            </p>
          </div>
        </div>
      </div>

      {/* Log Meals Section */}
      <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
        <BookOpen size={32} color="var(--text-secondary)" style={{ marginBottom: '1rem' }} />
        <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Log meals for more insights</h3>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '2rem' }}>
          You'll see your daily diary here — and better understand how your food choices impact sleep levels.
        </p>
        <button 
          onClick={onNavigateLog}
          style={{ 
            background: 'transparent', color: '#3b82f6', border: '1px solid #3b82f6', 
            borderRadius: '24px', padding: '0.75rem 2rem', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer'
          }}>
          Add Food
        </button>
      </div>

    </div>
  );
};

export default SleepView;
