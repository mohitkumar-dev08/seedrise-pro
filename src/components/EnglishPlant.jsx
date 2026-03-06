// components/EnglishPlant.jsx
import { useEffect, useState } from "react";

export default function EnglishPlant({ englishStreak }) {
  const [animate, setAnimate] = useState(false);
  const [stage, setStage] = useState(1);
  
  // Streak ke according stage calculate karo
  useEffect(() => {
    let currentStage = 1;
    
    if (englishStreak >= 180) currentStage = 11;
    else if (englishStreak >= 130) currentStage = 10;
    else if (englishStreak >= 105) currentStage = 9;
    else if (englishStreak >= 90) currentStage = 8;
    else if (englishStreak >= 75) currentStage = 7;
    else if (englishStreak >= 60) currentStage = 6;
    else if (englishStreak >= 41) currentStage = 5;
    else if (englishStreak >= 31) currentStage = 4;
    else if (englishStreak >= 21) currentStage = 3;
    else if (englishStreak >= 7) currentStage = 2;
    else currentStage = 1;
    
    setStage(currentStage);
    
    // Animation on streak increase
    setAnimate(true);
    const timer = setTimeout(() => setAnimate(false), 1000);
    return () => clearTimeout(timer);
  }, [englishStreak]);
  
  // Stage ke according emoji
  const getEmoji = () => {
    switch(stage) {
      case 1: return "🌰"; // Seed
      case 2: return "🌱"; // Sprout
      case 3: return "🌿"; // Sapling
      case 4: return "🪴"; // Potted
      case 5: return "🌵"; // Strong
      case 6: return "🌲"; // Small Tree
      case 7: return "🌳"; // Big Tree
      case 8: return "🌴"; // Palm
      case 9: return "🎄"; // Decorated
      case 10: return "🌋"; // Ancient (volcano)
      case 11: return "🌺"; // Flowering
      default: return "🌰";
    }
  };
  
  // Stage ke according name
  const getStageName = () => {
    switch(stage) {
      case 1: return "Seed";
      case 2: return "Sprout";
      case 3: return "Sapling";
      case 4: return "Potted Plant";
      case 5: return "Strong Plant";
      case 6: return "Small Tree";
      case 7: return "Big Tree";
      case 8: return "Palm Tree";
      case 9: return "Festive Tree";
      case 10: return "Ancient Tree";
      case 11: return "Flowering Tree";
      default: return "Seed";
    }
  };
  
  // Next milestone
  const getNextMilestone = () => {
    const milestones = [7, 21, 31, 41, 60, 75, 90, 105, 130, 180];
    return milestones.find(m => m > englishStreak) || null;
  };
  
  const nextMilestone = getNextMilestone();
  const progressToNext = nextMilestone 
    ? Math.round((englishStreak / nextMilestone) * 100) 
    : 100;
  
  return (
    <div className="english-plant-container">
      <div className="english-plant-header">
        <span className="english-plant-icon">🇬🇧</span>
        <h4>English Garden</h4>
        <span className="english-streak-badge">🔥 {englishStreak} days</span>
      </div>
      
      <div className="english-plant-main">
        <div className={`english-plant-emoji ${animate ? 'plant-pop' : ''}`}>
          {getEmoji()}
        </div>
        <div className="english-plant-stage">{getStageName()}</div>
      </div>
      
      {nextMilestone && (
        <div className="english-plant-progress">
          <div className="progress-info">
            <span>Next: {nextMilestone} days</span>
            <span>{progressToNext}%</span>
          </div>
          <div className="progress-bar-english">
            <div 
              className="progress-fill-english" 
              style={{ width: `${progressToNext}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}