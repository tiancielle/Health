
// src/routes/upload.js
const express = require('express');
const router = express.Router();

console.log('🔍 Chargement des routes upload...');

// Route de test
router.get('/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Upload routes are working',
    service: 'upload'
  });
});

// Placeholder pour les routes à venir
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Upload service',
    status: 'Under development',
    availableEndpoints: ['/test']
  });
});

console.log('✅ Routes upload chargées (mode développement)');

module.exports = router;