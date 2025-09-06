// src/middleware/validation.js
const { body, validationResult } = require('express-validator');

// Middleware pour vérifier les erreurs de validation
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// Validation pour l'inscription des utilisateurs
const validateUserRegistration = [
  body('firstName')
    .notEmpty()
    .withMessage('First name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters')
    .matches(/^[a-zA-ZÀ-ÿ\s'-]+$/)
    .withMessage('First name can only contain letters, spaces, hyphens and apostrophes'),

  body('lastName')
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters')
    .matches(/^[a-zA-ZÀ-ÿ\s'-]+$/)
    .withMessage('Last name can only contain letters, spaces, hyphens and apostrophes'),

  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail()
    .isLength({ max: 255 })
    .withMessage('Email must not exceed 255 characters'),

  body('dateOfBirth')
    .isISO8601()
    .withMessage('Please provide a valid date of birth (YYYY-MM-DD)')
    .custom((value) => {
      const birthDate = new Date(value);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 13 || age > 120) {
        throw new Error('Age must be between 13 and 120 years');
      }
      return true;
    }),

  // ✅ CORRECTION : Role validation pour patients uniquement
  body('role')
    .optional()
    .isIn(['patient'])  // Inscription uniquement pour patients
    .withMessage('Role must be patient'),

  // ✅ CORRECTION : Password validation simplifiée
  body('password')
    .isLength({ min: 8, max: 128 })
    .withMessage('Password must be between 8 and 128 characters'),

  body('phoneNumber')
    .optional()
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),

  body('address')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Address must not exceed 500 characters'),

  // ✅ CORRECTION : Gender validation en minuscules
  body('gender')
    .optional()
    .isIn(['male', 'female'])  // Seulement male et female
    .withMessage('Gender must be male or female'),

  handleValidationErrors
];

// Validation pour la connexion
const validateUserLogin = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('Password is required'),

  handleValidationErrors
];

// Validation pour la mise à jour du profil utilisateur
const validateUserUpdate = [
  body('firstName')
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters')
    .matches(/^[a-zA-ZÀ-ÿ\s'-]+$/)
    .withMessage('First name can only contain letters, spaces, hyphens and apostrophes'),

  body('lastName')
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters')
    .matches(/^[a-zA-ZÀ-ÿ\s'-]+$/)
    .withMessage('Last name can only contain letters, spaces, hyphens and apostrophes'),

  body('email')
    .optional()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail()
    .isLength({ max: 255 })
    .withMessage('Email must not exceed 255 characters'),

  body('phoneNumber')
    .optional()
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),

  body('address')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Address must not exceed 500 characters'),

  body('gender')
    .optional()
    .isIn(['male', 'female'])
    .withMessage('Gender must be male or female'),

  handleValidationErrors
];

// Validation pour les recherches de médecins
const validateDoctorSearch = [
  body('speciality')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Speciality must be between 2 and 100 characters'),

  body('location')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Location must be between 2 and 100 characters'),

  body('availability')
    .optional()
    .isISO8601()
    .withMessage('Availability must be a valid date'),

  handleValidationErrors
];

// Validation pour les rendez-vous
const validateAppointment = [
  body('doctorId')
    .isInt({ min: 1 })
    .withMessage('Doctor ID must be a positive integer'),

  body('appointmentDate')
    .isISO8601()
    .withMessage('Please provide a valid appointment date')
    .custom((value) => {
      const appointmentDate = new Date(value);
      const today = new Date();
      if (appointmentDate <= today) {
        throw new Error('Appointment date must be in the future');
      }
      return true;
    }),

  body('appointmentTime')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Please provide a valid time in HH:MM format'),

  body('reason')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Reason must not exceed 500 characters'),

  handleValidationErrors
];

// Validation pour les avis
const validateReview = [
  body('doctorId')
    .isInt({ min: 1 })
    .withMessage('Doctor ID must be a positive integer'),

  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),

  body('comment')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Comment must not exceed 1000 characters'),

  handleValidationErrors
];

module.exports = {
  validateUserRegistration,
  validateUserLogin,
  validateUserUpdate,
  validateDoctorSearch,
  validateAppointment,
  validateReview,
  handleValidationErrors
};