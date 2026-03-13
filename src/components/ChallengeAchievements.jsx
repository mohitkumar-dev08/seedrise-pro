// components/ChallengeAchievements.jsx
export default function ChallengeAchievements({ streak, totalDays = 13 }) {
  // ✅ Dynamic milestones according to totalDays
  const getMilestones = () => {
    if (totalDays === 13) {
      return [3, 7, 10, 13];
    }
    return [3, 7, 10, 15]; // default
  };
  
  const milestones = getMilestones();
  
  const badgeDetails = {
    3: { emoji: "🌱", name: "Starter", desc: "3 days - Journey begins" },
    7: { emoji: "🌿", name: "Consistent", desc: "7 days - One week strong" },
    10: { emoji: "🌲", name: "Warrior", desc: "10 days - Almost there" },
    13: { emoji: "🏆", name: "Champion", desc: "13 days - Challenge Complete!" },
    15: { emoji: "🏆", name: "Champion", desc: "15 days - Challenge Complete!" }
  };

  return (
    <div className="challenge-achievements">
      <div className="achievements-header">
        <span className="achievements-icon">🏆</span>
        <h4>Milestones</h4>
      </div>

      <div className="milestone-grid">
        {milestones.map((milestone) => {
          const unlocked = streak >= milestone;
          const details = badgeDetails[milestone] || { emoji: "🏆", name: `${milestone}d` };
          
          return (
            <div
              key={milestone}
              className={`milestone-badge ${unlocked ? 'unlocked' : 'locked'}`}
              title={details.desc}
            >
              <div className="milestone-emoji">{unlocked ? details.emoji : '🔒'}</div>
              <div className="milestone-day">{milestone}d</div>
            </div>
          );
        })}
      </div>

      <div className="milestone-progress-text">
        <span>{streak}/{totalDays} days</span>
        <span>{Math.round((streak/totalDays)*100)}%</span>
      </div>
    </div>
  );
}