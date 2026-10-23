# BLOWMAGGY — Live Demonstration & Speaking Script (RUN_OF_SHOW)

**Document Version:** 2.0.0  
**Target Duration:** 3 Minutes (Strict Competition Timer) with 5-Minute Extended Option  
**Frontend URL:** `http://localhost:5173/`  
**Backend API URL:** `http://localhost:4000/api`  
**Three Account Roles:** `SHOPPER`, `DEPARTMENT_MANAGER`, `STORE_ADMIN`  
**Seed Demonstration Accounts:**
- Shopper: `shopper@blowmaggy.com` / `shopper123`
- Fashion Manager: `manager.fashion@blowmaggy.com` / `manager123`
- Electronics Manager: `manager.electronics@blowmaggy.com` / `manager123`
- Store Admin: `admin@blowmaggy.com` / `admin123`
- Deactivated: `deactivated@blowmaggy.com` / `deactivated123`

---

## 1. Pre-Flight Demonstration Checklist
* [x] **Backend API Server:** Running on port 4000 (`node server/index.js`). Verified `/api/health` returns `200 ONLINE`.
* [x] **Frontend Client:** Running on port 5173 (`npm run dev`). Verified responsive layout.
* [x] **Database Seeded:** `.data/blowmaggy.db.json` populated with 5 seed users, 6 departments, and 73 products.
* [x] **Automated Tests:** 10/10 Authorization & RBAC Tests passing (`server/tests/auth_rbac.test.js`).

---

## 2. Primary 3-Minute Competition Run of Show

### 0:00 – 0:25 | The Hook & The Problem
* **On Screen:** BLOWMAGGY Multiverse Homepage (`/`) with 6 glowing department portals.
* **Presenter Action:** Cursor hovers gently over the portals.
* **Spoken Script:**  
  *"Judges, today a digital shopper in India manages four to seven distinct apps just to fulfill their weekly needs: one for fashion, one for tech, one for groceries, and another for home essentials. That means separate logins, separate delivery charges, and fragmented budgets.  
  This is BLOWMAGGY: an intelligent shopping multiverse combining six distinct visual worlds into one unified catalog, a budget-optimizing copilot called ORBIT, and financial-grade integer checkout."*

---

### 0:25 – 1:00 | The Shopper Journey & ORBIT Copilot
* **On Screen:** Click the floating **ORBIT FAB button**; slide open the ORBIT drawer.
* **Presenter Action:** Click the preset **"College Dorm & Campus Starter"** (₹5,000 ceiling).
* **Spoken Script:**  
  *"Meet Aarav, an engineering student on a strict ₹5,000 allowance. He needs a campus tee, a fast GaN charger, and late-night study snacks.  
  Instead of hunting across 70 SKUs, Aarav uses ORBIT. Under the hood, ORBIT runs a deterministic Multi-Knapsack algorithm across catalog data. In under two milliseconds, it synthesizes an optimized bundle combining a fashion tee, a 65W charger, and almond clusters—staying strictly within his ₹5,000 ceiling.  
  With one click on 'Add Entire Bundle to Cart', items from three distinct worlds enter our single, unified cart."*

---

### 1:00 – 1:30 | Unified Cart & Financial-Grade Checkout
* **On Screen:** Navigate to `/cart`, showing items from Fashion, Tech, and Grocery in one cart. Proceed to `/checkout`.
* **Presenter Action:** Enter shipping address, demo UPI payment, and click **"Pay & Place Order"**.
* **Spoken Script:**  
  *"In our Unified Cart, line items from multiple departments qualify for combined shipping with zero cross-shipping penalty.  
  Notice our pricing architecture: every calculation—from subtotal to tax to our BLOW20 coupon—operates in integer paise minor units. There is zero floating-point rounding drift. When we submit, our backend verifies product prices and stock availability transactionally before minting order ORD-177435."*

---

