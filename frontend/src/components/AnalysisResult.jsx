import React from 'react';
import { Activity, Leaf, Pill, HeartPulse, RefreshCw, Moon, Zap } from 'lucide-react';

const AnalysisResult = ({ result, onReset }) => {
  if (!result || !result.analysis_result) return null;

  const { deficiencies, overall_summary, sleep_report, coaching, rag_foods_used } = result.analysis_result;
  const daysLogged = result.days_logged || 7;

  let badgeColor = 'var(--success)';
  let badgeBg = 'rgba(16, 185, 129, 0.1)';
  let badgeText = 'High Confidence (7/7 Days)';

  if (daysLogged >= 4 && daysLogged < 7) {
    badgeColor = 'var(--warning)';
    badgeBg = 'rgba(245, 158, 11, 0.1)';
    badgeText = `Partial Data (${daysLogged}/7 Days)`;
  } else if (daysLogged < 4) {
    badgeColor = 'var(--danger)';
    badgeBg = 'rgba(239, 68, 68, 0.1)';
    badgeText = `Low Confidence (${daysLogged}/7 Days)`;
  }

  const sleepRiskColor = {
    'Low': '#10b981',
    'Moderate': '#f59e0b',
    'High': '#ef4444',
    'Unknown': 'var(--text-secondary)',
  };

  return (
    <div className="animate-fade-in">

      {/* Confidence Badge + Multi-Agent Badge */}
      <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600', background: 'rgba(139, 92, 246, 0.15)', color: '#8b5cf6', border: '1px solid #8b5cf6' }}>
          🤖 Multi-Agent Analysis
        </span>
        <span style={{ display: 'inline-block', padding: '0.4rem 0.8rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '600', background: badgeBg, color: badgeColor, border: `1px solid ${badgeColor}` }}>
          {badgeText}
        </span>
      </div>

      {/* Week Totals */}
      {result.analysis_result?.aggregated_nutrients && (
        <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem', borderRadius: '16px' }}>
          <h4 style={{ margin: '0 0 1rem 0', color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Week Totals</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', textAlign: 'center' }}>
            {[['🔥','Calories','Calories','kcal'],['💪','Protein','Protein','g'],['🥑','Fat','Fat','g'],['🌾','Carbs','Carbs','g']].map(([icon,label,key,unit]) => (
              <div key={key}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{icon}</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{Math.round(result.analysis_result.aggregated_nutrients?.[key] || 0)}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{unit} {label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* RAG Foods Used */}
      {rag_foods_used && rag_foods_used.length > 0 && (
        <div style={{ marginBottom: '1.5rem', padding: '0.75rem 1rem', background: 'rgba(59,130,246,0.05)', borderRadius: '10px', border: '1px solid rgba(59,130,246,0.2)' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            📚 <strong style={{ color: '#3b82f6' }}>RAG Agent</strong> retrieved: {rag_foods_used.join(', ')}
          </span>
        </div>
      )}

      {/* Overall Summary */}
      <div className="glass-panel" style={{ padding: '2.5rem', marginBottom: '2rem', borderTop: '4px solid var(--accent-primary)' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <HeartPulse className="text-gradient" size={32} />
          Your Weekly Summary
        </h2>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>
          {overall_summary}
        </p>
      </div>

      {/* Deficiencies */}
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
                  {def.daily_avg && def.daily_target && (
                    <span style={{ marginLeft: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {def.daily_avg} / {def.daily_target}
                    </span>
                  )}
                </div>
              </div>

              <p style={{ marginBottom: '1.25rem', fontSize: '0.95rem' }}>{def.explanation}</p>

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
                  {def.food_sources && def.food_sources.map((food, fidx) => (
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

      {/* Sleep Report — from SleepAgent */}
      {sleep_report && (
        <div className="glass-panel" style={{ padding: '1.5rem', marginTop: '2rem', borderRadius: '16px', borderLeft: `4px solid ${sleepRiskColor[sleep_report.risk_level] || '#8b5cf6'}` }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <Moon size={24} color="#8b5cf6" /> Sleep Impact Report
            <span style={{ marginLeft: 'auto', padding: '0.25rem 0.75rem', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold', background: `${sleepRiskColor[sleep_report.risk_level]}22`, color: sleepRiskColor[sleep_report.risk_level] }}>
              {sleep_report.risk_level} Risk
            </span>
          </h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', fontSize: '0.95rem' }}>{sleep_report.summary}</p>
          {sleep_report.tips && sleep_report.tips.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {sleep_report.tips.map((tip, i) => (
                <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <span style={{ color: '#8b5cf6', fontWeight: 'bold', minWidth: '1.2rem' }}>{i + 1}.</span>
                  <span style={{ fontSize: '0.9rem' }}>{tip}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Coaching — from CoachAgent */}
      {coaching && (
        <div className="glass-panel" style={{ padding: '1.5rem', marginTop: '1.5rem', borderRadius: '16px', borderLeft: '4px solid #10b981', background: 'rgba(16, 185, 129, 0.04)' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <Zap size={24} color="#10b981" /> Your AI Coach Says
          </h3>
          <p style={{ fontSize: '1rem', marginBottom: '1.25rem', color: 'var(--text-primary)', lineHeight: 1.6 }}>{coaching.weekly_message}</p>
          {coaching.habit_nudges && coaching.habit_nudges.length > 0 && (
            <div style={{ marginBottom: '1rem' }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>This Week's Habit Nudges</p>
              {coaching.habit_nudges.map((nudge, i) => (
                <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', padding: '0.6rem 0', borderBottom: i < coaching.habit_nudges.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                  <span style={{ fontSize: '1rem' }}>✅</span>
                  <span style={{ fontSize: '0.9rem', lineHeight: 1.5 }}>{nudge}</span>
                </div>
              ))}
            </div>
          )}
          {coaching.encouragement && (
            <p style={{ fontSize: '0.95rem', color: '#10b981', fontStyle: 'italic', fontWeight: '500' }}>"{coaching.encouragement}"</p>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="no-print" style={{ marginTop: '3rem', textAlign: 'center', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button onClick={onReset} className="btn-primary" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)', border: '1px solid var(--glass-border)' }}>
          <RefreshCw size={18} />
          Analyze Another Week
        </button>
        <button onClick={() => { navigator.clipboard.writeText(result.analysis_result?.overall_summary || ''); alert('Summary copied!'); }} className="btn-primary" style={{ background: 'rgba(59,130,246,0.15)', color: '#3b82f6', border: '1px solid #3b82f6' }}>
          📋 Copy Summary
        </button>
        <button onClick={() => window.print()} className="btn-primary" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: '1px solid #10b981' }}>
          🖨️ Save as PDF
        </button>
      </div>

      <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid var(--warning)', borderRadius: '8px', textAlign: 'center' }}>
        <p style={{ color: 'var(--warning)', fontSize: '0.85rem' }}>
          <strong>Disclaimer:</strong> This information is generated by AI and is for educational/informational purposes only. It is not medical advice. Always consult a healthcare provider before starting any new supplement or major diet change.
        </p>
      </div>
    </div>
  );
};

export default AnalysisResult;
