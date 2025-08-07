// // src/app.js
// const express = require('express');
// const cors = require('cors');
// const helmet = require('helmet');
// const morgan = require('morgan');
// const rateLimit = require('express-rate-limit');
// const path = require('path');
// const apiRoutes = require('./routes');

// // Charger les variables d'environnement
// require('dotenv').config({ path: path.join(__dirname, '../config/.env') });

// // Configurations
// const config = require('./config/environment');
// const { initializeDatabases } = require('./config/database');

// // Routes
// const authRoutes = require('./routes/auth');
// const patientRoutes = require('./routes/patients');
// const doctorRoutes = require('./routes/doctors');
// const appointmentRoutes = require('./routes/appointments');
// const medicalRecordsRoutes = require('./routes/medicalRecords');
// const adminRoutes = require('./routes/admin');
// const uploadRoutes = require('./routes/upload');

// // Middlewares
// const { errorHandler, logAuthAttempt } = require('./middleware/errorHandler');
// const { authenticateToken } = require('./middleware/auth');
// const rateLimiter = require('./middleware/rateLimiter');

// // Initialisation Express
// const app = express();

// // Middlewares de base
// app.use(helmet({ contentSecurityPolicy: false })); // Sécurité HTTP
// app.use(cors({ origin: config.cors.allowedOrigins })); // CORS
// app.use(rateLimiter); // Limite générale
// app.use(morgan('dev')); // Logs des requêtes
// app.use(logAuthAttempt); // Log des échecs d'auth

// // Parser le body
// app.use(express.json({ limit: '10mb' }));
// app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// // Dossier des uploads (fichiers statiques)
// app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

// // === Routes publiques ===
// app.use('/api/auth', authRoutes);


// // === Routes protégées ===
// // app.use('/api/patients', authenticateToken, patientRoutes);
// app.use('/api/doctors', doctorRoutes);
// // app.use('/api/appointments', authenticateToken, appointmentRoutes);
// // app.use('/api/medical-records', authenticateToken, medicalRecordsRoutes);
// // app.use('/api/admin', authenticateToken, require('./middleware/roleCheck')('admin'), adminRoutes);
// // app.use('/api/upload', authenticateToken, uploadRoutes);

// // Route de base
// app.get('/', (req, res) => {
//   res.json({ message: 'Welcome to Health API', version: '1.0.0' });
// });

// // Gestion des routes non trouvées
// app.use('*', (req, res) => {
//   res.status(404).json({
//     success: false,
//     message: 'Route non trouvée',
//   });
// });

// // Gestion des erreurs
// app.use(errorHandler);

// module.exports = app;

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


// INSERT INTO public.doctors(
// 	id, "userId", "licenseNumber", "specialtyId", "yearsExperience", education, certifications, languages, "consultationFee", biography, "officeAddress", "isVerified", "isAvailable", "createdAt", "updatedAt")
// 	VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);

// INSERT INTO public.patients(
// 	id, "userId", "bloodType", allergies, "chronicDiseases", "emergencyContact", "insuranceInfo", "medicalRecords", "createdAt", "updatedAt")
// 	VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
// INSERT INTO public.users(
// 	id, email, password, role, "firstName", "lastName", phone, "dateOfBirth", gender, "profilePicture", "isEmailVerified", "isActive", "lastLoginAt", "emailVerificationToken", "emailVerificationExpires", "passwordResetToken", "passwordResetExpires", "refreshToken", "refreshTokenExpires", "loginAttempts", "lockUntil", "twoFactorSecret", "twoFactorEnabled", "createdAt", "updatedAt", "deletedAt")
// 	VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
// avec la meme architechture, essayons de crrer une petite base de donnes, 3medecins, deux specialité et 4 troubles, users, appointment et deux patinents
// il n est pas necessaire de mettre tute les entites