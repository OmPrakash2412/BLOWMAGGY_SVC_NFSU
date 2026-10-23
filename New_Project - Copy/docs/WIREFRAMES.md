# BLOWMAGGY — Wireframes & UI Specifications
## Distinct Interfaces for Shopper, Department Manager, and Store Admin

**Document Version:** 2.0.0  
**Scope:** Three Distinct User Roles (`SHOPPER`, `DEPARTMENT_MANAGER`, `STORE_ADMIN`)  
**Design System:** Dark Multiverse (`#0d0d12`), Magenta (`#e91e8c`), Violet (`#8b5cf6`), Cyan (`#06d6d6`)  
**Implementation Status:** All Shopper, Manager, and Admin interfaces fully implemented in React 19  

---

## 1. Global Interface Structure & Role Navigation

| User Role | Entry Point | Visual Style | Navigation Elements | Permitted Workflows |
| :--- | :--- | :--- | :--- | :--- |
| **SHOPPER** | `/` (Home) | Immersive Cosmic Multiverse | 6 World Portals, Global Search, ORBIT Copilot, Wishlist, Unified Cart, Orders | Browse, search, filter, ORBIT budget copilot, unified cart, checkout, order tracking |
| **DEPARTMENT MANAGER** | `/manager` | Focused Operational Cockpit | Scoped Department Badge, KPIs, Inventory Table, Live RBAC Test Widget | Dept-specific KPIs, low-stock alerts, inline stock adjustment, live security denial test |
| **STORE ADMIN** | `/admin` | Enterprise Command Center | Metric Tiles, Cross-Dept Products, Orders, Manager Provisioning, Audit Logs | Store-wide analytics, manage all departments, provision managers, view audit logs |

---

## 2. Shopper Interface Wireframes

### Screen 1: Multiverse Landing Page (`/`)
```text
+-----------------------------------------------------------------------------------------+
| [◈ BLOWMAGGY]   Multiverse ▾    [ Search all 6 departments... ]    (◉ ORBIT) (♡) (🛒 3)  |
+-----------------------------------------------------------------------------------------+
|                                                                                         |
|                    ONE UNIVERSE. SIX CONNECTED WORLDS. ONE CART.                        |
|           Discover runway fashion, clean beauty, high-performance tech,                 |
|             sanctuary home, daily grocery & wonderland in one journey.                  |
|                                                                                         |
|                [ Explore 6 Worlds ↓ ]          [ ◈ Launch ORBIT Copilot ]               |
|                                                                                         |
|                      [ 6 Worlds ] • [ 73 SKUs ] • [ 100% Unified Cart ]                 |
|                                                                                         |
|-----------------------------------------------------------------------------------------|
| ENTER THE MULTIVERSE:                                                                   |
| +---------------------+ +---------------------+ +---------------------+                 |
| | 👗 THE RUNWAY       | | ✨ THE LAB          | | ⚡ THE GRID         |                 |
| | Fashion (13 SKUs)   | | Beauty (12 SKUs)    | | Tech (12 SKUs)      |                 |
| +---------------------+ +---------------------+ +---------------------+                 |
| +---------------------+ +---------------------+ +---------------------+                 |
| | 🏡 THE SANCTUARY    | | 🥑 THE DAILYVERSE   | | 🧸 THE WONDERLAND   |                 |
| | Home (11 SKUs)      | | Grocery (13 SKUs)   | | Kids (12 SKUs)      |                 |
| +---------------------+ +---------------------+ +---------------------+                 |
|-----------------------------------------------------------------------------------------|
| MEET ORBIT — The Multi-Knapsack Budget Copilot (Feature Spotlight Banner)               |
|-----------------------------------------------------------------------------------------|
| TRENDING ACROSS THE MULTIVERSE (Curated 8-Product Grid across All Departments)          |
| [Card: Midnight Tee]   [Card: Vitamin C Serum]   [Card: AuraPods Pro]   [Card: Desk Lamp] |
+-----------------------------------------------------------------------------------------+
```

