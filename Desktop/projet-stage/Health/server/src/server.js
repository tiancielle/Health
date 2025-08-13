// server/src/server.js
const http = require('http');
const app = require('./app');
const config = require('./config/environment');
const { initializeDatabases } = require('./config/database');

const PORT = process.env.PORT || 5000;

// Fonction pour démarrer le serveur avec initialisation des bases de données
const startServer = async () => {
  try {
    // ✅ Initialiser les bases de données avant de démarrer le serveur
    console.log('🔄 Initialisation des bases de données...');
    await initializeDatabases();
    
    // ✅ Démarrer le serveur HTTP
    const server = http.createServer(app);
    
    server.listen(PORT, () => {
      console.log(`🚀 Serveur en cours d'exécution sur le port ${PORT}`);
      console.log(`🌐 URL: http://localhost:${PORT}`);
      console.log(`🛠️  Environnement: ${process.env.NODE_ENV || 'development'}`);
    });

    // ✅ Gestion gracieuse de l'arrêt du serveur
    process.on('SIGINT', async () => {
      console.log('\n⏹️  Arrêt du serveur... (SIGINT)');
      server.close(async () => {
        try {
          await require('./config/database').closeConnections();
          console.log('✅ Serveur arrêté proprement.');
          process.exit(0);
        } catch (error) {
          console.error('❌ Erreur lors de l\'arrêt:', error.message);
          process.exit(1);
        }
      });
    });

    process.on('SIGTERM', async () => {
      console.log('\n⏹️  Arrêt du serveur... (SIGTERM)');
      server.close(async () => {
        try {
          await require('./config/database').closeConnections();
          console.log('✅ Serveur arrêté proprement.');
          process.exit(0);
        } catch (error) {
          console.error('❌ Erreur lors de l\'arrêt:', error.message);
          process.exit(1);
        }
      });
    });

  } catch (error) {
    console.error('❌ Échec du démarrage du serveur:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
};

// Démarrer le serveur
startServer();