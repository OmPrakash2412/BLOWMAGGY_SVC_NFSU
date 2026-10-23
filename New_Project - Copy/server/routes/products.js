/* =========================================================
   BLOWMAGGY — Product & Catalog Routes
   =========================================================
   Public: Catalog browsing, search, details
   Protected: Product creation, updates, stock management
   RBAC: STORE_ADMIN (Global), DEPARTMENT_MANAGER (Assigned Dept Only)
   ========================================================= */
import { Router } from 'express';
import { db } from '../db/database.js';
import { authenticateToken } from '../middleware/auth.js';
import { requireRole, requireDepartmentAccess } from '../middleware/rbac.js';

const router = Router();

// GET /api/products (Public Catalog with Filters)
router.get('/', (req, res) => {
  try {
    const { department, category, q, inStockOnly, minPrice, maxPrice, sortBy } = req.query;

    let products = db.products.findMany();

    if (department) {
      products = products.filter(p => p.departmentId === department);
    }
    if (category) {
      products = products.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }
    if (inStockOnly === 'true') {
      products = products.filter(p => p.inStock);
    }
    if (minPrice) {
      products = products.filter(p => p.pricePaise >= parseInt(minPrice, 10));
    }
    if (maxPrice) {
      products = products.filter(p => p.pricePaise <= parseInt(maxPrice, 10));
    }
    if (q) {
      const query = q.toLowerCase().trim();
      products = products.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
      );
    }

    // Sorting
    if (sortBy === 'price-asc') products.sort((a, b) => a.pricePaise - b.pricePaise);
    else if (sortBy === 'price-desc') products.sort((a, b) => b.pricePaise - a.pricePaise);
    else if (sortBy === 'rating') products.sort((a, b) => b.rating - a.rating);
    else if (sortBy === 'name') products.sort((a, b) => a.name.localeCompare(b.name));

    res.json({
      total: products.length,
      products
    });
  } catch (err) {
    res.status(500).json({ error: 'SERVER_ERROR', message: err.message });
  }
});

// GET /api/products/:id (Public Single Product)
router.get('/:id', (req, res) => {
  try {
    const product = db.products.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'NOT_FOUND', message: `Product '${req.params.id}' not found.` });
    }
    const inventory = db.inventory.findByProduct(product.id);
    res.json({
      ...product,
      inventory
    });
  } catch (err) {
    res.status(500).json({ error: 'SERVER_ERROR', message: err.message });
  }
});

// POST /api/products (Create Product — Manager/Admin only)
router.post(
  '/',
  authenticateToken,
  requireRole(['STORE_ADMIN', 'DEPARTMENT_MANAGER']),
  requireDepartmentAccess('departmentId'),
  (req, res) => {
    try {
      const { departmentId, category, name, pricePaise, description, stockCount } = req.body;

      if (!departmentId || !category || !name || pricePaise === undefined) {
        return res.status(400).json({
          error: 'MISSING_FIELDS',
          message: 'departmentId, category, name, and pricePaise are required.'
        });
      }

      const product = db.products.create({
        departmentId,
        category,
        name,
        pricePaise: parseInt(pricePaise, 10),
        description: description || '',
        stockCount: parseInt(stockCount || 20, 10),
        inStock: (parseInt(stockCount || 20, 10) > 0)
      });

      // Initialize inventory record
      db.inventory.create({
        productId: product.id,
        stockCount: product.stockCount,
        reservedCount: 0,
        lowStockThreshold: 10
      });

      // Audit log
      db.auditLogs.log({
        userId: req.user.id,
        userRole: req.user.role,
        action: 'PRODUCT_CREATED',
        entity: 'Product',
        entityId: product.id,
        details: { name: product.name, department: departmentId, pricePaise: product.pricePaise }
      });

      res.status(201).json({
        message: 'Product created successfully.',
        product
      });
    } catch (err) {
      res.status(500).json({ error: 'SERVER_ERROR', message: err.message });
    }
  }
);

