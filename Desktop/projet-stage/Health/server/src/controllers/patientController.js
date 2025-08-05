// src/controllers/patientController.js
const { prisma } = require('../config/database');
const { validationResult } = require('express-validator');

class PatientController {
  // Obtenir le profil du patient
  async getProfile(req, res) {
    try {
      const patientId = req.params.patientId || req.user.patientId;
      
      if (!patientId) {
        return res.status(400).json({
          success: false,
          message: 'ID patient requis'
        });
      }

      const patient = await prisma.patient.findUnique({
        where: { id: patientId },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              phone: true,
              dateOfBirth: true,
              gender: true,
              profilePicture: true,
              isEmailVerified: true,
              createdAt: true
            }
          },
          appointments: {
            include: {
              doctor: {
                include: {
                  user: {
                    select: {
                      firstName: true,
                      lastName: true
                    }
                  },
                  specialty: {
                    select: {
                      name: true
                    }
                  }
                }
              }
            },
            orderBy: {
              scheduledAt: 'desc'
            },
            take: 10 // Derniers 10 rendez-vous
          }
        }
      });

      if (!patient) {
        return res.status(404).json({
          success: false,
          message: 'Patient non trouvé'
        });
      }

      // Statistiques du patient
      const appointmentStats = await prisma.appointment.groupBy({
        by: ['status'],
        where: { patientId },
        _count: {
          status: true
        }
      });

      const stats = {
        totalAppointments: await prisma.appointment.count({
          where: { patientId }
        }),
        completedAppointments: appointmentStats.find(s => s.status === 'COMPLETED')?._count.status || 0,
        upcomingAppointments: await prisma.appointment.count({
          where: {
            patientId,
            status: 'SCHEDULED',
            scheduledAt: {
              gte: new Date()
            }
          }
        })
      };

      res.status(200).json({
        success: true,
        data: {
          patient,
          stats
        }
      });
    } catch (error) {
      console.error('Erreur lors de la récupération du profil patient:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Mettre à jour le profil du patient
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

      const patientId = req.params.patientId || req.user.patientId;
      const {
        // Informations utilisateur
        firstName,
        lastName,
        phone,
        dateOfBirth,
        gender,
        profilePicture,
        // Informations médicales
        bloodType,
        allergies,
        chronicDiseases,
        emergencyContact,
        insuranceInfo
      } = req.body;

      // Vérifier que le patient existe
      const existingPatient = await prisma.patient.findUnique({
        where: { id: patientId },
        include: { user: true }
      });

      if (!existingPatient) {
        return res.status(404).json({
          success: false,
          message: 'Patient non trouvé'
        });
      }

      // Mettre à jour les informations utilisateur si fournies
      const userUpdateData = {};
      if (firstName !== undefined) userUpdateData.firstName = firstName;
      if (lastName !== undefined) userUpdateData.lastName = lastName;
      if (phone !== undefined) userUpdateData.phone = phone;
      if (dateOfBirth !== undefined) userUpdateData.dateOfBirth = new Date(dateOfBirth);
      if (gender !== undefined) userUpdateData.gender = gender.toUpperCase();
      if (profilePicture !== undefined) userUpdateData.profilePicture = profilePicture;

      // Mettre à jour les informations patient
      const patientUpdateData = {};
      if (bloodType !== undefined) patientUpdateData.bloodType = bloodType;
      if (allergies !== undefined) patientUpdateData.allergies = allergies;
      if (chronicDiseases !== undefined) patientUpdateData.chronicDiseases = chronicDiseases;
      if (emergencyContact !== undefined) patientUpdateData.emergencyContact = emergencyContact;
      if (insuranceInfo !== undefined) patientUpdateData.insuranceInfo = insuranceInfo;

      // Transaction pour mettre à jour les deux tables
      const updatedPatient = await prisma.$transaction(async (tx) => {
        // Mettre à jour l'utilisateur si nécessaire
        if (Object.keys(userUpdateData).length > 0) {
          await tx.user.update({
            where: { id: existingPatient.userId },
            data: userUpdateData
          });
        }

        // Mettre à jour le patient
        return await tx.patient.update({
          where: { id: patientId },
          data: patientUpdateData,
          include: {
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                phone: true,
                dateOfBirth: true,
                gender: true,
                profilePicture: true,
                isEmailVerified: true
              }
            }
          }
        });
      });

      res.status(200).json({
        success: true,
        message: 'Profil patient mis à jour avec succès',
        data: {
          patient: updatedPatient
        }
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil patient:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Obtenir les rendez-vous du patient
  async getAppointments(req, res) {
    try {
      const patientId = req.params.patientId || req.user.patientId;
      const { status, page = 1, limit = 10, startDate, endDate } = req.query;

      const where = { patientId };

      // Filtrer par statut si fourni
      if (status) {
        where.status = status.toUpperCase();
      }

      // Filtrer par dates si fournies
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
                    profilePicture: true
                  }
                },
                specialty: {
                  select: {
                    name: true,
                    icon: true
                  }
                }
              }
            }
          },
          orderBy: {
            scheduledAt: 'desc'
          },
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
      console.error('Erreur lors de la récupération des rendez-vous:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Obtenir les dossiers médicaux du patient
  async getMedicalRecords(req, res) {
    try {
      const patientId = req.params.patientId || req.user.patientId;
      
      const patient = await prisma.patient.findUnique({
        where: { id: patientId },
        select: {
          medicalRecords: true
        }
      });

      if (!patient) {
        return res.status(404).json({
          success: false,
          message: 'Patient non trouvé'
        });
      }

      // Ici, vous devrez récupérer les dossiers médicaux depuis MongoDB
      // en utilisant les IDs stockés dans patient.medicalRecords
      // Pour l'instant, on retourne juste les IDs
      res.status(200).json({
        success: true,
        data: {
          medicalRecordIds: patient.medicalRecords,
          message: 'Intégration MongoDB à implémenter pour récupérer les détails'
        }
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des dossiers médicaux:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Rechercher des docteurs
  async searchDoctors(req, res) {
    try {
      const { specialty, name, city, page = 1, limit = 10, available = true } = req.query;

      const where = {
        isVerified: true
      };

      if (available === 'true') {
        where.isAvailable = true;
      }

      // Filtrer par spécialité
      if (specialty) {
        where.specialty = {
          name: {
            contains: specialty,
            mode: 'insensitive'
          }
        };
      }

      // Filtrer par nom
      if (name) {
        where.user = {
          OR: [
            {
              firstName: {
                contains: name,
                mode: 'insensitive'
              }
            },
            {
              lastName: {
                contains: name,
                mode: 'insensitive'
              }
            }
          ]
        };
      }

      const skip = (parseInt(page) - 1) * parseInt(limit);

      const [doctors, totalCount] = await Promise.all([
        prisma.doctor.findMany({
          where,
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                profilePicture: true
              }
            },
            specialty: {
              select: {
                name: true,
                description: true,
                icon: true
              }
            },
            reviews: {
              select: {
                rating: true
              }
            }
          },
          skip,
          take: parseInt(limit)
        }),
        prisma.doctor.count({ where })
      ]);

      // Calculer la note moyenne pour chaque docteur
      const doctorsWithRatings = doctors.map(doctor => {
        const ratings = doctor.reviews.map(r => r.rating);
        const averageRating = ratings.length > 0 
          ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length 
          : 0;

        return {
          ...doctor,
          averageRating: parseFloat(averageRating.toFixed(1)),
          totalReviews: ratings.length,
          reviews: undefined // Ne pas exposer les détails des avis
        };
      });

      const totalPages = Math.ceil(totalCount / parseInt(limit));

      res.status(200).json({
        success: true,
        data: {
          doctors: doctorsWithRatings,
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
      console.error('Erreur lors de la recherche de docteurs:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Obtenir les spécialités disponibles
  async getSpecialties(req, res) {
    try {
      const specialties = await prisma.specialty.findMany({
        orderBy: {
          name: 'asc'
        }
      });

      res.status(200).json({
        success: true,
        data: {
          specialties
        }
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des spécialités:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Évaluer un docteur
  async rateDoctor(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Données invalides',
          errors: errors.array()
        });
      }

      const patientId = req.user.patientId;
      const { doctorId } = req.params;
      const { rating, comment, punctuality, communication, professionalism } = req.body;

      // Vérifier que le patient a eu un rendez-vous avec ce docteur
      const hasAppointment = await prisma.appointment.findFirst({
        where: {
          patientId,
          doctorId,
          status: 'COMPLETED'
        }
      });

      if (!hasAppointment) {
        return res.status(400).json({
          success: false,
          message: 'Vous ne pouvez évaluer que les docteurs que vous avez consultés'
        });
      }

      // Créer ou mettre à jour l'évaluation
      const review = await prisma.review.upsert({
        where: {
          patientId_doctorId: {
            patientId,
            doctorId
          }
        },
        update: {
          rating,
          comment,
          punctuality,
          communication,
          professionalism
        },
        create: {
          patientId,
          doctorId,
          rating,
          comment,
          punctuality,
          communication,
          professionalism
        }
      });

      res.status(200).json({
        success: true,
        message: 'Évaluation enregistrée avec succès',
        data: {
          review
        }
      });
    } catch (error) {
      console.error('Erreur lors de l\'évaluation du docteur:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Obtenir les statistiques du patient (pour tableau de bord)
  async getDashboardStats(req, res) {
    try {
      const patientId = req.user.patientId;

      const [
        totalAppointments,
        upcomingAppointments,
        completedAppointments,
        recentAppointments
      ] = await Promise.all([
        // Total des rendez-vous
        prisma.appointment.count({
          where: { patientId }
        }),
        
        // Rendez-vous à venir
        prisma.appointment.count({
          where: {
            patientId,
            status: 'SCHEDULED',
            scheduledAt: {
              gte: new Date()
            }
          }
        }),
        
        // Rendez-vous terminés
        prisma.appointment.count({
          where: {
            patientId,
            status: 'COMPLETED'
          }
        }),
        
        // Derniers rendez-vous
        prisma.appointment.findMany({
          where: { patientId },
          include: {
            doctor: {
              include: {
                user: {
                  select: {
                    firstName: true,
                    lastName: true
                  }
                },
                specialty: {
                  select: {
                    name: true
                  }
                }
              }
            }
          },
          orderBy: {
            scheduledAt: 'desc'
          },
          take: 5
        })
      ]);

      const stats = {
        totalAppointments,
        upcomingAppointments,
        completedAppointments,
        recentAppointments
      };

      res.status(200).json({
        success: true,
        data: {
          stats
        }
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }
}

module.exports = new PatientController();