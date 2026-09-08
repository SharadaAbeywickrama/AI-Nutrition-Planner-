import React, { useState } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

const DietInputForm = ({ onAnalyze, isLoading }) => {
  const [dietText, setDietText] = useState('');
  const [daysLogged, setDaysLogged] = useState(7);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (dietText.trim()) {
      onAnalyze(dietText, daysLogged);
    }
  };

  return (
    <div className="glass-panel animate-fade-in" style={{ padding: '2.5rem' }}>
      <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <Sparkles className="text-gradient" size={28} />
        Log Your Week
      </h2>
      <p style={{ marginBottom: '2rem' }}>
        Tell us everything you ate over the last 7 days. Don't worry about perfect formatting, our AI will understand natural language! For example: "I had eggs and bacon for breakfast on Monday, skipped lunch, and had a huge salad for dinner..."
      </p>

      <form onSubmit={handleSubmit}>
        <div className="input-container" style={{ marginBottom: '1rem' }}>
          <label className="input-label" htmlFor="daysLogged">How many days does this log cover?</label>
          <select 
            id="daysLogged" 
            className="premium-input" 
            style={{ minHeight: 'auto', padding: '0.75rem', width: '200px' }}
            value={daysLogged}
            onChange={(e) => setDaysLogged(parseInt(e.target.value))}
            disabled={isLoading}
          >
            {[1, 2, 3, 4, 5, 6, 7].map(num => (
              <option key={num} value={num}>{num} Day{num !== 1 ? 's' : ''}</option>
            ))}
          </select>
        </div>

        <div className="input-container">
          <label className="input-label" htmlFor="diet">What did you eat?</label>
          <textarea
            id="diet"
            className="premium-input"
            placeholder="E.g., Monday: 2 eggs, avocado toast, black coffee. Tuesday..."
            value={dietText}
            onChange={(e) => setDietText(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <button 
          type="submit" 
          className="btn-primary" 
          disabled={isLoading || !dietText.trim()}
          style={{ width: '100%', marginTop: '1rem' }}
        >
          {isLoading ? (
            <>
              <span className="loader"></span>
              Analyzing your diet...
            </>
          ) : (
            <>
              Generate Analysis
              <ArrowRight size={20} />
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default DietInputForm;
