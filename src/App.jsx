// App.jsx - FULLY FIXED VERSION
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import Plant from "./components/Plant";
import EmergencyModal from "./components/EmergencyModal";
import Achievements from "./components/Achievements";
import CalendarView from "./components/CalendarView";
import AICoach from "./components/AICoach";
import MoodTracker from "./components/MoodTracker";
import MoodProgress from "./components/MoodProgress";
import DailyJournal from "./components/DailyJournal";
import SleepTracker from "./components/SleepTracker";
import SleepAnalytics from "./components/SleepAnalytics";
import EnglishChecklist from "./components/EnglishChecklist";
import EnglishPlant from "./components/EnglishPlant";
import EnglishAchievements from "./components/EnglishAchievements";
import TodoList from "./components/TodoList";
import GymTarget from "./components/GymTarget";
import confetti from "canvas-confetti";
import "./App.css";
import Days15Challenge from "./components/15DaysChallenge";
const todayString = () => new Date().toDateString();

const defaultData = {
  currentStreak: 0,
  bestStreak: 0,
  totalDays: 0,
  relapseCount: 0,
  lastCheckIn: null,
  weeklyData: Array(7).fill(0),
  darkMode: false,
  goalStartDate: new Date().toDateString(),
  goalDuration: 41
};

const getMonthYear = () => {
  const now = new Date();
  return now.toLocaleString("default", {
    month: "long",
    year: "numeric"
  });
};

// Navbar Component
function Navbar({ streak, darkMode, toggleDarkMode }) {
  const location = useLocation();
  
  const navLinks = [
    { path: "/", name: "Dashboard", icon: "🏠" },
    { path: "/tracker", name: "Tracker", icon: "📊" },
    { path: "/english", name: "English", icon: "🇬🇧" },
    { path: "/tasks", name: "Tasks", icon: "✅" },
    { path: "/wellness", name: "Wellness", icon: "🧘" },
    { path: "/gym-target", name: "Gym", icon: "💪" },
    { path: "/ai-coach", name: "AI Coach", icon: "🤖" },
    { path: "/challenge-15", name: "15 Day", icon: "⚡" },
  ];

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-brand">
          <Link to="/" className="brand-link">
            <span className="brand-icon">🌳</span>
            <span className="brand-name">SeedRise Pro</span>
          </Link>
        </div>

        <div className="nav-links">
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
            >
              <span className="nav-icon">{link.icon}</span>
              <span className="nav-text">{link.name}</span>
            </Link>
          ))}
        </div>

        <div className="nav-actions">
          <span className="nav-streak">🔥 {streak}</span>
          <button className="nav-theme-toggle" onClick={toggleDarkMode}>
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
    </nav>
  );
}

// Footer Component
function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h4 className="footer-title">🌳 SeedRise Pro</h4>
          <p className="footer-desc">Rise every day, grow every day.</p>
        </div>
        <div className="footer-section">
          <h4 className="footer-title">Quick Links</h4>
          <ul className="footer-links">
            <li><Link to="/">Dashboard</Link></li>
            <li><Link to="/tracker">Tracker</Link></li>
            <li><Link to="/english">English</Link></li>
            <li><Link to="/tasks">Tasks</Link></li>
            <li><Link to="/gym-target">Gym Target</Link></li>
          </ul>
        </div>
        <div className="footer-section">
          <h4 className="footer-title">Connect</h4>
          <div className="footer-social">
            <a href="#" className="social-link">📱</a>
            <a href="#" className="social-link">🐦</a>
            <a href="#" className="social-link">📘</a>
          </div>
          <p className="footer-copyright">© 2026 SeedRise Pro</p>
        </div>
      </div>
    </footer>
  );
}

