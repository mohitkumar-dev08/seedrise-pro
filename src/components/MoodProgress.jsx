import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const MOOD_VALUES = {
  "Great": 5,
  "Good": 4,
  "Okay": 3,
  "Sad": 2,
  "Struggling": 1
};

const MOOD_COLORS = {
  "Great": "#4caf50",
  "Good": "#8bc34a",
  "Okay": "#ffc107",
  "Sad": "#ff9800",
  "Struggling": "#f44336"
};

export default function MoodProgress() {
  const [moodData, setMoodData] = useState([]);
  const [view, setView] = useState("week"); // week, month

  useEffect(() => {
    // Load mood data from localStorage
    const saved = localStorage.getItem("moodTracker");
    if (saved) {
      const moods = JSON.parse(saved);
      
      // Convert to array and sort by date
      const moodArray = Object.entries(moods).map(([date, data]) => ({
        date,
        ...data,
        value: MOOD_VALUES[data.mood] || 3
      }));
      
      // Sort by date (recent first)
      moodArray.sort((a, b) => new Date(b.date) - new Date(a.date));
      
      // Get last 7 or 30 days
      const daysToShow = view === "week" ? 7 : 30;
      setMoodData(moodArray.slice(0, daysToShow).reverse());
    }
  }, [view]);

  const chartData = {
    labels: moodData.map(d => {
      const date = new Date(d.date);
      return `${date.getDate()}/${date.getMonth() + 1}`;
    }),
    datasets: [
      {
        label: "Mood Level",
        data: moodData.map(d => d.value),
        borderColor: "#764ba2",
        backgroundColor: "rgba(118, 75, 162, 0.1)",
        tension: 0.4,
        fill: true,
        pointBackgroundColor: moodData.map(d => MOOD_COLORS[d.mood]),
        pointBorderColor: "white",
        pointRadius: 6,
        pointHoverRadius: 8
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    scales: {
      y: {
        min: 0.5,
        max: 5.5,
        ticks: {
          stepSize: 1,
          callback: (value) => {
            const moods = ["", "Struggling", "Sad", "Okay", "Good", "Great"];
            return moods[value] || "";
          }
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const mood = moodData[context.dataIndex]?.mood || "Unknown";
            const note = moodData[context.dataIndex]?.note;
            return [`Mood: ${mood}`, note ? `Note: ${note}` : ""];
          }
        }
      }
    }
  };

  // Calculate mood statistics
  const avgMood = moodData.reduce((sum, d) => sum + d.value, 0) / moodData.length || 0;
  const bestMood = Math.max(...moodData.map(d => d.value)) || 0;
  const worstMood = Math.min(...moodData.map(d => d.value)) || 0;

  const getMoodTrend = () => {
    if (moodData.length < 2) return "neutral";
    const first = moodData[0]?.value || 3;
    const last = moodData[moodData.length - 1]?.value || 3;
    if (last > first) return "up";
    if (last < first) return "down";
    return "neutral";
  };

  return (
    <div className="mood-progress-card">
      <h3>📈 Mood Progress</h3>

      <div className="mood-stats-row">
        <div className="mood-stat">
          <span className="stat-label">Average</span>
          <strong>{avgMood.toFixed(1)} / 5</strong>
          <span className="mood-emoji-small">
            {avgMood >= 4 ? "😊" : avgMood >= 3 ? "🙂" : avgMood >= 2 ? "😐" : "😔"}
          </span>
        </div>
        <div className="mood-stat">
          <span className="stat-label">Best</span>
          <strong>{bestMood}</strong>
          <span className="mood-emoji-small">
            {Object.keys(MOOD_VALUES).find(key => MOOD_VALUES[key] === bestMood)?.slice(0, 2)}
          </span>
        </div>
        <div className="mood-stat">
          <span className="stat-label">Trend</span>
          <strong>
            {getMoodTrend() === "up" && "📈 Improving"}
            {getMoodTrend() === "down" && "📉 Declining"}
            {getMoodTrend() === "neutral" && "➡️ Stable"}
          </strong>
        </div>
      </div>

      <div className="view-toggle">
        <button 
          className={view === "week" ? "active" : ""}
          onClick={() => setView("week")}
        >
          Last 7 Days
        </button>
        <button 
          className={view === "month" ? "active" : ""}
          onClick={() => setView("month")}
        >
          Last 30 Days
        </button>
      </div>

      <div className="chart-container">
        <Line data={chartData} options={chartOptions} />
      </div>

      {/* Recent moods list */}
      <div className="recent-moods">
        <h4>Recent Entries</h4>
        {moodData.slice(-5).reverse().map((mood, i) => (
          <div key={i} className="recent-mood-item">
            <span className="recent-date">
              {new Date(mood.date).toLocaleDateString('en-US', { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric' 
              })}
            </span>
            <span className="recent-mood-emoji">
              {MOODS.find(m => m.label === mood.mood)?.emoji || "😐"}
            </span>
            <span className="recent-mood-label">{mood.mood}</span>
            {mood.note && <span className="recent-mood-note">📝</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

// Moods array for emoji lookup
const MOODS = [
  { emoji: "😊", label: "Great" },
  { emoji: "🙂", label: "Good" },
  { emoji: "😐", label: "Okay" },
  { emoji: "😔", label: "Sad" },
  { emoji: "😫", label: "Struggling" }
];