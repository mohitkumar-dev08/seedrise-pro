import { useState, useEffect } from "react";
import ChallengeChecklist from "./ChallengeChecklist";
import ChallengePlant from "./ChallengePlant";
import ChallengeAchievements from "./ChallengeAchievements";

// Category tabs data
const CATEGORY_TABS = [
  { id: "all", name: "All Tasks", emoji: "📋", count: 24 },
  { id: "mind", name: "Mind", emoji: "🧠", count: 1 },
  { id: "english", name: "English", emoji: "🇬🇧", count: 1 },
  { id: "water", name: "Water", emoji: "💧", count: 2 },
  { id: "grooming", name: "Grooming", emoji: "👔", count: 1 },
  { id: "gym", name: "Gym", emoji: "💪", count: 2 },
  { id: "rules", name: "Rules", emoji: "⚡", count: 2 },
  { id: "skin", name: "Skin", emoji: "🧴", count: 5 },
  { id: "diet", name: "Diet", emoji: "🥗", count: 10 }
];

export default function Days15Challenge() {
  const [streak, setStreak] = useState(0);
  const [todayProgress, setTodayProgress] = useState(0);
  const [completedToday, setCompletedToday] = useState(0);
  const [showHistory, setShowHistory] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  // Load streak from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("challenge15");
    if (saved) {
      const data = JSON.parse(saved);
      
      // Calculate streak (consecutive days with >0 progress)
      const dates = Object.keys(data)
        .filter(date => {
          const dayData = data[date];
          return dayData && dayData._completed > 0;
        })
        .map(date => new Date(date).toDateString());
      
      if (dates.length === 0) {
        setStreak(0);
        return;
      }
      
      // Check if today is done
      const today = new Date().toDateString();
      const todayDone = dates.includes(today);
      
      // Calculate streak
      let count = todayDone ? 1 : 0;
      let checkDate = new Date(today);
      
      for (let i = 1; i < 15; i++) {
        checkDate.setDate(checkDate.getDate() - 1);
        const dateStr = checkDate.toDateString();
        
        if (dates.includes(dateStr)) {
          count++;
        } else {
          break;
        }
      }
      
      setStreak(count);
    }
  }, [todayProgress]);

  // Get history for last 7 days
  const getHistory = () => {
    const saved = localStorage.getItem("challenge15");
    if (!saved) return [];
    
    const data = JSON.parse(saved);
    return Object.entries(data)
      .filter(([_, val]) => val._progress !== undefined)
      .sort((a, b) => new Date(b[0]) - new Date(a[0]))
      .slice(0, 7)
      .map(([date, val]) => ({
        date,
        progress: val._progress,
        completed: val._completed,
        total: val._total
      }));
  };

  const history = getHistory();

  return (
    <div className="challenge-15-page">
      {/* Header */}
      <div className="challenge-header">
        <h1>⚡ 15 DAYS TRANSFORMATION ⚡</h1>
        <p className="challenge-subtitle">Complete daily tasks to grow stronger</p>
      </div>

      {/* Main Grid */}
      <div className="challenge-grid">
        {/* Left Column - Plant & Achievements */}
        <div className="challenge-left">
          <ChallengePlant streak={streak} />
          <ChallengeAchievements streak={streak} />
          
          {/* Daily Quote */}
          <div className="challenge-quote-card">
            <span className="quote-icon">💭</span>
            <p className="quote-text">
              {streak === 0 && "Start today. Future you will thank you."}
              {streak === 1 && "Day 1 done! Keep going!"}
              {streak === 3 && "3 days strong! Building habits."}
              {streak === 7 && "One week! You're unstoppable!"}
              {streak === 10 && "10 days! Almost there!"}
              {streak === 15 && "🎉 CHAMPION! You did it! 🎉"}
            </p>
          </div>
        </div>

        {/* Right Column - Checklist with Tabs */}
        <div className="challenge-right">
          {/* Progress Header */}
          <div className="checklist-progress-header">
            <div className="progress-circle-big">
              <svg viewBox="0 0 36 36" className="progress-circle">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#e0e0e0"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#4caf50"
                  strokeWidth="3"
                  strokeDasharray={`${todayProgress}, 100`}
                  strokeLinecap="round"
                />
              </svg>
              <span className="progress-text-inside">{todayProgress}%</span>
            </div>
            <div className="progress-stats">
              <span className="completed-count">{completedToday}/24</span>
              <span className="completed-label">Tasks Completed</span>
            </div>
          </div>

          {/* Tabs */}
          <div className="challenge-tabs">
            {CATEGORY_TABS.map(tab => (
              <button
                key={tab.id}
                className={`challenge-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="tab-emoji">{tab.emoji}</span>
                <span className="tab-text">{tab.name}</span>
              </button>
            ))}
          </div>

          {/* Checklist Component with active tab */}
          <ChallengeChecklist 
            activeTab={activeTab}
            onProgressUpdate={(percent, completed) => {
              setTodayProgress(percent);
              setCompletedToday(completed);
            }}
          />

          {/* Daily Summary Cards */}
          <div className="daily-summary-modern">
            <div className="summary-card">
              <span className="summary-label-modern">Today's Progress</span>
              <span className="summary-value-modern">{todayProgress}%</span>
            </div>
            <div className="summary-card">
              <span className="summary-label-modern">Tasks Done</span>
              <span className="summary-value-modern">{completedToday}/24</span>
            </div>
            <div className="summary-card">
              <span className="summary-label-modern">Current Streak</span>
              <span className="summary-value-modern">🔥 {streak}</span>
            </div>
          </div>

          {/* History Toggle */}
          <button 
            className="history-toggle-modern"
            onClick={() => setShowHistory(!showHistory)}
          >
            <span>📋</span>
            <span>{showHistory ? 'Hide History' : 'Show Last 7 Days'}</span>
          </button>

          {/* History */}
          {showHistory && (
            <div className="challenge-history-modern">
              <h4 style={{ margin: '0 0 15px 0', color: '#667eea' }}>📊 Previous Days</h4>
              <div className="history-list">
                {history.length > 0 ? (
                  history.map((day, i) => (
                    <div key={i} className="history-item-modern">
                      <span className="hist-date-modern">
                        {new Date(day.date).toLocaleDateString('en-US', { 
                          weekday: 'short', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </span>
                      <div className="hist-bar-container-modern">
                        <div 
                          className="hist-bar-modern" 
                          style={{ width: `${day.progress}%` }}
                        />
                      </div>
                      <span className="hist-percent-modern">{day.progress}%</span>
                      <span className="hist-count-modern">{day.completed}/{day.total}</span>
                    </div>
                  ))
                ) : (
                  <p className="no-history">No history yet. Start today!</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}