const jwtConfig = require('../config/jwt');
const { User } = require('../models/postgresql');

// Middleware pour vérifier l'authentification
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token d\'accès requis'
      });
    }

    // Vérifier le token
    const decoded = jwtConfig.verifyToken(token);
    
    if (decoded.type !== 'access') {
      return res.status(401).json({
        success: false,
        message: 'Type de token invalide'
      });
    }

    // Récupérer l'utilisateur
    const user = await User.findByPk(decoded.userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    // Vérifier si l'utilisateur est actif
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Compte désactivé'
      });
    }

    // Ajouter les informations utilisateur à la requête
    req.user = {
      userId: user.id,
      email: user.email,
      role: user.role,
      isEmailVerified: user.isEmailVerified
    };

    next();
  } catch (error) {
    console.error('Erreur d\'authentification:', error);
    return res.status(401).json({
      success: false,
      message: 'Token invalide'
    });
  }
};

// Middleware pour vérifier l'authentification (optionnel)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwtConfig.verifyToken(token);
      
      if (decoded.type === 'access') {
        const user = await User.findByPk(decoded.userId);
        if (user && user.isActive) {
          req.user = {
            userId: user.id,
            email: user.email,
            role: user.role,
            isEmailVerified: user.isEmailVerified
          };
        }
      }
    }

    next();
  } catch (error) {
    // En cas d'erreur, on continue sans utilisateur authentifié
    next();
  }
};

// Middleware pour vérifier si l'email est vérifié
const requireEmailVerification = (req, res, next) => {
  if (!req.user.isEmailVerified) {
    return res.status(403).json({
      success: false,
      message: 'Email non vérifié. Veuillez vérifier votre email avant de continuer.',
      code: 'EMAIL_NOT_VERIFIED'
    });
  }
  next();
};

// Middleware pour vérifier le rôle utilisateur
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentification requise'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Permissions insuffisantes'
      });
    }

    next();
  };
};

// Middleware pour vérifier les permissions spécifiques
const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentification requise'
      });
    }

    const userPermissions = getUserPermissions(req.user.role);
    
    if (!userPermissions.includes(permission)) {
      return res.status(403).json({
        success: false,
        message: 'Permission insuffisante'
      });
    }

    next();
  };
};

// Fonction pour obtenir les permissions selon le rôle
const getUserPermissions = (role) => {
  const permissions = {
    patient: [
      'view_own_profile',
      'update_own_profile',
      'book_appointments',
      'view_own_appointments',
      'view_own_medical_records',
      'cancel_own_appointments'
    ],
    doctor: [
      'view_own_profile',
      'update_own_profile',
      'view_appointments',
      'manage_appointments',
      'view_patients',
      'create_medical_records',
      'view_medical_records',
      'update_medical_records',
      'manage_schedule'
    ],
    admin: [
      'view_all_users',
      'manage_users',
      'view_all_appointments',
      'manage_appointments',
      'view_analytics',
      'manage_system',
      'view_all_medical_records',
      'manage_doctors',
      'manage_patients'
    ]
  };

  return permissions[role] || [];
};

// Middleware pour vérifier l'ownership (l'utilisateur ne peut accéder qu'à ses propres données)
const requireOwnership = (paramName = 'userId') => {
  return (req, res, next) => {
    const resourceUserId = req.params[paramName];
    
    // Les admins peuvent accéder à toutes les ressources
    if (req.user.role === 'admin') {
      return next();
    }

    // L'utilisateur ne peut accéder qu'à ses propres ressources
    if (req.user.userId !== resourceUserId) {
      return res.status(403).json({
        success: false,
        message: 'Accès non autorisé à cette ressource'
      });
    }

    next();
  };
};

// Middleware pour loguer les tentatives d'authentification
const logAuthAttempt = (req, res, next) => {
  const originalSend = res.send;
  
  res.send = function(data) {
    // Logger uniquement les échecs d'authentification
    if (res.statusCode === 401 || res.statusCode === 403) {
      console.log(`[AUTH FAILURE] ${new Date().toISOString()} - IP: ${req.ip} - Route: ${req.originalUrl} - Status: ${res.statusCode}`);
    }
    
    originalSend.call(this, data);
  };
  
  next();
};

// Middleware pour détecter les tokens expirés
const handleExpiredToken = (err, req, res, next) => {
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expiré',
      code: 'TOKEN_EXPIRED'
    });
  }
  
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Token invalide',
      code: 'INVALID_TOKEN'
    });
  }
  
  next(err);
};

module.exports = {
  authenticateToken,
  optionalAuth,
  requireEmailVerification,
  requireRole,
  requirePermission,
  requireOwnership,
  logAuthAttempt,
  handleExpiredToken,
  getUserPermissions
};