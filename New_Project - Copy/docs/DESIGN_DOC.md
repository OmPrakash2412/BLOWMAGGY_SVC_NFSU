# BLOWMAGGY — Architecture & Design Document

**Document Version:** 2.0.0  
**Status:** Living Engineering Specification & RBAC Authorization Architecture  
**System Classification:** Decoupled Full-Stack Multi-Department Commerce Platform  
**Backend:** Node.js Express 5 REST API (`server/`)  
**Database:** Relational Model with Atomic Disk Persistence (`.data/blowmaggy.db.json`)  
**Client:** React 19 + Vite 6 Single Page Application (`src/`)  

---

## 1. System Overview

BLOWMAGGY is engineered as a decoupled, high-performance web architecture combining an **Editorial Multiverse Frontend**, an **Algorithmic Shopping Copilot (ORBIT)**, a dedicated **Department Manager Cockpit**, and a platform-wide **Store Admin Command Center**.

The platform treats catalog pricing with strict financial discipline using **integer minor units (paise)** to eliminate IEEE-754 floating-point drift. All cross-department bundle combinations, cart mutations, inventory adjustments, and order placements are validated server-side by the backend API.

---

## 2. System Architecture & Trust Boundaries

```
[ UNTRUSTED CLIENT ENVIRONMENT: BROWSER ]
┌────────────────────────────────────────────────────────────────────────┐
│  Shopper Multiverse (6 Worlds) │ Manager Cockpit │ Store Admin Cockpit │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │ HTTPS / JSON (JWT Bearer Token)
═════════════════════════════════════╪═════════════════════════════════════
[ TRUST BOUNDARY: API GATEWAY & SECURITY PERIMETER (Express 5 :4000) ]
                                     │
                 ┌───────────────────┴───────────────────┐
                 ▼                                       ▼
        [Rate Limiter & CORS]               [Input Validation Schemas]
                 │                                       │
                 └───────────────────┬───────────────────┘
                                     ▼
                   [JWT Authentication Middleware (auth.js)]
                     • Token Signature Verification
                     • Deactivated User Immediate Check (401)
                                     │
                                     ▼
                    [RBAC Authorization Layer (rbac.js)]
                     • Role Verification (requireRole)
                     • Department Ownership Lookup (requireDepartmentAccess)
                     • Request Body Spoofing Prevention
                                     │
═════════════════════════════════════╪═════════════════════════════════════
[ TRUSTED CORE BUSINESS LOGIC & COMMERCE ENGINES ]
                                     │
         ┌───────────────────────────┼───────────────────────────┐
         ▼                           ▼                           ▼
  [Products API]              [Orders API]                [Admin & Manager]
  • Catalog Filtering         • Server-Side Pricing       • Dept KPIs
  • Variant Resolver          • Stock Atomic Decrement    • Manager Provisioning
  • Dept Scoped Mutations     • Demo Payment Signature    • Append Audit Logs
         │                           │                           │
═════════════════════════════════════╪═════════════════════════════════════
[ PERSISTENT RELATIONAL DATA LAYER (.data/blowmaggy.db.json) ]
  • users             • departments               • department_assignments
  • products          • product_variants          • inventory
  • orders            • order_items               • audit_logs
```

---

## 3. Data-Flow & Authorization Diagrams

### A. Browsing & ORBIT Cross-Department Flow
```mermaid
sequenceDiagram
    autonumber
    actor Shopper
    participant UI as Multiverse UI / OrbitPanel
    participant API as Express API (/api/products)
    participant DB as Relational Database Store

    Shopper->>UI: Selects Department or Assembles ORBIT Mission
    UI->>API: GET /api/products?department=fashion
    API->>DB: Query products with variants & inventory
    DB-->>API: Active catalog records
    API-->>UI: Authoritative product JSON
    UI->>UI: ORBIT solves Multi-Knapsack under budget ceiling
    UI-->>Shopper: Renders interactive cards & 1-click bundle assembly
```

### B. Transactional Order Placement & Server Validation Flow
```mermaid
sequenceDiagram
    autonumber
    actor Shopper
    participant CheckoutUI as Checkout Page
    participant OrdersAPI as Orders Route (/api/orders)
    participant DB as Authoritative Database

    Shopper->>CheckoutUI: Enters Address & Clicks "Pay & Place Order"
    CheckoutUI->>OrdersAPI: POST /api/orders (Authorization: Bearer <token>)
    OrdersAPI->>OrdersAPI: Extract Authenticated User from JWT
    loop For each item in payload
        OrdersAPI->>DB: Fetch authoritative pricePaise & available stock
        OrdersAPI->>OrdersAPI: Validate quantity > 0 and <= stockQuantity
    end
    OrdersAPI->>OrdersAPI: Calculate subtotal, validate coupon (BLOW20), compute totalPaise
    OrdersAPI->>DB: Transactionally decrement stock in inventory
    OrdersAPI->>DB: Insert new Order + OrderItems
    OrdersAPI-->>CheckoutUI: 201 Created { orderId: "ORD-...", totalPaise, status: "CONFIRMED" }
```