### 1:30 – 2:15 | Department Manager Cockpit & Live RBAC Denial Proof
* **On Screen:** Navigate to `/admin/login`. Click quick-login for **"Fashion Manager"** (`manager.fashion@blowmaggy.com`), landing on `/manager`.
* **Presenter Action:** Show the Department Manager Cockpit scoped strictly to Fashion. Click the red button: **"🔒 Test Cross-Dept Write Denial (RBAC Proof)"**.
* **Spoken Script:**  
  *"Now let's examine our Role-Based Access Control. BLOWMAGGY enforces three distinct account roles: Shopper, Department Manager, and Store Admin.  
  Here we are logged in as Priya Sen, our Fashion Department Manager. Her cockpit is strictly scoped to The Runway. She can edit fashion stock, view fashion KPIs, and manage her inventory.  
  Now watch what happens when Priya attempts to update an Electronics product: I click our live security test button. Behind the scenes, a PUT request is dispatched to `/api/products/elec-1`.  
  Our backend RBAC middleware intercepts the request, queries the database, discovers that elec-1 belongs to electronics, and immediately rejects the write with HTTP 403 Forbidden! Security is enforced on the server, not just hidden buttons in the UI."*

---

### 2:15 – 2:45 | Store Admin Cockpit & Immutable Audit Trail
* **On Screen:** Navigate to `/admin/login`, click quick-login for **"Store Admin"** (`admin@blowmaggy.com`), landing on `/admin`. Navigate to `/admin/managers` and `/admin/audit-logs`.
* **Presenter Action:** Show the Store Admin Overview, Manager Provisioning directory, and the live Audit Log entries.
* **Spoken Script:**  
  *"Finally, we switch to our Store Admin Cockpit. The Store Admin possesses platform-wide governance: managing products across all six departments, provisioning new department managers, and deactivating accounts with immediate session revocation.  
  Furthermore, every administrative action is committed to an immutable, append-only audit log table detailing the actor, action, timestamp, target resource, and IP address."*

---

### 2:45 – 3:00 | Engineering Summary & Close
* **On Screen:** Return to the Multiverse Homepage.
* **Spoken Script:**  
  *"To summarize: React 19 frontend beating our performance budget at 131 KB initial JS; an Express 5 backend with normalized relational persistence; server-side price verification; and a 10/10 passed automated authorization test suite.  
  BLOWMAGGY turns six fragmented shopping journeys into one intelligent, secure multiverse. Thank you!"*

---

## 3. Anticipated Judge Questions & Credible Answers

### Q1: "How do you prevent a Department Manager from bypassing the frontend and hitting the API directly with Postman?"
* **Honest Answer:**  
  *"Frontend route guards (`ManagerRoute`, `AdminRoute`) are solely for user experience. Every state-changing backend route is guarded by our `requireRole` and `requireDepartmentAccess` middleware in `server/middleware/rbac.js`. Even if an attacker uses Postman or cURL to send `PUT /api/products/:id`, the server fetches the target SKU from the database, checks the manager's authorized departments, and returns 403 Forbidden if there is a mismatch. This is verified by Automated Tests 3, 4, and 8 in our test suite."*

### Q2: "Can a user escalate their own privileges by modifying browser localStorage?"
* **Honest Answer:**  
  *"No. The client stores a JWT signed with our server secret. The server verifies the token signature on every request and extracts the authenticated role and user ID directly from the validated payload. Furthermore, `server/middleware/auth.js` queries the database on every authenticated call to verify that the account is active, meaning deactivated accounts lose access immediately even with an unexpired token (Automated Test 10)."*

### Q3: "What prevents floating-point rounding errors during cart and coupon calculations?"
* **Honest Answer:**  
  *"Every SKU price and order calculation is stored strictly as an integer minor unit (paise), where ₹1,299.00 is represented as 129900. All additions, discounts, and tax computations operate exclusively in integer arithmetic, completely eliminating IEEE-754 floating-point drift."*
