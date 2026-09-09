import React from 'react';

/**
 * A circular SVG macro ring showing calorie progress.
 * Props: consumed (number), goal (number), size (number, default 120)
 */
const MacroRing = ({ consumed = 0, goal = 2000, size = 120 }) => {
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(consumed / goal, 1);
  const offset = circumference - pct * circumference;
  const remaining = Math.max(goal - consumed, 0);
  const center = size / 2;

  // Color shifts: green → yellow → red as you approach/exceed goal
  const color = pct < 0.75 ? '#10b981' : pct < 1.0 ? '#f59e0b' : '#ef4444';

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Background track */}
      <circle
        cx={center} cy={center} r={radius}
        fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={10}
      />
      {/* Progress arc */}
      <circle
        cx={center} cy={center} r={radius}
        fill="none"
        stroke={color}
        strokeWidth={10}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${center} ${center})`}
        style={{ transition: 'stroke-dashoffset 0.6s ease, stroke 0.4s ease' }}
      />
      {/* Center text */}
      <text x={center} y={center - 6} textAnchor="middle" fill="white" fontSize={size * 0.18} fontWeight="bold">
        {remaining}
      </text>
      <text x={center} y={center + 10} textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize={size * 0.09}>
        cal left
      </text>
    </svg>
  );
};

export default MacroRing;
