import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { LineChart } from 'lucide-react';

const InsightsDashboard = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/history')
      .then(res => res.json())
      .then(data => setHistory(data))
      .catch(err => console.error(err));
  }, []);

  // Aggregate deficiencies
  const deficiencyCounts = {};
  history.forEach(record => {
    if (record.analysis_result && record.analysis_result.deficiencies) {
      record.analysis_result.deficiencies.forEach(def => {
        const name = def.nutrient;
        deficiencyCounts[name] = (deficiencyCounts[name] || 0) + 1;
      });
    }
  });

  const chartData = Object.keys(deficiencyCounts).map(key => ({
    name: key,
    count: deficiencyCounts[key]
  })).sort((a, b) => b.count - a.count);

  return (
    <div className="glass-panel animate-fade-in" style={{ padding: '2.5rem' }}>
      <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
        <LineChart className="text-gradient" size={28} />
        Insights Dashboard
      </h2>

      {history.length === 0 ? (
        <p>No history available yet. Log your diet to see insights!</p>
      ) : (
        <>
          <p style={{ marginBottom: '2rem' }}>You've logged {history.length} weeks of diet. Here are the nutrients you most frequently lack:</p>
          
          <div style={{ width: '100%', height: 300 }}>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="name" stroke="var(--text-secondary)" />
                  <YAxis stroke="var(--text-secondary)" allowDecimals={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--glass-border)' }}
                    itemStyle={{ color: 'var(--accent-primary)' }}
                  />
                  <Bar dataKey="count" fill="var(--accent-primary)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p>No deficiencies found in your history. Great job!</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default InsightsDashboard;
