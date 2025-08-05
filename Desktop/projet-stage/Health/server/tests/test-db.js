// src/tests/test-db.js
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testDatabaseConnection() {
  try {
    console.log(' Test de connexion à la base de données...');
    
    // Test simple : compter le nombre d'utilisateurs
    const userCount = await prisma.users.count();
    console.log(' Connexion réussie à PostgreSQL');
    console.log(` Nombre d'utilisateurs dans la base : ${userCount}`);
    
  } catch (error) {
    console.error(' Échec de la connexion :', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabaseConnection();