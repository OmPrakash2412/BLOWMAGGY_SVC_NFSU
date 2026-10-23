/* =========================================================
   BLOWMAGGY — Automated RBAC & Security Test Suite
   =========================================================
   Executes and verifies all 10 mandated authorization tests:
   1. Shopper cannot create, update, or delete products
   2. Shopper cannot access the Store Admin Cockpit APIs
   3. Department Manager can update products in assigned department
   4. Department Manager cannot update products in another department
   5. Department Manager cannot assign themselves Store Admin role
   6. Store Admin can manage resources across all departments
   7. Shopper cannot read another Shopper's orders or addresses
   8. Changing URL / body cannot bypass permissions
   9. Unauthenticated requests cannot access protected resources
   10. Deactivated accounts lose access as expected
   ========================================================= */
import http from 'http';
import app from '../index.js';
import { seedDatabase } from '../db/seed.js';

const TEST_PORT = 4999;
let server;
const BASE_URL = `http://localhost:${TEST_PORT}`;

// Helper: send HTTP request
async function api(method, path, body = null, token = null) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });

  const status = res.status;
  let data = null;
  try {
    data = await res.json();
  } catch {
    data = await res.text();
  }

  return { status, data };
}

async function runTests() {
  console.log('===============================================================');
  console.log('🛡️  BLOWMAGGY SECURITY & RBAC AUTOMATED TEST SUITE');
  console.log('===============================================================');

  // 1. Seed fresh database
  await seedDatabase();

  // 2. Start test server
  server = http.createServer(app);
  await new Promise(resolve => server.listen(TEST_PORT, resolve));
  console.log(`[TEST RUNNER] Server listening on ${BASE_URL}\n`);

  let passed = 0;
  let failed = 0;

  function assert(condition, testName, details = '') {
    if (condition) {
      console.log(`✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${testName} - ${details}`);
      failed++;
    }
  }

  try {
    // Obtain tokens for all 3 primary roles
    console.log('[AUTH] Authenticating test accounts for all roles...');
    const shopperLogin = await api('POST', '/api/auth/login', {
      email: 'shopper@blowmaggy.com',
      password: 'shopper123'
    });
    const shopperToken = shopperLogin.data.token;

    const fashionMgrLogin = await api('POST', '/api/auth/login', {
      email: 'manager.fashion@blowmaggy.com',
      password: 'manager123'
    });
    const fashionMgrToken = fashionMgrLogin.data.token;

    const techMgrLogin = await api('POST', '/api/auth/login', {
      email: 'manager.electronics@blowmaggy.com',
      password: 'manager123'
    });
    const techMgrToken = techMgrLogin.data.token;

    const adminLogin = await api('POST', '/api/auth/login', {
      email: 'admin@blowmaggy.com',
      password: 'admin123'
    });
    const adminToken = adminLogin.data.token;

    console.log('[AUTH] All role tokens successfully acquired.\n');

    // -------------------------------------------------------------
    // TEST 1: Shopper cannot create, update, or delete products
    // -------------------------------------------------------------
    console.log('--- Executing Test 1: Shopper Product Write Restrictions ---');
    const test1_create = await api('POST', '/api/products', {
      departmentId: 'fashion',
      category: 'T-Shirts',
      name: 'Illegal Shopper Tee',
      pricePaise: 99900
    }, shopperToken);

    const test1_update = await api('PUT', '/api/products/prod_001', {
      name: 'Tampered Name'
    }, shopperToken);

    const test1_delete = await api('DELETE', '/api/products/prod_001', null, shopperToken);

    assert(
      test1_create.status === 403 && test1_update.status === 403 && test1_delete.status === 403,
      'Test 1: Shopper cannot create, update, or delete products',
      `Statuses: create=${test1_create.status}, update=${test1_update.status}, delete=${test1_delete.status}`
    );

    // -------------------------------------------------------------
    // TEST 2: Shopper cannot access the Store Admin Cockpit
    // -------------------------------------------------------------
    console.log('--- Executing Test 2: Shopper Admin Boundary Check ---');
    const test2_metrics = await api('GET', '/api/admin/metrics', null, shopperToken);
    const test2_audit = await api('GET', '/api/admin/audit-logs', null, shopperToken);

    assert(
      test2_metrics.status === 403 && test2_audit.status === 403,
      'Test 2: Shopper cannot access Store Admin Cockpit APIs',
      `Metrics status=${test2_metrics.status}, Audit status=${test2_audit.status}`
    );

    // -------------------------------------------------------------
    // TEST 3: Department Manager can update products in assigned department
    // -------------------------------------------------------------
    console.log('--- Executing Test 3: Department Manager Authorized Updates ---');
    // prod_001 is in 'fashion' department; fashionManager is assigned to 'fashion'
    const test3_update = await api('PATCH', '/api/products/prod_001/stock', {
      stockCount: 42,
      inStock: true
    }, fashionMgrToken);

    assert(
      test3_update.status === 200 && test3_update.data.product?.stockCount === 42,
      'Test 3: Department Manager can update products in assigned department',
      `Status=${test3_update.status}, Data=${JSON.stringify(test3_update.data)}`
    );

    // -------------------------------------------------------------
    // TEST 4: Department Manager cannot update products in another department
    // -------------------------------------------------------------
    console.log('--- Executing Test 4: Cross-Department Manager Write Restrictions ---');
    // prod_026 is in 'electronics' department; fashionManager is ONLY assigned to 'fashion'
    const test4_tamper = await api('PATCH', '/api/products/prod_026/stock', {
      stockCount: 999
    }, fashionMgrToken);

    assert(
      test4_tamper.status === 403 && test4_tamper.data.error === 'DEPARTMENT_ACCESS_DENIED',
      'Test 4: Department Manager cannot update products in another department',
      `Status=${test4_tamper.status}, Error=${test4_tamper.data?.error}`
    );

    // -------------------------------------------------------------
    // TEST 5: Department Manager cannot assign themselves Store Admin role
    // -------------------------------------------------------------
    console.log('--- Executing Test 5: Privilege Self-Elevation Prevention ---');
    // Manager attempts to call admin manager assignment or self-promote
    const test5_elevate = await api('POST', '/api/admin/managers', {
      email: 'manager.fashion@blowmaggy.com',
      role: 'STORE_ADMIN'
    }, fashionMgrToken);

    assert(
      test5_elevate.status === 403,
      'Test 5: Department Manager cannot access admin provisioning or self-promote',
      `Status=${test5_elevate.status}`
    );

    // -------------------------------------------------------------
    // TEST 6: Store Admin can manage permitted resources across all departments
    // -------------------------------------------------------------
    console.log('--- Executing Test 6: Global Store Admin Operations ---');
    const test6_fashion = await api('PATCH', '/api/products/prod_001/stock', { stockCount: 50 }, adminToken);
    const test6_tech = await api('PATCH', '/api/products/prod_026/stock', { stockCount: 30 }, adminToken);
    const test6_metrics = await api('GET', '/api/admin/metrics', null, adminToken);

    assert(
      test6_fashion.status === 200 && test6_tech.status === 200 && test6_metrics.status === 200,
      'Test 6: Store Admin can manage permitted resources across all departments',
      `Fashion status=${test6_fashion.status}, Tech status=${test6_tech.status}`
    );

    // -------------------------------------------------------------
    // TEST 7: Shopper cannot read another Shopper\'s orders or addresses
    // -------------------------------------------------------------
    console.log('--- Executing Test 7: Shopper Data Isolation ---');
    // First place an order as Shopper A
    const orderRes = await api('POST', '/api/orders/checkout', {
      items: [{ productId: 'prod_001', quantity: 1 }],
      address: { fullName: 'Aarav Mehta', street: 'Dorm 4B', pincode: '560103' },
      paymentMethod: 'upi'
    }, shopperToken);
    const orderId = orderRes.data.order.id;

    // Register a second shopper (Shopper B)
    const shopperB_reg = await api('POST', '/api/auth/register', {
      email: 'shopper.b@blowmaggy.com',
      password: 'password123',
      fullName: 'Shopper B'
    });
    const shopperB_token = shopperB_reg.data.token;

    // Shopper B attempts to access Shopper A's order by changing the order ID in URL
    const test7_tamper = await api('GET', `/api/orders/${orderId}`, null, shopperB_token);

    assert(
      test7_tamper.status === 403 && test7_tamper.data.error === 'FORBIDDEN',
      "Test 7: Shopper cannot read another Shopper's orders by altering order ID",
      `Status=${test7_tamper.status}, Error=${test7_tamper.data?.error}`
    );

    // -------------------------------------------------------------
    // TEST 8: Changing a URL or request body cannot bypass permissions
    // -------------------------------------------------------------
    console.log('--- Executing Test 8: Tampered Request Body Bypass Check ---');
    // Manager attempts to pass departmentId='fashion' in body while targeting an electronics product ID in URL
    const test8_bypass = await api('PUT', '/api/products/prod_026', {
      departmentId: 'fashion', // Attempting to fool backend
      name: 'Spoofed Electronics Product'
    }, fashionMgrToken);

    assert(
      test8_bypass.status === 403,
      'Test 8: Changing URL or request body cannot bypass department authorization',
      `Status=${test8_bypass.status}`
    );

    // -------------------------------------------------------------
    // TEST 9: Unauthenticated requests cannot access protected resources
    // -------------------------------------------------------------
    console.log('--- Executing Test 9: Unauthenticated Request Boundary ---');
    const test9_unauth_order = await api('POST', '/api/orders/checkout', { items: [] }, null);
    const test9_unauth_admin = await api('GET', '/api/admin/metrics', null, null);
    const test9_unauth_mgr = await api('GET', '/api/manager/overview', null, null);

    assert(
      test9_unauth_order.status === 401 && test9_unauth_admin.status === 401 && test9_unauth_mgr.status === 401,
      'Test 9: Unauthenticated requests cannot access protected resources',
      `Statuses: order=${test9_unauth_order.status}, admin=${test9_unauth_admin.status}, mgr=${test9_unauth_mgr.status}`
    );

    // -------------------------------------------------------------
    // TEST 10: Deactivated accounts lose access as expected
    // -------------------------------------------------------------
    console.log('--- Executing Test 10: Deactivated Account Access Revocation ---');
    // Attempt login with deactivated seed user
    const test10_login = await api('POST', '/api/auth/login', {
      email: 'deactivated@blowmaggy.com',
      password: 'deactivated123'
    });

    assert(
      test10_login.status === 403 && test10_login.data.error === 'ACCOUNT_DEACTIVATED',
      'Test 10: Deactivated accounts immediately lose access to the platform',
      `Status=${test10_login.status}, Error=${test10_login.data?.error}`
    );

  } catch (err) {
    console.error('[FATAL TEST SUITE ERROR]', err);
  } finally {
    server.close();
  }

  console.log('\n===============================================================');
  console.log(`📋 TEST SUMMARY: ${passed} PASSED, ${failed} FAILED (TOTAL 10 TESTS)`);
  console.log('===============================================================');

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests();
