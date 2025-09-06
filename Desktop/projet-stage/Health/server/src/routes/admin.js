
// src/routes/admin.js
const express = require('express');
const router = express.Router();

console.log('🔍 Chargement des routes admin...');

// Route de test
router.get('/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Admin routes are working',
    service: 'admin'
  });
});

// Placeholder pour les routes à venir
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Admin service',
    status: 'Under development',
    availableEndpoints: ['/test']
  });
});

console.log('✅ Routes admin chargées (mode développement)');

module.exports = router;