import React, { useState, useEffect } from 'react';
import { User, Save } from 'lucide-react';

const UserProfile = () => {
  const [profile, setProfile] = useState({
    name: 'User',
    age: '',
    sex: '',
    weight_kg: '',
    height_cm: '',
    activity_level: '',
    dietary_goal: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('http://localhost:8000/api/profile')
      .then(res => res.json())
      .then(data => {
        setProfile(data);
      })
      .catch(err => console.error("Failed to load profile:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value === '' ? null : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    try {
      const res = await fetch('http://localhost:8000/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      });
      if (res.ok) {
        setMessage('Profile updated successfully!');
      } else {
        setMessage('Failed to update profile.');
      }
    } catch (err) {
      setMessage('Network error.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-panel animate-fade-in" style={{ padding: '2.5rem' }}>
      <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
        <User className="text-gradient" size={28} />
        Your Profile
      </h2>

      <form onSubmit={handleSubmit} className="content-grid two-cols">
        <div className="input-container">
          <label className="input-label">Age</label>
          <input type="number" name="age" value={profile.age || ''} onChange={handleChange} className="premium-input" style={{ minHeight: 'auto', padding: '0.75rem' }} />
        </div>
        <div className="input-container">
          <label className="input-label">Biological Sex</label>
          <select name="sex" value={profile.sex || ''} onChange={handleChange} className="premium-input" style={{ minHeight: 'auto', padding: '0.75rem' }}>
            <option value="">Select...</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
        <div className="input-container">
          <label className="input-label">Weight (kg)</label>
          <input type="number" name="weight_kg" value={profile.weight_kg || ''} onChange={handleChange} className="premium-input" style={{ minHeight: 'auto', padding: '0.75rem' }} />
        </div>
        <div className="input-container">
          <label className="input-label">Height (cm)</label>
          <input type="number" name="height_cm" value={profile.height_cm || ''} onChange={handleChange} className="premium-input" style={{ minHeight: 'auto', padding: '0.75rem' }} />
        </div>
        <div className="input-container">
          <label className="input-label">Activity Level</label>
          <select name="activity_level" value={profile.activity_level || ''} onChange={handleChange} className="premium-input" style={{ minHeight: 'auto', padding: '0.75rem' }}>
            <option value="">Select...</option>
            <option value="Sedentary">Sedentary</option>
            <option value="Lightly Active">Lightly Active</option>
            <option value="Moderately Active">Moderately Active</option>
            <option value="Very Active">Very Active</option>
          </select>
        </div>
        <div className="input-container" style={{ gridColumn: '1 / -1' }}>
          <label className="input-label">Your Goals (Select up to 3)</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '0.5rem' }}>
            {[
              "Lose weight",
              "Maintain weight",
              "Gain weight",
              "Gain muscle",
              "Modify my diet",
              "Manage stress",
              "Increase step count"
            ].map(goal => {
              const selectedGoals = profile.dietary_goal ? profile.dietary_goal.split(', ') : [];
              const isSelected = selectedGoals.includes(goal);
              
              const toggleGoal = () => {
                let newGoals;
                if (isSelected) {
                  newGoals = selectedGoals.filter(g => g !== goal);
                } else {
                  if (selectedGoals.length < 3) {
                    newGoals = [...selectedGoals, goal];
                  } else {
                    newGoals = selectedGoals;
                  }
                }
                setProfile(prev => ({ ...prev, dietary_goal: newGoals.join(', ') }));
              };

              return (
                <button
                  key={goal}
                  type="button"
                  onClick={toggleGoal}
                  style={{
                    padding: '0.75rem 1.25rem',
                    background: isSelected ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
                    border: isSelected ? '1px solid var(--success)' : '1px solid var(--glass-border)',
                    color: 'var(--text-primary)',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {goal}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
          <button type="submit" className="btn-primary" disabled={isLoading}>
            <Save size={18} />
            {isLoading ? 'Saving...' : 'Save Profile'}
          </button>
          {message && <span style={{ marginLeft: '1rem', color: 'var(--success)' }}>{message}</span>}
        </div>
      </form>
    </div>
  );
};

export default UserProfile;
