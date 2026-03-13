import { useState, useEffect } from "react";

const TASKS = [
  // 🧠 Mind & Meditation
  { id: "meditation", text: "Meditation 5 min + face yoga", category: "mind", emoji: "🧘" },
  
  // 🇬🇧 English
  { id: "english", text: "English practice", category: "english", emoji: "📚" },
  
  // 💧 Water & Ice
  { id: "water", text: "4 liter+ water with tracking app", category: "water", emoji: "💧" },
  { id: "ice", text: "One min ice cube on face", category: "water", emoji: "❄️" },
  
  // 👔 Grooming
  { id: "outfits", text: "Proper outfits daily (classy/old money)", category: "grooming", emoji: "👔" },
  
  // 💪 Gym & Asans
  { id: "asans", text: "Daily 7 Asans [30 sec each, total 1 min per asan]", category: "gym", emoji: "🧘‍♂️" },
  { id: "gym", text: "Gym workout (Push/Pull/Legs)", category: "gym", emoji: "🏋️" },
  
  // ⚡ Rules
  { id: "phone", text: "No Phone and No Earbuds, No Social media", category: "rules", emoji: "📵" },
  { id: "mindset", text: "No lust, Full Confidence and Be mature - don't act like kid", category: "rules", emoji: "🧠" },
  
  // 🧴 Skin
  { id: "rice_water", text: "Daily rice water Spray (1 time a day) if possible", category: "skin", emoji: "💦" },
  { id: "besan_pack", text: "Mon & Thu: besan + milk + honey + haldi (15 min)", category: "skin", emoji: "🧴" },
  { id: "beard_oil", text: "Beard oil & Eye cream before sleep", category: "skin", emoji: "✨" },
  { id: "foot_massage", text: "Talwe clean + 5 min coconut oil massage before sleep", category: "skin", emoji: "🦶" },
  { id: "hair_remedy", text: "Hair remedy: Amla, Reetha, Shikakai + vitamin E (20 min only)", category: "skin", emoji: "💇" },
  
  // 🥗 Diet
  { id: "soaked", text: "5 long + Souf soak overnight - drink water in morning", category: "diet", emoji: "🌰" },
  { id: "khajoor", text: "1 long, 1 Elaichi, 1 ginger, 1 lemon in khajoor - eat morning", category: "diet", emoji: "🌴" },
  { id: "supplements", text: "One spoon creatine + one whey protein", category: "diet", emoji: "💊" },
  { id: "milk_haldi", text: "Milk + haldi + ginger before sleep (if possible)", category: "diet", emoji: "🥛" },
  { id: "cucumber", text: "One Cucumber Daily", category: "diet", emoji: "🥒" },
  { id: "fruits", text: "2-3 banana + one anaar (sometimes pineapple chaat)", category: "diet", emoji: "🍌" },
  { id: "juice", text: "Juice: beetroot, carrot, tomato, orange, lemon, mint, turmeric", category: "diet", emoji: "🥤" },
  { id: "chia", text: "½ tsp chia seeds soaked + curd (one time daily)", category: "diet", emoji: "🥣" },
  { id: "lassi", text: "Kachi Lassi: 200ml water + 50ml milk + salt + 3-4 ice cubes", category: "diet", emoji: "🥛" },
  { id: "mint_chutni", text: "Mint Chutni with meals", category: "diet", emoji: "🌿" },
];

