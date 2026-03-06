import { useState, useEffect } from "react";
// ✅ Import exportService
import { exportService } from "../services/exportService";

// ===== TASKS DATA =====
const TONGUE_TWISTERS = [
  { day: 1, text: "🔴 TH/S/SH: Thirty-three thieves thought they thrilled the throne." },
  { day: 2, text: "🔵 R/L: Red lorry, yellow lorry." },
  { day: 3, text: "🟢 P/B/T/D: Peter Piper picked a peck of pickled peppers." },
  { day: 4, text: "🟡 V/W/F: Vincent vowed vengeance very vehemently." },
  { day: 5, text: "🟠 CH/J/Y: Chester Cheetah chews a chunk of cheap cheddar cheese." },
  { day: 6, text: "🟣 Mixed: I slit a sheet, a sheet I slit." }
];

const DAY1_TASKS = [
  { id: "d1_sentence", short: "📝 5 Words + Sentences", full: "Sentence Construction: new 5 words, 5 sentences each" },
  { id: "d1_current", short: "📰 Current Affairs", full: "Current affair daily (indiabix.com)" },
  { id: "d1_journal", short: "📔 5 Lines Journal", full: "5 Lines Daily Journal: best lines you spoke/heard" },
  { id: "d1_read", short: "📚 Read Aloud (10m)", full: "Read Aloud - any book (10 min)" },
  { id: "d1_friends", short: "📺 Friends (No repeat)", full: "Watch Friends episode - shadowing technique (no repeat)" },
  { id: "d1_gemini", short: "🤖 Client Simulation", full: "Real Life Situation/Client Meeting Simulation with Gemini AI (Feedback + improved version)" },
  { id: "d1_speak", short: "🎤 3min Topic + Record", full: "Speak on One Topic (3 min) - Record yourself. Compare weekly progress" },
  { id: "d1_ted", short: "🎯 TED 1min + Repeat", full: "Listen TED channel (1 min) - repeat with body language, record final perfect part" }
];

const DAY2_TASKS = [
  { id: "d2_sentence", short: "📝 5 Words + Sentences", full: "Sentence Construction: new 5 words, 5 sentences each" },
  { id: "d2_current", short: "📰 Current Affairs", full: "Current affair daily from indiaBix" },
  { id: "d2_journal", short: "📔 5 Lines Journal", full: "5 Lines Daily Journal: best lines you spoke/heard" },
  { id: "d2_read", short: "📚 Read Aloud (10m)", full: "Read Aloud - any book (10 min)" },
  { id: "d2_friends_repeat", short: "📺 Friends + Repeat (5x)", full: "Watch Friends Episodes - Listen important dialogues and repeat each 5 times" },
  { id: "d2_mirror", short: "🪞 Mirror Talk", full: "Mirror Talk: Speak on any topic in front of mirror/camera" },
  { id: "d2_interview", short: "💼 Interview Practice", full: "Interview Question Practice Tech/HR with Gemini based on my CV" },
  { id: "d2_ppt", short: "📽️ Presentation Practice", full: "Presentation Practice: write script → read with script → without script" },
  { id: "d2_explain", short: "🔧 Project Explain", full: "Project/Work Explain: Explain daily one code/project/CV in English" },
  { id: "d2_intro", short: "👤 Who am I?", full: "Introduce yourself - Write script and practice with recording" }
];

const SUNDAY_TASKS = [
  { id: "sun_dress", short: "👔 Formal Dress", full: "Formal dress pehno" },
  { id: "sun_camera", short: "📹 Camera ON", full: "Camera ON" },
  { id: "sun_interview", short: "🎙️ 20min Mock Interview", full: "20 min full interview simulation - Tech + HR mix" }
];

// ===== HELPER FUNCTIONS =====
const getDayType = () => {
  const today = new Date();
  const day = today.getDay();
  if (day === 0) return "sunday";
  if (day === 1 || day === 3 || day === 5) return "day1";
  return "day2";
};

