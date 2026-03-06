import { useState, useEffect } from "react";

const MOODS = [
  { emoji: "😊", label: "Great", color: "#4caf50", value: 5 },
  { emoji: "🙂", label: "Good", color: "#8bc34a", value: 4 },
  { emoji: "😐", label: "Okay", color: "#ffc107", value: 3 },
  { emoji: "😔", label: "Sad", color: "#ff9800", value: 2 },
  { emoji: "😫", label: "Struggling", color: "#f44336", value: 1 }
];

export default function MoodTracker({ date = new Date().toDateString() }) {
  const [selectedMood, setSelectedMood] = useState(null);
  const [note, setNote] = useState("");
  const [savedMoods, setSavedMoods] = useState(() => {
    const saved = localStorage.getItem("moodTracker");
    return saved ? JSON.parse(saved) : {};
  });

  // Load today's mood if exists
  useEffect(() => {
    if (savedMoods[date]) {
      setSelectedMood(savedMoods[date].mood);
      setNote(savedMoods[date].note || "");
    }
  }, [date]);

  const saveMood = () => {
    if (!selectedMood) return;

    const updatedMoods = {
      ...savedMoods,
      [date]: {
        mood: selectedMood,
        note: note,
        timestamp: new Date().toISOString()
      }
    };

    setSavedMoods(updatedMoods);
    localStorage.setItem("moodTracker", JSON.stringify(updatedMoods));
    
    // Show success message
    alert("✅ Mood saved for today!");
  };

  return (
    <div className="mood-tracker-card">
      <h3>📊 Daily Mood</h3>
      
      <div className="mood-emoji-grid">
        {MOODS.map((mood) => (
          <button
            key={mood.label}
            className={`mood-emoji-btn ${selectedMood === mood.label ? "selected" : ""}`}
            style={{
              backgroundColor: selectedMood === mood.label ? mood.color : "#f0f0f0",
              transform: selectedMood === mood.label ? "scale(1.1)" : "scale(1)"
            }}
            onClick={() => setSelectedMood(mood.label)}
          >
            <span className="mood-emoji-large">{mood.emoji}</span>
            <span className="mood-label">{mood.label}</span>
          </button>
        ))}
      </div>

      <textarea
        className="mood-note-input"
        placeholder="How are you feeling today? (optional)"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        rows="3"
      />

      <button 
        className="save-mood-btn"
        onClick={saveMood}
        disabled={!selectedMood}
      >
        💾 Save Today's Mood
      </button>

      {savedMoods[date] && (
        <div className="already-saved">
          ✅ Mood saved for today
        </div>
      )}
    </div>
  );
}