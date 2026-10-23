/* =========================================================
   BLOWMAGGY — Admin Product & Inventory Management
   ========================================================= */
import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ALL_PRODUCTS, DEPARTMENTS, formatPrice } from '../../data/catalog.js';
import { useApp } from '../../context/AppContext.jsx';
import './Admin.css';

export default function AdminProducts() {
  const { addToast } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  
  // Local state for stock overrides
  const [stockOverrides, setStockOverrides] = useState({});

  const filteredProducts = useMemo(() => {
    return ALL_PRODUCTS.filter(p => {
      const matchesSearch = !searchTerm || p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDept = !selectedDept || p.department === selectedDept;
      return matchesSearch && matchesDept;
    });
  }, [searchTerm, selectedDept]);

  const handleStockChange = (productId, newCount) => {
    const clamped = Math.max(0, parseInt(newCount, 10) || 0);
    setStockOverrides(prev => ({ ...prev, [productId]: clamped }));
    addToast(`Updated stock count for SKU ${productId}`, 'info');
  };

  const handleToggleStock = (productId, currentStatus) => {
    setStockOverrides(prev => ({
      ...prev,
      [`${productId}_instock`]: !currentStatus
    }));
    addToast(`Toggled in-stock status for ${productId}`, 'info');
  };

  return (
    <div className="admin-page container animate-fade-in">
      <div className="admin-header">
        <div>
          <span className="badge badge-magenta">INVENTORY MANAGEMENT</span>
          <h1 className="admin-title">Catalog & Stock Controls</h1>
          <p className="admin-sub">Monitor inventory thresholds, modify availability, and audit pricing.</p>
        </div>
        <div className="admin-nav-links">
          <Link to="/admin" className="btn btn-secondary btn-sm">← Back to Cockpit</Link>
          <Link to="/admin/orders" className="btn btn-secondary btn-sm">Manage Orders</Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="admin-controls-card glass-card">
        <input
          type="search"
          placeholder="Filter by SKU name or category..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="admin-search-input"
        />

        <select
          value={selectedDept}
          onChange={e => setSelectedDept(e.target.value)}
          className="admin-dept-select"
        >
          <option value="">All Multiverse Departments</option>
          {DEPARTMENTS.map(d => (
            <option key={d.id} value={d.id}>{d.name} ({d.subtitle})</option>
          ))}
        </select>

        <span className="products-count-badge">
          Showing {filteredProducts.length} of {ALL_PRODUCTS.length} SKUs
        </span>
      </div>

      {/* Product Table */}
      <div className="admin-table-container glass-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>SKU / ID</th>
              <th>Product Name</th>
              <th>Department</th>
              <th>Price (INR)</th>
              <th>Rating</th>
              <th>Current Stock</th>
              <th>Availability</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(p => {
              const currentStock = stockOverrides[p.id] !== undefined ? stockOverrides[p.id] : p.stockCount;
              const isInStock = stockOverrides[`${p.id}_instock`] !== undefined 
                ? stockOverrides[`${p.id}_instock`] 
                : (p.inStock && currentStock > 0);

              return (
                <tr key={p.id}>
                  <td className="sku-cell"><code>{p.id}</code></td>
                  <td className="name-cell">
                    <strong>{p.name}</strong>
                    <span className="sub-cat">{p.category}</span>
                  </td>
                  <td>
                    <span className="dept-tag-cell">{p.department}</span>
                  </td>
                  <td className="price-cell">{formatPrice(p.pricePaise)}</td>
                  <td>★ {p.rating.toFixed(1)}</td>
                  <td>
                    <input
                      type="number"
                      min="0"
                      max="999"
                      value={currentStock}
                      onChange={e => handleStockChange(p.id, e.target.value)}
                      className="stock-input"
                    />
                  </td>
                  <td>
                    <span className={`status-pill ${isInStock ? 'in-stock' : 'out-of-stock'}`}>
                      {isInStock ? 'Available' : 'Out of Stock'}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleToggleStock(p.id, isInStock)}
                    >
                      {isInStock ? 'Set OOS' : 'Restock'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
