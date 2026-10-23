# BLOWMAGGY — Verified Defect Register & Security Findings (BUGS)

**Document Version:** 2.0.0  
**Audit Date:** 2026-10-23  
**Testing Environment:** Windows 11 x64, Node.js v24.19.0, Vite 6, React 19, Express 5, Chromium Engine  
**Automated RBAC Test Status:** 10/10 Tests Passed (0 Failed)  

---

## 1. Defect Classification Hierarchy
* **Critical:** Security bypass, broken access control, privilege escalation, or financial calculation corruption.
* **High:** Server runtime exception, data loss, or failure of core commerce workflow (ORBIT, Cart, Checkout).
* **Medium:** Edge cases in layout, responsiveness, or form input clamping.
* **Low:** Cosmetic alignment, typographical anomaly, or minor transition timing.

---

## 2. Verified Defect Log & Security Fixes

### BUG-006: Request Body Spoofing Vulnerability in Department Manager Product Mutation (Security Critical)
* **Bug ID:** BUG-006
* **Title:** Department Manager able to alter products in unauthorized department by passing spoofed `departmentId` in JSON payload.
* **Severity:** **CRITICAL** (Broken Access Control)
* **Priority:** P0
* **Reproduction Steps:**
  1. Authenticate as Fashion Department Manager (`manager.fashion@blowmaggy.com`).
  2. Send `PUT /api/products/elec-1` (an Electronics product) with request body `{ departmentId: 'fashion', name: 'Hacked Electronics' }`.
* **Expected Result:** Server must inspect the authoritative existing product in the database, discover that `elec-1` belongs to `electronics`, and reject the request with `403 Forbidden`.
* **Actual Result:** Server initially evaluated `req.body.departmentId` before querying database, temporarily passing the department access check.
* **Root Cause:** Trusting incoming client request body parameter instead of querying the authoritative database record.
* **Status:** **RESOLVED**
* **Fix Applied:** Modified `requireDepartmentAccess` middleware in `server/middleware/rbac.js`. When a `:id` parameter exists in the URL, the middleware immediately fetches the product from `database.products.findById(id)` and validates `existingProduct.departmentId` against the user's authorized departments. Client-supplied `departmentId` is completely ignored.
* **Regression Test:** Added Automated Test 8 to `server/tests/auth_rbac.test.js`. Verified `PUT /api/products/elec-1` with body `{ departmentId: 'fashion' }` receives strict HTTP 403 Forbidden.

---

### BUG-007: Windows OneDrive `EPERM` on Atomic File Renaming in Database Engine
* **Bug ID:** BUG-007
* **Title:** `fs.renameSync` throws `EPERM: operation not permitted` on Windows with OneDrive sync.
* **Severity:** High
* **Priority:** P1
* **Reproduction Steps:**
  1. Trigger multiple sequential database commits in `server/db/database.js`.
  2. OneDrive locks `.data/blowmaggy.db.json` for cloud sync.
  3. `fs.renameSync(tempFile, targetFile)` fails with `EPERM`.
* **Expected Result:** Safe, atomic disk writes without OS locking conflicts.
* **Status:** **RESOLVED**
* **Fix Applied:** Implemented synchronous write to a designated local persistence path with graceful fallback and try/catch retry handling in `database.js`.
* **Regression Test:** Executed 100 consecutive read/write transactions during seed generation; zero `EPERM` errors.

---

### BUG-008: Express 5 `path-to-regexp` Wildcard PathError in API 404 Catch-All
* **Bug ID:** BUG-008
* **Title:** Express server throws `PathError: Expected parameter to be a single string, received "*"` on startup.
* **Severity:** High
* **Priority:** P1
* **Reproduction Steps:**
  1. Define catch-all handler: `app.use('/api/*', (req, res) => ...)`.
  2. Start server under Express 5.
* **Expected Result:** Server boots cleanly on port 4000.
* **Actual Result:** Server crashes on startup due to strict path syntax in `path-to-regexp` v6 included with Express 5.
* **Status:** **RESOLVED**
* **Fix Applied:** Updated route declaration to `app.use('/api', (req, res) => ...)` which handles all unresolved sub-paths cleanly in Express 5.
* **Regression Test:** Server restarted; confirmed `/api/health` returns `200 ONLINE` and invalid endpoints return clean JSON 404.

---

### BUG-002: IEEE-754 Floating-Point Precision Drift on Multi-Item Cart Calculations
* **Bug ID:** BUG-002
* **Title:** Summing float prices (₹1299.99 + ₹799.99) causes fractional decimal artifacts (e.g. `2099.9800000000005`).
* **Severity:** High
* **Priority:** P1
* **Status:** **RESOLVED**
* **Fix Applied:** Converted all prices across `catalog.js`, `database.js`, and `AppContext.jsx` to integer minor units (paise: `129900` = ₹1,299.00). All calculations performed in integer arithmetic.
* **Regression Test:** Summed multi-item carts; verified zero rounding drift.

---

### BUG-003: Double-Click Rapid Dispatch on Checkout Form Causing Duplicate Orders
* **Bug ID:** BUG-003
* **Title:** Rapidly clicking "Confirm & Place Order" creates multiple duplicate order records.
* **Severity:** High
* **Priority:** P1
* **Status:** **RESOLVED**
* **Fix Applied:** Implemented idempotency guard in `Checkout.jsx`: `isSubmitting` flag set synchronously on first click; button disabled.
* **Regression Test:** Rapid multi-clicks tested; exactly 1 order generated.

---

### BUG-004: Stock Count Decrement Exceeding Physical Inventory Balance
* **Bug ID:** BUG-004
* **Title:** Customer able to increment cart quantity beyond warehouse stock availability.
* **Severity:** Medium
* **Priority:** P2
* **Status:** **RESOLVED**
* **Fix Applied:** Clamped quantity picker with `Math.min(product.stockCount, qty + 1)` and added server-side validation in `server/routes/orders.js`.
* **Regression Test:** Reducer and server reject quantities exceeding stock.

---

## 3. Automated Authorization Test Verification Summary

| Test ID | Test Scenario | Expected Status | Measured Status | Verification |
| :--- | :--- | :---: | :---: | :---: |
| **TEST-01** | Shopper cannot create products | 403 Forbidden | **403 Forbidden** | ✅ Verified |
| **TEST-02** | Shopper cannot access Store Admin endpoints | 403 Forbidden | **403 Forbidden** | ✅ Verified |
| **TEST-03** | Dept Manager can update assigned department products | 200 OK | **200 OK** | ✅ Verified |
| **TEST-04** | Dept Manager cannot update other department products | 403 Forbidden | **403 Forbidden** | ✅ Verified |
| **TEST-05** | Dept Manager cannot assign self Store Admin role | 403 Forbidden | **403 Forbidden** | ✅ Verified |
| **TEST-06** | Store Admin can manage across all departments | 200 OK | **200 OK** | ✅ Verified |
| **TEST-07** | Shopper cannot read other shopper's orders | 403 Forbidden | **403 Forbidden** | ✅ Verified |
| **TEST-08** | Changing request body cannot bypass department check | 403 Forbidden | **403 Forbidden** | ✅ Verified |
| **TEST-09** | Unauthenticated requests cannot access protected routes | 401 Unauthorized | **401 Unauthorized** | ✅ Verified |
| **TEST-10** | Deactivated accounts lose access immediately | 401 Unauthorized | **401 Unauthorized** | ✅ Verified |
