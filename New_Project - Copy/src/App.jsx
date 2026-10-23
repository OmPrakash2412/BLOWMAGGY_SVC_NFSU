/* =========================================================
   BLOWMAGGY — Main Application Shell
   =========================================================
   Routes, layout, Navbar, Footer, Toast system, ORBIT FAB
   ========================================================= */
import { Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import ToastContainer from './components/ToastContainer.jsx';
import OrbitFAB from './components/OrbitFAB.jsx';
import OrbitPanel from './components/OrbitPanel.jsx';
import { useApp } from './context/AppContext.jsx';
import './App.css';

// Lazy-loaded pages for code splitting
const Home = lazy(() => import('./pages/Home.jsx'));
const Department = lazy(() => import('./pages/Department.jsx'));
const ProductDetail = lazy(() => import('./pages/ProductDetail.jsx'));
const Search = lazy(() => import('./pages/Search.jsx'));
const Cart = lazy(() => import('./pages/Cart.jsx'));
const Checkout = lazy(() => import('./pages/Checkout.jsx'));
const OrderConfirmation = lazy(() => import('./pages/OrderConfirmation.jsx'));
const Wishlist = lazy(() => import('./pages/Wishlist.jsx'));
const Orders = lazy(() => import('./pages/Orders.jsx'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard.jsx'));
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts.jsx'));
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders.jsx'));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin.jsx'));
const AdminManagers = lazy(() => import('./pages/admin/AdminManagers.jsx'));
const AdminAuditLogs = lazy(() => import('./pages/admin/AdminAuditLogs.jsx'));
const ManagerCockpit = lazy(() => import('./pages/manager/ManagerCockpit.jsx'));

// Loading fallback
function PageLoader() {
  return (
    <div className="page-loader">
      <div className="loader-ring">
        <div className="loader-ring-inner"></div>
      </div>
      <p>Loading...</p>
    </div>
  );
}

// Admin route guard (STORE_ADMIN only)
function AdminRoute({ children }) {
  const { isStoreAdmin } = useApp();
  if (!isStoreAdmin) return <Navigate to="/admin/login" replace />;
  return children;
}

// Manager route guard (DEPARTMENT_MANAGER or STORE_ADMIN)
function ManagerRoute({ children }) {
  const { isDepartmentManager, isStoreAdmin } = useApp();
  if (!isDepartmentManager && !isStoreAdmin) return <Navigate to="/admin/login" replace />;
  return children;
}

export default function App() {
  const { orbitOpen } = useApp();

  return (
    <div className="app-shell">
      <Navbar />
      <main className="main-content" id="main-content">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/department/:deptId" element={<Department />} />
            <Route path="/product/:productId" element={<ProductDetail />} />
            <Route path="/search" element={<Search />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/manager" element={<ManagerRoute><ManagerCockpit /></ManagerRoute>} />
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
            <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
            <Route path="/admin/managers" element={<AdminRoute><AdminManagers /></AdminRoute>} />
            <Route path="/admin/audit-logs" element={<AdminRoute><AdminAuditLogs /></AdminRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <OrbitFAB />
      {orbitOpen && <OrbitPanel />}
      <ToastContainer />
    </div>
  );
}
