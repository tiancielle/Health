// src/controllers/appointmentController.js
const { prisma } = require('../config/database');
const { validationResult } = require('express-validator');

class AppointmentController {
  // Créer un nouveau rendez-vous
  async createAppointment(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Données invalides',
          errors: errors.array(),
        });
      }

      const patientId = req.user.patientId;
      const {
        doctorId,
        scheduledAt,
        duration = 30,
        type = 'CONSULTATION',
        reason,
        symptoms = [],
      } = req.body;

      // Vérifier que le patient existe
      if (!patientId) {
        return res.status(400).json({
          success: false,
          message: 'Profil patient requis pour prendre un rendez-vous',
        });
      }

      // Vérifier que le docteur existe et est disponible
      const doctor = await prisma.doctor.findUnique({
        where: { id: doctorId },
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      });

      if (!doctor) {
        return res.status(404).json({
          success: false,
          message: 'Docteur non trouvé',
        });
      }

      if (!doctor.isVerified || !doctor.isAvailable) {
        return res.status(400).json({
          success: false,
          message: 'Docteur non disponible pour les rendez-vous',
        });
      }

      const appointmentDate = new Date(scheduledAt);

      // Vérifier que la date est dans le futur
      if (appointmentDate <= new Date()) {
        return res.status(400).json({
          success: false,
          message: 'La date du rendez-vous doit être dans le futur',
        });
      }

      // Vérifier la disponibilité du docteur à cette date/heure
      const conflictingAppointment = await prisma.appointment.findFirst({
        where: {
          doctorId,
          scheduledAt: appointmentDate,
          status: {
            in: ['SCHEDULED', 'CONFIRMED', 'IN_PROGRESS'],
          },
        },
      });

      if (conflictingAppointment) {
        return res.status(400).json({
          success: false,
          message: 'Le docteur n\'est pas disponible à cette date et heure',
        });
      }

      // Vérifier que le patient n'a pas déjà un rendez-vous à cette heure
      const patientConflict = await prisma.appointment.findFirst({
        where: {
          patientId,
          scheduledAt: appointmentDate,
          status: {
            in: ['SCHEDULED', 'CONFIRMED', 'IN_PROGRESS'],
          },
        },
      });

      if (patientConflict) {
        return res.status(400).json({
          success: false,
          message: 'Vous avez déjà un rendez-vous à cette date et heure',
        });
      }

      // Créer le rendez-vous
      const appointment = await prisma.appointment.create({
        data: {
          patientId,
          doctorId,
          scheduledAt: appointmentDate,
          duration,
          type: type.toUpperCase(),
          reason,
          symptoms,
          status: 'SCHEDULED',
          createdAt: new Date(),
        },
        include: {
          patient: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
          doctor: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
              specialty: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      });

      res.status(201).json({
        success: true,
        message: 'Rendez-vous créé avec succès',
        data: {
          appointment,
        },
      });
    } catch (error) {
      console.error('Erreur lors de la création du rendez-vous:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur',
      });
    }
  }

  // Obtenir un rendez-vous par ID
  async getAppointmentById(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const role = req.user.role;

      const appointment = await prisma.appointment.findUnique({
        where: { id: parseInt(id) },
        include: {
          patient: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                  email: true,
                  phone: true,
                },
              },
            },
          },
          doctor: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                  email: true,
                  phone: true,
                },
              },
              specialty: {
                select: {
                  name: true,
                },
              },
            },
          },
          medicalRecord: {
            select: {
              id: true,
              diagnosis: true,
              prescriptions: true,
            },
          },
        },
      });

      if (!appointment) {
        return res.status(404).json({
          success: false,
          message: 'Rendez-vous non trouvé',
        });
      }

      // Vérifier les permissions
      if (
        role === 'patient' &&
        appointment.patientId !== req.user.patientId
      ) {
        return res.status(403).json({
          success: false,
          message: 'Accès interdit',
        });
      }

      if (
        role === 'doctor' &&
        appointment.doctorId !== req.user.doctorId
      ) {
        return res.status(403).json({
          success: false,
          message: 'Accès interdit',
        });
      }

      res.status(200).json({
        success: true,
        data: {
          appointment,
        },
      });
    } catch (error) {
      console.error('Erreur lors de la récupération du rendez-vous:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur',
      });
    }
  }

  // Mettre à jour le statut d'un rendez-vous (par le médecin ou le patient)
  async updateAppointmentStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const role = req.user.role;

      const validStatuses = ['SCHEDULED', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'NO_SHOW'];
      if (!validStatuses.includes(status.toUpperCase())) {
        return res.status(400).json({
          success: false,
          message: 'Statut invalide',
        });
      }

      const appointment = await prisma.appointment.findUnique({
        where: { id: parseInt(id) },
      });

      if (!appointment) {
        return res.status(404).json({
          success: false,
          message: 'Rendez-vous non trouvé',
        });
      }

      // Vérifier les permissions
      if (
        role === 'patient' &&
        appointment.patientId !== req.user.patientId
      ) {
        return res.status(403).json({
          success: false,
          message: 'Accès interdit',
        });
      }

      if (
        role === 'doctor' &&
        appointment.doctorId !== req.user.doctorId
      ) {
        return res.status(403).json({
          success: false,
          message: 'Accès interdit',
        });
      }

      const updatedAppointment = await prisma.appointment.update({
        where: { id: parseInt(id) },
        data: {
          status: status.toUpperCase(),
          updatedAt: new Date(),
        },
        include: {
          patient: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
          doctor: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
        },
      });

      res.status(200).json({
        success: true,
        message: 'Statut du rendez-vous mis à jour',
        data: {
          appointment: updatedAppointment,
        },
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur',
      });
    }
  }

  // Annuler un rendez-vous
  async cancelAppointment(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const role = req.user.role;

      const appointment = await prisma.appointment.findUnique({
        where: { id: parseInt(id) },
      });

      if (!appointment) {
        return res.status(404).json({
          success: false,
          message: 'Rendez-vous non trouvé',
        });
      }

      if (appointment.status === 'CANCELLED') {
        return res.status(400).json({
          success: false,
          message: 'Le rendez-vous est déjà annulé',
        });
      }

      // Vérifier les permissions
      if (
        role === 'patient' &&
        appointment.patientId !== req.user.patientId
      ) {
        return res.status(403).json({
          success: false,
          message: 'Accès interdit',
        });
      }

      if (
        role === 'doctor' &&
        appointment.doctorId !== req.user.doctorId
      ) {
        return res.status(403).json({
          success: false,
          message: 'Accès interdit',
        });
      }

      const updatedAppointment = await prisma.appointment.update({
        where: { id: parseInt(id) },
        data: {
          status: 'CANCELLED',
          cancelledAt: new Date(),
          cancelledBy: role === 'patient' ? 'PATIENT' : 'DOCTOR',
        },
      });

      res.status(200).json({
        success: true,
        message: 'Rendez-vous annulé avec succès',
        data: {
          appointment: updatedAppointment,
        },
      });
    } catch (error) {
      console.error('Erreur lors de l\'annulation du rendez-vous:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur',
      });
    }
  }

  // Obtenir les rendez-vous du patient
  async getPatientAppointments(req, res) {
    try {
      const patientId = req.params.patientId || req.user.patientId;
      const { status, page = 1, limit = 10, startDate, endDate } = req.query;

      const where = { patientId };
      if (status) {
        where.status = status.toUpperCase();
      }
      if (startDate || endDate) {
        where.scheduledAt = {};
        if (startDate) where.scheduledAt.gte = new Date(startDate);
        if (endDate) where.scheduledAt.lte = new Date(endDate);
      }

      const skip = (parseInt(page) - 1) * parseInt(limit);
      const [appointments, totalCount] = await Promise.all([
        prisma.appointment.findMany({
          where,
          include: {
            doctor: {
              include: {
                user: {
                  select: {
                    firstName: true,
                    lastName: true,
                    profilePicture: true,
                  },
                },
                specialty: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
          orderBy: { scheduledAt: 'desc' },
          skip,
          take: parseInt(limit),
        }),
        prisma.appointment.count({ where }),
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
            hasPrev: parseInt(page) > 1,
          },
        },
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des rendez-vous:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur',
      });
    }
  }

  // Obtenir les rendez-vous du médecin
  async getDoctorAppointments(req, res) {
    try {
      const doctorId = req.params.doctorId || req.user.doctorId;
      const { status, page = 1, limit = 10, date } = req.query;

      const where = { doctorId };
      if (status) {
        where.status = status.toUpperCase();
      }
      if (date) {
        const targetDate = new Date(date);
        const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
        const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));
        where.scheduledAt = {
          gte: startOfDay,
          lte: endOfDay,
        };
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
                    profilePicture: true,
                  },
                },
              },
            },
          },
          orderBy: { scheduledAt: 'asc' },
          skip,
          take: parseInt(limit),
        }),
        prisma.appointment.count({ where }),
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
            hasPrev: parseInt(page) > 1,
          },
        },
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des rendez-vous médecin:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur',
      });
    }
  }

  // Obtenir les disponibilités d'un médecin
  async getDoctorAvailability(req, res) {
    try {
      const { doctorId } = req.params;
      const { date } = req.query;

      if (!date) {
        return res.status(400).json({
          success: false,
          message: 'Date requise',
        });
      }

      const doctor = await prisma.doctor.findUnique({
        where: { id: parseInt(doctorId) },
      });

      if (!doctor) {
        return res.status(404).json({
          success: false,
          message: 'Docteur non trouvé',
        });
      }

      const targetDate = new Date(date);
      const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
      const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

      const bookedSlots = await prisma.appointment.findMany({
        where: {
          doctorId: parseInt(doctorId),
          scheduledAt: {
            gte: startOfDay,
            lte: endOfDay,
          },
          status: {
            in: ['SCHEDULED', 'CONFIRMED', 'IN_PROGRESS'],
          },
        },
        select: {
          scheduledAt: true,
          duration: true,
        },
      });

      // Générer les créneaux disponibles (ex: toutes les 30 min de 9h à 17h)
      const slots = [];
      let current = new Date(startOfDay);
      current.setHours(9, 0, 0, 0); // 9h

      while (current < endOfDay) {
        const slotEnd = new Date(current.getTime() + 30 * 60000); // +30 min

        if (current.getHours() >= 17) break; // Fin à 17h

        const isBooked = bookedSlots.some((booking) => {
          const bookingStart = new Date(booking.scheduledAt);
          const bookingEnd = new Date(bookingStart.getTime() + booking.duration * 60000);
          return (
            (current >= bookingStart && current < bookingEnd) ||
            (slotEnd > bookingStart && slotEnd <= bookingEnd)
          );
        });

        if (!isBooked) {
          slots.push({
            startTime: current.toISOString(),
            endTime: slotEnd.toISOString(),
          });
        }

        current = slotEnd;
      }

      res.status(200).json({
        success: true,
        data: {
          date: targetDate.toISOString().split('T')[0],
          slots,
          totalAvailable: slots.length,
        },
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des disponibilités:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur',
      });
    }
  }
}

module.exports = new AppointmentController();