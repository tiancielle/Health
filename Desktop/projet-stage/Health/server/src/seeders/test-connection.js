// server/src/seeders/test-connection.js
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log('🔍 Test de connexion à la base de données...');
    
    // Test basique
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Connexion réussie:', result);
    
    // Test des tables existantes
    console.log('📋 Vérification des tables...');
    
    try {
      const userCount = await prisma.user.count();
      console.log('✅ Table users - Nombre d\'enregistrements:', userCount);
    } catch (error) {
      console.log('❌ Table users introuvable:', error.message);
    }
    
    try {
      const doctorCount = await prisma.doctor.count();
      console.log('✅ Table doctors - Nombre d\'enregistrements:', doctorCount);
    } catch (error) {
      console.log('❌ Table doctors introuvable:', error.message);
    }
    
    // Liste des tables dans la base
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    console.log('📋 Tables existantes:', tables);
    
  } catch (error) {
    console.error('❌ Erreur de connexion:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();