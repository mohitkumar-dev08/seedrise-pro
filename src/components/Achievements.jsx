// ====== SEEDRISE_ACHIEVEMENTS_3_7_30_90_UNIQUE_2026 ======

export default function Achievements({ streak }) {
  const milestones = [3, 7, 30, 90];

  const nextMilestone =
    milestones.find(m => streak < m) || null;

  const progressPercent = nextMilestone
    ? (streak / nextMilestone) * 100
    : 100;

  return (
    <div className="achievements-container">
      <h3>🏆 Achievements</h3>

      <div className="badges-wrapper">
        {milestones.map((milestone) => {
          const unlocked = streak >= milestone;

          return (
            <span
              key={milestone}
              className={`badge ${unlocked ? "unlocked" : "locked"}`}
            >
              {unlocked ? "🔥" : "🔒"} {milestone} Days
            </span>
          );
        })}
      </div>

    </div>
  );
}
