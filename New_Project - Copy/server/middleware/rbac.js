/* =========================================================
   BLOWMAGGY — Role-Based Access Control (RBAC) Middleware
   =========================================================
   Enforces:
   - Specific role membership (SHOPPER, DEPARTMENT_MANAGER, STORE_ADMIN)
   - Department-level authorization for Department Managers
   - Automatic audit logging for unauthorized access attempts
   ========================================================= */
import { db } from '../db/database.js';

/**
 * Enforce that the user has one of the allowed roles
 * @param {Array<string>} allowedRoles e.g. ['STORE_ADMIN'] or ['STORE_ADMIN', 'DEPARTMENT_MANAGER']
 */
export function requireRole(allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'UNAUTHENTICATED',
        message: 'Authentication required.'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      // Audit log the unauthorized role elevation / access attempt
      db.auditLogs.log({
        userId: req.user.id,
        userRole: req.user.role,
        action: 'UNAUTHORIZED_ROLE_ACCESS_ATTEMPT',
        entity: req.baseUrl + req.path,
        details: {
          requiredRoles: allowedRoles,
          actualRole: req.user.role,
          method: req.method,
          ip: req.ip
        }
      });

      return res.status(403).json({
        error: 'FORBIDDEN',
        message: `Forbidden: Access requires role [${allowedRoles.join(' or ')}]. Your role is '${req.user.role}'.`
      });
    }

    next();
  };
}

/**
 * Enforce department-level authorization:
 * - STORE_ADMIN has global access across all departments.
 * - DEPARTMENT_MANAGER can ONLY access their explicitly assigned departments.
 * - Any other role is denied.
 */
export function requireDepartmentAccess(paramName = 'departmentId') {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'UNAUTHENTICATED', message: 'Authentication required.' });
    }

    // STORE_ADMIN always has platform-wide access
    if (req.user.role === 'STORE_ADMIN') {
      return next();
    }

    // DEPARTMENT_MANAGER must match assigned department
    if (req.user.role === 'DEPARTMENT_MANAGER') {
      let targetDept = null;

      // CRITICAL SECURITY CONTROL: If updating an existing resource by ID,
      // ALWAYS load the authoritative department from the database first!
      // A caller cannot bypass permissions by sending a spoofed departmentId in the body.
      if (req.params.id) {
        const product = db.products.findById(req.params.id);
        if (product) {
          targetDept = product.departmentId;
        }
      }

      // If no entity ID (e.g. creating a new product), look at body / params
      if (!targetDept) {
        targetDept = req.params[paramName] || req.body[paramName] || req.query[paramName];
      }

      // If body ALSO attempts to change the departmentId of an existing item, verify that target too
      if (req.body && req.body[paramName] && req.body[paramName] !== targetDept) {
        // Prevent moving an item out of or into an unauthorized department
        if (!req.user.assignedDepartments.includes(req.body[paramName])) {
          return res.status(403).json({
            error: 'DEPARTMENT_ACCESS_DENIED',
            message: `Forbidden: Cannot reassign product to unauthorized department '${req.body[paramName]}'.`
          });
        }
      }

      if (!targetDept) {
        return res.status(400).json({
          error: 'MISSING_DEPARTMENT_CONTEXT',
          message: 'Department context required to verify manager authorization.'
        });
      }

      const isAuthorized = req.user.assignedDepartments.includes(targetDept);

      if (!isAuthorized) {
        // Audit log the cross-department unauthorized modification attempt
        db.auditLogs.log({
          userId: req.user.id,
          userRole: req.user.role,
          action: 'CROSS_DEPARTMENT_MODIFICATION_ATTEMPT',
          entity: 'Department',
          entityId: targetDept,
          details: {
            assignedDepartments: req.user.assignedDepartments,
            attemptedDepartment: targetDept,
            endpoint: req.baseUrl + req.path,
            method: req.method
          }
        });

        return res.status(403).json({
          error: 'DEPARTMENT_ACCESS_DENIED',
          message: `Forbidden: As a Department Manager, you are only authorized to manage [${req.user.assignedDepartments.join(', ')}]. You cannot view or modify '${targetDept}'.`
        });
      }

      return next();
    }

    // Shoppers and other roles cannot perform department operations
    return res.status(403).json({
      error: 'FORBIDDEN',
      message: 'Forbidden: Insufficient privileges for department management operations.'
    });
  };
}
