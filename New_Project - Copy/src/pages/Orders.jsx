/* =========================================================
   BLOWMAGGY — Customer Order History Page
   ========================================================= */
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { formatPrice } from '../data/catalog.js';
import './Orders.css';

export default function Orders() {
  const { orders } = useApp();

  if (orders.length === 0) {
    return (
      <div className="container orders-empty-stage animate-fade-in">
        <div className="orders-empty-card glass-card">
          <span className="empty-icon">📦</span>
          <h2>No Multiverse Orders Found</h2>
          <p>You haven't dispatched any orders yet. Place your first cross-department bundle!</p>
          <Link to="/" className="btn btn-primary">Start Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page container animate-fade-in">
      <div className="orders-header">
        <h1 className="orders-title">My Multiverse Orders</h1>
        <p className="orders-sub">Real-time status tracking for all your combined shipments.</p>
      </div>

      <div className="orders-list">
        {orders.map(order => {
          const dateStr = new Date(order.createdAt).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });

          return (
            <div key={order.id} className="order-history-card glass-card">
              <div className="order-card-top">
                <div>
                  <span className="order-num-label">Order Reference:</span>
                  <strong className="order-num-val">{order.id}</strong>
                  <span className="order-date-text">{dateStr}</span>
                </div>
                <div className="order-status-wrap">
                  <span className="badge badge-success">● {order.status.toUpperCase()}</span>
                </div>
              </div>

              <div className="order-card-items">
                {order.items.map((item, idx) => (
                  <div key={idx} className="order-item-line">
                    <span className="order-item-dept">{item.department}</span>
                    <strong className="order-item-name">{item.name}</strong>
                    <span className="order-item-qty">Qty: {item.quantity}</span>
                    <span className="order-item-price">{formatPrice(item.lineTotalPaise)}</span>
                  </div>
                ))}
              </div>

              <div className="order-card-bottom">
                <div className="order-delivery-info">
                  {order.address && (
                    <span>Delivering to: {order.address.fullName}, {order.address.city}</span>
                  )}
                </div>
                <div className="order-total-block">
                  <span className="order-total-label">Total Paid:</span>
                  <strong className="order-total-amount">{formatPrice(order.totalPaise)}</strong>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
