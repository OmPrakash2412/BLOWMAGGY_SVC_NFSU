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

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    system: 'BLOWMAGGY Multiverse Backend',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    catalogSize: db.products.findMany().length,
    usersCount: db.users.findMany().length
  });
});

// Mount modular API routers
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/manager', managerRoutes);
app.use('/api/admin', adminRoutes);

// Global 404 handler for unmatched API routes
app.use('/api', (req, res) => {
  res.status(404).json({
    error: 'NOT_FOUND',
    message: `API route '${req.method} ${req.originalUrl}' does not exist.`
  });
});

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
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🚀 BLOWMAGGY Backend running on http://localhost:${PORT}`);
    console.log(`   Health check: http://localhost:${PORT}/api/health`);
    console.log(`=======================================================`);
  });
}

export default app;
