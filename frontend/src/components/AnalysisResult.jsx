import React from 'react';
import { Activity, Leaf, Pill, HeartPulse, RefreshCw } from 'lucide-react';

const AnalysisResult = ({ result, onReset }) => {
  if (!result || !result.analysis_result) return null;

  const { deficiencies, overall_summary } = result.analysis_result;

  return (
    <div className="animate-fade-in">
      <div className="glass-panel" style={{ padding: '2.5rem', marginBottom: '2rem', borderTop: '4px solid var(--accent-primary)' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <HeartPulse className="text-gradient" size={32} />
          Your Weekly Summary
        </h2>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>
          {overall_summary}
        </p>
      </div>

      <h3 style={{ marginBottom: '1.5rem' }}>
        <Activity size={24} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'text-bottom', color: 'var(--accent-secondary)' }}/>
        Nutrients to Focus On
      </h3>
      
      {deficiencies && deficiencies.length > 0 ? (
        <div className="content-grid two-cols">
          {deficiencies.map((def, idx) => (
            <div key={idx} className="deficiency-card animate-fade-in" style={{ animationDelay: `${idx * 0.1}s` }}>
              <div className="card-header">
                <div className="card-icon">
                  <Activity size={24} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1.2rem', fontWeight: '600' }}>{def.nutrient}</h4>
                  <span className="pill">Deficient</span>
                </div>
              </div>
              
              <p style={{ marginBottom: '1.25rem', fontSize: '0.95rem' }}>
                {def.explanation}
              </p>
              
              <div style={{ marginBottom: '1rem' }}>
                <strong style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                  <Pill size={16} color="var(--accent-tertiary)" />
                  Recommended Supplement:
                </strong>
                <p style={{ color: 'var(--accent-tertiary)', fontWeight: '500' }}>{def.recommended_supplement}</p>
              </div>

              <div>
                <strong style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                  <Leaf size={16} color="var(--success)" />
                  Natural Food Sources:
                </strong>
                <div>
                  {def.food_sources.map((food, fidx) => (
                    <span key={fidx} className="food-tag">{food}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
          <p style={{ fontSize: '1.1rem', color: 'var(--success)' }}>Great job! Your diet looks well-balanced based on this input.</p>
        </div>
      )}

      <div style={{ marginTop: '3rem', textAlign: 'center' }}>
        <button onClick={onReset} className="btn-primary" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)', border: '1px solid var(--glass-border)' }}>
          <RefreshCw size={18} />
          Analyze Another Week
        </button>
      </div>
    </div>
  );
};

export default AnalysisResult;
