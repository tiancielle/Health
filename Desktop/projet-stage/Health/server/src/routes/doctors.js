// src/routes/doctors.js - Version corrigée
const express = require('express');
const router = express.Router();

console.log('🔧 Chargement des routes doctors...');

// Import sécurisé du controller
let doctorController;
try {
  doctorController = require('../controllers/doctorController');
  console.log('✅ doctorController importé');
} catch (error) {
  console.error('❌ Erreur import doctorController:', error.message);
  // Contrôleur de fallback
  doctorController = {
    searchDoctors: (req, res) => res.status(501).json({ success: false, message: 'Search doctors not implemented' }),
    getSearchSuggestions: (req, res) => res.status(501).json({ success: false, message: 'Search suggestions not implemented' }),
    getPopularDoctors: (req, res) => res.status(501).json({ success: false, message: 'Popular doctors not implemented' }),
    getSpecialties: (req, res) => res.status(501).json({ success: false, message: 'Specialties not implemented' }),
    getDoctorDetails: (req, res) => res.status(501).json({ success: false, message: 'Doctor details not implemented' })
  };
}

// Middleware de rate limiting simple
const rateLimiter = (req, res, next) => {
  // TODO: Implémenter express-rate-limit plus tard
  next();
};

// ✅ CORRECTION : Validation CUID au lieu d'UUID
const validateDoctorId = (req, res, next) => {
  const { id } = req.params;
  
  // Validation pour CUID (format utilisé par Prisma avec @default(cuid()))
  // CUID format: c + timestamp + counter + random = 25 caractères
  const cuidRegex = /^c[a-z0-9]{24}$/i;
  
  if (!id) {
    console.log('❌ ID manquant dans les paramètres');
    return res.status(400).json({
      success: false,
      message: 'ID du médecin requis'
    });
  }
  
  // Accepter les IDs de test aussi (comme cm123docp002)
  const isValidCuid = cuidRegex.test(id);
  const isTestId = id.startsWith('cm123docp');
  
  if (!isValidCuid && !isTestId) {
    console.log('❌ Format d\'ID invalide:', id);
    return res.status(400).json({
      success: false,
      message: 'Format d\'ID de médecin invalide'
    });
  }
  
  console.log('✅ ID validé:', id);
  next();
};

// ⚠️ ORDRE CRITIQUE : Routes spécifiques AVANT les routes avec paramètres

/**
 * @route   GET /api/doctors
 * @desc    Récupérer tous les médecins
 * @access  Public
 */
router.get('/', (req, res, next) => {
  try {
    console.log('📋 Route GET /api/doctors appelée');
    if (doctorController.getAllDoctors) {
      doctorController.getAllDoctors(req, res, next);
    } else {
      res.status(501).json({
        success: false,
        message: 'Get all doctors method not implemented'
      });
    }
  } catch (error) {
    console.error('❌ Erreur dans route /:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

/**
 * @route   GET /api/doctors/search
 * @desc    Rechercher des médecins
 * @access  Public
 */
router.get('/search', rateLimiter, (req, res, next) => {
  try {
    console.log('🔍 Route GET /api/doctors/search appelée');
    if (doctorController.searchDoctors) {
      doctorController.searchDoctors(req, res, next);
    } else {
      res.status(501).json({
        success: false,
        message: 'Search doctors method not implemented'
      });
    }
  } catch (error) {
    console.error('❌ Error in /search route:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @route   GET /api/doctors/suggestions
 * @desc    Obtenir des suggestions de recherche
 * @access  Public
 */
router.get('/suggestions', rateLimiter, (req, res, next) => {
  try {
    console.log('💡 Route GET /api/doctors/suggestions appelée');
    if (doctorController.getSearchSuggestions) {
      doctorController.getSearchSuggestions(req, res, next);
    } else {
      res.status(501).json({
        success: false,
        message: 'Search suggestions method not implemented'
      });
    }
  } catch (error) {
    console.error('❌ Error in /suggestions route:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @route   GET /api/doctors/popular
 * @desc    Obtenir les médecins populaires
 * @access  Public
 */
router.get('/popular', rateLimiter, (req, res, next) => {
  try {
    console.log('⭐ Route GET /api/doctors/popular appelée');
    if (doctorController.getPopularDoctors) {
      doctorController.getPopularDoctors(req, res, next);
    } else {
      res.status(501).json({
        success: false,
        message: 'Popular doctors method not implemented'
      });
    }
  } catch (error) {
    console.error('❌ Error in /popular route:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @route   GET /api/doctors/specialties
 * @desc    Obtenir la liste des spécialités
 * @access  Public
 */
router.get('/specialties', rateLimiter, (req, res, next) => {
  try {
    console.log('🏥 Route GET /api/doctors/specialties appelée');
    if (doctorController.getSpecialties) {
      doctorController.getSpecialties(req, res, next);
    } else {
      res.status(501).json({
        success: false,
        message: 'Specialties method not implemented'
      });
    }
  } catch (error) {
    console.error('❌ Error in /specialties route:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @route   GET /api/doctors/:id
 * @desc    Obtenir les détails d'un médecin
 * @access  Public
 * ⚠️ CETTE ROUTE DOIT ÊTRE EN DERNIER pour éviter les conflicts
 */
router.get('/:id', rateLimiter, validateDoctorId, (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(`👨‍⚕️ Route GET /api/doctors/${id} appelée`);
    
    if (doctorController.getDoctorDetails) {
      doctorController.getDoctorDetails(req, res, next);
    } else {
      res.status(501).json({
        success: false,
        message: 'Doctor details method not implemented'
      });
    }
  } catch (error) {
    console.error('❌ Error in /:id route:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

console.log('✅ Routes doctors chargées');

module.exports = router;