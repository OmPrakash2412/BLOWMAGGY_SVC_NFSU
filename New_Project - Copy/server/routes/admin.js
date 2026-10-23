/* =========================================================
   BLOWMAGGY — Store Admin Platform API Routes
   =========================================================
   Restricted to: STORE_ADMIN
   Capabilities:
   - Platform-wide store metrics
   - Department Manager provisioning & assignment
   - Account status lifecycle (active/deactivate)
   - Immutable security audit logs
   ========================================================= */
import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../db/database.js';
import { authenticateToken } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';

const router = Router();

// Apply auth & STORE_ADMIN role gate to all admin routes
router.use(authenticateToken);
router.use(requireRole(['STORE_ADMIN']));

// GET /api/admin/metrics (Store-Wide Platform Metrics)
router.get('/metrics', (req, res) => {
  try {
    const orders = db.orders.findMany();
    const orderItems = db.orderItems.findMany();
    const products = db.products.findMany();
    const users = db.users.findMany();

    const totalGmvPaise = orders.reduce((sum, o) => sum + o.totalPaise, 0);

    // Cross-department order attach rate
    const crossDeptOrders = orders.filter(o => {
      const items = db.orderItems.findByOrder(o.id);
      const depts = new Set(items.map(i => i.departmentId));
      return depts.size > 1;
    });

    const crossBasketRate = orders.length > 0 
      ? Math.round((crossDeptOrders.length / orders.length) * 100) 
      : 100;

    res.json({
      metrics: {
        totalGmvPaise,
        totalOrders: orders.length,
        totalItemsSold: orderItems.reduce((sum, i) => sum + i.quantity, 0),
        crossBasketAttachRate: crossBasketRate,
        totalActiveSkus: products.length,
        totalUsers: users.length,
        usersByRole: {
          shoppers: users.filter(u => u.role === 'SHOPPER').length,
          departmentManagers: users.filter(u => u.role === 'DEPARTMENT_MANAGER').length,
          storeAdmins: users.filter(u => u.role === 'STORE_ADMIN').length
        }
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'SERVER_ERROR', message: err.message });
  }
});

// GET /api/admin/managers (List All Managers & Assignments)
router.get('/managers', (req, res) => {
  try {
    const managers = db.users.findMany(u => u.role === 'DEPARTMENT_MANAGER');
    const enriched = managers.map(m => {
      const assignments = db.departmentManagerAssignments.findByUser(m.id);
      return {
        id: m.id,
        email: m.email,
        fullName: m.fullName,
        status: m.status,
        createdAt: m.createdAt,
        assignedDepartments: assignments.map(a => a.departmentId)
      };
    });

    res.json({ managers: enriched });
  } catch (err) {
    res.status(500).json({ error: 'SERVER_ERROR', message: err.message });
  }
});

// POST /api/admin/managers (Provision New Department Manager)
router.post('/managers', async (req, res) => {
  try {
    const { email, password, fullName, departmentId } = req.body;

    if (!email || !password || !fullName || !departmentId) {
      return res.status(400).json({
        error: 'MISSING_FIELDS',
        message: 'Email, password, fullName, and departmentId are required.'
      });
    }

    const dept = db.departments.findById(departmentId);
    if (!dept) {
      return res.status(400).json({ error: 'INVALID_DEPARTMENT', message: `Department '${departmentId}' does not exist.` });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = db.users.create({
      email,
      passwordHash,
      fullName,
      role: 'DEPARTMENT_MANAGER',
      status: 'ACTIVE'
    });

    // Assign to requested department
    db.departmentManagerAssignments.create({
      userId: user.id,
      departmentId,
      assignedBy: req.user.id
    });

    db.auditLogs.log({
      userId: req.user.id,
      userRole: req.user.role,
      action: 'DEPARTMENT_MANAGER_PROVISIONED',
      entity: 'User',
      entityId: user.id,
      details: { email: user.email, assignedDepartment: departmentId }
    });

    res.status(201).json({
      message: 'Department Manager account provisioned successfully.',
      manager: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        assignedDepartments: [departmentId]
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'SERVER_ERROR', message: err.message });
  }
});

// POST /api/admin/managers/assign (Assign Manager to Department)
router.post('/managers/assign', (req, res) => {
  try {
    const { userId, departmentId } = req.body;
    const user = db.users.findById(userId);

    if (!user || user.role !== 'DEPARTMENT_MANAGER') {
      return res.status(400).json({ error: 'INVALID_USER', message: 'User must be an existing Department Manager.' });
    }

    const dept = db.departments.findById(departmentId);
    if (!dept) {
      return res.status(400).json({ error: 'INVALID_DEPARTMENT', message: 'Target department does not exist.' });
    }

    const assignment = db.departmentManagerAssignments.create({
      userId,
      departmentId,
      assignedBy: req.user.id
    });

    db.auditLogs.log({
      userId: req.user.id,
      userRole: req.user.role,
      action: 'DEPARTMENT_ASSIGNED_TO_MANAGER',
      entity: 'DepartmentManagerAssignment',
      entityId: assignment.id,
      details: { managerEmail: user.email, departmentId }
    });

    res.json({
      message: `Assigned manager '${user.fullName}' to department '${dept.name}'.`,
      assignment
    });
  } catch (err) {
    res.status(500).json({ error: 'SERVER_ERROR', message: err.message });
  }
});

// PATCH /api/admin/users/:id/status (Deactivate or Reactivate Account)
router.patch('/users/:id/status', (req, res) => {
  try {
    const { status } = req.body;
    if (!['ACTIVE', 'DEACTIVATED'].includes(status)) {
      return res.status(400).json({ error: 'INVALID_STATUS', message: "Status must be 'ACTIVE' or 'DEACTIVATED'." });
    }

    const user = db.users.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'NOT_FOUND', message: 'User not found.' });
    }

    // Protection: Store Admin cannot deactivate themselves accidentally
    if (user.id === req.user.id && status === 'DEACTIVATED') {
      return res.status(400).json({ error: 'SELF_DEACTIVATION_PREVENTED', message: 'You cannot deactivate your own administrative account.' });
    }

    const updated = db.users.update(user.id, { status });

    db.auditLogs.log({
      userId: req.user.id,
      userRole: req.user.role,
      action: status === 'DEACTIVATED' ? 'ACCOUNT_DEACTIVATED' : 'ACCOUNT_REACTIVATED',
      entity: 'User',
      entityId: user.id,
      details: { targetEmail: user.email, previousStatus: user.status, newStatus: status }
    });

    res.json({
      message: `User account '${user.email}' status updated to '${status}'.`,
      user: {
        id: updated.id,
        email: updated.email,
        status: updated.status
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'SERVER_ERROR', message: err.message });
  }
});

// GET /api/admin/audit-logs (Audit Trail for Administrative Review)
router.get('/audit-logs', (req, res) => {
  try {
    const limit = parseInt(req.query.limit || 50, 10);
    const logs = db.auditLogs.findMany().slice(0, limit);
    res.json({
      count: logs.length,
      logs
    });
  } catch (err) {
    res.status(500).json({ error: 'SERVER_ERROR', message: err.message });
  }
});

export default router;
