// server/src/seeders/simple-seed.js
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('🌱 Ajout des données de test...');

    // Supprimer les données existantes
    await prisma.doctor.deleteMany();
    await prisma.patient.deleteMany();
    await prisma.user.deleteMany();

    // Créer des utilisateurs médecins
    const user1 = await prisma.user.create({
      data: {
        firstName: 'Ahmed',
        lastName: 'Bennani',
        email: 'ahmed.bennani@example.com',
        password: 'hashedpassword123',
        role: 'DOCTOR',
        isActive: true,
        isVerified: true
      }
    });

    const user2 = await prisma.user.create({
      data: {
        firstName: 'Fatima',
        lastName: 'Alaoui',
        email: 'fatima.alaoui@example.com',
        password: 'hashedpassword123',
        role: 'DOCTOR',
        isActive: true,
        isVerified: true
      }
    });

    const user3 = await prisma.user.create({
      data: {
        firstName: 'Omar',
        lastName: 'Tazi',
        email: 'omar.tazi@example.com',
        password: 'hashedpassword123',
        role: 'DOCTOR',
        isActive: true,
        isVerified: true
      }
    });

    // Créer les profils médecins
    await prisma.doctor.create({
      data: {
        userId: user1.id,
        specialty: 'Cardiologie',
        licenseNumber: 'MD123456',
        experienceYears: 10,
        consultationFee: 150.0,
        city: 'Rabat',
        zipCode: '10000',
        phone: '+212 661234567',
        averageRating: 4.8,
        totalReviews: 25,
        isActive: true,
        isVerified: true,
        acceptsInsurance: true,
        isAvailableToday: true
      }
    });

    await prisma.doctor.create({
      data: {
        userId: user2.id,
        specialty: 'Pédiatrie',
        licenseNumber: 'MD789012',
        experienceYears: 8,
        consultationFee: 120.0,
        city: 'Rabat',
        zipCode: '10001',
        phone: '+212 662345678',
        averageRating: 4.6,
        totalReviews: 18,
        isActive: true,
        isVerified: true,
        acceptsInsurance: false,
        isAvailableToday: true
      }
    });

    await prisma.doctor.create({
      data: {
        userId: user3.id,
        specialty: 'Neurologie',
        licenseNumber: 'MD345678',
        experienceYears: 15,
        consultationFee: 200.0,
        city: 'Casablanca',
        zipCode: '20000',
        phone: '+212 663456789',
        averageRating: 4.9,
        totalReviews: 32,
        isActive: true,
        isVerified: true,
        acceptsInsurance: true,
        isAvailableToday: false
      }
    });

    console.log('✅ Données de test ajoutées avec succès');
    console.log('✅ 3 médecins créés');
  } catch (error) {
    console.error('❌ Erreur lors de l\'ajout des données:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();