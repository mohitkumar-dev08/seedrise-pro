// components/CalendarView.jsx
import React, { useState } from "react";

function CalendarView({ data }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const startWeekDay = firstDayOfMonth.getDay(); // 0 = Sunday
  const totalDays = new Date(year, month + 1, 0).getDate();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const days = [];
  for (let i = 0; i < startWeekDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= totalDays; i++) {
    days.push(new Date(year, month, i));
  }

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const isCompleted = (date) => {
    if (!data?.currentStreak) return false;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (date >= today) return false;
    
    const diffDays = Math.floor((today - date) / (1000 * 60 * 60 * 24));
    return diffDays < data.currentStreak;
  };

  return (
    <div className="calendar-wrapper">
      {/* Calendar Header with Navigation - Purana design + arrows */}
      <div className="calendar-header with-nav">
        <button onClick={goToPreviousMonth} className="calendar-nav-btn">
          ←
        </button>
        <span>📅 {monthNames[month]} {year}</span>
        <button onClick={goToNextMonth} className="calendar-nav-btn">
          →
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="calendar-grid">
        {weekDays.map((day) => (
          <div key={day} className="calendar-day header">
            {day}
          </div>
        ))}

        {days.map((date, index) => {
          if (!date) {
            return <div key={index} className="calendar-day empty"></div>;
          }

          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          const isToday = date.toDateString() === today.toDateString();
          const completed = isCompleted(date);
          const isPast = date < today;

          return (
            <div
              key={index}
              className={`calendar-day 
                ${completed ? "completed" : ""} 
                ${isToday ? "today" : ""}
                ${isPast && !completed && !isToday ? "missed" : ""}`}
            >
              {date.getDate()}
              {completed && <span className="completed-mark">✅</span>}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="calendar-legend">
        <div className="legend-item">
          <span className="legend-color completed-color"></span>
          <span>Completed</span>
        </div>
        <div className="legend-item">
          <span className="legend-color today-color"></span>
          <span>Today</span>
        </div>
        <div className="legend-item">
          <span className="legend-color missed-color"></span>
          <span>Missed</span>
        </div>
      </div>
    </div>
  );
}

export default CalendarView;