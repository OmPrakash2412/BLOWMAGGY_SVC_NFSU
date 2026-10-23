/* =========================================================
   BLOWMAGGY — Department Manager Cockpit
   =========================================================
   Focused operations dashboard for DEPARTMENT_MANAGER role.
   Restricted to authorized department(s).
   Includes live interactive RBAC permission violation test.
   ========================================================= */
import { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext.jsx';
import { formatPrice } from '../../data/catalog.js';
import './ManagerCockpit.css';

export default function ManagerCockpit() {
  const { user, token, isDepartmentManager, isStoreAdmin, addToast, API_BASE } = useApp();
  const [overview, setOverview] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stockCounts, setStockCounts] = useState({});

  // Guard: Must be DEPARTMENT_MANAGER or STORE_ADMIN
  if (!isDepartmentManager && !isStoreAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  // Fetch department-scoped data from live backend
  const fetchData = async () => {
    try {
      setLoading(true);
      const [ovRes, prodRes] = await Promise.all([
        fetch(`${API_BASE}/manager/overview`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`${API_BASE}/manager/products`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      const ovData = await ovRes.json();
      const prodData = await prodRes.json();

      if (ovRes.ok) setOverview(ovData);
      if (prodRes.ok) setProducts(prodData.products || []);
    } catch (err) {
      addToast('Failed to connect to manager operations API', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchData();
  }, [token]);

  // Handle authorized stock update
  const handleUpdateStock = async (productId, newCount) => {
    try {
      const res = await fetch(`${API_BASE}/products/${productId}/stock`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ stockCount: parseInt(newCount, 10) })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Update failed');

      addToast(`Inventory for ${productId} updated to ${newCount} units`, 'success');
      fetchData();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  // TEST PROOF: Attempt unauthorized cross-department modification
  const handleTestUnauthorizedCrossDeptAction = async () => {
    try {
      addToast("Testing unauthorized cross-department write attempt...", "info");
      // Pick a product from a different department (e.g. prod_026 is Electronics)
      const unauthorizedProductId = user?.assignedDepartments?.includes('fashion') ? 'prod_026' : 'prod_001';
      
      const res = await fetch(`${API_BASE}/products/${unauthorizedProductId}/stock`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ stockCount: 999 })
      });

      const data = await res.json();

      if (res.status === 403) {
        addToast(
          `🛡️ DENIED BY BACKEND: ${data.message} (Audit Log Recorded)`,
          'warning',
          6000
        );
      } else {
        addToast(`Unexpected response: ${res.status}`, 'info');
      }
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  return (
    <div className="manager-page container animate-fade-in">
      {/* Header */}
      <div className="manager-header">
        <div>
          <span className="badge badge-magenta">DEPARTMENT MANAGER COCKPIT</span>
          <h1 className="manager-title">
            {overview?.manager?.name || user?.fullName}
          </h1>
          <div className="manager-assignments-row">
            <span>Authorized Portals:</span>
            {user?.assignedDepartments?.map(d => (
              <span key={d} className="badge badge-cyan">{d.toUpperCase()}</span>
            ))}
          </div>
        </div>

        <div className="manager-actions-row">
          <button 
            className="btn btn-secondary btn-sm test-denial-btn"
            onClick={handleTestUnauthorizedCrossDeptAction}
            title="Demonstrate RBAC security denial to judges"
          >
            🧪 Test Cross-Dept Write Denial (RBAC Proof)
          </button>
          <Link to="/" className="btn btn-ghost btn-sm">Shopper View ↗</Link>
        </div>
      </div>

      {/* KPI Overview Tiles */}
      {overview && (
        <div className="manager-kpis-grid">
          <div className="kpi-card glass-card">
            <span className="kpi-label">Department Catalog Size</span>
            <strong className="kpi-value">{overview.metrics.totalSkus}</strong>
            <span className="kpi-note">Active SKUs in authorized scope</span>
          </div>

          <div className="kpi-card glass-card">
            <span className="kpi-label">Warehouse Units</span>
            <strong className="kpi-value">{overview.metrics.totalStockUnits}</strong>
            <span className="kpi-note">Across assigned department SKUs</span>
          </div>

          <div className="kpi-card glass-card">
            <span className="kpi-label">Low Stock Alerts</span>
            <strong className="kpi-value" style={{ color: overview.metrics.lowStockAlertCount > 0 ? '#ef4444' : '#34d399' }}>
              {overview.metrics.lowStockAlertCount}
            </strong>
            <span className="kpi-note">Items below safety threshold (&le; 10)</span>
          </div>

          <div className="kpi-card glass-card">
            <span className="kpi-label">Department Sales</span>
            <strong className="kpi-value" style={{ color: 'var(--accent-magenta)' }}>
              {formatPrice(overview.metrics.departmentSalesPaise)}
            </strong>
            <span className="kpi-note">Total attributed order value</span>
          </div>
        </div>
      )}

      {/* Low Stock Alerts Section */}
      {overview?.lowStockAlerts && overview.lowStockAlerts.length > 0 && (
        <div className="manager-alerts-card glass-card">
          <div className="alert-header">
            <span>⚠️</span>
            <h3>Operational Inventory Alerts ({overview.lowStockAlerts.length})</h3>
          </div>
          <div className="alerts-list">
            {overview.lowStockAlerts.map(alert => (
              <div key={alert.id} className="alert-row">
                <div>
                  <strong>{alert.name}</strong> ({alert.category})
                  <span className="stock-warning">Only {alert.currentStock} units remaining</span>
                </div>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => handleUpdateStock(alert.id, alert.currentStock + 25)}
                >
                  Restock +25
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Scoped Products Table */}
      <div className="manager-products-section glass-card">
        <div className="section-header-split">
          <h3>Authorized Department Inventory ({products.length} SKUs)</h3>
          <span className="dept-restriction-note">
            🔒 Backend enforces zero access to unauthorized department SKUs
          </span>
        </div>

        <div className="table-responsive">
          <table className="manager-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Product Name</th>
                <th>Department</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock Units</th>
                <th>Quick Restock</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id}>
                  <td><code>{p.id}</code></td>
                  <td><strong>{p.name}</strong></td>
                  <td><span className="dept-pill-mini">{p.departmentId}</span></td>
                  <td>{p.category}</td>
                  <td>{formatPrice(p.pricePaise)}</td>
                  <td>
                    <input
                      type="number"
                      min="0"
                      className="stock-editor-input"
                      value={stockCounts[p.id] !== undefined ? stockCounts[p.id] : p.stockCount}
                      onChange={e => setStockCounts({ ...stockCounts, [p.id]: e.target.value })}
                    />
                  </td>
                  <td>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleUpdateStock(p.id, stockCounts[p.id] !== undefined ? stockCounts[p.id] : p.stockCount)}
                    >
                      Save Stock
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
