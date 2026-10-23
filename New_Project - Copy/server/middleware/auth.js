/* =========================================================
   BLOWMAGGY — Authentication Middleware
   ========================================================= */
import jwt from 'jsonwebtoken';
import { db } from '../db/database.js';

const JWT_SECRET = process.env.JWT_SECRET || 'blowmaggy_multiverse_super_secret_jwt_key_2026_dev';

export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') 
    ? authHeader.slice(7) 
    : req.query.token;

  if (!token) {
    return res.status(401).json({
      error: 'UNAUTHENTICATED',
      message: 'Authentication token required to access this resource.'
    });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        error: 'INVALID_TOKEN',
        message: 'Provided authentication token is invalid or expired.'
      });
    }

    // Retrieve fresh user from authoritative database
    const user = db.users.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        error: 'USER_NOT_FOUND',
        message: 'Account associated with this token no longer exists.'
      });
    }

    // Verify account is active (Test condition: Deactivated accounts lose access immediately)
    if (user.status !== 'ACTIVE') {
      return res.status(403).json({
        error: 'ACCOUNT_DEACTIVATED',
        message: 'This account has been deactivated by store administrators.'
      });
    }

    // If Department Manager, attach authorized department assignments
    let assignedDepartments = [];
    if (user.role === 'DEPARTMENT_MANAGER') {
      const assignments = db.departmentManagerAssignments.findByUser(user.id);
      assignedDepartments = assignments.map(a => a.departmentId);
    }

    req.user = {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      status: user.status,
      assignedDepartments
    };

    next();
  });
}
