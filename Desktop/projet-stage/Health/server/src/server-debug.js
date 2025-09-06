// src/server-debug.js - Version pour isoler le problème path-to-regexp
require('dotenv').config();
const express = require('express');

const app = express();

console.log('✅ Express app créée');

// Test 1: Middlewares de base un par un
try {
  console.log('🔍 Test: express.json()...');
  app.use(express.json({ limit: '10mb' }));
  console.log('✅ express.json() OK');
} catch (error) {
  console.error('❌ Erreur express.json():', error.message);
}

try {
  console.log('🔍 Test: express.urlencoded()...');
  app.use(express.urlencoded({ extended: true }));
  console.log('✅ express.urlencoded() OK');
} catch (error) {
  console.error('❌ Erreur express.urlencoded():', error.message);
}

try {
  console.log('🔍 Test: cookieParser...');
  const cookieParser = require('cookie-parser');
  app.use(cookieParser());
  console.log('✅ cookieParser OK');
} catch (error) {
  console.error('❌ Erreur cookieParser:', error.message);
}

// Route de test simple
app.get('/test', (req, res) => {
  res.json({ success: true, message: 'Server test OK' });
});
console.log('✅ Route test ajoutée');

// Test 2: Import des routes (là où l'erreur se produit probablement)
try {
  console.log('🔍 Test: Import des routes...');
  const routes = require('./routes/index');
  console.log('✅ Routes importées');
  
  console.log('🔍 Test: Montage des routes...');
  app.use('/api', routes);
  console.log('✅ Routes montées');
  
} catch (error) {
  console.error('❌ Erreur routes:', error.message);
  console.error('Stack:', error.stack);
}

// Test 3: Middlewares potentiellement problématiques (APRÈS les routes)
try {
  console.log('🔍 Test: CORS...');
  const cors = require('cors');
  // Ne pas appliquer CORS car les routes sont déjà montées
  console.log('✅ CORS importé (non appliqué)');
} catch (error) {
  console.error('❌ Erreur CORS:', error.message);
}

try {
  console.log('🔍 Test: Helmet...');
  const helmet = require('helmet');
  // Ne pas appliquer helmet car les routes sont déjà montées
  console.log('✅ Helmet importé (non appliqué)');
} catch (error) {
  console.error('❌ Erreur Helmet:', error.message);
}

try {
  console.log('🔍 Test: Morgan...');
  const morgan = require('morgan');
  // Ne pas appliquer morgan car les routes sont déjà montées
  console.log('✅ Morgan importé (non appliqué)');
} catch (error) {
  console.error('❌ Erreur Morgan:', error.message);
}

console.log('🔍 Avant le listen...');

const PORT = process.env.PORT || 5000;

try {
  app.listen(PORT, () => {
    console.log('🚀 Serveur démarré sur le port', PORT);
    console.log('📝 Test: http://localhost:' + PORT + '/test');
    console.log('🏥 API: http://localhost:' + PORT + '/api/health');
  });
} catch (error) {
  console.error('❌ Erreur app.listen():', error.message);
  console.error('Stack:', error.stack);
}

console.log('🔍 Après le listen...');