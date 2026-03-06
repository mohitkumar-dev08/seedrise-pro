// components/EnglishAchievements.jsx
import { useEffect, useState } from "react";

export default function EnglishAchievements({ englishStreak }) {
  const [animate, setAnimate] = useState(false);
  
  const milestones = [7, 21, 31, 41, 60, 75, 90, 105, 130, 180];
  
  const badgeDetails = {
    7: { emoji: "🗣️", name: "Sprout Speaker", desc: "7 days - Started speaking!" },
    21: { emoji: "📝", name: "Sentence Builder", desc: "21 days - Building sentences" },
    31: { emoji: "📰", name: "Current Affairs Pro", desc: "31 days - Staying updated" },
    41: { emoji: "📔", name: "Journal Writer", desc: "41 days - Writing daily" },
    60: { emoji: "📚", name: "Book Reader", desc: "60 days - Reading habit" },
    75: { emoji: "📺", name: "Friends Expert", desc: "75 days - Dialogue master" },
    90: { emoji: "🤖", name: "Gemini Pro", desc: "90 days - AI conversation expert" },
    105: { emoji: "🎯", name: "TED Speaker", desc: "105 days - Presentation pro" },
    130: { emoji: "💼", name: "Interview Pro", desc: "130 days - Interview ready" },
    180: { emoji: "🌟", name: "Fluent Speaker", desc: "180 days - English fluent!" }
  };

  useEffect(() => {
    setAnimate(true);
    const timer = setTimeout(() => setAnimate(false), 1000);
    return () => clearTimeout(timer);
  }, [englishStreak]);

  const nextMilestone = milestones.find(m => m > englishStreak) || null;
  const progressToNext = nextMilestone 
    ? Math.round((englishStreak / nextMilestone) * 100) 
    : 100;

  return (
    <div className={`english-achievements-card ${animate ? 'english-achievements-pop' : ''}`}>
      <div className="english-achievements-header">
        <span className="english-achievements-icon">🏆</span>
        <h4>English Achievements</h4>
        <span className="english-streak-indicator">🔥 {englishStreak}d</span>
      </div>

      {/* Next Milestone */}
      {nextMilestone && (
        <div className="english-next-milestone">
          <div className="english-milestone-label">
            <span>Next: <strong>{nextMilestone}d</strong></span>
            <span>{progressToNext}%</span>
          </div>
          <div className="english-milestone-progress-bar">
            <div 
              className="english-milestone-progress-fill" 
              style={{ width: `${progressToNext}%` }}
            />
          </div>
          <div className="english-milestone-days">{englishStreak} / {nextMilestone} days</div>
        </div>
      )}

      {/* First Row - 7,21,31,41,60 */}
      <div className="english-badges-grid">
        {milestones.slice(0, 5).map((milestone) => {
          const unlocked = englishStreak >= milestone;
          const details = badgeDetails[milestone];
          
          return (
            <div 
              key={milestone} 
              className={`english-badge-item ${unlocked ? 'unlocked' : 'locked'}`}
              title={details?.desc || `${milestone} days`}
            >
              <div className="english-badge-emoji">{unlocked ? details?.emoji || '🏆' : '🔒'}</div>
              <div className="english-badge-name">{milestone}d</div>
              {unlocked && <div className="english-badge-fire">🔥</div>}
            </div>
          );
        })}
      </div>

      {/* Second Row - 75,90,105,130,180 */}
      <div className="english-badges-grid second-row">
        {milestones.slice(5).map((milestone) => {
          const unlocked = englishStreak >= milestone;
          const details = badgeDetails[milestone];
          
          return (
            <div 
              key={milestone} 
              className={`english-badge-item ${unlocked ? 'unlocked' : 'locked'}`}
              title={details?.desc || `${milestone} days`}
            >
              <div className="english-badge-emoji">{unlocked ? details?.emoji || '🏆' : '🔒'}</div>
              <div className="english-badge-name">{milestone}d</div>
              {unlocked && <div className="english-badge-fire">🔥</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}