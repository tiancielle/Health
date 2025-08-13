// server/src/routes/doctors.js
const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');

// Middleware de rate limiting simple (optionnel)
const rateLimiter = (req, res, next) => {
  // Implémentation basique ou utiliser express-rate-limit
  next();
};

/**
 * @route   GET /api/doctors/search
 * @desc    Rechercher des médecins
 * @access  Public
 * @params  
 *   - q: terme de recherche (nom, spécialité)
 *   - location: ville ou code postal
 *   - specialty: spécialité spécifique
 *   - minRating: note minimum
 *   - availability: disponibilité
 *   - maxDistance: distance maximale
 *   - sortBy: critère de tri
 *   - page: numéro de page
 *   - limit: nombre de résultats par page
 */
router.get('/search', rateLimiter, doctorController.searchDoctors);

/**
 * @route   GET /api/doctors/suggestions
 * @desc    Obtenir des suggestions de recherche
 * @access  Public
 */
router.get('/suggestions', rateLimiter, doctorController.getSearchSuggestions);

/**
 * @route   GET /api/doctors/popular
 * @desc    Obtenir les médecins populaires
 * @access  Public
 */
router.get('/popular', rateLimiter, doctorController.getPopularDoctors);

/**
 * @route   GET /api/doctors/specialties
 * @desc    Obtenir la liste des spécialités
 * @access  Public
 */
router.get('/specialties', rateLimiter, doctorController.getSpecialties);

/**
 * @route   GET /api/doctors/:id
 * @desc    Obtenir les détails d'un médecin
 * @access  Public
 */
router.get('/:id', rateLimiter, doctorController.getDoctorDetails);

module.exports = router;