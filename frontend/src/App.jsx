import React, { useState } from 'react';
import DietInputForm from './components/DietInputForm';
import AnalysisResult from './components/AnalysisResult';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);

  const handleAnalyze = async (dietText) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:8000/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ diet_text: dietText }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze diet. Please make sure the backend is running.');
      }

      const data = await response.json();
      setAnalysisResult(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setAnalysisResult(null);
    setError(null);
  };

  return (
    <div className="container">
      <header className="header animate-fade-in">
        <h1 className="text-gradient">AI Nutrition Planner</h1>
        <p style={{ fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
          Discover what nutrients you're missing from your weekly diet and get personalized, actionable supplement recommendations powered by AI.
        </p>
      </header>

      <main style={{ maxWidth: '800px', margin: '0 auto' }}>
        {error && (
          <div className="glass-panel animate-fade-in" style={{ padding: '1.5rem', marginBottom: '2rem', border: '1px solid var(--danger)', background: 'rgba(239, 68, 68, 0.1)' }}>
            <p style={{ color: '#fca5a5', fontWeight: '500' }}>Error: {error}</p>
          </div>
        )}

        {!analysisResult ? (
          <DietInputForm onAnalyze={handleAnalyze} isLoading={isLoading} />
        ) : (
          <AnalysisResult result={analysisResult} onReset={handleReset} />
        )}
      </main>
    </div>
  );
}

export default App;
