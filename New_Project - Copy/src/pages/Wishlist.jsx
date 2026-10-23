/* =========================================================
   BLOWMAGGY — Customer Wishlist Page
   ========================================================= */
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { getProductById } from '../data/catalog.js';
import ProductCard from '../components/ProductCard.jsx';
import './Wishlist.css';

export default function Wishlist() {
  const { wishlist } = useApp();
  const wishlistedProducts = wishlist
    .map(id => getProductById(id))
    .filter(Boolean);

  if (wishlistedProducts.length === 0) {
    return (
      <div className="container wishlist-empty-stage animate-fade-in">
        <div className="wishlist-empty-card glass-card">
          <span className="empty-icon">♡</span>
          <h2>Your Wishlist is Empty</h2>
          <p>Explore fashion, tech, groceries, or home decor and tap the heart icon on any product to save it here.</p>
          <Link to="/" className="btn btn-primary">Start Exploring</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-page container animate-fade-in">
      <div className="wishlist-header">
        <h1 className="wishlist-title">My Saved Wishlist</h1>
        <p className="wishlist-sub">
          {wishlistedProducts.length} items saved across the multiverse continuum.
        </p>
      </div>

      <div className="wishlist-products-grid">
        {wishlistedProducts.map(product => (
          <ProductCard key={product.id} product={product} showDepartment={true} />
        ))}
      </div>
    </div>
  );
}
