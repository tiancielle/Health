// server/src/seeders/import-from-health-database.js
const { PrismaClient } = require('@prisma/client');
const { Client } = require('pg');

const prisma = new PrismaClient();

// Configuration pour la base de données source (Health_DataBase)
const sourceDbConfig = {
  host: process.env.SOURCE_DB_HOST || 'localhost',
  port: process.env.SOURCE_DB_PORT || 5433, // ou le port de votre Health_DataBase
  database: 'Health_DataBase', // Nom de votre base existante
  user: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'votre_mot_de_passe'
};

async function importFromHealthDatabase() {
  const sourceClient = new Client(sourceDbConfig);
  
  try {
    console.log('🔄 Connexion à Health_DataBase...');
    await sourceClient.connect();
    console.log('✅ Connecté à Health_DataBase');

    // 1. Récupérer les médecins depuis Health_DataBase
    console.log('📋 Récupération des médecins depuis Health_DataBase...');
    
    // Adaptez cette requête selon votre structure de table existante
    const existingDoctors = await sourceClient.query(`
      SELECT 
        u.id as user_id,
        u.first_name,
        u.last_name, 
        u.email,
        u.phone,
        u.profile_image,
        d.specialty,
        d.license_number,
        d.experience_years,
        d.consultation_fee,
        d.address,
        d.city,
        d.zip_code,
        d.phone as doctor_phone,
        d.average_rating,
        d.total_reviews,
        d.is_active,
        d.is_verified,
        d.accepts_insurance,
        d.languages,
        d.education,
        d.about
      FROM users u
      INNER JOIN doctors d ON u.id = d.user_id
      WHERE u.role = 'DOCTOR' OR u.role = 'doctor'
      ORDER BY u.created_at
    `);

    console.log(`📊 ${existingDoctors.rows.length} médecins trouvés dans Health_DataBase`);

    if (existingDoctors.rows.length === 0) {
      console.log('⚠️ Aucun médecin trouvé. Vérifiez la structure de votre base de données.');
      return;
    }

    // 2. Nettoyer la base de destination
    console.log('🧹 Nettoyage de la base de destination...');
    await prisma.doctor.deleteMany();
    await prisma.user.deleteMany();

    // 3. Importer les données
    console.log('📥 Import des médecins...');
    
    for (const doctorData of existingDoctors.rows) {
      try {
        // Créer l'utilisateur
        const user = await prisma.user.create({
          data: {
            firstName: doctorData.first_name || 'Prénom',
            lastName: doctorData.last_name || 'Nom',
            email: doctorData.email || `doctor${doctorData.user_id}@example.com`,
            password: 'hashed_password_placeholder', // Vous devrez gérer les mots de passe
            role: 'DOCTOR',
            phone: doctorData.phone,
            profileImage: doctorData.profile_image,
            isActive: doctorData.is_active !== false,
            isVerified: doctorData.is_verified !== false
          }
        });

        // Créer le profil médecin
        await prisma.doctor.create({
          data: {
            userId: user.id,
            specialty: doctorData.specialty || 'Généraliste',
            licenseNumber: doctorData.license_number || `LIC${user.id}`,
            experienceYears: parseInt(doctorData.experience_years) || 5,
            consultationFee: parseFloat(doctorData.consultation_fee) || 100.0,
            address: doctorData.address,
            city: doctorData.city || 'Non spécifiée',
            zipCode: doctorData.zip_code,
            phone: doctorData.doctor_phone || doctorData.phone,
            averageRating: parseFloat(doctorData.average_rating) || 4.0,
            totalReviews: parseInt(doctorData.total_reviews) || 0,
            isActive: doctorData.is_active !== false,
            isVerified: doctorData.is_verified !== false,
            acceptsInsurance: doctorData.accepts_insurance || false,
            languages: doctorData.languages || null,
            education: doctorData.education || null,
            about: doctorData.about,
            isAvailableToday: Math.random() > 0.3 // Valeur par défaut aléatoire
          }
        });

        console.log(`✅ Importé: Dr. ${doctorData.first_name} ${doctorData.last_name} (${doctorData.specialty})`);
      } catch (error) {
        console.error(`❌ Erreur pour ${doctorData.first_name} ${doctorData.last_name}:`, error.message);
      }
    }

    // 4. Statistiques finales
    const finalUserCount = await prisma.user.count();
    const finalDoctorCount = await prisma.doctor.count();
    
    console.log('🎉 Import terminé !');
    console.log(`✅ ${finalUserCount} utilisateurs importés`);
    console.log(`✅ ${finalDoctorCount} médecins importés`);

  } catch (error) {
    console.error('❌ Erreur lors de l\'import:', error);
    console.error('Détails:', error.message);
    
    // Suggestions en cas d'erreur
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Vérifiez que Health_DataBase est accessible sur le port configuré');
    } else if (error.message.includes('column')) {
      console.log('💡 Vérifiez les noms des colonnes dans votre base Health_DataBase');
      console.log('💡 Vous devrez peut-être adapter la requête SQL selon votre structure');
    }
  } finally {
    await sourceClient.end();
    await prisma.$disconnect();
  }
}

// Fonction pour lister les tables et colonnes de Health_DataBase
async function exploreHealthDatabase() {
  const sourceClient = new Client(sourceDbConfig);
  
  try {
    console.log('🔍 Exploration de Health_DataBase...');
    await sourceClient.connect();

    // Lister les tables
    const tables = await sourceClient.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);

    console.log('📋 Tables disponibles:');
    tables.rows.forEach(table => {
      console.log(`  - ${table.table_name}`);
    });

    // Explorer la structure des tables users et doctors si elles existent
    const tableNames = tables.rows.map(row => row.table_name);
    
    if (tableNames.includes('users')) {
      console.log('\n🔍 Structure de la table users:');
      const userColumns = await sourceClient.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'users'
        ORDER BY ordinal_position
      `);
      userColumns.rows.forEach(col => {
        console.log(`  - ${col.column_name} (${col.data_type})`);
      });
    }

    if (tableNames.includes('doctors')) {
      console.log('\n🔍 Structure de la table doctors:');
      const doctorColumns = await sourceClient.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'doctors'
        ORDER BY ordinal_position
      `);
      doctorColumns.rows.forEach(col => {
        console.log(`  - ${col.column_name} (${col.data_type})`);
      });
    }

  } catch (error) {
    console.error('❌ Erreur lors de l\'exploration:', error.message);
  } finally {
    await sourceClient.end();
  }
}

// Fonction principale avec choix
async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--explore')) {
    await exploreHealthDatabase();
  } else {
    await importFromHealthDatabase();
  }
}

main();