// src/middleware/auth.js
const { verifyToken, extractTokenFromHeader } = require('../config/jwt');
const authService = require('../services/authService');

/**
 * Middleware to authenticate JWT token
 */
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token is required'
      });
    }

    // Verify token
    const decoded = verifyToken(token);
    
    // Get user from database to ensure user still exists and is active
    const user = await authService.verifyUserById(decoded.id);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }

    // Attach user to request object
    req.user = user;
    next();

  } catch (error) {
    console.error('Token authentication error:', error);
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

/**
 * Middleware to check if user has required role
 * @param {string[]} roles - Array of allowed roles
 */
const requireRoles = (roles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      const userRole = req.user.role;
      
      if (!roles.includes(userRole)) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. Insufficient permissions.'
        });
      }

      next();

    } catch (error) {
      console.error('Role authorization error:', error);
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
  };
};

/**
 * Middleware to check if user is a patient
 */
const requirePatient = requireRoles(['PATIENT']);

/**
 * Middleware to check if user is a doctor
 */
const requireDoctor = requireRoles(['DOCTOR']);

/**
 * Middleware to check if user is an admin
 */
const requireAdmin = requireRoles(['ADMIN']);

/**
 * Middleware to allow both doctors and admins
 */
const requireDoctorOrAdmin = requireRoles(['DOCTOR', 'ADMIN']);

/**
 * Optional authentication - doesn't fail if no token provided
 * but attaches user if valid token is present
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      // No token provided, continue without user
      req.user = null;
      return next();
    }

    // Verify token
    const decoded = verifyToken(token);
    
    // Get user from database
    const user = await authService.verifyUserById(decoded.id);
    
    // Attach user to request (can be null if user not found)
    req.user = user;
    next();

  } catch (error) {
    // Token invalid, continue without user
    console.error('Optional auth error:', error);
    req.user = null;
    next();
  }
};

/**
 * Middleware to check if the user is accessing their own resource
 * @param {string} paramName - Parameter name containing the user ID (default: 'userId')
 */
const requireOwnership = (paramName = 'userId') => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      const resourceUserId = req.params[paramName];
      const currentUserId = req.user.id;

      // Admins can access any resource
      if (req.user.role === 'ADMIN') {
        return next();
      }

      // Check if user is accessing their own resource
      if (resourceUserId !== currentUserId) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. You can only access your own resources.'
        });
      }

      next();

    } catch (error) {
      console.error('Ownership check error:', error);
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
  };
};

/**
 * Middleware to check if user account is active
 */
const requireActiveUser = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!req.user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Account is deactivated. Please contact support.'
      });
    }

    next();

  } catch (error) {
    console.error('Active user check error:', error);
    return res.status(403).json({
      success: false,
      message: 'Access denied'
    });
  }
};

/**
 * Middleware to check if user email is verified
 */
const requireVerifiedUser = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!req.user.isVerified) {
      return res.status(403).json({
        success: false,
        message: 'Email verification required. Please verify your email to continue.'
      });
    }

    next();

  } catch (error) {
    console.error('Email verification check error:', error);
    return res.status(403).json({
      success: false,
      message: 'Access denied'
    });
  }
};

module.exports = {
  authenticateToken,
  requireRoles,
  requirePatient,
  requireDoctor,
  requireAdmin,
  requireDoctorOrAdmin,
  optionalAuth,
  requireOwnership,
  requireActiveUser,
  requireVerifiedUser
};