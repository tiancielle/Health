// server/src/middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
  console.error(' Erreur serveur:', err.stack);
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: err.message || 'Erreur serveur interne',
  });
};

const logAuthAttempt = (req, res, next) => {
  if (req.path === '/api/auth/login' && req.method === 'POST') {
    console.log(`🔐 Tentative de connexion: ${req.body.email}`);
  }
  next();
};

module.exports = { errorHandler, logAuthAttempt };