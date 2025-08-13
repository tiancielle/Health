// server/src/seeders/check-existing-data.js
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkExistingData() {
  try {
    console.log('🔍 Vérification des données dans Health_DataBase...');
    
    // Vérifier les tables existantes
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `;
    
    console.log('📋 Tables disponibles:', tables.map(t => t.table_name));
    
    // Vérifier les utilisateurs
    try {
      const userCount = await prisma.user.count();
      console.log(`👥 Utilisateurs: ${userCount}`);
      
      if (userCount > 0) {
        const sampleUsers = await prisma.user.findMany({
          take: 3,
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true
          }
        });
        console.log('👤 Exemples d\'utilisateurs:', sampleUsers);
      }
    } catch (error) {
      console.log('❌ Impossible de lire la table users:', error.message);
    }
    
    // Vérifier les médecins
    try {
      const doctorCount = await prisma.doctor.count();
      console.log(`🩺 Médecins: ${doctorCount}`);
      
      if (doctorCount > 0) {
        const sampleDoctors = await prisma.doctor.findMany({
          take: 3,
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true
              }
            }
          }
        });
        
        console.log('🩺 Exemples de médecins:');
        sampleDoctors.forEach(doctor => {
          console.log(`  - Dr. ${doctor.user?.firstName} ${doctor.user?.lastName} (${doctor.specialty})`);
        });
      }
    } catch (error) {
      console.log('❌ Impossible de lire la table doctors:', error.message);
    }
    
    // Si pas de données, vérifier les tables existantes avec une autre approche
    if (tables.length === 0) {
      console.log('🔍 Recherche de tables avec des noms différents...');
      const allTables = await prisma.$queryRaw`
        SELECT schemaname, tablename 
        FROM pg_tables 
        WHERE schemaname NOT IN ('information_schema', 'pg_catalog')
        ORDER BY schemaname, tablename
      `;
      console.log('📋 Toutes les tables:', allTables);
    }
    
  } catch (error) {
    console.error('❌ Erreur lors de la vérification:', error);
    
    if (error.message.includes('relation') && error.message.includes('does not exist')) {
      console.log('💡 Les tables Prisma n\'existent pas encore.');
      console.log('💡 Votre Health_DataBase existe mais avec une structure différente.');
      console.log('💡 Utilisez: npx prisma db push --force-reset');
    }
  } finally {
    await prisma.$disconnect();
  }
}

checkExistingData();