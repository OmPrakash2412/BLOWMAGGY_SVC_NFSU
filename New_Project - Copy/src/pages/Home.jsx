/* =========================================================
   BLOWMAGGY — Multiverse Home Page
   ========================================================= */
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { DEPARTMENTS, getFeaturedProducts, ALL_PRODUCTS, getProductsByDepartment } from '../data/catalog.js';
import ProductCard from '../components/ProductCard.jsx';
import './Home.css';

export default function Home() {
  const { toggleOrbit } = useApp();
  const featured = getFeaturedProducts(8);

  return (
    <div className="home-page animate-fade-in">
      {/* Hero Multiverse Portal */}
      <section className="hero-section container">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge badge-magenta">✦ THE MULTIVERSE COMMERCE PLATFORM</span>
          </div>
          <h1 className="hero-title">
            One Universe.<br />
            <span className="hero-gradient-text">Six Connected Worlds.</span><br />
            One Unified Cart.
          </h1>
          <p className="hero-subtitle">
            Why jump between disconnected apps? Discover runway fashion, clean beauty, high-performance electronics, sanctuary home decor, fresh daily grocery, and kids wonderland — in one seamless, high-velocity journey.
          </p>

          <div className="hero-cta-group">
            <a href="#multiverse-grid" className="btn btn-primary">
              Explore 6 Worlds ↓
            </a>
            <button className="btn btn-secondary orbit-hero-btn" onClick={toggleOrbit}>
              <span className="hero-orbit-dot"></span> Launch ORBIT Copilot
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="hero-stats-grid">
            <div className="hero-stat">
              <strong>6</strong>
              <span>Distinct Worlds</span>
            </div>
            <div className="hero-stat-sep">/</div>
            <div className="hero-stat">
              <strong>{ALL_PRODUCTS.length}+</strong>
              <span>Verified SKUs</span>
            </div>
            <div className="hero-stat-sep">/</div>
            <div className="hero-stat">
              <strong>100%</strong>
              <span>Unified Cart</span>
            </div>
            <div className="hero-stat-sep">/</div>
            <div className="hero-stat">
              <strong>₹0</strong>
              <span>Cross-Ship Penalty</span>
            </div>
          </div>
        </div>
      </section>

      {/* Multiverse Department Gateways */}
      <section id="multiverse-grid" className="departments-section container">
        <div className="section-header">
          <div>
            <span className="section-label">PORTAL SELECTION</span>
            <h2 className="section-title">Enter The Multiverse</h2>
          </div>
          <p className="section-desc">Each department possesses its own bespoke atmosphere, curated catalog, and dedicated visual language.</p>
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
                  <span className="dept-count-badge">{count} SKUs</span>
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
                  <span className="dept-enter-link">Enter Portal →</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ORBIT Feature Callout */}
      <section className="orbit-feature-banner container">
        <div className="orbit-banner-inner glass-card">
          <div className="orbit-banner-left">
            <span className="badge badge-cyan">SIGNATURE AI COPILOT</span>
            <h2>Meet ORBIT — The Cross-Category Budget Engine</h2>
            <p>
              Tell ORBIT your total budget and what you need across multiple departments. ORBIT analyzes live catalog pricing, generates verified product combinations, and assembles a ready-to-buy cross-department cart with one click.
            </p>
            <div className="orbit-sample-prompts">
              <span className="sample-tag" onClick={toggleOrbit}>"College starter under ₹5,000"</span>
              <span className="sample-tag" onClick={toggleOrbit}>"WFH setup under ₹25,000"</span>
              <span className="sample-tag" onClick={toggleOrbit}>"Weekend glow kit"</span>
            </div>
            <button className="btn btn-primary" onClick={toggleOrbit}>
              Launch ORBIT Assistant ◈
            </button>
          </div>
          <div className="orbit-banner-right">
            <div className="orbit-preview-device">
              <div className="orbit-device-header">
                <span className="status-dot"></span>
                <span>ORBIT Engine v2.4 Active</span>
              </div>
              <div className="orbit-device-body">
                <div className="preview-stat-card">
                  <span>Cross-Basket Efficiency</span>
                  <strong>+38% vs Separate Orders</strong>
                </div>
                <div className="preview-stat-card">
                  <span>Price Consistency</span>
                  <strong>Integer Minor Unit (Paise)</strong>
                </div>
                <div className="preview-stat-card">
                  <span>Algorithm</span>
                  <strong>Multi-Knapsack Budget Matcher</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Multiverse Products */}
      <section className="featured-section container">
        <div className="section-header">
          <div>
            <span className="section-label">CURATED DROPS</span>
            <h2 className="section-title">Trending Across The Multiverse</h2>
          </div>
          <Link to="/search" className="btn btn-secondary btn-sm">
            View All Catalog →
          </Link>
        </div>

        <div className="products-grid">
          {featured.map(product => (
            <ProductCard key={product.id} product={product} showDepartment={true} />
          ))}
        </div>
      </section>

      {/* Why BLOWMAGGY */}
      <section className="differentiator-section container">
        <div className="differentiator-grid">
          <div className="diff-card glass-card">
            <div className="diff-icon">🛒</div>
            <h3>Unified Cross-Category Cart</h3>
            <p>Combine high-end laptops, organic vegetables, designer sneakers, and kids toys into a single checkout with synchronized fulfillment.</p>
          </div>
          <div className="diff-card glass-card">
            <div className="diff-icon">🔒</div>
            <h3>Financial Grade Security</h3>
            <p>All calculations done in integer minor units (paise) prevents rounding bugs. Strict client-to-server recalculation guarantees checkout integrity.</p>
          </div>
          <div className="diff-card glass-card">
            <div className="diff-icon">⚡</div>
            <h3>Zero Latency Architecture</h3>
            <p>Instantaneous client-side routing, route-level code splitting, accessible ARIA attributes, and responsive modern CSS.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
