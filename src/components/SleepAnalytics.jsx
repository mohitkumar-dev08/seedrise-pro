// components/SleepAnalytics.jsx
import { useState, useEffect } from "react";

export default function SleepAnalytics({ streak }) {
  const [sleepData, setSleepData] = useState([]);
  const [insights, setInsights] = useState([]);

  useEffect(() => {
    loadSleepData();
  }, []);

  const loadSleepData = () => {
    const saved = localStorage.getItem("sleepTracker");
    if (saved) {
      const data = JSON.parse(saved);
      const last7Days = Object.entries(data)
        .sort((a, b) => new Date(b[0]) - new Date(a[0]))
        .slice(0, 7)
        .map(([date, d]) => ({
          date,
          ...d
        }));
      setSleepData(last7Days);
      generateInsights(last7Days);
    }
  };

  const generateInsights = (data) => {
    if (data.length < 3) return;

    const avgSleep = data.reduce((sum, d) => sum + d.hours, 0) / data.length;
    const goodSleepDays = data.filter(d => d.hours >= 7 && (d.quality === "good" || d.quality === "excellent")).length;
    const poorSleepDays = data.filter(d => d.hours < 6 || d.quality === "poor" || d.quality === "terrible").length;

    const newInsights = [];

    if (avgSleep < 6) {
      newInsights.push("⚠️ Less sleep - high relapse risk! Try to get 7-8 hours");
    } else if (avgSleep > 8) {
      newInsights.push("😴 Sleeping too much? Try to maintain 7-8 hours");
    } else {
      newInsights.push("✅ Good sleep! Keep it consistent");
    }

    if (goodSleepDays >= 5) {
      newInsights.push("💪 Excellent! 5/7 days of good sleep");
    }

    if (poorSleepDays >= 3) {
      newInsights.push("📉 3+ days of poor sleep - improve your bedtime routine");
    }

    setInsights(newInsights);
  };

  return (
    <div className="sleep-analytics">
      <h3>📈 Sleep Insights</h3>

      {/* Sleep Score */}
      <div className="sleep-score">
        <div className="score-circle">
          {sleepData.length > 0 ? (
            <>
              <span className="score-number">
                {Math.round(sleepData.reduce((sum, d) => sum + d.hours, 0) / sleepData.length * 10) / 10}
              </span>
              <span className="score-label">avg hours</span>
            </>
          ) : (
            <span className="score-number">-</span>
          )}
        </div>
      </div>

      {/* Insights */}
      {insights.length > 0 && (
        <div className="insights-list">
          {insights.map((insight, i) => (
            <div key={i} className="insight-item">
              {insight}
            </div>
          ))}
        </div>
      )}

      {/* Sleep vs Streak Correlation */}
      {sleepData.length > 0 && (
        <div className="correlation-box">
          <h4>🔄 Sleep & Streak Connection</h4>
          <p className="correlation-text">
            {sleepData[0]?.hours >= 7 
              ? "✨ Good sleep = higher chances of survival tomorrow!"
              : "⚠️ Less sleep = higher relapse risk. Go to bed early today!"}
          </p>
        </div>
      )}
    </div>
  );
}