// src/middleware/validation.js
const { body, query, param, validationResult } = require('express-validator');

// Middleware pour vérifier les résultats de validation
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Données invalides',
      errors: errors.array(),
    });
  }
  next();
};

// Validation pour l'inscription
const validateRegister = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Adresse email invalide')
    .isLength({ max: 255 })
    .withMessage('L’email ne doit pas dépasser 255 caractères'),

  body('password')
    .isLength({ min: 8 })
    .withMessage('Le mot de passe doit contenir au moins 8 caractères')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage(
      'Le mot de passe doit contenir au moins une minuscule, une majuscule, un chiffre et un caractère spécial'
    )
    .isLength({ max: 128 })
    .withMessage('Le mot de passe ne doit pas dépasser 128 caractères'),

  body('firstName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Le prénom doit contenir entre 2 et 50 caractères')
    .matches(/^[a-zA-ZÀ-ÿ\s-']+$/)
    .withMessage('Le prénom ne peut contenir que des lettres, espaces, tirets et apostrophes'),

  body('lastName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Le nom doit contenir entre 2 et 50 caractères')
    .matches(/^[a-zA-ZÀ-ÿ\s-']+$/)
    .withMessage('Le nom ne peut contenir que des lettres, espaces, tirets et apostrophes'),

  body('role')
    .optional()
    .isIn(['patient', 'doctor', 'admin'])
    .withMessage('Rôle invalide'),

  body('phone')
    .optional({ nullable: true })
    .isMobilePhone('fr-FR', { strictMode: false })
    .withMessage('Numéro de téléphone invalide')
    .isLength({ max: 20 })
    .withMessage('Le numéro de téléphone est trop long'),

  body('dateOfBirth')
    .optional({ nullable: true })
    .isISO8601({ strict: true })
    .toDate()
    .custom((value) => {
      const today = new Date();
      const minDate = new Date(today.getFullYear() - 120, today.getMonth(), today.getDate());
      const maxDate = new Date(today.getFullYear() - 13, today.getMonth(), today.getDate());

      if (value > maxDate) {
        throw new Error('Vous devez avoir au moins 13 ans pour vous inscrire');
      }
      if (value < minDate) {
        throw new Error('Date de naissance invalide (âge supérieur à 120 ans)');
      }
      return true;
    }),

  body('gender')
    .optional()
    .isIn(['male', 'female'])
    .withMessage('Genre invalide'),
];

// Validation pour la connexion
const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email invalide'),

  body('password')
    .isLength({ min: 1 })
    .withMessage('Le mot de passe est requis'),
];

// Validation pour la mise à jour du profil
const validateUpdateProfile = [
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Le prénom doit contenir entre 2 et 50 caractères')
    .matches(/^[a-zA-ZÀ-ÿ\s-']+$/)
    .withMessage('Le prénom ne peut contenir que des lettres, espaces, tirets et apostrophes'),

  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Le nom doit contenir entre 2 et 50 caractères')
    .matches(/^[a-zA-ZÀ-ÿ\s-']+$/)
    .withMessage('Le nom ne peut contenir que des lettres, espaces, tirets et apostrophes'),

  body('phone')
    .optional({ nullable: true })
    .isMobilePhone('fr-FR', { strictMode: false })
    .withMessage('Numéro de téléphone invalide'),

  body('dateOfBirth')
    .optional({ nullable: true })
    .isISO8601({ strict: true })
    .toDate()
    .custom((value) => {
      const today = new Date();
      const minDate = new Date(today.getFullYear() - 120, today.getMonth(), today.getDate());
      const maxDate = new Date(today.getFullYear() - 13, today.getMonth(), today.getDate());

      if (value > maxDate) {
        throw new Error('Vous devez avoir au moins 13 ans');
      }
      if (value < minDate) {
        throw new Error('Date de naissance invalide');
      }
      return true;
    }),

  body('gender')
    .optional()
    .isIn(['male', 'female'])
    .withMessage('Genre invalide'),
];

// Validation pour la réinitialisation de mot de passe
const validateResetPassword = [
  body('password')
    .isLength({ min: 8 })
    .withMessage('Le mot de passe doit contenir au moins 8 caractères')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage(
      'Le mot de passe doit contenir au moins une minuscule, une majuscule, un chiffre et un caractère spécial'
    ),
];

// Validation pour le changement de mot de passe (avec ancien mot de passe)
const validateChangePassword = [
  ...validateResetPassword,
  body('currentPassword')
    .exists()
    .withMessage('Le mot de passe actuel est requis'),
];

// Validation pour la demande de réinitialisation (email)
const validateForgotPassword = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email invalide'),
];

// Validation pour vérifier la disponibilité d’un email
const validateEmailAvailability = [
  query('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email invalide'),
];

// Validation pour l’ID utilisateur
const validateUserId = [
  param('userId')
    .isUUID()
    .withMessage('ID utilisateur invalide'),
];

// Validation pour le token dans l'URL
const validateToken = [
  param('token')
    .exists()
    .withMessage('Token requis')
    .isString()
    .isLength({ min: 64, max: 128 })
    .withMessage('Token invalide'),
];

module.exports = {
  validate,
  validateRegister,
  validateLogin,
  validateUpdateProfile,
  validateResetPassword,
  validateChangePassword,
  validateForgotPassword,
  validateEmailAvailability,
  validateUserId,
  validateToken,
};