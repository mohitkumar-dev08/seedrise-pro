// components/layout/Navbar.jsx
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar({ streak, darkMode, toggleDarkMode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { path: "/", name: "Dashboard", icon: "🏠" },
    { path: "/tracker", name: "Tracker", icon: "📊" },
    { path: "/english", name: "English", icon: "🇬🇧" },
    { path: "/tasks", name: "Tasks", icon: "✅" },
    { path: "/wellness", name: "Wellness", icon: "🧘" },
    { path: "/ai-coach", name: "AI Coach", icon: "🤖" },
  ];

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-brand">
          <Link to="/" className="brand-link">
            <span className="brand-icon">🌳</span>
            <span className="brand-name">SeedRise Pro</span>
          </Link>
        </div>

        <div className={`nav-links ${mobileMenuOpen ? 'open' : ''}`}>
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="nav-icon">{link.icon}</span>
              <span className="nav-text">{link.name}</span>
            </Link>
          ))}
        </div>

        <div className="nav-actions">
          <span className="nav-streak">🔥 {streak}</span>
          <button className="nav-theme-toggle" onClick={toggleDarkMode}>
            {darkMode ? '☀️' : '🌙'}
          </button>
          <button 
            className="nav-mobile-toggle" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>
    </nav>
  );
}