### Screen 2: ORBIT Copilot Drawer (`OrbitPanel.jsx`)
```text
+-----------------------------------------------------------------------------------------+
| [◈] ORBIT COPILOT — Budget-Constrained Multi-Department Synthesizer               [ ✕ ] |
|-----------------------------------------------------------------------------------------|
| Select Life Mission Preset:                                                             |
| [ 🎓 College Starter (Max ₹5k) ]  [ 💼 WFH Refresh (Max ₹25k) ]  [ ✨ Glow (Max ₹4k) ]  |
|                                                                                         |
| Or Custom Synthesizer:                                                                  |
| Target Budget: [===============o==============] ₹6,000                                   |
| Select Departments: [x] Fashion   [x] Tech   [x] Grocery                                |
| [ ⚡ Synthesize Cross-Multiverse Bundle ]                                                |
|                                                                                         |
| Synthesized Bundle Result:                                                              |
| • Fashion: Midnight Gradient Oversized Tee    - ₹1,299                                  |
| • Tech: GaN 65W Fast USB-C Charger           - ₹1,999                                  |
| • Grocery: Dark Chocolate Almond Clusters    - ₹299                                    |
| --------------------------------------------------------------------------------------- |
| Total Cost: ₹3,597 (Within Budget: ₹2,403 under limit)                                  |
| [ 🛒 Add All 3 Items to Unified Cart - ₹3,597 ]                                          |
+-----------------------------------------------------------------------------------------+
```

### Screen 3: Unified Shopping Cart (`/cart`)
```text
+-----------------------------------------------------------------------------------------+
| UNIFIED MULTIVERSE CART                                                 [ Clear Cart ]  |
| Departments in Cart: [👗 Fashion] [⚡ Electronics] [🥑 Grocery]                         |
|-----------------------------------------------------------------------------------------|
| [Items List]                                  | [Order Summary]                         |
| [Thumb] Midnight Gradient Oversized Tee       | Subtotal (3 items):           ₹3,597.00 |
|         Fashion • Size: L                     | Promo Coupon (BLOW20):         -₹719.40 |
|         Qty: [-] 1 [+]           ₹1,299.00    | Delivery:                          FREE |
|                                               | Estimated GST (18%):            ₹518.00 |
| [Thumb] GaN 65W Fast Charger                  | --------------------------------------- |
|         Electronics                           | Order Total:                  ₹2,877.60 |
|         Qty: [-] 1 [+]           ₹1,999.00    |                                         |
|                                               | [ Apply Coupon: BLOW20 ]       [Apply]  |
| [Thumb] Dark Chocolate Almond Clusters        |                                         |
|         Grocery                               | [ Proceed to Checkout → ]               |
|         Qty: [-] 1 [+]             ₹299.00    | 🔒 Integer Paise Server-Validated Total |
+-----------------------------------------------------------------------------------------+
```

---

## 3. Department Manager Cockpit Wireframe (`/manager`)

```text
+-----------------------------------------------------------------------------------------+
| [◈ BLOWMAGGY]   [ Manager: Priya Sen ]   [ Badge: Fashion World Manager ]     [ Logout ]|
+-----------------------------------------------------------------------------------------+
| DEPARTMENT MANAGER COCKPIT — THE RUNWAY (FASHION)                                       |
| Operations dashboard scoped strictly to authorized department.                          |
|-----------------------------------------------------------------------------------------|
| KPI METRICS CARDS:                                                                      |
| +------------------+ +------------------+ +------------------+ +------------------+     |
| | 13               | | 2                | | 0                | | 284              |     |
| | Dept Products    | | Low-Stock SKUs   | | Out-of-Stock     | | Total Stock Units|     |
| +------------------+ +------------------+ +------------------+ +------------------+     |
|-----------------------------------------------------------------------------------------|
| LIVE RBAC SECURITY ENFORCEMENT PROOF:                                                   |
| [ 🔒 Test Cross-Dept Write Denial (RBAC Proof) ]                                        |
| Clicking sends: PUT /api/products/elec-1 (Electronics SKU) as Fashion Manager.           |
| Live Output: ❌ 403 Forbidden: "You are not authorized to manage department 'electronics'"|
|-----------------------------------------------------------------------------------------|
| DEPARTMENT INVENTORY & PRODUCT MANAGEMENT TABLE:                                        |
| Product Name         | SKU      | Category   | Price     | Stock Units | Status       |
| -------------------- | -------- | ---------- | --------- | ----------- | ------------ |
| Midnight Oversized Tee| fash-1   | T-Shirts   | ₹1,299.00 | [ 38 ] [Save]| IN_STOCK    |
| Cyberpunk Bomber Jkt | fash-2   | Jackets    | ₹4,499.00 | [ 14 ] [Save]| IN_STOCK    |
| Pleated Linen Trousers| fash-3   | Bottoms    | ₹2,199.00 | [  4 ] [Save]| ⚠️ LOW_STOCK |
+-----------------------------------------------------------------------------------------+
```

