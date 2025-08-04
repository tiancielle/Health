const http = require('http');
const app = require('./app');
const config = require('./config/environment');

const server = http.createServer(app);

const startServer = async () => {
  try {
    await require('./config/database').initializeDatabases();
    
    server.listen(config.port, () => {
      console.log(`Serveur en cours d'exécution sur le port ${config.port}`);
      console.log(`http://localhost:${config.port}`);
      console.log(`Environnement : ${config.nodeEnv}`);
    });

    process.on('SIGINT', async () => {
      console.log('\nArrêt du serveur...');
      server.close(async () => {
        await require('./config/database').closeConnections();
        console.log('Serveur arrêté proprement.');
        process.exit(0);
      });
    });
  } catch (error) {
    console.error('Échec du démarrage du serveur :', error.message);
    process.exit(1);
  }
};

startServer();