const getTongueTwisterForToday = () => {
  const today = new Date();
  const day = today.getDay();
  const twisterDay = day === 0 ? 6 : day;
  return TONGUE_TWISTERS.find(t => t.day === twisterDay) || TONGUE_TWISTERS[0];
};

// ===== MAIN COMPONENT =====
export default function EnglishChecklist({ streak, onStreakUpdate }) {
  const [checks, setChecks] = useState(() => {
    const saved = localStorage.getItem("englishChecklist");
    return saved ? JSON.parse(saved) : {};
  });
  
  const [expandedTask, setExpandedTask] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  // ✅ Export format state
  const [exportFormat, setExportFormat] = useState("json");
  
  const dayType = getDayType();
  const todayStr = new Date().toDateString();
  const todaysChecks = checks[todayStr] || {};
  const tongueTwister = getTongueTwisterForToday();
  
  // Get tasks based on day
  let tasks = [];
  if (dayType === "sunday") {
    tasks = SUNDAY_TASKS;
  } else if (dayType === "day1") {
    tasks = DAY1_TASKS;
  } else {
    tasks = DAY2_TASKS;
  }
  
  // Calculate progress
  const totalTasks = tasks.length;
  const completedCount = Object.entries(todaysChecks)
    .filter(([key, value]) => !key.startsWith('_') && value === true)
    .length;
  const progressPercent = Math.round((completedCount / totalTasks) * 100) || 0;
  
  // Save daily progress to history
  useEffect(() => {
    if (completedCount > 0) {
      setChecks(prev => {
        const updated = {
          ...prev,
          [todayStr]: {
            ...(prev[todayStr] || {}),
            _progress: progressPercent,
            _completed: completedCount,
            _total: totalTasks,
            _date: todayStr,
            _dayType: dayType
          }
        };
        localStorage.setItem("englishChecklist", JSON.stringify(updated));
        return updated;
      });
    }
  }, [completedCount, todayStr]);
  
  // Calculate English Streak
// EnglishChecklist.jsx mein calculateEnglishStreak function replace karo:

// EnglishChecklist mein yeh function replace kar:
const calculateEnglishStreak = () => {
  // 1. Saare completed dates nikaalo (jinme koi task true ho)
  const completedDates = Object.keys(checks)
    .filter(date => {
      const dayData = checks[date];
      return dayData && Object.entries(dayData)
        .some(([key, value]) => !key.startsWith('_') && value === true);
    })
    .map(date => new Date(date).toDateString()); // Normalize
  
  if (completedDates.length === 0) return 0;
  
  // 2. Aaj ki date
  const today = new Date().toDateString();
  
  // 3. Sabse recent completed date dhundo
  const sortedDates = [...completedDates].sort((a, b) => 
    new Date(b) - new Date(a)
  );
  
  // 4. Streak count karo (consecutive days from most recent)
  let streak = 1;
  let currentDate = new Date(sortedDates[0]);
  
  for (let i = 1; i < sortedDates.length; i++) {
    const prevDate = new Date(currentDate);
    prevDate.setDate(prevDate.getDate() - 1);
    const prevDateStr = prevDate.toDateString();
    
    if (sortedDates.includes(prevDateStr)) {
      streak++;
      currentDate = prevDate;
    } else {
      break;
    }
  }
  
  return streak;
};
  
  // Update streak
  useEffect(() => {
    const englishStreak = calculateEnglishStreak();
    if (onStreakUpdate) {
      onStreakUpdate(englishStreak);
    }
  }, [checks]);
  
  const toggleCheck = (taskId) => {
    setChecks(prev => {
      const updated = {
        ...prev,
        [todayStr]: {
          ...(prev[todayStr] || {}),
          [taskId]: !(prev[todayStr]?.[taskId] || false)
        }
      };
      localStorage.setItem("englishChecklist", JSON.stringify(updated));
      return updated;
    });
  };
  
  const resetToday = () => {
    if (window.confirm("Reset today's checklist?")) {
      setChecks(prev => {
        const updated = { ...prev };
        delete updated[todayStr];
        localStorage.setItem("englishChecklist", JSON.stringify(updated));
        return updated;
      });
    }
  };
  
  // ✅ EXPORT FUNCTION - Today's data
  const exportToday = () => {
    if (!checks[todayStr]) {
      alert("No data for today to export!");
      return;
    }
    
    const todayData = {
      date: todayStr,
      dayType: dayType,
      tasks: tasks.map(t => ({
        ...t,
        completed: todaysChecks[t.id] || false
      })),
      progress: {
        completed: completedCount,
        total: totalTasks,
        percentage: progressPercent
      },
      tongueTwister: tongueTwister.text,
      streak: calculateEnglishStreak()
    };
    
    const filename = `english_checklist_${todayStr.replace(/ /g, "_")}`;
    
    switch(exportFormat) {
      case "json":
        exportService.downloadFile(
          JSON.stringify(todayData, null, 2), 
          `${filename}.json`, 
          "application/json"
        );
        break;
      case "txt":
        const text = formatAsText(todayData);
        exportService.downloadFile(text, `${filename}.txt`, "text/plain");
        break;
      case "csv":
        const csv = formatAsCSV(todayData);
        exportService.downloadFile(csv, `${filename}.csv`, "text/csv");
        break;
    }
  };
  
  // ✅ EXPORT FUNCTION - All history
  const exportAll = () => {
    const allData = {
      exportDate: new Date().toISOString(),
      totalDays: Object.keys(checks).length,
      currentStreak: calculateEnglishStreak(),
      data: Object.entries(checks)
        .filter(([_, value]) => value._progress !== undefined)
        .sort((a, b) => new Date(b[0]) - new Date(a[0]))
        .map(([date, data]) => ({
          date,
          progress: data._progress || 0,
          completed: data._completed || 0,
          total: data._total || 0,
          dayType: data._dayType || 'unknown'
        }))
    };
    
    const filename = `english_checklist_all_${new Date().toISOString().split('T')[0]}`;
    exportService.downloadFile(
      JSON.stringify(allData, null, 2), 
      `${filename}.json`, 
      "application/json"
    );
  };
  
  // ✅ Format as Text
  const formatAsText = (data) => {
    let text = `ENGLISH PRACTICE CHECKLIST\n`;
    text += `========================\n`;
    text += `Date: ${data.date}\n`;
    text += `Day Type: ${data.dayType}\n`;
    text += `Streak: ${data.streak} days\n\n`;
    text += `PROGRESS: ${data.progress.completed}/${data.progress.total} (${data.progress.percentage}%)\n\n`;
    text += `TASKS:\n`;
    data.tasks.forEach(t => {
      text += `${t.completed ? '✅' : '⬜'} ${t.full}\n`;
    });
    text += `\nTONGUE TWISTER:\n${data.tongueTwister}\n`;
    return text;
  };
  
  // ✅ Format as CSV
  const formatAsCSV = (data) => {
    let csv = "Task ID,Task Name,Completed\n";
    data.tasks.forEach(t => {
      csv += `${t.id},"${t.full}",${t.completed}\n`;
    });
    return csv;
  };
  
  // Get progress history - LAST 7 DAYS (excluding today)
const progressHistory = Object.entries(checks)
  .filter(([date]) => date !== todayStr && checks[date]?._progress !== undefined)  // ✅ Today excluded
  .sort((a, b) => new Date(b[0]) - new Date(a[0]))
  .slice(0, 7)
  .map(([date, data]) => ({
    date,
    progress: data._progress || 0,
    completed: data._completed || 0,
    total: data._total || totalTasks,
    dayType: data._dayType || 'unknown'
  }));
  
  return (
    <div className="english-checklist-card">
      <div className="checklist-header">
        <div className="checklist-title">
          <span className="checklist-emoji">🇬🇧</span>
          <h3>English Practice</h3>
        </div>
        <div className="checklist-day-badge">
          {dayType === "sunday" ? "🎙️ Mock Sunday" : 
           dayType === "day1" ? "📘 Day 1 (Mon/Wed/Fri)" : 
           "📗 Day 2 (Tue/Thu/Sat)"}
        </div>
      </div>
      
      {/* ✅ EXPORT SECTION - Journal jaisa */}
      <div className="export-section">
        <div className="export-buttons">
          <button 
            className="export-btn"
            onClick={exportToday}
            disabled={!checks[todayStr]}
          >
            ⬇️ Export Today
          </button>
          <select 
            className="export-format-select"
            value={exportFormat}
            onChange={(e) => setExportFormat(e.target.value)}
          >
            <option value="json">JSON</option>
            <option value="txt">Text</option>
            <option value="csv">CSV</option>
          </select>
          <button 
            className="export-all-btn"
            onClick={exportAll}
            title="Export All History"
          >
            📦 Export All
          </button>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="checklist-progress">
        <div className="progress-text">
          <span>Today's Progress</span>
          <span>{completedCount}/{totalTasks} ({progressPercent}%)</span>
        </div>
        <div className="progress-bar-small">
          <div 
            className="progress-fill-small" 
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
      
      {/* Main Tasks Section */}
      <div className="checklist-section">
        <div className="section-title">
          <span>📋 Today's Tasks</span>
        </div>
        {tasks.map(task => (
          <div 
            key={task.id} 
            className={`checklist-item ${todaysChecks[task.id] ? 'completed' : ''}`}
            onClick={() => toggleCheck(task.id)}
            onMouseEnter={() => setExpandedTask(task.id)}
            onMouseLeave={() => setExpandedTask(null)}
          >
            <span className="check-box">
              {todaysChecks[task.id] ? '✅' : '⬜'}
            </span>
            <span className="task-text">
              {expandedTask === task.id ? task.full : task.short}
            </span>
          </div>
        ))}
      </div>
      
      {/* Tongue Twister Section */}
      <div className="tongue-twister-card">
        <div className="twister-icon">🗣️</div>
        <div className="twister-content">
          <div className="twister-label">Daily Tongue Twister</div>
          <div className="twister-text">{tongueTwister.text}</div>
        </div>
      </div>
      
      {/* History Toggle Button */}
      <button 
        className="history-toggle-btn"
        onClick={() => setShowHistory(!showHistory)}
      >
        {showHistory ? '📋 Hide History' : '📋 Show Daily Progress History'}
      </button>
      
      {/* Progress History Section */}
      {showHistory && (
        <div className="progress-history">
          <h4>📊 Last 7 Days Progress</h4>
          <div className="history-list">
            {progressHistory.length > 0 ? (
              progressHistory.map((day, index) => (
                <div key={index} className="history-progress-item">
                  <span className="history-date">
                    {new Date(day.date).toLocaleDateString('en-US', { 
                      weekday: 'short', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </span>
                  <div className="history-progress-bar-container">
                    <div 
                      className="history-progress-bar" 
                      style={{ width: `${day.progress}%` }}
                    />
                  </div>
                  <span className="history-percent">{day.progress}%</span>
                  <span className="history-count">{day.completed}/{day.total}</span>
                </div>
              ))
            ) : (
              <div className="no-history">No progress history yet. Complete tasks to see history!</div>
            )}
          </div>
        </div>
      )}
      
      {/* Footer Buttons */}
      <div className="checklist-footer">
        <button className="reset-btn-small" onClick={resetToday}>
          🔄 Reset Today
        </button>
        <span className="streak-badge-small">
          🔥 English Streak: {calculateEnglishStreak()} days
        </span>
      </div>
    </div>
  );
}