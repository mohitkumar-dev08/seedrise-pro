// pages/Dashboard.jsx
import { Link } from "react-router-dom";
import Plant from "../components/Plant";
import Achievements from "../components/Achievements";
import { useState, useEffect } from "react";

export default function Dashboard({ data, onSurvive, onRelapse }) {
  const remainingDays = Math.max(0, data.goalDuration - data.currentStreak);
  
  // ✅ Get gym data for days left
  const [gymDaysLeft, setGymDaysLeft] = useState(186);
  
  // ✅ FIX: Function to load gym data
  const loadGymData = () => {
    const gymData = localStorage.getItem("gymTarget");
    if (gymData) {
      const parsed = JSON.parse(gymData);
      const daysLeft = parsed.totalDays - parsed.completedDays;
      setGymDaysLeft(daysLeft);
      console.log('Dashboard gym days updated:', daysLeft); // Debug
    }
  };
  
  // Load on mount
  useEffect(() => {
    loadGymData();
    
    // ✅ FIX: Listen for storage events (when gym data changes in another tab)
    const handleStorageChange = (e) => {
      if (e.key === 'gymTarget') {
        loadGymData();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // ✅ FIX: Custom event listener for same-tab updates
    const handleGymUpdate = () => {
      loadGymData();
    };
    
    window.addEventListener('gymTargetUpdated', handleGymUpdate);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('gymTargetUpdated', handleGymUpdate);
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

      {/* ✅ 5 CARDS IN ONE ROW */}
      <div className="feature-grid five-cards">
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
      { /* ✅ GYM TARGET CARD WITH CIRCLE COUNTDOWN */}
        <Link to="/gym-target" className="feature-card gym-card">
          <h3>Gym Target</h3>
          <p>6 Month Journey</p>
          <div className="countdown-circle">
            <span className="circle-number">{gymDaysLeft}</span>
            <span className="circle-label">DAYS LEFT</span>
          </div>
        </Link>
        <Link to="/wellness" className="feature-card">
          <span className="feature-icon">🧘</span>
          <h3>Wellness</h3>
          <p>Mood, sleep, journal</p>
        </Link>

        
      </div>
    </div>
  );
}