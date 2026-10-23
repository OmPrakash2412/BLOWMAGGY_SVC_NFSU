/* =========================================================
   BLOWMAGGY — Admin Overview Dashboard
   ========================================================= */
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext.jsx';
import { ALL_PRODUCTS, DEPARTMENTS, formatPrice } from '../../data/catalog.js';
import './Admin.css';

export default function AdminDashboard() {
  const { orders } = useApp();

  // Compute live metrics from actual data
  const totalGmvPaise = orders.reduce((sum, o) => sum + o.totalPaise, 0);
  const totalItemsSold = orders.reduce((sum, o) => 
    sum + o.items.reduce((isum, i) => isum + i.quantity, 0), 0
  );

  // Cross department order rate
  const crossDeptOrders = orders.filter(o => {
    const depts = new Set(o.items.map(i => i.department));
    return depts.size > 1;
  });
  const crossBasketRate = orders.length > 0 
    ? Math.round((crossDeptOrders.length / orders.length) * 100) 
    : 100;

  return (
    <div className="admin-page container animate-fade-in">
      <div className="admin-header">
        <div>
          <span className="badge badge-magenta">SYSTEM COCKPIT</span>
          <h1 className="admin-title">Multiverse Command Center</h1>
          <p className="admin-sub">Platform metrics, stock levels, and order distribution.</p>
        </div>
        <div className="admin-nav-links">
          <Link to="/admin/products" className="btn btn-secondary btn-sm">Manage Products</Link>
          <Link to="/admin/orders" className="btn btn-secondary btn-sm">Manage Orders ({orders.length})</Link>
          <Link to="/" className="btn btn-ghost btn-sm">Shopper View ↗</Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="admin-kpi-grid">
        <div className="kpi-card glass-card">
          <span className="kpi-label">Gross Merchandise Value (GMV)</span>
          <strong className="kpi-value">{formatPrice(totalGmvPaise)}</strong>
          <span className="kpi-note">{orders.length} confirmed orders in session</span>
        </div>

        <div className="kpi-card glass-card">
          <span className="kpi-label">Cross-Department Basket Rate</span>
          <strong className="kpi-value" style={{ color: 'var(--accent-cyan)' }}>
            {crossBasketRate}%
          </strong>
          <span className="kpi-note">Core Differentiator Validation</span>
        </div>

        <div className="kpi-card glass-card">
          <span className="kpi-label">Active Multiverse SKUs</span>
          <strong className="kpi-value">{ALL_PRODUCTS.length}</strong>
          <span className="kpi-note">Across 6 connected worlds</span>
        </div>

        <div className="kpi-card glass-card">
          <span className="kpi-label">Units Dispatched</span>
          <strong className="kpi-value" style={{ color: '#34d399' }}>
            {totalItemsSold}
          </strong>
          <span className="kpi-note">Synchronized single fulfillment</span>
        </div>
      </div>

      {/* Department Breakdown */}
      <div className="admin-sections-grid">
        <div className="admin-section glass-card">
          <h3>Catalog Distribution by Department</h3>
          <div className="dept-distribution-list">
            {DEPARTMENTS.map(d => {
              const count = ALL_PRODUCTS.filter(p => p.department === d.id).length;
              const percentage = Math.round((count / ALL_PRODUCTS.length) * 100);
              return (
                <div key={d.id} className="dept-dist-row">
                  <div className="dept-dist-header">
                    <span>{d.icon} {d.name}</span>
                    <strong>{count} SKUs ({percentage}%)</strong>
                  </div>
                  <div className="dist-bar-track">
                    <div
                      className="dist-bar-fill"
                      style={{ width: `${percentage}%`, background: d.color }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Orders in Cockpit */}
        <div className="admin-section glass-card">
          <div className="section-head-split">
            <h3>Recent Orders Pipeline</h3>
            <Link to="/admin/orders" className="link-text">View all →</Link>
          </div>

          {orders.length > 0 ? (
            <div className="admin-recent-orders">
              {orders.slice(0, 5).map(o => (
                <div key={o.id} className="admin-order-row">
                  <div>
                    <strong className="row-order-id">{o.id}</strong>
                    <span className="row-order-meta">
                      {o.items.length} items • {o.address?.city || 'Bengaluru'}
                    </span>
                  </div>
                  <div className="row-right">
                    <span className="row-price">{formatPrice(o.totalPaise)}</span>
                    <span className="badge badge-success">{o.status}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-orders-note">
              <p>No orders submitted in current session yet.</p>
              <Link to="/cart" className="btn btn-secondary btn-sm">Simulate Checkout Flow</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