// PUT /api/products/:id (Update Product Details — Manager/Admin only)
router.put(
  '/:id',
  authenticateToken,
  requireRole(['STORE_ADMIN', 'DEPARTMENT_MANAGER']),
  requireDepartmentAccess(),
  (req, res) => {
    try {
      const existing = db.products.findById(req.params.id);
      if (!existing) {
        return res.status(404).json({ error: 'NOT_FOUND', message: `Product '${req.params.id}' not found.` });
      }

      const { name, category, pricePaise, description, inStock, stockCount } = req.body;

      const updated = db.products.update(req.params.id, {
        name: name !== undefined ? name : existing.name,
        category: category !== undefined ? category : existing.category,
        pricePaise: pricePaise !== undefined ? parseInt(pricePaise, 10) : existing.pricePaise,
        description: description !== undefined ? description : existing.description,
        inStock: inStock !== undefined ? Boolean(inStock) : existing.inStock,
        stockCount: stockCount !== undefined ? parseInt(stockCount, 10) : existing.stockCount
      });

      // Update inventory record
      if (stockCount !== undefined) {
        db.inventory.update(existing.id, { stockCount: parseInt(stockCount, 10) });
      }

      // Audit log
      db.auditLogs.log({
        userId: req.user.id,
        userRole: req.user.role,
        action: 'PRODUCT_UPDATED',
        entity: 'Product',
        entityId: updated.id,
        details: { updates: req.body, departmentId: existing.departmentId }
      });

      res.json({
        message: 'Product updated successfully.',
        product: updated
      });
    } catch (err) {
      res.status(500).json({ error: 'SERVER_ERROR', message: err.message });
    }
  }
);

// PATCH /api/products/:id/stock (Stock Override — Manager/Admin only)
router.patch(
  '/:id/stock',
  authenticateToken,
  requireRole(['STORE_ADMIN', 'DEPARTMENT_MANAGER']),
  requireDepartmentAccess(),
  (req, res) => {
    try {
      const { stockCount, inStock } = req.body;
      const product = db.products.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ error: 'NOT_FOUND', message: 'Product not found.' });
      }

      const count = stockCount !== undefined ? Math.max(0, parseInt(stockCount, 10)) : product.stockCount;
      const available = inStock !== undefined ? Boolean(inStock) : count > 0;

      const updated = db.products.update(product.id, {
        stockCount: count,
        inStock: available
      });

      db.inventory.update(product.id, { stockCount: count });

      // Audit log
      db.auditLogs.log({
        userId: req.user.id,
        userRole: req.user.role,
        action: 'STOCK_OVERRIDDEN',
        entity: 'Product',
        entityId: product.id,
        details: { previousStock: product.stockCount, newStock: count, inStock: available }
      });

      res.json({
        message: 'Stock updated successfully.',
        product: updated
      });
    } catch (err) {
      res.status(500).json({ error: 'SERVER_ERROR', message: err.message });
    }
  }
);

// DELETE /api/products/:id (Delete Product — Manager/Admin only)
router.delete(
  '/:id',
  authenticateToken,
  requireRole(['STORE_ADMIN', 'DEPARTMENT_MANAGER']),
  requireDepartmentAccess(),
  (req, res) => {
    try {
      const product = db.products.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ error: 'NOT_FOUND', message: 'Product not found.' });
      }

      const deleted = db.products.delete(product.id);

      db.auditLogs.log({
        userId: req.user.id,
        userRole: req.user.role,
        action: 'PRODUCT_DELETED',
        entity: 'Product',
        entityId: product.id,
        details: { name: product.name, department: product.departmentId }
      });

      res.json({
        message: 'Product deleted successfully.',
        product: deleted
      });
    } catch (err) {
      res.status(500).json({ error: 'SERVER_ERROR', message: err.message });
    }
  }
);

export default router;
