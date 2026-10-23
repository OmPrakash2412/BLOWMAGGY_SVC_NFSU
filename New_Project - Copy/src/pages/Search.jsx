/* =========================================================
   BLOWMAGGY — Global Search Page
   ========================================================= */
import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { searchProducts, DEPARTMENTS } from '../data/catalog.js';
import ProductCard from '../components/ProductCard.jsx';
import './Search.css';

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  
  const [searchTerm, setSearchTerm] = useState(queryParam);
  const [selectedDept, setSelectedDept] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [inStockOnly, setInStockOnly] = useState(false);

  useEffect(() => {
    setSearchTerm(queryParam);
  }, [queryParam]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchParams(searchTerm.trim() ? { q: searchTerm.trim() } : {});
  };

  const results = useMemo(() => {
    return searchProducts(searchTerm, {
      department: selectedDept || undefined,
      inStockOnly,
      sortBy
    });
  }, [searchTerm, selectedDept, inStockOnly, sortBy]);

  return (
    <div className="search-page container animate-fade-in">
      {/* Search Header */}
      <div className="search-hero">
        <h1 className="search-page-title">Multiverse Discovery</h1>
        <p className="search-page-sub">Search seamlessly across all six connected departments simultaneously.</p>

        <form onSubmit={handleSearchSubmit} className="search-main-form">
          <input
            type="search"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search keywords, items, categories, or tags..."
            className="search-main-input"
            id="search-page-input"
          />
          <button type="submit" className="btn btn-primary">Search</button>
        </form>

        {/* Quick Dept Filter Pills */}
        <div className="search-dept-pills">
          <button
            className={`dept-pill-btn ${selectedDept === '' ? 'active' : ''}`}
            onClick={() => setSelectedDept('')}
          >
            All Multiverse
          </button>
          {DEPARTMENTS.map(d => (
            <button
              key={d.id}
              className={`dept-pill-btn ${selectedDept === d.id ? 'active' : ''}`}
              style={{ '--dept-color': d.color }}
              onClick={() => setSelectedDept(d.id === selectedDept ? '' : d.id)}
            >
              {d.icon} {d.subtitle}
            </button>
          ))}
        </div>
      </div>

      {/* Results Bar */}
      <div className="search-meta-bar glass-card">
        <div className="meta-left">
          <strong>{results.length} results</strong>
          {searchTerm && <span>for "{searchTerm}"</span>}
          {selectedDept && <span>in {selectedDept}</span>}
        </div>
        <div className="meta-right">
          <label className="checkbox-control">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={e => setInStockOnly(e.target.checked)}
            />
            <span>In-Stock Only</span>
          </label>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="sort-dropdown"
          >
            <option value="rating">Highest Rated</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name">Name (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      {results.length > 0 ? (
        <div className="search-results-grid">
          {results.map(product => (
            <ProductCard key={product.id} product={product} showDepartment={true} />
          ))}
        </div>
      ) : (
        <div className="search-empty glass-card">
          <span className="search-empty-icon">🛸</span>
          <h3>No coordinates found in the multiverse</h3>
          <p>Try searching for general terms like "cotton", "headphones", "mango", or "organizer".</p>
          <div className="suggested-chips">
            <button className="sample-tag" onClick={() => setSearchTerm('Tee')}>Tees</button>
            <button className="sample-tag" onClick={() => setSearchTerm('Serum')}>Serums</button>
            <button className="sample-tag" onClick={() => setSearchTerm('Charger')}>Chargers</button>
            <button className="sample-tag" onClick={() => setSearchTerm('Organic')}>Organic</button>
            <button className="sample-tag" onClick={() => setSearchTerm('Chair')}>Chairs</button>
          </div>
        </div>
      )}
    </div>
  );
}
