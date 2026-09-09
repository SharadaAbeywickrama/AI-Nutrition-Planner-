import React, { useState, useEffect } from 'react';

const GOAL_OPTIONS = [
  "Lose weight",
  "Maintain weight",
  "Gain weight",
  "Gain muscle",
  "Modify my diet",
  "Manage stress",
  "Increase step count"
];

const BARRIER_OPTIONS = [
  "Lack of time",
  "The regimen was too hard to follow",
  "Did not enjoy the food",
  "Difficult to make food choices",
  "Social eating and events",
  "Food cravings",
  "Lack of progress"
];

const ACTIVITY_OPTIONS = [
  { value: "Not Very Active", desc: "Spend most of the day sitting (e.g., bankteller, desk job)" },
  { value: "Lightly Active", desc: "Spend a good part of the day on your feet (e.g., teacher, salesperson)" },
  { value: "Active", desc: "Spend a good part of the day doing some physical activity (e.g., food server, postal carrier)" },
  { value: "Very Active", desc: "Spend a good part of the day doing heavy physical activity (e.g., bike messenger, carpenter)" }
];

const OnboardingWizard = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [userName, setUserName] = useState('');

  // Form State
  const [selectedGoals, setSelectedGoals] = useState([]);
  const [selectedBarriers, setSelectedBarriers] = useState([]);
  const [activityLevel, setActivityLevel] = useState('');
  const [sex, setSex] = useState('');
  const [dob, setDob] = useState('');
  const [country, setCountry] = useState('Sri Lanka');
  
  const [heightFt, setHeightFt] = useState('');
  const [heightIn, setHeightIn] = useState('');
  const [currentWeight, setCurrentWeight] = useState('');
  const [goalWeight, setGoalWeight] = useState('');

  useEffect(() => {
    fetch('http://localhost:8000/api/profile')
      .then(res => res.json())
      .then(data => {
        if (data && data.name) setUserName(data.name);
      })
      .catch(err => console.error("Could not fetch profile", err));
  }, []);

  const toggleArrayItem = (item, array, setArray, max = null) => {
    if (array.includes(item)) {
      setArray(array.filter(i => i !== item));
    } else {
      if (!max || array.length < max) {
        setArray([...array, item]);
      }
    }
  };

  const handleFinish = async () => {
    setIsSaving(true);
    try {
      // Calculate age from DOB
      let age = null;
      if (dob) {
        const birthDate = new Date(dob);
        const diffMs = Date.now() - birthDate.getTime();
        const ageDt = new Date(diffMs); 
        age = Math.abs(ageDt.getUTCFullYear() - 1970);
      }

      // Calculate height in cm
      let heightCm = null;
      if (heightFt && heightIn) {
        heightCm = (parseInt(heightFt) * 30.48) + (parseInt(heightIn) * 2.54);
      }

      // Convert weights from lbs to kg (assuming user inputs lbs based on image)
      const currentWeightKg = currentWeight ? parseFloat(currentWeight) * 0.453592 : null;
      const goalWeightKg = goalWeight ? parseFloat(goalWeight) * 0.453592 : null;

      const res = await fetch('http://localhost:8000/api/profile');
      let currentProfile = {};
      if (res.ok) currentProfile = await res.json();

      currentProfile.dietary_goal = selectedGoals.join(', ');
      currentProfile.barriers = selectedBarriers.join(', ');
      currentProfile.activity_level = activityLevel;
      currentProfile.sex = sex;
      if (age) currentProfile.age = age;
      currentProfile.country = country;
      if (heightCm) currentProfile.height_cm = heightCm;
      if (currentWeightKg) currentProfile.weight_kg = currentWeightKg;
      if (goalWeightKg) currentProfile.goal_weight_kg = goalWeightKg;

      await fetch('http://localhost:8000/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentProfile)
      });
      
      onComplete();
    } catch (err) {
      console.error(err);
      onComplete();
    }
  };

  const OptionButton = ({ label, isSelected, onClick, desc }) => (
    <button
      onClick={onClick}
      style={{
        display: 'block', width: '100%', padding: '1rem', marginBottom: '0.75rem',
        background: isSelected ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
        border: isSelected ? '2px solid var(--success)' : '1px solid var(--glass-border)',
        color: 'var(--text-primary)', borderRadius: '8px', fontSize: '1rem',
        textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s'
      }}
    >
      <div style={{ fontWeight: isSelected ? 'bold' : 'normal', textAlign: desc ? 'left' : 'center' }}>{label}</div>
      {desc && <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{desc}</div>}
    </button>
  );

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'var(--bg-dark)', zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
    }}>
      <div className="glass-panel animate-fade-in" style={{ 
        maxWidth: '500px', width: '100%', padding: '2.5rem',
        display: 'flex', flexDirection: 'column', minHeight: '550px', maxHeight: '90vh'
      }}>
        
        {/* STEP 1: Motivational Intro */}
        {step === 1 && (
          <div className="animate-fade-in" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem', lineHeight: '1.3' }}>
              Great! You've just taken a big step on your journey.
            </h2>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '1.5rem' }}>
              Did you know that tracking your food is a scientifically proven method to being successful? It's called "self-monitoring" and the more consistent you are, the more likely you are to hit your goals.
            </p>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-primary)', fontWeight: '500', marginTop: 'auto', marginBottom: '2rem' }}>
              Now, let's talk about your goals.
            </p>
            <button className="btn-primary" style={{ width: '100%', padding: '1rem', justifyContent: 'center' }} onClick={() => setStep(2)}>NEXT</button>
          </div>
        )}

        {/* STEP 2: Goals */}
        {step === 2 && (
          <div className="animate-fade-in" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Thanks {userName ? userName : 'there'}! Now for your goals.</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Select up to 3 that are important to you, including one weight goal.</p>
            <div style={{ flex: 1, overflowY: 'auto', marginBottom: '1rem' }}>
              {GOAL_OPTIONS.map(goal => (
                <OptionButton key={goal} label={goal} isSelected={selectedGoals.includes(goal)} onClick={() => toggleArrayItem(goal, selectedGoals, setSelectedGoals, 3)} />
              ))}
            </div>
            <button className="btn-primary" style={{ width: '100%', padding: '1rem', justifyContent: 'center' }} disabled={selectedGoals.length === 0} onClick={() => setStep(3)}>NEXT</button>
          </div>
        )}

        {/* STEP 3: Barriers */}
        {step === 3 && (
          <div className="animate-fade-in" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>In the past, what have been your barriers to losing weight?</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Select all that apply.</p>
            <div style={{ flex: 1, overflowY: 'auto', marginBottom: '1rem' }}>
              {BARRIER_OPTIONS.map(barrier => (
                <OptionButton key={barrier} label={barrier} isSelected={selectedBarriers.includes(barrier)} onClick={() => toggleArrayItem(barrier, selectedBarriers, setSelectedBarriers)} />
              ))}
            </div>
            <button className="btn-primary" style={{ width: '100%', padding: '1rem', justifyContent: 'center' }} disabled={selectedBarriers.length === 0} onClick={() => setStep(4)}>NEXT</button>
          </div>
        )}

        {/* STEP 4: Pitfalls / Reassurance */}
        {step === 4 && (
          <div className="animate-fade-in" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', lineHeight: '1.3' }}>
              We get it. A busy lifestyle can easily get in the way of reaching your goals.
            </h2>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '1.5rem' }}>
              Luckily we know all about managing potential pitfalls along the way because we've helped millions of people reach their goals.
            </p>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-primary)', fontWeight: '500', marginTop: 'auto', marginBottom: '2rem' }}>
              Let's get into the specifics so we can build your personalized plan.
            </p>
            <button className="btn-primary" style={{ width: '100%', padding: '1rem', justifyContent: 'center' }} onClick={() => setStep(5)}>NEXT</button>
          </div>
        )}

        {/* STEP 5: Activity Level */}
        {step === 5 && (
          <div className="animate-fade-in" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>What is your baseline activity level?</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Not including workouts-we count that separately</p>
            <div style={{ flex: 1, overflowY: 'auto', marginBottom: '1rem' }}>
              {ACTIVITY_OPTIONS.map(act => (
                <OptionButton key={act.value} label={act.value} desc={act.desc} isSelected={activityLevel === act.value} onClick={() => setActivityLevel(act.value)} />
              ))}
            </div>
            <button className="btn-primary" style={{ width: '100%', padding: '1rem', justifyContent: 'center' }} disabled={!activityLevel} onClick={() => setStep(6)}>NEXT</button>
          </div>
        )}

        {/* STEP 6: Demographics */}
        {step === 6 && (
          <div className="animate-fade-in" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Please select which sex we should use to calculate your calorie needs.</h2>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input type="radio" name="sex" checked={sex === 'Male'} onChange={() => setSex('Male')} style={{ width: '20px', height: '20px' }} /> Male
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input type="radio" name="sex" checked={sex === 'Female'} onChange={() => setSex('Female')} style={{ width: '20px', height: '20px' }} /> Female
              </label>
            </div>

            <div className="input-container" style={{ marginBottom: '1.5rem' }}>
              <label className="input-label" style={{ fontWeight: 'bold' }}>When were you born?</label>
              <input type="date" className="premium-input" value={dob} onChange={(e) => setDob(e.target.value)} />
            </div>

            <div className="input-container" style={{ marginBottom: '2rem' }}>
              <label className="input-label" style={{ fontWeight: 'bold' }}>Where do you live?</label>
              <select className="premium-input" value={country} onChange={(e) => setCountry(e.target.value)}>
                <option value="United States">United States</option>
                <option value="Sri Lanka">Sri Lanka</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Australia">Australia</option>
                <option value="Canada">Canada</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: 'auto', marginBottom: '1.5rem' }}>
              We use this information to calculate an accurate calorie goal for you.
            </p>
            <button className="btn-primary" style={{ width: '100%', padding: '1rem', justifyContent: 'center' }} disabled={!sex || !dob} onClick={() => setStep(7)}>NEXT</button>
          </div>
        )}

        {/* STEP 7: Measurements */}
        {step === 7 && (
          <div className="animate-fade-in" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>How tall are you?</h2>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                  <input type="number" placeholder="5" value={heightFt} onChange={(e) => setHeightFt(e.target.value)} style={{ flex: 1, background: 'transparent', border: 'none', color: 'white', padding: '0.75rem', outline: 'none' }} />
                  <span style={{ paddingRight: '0.75rem', color: 'var(--text-secondary)' }}>ft</span>
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                  <input type="number" placeholder="10" value={heightIn} onChange={(e) => setHeightIn(e.target.value)} style={{ flex: 1, background: 'transparent', border: 'none', color: 'white', padding: '0.75rem', outline: 'none' }} />
                  <span style={{ paddingRight: '0.75rem', color: 'var(--text-secondary)' }}>in</span>
                </div>
              </div>
            </div>

            <h2 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>How much do you weigh?</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>It's OK to estimate. You can update this later.</p>
            <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', border: '1px solid var(--glass-border)', marginBottom: '1.5rem', width: '50%' }}>
              <input type="number" placeholder="150" value={currentWeight} onChange={(e) => setCurrentWeight(e.target.value)} style={{ flex: 1, background: 'transparent', border: 'none', color: 'white', padding: '0.75rem', outline: 'none' }} />
              <span style={{ paddingRight: '0.75rem', color: 'var(--text-secondary)' }}>lbs</span>
            </div>

            <h2 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>What's your goal weight?</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Don't worry. This doesn't affect your daily calorie goal.</p>
            <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', border: '1px solid var(--glass-border)', marginBottom: '1rem', width: '50%' }}>
              <input type="number" placeholder="140" value={goalWeight} onChange={(e) => setGoalWeight(e.target.value)} style={{ flex: 1, background: 'transparent', border: 'none', color: 'white', padding: '0.75rem', outline: 'none' }} />
              <span style={{ paddingRight: '0.75rem', color: 'var(--text-secondary)' }}>lbs</span>
            </div>

            <button 
              className="btn-primary" 
              style={{ width: '100%', padding: '1rem', justifyContent: 'center', marginTop: 'auto' }} 
              disabled={!heightFt || !heightIn || !currentWeight || !goalWeight || isSaving} 
              onClick={handleFinish}
            >
              {isSaving ? 'Saving Profile...' : 'NEXT'}
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default OnboardingWizard;
