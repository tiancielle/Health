// src/app.js - Version corrigée
const express = require('express');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Import middleware
const { globalErrorHandler, handleNotFound } = require('./middleware/errorHandler');
const config = require('./config/environment');

const app = express();

console.log('✅ Express app créée');

// ======================
// MIDDLEWARES DE BASE (ordre critique)
// ======================

// 1. Parsing du body AVANT les autres middlewares
app.use(express.json({ 
  limit: '10mb',
  strict: true
}));
app.use(express.urlencoded({ 
  extended: true,
  limit: '10mb'
}));

console.log('✅ Body parsers configurés');

// 2. Cookie parser
const cookieParser = require('cookie-parser');
app.use(cookieParser());

console.log('✅ Cookie parser configuré');

// 3. CORS AVANT les routes (configuration simplifiée)
// const cors = require('cors');
// app.use(cors({
//   origin: process.env.FRONTEND_URL || 'http://localhost:3000',
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
// }));
// 3. CORS AVANT les routes (configuration finale)
const cors = require('cors');

const corsOptions = {
  origin: [
    'http://localhost:3000',      // Create React App
    'http://localhost:5173',     // Vite dev server (votre cas)
    'http://localhost:4173',     // Vite preview
    'http://127.0.0.1:5173',     // Alternative localhost
    'http://127.0.0.1:3000'      // Alternative localhost
  ],
  credentials: true, // CRITIQUE pour withCredentials côté frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With',
    'Accept',
    'Origin'
  ],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

console.log('✅ CORS configuré pour:', corsOptions.origin);

// const cors = require('cors');
// const corsOptions = require('./config/cors');

app.use(cors(corsOptions));

console.log('✅ CORS configuré');

// 4. Logging (configuration simplifiée)
if (process.env.NODE_ENV === 'development') {
  const morgan = require('morgan');
  app.use(morgan('dev'));
  console.log('✅ Morgan (dev) configuré');
}

// 5. Sécurité basique (helmet simplifié)
const helmet = require('helmet');
app.use(helmet({
  contentSecurityPolicy: false, // Désactivé pour éviter les conflits
  crossOriginEmbedderPolicy: false
}));

console.log('✅ Helmet (simplifié) configuré');

// ======================
// STATIC FILES
// ======================
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

console.log('✅ Static files configurés');

// ======================
// API ROUTES (après tous les middlewares de base)
// ======================
try {
  console.log('🔍 Import des routes principales...');
  const routes = require('./routes');
  app.use('/api', routes);
  console.log('✅ Routes API montées sur /api');
} catch (error) {
  console.error('❌ Erreur lors de l\'import des routes:', error.message);
  
  // Route de fallback en cas d'erreur
  app.use('/api', (req, res) => {
    res.status(500).json({
      success: false,
      message: 'API temporairement indisponible',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  });
}

// ======================
// ROOT ENDPOINT
// ======================
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Health API is running',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      doctors: '/api/doctors',
      patients: '/api/patients',
      appointments: '/api/appointments'
    },
    documentation: 'https://api-docs.health.com'
  });
});

console.log('✅ Route racine configurée');

// ======================
// ERROR HANDLING (temporairement désactivé pour debug)
// ======================

// Handle 404 for unmatched routes - VERSION SIMPLE
app.use((req, res, next ) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    method: req.method
  });
});

// Global error handler - VERSION SIMPLE
app.use((err, req, res, next) => {
  console.error('Global error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { error: err.message })
  });
});

console.log('✅ Gestionnaires d\'erreur simplifiés configurés');

// ======================
// GRACEFUL SHUTDOWN
// ======================
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED PROMISE REJECTION! 💥 Shutting down...');
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);
  process.exit(1);
});

module.exports = app;