/* Footer */
import { Link } from 'react-router-dom';
import { DEPARTMENTS } from '../data/catalog.js';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      <div className="container footer-grid">
        <div className="footer-brand">
          <div className="footer-logo">
            <span className="logo-icon">❋</span>
            <span className="logo-text">BLOWMAGGY <span className="logo-z">- Z</span></span>
          </div>
          <p className="footer-tagline">
            Your all-in-one shopping destination.
            Six curated departments, one unified checkout.
          </p>
          <p className="footer-demo-notice">
            ⚠️ Demo Application — No real payments or deliveries.
          </p>
        </div>

        <div className="footer-links">
          <h4>Departments</h4>
          <ul>
            {DEPARTMENTS.map(d => (
              <li key={d.id}>
                <Link to={`/department/${d.id}`}>
                  {d.icon} {d.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-links">
          <h4>Shopping</h4>
          <ul>
            <li><Link to="/cart">Cart</Link></li>
            <li><Link to="/wishlist">Wishlist</Link></li>
            <li><Link to="/orders">Orders</Link></li>
            <li><Link to="/search">Search</Link></li>
          </ul>
        </div>

        <div className="footer-links">
          <h4>Built By</h4>
          <ul>
            <li>
              <a
                href="https://www.linkedin.com/in/om-prakash-3286a8389?utm_source=share_via&utm_content=profile&utm_medium=member_android"
                target="_blank"
                rel="noopener noreferrer"
                className="creator-link"
                title="Om Prakash LinkedIn Profile"
              >
                <span className="creator-icon">👔</span> Om Prakash
              </a>
            </li>
            <li>
              <a
                href="https://www.linkedin.com/in/raju-ranjan-925233391?utm_source=share_via&utm_content=profile&utm_medium=member_android"
                target="_blank"
                rel="noopener noreferrer"
                className="creator-link"
                title="Raju Ranjan LinkedIn Profile"
              >
                <span className="creator-icon">👔</span> Raju Ranjan
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom container">
        <p>© 2026 BLOWMAGGY - Z. All rights reserved.</p>
        <p>Prices in INR (₹). All data is demo/synthetic.</p>
      </div>
    </footer>
  );
}
