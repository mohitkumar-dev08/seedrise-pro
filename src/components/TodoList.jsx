// components/TodoList.jsx
import { useState, useEffect } from "react";
import { exportService } from "../services/exportService";

export default function TodoList() {
  const [todoData, setTodoData] = useState(() => {
    const saved = localStorage.getItem("todoList");
    return saved ? JSON.parse(saved) : {};
  });
  
  const [expandedSection, setExpandedSection] = useState(null);
  const [activeTab, setActiveTab] = useState("todo");
  const [showHistory, setShowHistory] = useState(false);
  const [exportFormat, setExportFormat] = useState("json");
  
  const todayStr = new Date().toDateString();
  const todaysData = todoData[todayStr] || {};
  
  // ===== 25 DAYS TIMER =====
  const totalDaysGoal = 22; // 25 days ka goal
  
  // ===== STREAK MILESTONES (3,9,15,21,27,30,32) =====
  const streakMilestones = [3, 9, 15, 21, 27, 30, 32];
  
  const streakAchievements = {
    3: { emoji: "🌱", name: "Beginner", desc: "3 days - Started the journey!" },
    9: { emoji: "🌿", name: "Growing", desc: "9 days - Building consistency" },
    15: { emoji: "🍃", name: "Strong", desc: "15 days - Half month strong" },
    21: { emoji: "🌲", name: "Dedicated", desc: "21 days - 3 weeks mastered" },
    27: { emoji: "⭐", name: "Warrior", desc: "27 days - Almost there" },
    30: { emoji: "🔥", name: "Champion", desc: "30 days - Monthly legend" },
    32: { emoji: "👑", name: "ULTIMATE LEGEND", desc: "32 DAYS - YOU ARE UNSTOPPABLE!" }
  };
  
  // Current streak (number of days with data)
  const currentStreak = Object.keys(todoData).filter(date => {
    const dayData = todoData[date];
    if (!dayData) return false;
    
    // Check if any task is completed in any section
    const sections = ['todo', 'rules', 'skin', 'gym', 'diet'];
    for (let section of sections) {
      const sectionData = dayData[section];
      if (sectionData) {
        const hasCompleted = Object.values(sectionData).some(v => v === true);
        if (hasCompleted) return true;
      }
    }
    return false;
  }).length;

  // ===== REMAINING DAYS CALCULATION =====
  const remainingDays = Math.max(0, totalDaysGoal - currentStreak);
  
  // Find next milestone
  const nextMilestone = streakMilestones.find(m => m > currentStreak) || null;
  const progressToNext = nextMilestone 
    ? Math.round((currentStreak / nextMilestone) * 100) 
    : 100;
  
  // Get unlocked achievements
  const unlockedCount = streakMilestones.filter(m => currentStreak >= m).length;
  const totalMilestones = streakMilestones.length;
  
  // ===== TASKS DATA =====
  const todoTasks = [
    { id: "todo_med1", text: "Meditation 5 Min (3 finger straight + 2 min visualize) - Morning" },
    { id: "todo_english", text: "English Practice" },
    { id: "todo_read", text: "Read Children English stories book" },
    { id: "todo_med2", text: "Meditation 5 Min Simple + Face Yoga" },
    { id: "todo_water", text: "4 liter+ water track with app" },
    { id: "todo_face", text: "Face Structure Exercise (WhatsApp saved video)" },
    { id: "todo_ice", text: "One min Ice Cube on face" },
    { id: "todo_grooming", text: "Grooming & well fitted outfits / old money / formal classy look" },
    { id: "todo_asans", text: "Daily 7 Asans [30 sec each, total 1 min per asan]" } // ✅ NEW ASANS ADDED
  ];
  
  const rulesTasks = [
    { id: "rule_earbuds", text: "No Earbuds (use wire earphones if needed)" },
    { id: "rule_phone", text: "No Phone Use without Reason" },
    { id: "rule_social", text: "No social media" },
    { id: "rule_sugar", text: "No Sugar" },
    { id: "rule_junk", text: "No Junk Food" },
    { id: "rule_stress", text: "No Stress of anything" },
    { id: "rule_mature", text: "Be mature - don't act like kid" },
    { id: "rule_kind", text: "Be Kind & Positive Attitude with Everyone" },
    { id: "rule_confidence", text: "Full Confidence & Roab" },
    { id: "rule_mindset", text: "Ajj he hai jo hai, kal kuch nahi - enjoy" },
    { id: "rule_lust", text: "No lust of girls" },
    { id: "rule_negativity", text: "No negative talk of anyone" },
    { id: "rule_expectations", text: "No expectations & no attachment" }
  ];
  
  const skinTasks = [
    { id: "skin_rice", text: "Daily rice water Spray (1 time a day) if possible" },
    { id: "skin_mon_thu", text: "Mon & Thu: besan + milk + honey + haldi (15 min)" },
    { id: "skin_beard", text: "Beard oil & Eye cream before sleep" },
    { id: "skin_feet", text: "Talwe clean + 5 min coconut oil massage before sleep" },
    { id: "skin_hair", text: "Hair remedy: Amla, Reetha, Shikakai + vit E - Tue & Fri (20 min)" },
    { id: "skin_serum", text: "Use hair serum before night" } // ✅ NEW HAIR SERUM ADDED
  ];
  
  const gymTasks = [
    { id: "gym_push", text: "Push Day: Chest(2), Shoulder(2), Triceps(2) + 100 Incline Push Ups" },
    { id: "gym_pull", text: "Pull Day: Back(3) + Biceps(2) + Forearms(2) + Traps" },
    { id: "gym_leg", text: "Leg Day: Leg + Abs + Sprint (30 sec × 4)" }
  ];
  
  const dietTasks = [
    { id: "diet_soaked", text: "5 long + Souf soak overnight - drink water in morning" },
    { id: "diet_khajoor", text: "1 long, 1 Elaichi, 1 ginger, 1 lemon in khajoor - eat morning" },
    { id: "diet_supplements", text: "One spoon creatine + one whey protein" },
    { id: "diet_milk", text: "Milk + haldi + ginger before sleep (if possible)" },
    { id: "diet_cucumber", text: "One Cucumber Daily" },
    { id: "diet_fruits", text: "2-3 banana + one anaar (sometimes pineapple chaat)" },
    { id: "diet_bread", text: "4 bread pack with college tiffin" },
    { id: "diet_juice", text: "Juice: beetroot, carrot, tomato, orange, lemon, mint, turmeric" },
    { id: "diet_chia", text: "½ tsp chia seeds soaked + curd (one time daily)" },
    { id: "diet_kachi_lassi", text: "Kachi Lassi: 200ml water + 50ml milk + salt + 3-4 ice cubes" }, // ✅ NEW LASSI ADDED
    { id: "diet_mint_chatni", text: "Mint Chutni with meals" } // ✅ NEW MINT CHATNI ADDED
  ];
  
  const sectionTaskCounts = {
    todo: todoTasks.length,
    rules: rulesTasks.length,
    skin: skinTasks.length,
    gym: gymTasks.length,
    diet: dietTasks.length
  };
  
  const getCurrentTasks = () => {
    switch(activeTab) {
      case "todo": return todoTasks;
      case "rules": return rulesTasks;
      case "skin": return skinTasks;
      case "gym": return gymTasks;
      case "diet": return dietTasks;
      default: return todoTasks;
    }
  };
  
    const currentTasks = getCurrentTasks();
  const sectionTasks = todaysData[activeTab] || {};
  
  // completedCount ko pehle calculate karo
  let completedCount = Object.values(sectionTasks).filter(v => v === true).length;
  const totalTasks = currentTasks.length;
  
  // Calculate progress percentage - special handling for gym
  let progressPercent = 0;
  if (activeTab === "gym") {
    // Gym me agar koi bhi 1 task select hai to 100%, else 0%
    const hasAnySelected = completedCount > 0;
    progressPercent = hasAnySelected ? 100 : 0;
    // Display ke liye completed count ko 1 ya 0 karo
    completedCount = hasAnySelected ? 1 : 0;
  } else {
    // Baaki sections ke liye normal calculation
    progressPercent = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;
  }
  
  const calculateOverallProgress = () => {
  let totalCompleted = 0;
  let totalAllTasks = 0;
  
  const allSections = ["todo", "rules", "skin", "gym", "diet"];
  
  allSections.forEach(section => {
    const sectionData = todaysData[section] || {};
    
    if (section === "gym") {
      // GYM SPECIAL HANDLING - Sirf 1 task count karo
      const gymCompleted = Object.values(sectionData).some(v => v === true) ? 1 : 0;
      totalCompleted += gymCompleted;
      totalAllTasks += 1; // Gym ka sirf 1 task count hoga total mein
    } else {
      // BAAKI SECTIONS - Normal count
      const sectionCompleted = Object.values(sectionData).filter(v => v === true).length;
      totalCompleted += sectionCompleted;
      totalAllTasks += sectionTaskCounts[section];
    }
  });
  
  return {
    completed: totalCompleted,
    total: totalAllTasks,
    percent: totalAllTasks > 0 ? Math.round((totalCompleted / totalAllTasks) * 100) : 0
  };
};
  
  const overall = calculateOverallProgress();
  
  useEffect(() => {
    if (overall.completed > 0) {
      setTodoData(prev => {
        const updated = {
          ...prev,
          [todayStr]: {
            ...(prev[todayStr] || {}),
            ...todaysData,
            _progress: overall.percent,
            _completed: overall.completed,
            _total: overall.total,
            _date: todayStr
          }
        };
        localStorage.setItem("todoList", JSON.stringify(updated));
        return updated;
      });
    }
  }, [overall.completed, overall.percent, todayStr]);
  
  const toggleTask = (taskId) => {
  setTodoData(prev => {
    // AGAR ACTIVE TAB GYM HAI TO SPECIAL HANDLING
    if (activeTab === "gym") {
      const currentGymTasks = prev[todayStr]?.[activeTab] || {};
      
      // Check if clicking the same task that's already selected
      const isSelected = currentGymTasks[taskId] === true;
      
      let updatedGymTasks = {};
      
      if (isSelected) {
        // Same task click - UNSELECT it (sab off)
        gymTasks.forEach(task => {
          updatedGymTasks[task.id] = false;
        });
      } else {
        // Different task click - SELECT only this one
        gymTasks.forEach(task => {
          updatedGymTasks[task.id] = task.id === taskId;
        });
      }
      
      const updated = {
        ...prev,
        [todayStr]: {
          ...(prev[todayStr] || {}),
          [activeTab]: updatedGymTasks
        }
      };
      localStorage.setItem("todoList", JSON.stringify(updated));
      return updated;
    }
    
    // BAAKI SECTIONS KE LIYE NORMAL TOGGLE (multiple select allowed)
    const updated = {
      ...prev,
      [todayStr]: {
        ...(prev[todayStr] || {}),
        [activeTab]: {
          ...(prev[todayStr]?.[activeTab] || {}),
          [taskId]: !(prev[todayStr]?.[activeTab]?.[taskId] || false)
        }
      }
    };
    localStorage.setItem("todoList", JSON.stringify(updated));
    return updated;
  });
};
  
  const resetToday = () => {
    if (window.confirm("Reset today's todo list?")) {
      setTodoData(prev => {
        const updated = { ...prev };
        delete updated[todayStr];
        localStorage.setItem("todoList", JSON.stringify(updated));
        return updated;
      });
    }
  };
  
  const progressHistory = Object.entries(todoData)
    .filter(([date]) => date !== todayStr && todoData[date]?._progress !== undefined)
    .sort((a, b) => new Date(b[0]) - new Date(a[0]))
    .slice(0, 7)
    .map(([date, data]) => ({
      date,
      progress: data._progress || 0,
      completed: data._completed || 0,
      total: data._total || overall.total
    }));
  
  const exportToday = () => {
    if (!todoData[todayStr]) {
      alert("No data for today to export!");
      return;
    }
    
    const todayData = {
      date: todayStr,
      streak: currentStreak,
      remainingDays: remainingDays,
      goal: totalDaysGoal,
      achievements: {
        unlocked: unlockedCount,
        total: totalMilestones,
        nextMilestone: nextMilestone
      },
      overall: overall,
      sections: {
        todo: { completed: Object.values(todaysData.todo || {}).filter(v => v).length, total: todoTasks.length },
        rules: { completed: Object.values(todaysData.rules || {}).filter(v => v).length, total: rulesTasks.length },
        skin: { completed: Object.values(todaysData.skin || {}).filter(v => v).length, total: skinTasks.length },
        gym: { completed: Object.values(todaysData.gym || {}).filter(v => v).length, total: gymTasks.length },
        diet: { completed: Object.values(todaysData.diet || {}).filter(v => v).length, total: dietTasks.length }
      }
    };
    
    const filename = `todo_${todayStr.replace(/ /g, "_")}`;
    
    switch(exportFormat) {
      case "json":
        exportService.downloadFile(JSON.stringify(todayData, null, 2), `${filename}.json`, "application/json");
        break;
      case "csv":
        let csv = "Section,Completed,Total,Percentage\n";
        Object.entries(todayData.sections).forEach(([section, data]) => {
          csv += `${section},${data.completed},${data.total},${Math.round(data.completed/data.total*100)}%\n`;
        });
        csv += `Overall,${todayData.overall.completed},${todayData.overall.total},${todayData.overall.percent}%`;
        exportService.downloadFile(csv, `${filename}.csv`, "text/csv");
        break;
    }
  };
  
  const exportAll = () => {
    const allData = {
      exportDate: new Date().toISOString(),
      totalDays: Object.keys(todoData).length,
      currentStreak: currentStreak,
      remainingDays: remainingDays,
      goal: totalDaysGoal,
      achievements: {
        unlocked: unlockedCount,
        total: totalMilestones,
        list: streakMilestones.map(m => ({
          day: m,
          unlocked: currentStreak >= m,
          name: streakAchievements[m].name
        }))
      },
      data: progressHistory.map(day => ({
        date: day.date,
        progress: day.progress,
        completed: day.completed,
        total: day.total
      }))
    };
    
    const filename = `todo_all_${new Date().toISOString().split('T')[0]}`;
    exportService.downloadFile(JSON.stringify(allData, null, 2), `${filename}.json`, "application/json");
  };
  
  const getSectionTitle = () => {
    switch(activeTab) {
      case "todo": return "📝 To Do List";
      case "rules": return "⚡ Must Know & Follow";
      case "skin": return "🧴 Skin Care";
      case "gym": return "💪 Gym";
      case "diet": return "🥗 Diet";
      default: return "To Do";
    }
  };
  
  const getSectionIcon = () => {
    switch(activeTab) {
      case "todo": return "📝";
      case "rules": return "⚡";
      case "skin": return "🧴";
      case "gym": return "💪";
      case "diet": return "🥗";
      default: return "📋";
    }
  };
  
  return (
    <div className="todo-list-card">
      <div className="todo-header">
        <div className="todo-title">
          <span className="todo-icon">📋</span>
          <h3>Daily Tasks</h3>
        </div>
        <div className="todo-date">{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</div>
      </div>
      
      {/* ===== 25 DAYS TIMER - EXACTLY LIKE MAIN PAGE ===== */}
      <div className="digital-timer" style={{ marginTop: '0', marginBottom: '20px' }}>
        ⏳ {remainingDays} Days Left
      </div>
      
      {/* ===== STREAK ACHIEVEMENTS - EXACTLY LIKE ENGLISH ACHIEVEMENTS ===== */}
      <div className="streak-achievements-card">
        <div className="achievements-header">
          <span className="achievements-icon">🏆</span>
          <h4>Streak Achievements</h4>
          <span className="streak-indicator">🔥 {currentStreak}d</span>
        </div>
        
        {/* Next Milestone */}
        <div className="next-milestone">
          <div className="milestone-label">
            <span>Next: <strong>{nextMilestone ? `${nextMilestone}d` : 'Completed'}</strong></span>
            <span>{nextMilestone ? progressToNext : 100}%</span>
          </div>
          <div className="milestone-progress-bar">
            <div className="milestone-progress-fill" style={{ width: `${nextMilestone ? progressToNext : 100}%` }} />
          </div>
          <div className="milestone-days">{currentStreak} / {nextMilestone || totalMilestones} days</div>
        </div>
        
        {/* Badges Grid - 4+3 = 7 badges */}
        <div className="badges-grid">
          {/* First Row - 4 badges */}
          {streakMilestones.slice(0, 4).map((milestone) => {
            const unlocked = currentStreak >= milestone;
            const details = streakAchievements[milestone];
            
            return (
              <div key={milestone} className={`badge-item ${unlocked ? 'unlocked' : 'locked'}`} title={details.desc}>
                <div className="badge-emoji">{unlocked ? details.emoji : '🔒'}</div>
                <div className="badge-name">{milestone}d</div>
              </div>
            );
          })}
        </div>
        
        {/* Second Row - 3 badges */}
        <div className="badges-grid second-row">
          {streakMilestones.slice(4).map((milestone) => {
            const unlocked = currentStreak >= milestone;
            const details = streakAchievements[milestone];
            const isUltimate = milestone === 32;
            
            return (
              <div 
                key={milestone} 
                className={`badge-item ${unlocked ? 'unlocked' : 'locked'} ${isUltimate && unlocked ? 'ultimate-badge' : ''}`} 
                title={details.desc}
              >
                <div className="badge-emoji">{unlocked ? details.emoji : '🔒'}</div>
                <div className="badge-name">{milestone}d</div>
                {isUltimate && unlocked && <div className="badge-crown">👑</div>}
              </div>
            );
          })}
        </div>
        
        {/* Summary */}
        <div className="achievements-summary">
          <span>{unlockedCount} / {totalMilestones} Achievements</span>
          <span className="summary-percent">{Math.round((unlockedCount/totalMilestones)*100)}%</span>
        </div>
      </div>
      
      {/* Overall Progress */}
      <div className="todo-overall-progress">
        <div className="progress-label">
          <span>Overall Progress</span>
          <span>{overall.completed}/{overall.total} ({overall.percent}%)</span>
        </div>
        <div className="progress-bar-todo">
          <div className="progress-fill-todo" style={{ width: `${overall.percent}%` }} />
        </div>
      </div>
      
      {/* Section Tabs */}
      <div className="todo-tabs">
        <button className={`todo-tab ${activeTab === 'todo' ? 'active' : ''}`} onClick={() => setActiveTab('todo')}>📝 Todo</button>
        <button className={`todo-tab ${activeTab === 'rules' ? 'active' : ''}`} onClick={() => setActiveTab('rules')}>⚡ Rules</button>
        <button className={`todo-tab ${activeTab === 'skin' ? 'active' : ''}`} onClick={() => setActiveTab('skin')}>🧴 Skin</button>
        <button className={`todo-tab ${activeTab === 'gym' ? 'active' : ''}`} onClick={() => setActiveTab('gym')}>💪 Gym</button>
        <button className={`todo-tab ${activeTab === 'diet' ? 'active' : ''}`} onClick={() => setActiveTab('diet')}>🥗 Diet</button>
      </div>
      
      {/* Section Header */}
      <div className="todo-section-header">
        <div className="section-title-with-icon">
          <span className="section-icon">{getSectionIcon()}</span>
          <h4>{getSectionTitle()}</h4>
        </div>
        <div className="section-progress-small">
          <span>{completedCount}/{totalTasks}</span>
          <span className="section-percent">{progressPercent}%</span>
        </div>
      </div>
      
      {/* Tasks */}
      <div className="todo-tasks">
        {currentTasks.map(task => (
          <div key={task.id} className={`todo-item ${sectionTasks[task.id] ? 'completed' : ''}`} onClick={() => toggleTask(task.id)} onMouseEnter={() => setExpandedSection(task.id)} onMouseLeave={() => setExpandedSection(null)}>
            <span className="todo-checkbox">{sectionTasks[task.id] ? '✅' : '⬜'}</span>
            <span className="todo-text">{expandedSection === task.id ? task.text : task.text.length > 40 ? task.text.substring(0, 40) + '...' : task.text}</span>
          </div>
        ))}
      </div>
      
      {/* Export Section */}
      <div className="todo-export-section">
        <div className="export-buttons">
          <button className="export-btn" onClick={exportToday} disabled={!todoData[todayStr]}>⬇️ Export Today</button>
          <select className="export-format-select" value={exportFormat} onChange={(e) => setExportFormat(e.target.value)}>
            <option value="json">JSON</option>
            <option value="csv">CSV</option>
          </select>
          <button className="export-all-btn" onClick={exportAll}>📦 Export All</button>
        </div>
      </div>
      
      {/* History Toggle */}
      <button className="history-toggle-btn" onClick={() => setShowHistory(!showHistory)}>
        {showHistory ? '📋 Hide History' : '📋 Show Daily Progress History'}
      </button>
      
      {/* Progress History */}
      {showHistory && (
        <div className="progress-history">
          <h4>📊 Last 7 Days Progress</h4>
          <div className="history-list">
            {progressHistory.length > 0 ? (
              progressHistory.map((day, index) => (
                <div key={index} className="history-progress-item">
                  <span className="history-date">{new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                  <div className="history-progress-bar-container"><div className="history-progress-bar" style={{ width: `${day.progress}%` }} /></div>
                  <span className="history-percent">{day.progress}%</span>
                  <span className="history-count">{day.completed}/{day.total}</span>
                </div>
              ))
            ) : (
              <div className="no-history">No progress history yet.</div>
            )}
          </div>
        </div>
      )}
      
      {/* Footer */}
      <div className="todo-footer">
        <button className="todo-reset-btn" onClick={resetToday}>🔄 Reset Today</button>
        <span className="todo-streak">🔥 Streak: {currentStreak} days</span>
      </div>
    </div>
  );
}