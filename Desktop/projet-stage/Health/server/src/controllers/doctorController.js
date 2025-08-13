// server/src/controllers/doctorController.js
const { prisma } = require('../config/database'); // ✅ Import correct

const doctorController = {
  // Recherche de médecins
  searchDoctors: async (req, res) => {
    try {
      console.log('🔍 Recherche de médecins - paramètres reçus:', req.query);

      const {
        q: query,
        location,
        specialty,
        minRating,
        availability,
        maxDistance,
        sortBy = 'relevance',
        page = 1,
        limit = 12
      } = req.query;

      const offset = (parseInt(page) - 1) * parseInt(limit);
      
      // Construction des filtres de recherche
      let whereClause = {
        isActive: true,
        isVerified: true
      };

      // Recherche par spécialité
      if (specialty) {
        whereClause.specialty = {
          contains: specialty,
          mode: 'insensitive'
        };
      }

      // Note minimum
      if (minRating) {
        whereClause.averageRating = {
          gte: parseFloat(minRating)
        };
      }

      // Construction de la clause WHERE pour User (nom du médecin)
      if (query) {
        // Recherche dans le nom, prénom ou spécialité
        whereClause.OR = [
          {
            user: {
              firstName: {
                contains: query,
                mode: 'insensitive'
              }
            }
          },
          {
            user: {
              lastName: {
                contains: query,
                mode: 'insensitive'
              }
            }
          },
          {
            specialty: {
              contains: query,
              mode: 'insensitive'
            }
          }
        ];
      }

      // Filtre par localisation
      if (location) {
        const locationFilter = [
          {
            address: {
              contains: location,
              mode: 'insensitive'
            }
          },
          {
            city: {
              contains: location,
              mode: 'insensitive'
            }
          },
          {
            zipCode: {
              contains: location,
              mode: 'insensitive'
            }
          }
        ];

        if (whereClause.OR) {
          // Combiner avec les autres filtres OR
          whereClause.AND = [
            { OR: whereClause.OR },
            { OR: locationFilter }
          ];
          delete whereClause.OR;
        } else {
          whereClause.OR = locationFilter;
        }
      }

      // Définir l'ordre de tri
      let orderBy = [];
      switch (sortBy) {
        case 'rating':
          orderBy = [{ averageRating: 'desc' }];
          break;
        case 'name':
          orderBy = [{ user: { firstName: 'asc' } }];
          break;
        case 'distance':
          orderBy = [{ city: 'asc' }]; // Temporaire
          break;
        case 'availability':
          orderBy = [{ createdAt: 'desc' }]; // Temporaire
          break;
        default: // relevance
          orderBy = [
            { averageRating: 'desc' },
            { totalReviews: 'desc' }
          ];
      }

      console.log('🔍 Clause WHERE construite:', JSON.stringify(whereClause, null, 2));

      // Vérifier que Prisma est bien connecté
      if (!prisma) {
        throw new Error('Prisma client non initialisé');
      }

      // Exécuter la requête avec Prisma
      const [doctors, total] = await Promise.all([
        prisma.doctor.findMany({
          where: whereClause,
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                profileImage: true
              }
            }
          },
          orderBy: orderBy,
          skip: offset,
          take: parseInt(limit)
        }),
        prisma.doctor.count({
          where: whereClause
        })
      ]);

      console.log(`✅ ${doctors.length} médecins trouvés sur ${total} total`);

      // Formatage des résultats
      const formattedDoctors = doctors.map(doctor => ({
        id: doctor.id,
        userId: doctor.user?.id,
        firstName: doctor.user?.firstName || 'Prénom',
        lastName: doctor.user?.lastName || 'Non renseigné',
        specialty: doctor.specialty || 'Généraliste',
        rating: doctor.averageRating || 4.5,
        reviewCount: doctor.totalReviews || 0,
        profileImage: doctor.user?.profileImage,
        location: doctor.city || 'Non renseignée',
        address: doctor.address,
        consultationFee: doctor.consultationFee || 50,
        verified: doctor.isVerified,
        availableToday: doctor.isAvailableToday || false,
        nextAvailableSlot: doctor.nextAvailableSlot || 'Disponible bientôt',
        languages: doctor.languages || [],
        experience: doctor.experienceYears || 0,
        acceptsInsurance: doctor.acceptsInsurance || false
      }));

      // Métadonnées de pagination
      const totalPages = Math.ceil(total / parseInt(limit));
      const hasNext = page < totalPages;
      const hasPrev = page > 1;

      console.log('✅ Réponse formatée envoyée');

      res.json({
        success: true,
        doctors: formattedDoctors,
        total,
        page: parseInt(page),
        totalPages,
        hasNext,
        hasPrev,
        limit: parseInt(limit)
      });

    } catch (error) {
      console.error('❌ Erreur lors de la recherche de médecins:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la recherche de médecins',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  // Suggestions de recherche
  getSearchSuggestions: async (req, res) => {
    try {
      const { q: query } = req.query;

      if (!query || query.length < 2) {
        return res.json({ suggestions: [] });
      }

      // Vérifier que Prisma est connecté
      if (!prisma) {
        throw new Error('Prisma client non initialisé');
      }

      // Suggestions de spécialités
      const specialties = await prisma.doctor.findMany({
        where: {
          specialty: {
            contains: query,
            mode: 'insensitive'
          },
          isActive: true
        },
        select: {
          specialty: true
        },
        distinct: ['specialty'],
        take: 5
      });

      // Suggestions de noms de médecins
      const doctors = await prisma.doctor.findMany({
        where: {
          isActive: true,
          user: {
            OR: [
              {
                firstName: {
                  contains: query,
                  mode: 'insensitive'
                }
              },
              {
                lastName: {
                  contains: query,
                  mode: 'insensitive'
                }
              }
            ]
          }
        },
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true
            }
          }
        },
        take: 5
      });

      const suggestions = [
        ...specialties.map(s => ({
          text: s.specialty,
          type: 'specialty'
        })),
        ...doctors.map(d => ({
          text: `Dr. ${d.user?.firstName} ${d.user?.lastName}`,
          type: 'doctor'
        }))
      ];

      res.json({ suggestions });
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des suggestions:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des suggestions'
      });
    }
  },

  // Médecins populaires
  getPopularDoctors: async (req, res) => {
    try {
      const { limit = 6 } = req.query;

      // Vérifier que Prisma est connecté
      if (!prisma) {
        throw new Error('Prisma client non initialisé');
      }

      const doctors = await prisma.doctor.findMany({
        where: {
          isActive: true,
          isVerified: true
        },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              profileImage: true
            }
          }
        },
        orderBy: [
          { averageRating: 'desc' },
          { totalReviews: 'desc' }
        ],
        take: parseInt(limit)
      });

      const formattedDoctors = doctors.map(doctor => ({
        id: doctor.id,
        firstName: doctor.user?.firstName || 'Prénom',
        lastName: doctor.user?.lastName || 'Non renseigné',
        specialty: doctor.specialty || 'Généraliste',
        rating: doctor.averageRating || 4.5,
        reviewCount: doctor.totalReviews || 0,
        profileImage: doctor.user?.profileImage,
        location: doctor.city || 'Non renseignée',
        verified: doctor.isVerified
      }));

      res.json({
        success: true,
        doctors: formattedDoctors
      });
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des médecins populaires:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des médecins populaires'
      });
    }
  },

  // Liste des spécialités
  getSpecialties: async (req, res) => {
    try {
      // Vérifier que Prisma est connecté
      if (!prisma) {
        throw new Error('Prisma client non initialisé');
      }

      const specialtiesWithCount = await prisma.doctor.groupBy({
        by: ['specialty'],
        where: {
          isActive: true
        },
        _count: {
          id: true
        },
        orderBy: {
          _count: {
            id: 'desc'
          }
        }
      });

      const specialties = specialtiesWithCount.map(s => ({
        name: s.specialty,
        count: s._count.id
      }));

      res.json({
        success: true,
        specialties
      });
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des spécialités:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des spécialités'
      });
    }
  },

  // Détails d'un médecin
  getDoctorDetails: async (req, res) => {
    try {
      const { id } = req.params;

      // Vérifier que Prisma est connecté
      if (!prisma) {
        throw new Error('Prisma client non initialisé');
      }

      const doctor = await prisma.doctor.findUnique({
        where: {
          id: id,
          isActive: true
        },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              profileImage: true
            }
          }
        }
      });

      if (!doctor) {
        return res.status(404).json({
          success: false,
          message: 'Médecin non trouvé'
        });
      }

      const doctorDetails = {
        id: doctor.id,
        userId: doctor.user?.id,
        firstName: doctor.user?.firstName || 'Prénom',
        lastName: doctor.user?.lastName || 'Non renseigné',
        email: doctor.user?.email,
        specialty: doctor.specialty || 'Généraliste',
        rating: doctor.averageRating || 4.5,
        reviewCount: doctor.totalReviews || 0,
        profileImage: doctor.user?.profileImage,
        location: doctor.city || 'Non renseignée',
        address: doctor.address,
        phone: doctor.phone,
        consultationFee: doctor.consultationFee || 50,
        verified: doctor.isVerified,
        languages: doctor.languages || [],
        experience: doctor.experienceYears || 0,
        education: doctor.education,
        about: doctor.about,
        acceptsInsurance: doctor.acceptsInsurance || false
      };

      res.json({
        success: true,
        doctor: doctorDetails
      });
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des détails du médecin:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des détails du médecin'
      });
    }
  }
};

module.exports = doctorController;