// src/routes/patients.js
const express = require('express');
const router = express.Router();

console.log('🔍 Chargement des routes patients...');

// Route de test
router.get('/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Patients routes are working',
    service: 'patients'
  });
});

// Placeholder pour les routes à venir
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Patients service',
    status: 'Under development',
    availableEndpoints: ['/test']
  });
});

console.log('✅ Routes patients chargées (mode développement)');

module.exports = router;