### C. Department Manager Scoped Mutation with Anti-Spoofing
```mermaid
sequenceDiagram
    autonumber
    actor Manager as Fashion Manager
    participant ManagerUI as Manager Cockpit
    participant ProductsAPI as Products Route (/api/products/:id)
    participant RBAC as requireDepartmentAccess Middleware
    participant DB as Authoritative Database

    Manager->>ManagerUI: Edits stock for Electronics SKU (elec-1)
    ManagerUI->>ProductsAPI: PUT /api/products/elec-1 (Bearer <fashion_mgr_token>)
    ProductsAPI->>RBAC: Inspect target product in DB
    RBAC->>DB: Query product elec-1
    DB-->>RBAC: Return departmentId = "electronics"
    RBAC->>RBAC: Check manager authorizedDepts (["fashion"]) contains "electronics"?
    Note over RBAC: Authorization Fails!
    RBAC-->>ManagerUI: 403 Forbidden: You are not authorized to manage department 'electronics'
    ManagerUI-->>Manager: Display Red Security Denial Alert
```

---

## 4. Entity Relationship Diagram (ERD)

```mermaid
erDiagram
    USER ||--o{ DEPARTMENT_ASSIGNMENT : "assigned"
    USER ||--o{ ORDER : "places"
    USER ||--o{ AUDIT_LOG : "initiates"
    DEPARTMENT ||--o{ DEPARTMENT_ASSIGNMENT : "managed_by"
    DEPARTMENT ||--o{ PRODUCT : "contains"
    PRODUCT ||--o{ PRODUCT_VARIANT : "has"
    PRODUCT ||--|| INVENTORY : "tracked_in"
    ORDER ||--o{ ORDER_ITEM : "includes"
    PRODUCT_VARIANT ||--o{ ORDER_ITEM : "purchased_as"
    COUPON ||--o{ ORDER : "applied_to"

    USER {
        string id PK
        string email UK
        string passwordHash
        string name
        string role "SHOPPER | DEPARTMENT_MANAGER | STORE_ADMIN"
        boolean isActive
        datetime createdAt
    }

    DEPARTMENT {
        string id PK "fashion | beauty | electronics | home | grocery | kids"
        string name
        string slug UK
        string tagline
        string themeColor
    }

    DEPARTMENT_ASSIGNMENT {
        string id PK
        string userId FK
        string departmentId FK
        datetime assignedAt
    }

    PRODUCT {
        string id PK
        string departmentId FK
        string name
        string brand
        int pricePaise "Integer Minor Units"
        int mrpPaise
        float rating
        int reviewsCount
        boolean inStock
        string image
    }

    PRODUCT_VARIANT {
        string id PK
        string productId FK
        string type "size | color | shade"
        string name
        int pricePaise
        boolean inStock
    }

    INVENTORY {
        string id PK
        string productId FK
        int stockQuantity
        int lowStockThreshold
        datetime lastUpdated
    }

    ORDER {
        string id PK
        string userId FK
        int subtotalPaise
        int discountPaise
        int shippingPaise
        int totalPaise
        string status "PENDING | CONFIRMED | SHIPPED | DELIVERED"
        string paymentStatus "PENDING | PAID"
        string paymentMethod "UPI | CARD | COD"
        string paymentReference
        datetime createdAt
    }

    ORDER_ITEM {
        string id PK
        string orderId FK
        string productId FK
        string variantId FK
        string productName
        int quantity
        int pricePaise "Frozen at Purchase Time"
    }

    AUDIT_LOG {
        string id PK
        string userId FK
        string userRole
        string action
        string resourceType
        string resourceId
        json details
        string ipAddress
        datetime createdAt
    }
```

---

## 5. Security & Authorization Architecture

### A. Role Definitions & Trust Hierarchies
1. **SHOPPER:** Unprivileged consumers. May read products, assemble carts, manage their own wishlists, place orders, and view only their own orders (`/api/orders/mine`).
2. **DEPARTMENT_MANAGER:** Authorized category managers. Explicitly assigned to 1 or more departments via `department_assignments`. Can create and update products only within their assigned department. Blocked from other departments, admin metrics, and manager account provisioning.
3. **STORE_ADMIN:** Platform-wide administrative operator. Can manage catalog records across all 6 departments, provision and deactivate manager accounts, configure global promotions, and review immutable audit logs.

### B. Ten Critical Authorization Verification Rules
1. Shoppers cannot create, update, or delete products.
2. Shoppers cannot access Store Admin endpoints.
3. Department Managers can update products in their assigned department.
4. Department Managers cannot update products in another department.
5. Department Managers cannot assign themselves the Store Admin role.
6. Store Admins can manage permitted resources across all departments.
7. Shoppers cannot read another Shopper's orders.
8. Changing a URL or request body cannot bypass department permissions.
9. Unauthenticated requests cannot access protected resources.
10. Deactivated accounts lose access immediately upon status check.
