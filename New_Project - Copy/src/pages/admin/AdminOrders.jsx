/* =========================================================
   BLOWMAGGY — Admin Order Fulfillment Management
   ========================================================= */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext.jsx';
import { formatPrice } from '../../data/catalog.js';
import './Admin.css';

export default function AdminOrders() {
  const { orders, addToast } = useApp();
  const [orderStatuses, setOrderStatuses] = useState({});

  const handleStatusChange = (orderId, newStatus) => {
    setOrderStatuses(prev => ({ ...prev, [orderId]: newStatus }));
    addToast(`Order ${orderId} updated to ${newStatus.toUpperCase()}`, 'success');
  };

  return (
    <div className="admin-page container animate-fade-in">
      <div className="admin-header">
        <div>
          <span className="badge badge-cyan">FULFILLMENT DISPATCH</span>
          <h1 className="admin-title">Order Management & Tracking</h1>
          <p className="admin-sub">Audit cross-department orders, update delivery pipeline states, and review addresses.</p>
        </div>
        <div className="admin-nav-links">
          <Link to="/admin" className="btn btn-secondary btn-sm">← Back to Cockpit</Link>
          <Link to="/admin/products" className="btn btn-secondary btn-sm">Manage Products</Link>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="admin-section glass-card empty-orders-card">
          <span className="empty-icon">📋</span>
          <h3>No Orders in Database Pipeline</h3>
          <p>Submit a test order through the shopper cart to view live fulfillment updates.</p>
          <Link to="/cart" className="btn btn-primary btn-sm">Open Shopper Cart</Link>
        </div>
      ) : (
        <div className="admin-orders-grid">
          {orders.map(order => {
            const currentStatus = orderStatuses[order.id] || order.status || 'confirmed';
            const dateStr = new Date(order.createdAt).toLocaleString('en-IN');

            return (
              <div key={order.id} className="admin-order-card glass-card">
                <div className="order-head-bar">
                  <div>
                    <strong className="order-id-label">{order.id}</strong>
                    <span className="order-timestamp">{dateStr}</span>
                  </div>
                  <div className="status-updater-wrap">
                    <label>Fulfillment State:</label>
                    <select
                      value={currentStatus}
                      onChange={e => handleStatusChange(order.id, e.target.value)}
                      className="status-select-dropdown"
                    >
                      <option value="confirmed">Confirmed</option>
                      <option value="packed">Packed</option>
                      <option value="dispatched">Dispatched</option>
                      <option value="delivered">Delivered</option>
                    </select>
                  </div>
                </div>

                {/* Items in Order */}
                <div className="admin-order-items-list">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="admin-order-item-row">
                      <span className="dept-tag-pill">{item.department}</span>
                      <strong className="item-title-col">{item.name}</strong>
                      <span className="item-qty-col">Qty: {item.quantity}</span>
                      <span className="item-price-col">{formatPrice(item.lineTotalPaise)}</span>
                    </div>
                  ))}
                </div>

                {/* Destination & Total */}
                <div className="order-footer-bar">
                  <div className="destination-col">
                    <strong>Shipping To:</strong>
                    {order.address ? (
                      <span>
                        {order.address.fullName} ({order.address.phone}) — {order.address.street}, {order.address.city}, {order.address.state} {order.address.pincode}
                      </span>
                    ) : (
                      <span>Customer Address on File</span>
                    )}
                  </div>
                  <div className="total-col">
                    <span>Order Value:</span>
                    <strong>{formatPrice(order.totalPaise)}</strong>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
