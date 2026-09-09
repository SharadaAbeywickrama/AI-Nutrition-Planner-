import React from 'react';
import { ArrowLeft } from 'lucide-react';

const SleepView = ({ onBack }) => {
  return (
    <div className="animate-fade-in" style={{ paddingBottom: '100px', display: 'flex', flexDirection: 'column', height: '100%' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <ArrowLeft size={24} style={{ cursor: 'pointer' }} onClick={onBack} />
        <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Sleep</h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', flex: 1 }}>
        <div style={{ background: '#3b82f6', color: 'white', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
          NEW
        </div>
        
        <h1 style={{ fontSize: '2.5rem', lineHeight: 1.2, marginBottom: '1rem' }}>
          See how food<br/>affects your sleep
        </h1>
        
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.5, marginBottom: '3rem', maxWidth: '300px' }}>
          Sleep and food insights together! Spot trends, adjust your routine, and rest well.
        </p>

        {/* Mock Graphic */}
        <div className="glass-panel" style={{ width: '100%', maxWidth: '350px', padding: '2rem', borderRadius: '24px', marginBottom: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '2rem' }}>
            <div style={{ width: '120px', height: '120px', borderRadius: '50%', border: '8px solid #4f46e5', borderTopColor: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
              <span style={{ fontSize: '2rem', color: 'white' }}>🌙</span>
              <span style={{ fontWeight: 'bold' }}>Sleep</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
              <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', display: 'flex' }}><div style={{ width: '60%', background: '#ef4444', borderRadius: '4px' }}></div></div>
              <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', display: 'flex' }}><div style={{ width: '80%', background: '#8b5cf6', borderRadius: '4px' }}></div></div>
              <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', display: 'flex' }}><div style={{ width: '40%', background: '#3b82f6', borderRadius: '4px' }}></div></div>
              <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', display: 'flex' }}><div style={{ width: '70%', background: '#10b981', borderRadius: '4px' }}></div></div>
            </div>
          </div>
          
          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Foods Logged</div>
              <div style={{ width: '100px', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', marginBottom: '0.25rem' }}></div>
              <div style={{ width: '150px', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px' }}></div>
            </div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>20:30</div>
          </div>
        </div>
      </div>

      <button style={{ 
        width: '100%', padding: '1rem', background: '#3b82f6', color: 'white', 
        border: 'none', borderRadius: '24px', fontWeight: 'bold', fontSize: '1.1rem',
        marginTop: '2rem'
      }}>
        Set Up Health Connect
      </button>
      <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '1rem' }}>
        Tap to sync your sleep data from Health Connect
      </p>

    </div>
  );
};

export default SleepView;
