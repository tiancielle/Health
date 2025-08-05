// src/routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { 
  validateRegister, 
  validateLogin, 
  validate, 
  validateForgotPassword,
  validateResetPassword,
  validateToken,
  validateChangePassword  
} = require('../middleware/validation');

router.post('/register', validateRegister, validate, authController.register);
router.post('/login', validateLogin, validate, authController.login);
router.post('/forgot-password', validateForgotPassword, validate, authController.forgotPassword);
router.post('/reset-password/:token', validateToken, validateResetPassword, validate, authController.resetPassword);
router.post('/change-password', /* auth middleware */ validateChangePassword, validate, authController.changePassword);

module.exports = router;