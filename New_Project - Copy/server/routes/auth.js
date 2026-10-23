/* =========================================================
   BLOWMAGGY — Authentication Routes
   ========================================================= */
import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'blowmaggy_multiverse_super_secret_jwt_key_2026_dev';
const SESSION_EXPIRES_IN = process.env.SESSION_EXPIRES_IN || '24h';

// POST /api/auth/register (Shopper Public Registration)
router.post('/register', async (req, res) => {
  try {
    const { email, password, fullName, role } = req.body;

    if (!email || !password || !fullName) {
      return res.status(400).json({ error: 'MISSING_FIELDS', message: 'Email, password, and full name are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'WEAK_PASSWORD', message: 'Password must be at least 6 characters long.' });
    }

    const existing = db.users.findByEmail(email);
    if (existing) {
      return res.status(409).json({ error: 'EMAIL_IN_USE', message: 'An account with this email address already exists.' });
    }

    // Security requirement: Public registration CANNOT self-assign privileged roles!
    // If a request tries to pass STORE_ADMIN or DEPARTMENT_MANAGER, enforce SHOPPER or reject
    if (role && role !== 'SHOPPER') {
      db.auditLogs.log({
        action: 'PRIVILEGE_ELEVATION_INJECTION_BLOCKED',
        entity: 'User',
        details: { attemptedRole: role, email, ip: req.ip }
      });
      return res.status(403).json({
        error: 'ILLEGAL_ROLE_ASSIGNMENT',
        message: 'Privileged roles (DEPARTMENT_MANAGER, STORE_ADMIN) cannot be self-assigned during registration.'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = db.users.create({
      email,
      passwordHash,
      fullName,
      role: 'SHOPPER',
      status: 'ACTIVE'
    });

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: SESSION_EXPIRES_IN }
    );

    res.status(201).json({
      message: 'Account created successfully.',
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        fullName: newUser.fullName,
        role: newUser.role,
        status: newUser.status
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'SERVER_ERROR', message: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'MISSING_CREDENTIALS', message: 'Email and password required.' });
    }

    const user = db.users.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'INVALID_CREDENTIALS', message: 'Invalid email or password.' });
    }

    // Check account status
    if (user.status !== 'ACTIVE') {
      db.auditLogs.log({
        userId: user.id,
        userRole: user.role,
        action: 'DEACTIVATED_ACCOUNT_LOGIN_BLOCKED',
        entity: 'User',
        entityId: user.id,
        details: { email: user.email, status: user.status }
      });

      return res.status(403).json({
        error: 'ACCOUNT_DEACTIVATED',
        message: 'This account has been deactivated. Please contact store administrators.'
      });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'INVALID_CREDENTIALS', message: 'Invalid email or password.' });
    }

    // Retrieve department assignments if manager
    let assignedDepartments = [];
    if (user.role === 'DEPARTMENT_MANAGER') {
      const assignments = db.departmentManagerAssignments.findByUser(user.id);
      assignedDepartments = assignments.map(a => a.departmentId);
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: SESSION_EXPIRES_IN }
    );

    // Audit log successful login
    db.auditLogs.log({
      userId: user.id,
      userRole: user.role,
      action: 'USER_LOGIN_SUCCESS',
      entity: 'Session',
      entityId: user.id,
      details: { role: user.role, assignedDepartments }
    });

    res.json({
      message: 'Login successful.',
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        status: user.status,
        assignedDepartments
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'SERVER_ERROR', message: err.message });
  }
});

// GET /api/auth/me (Current Authenticated User Profile)
router.get('/me', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

export default router;
