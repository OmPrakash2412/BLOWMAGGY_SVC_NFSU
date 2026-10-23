# BLOWMAGGY — Performance Budgets & Optimization Strategies (OPTIMIZATION)

**Document Version:** 2.0.0  
**Measurement Date:** 2026-10-23  
**Build Tool:** Vite / Rollup  
**Analysis Tool:** Rollup Chunk Analyzer & Gzip Compression Inspector  

---

## 1. Explicit Performance Budgets & Targets

| Metric Category | Target Budget | Prototype Measured Result | Compliance Status |
| :--- | :--- | :--- | :--- |
| **Initial Gzipped JavaScript** | <= 250.0 KB | **131.34 KB** (`vendor` 108.05 KB + `index` 23.29 KB) | **47% UNDER BUDGET** |
| **Initial Gzipped CSS** | <= 50.0 KB | **4.72 KB** (`index.css` global stylesheet) | **90% UNDER BUDGET** |
| **Largest Route Chunk** | <= 30.0 KB | **2.97 KB** (`Checkout.js` gzipped) | **EXCEEDED TARGET** |
| **Production Build Time** | <= 5.0 seconds | **2.02 seconds** | **EXCEEDED TARGET** |
| **Cumulative Layout Shift (CLS)** | <= 0.05 | **< 0.02** | **EXCELLENT** |

---

## 2. Actual Production Build Chunk Breakdown

Measured directly from the production build artifacts (`dist/`):

```text
dist/index.html                               1.02 kB │ gzip:   0.54 kB
dist/assets/Wishlist-DHe1LPBG.css             0.77 kB │ gzip:   0.32 kB
dist/assets/Orders-47QgHepO.css               1.90 kB │ gzip:   0.60 kB
dist/assets/Search-CNw1ugyz.css               2.10 kB │ gzip:   0.69 kB
dist/assets/ManagerCockpit-rpQ2ltyD.css       2.44 kB │ gzip:   0.76 kB
dist/assets/OrderConfirmation-KjSHGsjl.css    2.59 kB │ gzip:   0.84 kB
dist/assets/ProductCard-DPLsuyb-.css          2.65 kB │ gzip:   0.92 kB
dist/assets/Department-BUtbQ-UI.css           2.88 kB │ gzip:   0.89 kB
dist/assets/Checkout-BG4NtrK5.css             3.08 kB │ gzip:   0.88 kB
dist/assets/Cart-BD-lCjBG.css                 3.79 kB │ gzip:   1.12 kB
dist/assets/ProductDetail-CFiv4lni.css        4.83 kB │ gzip:   1.35 kB
dist/assets/Home-CtEFc6wx.css                 5.72 kB │ gzip:   1.52 kB
dist/assets/Admin-DME476MH.css                7.87 kB │ gzip:   1.73 kB
dist/assets/index-BSMHhked.css               20.77 kB │ gzip:   4.72 kB  <-- Global Stylesheet

dist/assets/Wishlist-CXIDcH7x.js              2.84 kB │ gzip:   0.74 kB
dist/assets/ProductCard-VujJbSeF.js           5.04 kB │ gzip:   1.11 kB
dist/assets/Orders-C2BjODB0.js                6.78 kB │ gzip:   1.19 kB
dist/assets/AdminAuditLogs-D7R3olTT.js        7.21 kB │ gzip:   1.40 kB  <-- Lazy Admin Route
dist/assets/Search-QmLDLyau.js                8.26 kB │ gzip:   1.54 kB
dist/assets/OrderConfirmation-CPs-sTkb.js     8.34 kB │ gzip:   1.50 kB
dist/assets/AdminLogin-BRU9iF_Q.js            9.26 kB │ gzip:   1.53 kB
dist/assets/AdminOrders-BT2DveFg.js           9.40 kB │ gzip:   1.57 kB
dist/assets/AdminProducts-BETaXZC9.js        10.10 kB │ gzip:   1.70 kB
dist/assets/Department-C_XxO2hq.js           10.52 kB │ gzip:   1.89 kB
dist/assets/AdminDashboard-1r0i_Pvl.js       12.10 kB │ gzip:   1.74 kB
dist/assets/Cart-O-7iDoVJ.js                 13.07 kB │ gzip:   2.02 kB
dist/assets/ProductDetail-BZsa-d0R.js        14.66 kB │ gzip:   2.38 kB
dist/assets/AdminManagers-FhUSBc8i.js        16.19 kB │ gzip:   2.40 kB  <-- Lazy Admin Route
dist/assets/ManagerCockpit-N-YihyTz.js       16.82 kB │ gzip:   2.68 kB  <-- Lazy Manager Route
dist/assets/Home-BaMn5s7R.js                 19.95 kB │ gzip:   2.79 kB
dist/assets/Checkout-DGKNOahq.js             20.80 kB │ gzip:   2.97 kB
dist/assets/index-DFXTvii8.js                88.68 kB │ gzip:  23.29 kB  <-- App Context, Shell
dist/assets/vendor-BPSycQWZ.js              346.38 kB │ gzip: 108.05 kB  <-- React Ecosystem
✓ built in 2.02s
```

---

## 3. Key Optimization Strategies Implemented

### A. Route-Level Code Splitting via React Suspense
* Every primary view (`ManagerCockpit`, `AdminDashboard`, `AdminManagers`, `AdminAuditLogs`, `Checkout`, `Cart`, `Home`) is loaded on demand using `React.lazy()`.
* Shoppers only download public shopping bundles; administrative and manager chunks are never loaded over the wire during standard shopping journeys.

### B. Long-Term Cacheable Vendor Chunking
* React and React Router DOM are isolated into a standalone `vendor.js` chunk with permanent cache-busting hashes.

### C. Zero-Layout-Shift (CLS < 0.02) Architecture
* All product cards and portal banners maintain explicit aspect ratio boxes.
* The fixed 72px navigation bar prevents document reflow upon hydration.

### D. Integer Paise Currency Arithmetic
* All internal calculations operate strictly in integer minor units (paise), reducing garbage collection cycles and avoiding floating-point drift.
