import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Send } from 'lucide-react';

const StructuredMealLog = ({ onAnalyze, isLoading }) => {
  const [foodsDb, setFoodsDb] = useState([]);
  const [daysLogged, setDaysLogged] = useState(7);
  const [dailyLogs, setDailyLogs] = useState([
    { day: 'Monday', mood_trigger: '', foods: [] }
  ]);

  useEffect(() => {
    fetch('http://localhost:8000/api/foods')
      .then(res => res.json())
      .then(data => setFoodsDb(data))
      .catch(err => console.error(err));
  }, []);

  const addDay = () => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const nextDay = days[dailyLogs.length % 7];
    setDailyLogs([...dailyLogs, { day: nextDay, mood_trigger: '', foods: [] }]);
  };

  const updateMood = (index, mood) => {
    const newLogs = [...dailyLogs];
    newLogs[index].mood_trigger = mood;
    setDailyLogs(newLogs);
  };

  const addFoodToDay = (dayIndex, foodId) => {
    if (!foodId) return;
    const food = foodsDb.find(f => f.id === foodId);
    if (!food) return;

    const newLogs = [...dailyLogs];
    newLogs[dayIndex].foods.push({
      food_id: food.id,
      name: food.name,
      quantity_multiplier: 1.0
    });
    setDailyLogs(newLogs);
  };

  const updateQuantity = (dayIndex, foodIndex, qty) => {
    const newLogs = [...dailyLogs];
    newLogs[dayIndex].foods[foodIndex].quantity_multiplier = parseFloat(qty) || 1.0;
    setDailyLogs(newLogs);
  };

  const removeFood = (dayIndex, foodIndex) => {
    const newLogs = [...dailyLogs];
    newLogs[dayIndex].foods.splice(foodIndex, 1);
    setDailyLogs(newLogs);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (dailyLogs.some(log => log.foods.length > 0)) {
      onAnalyze(dailyLogs, daysLogged);
    } else {
      alert("Please add at least one food item.");
    }
  };

  return (
    <div className="glass-panel animate-fade-in" style={{ padding: '2rem' }}>
      <h2 style={{ marginBottom: '1.5rem' }}>Log Your Meals</h2>
      <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)' }}>
        Select foods from our verified database and log your mood to get behavioral insights.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="input-container" style={{ marginBottom: '2rem' }}>
          <label className="input-label">How many days does this report cover?</label>
          <select 
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

        {dailyLogs.map((log, dayIdx) => (
          <div key={dayIdx} style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid var(--glass-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0 }}>{log.day}</h3>
              <select 
                className="premium-input"
                style={{ minHeight: 'auto', padding: '0.5rem', width: '200px' }}
                value={log.mood_trigger}
                onChange={(e) => updateMood(dayIdx, e.target.value)}
              >
                <option value="">Mood / Trigger (Optional)</option>
                <option value="Stressed">Stressed</option>
                <option value="Happy/Social">Happy / Social</option>
                <option value="Bored">Bored</option>
                <option value="Tired">Tired</option>
              </select>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              {log.foods.map((foodItem, foodIdx) => (
                <div key={foodIdx} style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                  <span style={{ flex: 1 }}>{foodItem.name}</span>
                  <input 
                    type="number" 
                    step="0.5"
                    min="0.5"
                    className="premium-input" 
                    style={{ minHeight: 'auto', padding: '0.5rem', width: '80px' }}
                    value={foodItem.quantity_multiplier}
                    onChange={(e) => updateQuantity(dayIdx, foodIdx, e.target.value)}
                  />
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>servings</span>
                  <button type="button" onClick={() => removeFood(dayIdx, foodIdx)} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}>
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <select 
                className="premium-input"
                style={{ minHeight: 'auto', padding: '0.5rem', flex: 1 }}
                onChange={(e) => {
                  addFoodToDay(dayIdx, e.target.value);
                  e.target.value = '';
                }}
                defaultValue=""
              >
                <option value="" disabled>+ Add Food</option>
                {foodsDb.map(f => (
                  <option key={f.id} value={f.id}>{f.name}</option>
                ))}
              </select>
            </div>
          </div>
        ))}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem' }}>
          {dailyLogs.length < 7 && (
            <button type="button" onClick={addDay} className="btn-primary" style={{ background: 'transparent', border: '1px dashed var(--glass-border)', color: 'var(--text-primary)' }}>
              <Plus size={18} /> Add Another Day
            </button>
          )}
          
          <button type="submit" className="btn-primary" disabled={isLoading} style={{ marginLeft: 'auto' }}>
            <Send size={18} />
            {isLoading ? 'Analyzing...' : 'Analyze My Week'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StructuredMealLog;
