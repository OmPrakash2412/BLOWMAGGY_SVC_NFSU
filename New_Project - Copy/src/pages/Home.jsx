/* =========================================================
   BLOWMAGGY - Z — Home Page
   ========================================================= */
import { Link } from 'react-router-dom';
import { DEPARTMENTS, getFeaturedProducts, ALL_PRODUCTS, getProductsByDepartment } from '../data/catalog.js';
import ProductCard from '../components/ProductCard.jsx';
import './Home.css';

export default function Home() {
  const featured = getFeaturedProducts(8);

  return (
    <div className="home-page animate-fade-in">
      {/* Hero Section */}
      <section className="hero-section container">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge badge-magenta">✶ YOUR COMPLETE SHOPPING DESTINATION</span>
          </div>
          <h1 className="hero-title">
            Shop Fashion, Beauty,<br />
            <span className="hero-gradient-text">Electronics & More.</span><br />
            One Cart. Zero Hassle.
          </h1>
          <p className="hero-subtitle">
            Everything you love — runway fashion, clean beauty, high-performance electronics, home essentials, fresh groceries, and kids’ favourites — all under one roof with a single seamless checkout.
          </p>

          <div className="hero-cta-group">
            <a href="#shop-categories" className="btn btn-primary">
              Shop Now ↓
            </a>
            <Link to="/search" className="btn btn-secondary">
              Browse All Products →
            </Link>
          </div>

          {/* Quick Metrics Bar */}
          <div className="hero-stats-grid">
            <div className="hero-stat">
              <strong>6</strong>
              <span>Categories</span>
            </div>
            <div className="hero-stat-sep">/</div>
            <div className="hero-stat">
              <strong>{ALL_PRODUCTS.length}+</strong>
              <span>Products</span>
            </div>
            <div className="hero-stat-sep">/</div>
            <div className="hero-stat">
              <strong>100%</strong>
              <span>Secure Checkout</span>
            </div>
            <div className="hero-stat-sep">/</div>
            <div className="hero-stat">
              <strong>₹0</strong>
              <span>Hidden Charges</span>
            </div>
          </div>
        </div>
      </section>

      {/* Department / Category Grid */}
      <section id="shop-categories" className="departments-section container">
        <div className="section-header">
          <div>
            <span className="section-label">SHOP BY CATEGORY</span>
            <h2 className="section-title">Explore Our Collections</h2>
          </div>
          <p className="section-desc">Discover hand-picked items across all our departments — each curated just for you.</p>
        </div>

        <div className="departments-grid">
          {DEPARTMENTS.map(dept => {
            const count = ALL_PRODUCTS.filter(p => p.department === dept.id).length;
            const previewProducts = getProductsByDepartment(dept.id)
              .filter(p => p.image)
              .slice(0, 3);
            return (
              <Link
                key={dept.id}
                to={`/department/${dept.id}`}
                className="dept-card"
                style={{ '--dept-color': dept.color }}
              >
                {/* Full background photo */}
                {dept.bgImage && (
                  <img
                    src={dept.bgImage}
                    alt={dept.name}
                    className="dept-card-bg-img"
                    loading="lazy"
                  />
                )}
                {/* Gradient overlay */}
                <div className="dept-card-overlay" style={{ background: `linear-gradient(to top, ${dept.color}EE 0%, ${dept.color}88 40%, transparent 100%)` }}></div>

                {/* Top row */}
                <div className="dept-card-top">
                  <span className="dept-portal-icon">{dept.icon}</span>
                  <span className="dept-count-badge">{count} Items</span>
                </div>

                {/* Mini product preview strip */}
                {previewProducts.length > 0 && (
                  <div className="dept-preview-strip">
                    {previewProducts.map(p => (
                      <div key={p.id} className="dept-preview-thumb">
                        <img src={p.image} alt={p.name} loading="lazy" />
                      </div>
                    ))}
                  </div>
                )}

                {/* Bottom content */}
                <div className="dept-card-bottom">
                  <span className="dept-micro-name">{dept.subtitle}</span>
                  <h3 className="dept-full-name">{dept.name}</h3>
                  <p className="dept-tagline">{dept.tagline}</p>
                  <span className="dept-enter-link">Shop Now →</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-section container">
        <div className="section-header">
          <div>
            <span className="section-label">TRENDING NOW</span>
            <h2 className="section-title">Customer Favourites</h2>
          </div>
          <Link to="/search" className="btn btn-secondary btn-sm">
            View All Products →
          </Link>
        </div>

        <div className="products-grid">
          {featured.map(product => (
            <ProductCard key={product.id} product={product} showDepartment={true} />
          ))}
        </div>
      </section>

      {/* Why BLOWMAGGY - Z */}
      <section className="differentiator-section container">
        <div className="differentiator-grid">
          <div className="diff-card glass-card">
            <div className="diff-icon">🛍️</div>
            <h3>One Cart for Everything</h3>
            <p>Mix fashion, food, electronics, and more in a single cart. One checkout, one delivery update — no juggling between apps.</p>
          </div>
          <div className="diff-card glass-card">
            <div className="diff-icon">🔒</div>
            <h3>100% Secure Payments</h3>
            <p>Bank-grade price validation on every order. What you see is what you pay — no surprise charges at checkout.</p>
          </div>
          <div className="diff-card glass-card">
            <div className="diff-icon">⚡</div>
            <h3>Fast & Easy Shopping</h3>
            <p>Lightning-fast search, smart filters, and a buttery-smooth experience across all devices.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