// ✅ FIXED: Dashboard Page with dynamic gym days
function DashboardPage({ data, onSurvive, onRelapse }) {
  const remainingDays = Math.max(0, data.goalDuration - data.currentStreak);
  
  // ✅ ADDED: State for gym days
  const [gymDaysLeft, setGymDaysLeft] = useState(186);
  
  // ✅ ADDED: Function to load gym data
  const loadGymData = () => {
    const gymData = localStorage.getItem("gymTarget");
    if (gymData) {
      const parsed = JSON.parse(gymData);
      const daysLeft = parsed.totalDays - parsed.completedDays;
      setGymDaysLeft(daysLeft);
      console.log('Dashboard gym days updated:', daysLeft);
    }
  };
  
  // ✅ ADDED: useEffect with listeners
  useEffect(() => {
    loadGymData();
    
    const handleStorageChange = (e) => {
      if (e.key === 'gymTarget') {
        loadGymData();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('gymTargetUpdated', loadGymData);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('gymTargetUpdated', loadGymData);
    };
  }, []);

  return (
    <div className="dashboard-page">
      <div className="quick-stats-grid">
        <div className="quick-stat-card primary">
          <span className="stat-icon">🔥</span>
          <div>
            <div className="stat-value">{data.currentStreak}</div>
            <div className="stat-label">Current Streak</div>
          </div>
        </div>
        <div className="quick-stat-card success">
          <span className="stat-icon">🎯</span>
          <div>
            <div className="stat-value">{remainingDays}</div>
            <div className="stat-label">Days Left</div>
          </div>
        </div>
        <div className="quick-stat-card warning">
          <span className="stat-icon">🏆</span>
          <div>
            <div className="stat-value">{data.bestStreak}</div>
            <div className="stat-label">Best Streak</div>
          </div>
        </div>
        <div className="quick-stat-card danger">
          <span className="stat-icon">⚠️</span>
          <div>
            <div className="stat-value">{data.relapseCount}</div>
            <div className="stat-label">Relapses</div>
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <button onClick={onSurvive} className="survive-btn-large">✅ I Survived Today</button>
        <button onClick={onRelapse} className="relapse-btn-large">⚠️ Relapse</button>
      </div>

      <div className="feature-grid">
        <Link to="/tracker" className="feature-card">
          <span className="feature-icon">📊</span>
          <h3>Tracker</h3>
          <p>Main streak & progress</p>
        </Link>
        <Link to="/english" className="feature-card">
          <span className="feature-icon">🇬🇧</span>
          <h3>English</h3>
          <p>Practice daily</p>
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
        
        {/* ✅ FIXED: Gym Target with dynamic number */}
        <Link to="/gym-target" className="feature-card gym-card">
          <h3>Gym Target</h3>
          <p>6 Month Journey</p>
          <div className="countdown-circle">
            <span className="circle-number">{gymDaysLeft}</span>
            <span className="circle-label">DAYS LEFT</span>
          </div>
        </Link>
        {/* ✅ 15 Day Challenge - NEW CARD */}
  <Link to="/challenge-15" className="feature-card challenge-card">
    <span className="feature-icon">⚡</span>
    <h3>15 Day Challenge</h3>
    <p>Transform yourself</p>
    <div className="challenge-mini-progress">
      <div className="mini-progress-bar">
        <div className="mini-progress-fill" style={{ width: '0%' }} />
      </div>
      <span className="mini-streak">🔥 0/15</span>
    </div>
  </Link>
      </div>
    </div>
  );
}

// Tracker Page
function TrackerPage({ data, onSurvive, onRelapse, message, showModal, setShowModal, justRelapsed }) {
  const remainingDays = Math.max(0, data.goalDuration - data.currentStreak);
  const milestones = [3, 7, 30, 90];
  const nextMilestone = milestones.find(m => m > data.currentStreak) || null;
  const progressPercent = nextMilestone ? (data.currentStreak / nextMilestone) * 100 : 100;
  const [currentMonthYear] = useState(getMonthYear());
  
  const [rightTab, setRightTab] = useState("calendar");

  return (
    <div className="tracker-page">
      <div className="tracker-grid">
        {/* Left Column */}
        <div className="tracker-left">
          <AICoach streak={data.currentStreak} justRelapsed={justRelapsed} />
          <EnglishPlant englishStreak={0} />
          <EnglishAchievements englishStreak={0} />
        </div>

        {/* Center Column */}
        <div className="tracker-center">
          <div className="app-inner">
            <h1>🌳 SeedRise Pro</h1>
            <div className="digital-timer">⏳ {remainingDays} Days Left</div>
            <Plant streak={data.currentStreak} />
            <Achievements streak={data.currentStreak} />
            {nextMilestone && (
              <div className="milestone-progress">
                <h3>🎯 Next Goal: {nextMilestone} Days</h3>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
                </div>
                <p>{data.currentStreak} / {nextMilestone} days</p>
              </div>
            )}
            <div className="stats-row">
              <div className="stat-card">🔥 <span>Current</span><strong>{data.currentStreak}</strong></div>
              <div className="stat-card">🏆 <span>Best</span><strong>{data.bestStreak}</strong></div>
              <div className="stat-card">📅 <span>Total</span><strong>{data.totalDays}</strong></div>
              <div className="stat-card danger">⚠️ <span>Relapses</span><strong>{data.relapseCount}</strong></div>
            </div>
            <div className="buttons">
              <button onClick={onSurvive} className="survive-btn">✅ I Survived Today</button>
              <button onClick={onRelapse} className="danger relapse-btn">⚠️ Relapse</button>
            </div>
            {message && <div className="info-message">{message}</div>}
            <button className="emergency" onClick={() => setShowModal(true)}>🚨 Emergency Mode</button>
          </div>
          <TodoList />
        </div>

        {/* Right Column */}
        <div className="tracker-right">
          <div className="calendar-card">
            <div className="right-column-tabs">
              <button className={rightTab === "calendar" ? "active" : ""} onClick={() => setRightTab("calendar")}>📅 Calendar</button>
              <button className={rightTab === "mood" ? "active" : ""} onClick={() => setRightTab("mood")}>😊 Mood</button>
              <button className={rightTab === "journal" ? "active" : ""} onClick={() => setRightTab("journal")}>📔 Journal</button>
              <button className={rightTab === "sleep" ? "active" : ""} onClick={() => setRightTab("sleep")}>😴 Sleep</button>
              <button className={rightTab === "stats" ? "active" : ""} onClick={() => setRightTab("stats")}>📊 Stats</button>
            </div>

            {rightTab === "calendar" && (
              <>
                <CalendarView data={data} />
                <GymTarget />
              </>
            )}
            {rightTab === "mood" && <MoodTracker date={todayString()} />}
            {rightTab === "journal" && <DailyJournal date={todayString()} />}
            {rightTab === "sleep" && (
              <>
                <SleepTracker date={todayString()} />
                <SleepAnalytics streak={data.currentStreak} />
              </>
            )}
            {rightTab === "stats" && <MoodProgress />}
          </div>
        </div>
      </div>
    </div>
  );
}

// ✅ NEW: Gym Target Page
function GymTargetPage() {
  return (
    <div className="gym-target-page">
      <GymTarget />
    </div>
  );
}

// English Page
function EnglishPage({ englishStreak, setEnglishStreak, mainStreak }) {
  return (
    <div className="english-page">
      <div className="english-grid">
        <EnglishPlant englishStreak={englishStreak} />
        <EnglishAchievements englishStreak={englishStreak} />
        <EnglishChecklist streak={mainStreak} onStreakUpdate={setEnglishStreak} />
      </div>
    </div>
  );
}

// Tasks Page
function TasksPage() {
  return (
    <div className="tasks-page">
      <TodoList />
    </div>
  );
}

// Wellness Page
function WellnessPage({ streak }) {
  const today = todayString();
  
  return (
    <div className="wellness-page">
      <div className="wellness-grid">
        <MoodTracker date={today} />
        <DailyJournal date={today} />
        <SleepTracker date={today} />
        <SleepAnalytics streak={streak} />
        <MoodProgress />
      </div>
    </div>
  );
}

// AI Coach Page
function AICoachPage({ streak, justRelapsed }) {
  return (
    <div className="aicoach-page">
      <AICoach streak={streak} justRelapsed={justRelapsed} />
    </div>
  );
}

// MAIN APP
function App() {
  const [data, setData] = useState(() => {
    const saved = JSON.parse(localStorage.getItem("seedrise"));
    return saved ? { ...defaultData, ...saved } : defaultData;
  });

  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");
  const [justRelapsed, setJustRelapsed] = useState(false);
  const [englishStreak, setEnglishStreak] = useState(0);

  useEffect(() => {
    localStorage.setItem("seedrise", JSON.stringify(data));
  }, [data]);

  const handleSurvived = () => {
    if (data.lastCheckIn === todayString()) {
      setMessage("✅ You already marked today as survived!");
      setTimeout(() => setMessage(""), 2500);
      return;
    }

    const newStreak = data.currentStreak + 1;
    if ([7, 30, 90].includes(newStreak)) confetti();

    const updatedWeekly = [...data.weeklyData];
    updatedWeekly[new Date().getDay()]++;

    setData({
      ...data,
      currentStreak: newStreak,
      bestStreak: Math.max(newStreak, data.bestStreak),
      totalDays: data.totalDays + 1,
      lastCheckIn: todayString(),
      weeklyData: updatedWeekly
    });

    setJustRelapsed(false);
    setMessage("🔥 Great job! Keep going!");
    setTimeout(() => setMessage(""), 2500);
  };

  const handleRelapse = () => {
    if (!window.confirm("Are you sure?")) return;
    setData({
      ...data,
      currentStreak: 0,
      relapseCount: data.relapseCount + 1,
      lastCheckIn: todayString()
    });
    setJustRelapsed(true);
    setMessage("⚠️ Streak reset. Start again stronger!");
    setTimeout(() => setMessage(""), 2500);
  };

  const toggleDarkMode = () => {
    setData({ ...data, darkMode: !data.darkMode });
  };

  return (
    <BrowserRouter>
      <div className={data.darkMode ? "app dark" : "app"}>
        <Navbar streak={data.currentStreak} darkMode={data.darkMode} toggleDarkMode={toggleDarkMode} />
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<DashboardPage data={data} onSurvive={handleSurvived} onRelapse={handleRelapse} />} />
            <Route path="/tracker" element={<TrackerPage data={data} onSurvive={handleSurvived} onRelapse={handleRelapse} message={message} showModal={showModal} setShowModal={setShowModal} justRelapsed={justRelapsed} />} />
            <Route path="/english" element={<EnglishPage englishStreak={englishStreak} setEnglishStreak={setEnglishStreak} mainStreak={data.currentStreak} />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/wellness" element={<WellnessPage streak={data.currentStreak} />} />
            <Route path="/gym-target" element={<GymTargetPage />} />
            <Route path="/ai-coach" element={<AICoachPage streak={data.currentStreak} justRelapsed={justRelapsed} />} />
            <Route path="/challenge-15" element={<Days15Challenge />} />
          </Routes>
        </main>

        <Footer />
        {showModal && <EmergencyModal onClose={() => setShowModal(false)} />}
      </div>
    </BrowserRouter>
  );
}

export default App;