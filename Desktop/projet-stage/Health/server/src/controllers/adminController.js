// src/controllers/adminController.js
const { prisma } = require('../config/database');

class AdminController {
  // Obtenir les statistiques globales
  async getDashboardStats(req, res) {
    try {
      const [
        totalUsers,
        totalPatients,
        totalDoctors,
        totalAppointments,
        pendingDoctors,
        recentAppointments
      ] = await Promise.all([
        prisma.user.count(),
        prisma.patient.count(),
        prisma.doctor.count(),
        prisma.appointment.count(),
        prisma.doctor.count({ where: { isVerified: false } }),
        prisma.appointment.findMany({
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: {
            patient: {
              include: { user: { select: { firstName: true, lastName: true } } }
            },
            doctor: {
              include: { user: { select: { firstName: true, lastName: true } } }
            }
          }
        })
      ]);

      const stats = {
        totalUsers,
        totalPatients,
        totalDoctors,
        totalAppointments,
        pendingDoctors,
        recentAppointments
      };

      res.status(200).json({
        success: true,
        data: { stats }
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des stats admin:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Vérifier un médecin
  async verifyDoctor(req, res) {
    try {
      const { id } = req.params;

      const doctor = await prisma.doctor.findUnique({
        where: { id: parseInt(id) }
      });

      if (!doctor) {
        return res.status(404).json({
          success: false,
          message: 'Médecin non trouvé'
        });
      }

      const verified = await prisma.doctor.update({
        where: { id: parseInt(id) },
        data: { isVerified: true }
      });

      res.status(200).json({
        success: true,
        message: 'Médecin vérifié avec succès',
        data: { doctor: verified }
      });
    } catch (error) {
      console.error('Erreur lors de la vérification du médecin:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Obtenir la liste des médecins en attente de vérification
  async getPendingDoctors(req, res) {
    try {
      const doctors = await prisma.doctor.findMany({
        where: { isVerified: false },
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true
            }
          },
          specialty: true
        }
      });

      res.status(200).json({
        success: true,
        data: { doctors }
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des médecins en attente:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Obtenir tous les utilisateurs
  async getAllUsers(req, res) {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          role: true,
          isEmailVerified: true,
          createdAt: true
        },
        orderBy: { createdAt: 'desc' }
      });

      res.status(200).json({
        success: true,
        data: { users }
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }
}

module.exports = new AdminController();