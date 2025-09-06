// src/routes/index.js
const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./auth');
// const doctorsRoutes = require('./doctors');
// const patientsRoutes = require('./patients');
// const appointmentsRoutes = require('./appointments');
// const medicalRecordsRoutes = require('./medicalRecords');
// const adminRoutes = require('./admin');
// const uploadRoutes = require('./upload');

// Health check route
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Health API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  });
});

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

// Route modules
router.use('/auth', authRoutes);

// Temporarily comment out other routes until they're implemented
// router.use('/doctors', doctorsRoutes);
// router.use('/patients', patientsRoutes);
// router.use('/appointments', appointmentsRoutes);
// router.use('/medical-records', medicalRecordsRoutes);
// router.use('/admin', adminRoutes);
// router.use('/upload', uploadRoutes);

module.exports = router;