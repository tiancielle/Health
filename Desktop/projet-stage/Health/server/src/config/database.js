// src/config/database.js
const { PrismaClient } = require('@prisma/client');

// Initialisation de Prisma Client
const prisma = new PrismaClient();

// Test de connexion à PostgreSQL
const connectPostgreSQL = async () => {
  try {
    await prisma.$connect();
    console.log('✅ PostgreSQL connectée avec succès via Prisma');
    return true;
  } catch (error) {
    console.error('❌ Échec de la connexion à PostgreSQL :', error.message);
    throw error;
  }
};

// Synchronisation des modèles (placeholder pour Prisma)
const syncPostgreSQL = async (force = false) => {
  if (force) {
    console.warn('⚠️ Prisma ne supporte pas le "force sync". Utilisez `prisma migrate` ou `prisma db push`.');
  }
  console.log('✅ Modèles PostgreSQL gérés via Prisma Migrate');
};

// Fermeture des connexions
const closeConnections = async () => {
  try {
    await prisma.$disconnect();
    console.log('🔌 Connexions fermées proprement');
  } catch (error) {
    console.error('❌ Erreur lors de la fermeture des connexions :', error.message);
  }
};

// Initialisation des bases de données (PostgreSQL uniquement)
const initializeDatabases = async () => {
  try {
    console.log('🚀 Initialisation des bases de données...');

    // Connexion à PostgreSQL via Prisma
    await connectPostgreSQL();

    // Test de la base de données
    await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Test de connexion PostgreSQL réussi');

    console.log('✅ Bases de données initialisées avec succès');
    return true;
  } catch (error) {
    console.error('❌ Échec de l\'initialisation des bases de données :', error.message);
    throw error;
  }
};

// Fonction utilitaire pour vérifier la connexion
const isReady = async () => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.error('❌ Test de connexion échoué:', error.message);
    return false;
  }
};

module.exports = {
  prisma,
  connectPostgreSQL,
  syncPostgreSQL,
  initializeDatabases,
  closeConnections,
  isReady
};