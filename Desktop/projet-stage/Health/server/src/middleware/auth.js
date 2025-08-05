// src/middleware/auth.js
const jwtConfig = require('../config/jwt');
const { prisma } = require('../config/database');

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

    // Récupérer l'utilisateur avec Prisma
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        role: true,
        isEmailVerified: true,
        isActive: true,
        patient: {
          select: {
            id: true
          }
        },
        doctor: {
          select: {
            id: true,
            isVerified: true,
            specialty: {
              select: {
                name: true
              }
            }
          }
        }
      }
    });

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
      isEmailVerified: user.isEmailVerified,
      patientId: user.patient?.id,
      doctorId: user.doctor?.id,
      isDoctorVerified: user.doctor?.isVerified || false,
      specialty: user.doctor?.specialty?.name
    };

    next();
  } catch (error) {
    console.error('Erreur d\'authentification:', error);
    
    // Gestion spécifique des erreurs JWT
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expiré',
        code: 'TOKEN_EXPIRED'
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token invalide',
        code: 'INVALID_TOKEN'
      });
    }
    
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
        const user = await prisma.user.findUnique({
          where: { id: decoded.userId },
          select: {
            id: true,
            email: true,
            role: true,
            isEmailVerified: true,
            isActive: true,
            patient: { select: { id: true } },
            doctor: { select: { id: true, isVerified: true } }
          }
        });

        if (user && user.isActive) {
          req.user = {
            userId: user.id,
            email: user.email,
            role: user.role,
            isEmailVerified: user.isEmailVerified,
            patientId: user.patient?.id,
            doctorId: user.doctor?.id,
            isDoctorVerified: user.doctor?.isVerified || false
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
  if (!req.user?.isEmailVerified) {
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
    PATIENT: [
      'view_own_profile',
      'update_own_profile',
      'book_appointments',
      'view_own_appointments',
      'view_own_medical_records',
      'cancel_own_appointments',
      'rate_doctors'
    ],
    DOCTOR: [
      'view_own_profile',
      'update_own_profile',
      'view_appointments',
      'manage_appointments',
      'view_patients',
      'create_medical_records',
      'view_medical_records',
      'update_medical_records',
      'manage_schedule',
      'view_reviews'
    ],
    ADMIN: [
      'view_all_users',
      'manage_users',
      'view_all_appointments',
      'manage_appointments',
      'view_analytics',
      'manage_system',
      'view_all_medical_records',
      'manage_doctors',
      'manage_patients',
      'verify_doctors',
      'manage_specialties'
    ]
  };

  return permissions[role] || [];
};

// Middleware pour vérifier l'ownership (l'utilisateur ne peut accéder qu'à ses propres données)
const requireOwnership = (paramName = 'userId') => {
  return (req, res, next) => {
    const resourceUserId = req.params[paramName];
    
    // Les admins peuvent accéder à toutes les ressources
    if (req.user.role === 'ADMIN') {
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

// Middleware pour vérifier l'ownership des patients
const requirePatientOwnership = (paramName = 'patientId') => {
  return (req, res, next) => {
    const resourcePatientId = req.params[paramName];
    
    // Les admins et docteurs peuvent accéder aux ressources patients
    if (['ADMIN', 'DOCTOR'].includes(req.user.role)) {
      return next();
    }

    // Le patient ne peut accéder qu'à ses propres ressources
    if (req.user.patientId !== resourcePatientId) {
      return res.status(403).json({
        success: false,
        message: 'Accès non autorisé à cette ressource patient'
      });
    }

    next();
  };
};

// Middleware pour vérifier l'ownership des docteurs
const requireDoctorOwnership = (paramName = 'doctorId') => {
  return (req, res, next) => {
    const resourceDoctorId = req.params[paramName];
    
    // Les admins peuvent accéder aux ressources docteurs
    if (req.user.role === 'ADMIN') {
      return next();
    }

    // Le docteur ne peut accéder qu'à ses propres ressources
    if (req.user.doctorId !== resourceDoctorId) {
      return res.status(403).json({
        success: false,
        message: 'Accès non autorisé à cette ressource docteur'
      });
    }

    next();
  };
};

// Middleware pour vérifier si le docteur est vérifié
const requireVerifiedDoctor = (req, res, next) => {
  if (req.user.role !== 'DOCTOR') {
    return res.status(403).json({
      success: false,
      message: 'Accès réservé aux docteurs'
    });
  }

  if (!req.user.isDoctorVerified) {
    return res.status(403).json({
      success: false,
      message: 'Profil docteur non vérifié. Contactez l\'administrateur.',
      code: 'DOCTOR_NOT_VERIFIED'
    });
  }

  next();
};

// Middleware pour loguer les tentatives d'authentification
const logAuthAttempt = (req, res, next) => {
  const originalSend = res.send;
  
  res.send = function(data) {
    // Logger uniquement les échecs d'authentification
    if (res.statusCode === 401 || res.statusCode === 403) {
      const userAgent = req.get('User-Agent') || 'Unknown';
      const ip = req.ip || req.connection.remoteAddress || 'Unknown';
      
      console.log(`[AUTH FAILURE] ${new Date().toISOString()} - IP: ${ip} - Route: ${req.originalUrl} - Status: ${res.statusCode} - User-Agent: ${userAgent}`);
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

// Middleware pour vérifier l'accès aux rendez-vous
const requireAppointmentAccess = async (req, res, next) => {
  try {
    const appointmentId = req.params.appointmentId || req.params.id;
    
    if (!appointmentId) {
      return res.status(400).json({
        success: false,
        message: 'ID de rendez-vous requis'
      });
    }

    // Les admins ont accès à tous les rendez-vous
    if (req.user.role === 'ADMIN') {
      return next();
    }

    // Vérifier si l'utilisateur a accès à ce rendez-vous
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      select: {
        patientId: true,
        doctorId: true
      }
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Rendez-vous non trouvé'
      });
    }

    const hasAccess = (
      (req.user.role === 'PATIENT' && req.user.patientId === appointment.patientId) ||
      (req.user.role === 'DOCTOR' && req.user.doctorId === appointment.doctorId)
    );

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Accès non autorisé à ce rendez-vous'
      });
    }

    // Ajouter les informations du rendez-vous à la requête
    req.appointment = appointment;
    next();
  } catch (error) {
    console.error('Erreur lors de la vérification d\'accès au rendez-vous:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur'
    });
  }
};

module.exports = {
  authenticateToken,
  optionalAuth,
  requireEmailVerification,
  requireRole,
  requirePermission,
  requireOwnership,
  requirePatientOwnership,
  requireDoctorOwnership,
  requireVerifiedDoctor,
  requireAppointmentAccess,
  logAuthAttempt,
  handleExpiredToken,
  getUserPermissions
};