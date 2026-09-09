import React, { useState } from 'react';
import { Target, Utensils, Flame, Activity } from 'lucide-react';

// Reusable SVG Ring Component
const ProgressRing = ({ radius, stroke, progress, color, children }) => {
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  // Progress is a percentage (0 to 100)
  const strokeDashoffset = circumference - (Math.min(progress, 100) / 100) * circumference;

  return (
    <div style={{ position: 'relative', width: radius * 2, height: radius * 2 }}>
      <svg height={radius * 2} width={radius * 2}>
        <circle
          stroke="rgba(255,255,255,0.1)"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke={color}
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.5s ease-in-out' }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          transform={`rotate(-90 ${radius} ${radius})`}
        />
      </svg>
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center'
      }}>
        {children}
      </div>
    </div>
  );
};

const DailyDashboard = ({ dailyLog, foodsDb, onUpdateExercise, onUpdateGoal }) => {
  // Calculate daily totals from selected foods
  let totalFoodCals = 0;
  let totalProtein = 0;
  let totalFat = 0;
  let totalCarbs = 0;

  if (dailyLog && dailyLog.foods) {
    dailyLog.foods.forEach(item => {
      const dbFood = foodsDb.find(f => f.id === item.food_id);
      if (dbFood && dbFood.nutrients) {
        const qty = item.quantity_multiplier || 1;
        totalFoodCals += (dbFood.nutrients.Calories || 0) * qty;
        totalProtein += (dbFood.nutrients.Protein || 0) * qty;
        totalFat += (dbFood.nutrients.Fat || 0) * qty;
        totalCarbs += (dbFood.nutrients.Carbs || 0) * qty;
      }
    });
  }

  // State for goals (could be lifted up to App state, but keeping local to dashboard for now)
  const baseGoal = dailyLog?.base_goal || 1500;
  const exercise = dailyLog?.exercise_cals || 0;
  
  const remainingCals = Math.max(0, baseGoal - totalFoodCals + exercise);
  const calsProgress = Math.min((totalFoodCals / (baseGoal + exercise)) * 100, 100) || 0;

  // Hardcoded macro goals for simplicity (could also be dynamic)
  const proteinGoal = Math.round((baseGoal * 0.3) / 4); // 30% cals from protein
  const fatGoal = Math.round((baseGoal * 0.3) / 9); // 30% cals from fat
  const carbsGoal = Math.round((baseGoal * 0.4) / 4); // 40% cals from carbs

  return (
    <div style={{ marginBottom: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
      
      {/* Calories Card */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <h3 style={{ margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Activity size={20} className="text-gradient" /> Calories
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          Remaining = Goal - Food + Exercise
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <ProgressRing radius={70} stroke={10} progress={calsProgress} color="var(--accent-primary)">
            <span style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>{Math.round(remainingCals)}</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Remaining</span>
          </ProgressRing>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Target size={16} color="var(--text-secondary)" />
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block' }}>Base Goal</span>
                <input 
                  type="number" 
                  value={baseGoal} 
                  onChange={(e) => onUpdateGoal(parseInt(e.target.value) || 0)}
                  className="premium-input" 
                  style={{ padding: '0.2rem 0.5rem', minHeight: 'auto', width: '80px', marginTop: '0.2rem' }}
                />
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Utensils size={16} color="var(--warning)" />
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block' }}>Food</span>
                <span style={{ fontWeight: 'bold' }}>{Math.round(totalFoodCals)}</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Flame size={16} color="var(--danger)" />
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block' }}>Exercise</span>
                <input 
                  type="number" 
                  value={exercise} 
                  onChange={(e) => onUpdateExercise(parseInt(e.target.value) || 0)}
                  className="premium-input" 
                  style={{ padding: '0.2rem 0.5rem', minHeight: 'auto', width: '80px', marginTop: '0.2rem' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Macros Card */}
      <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <h3 style={{ margin: '0 0 1.5rem 0' }}>Macronutrients</h3>
        
        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
          
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>Protein</span>
            <ProgressRing radius={40} stroke={6} progress={(totalProtein / proteinGoal) * 100} color="var(--success)">
              <span style={{ fontWeight: 'bold' }}>{Math.round(totalProtein)}g</span>
            </ProgressRing>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginTop: '0.5rem' }}>/ {proteinGoal}g</span>
          </div>

          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>Fat</span>
            <ProgressRing radius={40} stroke={6} progress={(totalFat / fatGoal) * 100} color="var(--warning)">
              <span style={{ fontWeight: 'bold' }}>{Math.round(totalFat)}g</span>
            </ProgressRing>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginTop: '0.5rem' }}>/ {fatGoal}g</span>
          </div>

          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>Carbs</span>
            <ProgressRing radius={40} stroke={6} progress={(totalCarbs / carbsGoal) * 100} color="var(--accent-primary)">
              <span style={{ fontWeight: 'bold' }}>{Math.round(totalCarbs)}g</span>
            </ProgressRing>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginTop: '0.5rem' }}>/ {carbsGoal}g</span>
          </div>

        </div>
      </div>

    </div>
  );
};

export default DailyDashboard;
