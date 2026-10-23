/* =========================================================
   Navbar — Glass morphism top bar with search, cart, ORBIT
   ========================================================= */
import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { DEPARTMENTS } from '../data/catalog.js';
import './Navbar.css';

export default function Navbar() {
  const { cartCount, toggleOrbit, user, isStoreAdmin, isDepartmentManager, logout } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [deptDropdown, setDeptDropdown] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef(null);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMenuOpen(false);
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (!e.target.closest('.dept-dropdown-wrapper')) {
        setDeptDropdown(false);
      }
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  return (
    <nav className="navbar glass-card" role="navigation" aria-label="Main navigation">
      <div className="navbar-inner container">
        {/* Logo */}
        <Link to="/" className="navbar-logo" aria-label="BLOWMAGGY - Z Home">
          <span className="logo-icon">❋</span>
          <span className="logo-text">BLOWMAGGY <span className="logo-z">- Z</span></span>
        </Link>

        {/* Desktop Nav Links */}
        <div className={`navbar-center ${menuOpen ? 'open' : ''}`}>
          {/* Departments Dropdown */}
          <div className="dept-dropdown-wrapper">
            <button
              className="nav-link dept-trigger"
              onClick={() => setDeptDropdown(!deptDropdown)}
              aria-expanded={deptDropdown}
              aria-haspopup="true"
            >
              Departments ▾
            </button>
            {deptDropdown && (
              <div className="dept-dropdown" role="menu">
                {DEPARTMENTS.map(dept => (
                  <Link
                    key={dept.id}
                    to={`/department/${dept.id}`}
                    className="dept-dropdown-item"
                    role="menuitem"
                    onClick={() => { setDeptDropdown(false); setMenuOpen(false); }}
                  >
                    <span className="dept-icon">{dept.icon}</span>
                    <div>
                      <div className="dept-name" style={{ color: dept.color }}>{dept.name}</div>
                      <div className="dept-subtitle">{dept.subtitle}</div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Search */}
          <form className="navbar-search" onSubmit={handleSearch} role="search">
            <span className="search-icon" aria-hidden="true">🔍</span>
            <input
              ref={searchRef}
              type="search"
              className="search-input"
              placeholder="Search products..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              aria-label="Search products"
              id="global-search"
            />
          </form>
        </div>

        {/* Right Actions */}
        <div className="navbar-actions">
          <Link to="/wishlist" className="nav-action-btn" aria-label="Wishlist" title="Wishlist">
            ♡
          </Link>

          <Link to="/cart" className="nav-action-btn cart-btn" aria-label={`Cart with ${cartCount} items`} title="Cart">
            <span>🛒</span>
            {cartCount > 0 && (
              <span className="cart-badge" aria-hidden="true">{cartCount}</span>
            )}
          </Link>

          {isStoreAdmin && (
            <Link to="/admin" className="nav-action-btn admin-portal-btn" title="Store Admin Cockpit">
              ⚙️ <span className="nav-btn-text">Admin</span>
            </Link>
          )}

          {isDepartmentManager && (
            <Link to="/manager" className="nav-action-btn manager-portal-btn" title="Department Manager Cockpit">
              📊 <span className="nav-btn-text">Manager</span>
            </Link>
          )}

          {user ? (
            <div className="user-profile-widget">
              <span className="user-role-pill">{user.role === 'STORE_ADMIN' ? 'Admin' : user.role === 'DEPARTMENT_MANAGER' ? 'Manager' : 'Shopper'}</span>
              <button className="nav-action-btn logout-btn" onClick={logout} title={`Logged in as ${user.fullName} (${user.role}). Click to logout.`}>
                🚪
              </button>
            </div>
          ) : (
            <Link to="/admin/login" className="nav-action-btn login-btn" title="Sign In / Switch Role">
              🔐
            </Link>
          )}

          {/* Mobile menu toggle */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span className={`hamburger ${menuOpen ? 'open' : ''}`}></span>
          </button>
        </div>
      </div>
    </nav>
  );
}
