/* =========================================================
   BLOWMAGGY — Backend Server Entrypoint
   ========================================================= */
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import managerRoutes from './routes/manager.js';
import adminRoutes from './routes/admin.js';
import { db } from './db/database.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Enable CORS for Vite frontend
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  credentials: true
}));

// Parse JSON request bodies
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (process.env.NODE_ENV !== 'test') {
      console.log(`[API] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`);
    }
  });
  next();
});

// Health check endpoint (both /api/health and /health)
const healthHandler = (req, res) => {
  res.json({
    status: 'ONLINE',
    system: 'BLOWMAGGY - Z Backend',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    catalogSize: db.products.findMany().length,
    usersCount: db.users.findMany().length
  });
};
app.get('/api/health', healthHandler);
app.get('/health', healthHandler);

// Mount modular API routers with and without /api prefix
app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/orders', orderRoutes);
app.use('/api/manager', managerRoutes);
app.use('/manager', managerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/admin', adminRoutes);

// Global error handling middleware (Never leak stack traces in response!)
app.use((err, req, res, next) => {
  console.error('[FATAL SERVER ERROR]', err);
  res.status(500).json({
    error: 'INTERNAL_SERVER_ERROR',
    message: 'An unexpected internal error occurred. Please contact support.'
  });
});

// Start server if run directly
if (process.argv[1]?.endsWith('index.js')) {
  const server = app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🚀 BLOWMAGGY Backend running on http://localhost:${PORT}`);
    console.log(`   Health check: http://localhost:${PORT}/api/health`);
    console.log(`=======================================================`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`\n❌ [PORT ERROR] Port ${PORT} is already in use by another process.`);
      console.error(`   Please stop the existing server or terminate the process on port ${PORT}.\n`);
    } else {
      console.error('\n❌ [SERVER ERROR]', err);
    }
    process.exit(1);
  });
}

export default app;
