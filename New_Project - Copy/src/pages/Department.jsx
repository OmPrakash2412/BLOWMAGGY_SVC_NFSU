/* =========================================================
   BLOWMAGGY — Department Portal Page
   ========================================================= */
import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getDepartmentById, getProductsByDepartment, CATEGORIES } from '../data/catalog.js';
import ProductCard from '../components/ProductCard.jsx';
import './Department.css';

export default function Department() {
  const { deptId } = useParams();
  const dept = getDepartmentById(deptId);
  const rawProducts = useMemo(() => getProductsByDepartment(deptId), [deptId]);
  const categories = CATEGORIES[deptId] || [];

  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [sortBy, setSortBy] = useState('featured');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState(150000); // in Rupees

  // Filter & Sort
  const filteredProducts = useMemo(() => {
    let list = [...rawProducts];

    if (selectedCategory !== 'ALL') {
      list = list.filter(p => p.category === selectedCategory);
    }

    if (inStockOnly) {
      list = list.filter(p => p.inStock);
    }

    list = list.filter(p => (p.pricePaise / 100) <= maxPrice);

    switch (sortBy) {
      case 'price-asc':
        list.sort((a, b) => a.pricePaise - b.pricePaise);
        break;
      case 'price-desc':
        list.sort((a, b) => b.pricePaise - a.pricePaise);
        break;
      case 'rating':
        list.sort((a, b) => b.rating - a.rating);
        break;
      case 'name':
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }

    return list;
  }, [rawProducts, selectedCategory, inStockOnly, maxPrice, sortBy]);

  if (!dept) {
    return (
      <div className="container dept-not-found">
        <h2>Department Not Found</h2>
        <p>The universe portal you requested does not exist.</p>
        <Link to="/" className="btn btn-primary">Return Home</Link>
      </div>
    );
  }

  return (
    <div className="department-page animate-fade-in" style={{ '--dept-theme': dept.color }}>
      {/* Department Hero Portal Header */}
      <header className="dept-header">
        {/* Background photo */}
        {dept.bgImage && (
          <img
            src={dept.bgImage}
            alt={dept.name}
            className="dept-header-bg"
            loading="eager"
          />
        )}
        {/* Dark scrim overlay */}
        <div className="dept-header-scrim"></div>

        <div className="container dept-header-inner">
          <div className="dept-breadcrumbs">
            <Link to="/">Home</Link> <span>/</span> <span className="active-crumb">{dept.subtitle}</span>
          </div>
          <div className="dept-hero-titles">
            <span className="dept-hero-icon">{dept.icon}</span>
            <div>
              <span className="dept-badge-pill" style={{ borderColor: 'rgba(255,255,255,0.6)' }}>
                {dept.subtitle.toUpperCase()} COLLECTION
              </span>
              <h1 className="dept-title">{dept.name}</h1>
              <p className="dept-tagline-text">{dept.tagline}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Category Pills Bar */}
      <section className="category-pills-bar container">
        <div className="category-pills-scroll">
          <button
            className={`cat-pill ${selectedCategory === 'ALL' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('ALL')}
          >
            All Items ({rawProducts.length})
          </button>
          {categories.map(cat => {
            const count = rawProducts.filter(p => p.category === cat).length;
            return (
              <button
                key={cat}
                className={`cat-pill ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>
      </section>

      {/* Main Catalog View with Filters */}
      <div className="dept-content container">
        {/* Filter Controls Row */}
        <div className="dept-controls-bar glass-card">
          <div className="controls-left">
            <label className="checkbox-control">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={e => setInStockOnly(e.target.checked)}
              />
              <span>In-Stock Only</span>
            </label>

            <div className="price-filter-control">
              <span>Max Price: ₹{maxPrice.toLocaleString('en-IN')}</span>
              <input
                type="range"
                min="500"
                max="150000"
                step="1000"
                value={maxPrice}
                onChange={e => setMaxPrice(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="controls-right">
            <span className="items-count-text">{filteredProducts.length} Products Found</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="sort-dropdown"
              aria-label="Sort products"
            >
              <option value="featured">Sort: Featured Drops</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="name">Name (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="dept-products-grid">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="empty-catalog-state glass-card">
            <span className="empty-icon">🔍</span>
            <h3>No products match your filters</h3>
            <p>Try expanding your price range or clearing category filters.</p>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => { setSelectedCategory('ALL'); setInStockOnly(false); setMaxPrice(150000); }}
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
