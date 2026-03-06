import { useEffect, useState } from "react";

export default function WateringPlant({ streak }) {
  const [animate, setAnimate] = useState(false);
  const [watering, setWatering] = useState(false);

  // Streak ke according plant emoji
  let emoji = "🌰"; // Seed
  let stage = "Seed";
  
  if (streak >= 3) {
    emoji = "🌱"; // Sprout
    stage = "Sprout";
  }
  if (streak >= 7) {
    emoji = "🪴"; // Small Plant
    stage = "Small Plant";
  }
  if (streak >= 30) {
    emoji = "🌿"; // Growing Plant
    stage = "Growing Plant";
  }
  if (streak >= 90) {
    emoji = "🌳"; // Tree
    stage = "Full Tree";
  }

  // Pop animation on streak change
  useEffect(() => {
    setAnimate(true);
    const timer = setTimeout(() => setAnimate(false), 600);
    return () => clearTimeout(timer);
  }, [streak]);

  // Realistic watering animation - continuous flow
  useEffect(() => {
    const interval = setInterval(() => {
      setWatering(true);
      setTimeout(() => setWatering(false), 300);
    }, 800);
    
    return () => clearInterval(interval);
  }, []);

  return (
  <div className="watering-plant-container">
    <div className="watering-scene">
      {/* LEFT SIDE - FARMER FACING RIGHT (TOWARDS PLANT) */}
      <div className="farmer-container">
        <div className="farmer-facing-right">
          <span className="farmer-emoji" style={{ transform: 'scaleX(-1)' }}>🧑‍🌾</span>
        </div>
        <div className="watering-can-position">
          <span className="watering-can-emoji">🧴</span>
        </div>
      </div>
      
      {/* WATER FLOW - REALISTIC DROPS */}
      <div className="water-flow-area">
        {watering && (
          <>
            <span className="water-stream stream1">💧</span>
            <span className="water-stream stream2">💧</span>
            <span className="water-stream stream3">💧</span>
            <span className="water-stream stream4">💧</span>
            <span className="water-stream stream5">💧</span>
          </>
        )}
      </div>
      
      {/* RIGHT SIDE - PLANT */}
      <div className="plant-area">
        <div
          className={`plant-emoji-large 
            ${animate ? "plant-pop-effect" : ""} 
            ${watering ? "watering-active grow-boost" : ""}`}
        >
          {emoji}
        </div>
        {watering && <div className="water-impact">💧</div>}
        <div className={`soil-under-plant ${watering ? "wet-soil" : ""}`} />
      </div>
    </div>
    
    {/* STAGE TEXT */}
    <div className="plant-stage-info">
      <span className="stage-name">{stage}</span>
      {streak > 0 && <span className="streak-number">🔥 {streak}</span>}
    </div>
  </div>
);
}