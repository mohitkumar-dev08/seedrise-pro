// pages/Dashboard.jsx
import { Link } from "react-router-dom";
import Plant from "../components/Plant";
import Achievements from "../components/Achievements";
import { useState, useEffect } from "react";

export default function Dashboard({ data, onSurvive, onRelapse }) {
  const remainingDays = Math.max(0, data.goalDuration - data.currentStreak);
  
  // ✅ Gym data
  const [gymDaysLeft, setGymDaysLeft] = useState(186);
  
  // ✅ Challenge 15 data
  const [challengeStreak, setChallengeStreak] = useState(0);
  const [challengeProgress, setChallengeProgress] = useState(0);
  
  // Load gym data
  const loadGymData = () => {
    const gymData = localStorage.getItem("gymTarget");
    if (gymData) {
      const parsed = JSON.parse(gymData);
      const daysLeft = parsed.totalDays - parsed.completedDays;
      setGymDaysLeft(daysLeft);
    }
  };
  
  // Load challenge 15 data
  const loadChallengeData = () => {
    const saved = localStorage.getItem("challenge15");
    if (saved) {
      const data = JSON.parse(saved);
      const today = new Date().toDateString();
      const todayData = data[today];
      const todayProgress = todayData?._progress || 0;
      
      setChallengeProgress(todayProgress);
      
      // Calculate streak
      const todayCompleted = todayData?._completed > 0;
      const completedDates = Object.keys(data)
        .filter(date => {
          const dayData = data[date];
          return dayData && dayData._completed > 0;
        })
        .map(date => new Date(date).toDateString());
      
      if (!todayCompleted || completedDates.length === 0) {
        setChallengeStreak(0);
        return;
      }
      
      let count = 0;
      let checkDate = new Date(today);
      
      for (let i = 0; i < 15; i++) {
        const dateStr = checkDate.toDateString();
        if (completedDates.includes(dateStr)) {
          count++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }
      
      setChallengeStreak(count);
    }
  };
  
  // Load on mount
  useEffect(() => {
    loadGymData();
    loadChallengeData();
    
    // Listen for storage events
    const handleStorageChange = (e) => {
      if (e.key === 'gymTarget') {
        loadGymData();
      }
      if (e.key === 'challenge15') {
        loadChallengeData();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Custom event listeners
    const handleGymUpdate = () => loadGymData();
    const handleChallengeUpdate = () => loadChallengeData();
    
    window.addEventListener('gymTargetUpdated', handleGymUpdate);
    window.addEventListener('challenge15Updated', handleChallengeUpdate);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('gymTargetUpdated', handleGymUpdate);
      window.removeEventListener('challenge15Updated', handleChallengeUpdate);
    };
  }, []);

  return (
    <div className="dashboard-page">
      {/* Hero Section */}
      <div className="dashboard-hero">
        <h1 className="hero-title">Welcome Back! 👋</h1>
        <p className="hero-subtitle">Your journey to self-improvement continues</p>
      </div>

      {/* Quick Stats Grid */}
      <div className="quick-stats-grid">
        <div className="quick-stat-card primary">
          <span className="stat-icon">🔥</span>
          <div className="stat-info">
            <span className="stat-value">{data.currentStreak}</span>
            <span className="stat-label">Day Streak</span>
          </div>
        </div>
        <div className="quick-stat-card success">
          <span className="stat-icon">🎯</span>
          <div className="stat-info">
            <span className="stat-value">{remainingDays}</span>
            <span className="stat-label">Days Left</span>
          </div>
        </div>
        <div className="quick-stat-card warning">
          <span className="stat-icon">🏆</span>
          <div className="stat-info">
            <span className="stat-value">{data.bestStreak}</span>
            <span className="stat-label">Best Streak</span>
          </div>
        </div>
        <div className="quick-stat-card danger">
          <span className="stat-icon">⚠️</span>
          <div className="stat-info">
            <span className="stat-value">{data.relapseCount}</span>
            <span className="stat-label">Relapses</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions-card">
        <h3>⚡ Quick Actions</h3>
        <div className="action-buttons">
          <button onClick={onSurvive} className="action-btn survive">✅ I Survived Today</button>
          <button onClick={onRelapse} className="action-btn relapse">⚠️ Relapse</button>
        </div>
      </div>

      {/* ✅ FEATURE GRID - ALL CARDS */}
      <div className="feature-grid">
        {/* Row 1: Main Features */}
        <div className="feature-row">
          <Link to="/tracker" className="feature-card">
            <span className="feature-icon">📊</span>
            <h3>Tracker</h3>
            <p>Main streak & progress</p>
            <Plant streak={data.currentStreak} />
          </Link>

          <Link to="/english" className="feature-card">
            <span className="feature-icon">🇬🇧</span>
            <h3>English</h3>
            <p>Practice daily</p>
            <Achievements streak={data.currentStreak} />
          </Link>

          <Link to="/tasks" className="feature-card">
            <span className="feature-icon">✅</span>
            <h3>Tasks</h3>
            <p>Daily checklist</p>
          </Link>

          <Link to="/wellness" className="feature-card">
            <span className="feature-icon">🧘</span>
            <h3>Wellness</h3>
            <p>Mood, sleep, journal</p>
          </Link>
        </div>

        {/* Row 2: Gym & Challenge */}
        <div className="feature-row secondary-row">
          {/* Gym Target */}
          <Link to="/gym-target" className="feature-card gym-card">
            <span className="feature-icon">💪</span>
            <h3>Gym Target</h3>
            <p>6 Month Journey</p>
            <div className="countdown-circle">
              <span className="circle-number">{gymDaysLeft}</span>
              <span className="circle-label">DAYS LEFT</span>
            </div>
          </Link>

          {/* 15 Day Challenge */}
          <Link to="/challenge-15" className="feature-card challenge-card">
            <span className="feature-icon">⚡</span>
            <h3>15 Day Challenge</h3>
            <p>Transform yourself</p>
            <div className="challenge-mini-progress">
              <div className="mini-progress-bar">
                <div 
                  className="mini-progress-fill" 
                  style={{ width: `${challengeProgress}%` }}
                />
              </div>
              <span className="mini-streak">🔥 {challengeStreak}/15</span>
            </div>
          </Link>

          {/* AI Coach */}
          <Link to="/ai-coach" className="feature-card ai-card">
            <span className="feature-icon">🤖</span>
            <h3>AI Coach</h3>
            <p>Personal guidance</p>
          </Link>
        </div>
      </div>
    </div>
  );
}