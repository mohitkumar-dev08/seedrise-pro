// components/ChallengePlant.jsx
import { useEffect, useState } from "react";

export default function ChallengePlant({ streak, totalDays = 13 }) {
  const [animate, setAnimate] = useState(false);

  // Streak ke according plant growth
  const getPlantStage = () => {
    if (streak >= totalDays) return { emoji: "🌳", name: "Full Grown Tree 🌳", stage: 5 };
    if (streak >= 10) return { emoji: "🌲", name: "Strong Tree 🌲", stage: 4 };
    if (streak >= 7) return { emoji: "🌿", name: "Bush 🌿", stage: 3 };
    if (streak >= 3) return { emoji: "🌱", name: "Sprout 🌱", stage: 2 };
    if (streak >= 1) return { emoji: "🌰", name: "Seed 🌰", stage: 1 }; // ✅ Streak 1 par bhi Seed dikhega
    return { emoji: "🌰", name: "Seed", stage: 0 };
  };

  const plant = getPlantStage();

  useEffect(() => {
    setAnimate(true);
    const timer = setTimeout(() => setAnimate(false), 1000);
    return () => clearTimeout(timer);
  }, [streak]);

  return (
    <div className="challenge-plant-card">
      <div className="plant-header">
        <span className="plant-icon">🌿</span>
        <h4>{totalDays} Day Challenge</h4>
        <span className="plant-streak">🔥 Day {streak}</span> {/* ✅ YEH SAHI HAI */}
      </div>

      <div className="plant-main">
        <div className={`plant-emoji-large ${animate ? 'plant-pop' : ''}`}>
          {plant.emoji}
        </div>
        <div className="plant-stage-name">{plant.name}</div>
      </div>

      <div className="plant-progress-bg">
        <div 
          className="plant-progress-bar" 
          style={{ width: `${(streak / totalDays) * 100}%` }}
        />
      </div>
      
      <div className="plant-milestone">
        {streak >= totalDays ? (
          <span className="challenge-complete">🎉 Challenge Complete! 🎉</span>
        ) : (
          <span>{totalDays - streak} days to go!</span>
        )}
      </div>
    </div>
  );
}