export default function ChallengeChecklist({ activeTab = "all", onProgressUpdate }) {
  const todayStr = new Date().toDateString();
  const [checks, setChecks] = useState(() => {
    // ✅ FIXED: challenge13 use karo
    const saved = localStorage.getItem("challenge13");
    return saved ? JSON.parse(saved) : {};
  });
  const [expandedTask, setExpandedTask] = useState(null);

  const todaysChecks = checks[todayStr] || {};

  // Filter tasks based on active tab
  const filteredTasks = activeTab === "all" 
    ? TASKS 
    : TASKS.filter(t => t.category === activeTab);

  // Calculate progress
  const totalTasks = TASKS.length;
  const completedCount = Object.values(todaysChecks).filter(v => v === true).length;
  const progressPercent = Math.round((completedCount / totalTasks) * 100) || 0;

  // Filtered section progress
  const filteredTotal = filteredTasks.length;
  const filteredCompleted = filteredTasks.filter(t => todaysChecks[t.id]).length;
  const filteredPercent = filteredTotal > 0 ? Math.round((filteredCompleted / filteredTotal) * 100) : 0;

  // Save daily progress
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
          }
        };
        // ✅ FIXED: challenge13 use karo
        localStorage.setItem("challenge13", JSON.stringify(updated));
        window.dispatchEvent(new Event('challenge13Updated'));
        return updated;
      });
    }
    
    if (onProgressUpdate) {
      onProgressUpdate(progressPercent, completedCount);
    }
  }, [completedCount, progressPercent, todayStr]);

  const toggleTask = (taskId) => {
    setChecks(prev => {
      const updated = {
        ...prev,
        [todayStr]: {
          ...(prev[todayStr] || {}),
          [taskId]: !(prev[todayStr]?.[taskId] || false)
        }
      };
      // ✅ FIXED: challenge13 use karo
      localStorage.setItem("challenge13", JSON.stringify(updated));
      window.dispatchEvent(new Event('challenge13Updated'));
      return updated;
    });
  };

  // Group tasks by category for "all" view
  const tasksByCategory = {};
  if (activeTab === "all") {
    TASKS.forEach(task => {
      if (!tasksByCategory[task.category]) {
        tasksByCategory[task.category] = [];
      }
      tasksByCategory[task.category].push(task);
    });
  }

  // Category display names
  const categoryNames = {
    mind: { name: "Mind & Meditation", emoji: "🧠" },
    english: { name: "English Practice", emoji: "🇬🇧" },
    water: { name: "Water & Ice", emoji: "💧" },
    grooming: { name: "Grooming", emoji: "👔" },
    gym: { name: "Gym & Asans", emoji: "💪" },
    rules: { name: "Rules & Mindset", emoji: "⚡" },
    skin: { name: "Skin Care", emoji: "🧴" },
    diet: { name: "Diet & Supplements", emoji: "🥗" }
  };

  return (
    <div className="challenge-checklist">
      {/* Section Header */}
      <div className="challenge-section-header">
        <div className="section-title-with-icon">
          <span className="section-icon-large">
            {activeTab === "all" ? "📋" : categoryNames[activeTab]?.emoji || "✅"}
          </span>
          <h4>
            {activeTab === "all" 
              ? "All Tasks" 
              : categoryNames[activeTab]?.name || "Tasks"}
          </h4>
        </div>
        <div className="section-progress-badge">
          <span>{filteredCompleted}/{filteredTotal}</span>
          <span className="section-percent-badge">{filteredPercent}%</span>
        </div>
      </div>

      {/* Tasks - NO SHORTENING, FULL TEXT */}
      <div className="category-tasks-container">
        {activeTab === "all" ? (
          // Show all categories with FULL TEXT
          Object.entries(tasksByCategory).map(([category, tasks]) => (
            <div key={category} className="category-section" style={{ marginBottom: '25px' }}>
              <div className="category-header">
                <span className="category-emoji">{categoryNames[category]?.emoji}</span>
                <h4>{categoryNames[category]?.name}</h4>
                <span className="category-count">
                  {tasks.filter(t => todaysChecks[t.id]).length}/{tasks.length}
                </span>
              </div>
              {tasks.map(task => (
                <div
                  key={task.id}
                  className={`task-item-modern ${todaysChecks[task.id] ? 'completed' : ''}`}
                  onClick={() => toggleTask(task.id)}
                >
                  <span className="task-checkbox-modern">
                    {todaysChecks[task.id] ? '✅' : '⬜'}
                  </span>
                  <span className="task-text-modern-full">{task.text}</span>
                  <span className="task-emoji-hint">{task.emoji}</span>
                </div>
              ))}
            </div>
          ))
        ) : (
          // Show single category with FULL TEXT
          filteredTasks.map(task => (
            <div
              key={task.id}
              className={`task-item-modern ${todaysChecks[task.id] ? 'completed' : ''}`}
              onClick={() => toggleTask(task.id)}
            >
              <span className="task-checkbox-modern">
                {todaysChecks[task.id] ? '✅' : '⬜'}
              </span>
              <span className="task-text-modern-full">{task.text}</span>
              <span className="task-emoji-hint">{task.emoji}</span>
            </div>
          ))
        )}
      </div>

      {/* Empty State */}
      {filteredTasks.length === 0 && (
        <div className="empty-state" style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          <span style={{ fontSize: '48px', display: 'block', marginBottom: '10px' }}>📭</span>
          <p>No tasks in this category</p>
        </div>
      )}
    </div>
  );
}