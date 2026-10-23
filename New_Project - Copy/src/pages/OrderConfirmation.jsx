/* =========================================================
   BLOWMAGGY — Order Confirmation Page
   ========================================================= */
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { formatPrice } from '../data/catalog.js';
import './OrderConfirmation.css';

export default function OrderConfirmation() {
  const { orderId } = useParams();
  const { orders, addToast } = useApp();

  // Find order in state or fallback to most recent
  const order = orders.find(o => o.id === orderId) || orders[0] || null;

  const handleCopyId = () => {
    navigator.clipboard?.writeText(order?.id || orderId);
    addToast('Order ID copied to clipboard', 'info');
  };

  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 3);
  const formattedDelivery = deliveryDate.toLocaleDateString('en-IN', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="confirmation-page container animate-fade-in">
      <div className="confirmation-card glass-card">
        {/* Success Icon */}
        <div className="conf-icon-wrap">
          <span className="conf-check">✓</span>
        </div>

        <span className="badge badge-success">TRANSACTION DEPLOYED & CONFIRMED</span>
        <h1 className="conf-title">Welcome to the Continuum!</h1>
        <p className="conf-sub">
          Your cross-multiverse order has been dispatched into our fulfillment pipeline.
        </p>

        {/* Reference ID Pill */}
        <div className="conf-id-box">
          <span className="id-label">Multiverse Order Identifier:</span>
          <strong className="id-val">{order?.id || orderId}</strong>
          <button className="copy-btn" onClick={handleCopyId} title="Copy Order ID">
            📋 Copy
          </button>
        </div>

        {/* Delivery ETA */}
        <div className="delivery-eta-banner">
          <span>📦 Estimated Combined Delivery:</span>
          <strong>{formattedDelivery}</strong>
        </div>

        {/* Order Details */}
        {order && (
          <div className="conf-details-block">
            <h3>Dispatched Items ({order.items.length})</h3>
            <div className="conf-items-list">
              {order.items.map((item, idx) => (
                <div key={idx} className="conf-item-row">
                  <div>
                    <span className="conf-dept-tag">{item.department}</span>
                    <strong className="conf-item-name">{item.name}</strong>
                    <span className="conf-item-qty">Qty: {item.quantity}</span>
                  </div>
                  <span className="conf-item-price">{formatPrice(item.lineTotalPaise)}</span>
                </div>
              ))}
            </div>

            <div className="summary-total-divider"></div>

            <div className="conf-summary-row">
              <span>Total Paid (Paise Accurate):</span>
              <strong className="conf-grand-total">{formatPrice(order.totalPaise)}</strong>
            </div>

            {order.address && (
              <div className="conf-address-summary">
                <h4>Fulfillment Destination</h4>
                <p>
                  <strong>{order.address.fullName}</strong> ({order.address.phone})<br />
                  {order.address.street}, {order.address.city}, {order.address.state} — {order.address.pincode}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="conf-actions-row">
          <Link to="/" className="btn btn-primary">Continue Exploring Multiverse</Link>
          <Link to="/orders" className="btn btn-secondary">View Order History</Link>
          <Link to="/admin" className="btn btn-ghost">Inspect in Admin Cockpit →</Link>
        </div>
      </div>
    </div>
  );
}
