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
          <h4>Built With</h4>
          <ul>
            <li>React + Vite</li>
            <li>React Router</li>
            <li>Vanilla CSS</li>
            <li>Context API</li>
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
