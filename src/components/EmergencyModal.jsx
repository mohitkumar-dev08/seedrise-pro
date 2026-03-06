import { useState, useEffect } from "react";

export default function EmergencyModal({ onClose }) {
  const [time, setTime] = useState(60);
  const [phase, setPhase] = useState("inhale"); // inhale, hold, exhale

  useEffect(() => {
    // Breathing cycle
    const breathingInterval = setInterval(() => {
      setPhase((prev) => {
        if (prev === "inhale") return "hold";
        if (prev === "hold") return "exhale";
        return "inhale";
      });
    }, 4000);

    return () => clearInterval(breathingInterval);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Breathing instructions
  const getBreathingText = () => {
    switch(phase) {
      case "inhale": return "🌬️ Inhale Slowly...";
      case "hold": return "💨 Hold...";
      case "exhale": return "😮💨 Exhale...";
      default: return "Breathe";
    }
  };

  return (
    <div className="emergency-modal-overlay">
      <div className="emergency-modal-container">
        <div className="emergency-modal-header">
          <h2>🧘 Emergency Calm Mode</h2>
          <button className="emergency-close-btn" onClick={onClose}>✕</button>
        </div>
        
        <div className="emergency-modal-body">
          {/* Timer Circle */}
          <div className="emergency-timer-circle">
            <div className={`emergency-timer-progress ${phase}`}>
              <span className="emergency-timer-number">{time}s</span>
            </div>
          </div>

          {/* Breathing Animation */}
          <div className={`emergency-breathing-container ${phase}`}>
            <div className="emergency-breathing-circle"></div>
            <p className="emergency-breathing-text">{getBreathingText()}</p>
          </div>

          {/* Motivational Message */}
          <div className="emergency-message-card">
            <p className="emergency-quote">"You are stronger than this urge"</p>
            <p className="emergency-subquote">This feeling will pass. You've got this! 💪</p>
          </div>

          {/* Quick Tips */}
          <div className="emergency-tips">
            <h4>💡 Quick Tips:</h4>
            <ul>
              <li>🚰 Drink a glass of water</li>
              <li>🚶 Take a short walk</li>
              <li>📞 Call a friend</li>
              <li>🎵 Listen to calming music</li>
            </ul>
          </div>
        </div>

        <div className="emergency-modal-footer">
          <button className="emergency-action-btn" onClick={onClose}>
            I Feel Better Now ✅
          </button>
          <button className="emergency-sos-btn" onClick={() => window.location.href = "tel:1234567890"}>
            🆘 SOS Contact
          </button>
        </div>
      </div>
    </div>
  );
}