// components/layout/Footer.jsx
export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h4 className="footer-title">🌳 SeedRise Pro</h4>
          <p className="footer-desc">Rise every day, grow every day. Your personal growth companion.</p>
        </div>

        <div className="footer-section">
          <h4 className="footer-title">Quick Links</h4>
          <ul className="footer-links">
            <li><a href="/">Dashboard</a></li>
            <li><a href="/tracker">Tracker</a></li>
            <li><a href="/english">English Practice</a></li>
            <li><a href="/tasks">Daily Tasks</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="footer-title">Resources</h4>
          <ul className="footer-links">
            <li><a href="#">About</a></li>
            <li><a href="#">Contact</a></li>
            <li><a href="#">Privacy</a></li>
            <li><a href="#">Terms</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="footer-title">Connect</h4>
          <div className="footer-social">
            <a href="#" className="social-link">📱</a>
            <a href="#" className="social-link">🐦</a>
            <a href="#" className="social-link">📘</a>
            <a href="#" className="social-link">📸</a>
          </div>
          <p className="footer-copyright">© 2026 SeedRise Pro. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}