// components/SleepTracker.jsx
import { useState, useEffect } from "react";

export default function SleepTracker({ date = new Date().toDateString() }) {
  const [sleepData, setSleepData] = useState({
    hours: 7,
    quality: "good", // excellent, good, average, poor, terrible
    bedtime: "23:00",
    wakeup: "07:00",
    note: ""
  });
  
  const [savedData, setSavedData] = useState(() => {
    const saved = localStorage.getItem("sleepTracker");
    return saved ? JSON.parse(saved) : {};
  });

  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    if (savedData[date]) {
      setSleepData(savedData[date]);
    }
  }, [date]);

  const saveSleepData = () => {
    const updated = {
      ...savedData,
      [date]: {
        ...sleepData,
        timestamp: new Date().toISOString()
      }
    };
    
    setSavedData(updated);
    localStorage.setItem("sleepTracker", JSON.stringify(updated));
    alert("😴 Sleep data saved!");
  };

  const getQualityEmoji = (quality) => {
    const emojis = {
      excellent: "🌟",
      good: "😊",
      average: "😐",
      poor: "😫",
      terrible: "😴"
    };
    return emojis[quality] || "😐";
  };

  const getSleepAdvice = (hours, quality) => {
    if (hours < 5) return "🚨 Very less sleep! Take some rest today";
    if (hours < 7) return "⚠️ 7-8 hours sleep is best, try to improve";
    if (hours >= 8 && quality === "excellent") return "💪 Perfect sleep! Rock today!";
    if (hours >= 8) return "😊 Good sleep, have a productive day!";
    return "📝 Try to maintain consistent sleep time";
  };

  return (
    <div className="sleep-tracker-card">
      <div className="sleep-header">
        <h3>😴 Sleep Tracker</h3>
        <button 
          className="history-toggle"
          onClick={() => setShowHistory(!showHistory)}
        >
          {showHistory ? "📋 Hide History" : "📋 View History"}
        </button>
      </div>

      {/* Main Sleep Form */}
      <div className="sleep-form">
        <div className="sleep-hours">
          <label>Sleep Duration</label>
          <div className="hour-slider">
            <input
              type="range"
              min="0"
              max="12"
              step="0.5"
              value={sleepData.hours}
              onChange={(e) => setSleepData({
                ...sleepData,
                hours: parseFloat(e.target.value)
              })}
            />
            <span className="hour-value">{sleepData.hours} hrs</span>
          </div>
        </div>

        <div className="sleep-quality">
          <label>Sleep Quality</label>
          <div className="quality-buttons">
            {[
              { value: "terrible", emoji: "💫", label: "Terrible" },
              { value: "poor", emoji: "😫", label: "Poor" },
              { value: "average", emoji: "😐", label: "Average" },
              { value: "good", emoji: "😊", label: "Good" },
              { value: "excellent", emoji: "🌟", label: "Excellent" }
            ].map(q => (
              <button
                key={q.value}
                className={`quality-btn ${sleepData.quality === q.value ? 'selected' : ''}`}
                onClick={() => setSleepData({...sleepData, quality: q.value})}
              >
                <span className="quality-emoji">{q.emoji}</span>
                <span className="quality-label">{q.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="sleep-time-row">
          <div className="time-input">
            <label>🛏️ Bedtime</label>
            <input
              type="time"
              value={sleepData.bedtime}
              onChange={(e) => setSleepData({...sleepData, bedtime: e.target.value})}
            />
          </div>
          <div className="time-input">
            <label>⏰ Wake up</label>
            <input
              type="time"
              value={sleepData.wakeup}
              onChange={(e) => setSleepData({...sleepData, wakeup: e.target.value})}
            />
          </div>
        </div>

        <textarea
          className="sleep-note"
          placeholder="Notes (dreams, feelings, etc)..."
          value={sleepData.note}
          onChange={(e) => setSleepData({...sleepData, note: e.target.value})}
          rows="2"
        />

        {/* Sleep Advice */}
        <div className={`sleep-advice quality-${sleepData.quality}`}>
          {getSleepAdvice(sleepData.hours, sleepData.quality)}
        </div>

        <button className="save-sleep-btn" onClick={saveSleepData}>
          💾 Save Sleep Data
        </button>
      </div>

      {/* History Section */}
      {showHistory && (
        <div className="sleep-history">
          <h4>📊 Sleep History</h4>
          <div className="history-list">
            {Object.entries(savedData)
              .sort((a, b) => new Date(b[0]) - new Date(a[0]))
              .slice(0, 7)
              .map(([date, data]) => (
                <div key={date} className="history-item">
                  <span className="history-date">
                    {new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                  </span>
                  <span className="history-hours">{data.hours}h</span>
                  <span className="history-quality">{getQualityEmoji(data.quality)}</span>
                  <span className="history-time">{data.bedtime} - {data.wakeup}</span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}