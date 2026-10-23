/* =========================================================
   BLOWMAGGY — Product Detail Page
   ========================================================= */
import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { getProductById, getDepartmentById, formatPrice, ALL_PRODUCTS } from '../data/catalog.js';
import ProductCard from '../components/ProductCard.jsx';
import './ProductDetail.css';

export default function ProductDetail() {
  const { productId } = useParams();
  const { addToCart, toggleWishlist, isInWishlist } = useApp();
  const product = useMemo(() => getProductById(productId), [productId]);

  const [selectedVariant, setSelectedVariant] = useState(
    product?.variants && product.variants.length > 0 ? product.variants[0].id : null
  );
  const [qty, setQty] = useState(1);

  const dept = product ? getDepartmentById(product.department) : null;
  const wishlisted = product ? isInWishlist(product.id) : false;

  // Cross-category recommendations: pick 3 items from OTHER departments
  const crossRecommendations = useMemo(() => {
    if (!product) return [];
    return ALL_PRODUCTS
      .filter(p => p.department !== product.department && p.inStock)
      .slice(0, 4);
  }, [product]);

  if (!product) {
    return (
      <div className="container product-not-found">
        <h2>Product Not Found</h2>
        <p>This SKU is not available in the current multiverse continuum.</p>
        <Link to="/" className="btn btn-primary">Return to Multiverse</Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product.id, selectedVariant, qty);
  };

  return (
    <div className="product-detail-page animate-fade-in" style={{ '--dept-color': dept?.color || '#8b5cf6' }}>
      {/* Breadcrumbs */}
      <div className="container breadcrumb-row">
        <Link to="/">Multiverse</Link> <span>/</span>
        <Link to={`/department/${product.department}`}>{dept?.subtitle}</Link> <span>/</span>
        <span className="current-crumb">{product.name}</span>
      </div>

      {/* Main Product Showcase */}
      <div className="container product-showcase-grid">
        {/* Left: Product Visuals */}
        <div className="product-visual-stage glass-card">
          <div className="visual-hero-circle">
            <span className="visual-hero-emoji">{dept?.icon}</span>
            <span className="visual-hero-char">{product.name.charAt(0)}</span>
          </div>
          {product.badge && (
            <span className="product-hero-badge" style={{ background: dept?.color }}>
              {product.badge}
            </span>
          )}
          <div className="visual-footer-info">
            <span className="dept-auth-tag">Authentic {dept?.name} Certified</span>
            <span className="stock-status-pill in-stock">
              ● {product.inStock ? `${product.stockCount} units available` : 'Out of stock'}
            </span>
          </div>
        </div>

        {/* Right: Product Actions & Specs */}
        <div className="product-actions-panel glass-card">
          <div className="product-meta-header">
            <span className="dept-tag-name" style={{ color: dept?.color }}>
              {dept?.icon} {dept?.subtitle} &gt; {product.category}
            </span>
            <h1 className="product-title-text">{product.name}</h1>
            <div className="product-rating-bar">
              <span className="rating-stars">★ {product.rating.toFixed(1)}</span>
              <span className="rating-reviews">({product.reviewCount} verified multiverse reviews)</span>
            </div>
          </div>

          <div className="product-price-box">
            <div className="price-main-wrap">
              <span className="current-price-val">{formatPrice(product.pricePaise)}</span>
              {product.originalPricePaise && (
                <span className="original-price-val">{formatPrice(product.originalPricePaise)}</span>
              )}
            </div>
            <span className="tax-inclusive-tag">All taxes included • Integer-accurate billing</span>
          </div>

          <p className="product-desc-text">{product.description}</p>

          {/* Variants Selector */}
          {product.variants && product.variants.length > 0 && (
            <div className="variant-selection-group">
              <label className="variant-label">
                Select {product.variants[0].type.toUpperCase()}:
              </label>
              <div className="variant-options-row">
                {product.variants.map(v => (
                  <button
                    key={v.id}
                    type="button"
                    className={`variant-chip ${selectedVariant === v.id ? 'active' : ''}`}
                    onClick={() => setSelectedVariant(v.id)}
                  >
                    {v.value}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity & Actions */}
          <div className="cart-action-group">
            <div className="qty-picker">
              <button 
                type="button" 
                onClick={() => setQty(Math.max(1, qty - 1))}
                disabled={qty <= 1}
              >
                -
              </button>
              <span className="qty-display">{qty}</span>
              <button 
                type="button" 
                onClick={() => setQty(Math.min(product.stockCount, qty + 1))}
                disabled={qty >= product.stockCount}
              >
                +
              </button>
            </div>

            <button 
              type="button" 
              className="btn btn-primary add-to-cart-cta"
              onClick={handleAddToCart}
              disabled={!product.inStock}
            >
              🛒 Add To Unified Cart • {formatPrice(product.pricePaise * qty)}
            </button>

            <button
              type="button"
              className={`wishlist-action-btn ${wishlisted ? 'active' : ''}`}
              onClick={() => toggleWishlist(product.id)}
              aria-label="Wishlist"
            >
              {wishlisted ? '❤️' : '🤍'}
            </button>
          </div>

          {/* Shipping & Multiverse Guarantees */}
          <div className="product-perks-list">
            <div className="perk-item">
              <span>🚀</span>
              <div>
                <strong>Cross-Category Express Dispatch</strong>
                <p>Ships combined with items from any other department in a unified package.</p>
              </div>
            </div>
            <div className="perk-item">
              <span>🛡️</span>
              <div>
                <strong>Multiverse Quality Guarantee</strong>
                <p>7-day hassle-free replacement with verified reverse pickup.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cross-Department Synergy Section */}
      <section className="cross-department-recommendations container">
        <div className="section-header">
          <div>
            <span className="section-label">CROSS-DEPARTMENT DISCOVERY</span>
            <h2 className="section-title">Frequently Bundled In The Multiverse</h2>
          </div>
          <p className="section-desc">Products from other worlds that complement this item perfectly.</p>
        </div>

        <div className="cross-products-grid">
          {crossRecommendations.map(p => (
            <ProductCard key={p.id} product={p} showDepartment={true} />
          ))}
        </div>
      </section>
    </div>
  );
}
