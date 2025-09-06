
// src/routes/medicalRecords.js
const express = require('express');
const router = express.Router();

console.log('🔍 Chargement des routes medicalRecords...');

// Route de test
router.get('/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Medical records routes are working',
    service: 'medicalRecords'
  });
});

// Placeholder pour les routes à venir
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Medical records service',
    status: 'Under development',
    availableEndpoints: ['/test']
  });
});

console.log('✅ Routes medicalRecords chargées (mode développement)');

module.exports = router;
