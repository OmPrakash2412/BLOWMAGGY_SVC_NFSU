/* =========================================================
   BLOWMAGGY — Department Manager API Routes
   =========================================================
   Restricted to: DEPARTMENT_MANAGER (and STORE_ADMIN)
   Scoped to: Manager's explicitly authorized department(s)
   ========================================================= */
import { Router } from 'express';
import { db } from '../db/database.js';
import { authenticateToken } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';

const router = Router();

// Apply auth & role gate to all manager routes
router.use(authenticateToken);
router.use(requireRole(['DEPARTMENT_MANAGER', 'STORE_ADMIN']));

// GET /api/manager/overview (Department Specific KPI Metrics)
router.get('/overview', (req, res) => {
  try {
    const isStoreAdmin = req.user.role === 'STORE_ADMIN';
    const assignedDepts = isStoreAdmin 
      ? db.departments.findMany().map(d => d.id) 
      : req.user.assignedDepartments;

    const products = db.products.findMany(p => assignedDepts.includes(p.departmentId));
    const allOrderItems = db.orderItems.findMany(i => assignedDepts.includes(i.departmentId));
    const inventory = db.inventory.findMany();

    // Compute metrics strictly for authorized departments
    const totalDeptGmvPaise = allOrderItems.reduce((sum, item) => sum + item.lineTotalPaise, 0);
    const lowStockItems = products.filter(p => {
      const inv = inventory.find(i => i.productId === p.id);
      const threshold = inv ? inv.lowStockThreshold : 10;
      return p.stockCount <= threshold;
    });

    res.json({
      manager: {
        id: req.user.id,
        name: req.user.fullName,
        assignedDepartments: assignedDepts
      },
      metrics: {
        totalSkus: products.length,
        totalStockUnits: products.reduce((sum, p) => sum + p.stockCount, 0),
        lowStockAlertCount: lowStockItems.length,
        departmentSalesPaise: totalDeptGmvPaise,
        totalUnitsDispatched: allOrderItems.reduce((sum, i) => sum + i.quantity, 0)
      },
      lowStockAlerts: lowStockItems.map(p => ({
        id: p.id,
        name: p.name,
        departmentId: p.departmentId,
        category: p.category,
        currentStock: p.stockCount,
        threshold: 10
      }))
    });
  } catch (err) {
    res.status(500).json({ error: 'SERVER_ERROR', message: err.message });
  }
});

// GET /api/manager/products (Scoped strictly to assigned department)
router.get('/products', (req, res) => {
  try {
    const isStoreAdmin = req.user.role === 'STORE_ADMIN';
    const assignedDepts = isStoreAdmin 
      ? db.departments.findMany().map(d => d.id) 
      : req.user.assignedDepartments;

    const products = db.products.findMany(p => assignedDepts.includes(p.departmentId));
    res.json({
      departmentCount: assignedDepts.length,
      assignedDepartments: assignedDepts,
      products
    });
  } catch (err) {
    res.status(500).json({ error: 'SERVER_ERROR', message: err.message });
  }
});

export default router;
