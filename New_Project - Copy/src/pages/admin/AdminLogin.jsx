/* =========================================================
   BLOWMAGGY — Unified Authentication & Role Switcher
   =========================================================
   Supports:
   - SHOPPER
   - DEPARTMENT_MANAGER (Fashion / Tech)
   - STORE_ADMIN
   - Immediate Role Switching for Judges / Evaluation
   ========================================================= */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext.jsx';
import './Admin.css';

export default function AdminLogin() {
  const { login, addToast } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@blowmaggy.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e?.preventDefault();
    setLoading(true);
    try {
      const user = await login(email, password);
      if (user.role === 'STORE_ADMIN') {
        navigate('/admin');
      } else if (user.role === 'DEPARTMENT_MANAGER') {
        navigate('/manager');
      } else {
        navigate('/');
      }
    } catch {
      // Error toast handled in context
    } finally {
      setLoading(false);
    }
  };

  // Quick Switcher Helper
  const quickAuth = async (quickEmail, quickPassword) => {
    setEmail(quickEmail);
    setPassword(quickPassword);
    setLoading(true);
    try {
      const user = await login(quickEmail, quickPassword);
      if (user.role === 'STORE_ADMIN') {
        navigate('/admin');
      } else if (user.role === 'DEPARTMENT_MANAGER') {
        navigate('/manager');
      } else {
        navigate('/');
      }
    } catch {
      // Handled
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page container animate-fade-in">
      <div className="admin-login-card glass-card">
        <div className="admin-avatar">🔐</div>
        <h2>Multiverse Access Gateway</h2>
        <p className="admin-login-sub">Role-Based Access Control for Shoppers, Managers, and Admins.</p>

        {/* Quick Role Switcher for Hackathon Testing */}
        <div className="quick-roles-container">
          <span className="quick-roles-title">⚡ Instant Role Quick-Switcher:</span>
          <div className="quick-roles-grid">
            <button
              type="button"
              className="quick-role-btn shopper"
              onClick={() => quickAuth('shopper@blowmaggy.com', 'shopper123')}
            >
              <span>🛒</span>
              <div>
                <strong>Shopper</strong>
                <small>Browse & Checkout</small>
              </div>
            </button>

            <button
              type="button"
              className="quick-role-btn manager"
              onClick={() => quickAuth('manager.fashion@blowmaggy.com', 'manager123')}
            >
              <span>👗</span>
              <div>
                <strong>Fashion Manager</strong>
                <small>The Runway Scope</small>
              </div>
            </button>

            <button
              type="button"
              className="quick-role-btn manager"
              onClick={() => quickAuth('manager.electronics@blowmaggy.com', 'manager123')}
            >
              <span>⚡</span>
              <div>
                <strong>Tech Manager</strong>
                <small>The Grid Scope</small>
              </div>
            </button>

            <button
              type="button"
              className="quick-role-btn admin"
              onClick={() => quickAuth('admin@blowmaggy.com', 'admin123')}
            >
              <span>⚙️</span>
              <div>
                <strong>Store Admin</strong>
                <small>Global Governance</small>
              </div>
            </button>
          </div>

          {/* Test Denied Condition */}
          <button
            type="button"
            className="test-denied-pill"
            onClick={() => quickAuth('deactivated@blowmaggy.com', 'deactivated123')}
            title="Attempt login with deactivated user"
          >
            🚫 Test Login with Deactivated Account (Denial Proof)
          </button>
        </div>

        <div className="login-divider-row">
          <span>or sign in manually</span>
        </div>

        {/* Manual Form */}
        <form onSubmit={handleLogin} className="admin-form">
          <div className="input-group">
            <label htmlFor="login-email">Account Email</label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="input-field"
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="login-pass">Password</label>
            <input
              id="login-pass"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="input-field"
              required
            />
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary admin-submit-btn">
            {loading ? 'Verifying with Backend...' : 'Authenticate & Enter →'}
          </button>
        </form>
      </div>
    </div>
  );
}
