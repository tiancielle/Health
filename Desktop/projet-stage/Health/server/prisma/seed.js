// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs'); // ✅ Changé de 'bcrypt' à 'bcryptjs'

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Créer des spécialités médicales
  const specialties = [
    { name: 'Cardiologie', description: 'Spécialité médicale qui traite les maladies du cœur et des vaisseaux' },
    { name: 'Dermatologie', description: 'Spécialité médicale qui traite les maladies de la peau' },
    { name: 'Neurologie', description: 'Spécialité médicale qui traite les maladies du système nerveux' },
    { name: 'Pédiatrie', description: 'Spécialité médicale qui traite les enfants' },
    { name: 'Gynécologie', description: 'Spécialité médicale qui traite les femmes' },
  ];

  for (const specialty of specialties) {
    await prisma.specialty.upsert({
      where: { name: specialty.name },
      update: {},
      create: specialty,
    });
  }

  // Créer un médecin de test
  const hashedPassword = await bcrypt.hash('doctor123', 10);
  
  const doctorUser = await prisma.user.upsert({
    where: { email: 'doctor@example.com' },
    update: {},
    create: {
      firstName: 'Dr. Marie',
      lastName: 'Dupokoiooiont',
      email: 'doctor@example.com',
      password: hashedPassword,
      role: 'doctor',
      phone: '+212600000001',
      isActive: true,
      isVerified: true,
    },
  });

  await prisma.doctor.upsert({
    where: { userId: doctorUser.id },
    update: {},
    create: {
      userId: doctorUser.id,
      specialty: 'Cardiologie',
      licenseNumber: 'DOC001',
      experienceYears: 10,
      about: 'Cardiologue expérimentée avec plus de 10 ans d\'expérience.',
      consultationFee: 300.0,
      address: '123 Rue de la Santé',
      city: 'Casablanca',
      zipCode: '20000',
      phone: '+212600000001',
      languages: ['français', 'arabe', 'anglais'],
      averageRating: 4.8,
      totalReviews: 25,
      isActive: true,
      isVerified: true,
      acceptsInsurance: true,
      isAvailableToday: true,
      nextAvailableSlot: '09:00',
    },
  });

  // Créer un patient de test
  const patientUser = await prisma.user.upsert({
    where: { email: 'patient@example.com' },
    update: {},
    create: {
      firstName: 'Ahmed',
      lastName: 'Benali',
      email: 'patient@example.com',
      password: await bcrypt.hash('patient123', 10),
      role: 'patient',
      phone: '+212600000002',
      isActive: true,
      isVerified: true,
    },
  });

  await prisma.patient.upsert({
    where: { userId: patientUser.id },
    update: {},
    create: {
      userId: patientUser.id,
      dateOfBirth: new Date('1985-06-15'),
      gender: 'male',
      bloodType: 'O+',
      allergies: ['pénicilline'],
      medications: [],
      emergencyContact: {
        name: 'Fatima Benali',
        phone: '+212600000003',
        relation: 'épouse'
      },
    },
  });

  console.log('✅ Seed completed successfully!');
  console.log('👨‍⚕️ Doctor: doctor@example.com / doctor123');
  console.log('🧑‍💼 Patient: patient@example.com / patient123');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });