// src/config/database.js
const { PrismaClient } = require('@prisma/client');
const config = require('./environment');

// Initialisation de Prisma Client
const prisma = new PrismaClient();

// Test de connexion à PostgreSQL
const connectPostgreSQL = async () => {
  try {
    await prisma.$connect();
    console.log(' PostgreSQL connectée avec succès via Prisma');
  } catch (error) {
    console.error(' Échec de la connexion à PostgreSQL :', error.message);
    process.exit(1);
  }
};

// Connexion à MongoDB (inchangée)
const connectMongoDB = async () => {
  const mongoose = require('mongoose'); // On importe ici pour éviter le chargement inutile
  try {
    await mongoose.connect(config.mongodb.uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(' MongoDB connectée avec succès');
  } catch (error) {
    console.error(' Erreur de connexion MongoDB :', error.message);
    process.exit(1);
  }
};

// Synchronisation des modèles (inutile avec Prisma, mais on garde un placeholder)
const syncPostgreSQL = async (force = false) => {
  if (force) {
    console.warn('Prisma ne supporte pas le "force sync" comme Sequelize. Utilise `prisma migrate` ou `prisma db push`.');
  }
  console.log(' Modèles PostgreSQL gérés via Prisma Migrate / db push (pas de sync ici)');
};

// Fermeture des connexions
const closeConnections = async () => {
  try {
    await prisma.$disconnect();
    await require('mongoose').disconnect();
    console.log('🔌 Connexions fermées proprement');
  } catch (error) {
    console.error(' Erreur lors de la fermeture des connexions :', error.message);
  }
};

// Initialisation des bases de données
const initializeDatabases = async () => {
  try {
    console.log('🚀 Initialisation des bases de données...');

    // Connexion à PostgreSQL via Prisma
    await connectPostgreSQL();

    // Connexion à MongoDB
    await connectMongoDB();

    // Sync (juste pour info)
    if (config.nodeEnv === 'development') {
      await syncPostgreSQL();
    }

    console.log(' Bases de données initialisées avec succès');
  } catch (error) {
    console.error(' Échec de l\'initialisation des bases de données :', error.message);
    process.exit(1);
  }
};

// Gestion des événements MongoDB
const mongoose = require('mongoose');
mongoose.connection.on('error', (error) => {
  console.error(' Erreur MongoDB :', error.message);
});

mongoose.connection.on('disconnected', () => {
  console.log('🔌 MongoDB déconnectée');
});

// Gestion de la fermeture gracieuse
process.on('SIGINT', async () => {
  console.log('\n Arrêt du serveur... (SIGINT)');
  await closeConnections();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n Arrêt du serveur... (SIGTERM)');
  await closeConnections();
  process.exit(0);
});

module.exports = {
  prisma, // Pour utiliser Prisma dans les modèles/controllers
  mongoose,
  connectPostgreSQL,
  connectMongoDB,
  syncPostgreSQL,
  initializeDatabases,
  closeConnections,
};