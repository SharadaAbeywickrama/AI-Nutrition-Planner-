import React, { useState } from 'react';
import { ArrowLeft, Share2, Camera, Calendar, TrendingUp } from 'lucide-react';

const MeasurementsView = ({ profile, onBack }) => {
  const [activeTab, setActiveTab] = useState('Weight'); // 'Steps' or 'Weight'

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '100px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <ArrowLeft size={24} style={{ cursor: 'pointer' }} onClick={onBack} />
          <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Measurements</h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Share2 size={20} color="var(--text-secondary)" />
          {activeTab === 'Weight' && <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-secondary)', cursor: 'pointer' }}>+</span>}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.05)', marginBottom: '2rem' }}>
        <button 
          onClick={() => setActiveTab('Steps')}
          style={{ flex: 1, padding: '1rem', background: 'none', border: 'none', borderRight: '1px solid rgba(255,255,255,0.05)', color: activeTab === 'Steps' ? '#3b82f6' : 'var(--text-secondary)', fontWeight: activeTab === 'Steps' ? 'bold' : 'normal', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
        >
          <TrendingUp size={18} /> Steps
        </button>
        <button 
          onClick={() => setActiveTab('Weight')}
          style={{ flex: 1, padding: '1rem', background: 'none', border: 'none', color: activeTab === 'Weight' ? '#3b82f6' : 'var(--text-secondary)', fontWeight: activeTab === 'Weight' ? 'bold' : 'normal', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
        >
          {activeTab === 'Weight' ? 'Weight' : <Calendar size={18} />} {activeTab === 'Weight' ? '' : '1 Week'}
        </button>
      </div>

      {activeTab === 'Steps' && (
        <div className="animate-fade-in">
          <div style={{ height: '300px', display: 'flex', alignItems: 'center', position: 'relative' }}>
            <div style={{ width: '100%', borderBottom: '1px solid rgba(255,255,255,0.2)' }}></div>
          </div>
        </div>
      )}

      {activeTab === 'Weight' && (
        <div className="animate-fade-in">
          {/* Chart Area */}
          <div style={{ height: '250px', position: 'relative', marginBottom: '2rem' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, color: 'var(--text-secondary)', fontSize: '0.75rem' }}>151</div>
            <div style={{ position: 'absolute', top: '50%', left: 0, transform: 'translateY(-50%)', color: 'var(--text-secondary)', fontSize: '0.75rem' }}>150</div>
            <div style={{ position: 'absolute', bottom: '20px', left: 0, color: 'var(--text-secondary)', fontSize: '0.75rem' }}>149</div>
            
            {/* Grid lines */}
            <div style={{ width: '100%', borderBottom: '1px solid rgba(255,255,255,0.05)', position: 'absolute', top: '0', left: '20px' }}></div>
            <div style={{ width: '100%', borderBottom: '1px solid rgba(255,255,255,0.05)', position: 'absolute', top: '50%', left: '20px' }}></div>
            <div style={{ width: '100%', borderBottom: '1px solid rgba(255,255,255,0.5)', position: 'absolute', bottom: '20px', left: '20px' }}></div>

            {/* The Line */}
            <div style={{ width: '90%', borderBottom: '2px solid #10b981', position: 'absolute', top: '50%', left: '20px' }}></div>

            {/* X Axis */}
            <div style={{ display: 'flex', justifyContent: 'space-between', position: 'absolute', bottom: 0, left: '20px', right: 0 }}>
              {['02/09', '04/09', '06/09', '08/09', '10/09', '12/09'].map(d => (
                <span key={d} style={{ color: 'var(--text-secondary)', fontSize: '0.7rem' }}>{d}</span>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Entries</h3>
            <Share2 size={20} color="var(--text-secondary)" />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <div>
              <div style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>Tuesday, 08 Sept 2026</div>
              <div style={{ color: 'var(--text-secondary)' }}>{profile?.weight_kg ? Math.round(profile.weight_kg * 2.20462) : 150} lbs</div>
            </div>
            <Camera size={24} color="var(--text-secondary)" />
          </div>
        </div>
      )}

    </div>
  );
};

export default MeasurementsView;
