// components/GymTarget.jsx
import { useState, useEffect } from "react";
import GymPhotoUpload from "./GymPhotoUpload";

export default function GymTarget() {
  const [targetData, setTargetData] = useState(() => {
    const saved = localStorage.getItem("gymTarget");
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      startDate: new Date().toDateString(),
      totalDays: 186,
      completedDays: 0,
      skippedDays: 0,
      skipHistory: [],
      lastMarkedDate: null,
      lastSkippedDate: null
    };
  });

  const [showHistory, setShowHistory] = useState(false);
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);
  const [currentDayForPhoto, setCurrentDayForPhoto] = useState(null);
  
  const remainingDays = targetData.totalDays - targetData.completedDays;
  const progressPercent = Math.round((targetData.completedDays / targetData.totalDays) * 100);

  useEffect(() => {
    localStorage.setItem("gymTarget", JSON.stringify(targetData));
    window.dispatchEvent(new Event('gymTargetUpdated'));
  }, [targetData]);

  const today = new Date().toDateString();
  
  const isTodayMarked = targetData.lastMarkedDate === today;
  const isTodaySkipped = targetData.lastSkippedDate === today;

  // Handle mark day button
  const handleMarkDay = () => {
    if (targetData.completedDays >= targetData.totalDays) {
      alert("🎉 Congratulations! You've completed your 6 month gym target!");
      return;
    }

    if (isTodayMarked) {
      alert("❌ You've already marked today! Come back tomorrow.");
      return;
    }

    // ✅ NEW: Show photo upload option
    const nextDay = targetData.completedDays + 1;
    const wantsToUpload = window.confirm(`Day ${nextDay} completed! 📸 Do you want to upload a progress photo?`);
    
    if (wantsToUpload) {
      setCurrentDayForPhoto(nextDay);
      setShowPhotoUpload(true);
    } else {
      // Mark day without photo
      setTargetData(prev => ({
        ...prev,
        completedDays: prev.completedDays + 1,
        lastMarkedDate: today
      }));
    }
  };

  // Handle photo upload complete
  const handlePhotoUploaded = (day, photoData) => {
    setShowPhotoUpload(false);
    setCurrentDayForPhoto(null);
    
    // Mark the day after photo upload
    setTargetData(prev => ({
      ...prev,
      completedDays: prev.completedDays + 1,
      lastMarkedDate: today
    }));
    
    alert(`✅ Day ${day} marked and photo saved!`);
  };

  // Handle skip button
  const handleSkipDay = () => {
    if (targetData.completedDays >= targetData.totalDays) {
      alert("Target already completed!");
      return;
    }

    if (isTodayMarked) {
      alert("❌ You already completed today! You cannot skip this day.");
      return;
    }

    if (isTodaySkipped) {
      alert("❌ You've already skipped today!");
      return;
    }

    const reason = prompt("Why did you skip? (optional)", "No reason");
    if (reason === null) return;
    
    setTargetData(prev => ({
      ...prev,
      skippedDays: prev.skippedDays + 1,
      lastSkippedDate: today,
      skipHistory: [
        { date: today, reason: reason || "No reason", timestamp: new Date().toISOString() },
        ...prev.skipHistory
      ].slice(0, 30)
    }));
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="gym-target-card">
      <div className="gym-header">
        <div className="gym-title">
          <span className="gym-icon">💪</span>
          <h3>6 Month Gym Target</h3>
        </div>
        <span className="gym-badge">🔥 {remainingDays} days left</span>
      </div>

      <div className="gym-timer">
        <div className="timer-circle">
          <span className="timer-number">{remainingDays}</span>
          <span className="timer-label">Days Left</span>
        </div>
        <div className="timer-stats">
          <div className="stat-item">
            <span className="stat-value">{targetData.completedDays}</span>
            <span className="stat-label">Completed</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{targetData.skippedDays}</span>
            <span className="stat-label">Skipped</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{targetData.totalDays}</span>
            <span className="stat-label">Total</span>
          </div>
        </div>
      </div>

      <div className="gym-progress">
        <div className="progress-header">
          <span>Progress</span>
          <span>{progressPercent}%</span>
        </div>
        <div className="progress-bar-gym">
          <div 
            className="progress-fill-gym" 
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* ✅ NEW: Photo Upload Modal */}
      {showPhotoUpload && currentDayForPhoto && (
        <div className="photo-upload-modal">
          <div className="photo-upload-modal-content">
            <button 
              className="modal-close-btn"
              onClick={() => {
                setShowPhotoUpload(false);
                setCurrentDayForPhoto(null);
              }}
            >
              ✕
            </button>
            <GymPhotoUpload 
              dayNumber={currentDayForPhoto}
              onPhotoUploaded={handlePhotoUploaded}
            />
          </div>
        </div>
      )}

      <div className="gym-actions">
        <button 
          className="gym-btn minus-btn"
          onClick={handleMarkDay}
          disabled={targetData.completedDays >= targetData.totalDays}
        >
          <span className="btn-icon">➖</span>
          <span className="btn-text">Mark Day</span>
        </button>
        <button 
          className="gym-btn skip-btn"
          onClick={handleSkipDay}
          disabled={targetData.completedDays >= targetData.totalDays}
        >
          <span className="btn-icon">⏭️</span>
          <span className="btn-text">Skip Day</span>
        </button>
      </div>

      <button 
        className="history-toggle-gym"
        onClick={() => setShowHistory(!showHistory)}
      >
        {showHistory ? '📋 Hide Skip History' : '📋 Show Skip History'}
      </button>

      {showHistory && (
        <div className="skip-history">
          <h4>📅 Skip History</h4>
          {targetData.skipHistory.length > 0 ? (
            <div className="history-list">
              {targetData.skipHistory.map((item, index) => (
                <div key={index} className="history-item">
                  <span className="history-date">{formatDate(item.date)}</span>
                  <span className="history-reason">{item.reason}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-history">No skips yet! Keep going! 💪</div>
          )}
        </div>
      )}

      <div className="gym-footer">
        <span className="start-date">
          Started: {formatDate(targetData.startDate)}
        </span>
        <span className="target-end">
          Target End: {formatDate(new Date(new Date(targetData.startDate).getTime() + 186 * 24 * 60 * 60 * 1000))}
        </span>
      </div>

      {/* ✅ NEW: Styles for photo upload modal */}
      <style jsx>{`
        .photo-upload-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(5px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.3s ease;
        }
        
        .photo-upload-modal-content {
          background: white;
          border-radius: 30px;
          padding: 30px;
          max-width: 500px;
          width: 90%;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
          animation: slideUp 0.4s ease;
        }
        
        .app.dark .photo-upload-modal-content {
          background: #2a2a2a;
        }
        
        .modal-close-btn {
          position: absolute;
          top: 15px;
          right: 15px;
          background: #f0f0f0;
          border: none;
          width: 35px;
          height: 35px;
          border-radius: 50%;
          font-size: 18px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          z-index: 10;
        }
        
        .modal-close-btn:hover {
          background: #ff4444;
          color: white;
          transform: rotate(90deg);
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(50px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}