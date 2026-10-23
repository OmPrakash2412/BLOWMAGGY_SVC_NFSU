/* =========================================================
   BLOWMAGGY — Database Seeder
   =========================================================
   Seeds:
   - 6 Departments
   - 70+ Normalized Products across 6 Worlds
   - Inventory Records
   - 3 Primary User Roles + Seed Accounts (Bcrypt Hashed)
   - Department Manager Assignments
   - Promotional Coupons
   - Initial Audit Log
   ========================================================= */
import bcrypt from 'bcryptjs';
import { db } from './database.js';
import { ALL_PRODUCTS, DEPARTMENTS } from '../../src/data/catalog.js';

export async function seedDatabase() {
  console.log('[SEED] Starting BLOWMAGGY database initialization...');

  // Reset database to clean slate
  db.__reset();

  // 1. Seed Departments
  console.log('[SEED] Seeding 6 Multiverse Departments...');
  for (const dept of DEPARTMENTS) {
    db.departments.create({
      id: dept.id,
      name: dept.name,
      subtitle: dept.subtitle,
      tagline: dept.tagline,
      color: dept.color,
      icon: dept.icon
    });
  }

  // 2. Seed Users (Bcrypt 10 rounds)
  console.log('[SEED] Hashing credentials and provisioning users for 3 primary roles...');
  const salt = await bcrypt.genSalt(10);
  const shopperHash = await bcrypt.hash('shopper123', salt);
  const fashionMgrHash = await bcrypt.hash('manager123', salt);
  const techMgrHash = await bcrypt.hash('manager123', salt);
  const adminHash = await bcrypt.hash('admin123', salt);
  const deactivatedHash = await bcrypt.hash('deactivated123', salt);

  const shopper = db.users.create({
    id: 'usr_shopper_001',
    email: 'shopper@blowmaggy.com',
    passwordHash: shopperHash,
    fullName: 'Aarav Mehta (Student Shopper)',
    role: 'SHOPPER',
    status: 'ACTIVE'
  });

  const fashionManager = db.users.create({
    id: 'usr_mgr_fashion_001',
    email: 'manager.fashion@blowmaggy.com',
    passwordHash: fashionMgrHash,
    fullName: 'Elena Rostova (Fashion Dept Manager)',
    role: 'DEPARTMENT_MANAGER',
    status: 'ACTIVE'
  });

  const electronicsManager = db.users.create({
    id: 'usr_mgr_tech_001',
    email: 'manager.electronics@blowmaggy.com',
    passwordHash: techMgrHash,
    fullName: 'Devansh Roy (Tech Dept Manager)',
    role: 'DEPARTMENT_MANAGER',
    status: 'ACTIVE'
  });

  const storeAdmin = db.users.create({
    id: 'usr_admin_001',
    email: 'admin@blowmaggy.com',
    passwordHash: adminHash,
    fullName: 'Sunita Rao (Store Director & Platform Admin)',
    role: 'STORE_ADMIN',
    status: 'ACTIVE'
  });

  const deactivatedUser = db.users.create({
    id: 'usr_deactivated_001',
    email: 'deactivated@blowmaggy.com',
    passwordHash: deactivatedHash,
    fullName: 'Suspended Account',
    role: 'SHOPPER',
    status: 'DEACTIVATED'
  });

  // 3. Seed Department Manager Assignments
  console.log('[SEED] Mapping Department Manager assignments...');
  db.departmentManagerAssignments.create({
    id: 'dma_001',
    userId: fashionManager.id,
    departmentId: 'fashion',
    assignedBy: storeAdmin.id
  });

  db.departmentManagerAssignments.create({
    id: 'dma_002',
    userId: electronicsManager.id,
    departmentId: 'electronics',
    assignedBy: storeAdmin.id
  });

  // 4. Seed Products & Inventory
  console.log(`[SEED] Seeding ${ALL_PRODUCTS.length} normalized products and inventory records...`);
  for (const prod of ALL_PRODUCTS) {
    const p = db.products.create({
      id: prod.id,
      departmentId: prod.department,
      category: prod.category,
      name: prod.name,
      pricePaise: prod.pricePaise,
      originalPricePaise: prod.originalPricePaise,
      description: prod.description,
      rating: prod.rating,
      reviewCount: prod.reviewCount,
      inStock: prod.inStock,
      stockCount: prod.stockCount,
      badge: prod.badge,
      featured: prod.featured
    });

    db.inventory.create({
      productId: p.id,
      stockCount: p.stockCount,
      reservedCount: 0,
      lowStockThreshold: 10
    });
  }

  // 5. Seed Promotional Coupons
  console.log('[SEED] Seeding verified promotional coupons...');
  db.coupons.create({
    id: 'cpn_001',
    code: 'MULTIVERSE10',
    discountPercent: 10,
    maxDiscountPaise: 100000, // ₹1,000 max discount
    minOrderPaise: 200000,    // Min order ₹2,000
    departmentId: null,       // Global coupon
    active: true
  });

  db.coupons.create({
    id: 'cpn_002',
    code: 'RUNWAY20',
    discountPercent: 20,
    maxDiscountPaise: 150000, // ₹1,500 max discount
    minOrderPaise: 150000,    // Min order ₹1,500
    departmentId: 'fashion',  // Restricted to Fashion only
    active: true
  });

  // 6. Seed Initial Audit Log
  db.auditLogs.log({
    userId: storeAdmin.id,
    userRole: storeAdmin.role,
    action: 'SYSTEM_SEED_INITIALIZATION',
    entity: 'System',
    entityId: 'ALL',
    details: {
      departmentsCount: DEPARTMENTS.length,
      productsCount: ALL_PRODUCTS.length,
      usersProvisioned: 5,
      version: '1.0.0'
    }
  });

  console.log('[SEED] BLOWMAGGY Database Seed Complete!');
  return {
    shopper,
    fashionManager,
    electronicsManager,
    storeAdmin,
    deactivatedUser
  };
}

// Allow direct CLI execution: node server/db/seed.js
if (process.argv[1]?.endsWith('seed.js')) {
  seedDatabase().then(() => process.exit(0)).catch(err => {
    console.error('[SEED] Fatal seeding error:', err);
    process.exit(1);
  });
}
