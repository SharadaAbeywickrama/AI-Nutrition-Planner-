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
        <div className="input-container">
          <label className="input-label">Primary Goal</label>
          <select name="dietary_goal" value={profile.dietary_goal || ''} onChange={handleChange} className="premium-input" style={{ minHeight: 'auto', padding: '0.75rem' }}>
            <option value="">Select...</option>
            <option value="General Health">General Health</option>
            <option value="Weight Loss">Weight Loss</option>
            <option value="Muscle Gain">Muscle Gain</option>
            <option value="Deficiency Management">Deficiency Management</option>
          </select>
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
