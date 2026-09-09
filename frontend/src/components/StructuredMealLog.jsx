import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Send } from 'lucide-react';
import DailyDashboard from './DailyDashboard';

const StructuredMealLog = ({ onAnalyze, isLoading }) => {
  const [foodsDb, setFoodsDb] = useState([]);
  const [daysLogged, setDaysLogged] = useState(7);
  const [dailyLogs, setDailyLogs] = useState([
    { day: 'Monday', mood_trigger: '', foods: [], base_goal: 1500, exercise_cals: 0 }
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
    setDailyLogs([...dailyLogs, { day: nextDay, mood_trigger: '', foods: [], base_goal: 1500, exercise_cals: 0 }]);
  };

  const updateMood = (index, mood) => {
    const newLogs = [...dailyLogs];
    newLogs[index].mood_trigger = mood;
    setDailyLogs(newLogs);
  };

  const updateGoal = (index, val) => {
    const newLogs = [...dailyLogs];
    newLogs[index].base_goal = val;
    setDailyLogs(newLogs);
  };

  const updateExercise = (index, val) => {
    const newLogs = [...dailyLogs];
    newLogs[index].exercise_cals = val;
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
    <div className="animate-fade-in" style={{ padding: '0 1rem' }}>
      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h2 style={{ margin: '0 0 1rem 0' }}>Log Your Meals</h2>
        <p style={{ margin: '0 0 2rem 0', color: 'var(--text-secondary)' }}>
          Track your daily calories and macros. The AI will analyze your week and provide behavioral insights.
        </p>

        <div className="input-container">
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
      </div>

      <form onSubmit={handleSubmit}>
        {dailyLogs.map((log, dayIdx) => (
          <div key={dayIdx} style={{ background: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: '12px', marginBottom: '2rem', border: '1px solid var(--glass-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--accent-primary)' }}>{log.day}</h3>
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

            <DailyDashboard 
              dailyLog={log} 
              foodsDb={foodsDb} 
              onUpdateGoal={(val) => updateGoal(dayIdx, val)}
              onUpdateExercise={(val) => updateExercise(dayIdx, val)}
            />

            <div className="glass-panel" style={{ padding: '1.5rem', marginTop: '1.5rem' }}>
              <h4 style={{ margin: '0 0 1rem 0' }}>Foods Logged</h4>
              <div style={{ marginBottom: '1rem' }}>
                {log.foods.length === 0 && <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>No foods logged yet.</span>}
                {log.foods.map((foodItem, foodIdx) => (
                  <div key={foodIdx} style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem', padding: '0.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                    <span style={{ flex: 1, fontWeight: '500' }}>{foodItem.name}</span>
                    <input 
                      type="number" 
                      step="0.5"
                      min="0.5"
                      className="premium-input" 
                      style={{ minHeight: 'auto', padding: '0.5rem', width: '80px' }}
                      value={foodItem.quantity_multiplier}
                      onChange={(e) => updateQuantity(dayIdx, foodIdx, e.target.value)}
                    />
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', width: '60px' }}>servings</span>
                    <button type="button" onClick={() => removeFood(dayIdx, foodIdx)} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '0.5rem' }}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <select 
                  className="premium-input"
                  style={{ minHeight: 'auto', padding: '0.75rem', flex: 1 }}
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
          </div>
        ))}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem', paddingBottom: '4rem' }}>
          {dailyLogs.length < 7 && (
            <button type="button" onClick={addDay} className="btn-primary" style={{ background: 'transparent', border: '1px dashed var(--glass-border)', color: 'var(--text-primary)' }}>
              <Plus size={18} /> Add Another Day
            </button>
          )}
          
          <button type="submit" className="btn-primary" disabled={isLoading} style={{ marginLeft: 'auto', padding: '1rem 2rem', fontSize: '1.1rem' }}>
            <Send size={20} />
            {isLoading ? 'Analyzing with AI...' : 'Analyze My Week'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StructuredMealLog;
