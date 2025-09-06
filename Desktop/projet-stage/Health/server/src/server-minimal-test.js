// src/server-minimal-test.js - Test ultra minimal
require('dotenv').config();
const express = require('express');

const app = express();

console.log('Express app créée');

// Middlewares de base uniquement
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// UNE SEULE ROUTE pour isoler le problème
app.get('/test', (req, res) => {
  res.json({ success: true, message: 'Test OK' });
});

console.log('Route de test ajoutée');

// Import SEULEMENT les routes auth (pas les autres)
try {
  console.log('Import auth seulement...');
  const authRoutes = require('./routes/auth');
  app.use('/api/auth', authRoutes);
  console.log('Auth routes montées');
} catch (error) {
  console.error('Erreur auth:', error.message);
}

console.log('Avant listen...');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('Serveur démarré sur le port', PORT);
});

console.log('Après listen...');