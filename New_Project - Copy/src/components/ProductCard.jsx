/* =========================================================
   ProductCard — Responsive product card with department color
   ========================================================= */
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { formatPrice, getDepartmentById } from '../data/catalog.js';
import './ProductCard.css';

export default function ProductCard({ product, showDepartment = false }) {
  const { addToCart, toggleWishlist, isInWishlist } = useApp();
  const dept = getDepartmentById(product.department);
  const wishlisted = isInWishlist(product.id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product.id);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <article className="product-card glass-card animate-fade-in" data-department={product.department}>
      <Link to={`/product/${product.id}`} className="product-card-link" aria-label={`View ${product.name}`}>
        {/* Image placeholder with department color */}
        <div className="product-card-image" style={{ '--dept-color': dept?.color || '#8b5cf6' }}>
          <div className="product-card-visual">
            <span className="product-emoji">{dept?.icon || '📦'}</span>
            <span className="product-initial">{product.name.charAt(0)}</span>
          </div>
          {product.badge && (
            <span className="product-badge" style={{ background: dept?.color }}>{product.badge}</span>
          )}
          <button
            className={`wishlist-btn ${wishlisted ? 'active' : ''}`}
            onClick={handleWishlist}
            aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            {wishlisted ? '❤️' : '🤍'}
          </button>
        </div>

        {/* Info */}
        <div className="product-card-info">
          {showDepartment && (
            <span className="product-dept-tag" style={{ color: dept?.color }}>
              {dept?.icon} {dept?.subtitle}
            </span>
          )}
          <span className="product-category">{product.category}</span>
          <h3 className="product-name">{product.name}</h3>
          <div className="product-rating">
            <span className="stars" aria-label={`${product.rating.toFixed(1)} out of 5 stars`}>
              {'★'.repeat(Math.round(product.rating))}{'☆'.repeat(5 - Math.round(product.rating))}
            </span>
            <span className="review-count">({product.reviewCount})</span>
          </div>
          <div className="product-price-row">
            <span className="product-price">{formatPrice(product.pricePaise)}</span>
            {product.originalPricePaise && (
              <span className="product-original-price">{formatPrice(product.originalPricePaise)}</span>
            )}
          </div>
        </div>
      </Link>

      {/* Quick Add */}
      <button
        className="quick-add-btn"
        onClick={handleAddToCart}
        disabled={!product.inStock}
        aria-label={`Add ${product.name} to cart`}
      >
        {product.inStock ? '+ Add to Cart' : 'Out of Stock'}
      </button>
    </article>
  );
}
