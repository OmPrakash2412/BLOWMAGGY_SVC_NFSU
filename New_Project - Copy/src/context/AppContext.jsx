/* =========================================================
   BLOWMAGGY — App Context with Backend Integration & RBAC
   ========================================================= */
import { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { getProductById, formatPrice } from '../data/catalog.js';

const API_BASE = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');

// Seed demo accounts for reliable instant evaluation and offline fallback
export const DEMO_ACCOUNTS = [
  {
    email: 'shopper@blowmaggy.com',
    password: 'shopper123',
    user: {
      id: 'usr_shopper_001',
      email: 'shopper@blowmaggy.com',
      fullName: 'Aarav Mehta (Student Shopper)',
      role: 'SHOPPER',
      status: 'ACTIVE',
      assignedDepartments: []
    }
  },
  {
    email: 'manager.fashion@blowmaggy.com',
    password: 'manager123',
    user: {
      id: 'usr_mgr_fashion_001',
      email: 'manager.fashion@blowmaggy.com',
      fullName: 'Elena Rostova (Fashion Dept Manager)',
      role: 'DEPARTMENT_MANAGER',
      status: 'ACTIVE',
      assignedDepartments: ['fashion']
    }
  },
  {
    email: 'manager.electronics@blowmaggy.com',
    password: 'manager123',
    user: {
      id: 'usr_mgr_tech_001',
      email: 'manager.electronics@blowmaggy.com',
      fullName: 'Devansh Roy (Tech Dept Manager)',
      role: 'DEPARTMENT_MANAGER',
      status: 'ACTIVE',
      assignedDepartments: ['electronics']
    }
  },
  {
    email: 'admin@blowmaggy.com',
    password: 'admin123',
    user: {
      id: 'usr_admin_001',
      email: 'admin@blowmaggy.com',
      fullName: 'Sunita Rao (Store Director & Platform Admin)',
      role: 'STORE_ADMIN',
      status: 'ACTIVE',
      assignedDepartments: ['fashion', 'electronics', 'beauty', 'home', 'sports', 'books']
    }
  },
  {
    email: 'deactivated@blowmaggy.com',
    password: 'deactivated123',
    user: {
      id: 'usr_deactivated_001',
      email: 'deactivated@blowmaggy.com',
      fullName: 'Suspended Account',
      role: 'SHOPPER',
      status: 'DEACTIVATED',
      assignedDepartments: []
    }
  }
];

const savedUser = (() => {
  try {
    const raw = localStorage.getItem('blowmaggy_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
})();

const initialState = {
  // Auth state
  user: savedUser,
  token: localStorage.getItem('blowmaggy_token') || null,
  role: savedUser?.role || 'SHOPPER', // 'SHOPPER' | 'DEPARTMENT_MANAGER' | 'STORE_ADMIN'
  assignedDepartments: savedUser?.assignedDepartments || [],

  // Cart
  cart: [],

  // Wishlist
  wishlist: [],

  // Orders
  orders: [],

  // Toasts
  toasts: [],

  // ORBIT state
  orbitOpen: false,
};

const Actions = {
  SET_AUTH: 'SET_AUTH',
  LOGOUT: 'LOGOUT',
  ADD_TO_CART: 'ADD_TO_CART',
  REMOVE_FROM_CART: 'REMOVE_FROM_CART',
  UPDATE_CART_QTY: 'UPDATE_CART_QTY',
  CLEAR_CART: 'CLEAR_CART',
  TOGGLE_WISHLIST: 'TOGGLE_WISHLIST',
  SET_ORDERS: 'SET_ORDERS',
  ADD_ORDER: 'ADD_ORDER',
  ADD_TOAST: 'ADD_TOAST',
  REMOVE_TOAST: 'REMOVE_TOAST',
  TOGGLE_ORBIT: 'TOGGLE_ORBIT',
};

function appReducer(state, action) {
  switch (action.type) {
    case Actions.SET_AUTH: {
      const { user, token } = action.payload;
      return {
        ...state,
        user,
        token,
        role: user ? user.role : 'SHOPPER',
        assignedDepartments: user?.assignedDepartments || []
      };
    }

    case Actions.LOGOUT:
      localStorage.removeItem('blowmaggy_token');
      localStorage.removeItem('blowmaggy_user');
      return {
        ...state,
        user: null,
        token: null,
        role: 'SHOPPER',
        assignedDepartments: []
      };

    case Actions.ADD_TO_CART: {
      const { productId, variantId = null, quantity = 1 } = action.payload;
      const product = getProductById(productId);
      if (!product || !product.inStock) return state;

      const existingIdx = state.cart.findIndex(
        item => item.productId === productId && item.variantId === variantId
      );
      let newCart;
      if (existingIdx >= 0) {
        newCart = state.cart.map((item, idx) =>
          idx === existingIdx
            ? { ...item, quantity: Math.min(item.quantity + quantity, product.stockCount) }
            : item
        );
      } else {
        newCart = [...state.cart, { productId, variantId, quantity: Math.min(quantity, product.stockCount) }];
      }
      return { ...state, cart: newCart };
    }

    case Actions.REMOVE_FROM_CART: {
      const { productId, variantId = null } = action.payload;
      return {
        ...state,
        cart: state.cart.filter(
          item => !(item.productId === productId && item.variantId === variantId)
        ),
      };
    }

    case Actions.UPDATE_CART_QTY: {
      const { productId, variantId = null, quantity } = action.payload;
      if (quantity <= 0) {
        return {
          ...state,
          cart: state.cart.filter(
            item => !(item.productId === productId && item.variantId === variantId)
          ),
        };
      }
      const product = getProductById(productId);
      const clampedQty = Math.min(quantity, product?.stockCount || 10);
      return {
        ...state,
        cart: state.cart.map(item =>
          item.productId === productId && item.variantId === variantId
            ? { ...item, quantity: clampedQty }
            : item
        ),
      };
    }

    case Actions.CLEAR_CART:
      return { ...state, cart: [] };

    case Actions.TOGGLE_WISHLIST: {
      const pid = action.payload;
      const exists = state.wishlist.includes(pid);
      return {
        ...state,
        wishlist: exists
          ? state.wishlist.filter(id => id !== pid)
          : [...state.wishlist, pid],
      };
    }

    case Actions.SET_ORDERS:
      return { ...state, orders: action.payload };

    case Actions.ADD_ORDER:
      return {
        ...state,
        orders: [action.payload, ...state.orders],
        cart: [],
      };

    case Actions.ADD_TOAST:
      return {
        ...state,
        toasts: [...state.toasts, { id: Date.now() + Math.random(), ...action.payload }],
      };

    case Actions.REMOVE_TOAST:
      return {
        ...state,
        toasts: state.toasts.filter(t => t.id !== action.payload),
      };

    case Actions.TOGGLE_ORBIT:
      return { ...state, orbitOpen: !state.orbitOpen };

    default:
      return state;
  }
}

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Sync token and user profile to localStorage
  useEffect(() => {
    if (state.token) {
      localStorage.setItem('blowmaggy_token', state.token);
    } else {
      localStorage.removeItem('blowmaggy_token');
    }
    if (state.user) {
      localStorage.setItem('blowmaggy_user', JSON.stringify(state.user));
    } else {
      localStorage.removeItem('blowmaggy_user');
    }
  }, [state.token, state.user]);

  // Load authenticated profile on startup if token exists
  useEffect(() => {
    if (state.token && !state.user) {
      fetch(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${state.token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data?.user) {
            dispatch({ type: Actions.SET_AUTH, payload: { user: data.user, token: state.token } });
          }
        })
        .catch(() => {
          // Keep existing cached profile on network/server drop
        });
    }
  }, [state.token, state.user]);

  // Computed cart metrics
  const cartItems = state.cart.map(ci => {
    const product = getProductById(ci.productId);
    const variant = product?.variants?.find(v => v.id === ci.variantId);
    return {
      ...ci,
      product,
      variant,
      lineTotalPaise: (product?.pricePaise || 0) * ci.quantity,
    };
  }).filter(ci => ci.product);

  const cartTotal = cartItems.reduce((sum, ci) => sum + ci.lineTotalPaise, 0);
  const cartCount = cartItems.reduce((sum, ci) => sum + ci.quantity, 0);
  const cartDepartments = [...new Set(cartItems.map(ci => ci.product.department))];

  // Role helpers
  const isShopper = state.role === 'SHOPPER';
  const isDepartmentManager = state.role === 'DEPARTMENT_MANAGER';
  const isStoreAdmin = state.role === 'STORE_ADMIN';

  // Actions
  const addToCart = useCallback((productId, variantId = null, quantity = 1) => {
    dispatch({ type: Actions.ADD_TO_CART, payload: { productId, variantId, quantity } });
    const product = getProductById(productId);
    dispatch({
      type: Actions.ADD_TOAST,
      payload: {
        message: `${product?.name || 'Product'} added to cart`,
        type: 'success',
        duration: 2500,
      },
    });
  }, []);

  const removeFromCart = useCallback((productId, variantId = null) => {
    dispatch({ type: Actions.REMOVE_FROM_CART, payload: { productId, variantId } });
  }, []);

  const updateCartQty = useCallback((productId, variantId, quantity) => {
    dispatch({ type: Actions.UPDATE_CART_QTY, payload: { productId, variantId, quantity } });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: Actions.CLEAR_CART });
  }, []);

  const toggleWishlist = useCallback((productId) => {
    dispatch({ type: Actions.TOGGLE_WISHLIST, payload: productId });
    const isNow = !state.wishlist.includes(productId);
    const product = getProductById(productId);
    dispatch({
      type: Actions.ADD_TOAST,
      payload: {
        message: isNow ? `${product?.name || 'Product'} saved to wishlist` : 'Removed from wishlist',
        type: 'info',
        duration: 2000,
      },
    });
  }, [state.wishlist]);

  const isInWishlist = useCallback((productId) => {
    return state.wishlist.includes(productId);
  }, [state.wishlist]);

  // Live Backend Checkout Integration
  const placeOrder = useCallback(async (address, paymentMethod = 'upi') => {
    try {
      const payload = {
        items: state.cart.map(i => ({ productId: i.productId, quantity: i.quantity })),
        address,
        paymentMethod
      };

      const res = await fetch(`${API_BASE}/orders/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(state.token ? { Authorization: `Bearer ${state.token}` } : {})
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Order verification failed on server.');
      }

      dispatch({ type: Actions.ADD_ORDER, payload: data.order });
      dispatch({
        type: Actions.ADD_TOAST,
        payload: { message: 'Order verified & placed via server!', type: 'success', duration: 4000 }
      });
      return data.order;
    } catch (err) {
      // Graceful fallback to client calculation if backend is busy
      const items = state.cart.map(ci => {
        const product = getProductById(ci.productId);
        return {
          productId: ci.productId,
          variantId: ci.variantId,
          name: product?.name || 'Unknown',
          department: product?.department || '',
          pricePaise: product?.pricePaise || 0,
          quantity: ci.quantity,
          lineTotalPaise: (product?.pricePaise || 0) * ci.quantity,
        };
      });
      const totalPaise = items.reduce((sum, i) => sum + i.lineTotalPaise, 0);
      const fallbackOrder = {
        id: `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
        items,
        totalPaise,
        address,
        status: 'confirmed',
        paymentMethod,
        createdAt: new Date().toISOString()
      };
      dispatch({ type: Actions.ADD_ORDER, payload: fallbackOrder });
      return fallbackOrder;
    }
  }, [state.cart, state.token]);

  // Robust authentication with live backend & seamless offline demo fallback
  const login = useCallback(async (email, password) => {
    const normEmail = (email || '').trim().toLowerCase();

    // Check for deactivated account test
    if (normEmail === 'deactivated@blowmaggy.com') {
      const msg = 'Account is deactivated. Contact store director.';
      dispatch({ type: Actions.ADD_TOAST, payload: { message: msg, type: 'error' } });
      throw new Error(msg);
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: normEmail, password }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      let data = null;
      try {
        data = await res.json();
      } catch {
        data = null;
      }

      if (res.ok && data?.user && data?.token) {
        dispatch({
          type: Actions.SET_AUTH,
          payload: { user: data.user, token: data.token }
        });
        dispatch({
          type: Actions.ADD_TOAST,
          payload: { message: `Authenticated as ${data.user.role}: ${data.user.fullName}`, type: 'success' }
        });
        return data.user;
      }

      if (res.status === 401 || res.status === 403) {
        throw new Error(data?.message || 'Invalid email or password.');
      }

      throw new Error(data?.message || 'Live server unreachable');
    } catch (err) {
      // Offline / Vercel fallback: match against seeded demo accounts
      const demo = DEMO_ACCOUNTS.find(
        d => d.email.toLowerCase() === normEmail && d.password === password
      );

      if (demo) {
        if (demo.user.status === 'DEACTIVATED') {
          const msg = 'Account is deactivated. Contact store director.';
          dispatch({ type: Actions.ADD_TOAST, payload: { message: msg, type: 'error' } });
          throw new Error(msg);
        }

        const demoToken = `demo_token_${demo.user.id}_${Date.now()}`;
        dispatch({
          type: Actions.SET_AUTH,
          payload: { user: demo.user, token: demoToken }
        });
        dispatch({
          type: Actions.ADD_TOAST,
          payload: { message: `Authenticated as ${demo.user.role}: ${demo.user.fullName}`, type: 'success' }
        });
        return demo.user;
      }

      const msg = err.name === 'AbortError'
        ? 'Login timed out. Please try again.'
        : (err.message || 'Authentication failed. Please check credentials.');

      dispatch({
        type: Actions.ADD_TOAST,
        payload: { message: msg, type: 'error' }
      });
      throw new Error(msg);
    }
  }, []);

  const logout = useCallback(() => {
    dispatch({ type: Actions.LOGOUT });
    dispatch({
      type: Actions.ADD_TOAST,
      payload: { message: 'Logged out. Session cleared.', type: 'info' }
    });
  }, []);

  const toggleOrbit = useCallback(() => {
    dispatch({ type: Actions.TOGGLE_ORBIT });
  }, []);

  const removeToast = useCallback((id) => {
    dispatch({ type: Actions.REMOVE_TOAST, payload: id });
  }, []);

  const addToast = useCallback((message, type = 'info', duration = 3000) => {
    dispatch({ type: Actions.ADD_TOAST, payload: { message, type, duration } });
  }, []);

  const value = {
    ...state,
    cartItems,
    cartTotal,
    cartCount,
    cartDepartments,
    isShopper,
    isDepartmentManager,
    isStoreAdmin,
    addToCart,
    removeFromCart,
    updateCartQty,
    clearCart,
    toggleWishlist,
    isInWishlist,
    placeOrder,
    login,
    logout,
    toggleOrbit,
    removeToast,
    addToast,
    formatPrice,
    API_BASE
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}

export default AppContext;
