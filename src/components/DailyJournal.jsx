// components/DailyJournal.jsx
import { useState, useEffect } from "react";
import { exportService } from "../services/exportService";

const PRODUCTIVITY_LEVELS = [
  { value: 1, label: "🌟 Very Low", emoji: "😴" },
  { value: 2, label: "⭐ Low", emoji: "😐" },
  { value: 3, label: "⚡ Average", emoji: "🙂" },
  { value: 4, label: "💪 Good", emoji: "😊" },
  { value: 5, label: "🚀 Excellent", emoji: "🤩" }
];

export default function DailyJournal({ date = new Date().toDateString() }) {
  const [journalData, setJournalData] = useState({
    goals: "",
    actualWork: "",
    learnings: "",
    challenges: "",
    solutions: "",
    productivity: 3,
    nextPlan: ""
  });
  
  const [savedJournals, setSavedJournals] = useState(() => {
    const saved = localStorage.getItem("dailyJournals");
    return saved ? JSON.parse(saved) : {};
  });

  const [isSaved, setIsSaved] = useState(false);
  const [exportFormat, setExportFormat] = useState("json"); // json, txt, csv

  // Load today's journal if exists
  useEffect(() => {
    if (savedJournals[date]) {
      setJournalData(savedJournals[date]);
      setIsSaved(true);
    } else {
      // Reset for new day
      setJournalData({
        goals: "",
        actualWork: "",
        learnings: "",
        challenges: "",
        solutions: "",
        productivity: 3,
        nextPlan: ""
      });
      setIsSaved(false);
    }
  }, [date]);

  const handleChange = (field, value) => {
    setJournalData(prev => ({
      ...prev,
      [field]: value
    }));
    setIsSaved(false);
  };

  const saveJournal = () => {
    const updatedJournals = {
      ...savedJournals,
      [date]: {
        ...journalData,
        lastUpdated: new Date().toISOString(),
        date: date
      }
    };

    setSavedJournals(updatedJournals);
    localStorage.setItem("dailyJournals", JSON.stringify(updatedJournals));
    setIsSaved(true);
    
    // Show success message
    alert("✅ Journal saved for today!");
  };

  const exportJournal = (format) => {
    const journalForDate = savedJournals[date];
    if (!journalForDate) {
      alert("No journal entry found for today!");
      return;
    }

    let exported = "";
    const filename = `journal_${date.replace(/ /g, "_")}`;

    switch(format) {
      case "json":
        exported = JSON.stringify(journalForDate, null, 2);
        exportService.downloadFile(exported, `${filename}.json`, "application/json");
        break;
      
      case "txt":
        exported = exportService.formatAsText(journalForDate);
        exportService.downloadFile(exported, `${filename}.txt`, "text/plain");
        break;
      
      case "csv":
        exported = exportService.formatAsCSV(journalForDate);
        exportService.downloadFile(exported, `${filename}.csv`, "text/csv");
        break;
      
      case "pdf":
        exportService.exportAsPDF(journalForDate, filename);
        break;
    }
  };

  const exportAllJournals = () => {
    const journals = Object.values(savedJournals);
    if (journals.length === 0) {
      alert("No journals found!");
      return;
    }

    const data = {
      exportDate: new Date().toISOString(),
      totalEntries: journals.length,
      journals: journals.sort((a, b) => new Date(b.date) - new Date(a.date))
    };

    const filename = `all_journals_${new Date().toISOString().split('T')[0]}`;
    const exported = JSON.stringify(data, null, 2);
    exportService.downloadFile(exported, `${filename}.json`, "application/json");
  };

  const getProductivityEmoji = (value) => {
    return PRODUCTIVITY_LEVELS.find(p => p.value === value)?.emoji || "⚡";
  };

  return (
    <div className="daily-journal-card">
      <div className="journal-header">
        <h3>📔 Daily Journal</h3>
        <div className="journal-date">
          {new Date(date).toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* Export Options */}
      <div className="export-section">
        <div className="export-buttons">
          <button 
            className="export-btn"
            onClick={() => exportJournal(exportFormat)}
            disabled={!savedJournals[date]}
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
            <option value="pdf">PDF</option>
          </select>
          <button 
            className="export-all-btn"
            onClick={exportAllJournals}
            title="Export All Journals"
          >
            📦 Export All
          </button>
        </div>
      </div>

      {/* Journal Form */}
      <div className="journal-form">
        {/* Aaj ke Goals */}
        <div className="journal-field">
          <label>
            <span className="field-icon">🎯</span>
            Today’s Goals (Planned Tasks)
          </label>
          <textarea
            value={journalData.goals}
            onChange={(e) => handleChange("goals", e.target.value)}
            placeholder="What do you plan to achieve today?"
            rows="2"
          />
        </div>

        {/* Aaj kya kiya */}
        <div className="journal-field">
          <label>
            <span className="field-icon">✅</span>
            What did you do today?
          </label>
          <textarea
            value={journalData.actualWork}
            onChange={(e) => handleChange("actualWork", e.target.value)}
            placeholder="What did you actually accomplish?"
            rows="2"
          />
        </div>

        {/* Kya naya seekha */}
        <div className="journal-field">
          <label>
            <span className="field-icon">📚</span>
            What did you learn?
          </label>
          <textarea
            value={journalData.learnings}
            onChange={(e) => handleChange("learnings", e.target.value)}
            placeholder="What new things did you learn today?"
            rows="2"
          />
        </div>

        {/* Challenges / Problems */}
        <div className="journal-field">
          <label>
            <span className="field-icon">⚠️</span>
            Challenges / Problems
          </label>
          <textarea
            value={journalData.challenges}
            onChange={(e) => handleChange("challenges", e.target.value)}
            placeholder="What challenges did you face?"
            rows="2"
          />
        </div>

        {/* Solutions / Improvements */}
        <div className="journal-field">
          <label>
            <span className="field-icon">💡</span>
            Solutions / Improvements
          </label>
          <textarea
            value={journalData.solutions}
            onChange={(e) => handleChange("solutions", e.target.value)}
            placeholder="How did you solve them? What can be improved?"
            rows="2"
          />
        </div>

        {/* Productivity Rating */}
        <div className="journal-field">
          <label>
            <span className="field-icon">📊</span>
            Productivity Rating
          </label>
          <div className="productivity-rating">
            {PRODUCTIVITY_LEVELS.map(level => (
              <button
                key={level.value}
                className={`rating-btn ${journalData.productivity === level.value ? 'selected' : ''}`}
                onClick={() => handleChange("productivity", level.value)}
                style={{
                  background: journalData.productivity === level.value 
                    ? `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`
                    : '#f0f0f0'
                }}
              >
                <span className="rating-emoji">{level.emoji}</span>
                <span className="rating-label">{level.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Kal ka Plan */}
        <div className="journal-field">
          <label>
            <span className="field-icon">📅</span>
            Kal ka Plan
          </label>
          <textarea
            value={journalData.nextPlan}
            onChange={(e) => handleChange("nextPlan", e.target.value)}
            placeholder="What's your plan for tomorrow?"
            rows="2"
          />
        </div>

        {/* Save Button */}
        <div className="journal-actions">
          <button 
            className="save-journal-btn"
            onClick={saveJournal}
          >
            {isSaved ? '✅ Saved' : '💾 Save Journal'}
          </button>
          
          {isSaved && (
            <span className="saved-indicator">
              ✨ Last saved: {new Date().toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>

      {/* Recent Journals Preview */}
      {Object.keys(savedJournals).length > 0 && (
        <div className="recent-journals">
          <h4>📋 Recent Entries</h4>
          <div className="recent-list">
            {Object.entries(savedJournals)
              .sort((a, b) => new Date(b[0]) - new Date(a[0]))
              .slice(0, 3)
              .map(([journalDate, journal]) => (
                <div 
                  key={journalDate} 
                  className={`recent-item ${journalDate === date ? 'current' : ''}`}
                  onClick={() => {
                    // Load this journal entry
                    setJournalData(journal);
                    setIsSaved(true);
                  }}
                >
                  <span className="recent-date">
                    {new Date(journalDate).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </span>
                  <span className="recent-productivity">
                    {getProductivityEmoji(journal.productivity)}
                  </span>
                  <span className="recent-preview">
                    {journal.goals?.substring(0, 20)}...
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}