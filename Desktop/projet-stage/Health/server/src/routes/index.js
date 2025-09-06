// src/routes/index.js - Version corrigée
const express = require('express');
const router = express.Router();

console.log('🔍 Début du chargement des routes principales...');

// Health check route (simple et toujours fonctionnelle)
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Health API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  });
});

console.log('✅ Route /health ajoutée');

// API info route
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to Health API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      doctors: '/api/doctors',
      patients: '/api/patients',
      appointments: '/api/appointments',
      medicalRecords: '/api/medical-records',
      admin: '/api/admin',
      upload: '/api/upload'
    },
    documentation: 'https://api-docs.health.com'
  });
});

console.log('✅ Route / ajoutée');

// Import sécurisé des routes - TEST UNE PAR UNE
const importRoutesSafely = () => {
  // 1. Routes d'authentification (on sait qu'elles marchent)
  try {
    console.log('🔍 Import des routes auth...');
    const authRoutes = require('./auth');
    router.use('/auth', authRoutes);
    console.log('✅ Routes auth montées avec succès');
  } catch (error) {
    console.error('❌ Erreur routes auth:', error.message);
  }

  // 2. Routes doctors - TEST PROGRESSIF
  try {
    console.log('🔍 Import des routes doctors...');
    const doctorsRoutes = require('./doctors');
    router.use('/doctors', doctorsRoutes);
    console.log('✅ Routes doctors montées avec succès');
  } catch (error) {
    console.error('❌ Erreur routes doctors:', error.message);
  }

  // 3. Routes patients - COMMENTÉ POUR TEST
  /*
  try {
    console.log('🔍 Import des routes patients...');
    const patientsRoutes = require('./patients');
    router.use('/patients', patientsRoutes);
    console.log('✅ Routes patients montées avec succès');
  } catch (error) {
    console.error('❌ Erreur routes patients:', error.message);
  }
  */

  // 4. Routes appointments - COMMENTÉ POUR TEST
  /*
  try {
    console.log('🔍 Import des routes appointments...');
    const appointmentsRoutes = require('./appointments');
    router.use('/appointments', appointmentsRoutes);
    console.log('✅ Routes appointments montées avec succès');
  } catch (error) {
    console.error('❌ Erreur routes appointments:', error.message);
  }
  */

  // 5. Routes medical records - COMMENTÉ POUR TEST
  /*
  try {
    console.log('🔍 Import des routes medicalRecords...');
    const medicalRecordsRoutes = require('./medicalRecords');
    router.use('/medical-records', medicalRecordsRoutes);
    console.log('✅ Routes medical-records montées avec succès');
  } catch (error) {
    console.error('❌ Erreur routes medical-records:', error.message);
  }
  */

  // 6. Routes admin - COMMENTÉ POUR TEST
  /*
  try {
    console.log('🔍 Import des routes admin...');
    const adminRoutes = require('./admin');
    router.use('/admin', adminRoutes);
    console.log('✅ Routes admin montées avec succès');
  } catch (error) {
    console.error('❌ Erreur routes admin:', error.message);
  }
  */

  // 7. Routes upload - COMMENTÉ POUR TEST
  /*
  try {
    console.log('🔍 Import des routes upload...');
    const uploadRoutes = require('./upload');
    router.use('/upload', uploadRoutes);
    console.log('✅ Routes upload montées avec succès');
  } catch (error) {
    console.error('❌ Erreur routes upload:', error.message);
  }
  */
};

// Exécuter l'import des routes
importRoutesSafely();

console.log('🏁 Fin du chargement des routes principales');

module.exports = router;