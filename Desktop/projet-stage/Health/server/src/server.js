// src/server.js - Version corrigée finale
const http = require('http');
const app = require('./app');

// Configuration du port
const PORT = process.env.PORT || 5000;

// Fonction pour démarrer le serveur
const startServer = async () => {
  try {
    console.log('🔧 Initialisation du serveur...');
    
    // Optionnel: Initialiser les bases de données
    // Décommentez si vous avez configuré les connexions DB
    /*
    console.log('🔄 Initialisation des bases de données...');
    const { initializeDatabases } = require('./config/database');
    await initializeDatabases();
    console.log('✅ Bases de données initialisées');
    */
    
    // Créer le serveur HTTP
    const server = http.createServer(app);
    
    // Démarrer le serveur
    server.listen(PORT, () => {
      console.log(`🚀 Serveur Health API démarré avec succès`);
      console.log(`🌐 URL: http://localhost:${PORT}`);
      console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`);
      console.log(`🔐 Auth: http://localhost:${PORT}/api/auth/test`);
      console.log(`👩‍⚕️ Doctors: http://localhost:${PORT}/api/doctors/test`);
      console.log(`🛠️ Environnement: ${process.env.NODE_ENV || 'development'}`);
      console.log('-----------------------------------');
    });

    // Gestion gracieuse de l'arrêt du serveur
    const gracefulShutdown = async (signal) => {
      console.log(`\n⚠️ Signal ${signal} reçu. Arrêt du serveur...`);
      
      server.close(async () => {
        try {
          // Fermer les connexions DB si nécessaire
          /*
          console.log('🔄 Fermeture des connexions DB...');
          await require('./config/database').closeConnections();
          */
          
          console.log('✅ Serveur arrêté proprement.');
          process.exit(0);
        } catch (error) {
          console.error('❌ Erreur lors de l\'arrêt:', error.message);
          process.exit(1);
        }
      });

      // Force l'arrêt après 30 secondes
      setTimeout(() => {
        console.error('❌ Arrêt forcé après timeout');
        process.exit(1);
      }, 30000);
    };

    // Gestionnaires de signaux
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

  } catch (error) {
    console.error('❌ Échec du démarrage du serveur:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
};

// Démarrer le serveur
startServer();