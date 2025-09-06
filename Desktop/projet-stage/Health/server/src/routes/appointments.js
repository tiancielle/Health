
// src/routes/appointments.js
const express = require('express');
const router = express.Router();

console.log('🔍 Chargement des routes appointments...');

// Route de test
router.get('/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Appointments routes are working',
    service: 'appointments'
  });
});

// Placeholder pour les routes à venir
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Appointments service',
    status: 'Under development',
    availableEndpoints: ['/test']
  });
});

console.log('✅ Routes appointments chargées (mode développement)');

module.exports = router;