/* =========================================================
   BLOWMAGGY — Unified Shopping Cart Page
   ========================================================= */
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { formatPrice, getDepartmentById } from '../data/catalog.js';
import './Cart.css';

export default function Cart() {
  const { cartItems, cartTotal, cartDepartments, updateCartQty, removeFromCart, clearCart } = useApp();
  const navigate = useNavigate();

  // Price calculations in integer minor units (paise)
  const subtotalPaise = cartTotal;
  const shippingPaise = cartItems.length > 0 ? 0 : 0; // Free multiverse shipping
  const estimatedGstPaise = Math.round(subtotalPaise * 0.18); // 18% GST display (already inclusive or breakdown)
  const finalTotalPaise = subtotalPaise;

  if (cartItems.length === 0) {
    return (
      <div className="container cart-empty-stage animate-fade-in">
        <div className="cart-empty-card glass-card">
          <span className="empty-cart-icon">🛒</span>
          <h2>Your Multiverse Cart is Empty</h2>
          <p>You haven't added any gear, fashion, groceries, or gadgets across our six connected worlds yet.</p>
          <div className="empty-actions">
            <Link to="/" className="btn btn-primary">Explore Multiverse</Link>
            <Link to="/search" className="btn btn-secondary">Search Catalog</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page container animate-fade-in">
      {/* Header */}
      <div className="cart-header">
        <div>
          <h1 className="cart-title">Unified Multiverse Cart</h1>
          <p className="cart-sub">
            Synchronized across <strong>{cartDepartments.length} connected worlds</strong> in one checkout.
          </p>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={clearCart}>
          Clear Entire Cart
        </button>
      </div>

      {/* Multiverse Departments In Cart Banner */}
      <div className="cart-multiverse-banner glass-card">
        <span className="multiverse-indicator-label">Active Portals in this Order:</span>
        <div className="cart-dept-tags-row">
          {cartDepartments.map(deptId => {
            const d = getDepartmentById(deptId);
            return (
              <span key={deptId} className="cart-dept-pill" style={{ '--dept-color': d?.color }}>
                {d?.icon} {d?.subtitle}
              </span>
            );
          })}
        </div>
        <span className="cart-fulfillment-badge">✓ Single Combined Fulfillment</span>
      </div>

      <div className="cart-layout-grid">
        {/* Left: Cart Items Table/List */}
        <div className="cart-items-column">
          {cartItems.map(item => {
            const dept = getDepartmentById(item.product.department);
            return (
              <div key={`${item.productId}-${item.variantId || 'base'}`} className="cart-item-card glass-card">
                <div className="cart-item-thumb" style={{ '--dept-color': dept?.color }}>
                  <span>{dept?.icon}</span>
                </div>

                <div className="cart-item-details">
                  <div className="cart-item-dept-tag" style={{ color: dept?.color }}>
                    {dept?.subtitle} &gt; {item.product.category}
                  </div>
                  <Link to={`/product/${item.product.id}`} className="cart-item-title">
                    {item.product.name}
                  </Link>
                  {item.variant && (
                    <span className="cart-item-variant">
                      Variant: <strong>{item.variant.value}</strong>
                    </span>
                  )}
                  <span className="cart-unit-price">
                    Unit: {formatPrice(item.product.pricePaise)}
                  </span>
                </div>

                {/* Quantity Controls */}
                <div className="cart-qty-ctrl">
                  <div className="qty-picker">
                    <button
                      type="button"
                      onClick={() => updateCartQty(item.productId, item.variantId, item.quantity - 1)}
                    >
                      -
                    </button>
                    <span className="qty-display">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateCartQty(item.productId, item.variantId, item.quantity + 1)}
                      disabled={item.quantity >= item.product.stockCount}
                    >
                      +
                    </button>
                  </div>
                  <button
                    className="cart-remove-link"
                    onClick={() => removeFromCart(item.productId, item.variantId)}
                  >
                    Remove
                  </button>
                </div>

                {/* Line Total */}
                <div className="cart-line-total">
                  <span className="line-total-val">{formatPrice(item.lineTotalPaise)}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Order Summary Panel */}
        <div className="cart-summary-column">
          <div className="order-summary-card glass-card">
            <h3 className="summary-title">Order Summary</h3>

            <div className="summary-rows-group">
              <div className="summary-row">
                <span>Subtotal ({cartItems.reduce((s, i) => s + i.quantity, 0)} items)</span>
                <strong>{formatPrice(subtotalPaise)}</strong>
              </div>
              <div className="summary-row">
                <span>Multiverse Unified Shipping</span>
                <strong className="free-shipping-text">FREE</strong>
              </div>
              <div className="summary-row">
                <span>GST (Estimated 18% Inclusive)</span>
                <span>{formatPrice(estimatedGstPaise)}</span>
              </div>
            </div>

            <div className="summary-total-divider"></div>

            <div className="summary-row total-row">
              <span>Final Total (Paise Acc.)</span>
              <strong className="summary-grand-total">{formatPrice(finalTotalPaise)}</strong>
            </div>

            <button
              className="btn btn-primary checkout-proceed-btn"
              onClick={() => navigate('/checkout')}
            >
              Proceed to Multiverse Checkout →
            </button>

            <div className="summary-guarantees">
              <span>🔒 256-Bit SSL Mock Security Boundary</span>
              <span>⚡ Recalculated Server-Side Integrity</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
