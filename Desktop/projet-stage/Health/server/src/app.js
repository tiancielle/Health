// server/src/app.js
const express = require('express');
const cors = require('cors');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '../.env') });

const app = express();

// CORS
app.use(cors());

// Parser le body
app.use(express.json());

// Route de test
app.use('/api/doctors', require('./routes/doctors'));

// Route de base
app.get('/', (req, res) => {
  res.json({ message: 'Health API running' });
});

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

module.exports = app;