---

## 4. Store Admin Cockpit Wireframes

### Screen 1: Store Admin Overview (`/admin`)
```text
+-----------------------------------------------------------------------------------------+
| [◈ BLOWMAGGY ADMIN]   Overview  | Products | Orders | Managers | Audit Logs |  [Logout] |
+-----------------------------------------------------------------------------------------+
| STORE-WIDE OPERATIONS OVERVIEW                                                          |
| Global control and governance across all 6 departments.                                 |
|-----------------------------------------------------------------------------------------|
| PLATFORM KPI CARDS:                                                                     |
| +-------------------+ +-------------------+ +-------------------+ +-------------------+ |
| | ₹1,42,850.00      | | 18                | | 73                | | 1,420             | |
| | Total GMV Revenue | | Lifetime Orders   | | Total SKUs (6 W.) | | Total Stock Units | |
| +-------------------+ +-------------------+ +-------------------+ +-------------------+ |
|-----------------------------------------------------------------------------------------|
| QUICK MANAGEMENT PORTALS:                                                               |
| • [ Managers Portal (/admin/managers) ]: Provision, deactivate & assign managers        |
| • [ Audit Logs (/admin/audit-logs) ]: Review immutable security & action logs          |
| • [ Products Catalog (/admin/products) ]: Cross-department catalog control              |
| • [ Orders Fulfillment (/admin/orders) ]: Platform-wide order status transitions       |
+-----------------------------------------------------------------------------------------+
```

### Screen 2: Manager Provisioning & Assignment (`/admin/managers`)
```text
+-----------------------------------------------------------------------------------------+
| MANAGER PROVISIONING & RBAC ASSIGNMENTS                                                 |
| Provision new department managers, assign authorized scopes, and deactivate accounts.   |
|-----------------------------------------------------------------------------------------|
| PROVISION NEW MANAGER FORM:                                                             |
| Full Name: [ Rohan Verma             ]   Email: [ rohan.tech@blowmaggy.com            ] |
| Password:  [ **********************  ]   Assign Dept: [ Electronics World ▾           ] |
| [ + Provision Department Manager ]                                                      |
|-----------------------------------------------------------------------------------------|
| ACTIVE MANAGERS DIRECTORY:                                                              |
| Name         | Email                     | Role               | Assigned Dept| Status   |
| ------------ | ------------------------- | ------------------ | ------------ | -------- |
| Priya Sen    | manager.fashion@bm.com    | DEPARTMENT_MANAGER | Fashion      | [Active] |
| Vikram Joshi | manager.electronics@bm.com| DEPARTMENT_MANAGER | Electronics  | [Active] |
| Pooja Hegde  | manager.home@bm.com       | DEPARTMENT_MANAGER | Home         | [Active] |
| [Deactivate / Activate Button] (Instant RBAC status toggle & revocation)                |
+-----------------------------------------------------------------------------------------+
```

### Screen 3: Immutable Audit Log Viewer (`/admin/audit-logs`)
```text
+-----------------------------------------------------------------------------------------+
| ADMINISTRATIVE SECURITY & AUDIT TRAIL                                                   |
| Real-time, append-only record of all state-changing administrative operations.          |
|-----------------------------------------------------------------------------------------|
| Timestamp           | Actor Email           | Role        | Action         | Target ID  |
| ------------------- | --------------------- | ----------- | -------------- | ---------- |
| 2026-10-23 16:45:12 | admin@blowmaggy.com   | STORE_ADMIN | CREATE_MANAGER | usr-mgr-3  |
| 2026-10-23 16:40:05 | admin@blowmaggy.com   | STORE_ADMIN | DEACTIVATE_USER| usr-shopper|
| 2026-10-23 16:32:19 | manager.fashion@bm.com| DEPT_MANAGER| UPDATE_PRODUCT | fash-1     |
+-----------------------------------------------------------------------------------------+
```
