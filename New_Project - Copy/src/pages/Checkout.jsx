/* =========================================================
   BLOWMAGGY — Checkout & Address Selection
   ========================================================= */
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { formatPrice } from '../data/catalog.js';
import './Checkout.css';

export default function Checkout() {
  const { cartItems, cartTotal, placeOrder, addToast } = useApp();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: 'Raju Ranjan',
    phone: '+91 98765 43210',
    street: 'Flat 402, Quantum Heights, Silicon Corridor',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560103',
  });

  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [upiId, setUpiId] = useState('raju@okhdfcbank');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (cartItems.length === 0) {
    return (
      <div className="container checkout-empty">
        <h2>No Items in Checkout</h2>
        <p>Your cart has been cleared or already processed.</p>
        <Link to="/" className="btn btn-primary">Return Home</Link>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitOrder = (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.street || !formData.pincode) {
      addToast('Please fill all mandatory shipping address fields', 'warning');
      return;
    }

    // Idempotency guard
    if (isSubmitting) return;
    setIsSubmitting(true);

    // Simulate server-side cryptographic order synthesis & verification
    setTimeout(() => {
      const orderId = `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
      placeOrder({
        address: formData,
        paymentMethod,
        upiId: paymentMethod === 'upi' ? upiId : null,
      });

      setIsSubmitting(false);
      navigate(`/order-confirmation/${orderId}`);
    }, 800);
  };

  return (
    <div className="checkout-page container animate-fade-in">
      <div className="checkout-header">
        <h1 className="checkout-title">Multiverse Checkout</h1>
        <p className="checkout-sub">Final step to deploy your cross-category order across all dimensions.</p>
      </div>

      <form onSubmit={handleSubmitOrder} className="checkout-layout-grid">
        {/* Left Column: Shipping & Payment */}
        <div className="checkout-main-forms">
          {/* Shipping Address */}
          <div className="checkout-section-card glass-card">
            <div className="section-title-wrap">
              <span className="step-num">1</span>
              <div>
                <h3>Delivery Address</h3>
                <p>Standard delivery to your residential or campus address.</p>
              </div>
            </div>

            <div className="form-grid-2">
              <div className="input-group">
                <label htmlFor="fullName">Full Recipient Name *</label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="input-field"
                />
              </div>
              <div className="input-group">
                <label htmlFor="phone">Contact Mobile Number *</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="input-field"
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="street">Street Address & Landmark *</label>
              <input
                id="street"
                name="street"
                type="text"
                required
                value={formData.street}
                onChange={handleInputChange}
                className="input-field"
              />
            </div>

            <div className="form-grid-3">
              <div className="input-group">
                <label htmlFor="city">City *</label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  required
                  value={formData.city}
                  onChange={handleInputChange}
                  className="input-field"
                />
              </div>
              <div className="input-group">
                <label htmlFor="state">State *</label>
                <select
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="input-field"
                >
                  <option value="Karnataka">Karnataka</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Delhi NCR">Delhi NCR</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Telangana">Telangana</option>
                  <option value="West Bengal">West Bengal</option>
                  <option value="Gujarat">Gujarat</option>
                </select>
              </div>
              <div className="input-group">
                <label htmlFor="pincode">Pincode *</label>
                <input
                  id="pincode"
                  name="pincode"
                  type="text"
                  required
                  pattern="[0-9]{6}"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  className="input-field"
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="checkout-section-card glass-card">
            <div className="section-title-wrap">
              <span className="step-num">2</span>
              <div>
                <h3>Payment Continuum</h3>
                <p>Select verified payment pathway (Safe Demo Simulation).</p>
              </div>
            </div>

            <div className="payment-options-grid">
              <label className={`payment-card ${paymentMethod === 'upi' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="upi"
                  checked={paymentMethod === 'upi'}
                  onChange={e => setPaymentMethod(e.target.value)}
                />
                <span className="pay-icon">📱</span>
                <div>
                  <strong>Instant UPI</strong>
                  <p>GPay, PhonePe, Paytm, BHIM</p>
                </div>
              </label>

              <label className={`payment-card ${paymentMethod === 'card' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={e => setPaymentMethod(e.target.value)}
                />
                <span className="pay-icon">💳</span>
                <div>
                  <strong>Debit / Credit Card</strong>
                  <p>Visa, MasterCard, RuPay</p>
                </div>
              </label>

              <label className={`payment-card ${paymentMethod === 'cod' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={e => setPaymentMethod(e.target.value)}
                />
                <span className="pay-icon">💵</span>
                <div>
                  <strong>Pay on Delivery</strong>
                  <p>Cash / QR code at doorstep</p>
                </div>
              </label>
            </div>

            {paymentMethod === 'upi' && (
              <div className="upi-input-box animate-fade-in">
                <label htmlFor="upiId">Virtual Payment Address (VPA / UPI ID)</label>
                <input
                  id="upiId"
                  type="text"
                  value={upiId}
                  onChange={e => setUpiId(e.target.value)}
                  placeholder="username@bank"
                  className="input-field"
                />
                <span className="demo-notice-text">Demo transaction simulation — no real currency transferred.</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Order Review */}
        <div className="checkout-sidebar">
          <div className="order-review-card glass-card">
            <h3>Review Multiverse Items ({cartItems.length})</h3>

            <div className="review-items-list">
              {cartItems.map(item => (
                <div key={`${item.productId}-${item.variantId || 'b'}`} className="review-item-row">
                  <div>
                    <strong className="review-item-name">{item.product.name}</strong>
                    <span className="review-item-meta">
                      Qty: {item.quantity} • {item.product.department}
                    </span>
                  </div>
                  <span className="review-item-price">{formatPrice(item.lineTotalPaise)}</span>
                </div>
              ))}
            </div>

            <div className="summary-total-divider"></div>

            <div className="checkout-totals-group">
              <div className="summary-row">
                <span>Items Subtotal</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
              <div className="summary-row">
                <span>Cross-Multiverse Shipping</span>
                <span className="free-shipping-text">FREE</span>
              </div>
              <div className="summary-row total-row">
                <span>Total Payable</span>
                <strong className="summary-grand-total">{formatPrice(cartTotal)}</strong>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary place-order-btn"
            >
              {isSubmitting ? 'Verifying & Deploying Order...' : `Confirm & Place Order (${formatPrice(cartTotal)})`}
            </button>

            <p className="order-disclaimer-text">
              By clicking confirm, your mock order will be registered in the local data continuum and viewable under Admin Cockpit.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
