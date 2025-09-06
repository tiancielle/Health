// src/config/cors.js
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:3000',      // Create React App
      'http://localhost:5173',     // Vite dev server
      'http://localhost:4173',     // Vite preview
      'http://127.0.0.1:5173',     // Alternative localhost
      'http://127.0.0.1:3000',     // Alternative localhost
      process.env.FRONTEND_URL     // URL de production depuis .env
    ].filter(Boolean); // Supprime les valeurs undefined

    // En développement, autoriser les requêtes sans origin (Postman, tests)
    if (process.env.NODE_ENV === 'development' && !origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`CORS: Origine refusée: ${origin}`);
      console.log('Origines autorisées:', allowedOrigins);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
    'Cache-Control'
  ],
  exposedHeaders: ['Authorization'],
  optionsSuccessStatus: 200,
  preflightContinue: false
};

module.exports = corsOptions;