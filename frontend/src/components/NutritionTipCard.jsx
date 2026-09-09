import React, { useState, useEffect } from 'react';

const TIPS = [
  { emoji: '🥥', tip: 'Pol Sambol is rich in fiber and coconut fat. It pairs perfectly with Idiyappam for a balanced breakfast.', category: 'Breakfast' },
  { emoji: '🫘', tip: 'Parippu (red lentil curry) is one of the best plant-based iron sources in Sri Lankan cuisine with 3.2mg per serving.', category: 'Nutrition' },
  { emoji: '🌿', tip: 'Kola Kenda (Gotukola porridge) contains 3.2mg of iron and 85mg of calcium — a powerful traditional superfood.', category: 'Superfood' },
  { emoji: '🦀', tip: 'Crab curry (Kakuluwo) provides 4.2mcg of Vitamin B12 — more than your entire daily requirement in one serving!', category: 'Vitamin B12' },
  { emoji: '🌾', tip: 'Kurakkan (finger millet) roti has 8x more calcium than white rice and 4.5mg of iron. Great for bone health.', category: 'Calcium' },
  { emoji: '🐟', tip: 'Ambul Thiyal (sour tuna curry) is extremely high in protein (22g) and Vitamin B12 (3.8mcg) per serving.', category: 'Protein' },
  { emoji: '🍚', tip: 'Red Kekulu rice has 4x more fiber than polished white Samba rice. Great for gut health and blood sugar control.', category: 'Fiber' },
  { emoji: '🌱', tip: 'Gotukola Sambol provides 4.1mg of iron and 120mg of calcium — remarkable for a simple fresh salad.', category: 'Iron' },
];

const NutritionTipCard = () => {
  const [tip, setTip] = useState(TIPS[0]);

  useEffect(() => {
    const idx = new Date().getDay() % TIPS.length;
    setTip(TIPS[idx]);
  }, []);

  return (
    <div className="glass-panel" style={{
      padding: '1.25rem', borderRadius: '16px', marginBottom: '1.5rem',
      borderLeft: '4px solid #10b981', background: 'rgba(16, 185, 129, 0.05)'
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
        <span style={{ fontSize: '2rem' }}>{tip.emoji}</span>
        <div>
          <span style={{
            fontSize: '0.7rem', background: 'rgba(16,185,129,0.2)', color: '#10b981',
            padding: '2px 8px', borderRadius: '10px', fontWeight: '600', letterSpacing: '0.5px'
          }}>{tip.category}</span>
          <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', lineHeight: 1.5, color: 'var(--text-primary)' }}>
            {tip.tip}
          </p>
        </div>
      </div>
    </div>
  );
};

export default NutritionTipCard;
