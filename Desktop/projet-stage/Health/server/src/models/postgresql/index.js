/**
 * Modèles PostgreSQL via Prisma Client
 * 
 * Ce fichier exporte les modèles Prisma pour être utilisés dans les contrôleurs et services.
 * Il remplace Sequelize tout en gardant une interface similaire.
 */

// On récupère Prisma Client depuis la configuration
const { prisma } = require('../../config/database');

// === Export des modèles ===
// Chaque modèle correspond à un modèle Prisma dans schema.prisma
const User = {
  findMany: prisma.user.findMany,
  findUnique: prisma.user.findUnique,
  create: prisma.user.create,
  update: prisma.user.update,
  delete: prisma.user.delete,
  deleteMany: prisma.user.deleteMany,
};

const Patient = {
  findMany: prisma.patient.findMany,
  findUnique: prisma.patient.findUnique,
  create: prisma.patient.create,
  update: prisma.patient.update,
  delete: prisma.patient.delete,
  deleteMany: prisma.patient.deleteMany,
};

const Doctor = {
  findMany: prisma.doctor.findMany,
  findUnique: prisma.doctor.findUnique,
  create: prisma.doctor.create,
  update: prisma.doctor.update,
  delete: prisma.doctor.delete,
  deleteMany: prisma.doctor.deleteMany,
};

const Specialty = {
  findMany: prisma.specialty.findMany,
  findUnique: prisma.specialty.findUnique,
  create: prisma.specialty.create,
  update: prisma.specialty.update,
  delete: prisma.specialty.delete,
  deleteMany: prisma.specialty.deleteMany,
};

const Appointment = {
  findMany: prisma.appointment.findMany,
  findUnique: prisma.appointment.findUnique,
  create: prisma.appointment.create,
  update: prisma.appointment.update,
  delete: prisma.appointment.delete,
  deleteMany: prisma.appointment.deleteMany,
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

// === Fonction utilitaire optionnelle ===
// Pour vérifier que la connexion est prête
module.exports.isReady = async () => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    return false;
  }
};