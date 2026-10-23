/* =========================================================
   BLOWMAGGY — Orders & Checkout Routes
   =========================================================
   - Server-side price calculation & stock verification
   - Shopper data isolation (shoppers can only view their own orders)
   - Status updates with audit logs
   ========================================================= */
import { Router } from 'express';
import { db } from '../db/database.js';
import { authenticateToken } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';

const router = Router();

// POST /api/orders/checkout (Place Order — Shopper / Authenticated User)
router.post('/checkout', authenticateToken, (req, res) => {
  try {
    const { items, address, paymentMethod, couponCode } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'EMPTY_CART', message: 'Cart items are required to place an order.' });
    }

    if (!address || !address.fullName || !address.street || !address.pincode) {
      return res.status(400).json({ error: 'INVALID_ADDRESS', message: 'Complete delivery address is required.' });
    }

    // SERVER-SIDE TRANSACTION & PRICE RECALCULATION
    // Client cannot forge prices; recalculate directly from database catalog!
    let subtotalPaise = 0;
    const validatedOrderItems = [];

    for (const item of items) {
      const product = db.products.findById(item.productId);
      if (!product) {
        return res.status(400).json({ error: 'INVALID_SKU', message: `Product '${item.productId}' not found in catalog.` });
      }

      if (!product.inStock || product.stockCount <= 0) {
        return res.status(400).json({
          error: 'OUT_OF_STOCK',
          message: `Product '${product.name}' is out of stock.`
        });
      }

      const qty = Math.max(1, parseInt(item.quantity, 10));
      if (qty > product.stockCount) {
        return res.status(400).json({
          error: 'EXCESSIVE_QUANTITY',
          message: `Cannot purchase ${qty} units of '${product.name}'. Only ${product.stockCount} available.`
        });
      }

      const lineTotal = product.pricePaise * qty;
      subtotalPaise += lineTotal;

      validatedOrderItems.push({
        productId: product.id,
        departmentId: product.departmentId,
        name: product.name,
        pricePaise: product.pricePaise,
        quantity: qty,
        lineTotalPaise: lineTotal
      });
    }

    // Server-Side Coupon Validation
    let discountPaise = 0;
    if (couponCode) {
      const coupon = db.coupons.findByCode(couponCode);
      if (coupon && subtotalPaise >= (coupon.minOrderPaise || 0)) {
        if (!coupon.departmentId || validatedOrderItems.some(i => i.departmentId === coupon.departmentId)) {
          const rawDiscount = Math.round(subtotalPaise * (coupon.discountPercent / 100));
          discountPaise = coupon.maxDiscountPaise ? Math.min(rawDiscount, coupon.maxDiscountPaise) : rawDiscount;
        }
      }
    }

    const totalPaise = Math.max(0, subtotalPaise - discountPaise);

    // Atomically persist order and decrement stock
    const order = db.transaction((tx) => {
      const newOrder = tx.orders.create({
        userId: req.user.id,
        totalPaise,
        subtotalPaise,
        discountPaise,
        status: 'confirmed',
        paymentMethod: paymentMethod || 'upi',
        paymentStatus: 'demo_verified',
        address
      });

      for (const vi of validatedOrderItems) {
        tx.orderItems.create({
          orderId: newOrder.id,
          ...vi
        });

        // Decrement stock in catalog and inventory
        const prod = tx.products.findById(vi.productId);
        if (prod) {
          const remaining = Math.max(0, prod.stockCount - vi.quantity);
          tx.products.update(prod.id, {
            stockCount: remaining,
            inStock: remaining > 0
          });
          tx.inventory.update(prod.id, { stockCount: remaining });
        }
      }

      // Log order creation
      tx.auditLogs.log({
        userId: req.user.id,
        userRole: req.user.role,
        action: 'ORDER_PLACED',
        entity: 'Order',
        entityId: newOrder.id,
        details: { totalPaise, itemCount: validatedOrderItems.length, paymentMethod }
      });

      return newOrder;
    });

    res.status(201).json({
      message: 'Order placed and verified successfully.',
      order: {
        ...order,
        items: validatedOrderItems
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'ORDER_PROCESSING_FAILED', message: err.message });
  }
});

// GET /api/orders/my-orders (Shopper Personal Order History)
router.get('/my-orders', authenticateToken, (req, res) => {
  try {
    const orders = db.orders.findByUser(req.user.id);
    const enriched = orders.map(o => ({
      ...o,
      items: db.orderItems.findByOrder(o.id)
    }));

    res.json({ orders: enriched });
  } catch (err) {
    res.status(500).json({ error: 'SERVER_ERROR', message: err.message });
  }
});

// GET /api/orders/:id (Order Detail with Strict Shopper Isolation)
router.get('/:id', authenticateToken, (req, res) => {
  try {
    const order = db.orders.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'NOT_FOUND', message: 'Order not found.' });
    }

    const items = db.orderItems.findByOrder(order.id);

    // SECURITY CHECK: Shopper cannot view other shoppers' orders!
    if (req.user.role === 'SHOPPER' && order.userId !== req.user.id) {
      db.auditLogs.log({
        userId: req.user.id,
        userRole: req.user.role,
        action: 'CROSS_USER_ORDER_ACCESS_BLOCKED',
        entity: 'Order',
        entityId: order.id,
        details: { orderOwnerId: order.userId, requesterId: req.user.id }
      });

      return res.status(403).json({
        error: 'FORBIDDEN',
        message: 'Forbidden: You do not have permission to view orders belonging to other customers.'
      });
    }

    // DEPARTMENT_MANAGER: can view if order contains an item from their department
    if (req.user.role === 'DEPARTMENT_MANAGER') {
      const hasAssignedDept = items.some(i => req.user.assignedDepartments.includes(i.departmentId));
      if (!hasAssignedDept) {
        return res.status(403).json({
          error: 'DEPARTMENT_ACCESS_DENIED',
          message: 'Forbidden: This order does not contain products from your authorized departments.'
        });
      }
    }

    res.json({
      ...order,
      items
    });
  } catch (err) {
    res.status(500).json({ error: 'SERVER_ERROR', message: err.message });
  }
});

// PATCH /api/orders/:id/status (Update Order Fulfillment Status)
router.patch(
  '/:id/status',
  authenticateToken,
  requireRole(['STORE_ADMIN', 'DEPARTMENT_MANAGER']),
  (req, res) => {
    try {
      const { status } = req.body;
      const validStatuses = ['confirmed', 'packed', 'dispatched', 'delivered', 'cancelled'];

      if (!status || !validStatuses.includes(status)) {
        return res.status(400).json({
          error: 'INVALID_STATUS',
          message: `Status must be one of [${validStatuses.join(', ')}].`
        });
      }

      const order = db.orders.findById(req.params.id);
      if (!order) {
        return res.status(404).json({ error: 'NOT_FOUND', message: 'Order not found.' });
      }

      const updated = db.orders.updateStatus(order.id, status);

      db.auditLogs.log({
        userId: req.user.id,
        userRole: req.user.role,
        action: 'ORDER_STATUS_UPDATED',
        entity: 'Order',
        entityId: order.id,
        details: { previousStatus: order.status, newStatus: status }
      });

      res.json({
        message: `Order status updated to '${status}'.`,
        order: updated
      });
    } catch (err) {
      res.status(500).json({ error: 'SERVER_ERROR', message: err.message });
    }
  }
);

export default router;
