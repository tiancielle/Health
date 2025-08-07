// server/src/middleware/rateLimiter.js
const rateLimit = require('express-rate-limit');

const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limite chaque IP à 100 requêtes par fenêtre
  message: {
    error: 'Trop de requêtes depuis cette IP, réessayez plus tard.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = rateLimiter;