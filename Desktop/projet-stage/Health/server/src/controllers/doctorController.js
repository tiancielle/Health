// src/controllers/doctorController.js
const { prisma } = require('../config/database');
const { validationResult } = require('express-validator');

class DoctorController {
  // Obtenir le profil du médecin
  async getProfile(req, res) {
    try {
      const doctorId = req.params.doctorId || req.user.doctorId;

      if (!doctorId) {
        return res.status(400).json({
          success: false,
          message: 'ID médecin requis'
        });
      }

      const doctor = await prisma.doctor.findUnique({
        where: { id: doctorId },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              phone: true,
              profilePicture: true,
              isEmailVerified: true,
              createdAt: true
            }
          },
          specialty: {
            select: {
              name: true,
              description: true
            }
          },
          appointments: {
            include: {
              patient: {
                include: {
                  user: {
                    select: {
                      firstName: true,
                      lastName: true
                    }
                  }
                }
              }
            },
            orderBy: { scheduledAt: 'desc' },
            take: 10
          },
          reviews: {
            include: {
              patient: {
                select: {
                  user: {
                    select: {
                      firstName: true,
                      lastName: true
                    }
                  }
                }
              }
            },
            orderBy: { createdAt: 'desc' },
            take: 5
          }
        }
      });

      if (!doctor) {
        return res.status(404).json({
          success: false,
          message: 'Médecin non trouvé'
        });
      }

      // Statistiques
      const stats = {
        totalAppointments: await prisma.appointment.count({
          where: { doctorId }
        }),
        completedAppointments: await prisma.appointment.count({
          where: { doctorId, status: 'COMPLETED' }
        }),
        upcomingAppointments: await prisma.appointment.count({
          where: {
            doctorId,
            status: 'SCHEDULED',
            scheduledAt: { gte: new Date() }
          }
        }),
        averageRating: doctor.reviews.length > 0
          ? parseFloat((doctor.reviews.reduce((sum, r) => sum + r.rating, 0) / doctor.reviews.length).toFixed(1))
          : 0,
        totalReviews: doctor.reviews.length
      };

      res.status(200).json({
        success: true,
        data: {
          doctor,
          stats
        }
      });
    } catch (error) {
      console.error('Erreur lors de la récupération du profil médecin:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Mettre à jour le profil du médecin
  async updateProfile(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Données invalides',
          errors: errors.array()
        });
      }

      const doctorId = req.params.doctorId || req.user.doctorId;
      const {
        firstName,
        lastName,
        phone,
        profilePicture,
        description,
        isAvailable,
        consultationFee,
        availability
      } = req.body;

      const existingDoctor = await prisma.doctor.findUnique({
        where: { id: doctorId },
        include: { user: true }
      });

      if (!existingDoctor) {
        return res.status(404).json({
          success: false,
          message: 'Médecin non trouvé'
        });
      }

      const userUpdateData = {};
      if (firstName !== undefined) userUpdateData.firstName = firstName;
      if (lastName !== undefined) userUpdateData.lastName = lastName;
      if (phone !== undefined) userUpdateData.phone = phone;
      if (profilePicture !== undefined) userUpdateData.profilePicture = profilePicture;

      const doctorUpdateData = {};
      if (description !== undefined) doctorUpdateData.description = description;
      if (isAvailable !== undefined) doctorUpdateData.isAvailable = isAvailable;
      if (consultationFee !== undefined) doctorUpdateData.consultationFee = consultationFee;
      if (availability !== undefined) doctorUpdateData.availability = availability;

      const updatedDoctor = await prisma.$transaction(async (tx) => {
        if (Object.keys(userUpdateData).length > 0) {
          await tx.user.update({
            where: { id: existingDoctor.userId },
            data: userUpdateData
          });
        }

        return await tx.doctor.update({
          where: { id: doctorId },
          data: doctorUpdateData,
          include: {
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                phone: true,
                profilePicture: true
              }
            },
            specialty: true
          }
        });
      });

      res.status(200).json({
        success: true,
        message: 'Profil médecin mis à jour avec succès',
        data: { doctor: updatedDoctor }
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil médecin:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Obtenir les rendez-vous du médecin
  async getAppointments(req, res) {
    try {
      const doctorId = req.params.doctorId || req.user.doctorId;
      const { status, page = 1, limit = 10, date } = req.query;

      const where = { doctorId };
      if (status) where.status = status.toUpperCase();
      if (date) {
        const targetDate = new Date(date);
        const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
        const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));
        where.scheduledAt = { gte: startOfDay, lte: endOfDay };
      }

      const skip = (parseInt(page) - 1) * parseInt(limit);
      const [appointments, totalCount] = await Promise.all([
        prisma.appointment.findMany({
          where,
          include: {
            patient: {
              include: {
                user: {
                  select: {
                    firstName: true,
                    lastName: true,
                    profilePicture: true
                  }
                }
              }
            }
          },
          orderBy: { scheduledAt: 'asc' },
          skip,
          take: parseInt(limit)
        }),
        prisma.appointment.count({ where })
      ]);

      const totalPages = Math.ceil(totalCount / parseInt(limit));

      res.status(200).json({
        success: true,
        data: {
          appointments,
          pagination: {
            currentPage: parseInt(page),
            totalPages,
            totalCount,
            hasNext: parseInt(page) < totalPages,
            hasPrev: parseInt(page) > 1
          }
        }
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des rendez-vous médecin:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Confirmer un rendez-vous
  async confirmAppointment(req, res) {
    try {
      const { id } = req.params;
      const doctorId = req.user.doctorId;

      const appointment = await prisma.appointment.findUnique({
        where: { id: parseInt(id) }
      });

      if (!appointment) {
        return res.status(404).json({
          success: false,
          message: 'Rendez-vous non trouvé'
        });
      }

      if (appointment.doctorId !== doctorId) {
        return res.status(403).json({
          success: false,
          message: 'Accès interdit'
        });
      }

      if (appointment.status !== 'SCHEDULED') {
        return res.status(400).json({
          success: false,
          message: 'Le rendez-vous ne peut pas être confirmé'
        });
      }

      const updated = await prisma.appointment.update({
        where: { id: parseInt(id) },
        data: { status: 'CONFIRMED' },
        include: {
          patient: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                  email: true
                }
              }
            }
          },
          doctor: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true
                }
              }
            }
          }
        }
      });

      res.status(200).json({
        success: true,
        message: 'Rendez-vous confirmé',
        data: { appointment: updated }
      });
    } catch (error) {
      console.error('Erreur lors de la confirmation du rendez-vous:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Obtenir les statistiques du médecin (tableau de bord)
  async getDashboardStats(req, res) {
    try {
      const doctorId = req.user.doctorId;

      const [
        totalAppointments,
        upcomingAppointments,
        completedAppointments,
        recentAppointments,
        totalRevenue
      ] = await Promise.all([
        prisma.appointment.count({ where: { doctorId } }),
        prisma.appointment.count({
          where: {
            doctorId,
            status: 'SCHEDULED',
            scheduledAt: { gte: new Date() }
          }
        }),
        prisma.appointment.count({
          where: { doctorId, status: 'COMPLETED' }
        }),
        prisma.appointment.findMany({
          where: { doctorId },
          include: {
            patient: {
              include: {
                user: {
                  select: {
                    firstName: true,
                    lastName: true
                  }
                }
              }
            }
          },
          orderBy: { scheduledAt: 'desc' },
          take: 5
        }),
        prisma.appointment.aggregate({
          where: { doctorId, status: 'COMPLETED' },
          _sum: { consultationFee: true }
        })
      ]);

      const stats = {
        totalAppointments,
        upcomingAppointments,
        completedAppointments,
        recentAppointments,
        totalRevenue: totalRevenue._sum.consultationFee || 0
      };

      res.status(200).json({
        success: true,
        data: { stats }
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques médecin:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }
}

module.exports = new DoctorController();