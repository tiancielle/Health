// models/postgresql/index.js
// On récupère Prisma Client depuis la configuration
const { prisma } = require('../../config/database');

// ❌ PROBLÈME : Supprimez ces imports qui n'existent pas
// const User = require('./User');
// const Doctor = require('./Doctor');

// === Export des modèles avec Prisma ===
// Chaque modèle correspond à un modèle Prisma dans schema.prisma
const User = {
  findMany: (args) => prisma.user.findMany(args),
  findUnique: (args) => prisma.user.findUnique(args),
  findFirst: (args) => prisma.user.findFirst(args),
  create: (args) => prisma.user.create(args),
  update: (args) => prisma.user.update(args),
  delete: (args) => prisma.user.delete(args),
  deleteMany: (args) => prisma.user.deleteMany(args),
  count: (args) => prisma.user.count(args),
};

const Patient = {
  findMany: (args) => prisma.patient.findMany(args),
  findUnique: (args) => prisma.patient.findUnique(args),
  findFirst: (args) => prisma.patient.findFirst(args),
  create: (args) => prisma.patient.create(args),
  update: (args) => prisma.patient.update(args),
  delete: (args) => prisma.patient.delete(args),
  deleteMany: (args) => prisma.patient.deleteMany(args),
  count: (args) => prisma.patient.count(args),
};

const Doctor = {
  findMany: (args) => prisma.doctor.findMany(args),
  findUnique: (args) => prisma.doctor.findUnique(args),
  findFirst: (args) => prisma.doctor.findFirst(args),
  create: (args) => prisma.doctor.create(args),
  update: (args) => prisma.doctor.update(args),
  delete: (args) => prisma.doctor.delete(args),
  deleteMany: (args) => prisma.doctor.deleteMany(args),
  count: (args) => prisma.doctor.count(args),
  groupBy: (args) => prisma.doctor.groupBy(args),
};

const Specialty = {
  findMany: (args) => prisma.specialty.findMany(args),
  findUnique: (args) => prisma.specialty.findUnique(args),
  findFirst: (args) => prisma.specialty.findFirst(args),
  create: (args) => prisma.specialty.create(args),
  update: (args) => prisma.specialty.update(args),
  delete: (args) => prisma.specialty.delete(args),
  deleteMany: (args) => prisma.specialty.deleteMany(args),
  count: (args) => prisma.specialty.count(args),
};

const Appointment = {
  findMany: (args) => prisma.appointment.findMany(args),
  findUnique: (args) => prisma.appointment.findUnique(args),
  findFirst: (args) => prisma.appointment.findFirst(args),
  create: (args) => prisma.appointment.create(args),
  update: (args) => prisma.appointment.update(args),
  delete: (args) => prisma.appointment.delete(args),
  deleteMany: (args) => prisma.appointment.deleteMany(args),
  count: (args) => prisma.appointment.count(args),
};

// === Export principal ===
module.exports = {
  User,
  Patient,
  Doctor,
  Specialty,
  Appointment,
  prisma, // Accès direct au client Prisma si nécessaire
};

// === Fonction utilitaire ===
// Pour vérifier que la connexion est prête
module.exports.isReady = async () => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.error('❌ Test de connexion échoué:', error.message);
    return false;
  }
};

// ❌ PROBLÈME : Supprimez ces lignes Sequelize dans un projet Prisma
// User.hasOne(Doctor, { 
//   foreignKey: 'userId', 
//   as: 'doctorProfile' 
// });

// Doctor.belongsTo(User, { 
//   foreignKey: 'userId', 
//   as: 'user' 
// });