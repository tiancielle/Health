// src/controllers/doctorController.js - VERSION COMPLÈTE
const { prisma } = require('../config/database');

class DoctorController {
  
  async searchDoctors(req, res) {
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
      
      // Vérifier que Prisma est connecté
      if (!prisma) {
        throw new Error('Prisma client non initialisé');
      }

      // Construction des filtres de recherche
      let whereClause = {
        // isActive: true,
        // isVerified: true
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

      // Construction de la clause WHERE pour recherche textuelle
      if (query) {
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
  }

  async getSearchSuggestions(req, res) {
    try {
      const { q: query } = req.query;

      if (!query || query.length < 2) {
        return res.json({ suggestions: [] });
      }

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
          // isActive: true
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
          // isActive: true,
          // user: {
          //   OR: [
          //     {
          //       firstName: {
          //         contains: query,
          //         mode: 'insensitive'
          //       }
          //     },
          //     {
          //       lastName: {
          //         contains: query,
          //         mode: 'insensitive'
          //       }
          //     }
          //   ]
          // }
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

      res.json({ 
        success: true,
        suggestions 
      });
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des suggestions:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des suggestions'
      });
    }
  }

  async getPopularDoctors(req, res) {
    try {
      const { limit = 6 } = req.query;

      if (!prisma) {
        throw new Error('Prisma client non initialisé');
      }

      const doctors = await prisma.doctor.findMany({
        where: {
          // isActive: true,
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
  }

  async getSpecialties(req, res) {
    try {
      if (!prisma) {
        throw new Error('Prisma client non initialisé');
      }

      const specialtiesWithCount = await prisma.doctor.groupBy({
        by: ['specialty'],
        where: {
          // isActive: true
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
  }
  async getAllDoctors(req, res) {
  try {
    console.log('Récupération de tous les médecins PostgreSQL...');

    const doctors = await prisma.doctor.findMany({
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            profileImage: true,
            phone: true
          }
        }
      },
      orderBy: [
        { createdAt: 'desc' }
      ]
    });

    console.log(`${doctors.length} médecins trouvés dans PostgreSQL`);

    const formattedDoctors = doctors.map(doctor => ({
      id: doctor.id,
      firstName: doctor.user?.firstName || 'Prénom',
      lastName: doctor.user?.lastName || 'Non renseigné',
      specialty: doctor.specialty || 'Généraliste',
      rating: doctor.averageRating || 0,
      reviewCount: doctor.totalReviews || 0,
      address: doctor.address || 'Adresse non renseignée',
      city: doctor.city || 'Ville non renseignée',
      phone: doctor.phone || doctor.user?.phone,
      consultationFee: doctor.consultationFee || 0,
      verified: doctor.isVerified,
      experience: doctor.experienceYears || 0
    }));

    res.json({
      success: true,
      doctors: formattedDoctors,
      total: formattedDoctors.length,
      source: 'postgresql_database'
    });

  } catch (error) {
    console.error('Erreur récupération médecins:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des médecins'
    });
  }
}
  // async getDoctorDetails(req, res) {
  //   try {
  //     const { id } = req.params;
      
  //     if (!id) {
  //       return res.status(400).json({
  //         success: false,
  //         message: 'ID du médecin requis'
  //       });
  //     }

  //     if (!prisma) {
  //       throw new Error('Prisma client non initialisé');
  //     }

  //     const doctor = await prisma.doctor.findUnique({
  //       where: {
  //         id: id,
  //         // isActive: true
  //       },
  //       include: {
  //         user: {
  //           select: {
  //             id: true,
  //             firstName: true,
  //             lastName: true,
  //             email: true,
  //             profileImage: true
  //           }
  //         }
  //       }
  //     });

  //     if (!doctor) {
  //       return res.status(404).json({
  //         success: false,
  //         message: 'Médecin non trouvé'
  //       });
  //     }

  //     const doctorDetails = {
  //       id: doctor.id,
  //       userId: doctor.user?.id,
  //       firstName: doctor.user?.firstName || 'Prénom',
  //       lastName: doctor.user?.lastName || 'Non renseigné',
  //       email: doctor.user?.email,
  //       specialty: doctor.specialty || 'Généraliste',
  //       rating: doctor.averageRating || 4.5,
  //       reviewCount: doctor.totalReviews || 0,
  //       profileImage: doctor.user?.profileImage,
  //       location: doctor.city || 'Non renseignée',
  //       address: doctor.address,
  //       phone: doctor.phone,
  //       consultationFee: doctor.consultationFee || 50,
  //       verified: doctor.isVerified,
  //       languages: doctor.languages || [],
  //       experience: doctor.experienceYears || 0,
  //       education: doctor.education,
  //       about: doctor.about,
  //       acceptsInsurance: doctor.acceptsInsurance || false
  //     };

  //     res.json({
  //       success: true,
  //       doctor: doctorDetails
  //     });
  //   } catch (error) {
  //     console.error('❌ Erreur lors de la récupération des détails du médecin:', error);
  //     res.status(500).json({
  //       success: false,
  //       message: 'Erreur lors de la récupération des détails du médecin'
  //     });
  //   }
  // }
  async getDoctorDetails(req, res) {
  try {
    const { id } = req.params;
    
    console.log(`🔍 Recherche du médecin avec ID: ${id}`);
    
    if (!id) {
      console.log('❌ ID manquant');
      return res.status(400).json({
        success: false,
        message: 'ID du médecin requis'
      });
    }

    if (!prisma) {
      throw new Error('Prisma client non initialisé');
    }

    // Recherche du médecin avec ses informations utilisateur
    const doctor = await prisma.doctor.findUnique({
      where: {
        id: id
        // Suppression des filtres isActive/isVerified pour récupérer TOUS les médecins
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            profileImage: true,
            phone: true,
            isActive: true,
            isVerified: true
          }
        }
      }
    });

    console.log('🔎 Résultat de la recherche Prisma:', doctor ? 'Médecin trouvé' : 'Aucun médecin trouvé');

    if (!doctor) {
      console.log(`❌ Aucun médecin trouvé avec l'ID: ${id}`);
      return res.status(404).json({
        success: false,
        message: 'Médecin non trouvé',
        requestedId: id
      });
    }

    // Formatage des données du médecin
    const doctorDetails = {
      id: doctor.id,
      userId: doctor.user?.id,
      firstName: doctor.user?.firstName || 'Prénom non renseigné',
      lastName: doctor.user?.lastName || 'Nom non renseigné',
      fullName: `${doctor.user?.firstName || 'Dr.'} ${doctor.user?.lastName || 'Médecin'}`,
      email: doctor.user?.email,
      phone: doctor.phone || doctor.user?.phone,
      specialty: doctor.specialty || 'Spécialité non renseignée',
      licenseNumber: doctor.licenseNumber,
      experienceYears: doctor.experienceYears || 0,
      
      // Informations de contact
      address: doctor.address,
      city: doctor.city,
      zipCode: doctor.zipCode,
      
      // Informations professionnelles
      rating: doctor.averageRating || 0,
      reviewCount: doctor.totalReviews || 0,
      consultationFee: doctor.consultationFee || 0,
      
      // Informations supplémentaires
      profileImage: doctor.user?.profileImage,
      education: doctor.education,
      about: doctor.about,
      languages: doctor.languages || [],
      
      // Status et disponibilité
      verified: doctor.user?.isVerified || false,
      acceptsInsurance: doctor.acceptsInsurance || false,
      availableToday: doctor.isAvailableToday || false,
      nextAvailableSlot: doctor.nextAvailableSlot,
      
      // Métadonnées
      createdAt: doctor.createdAt,
      updatedAt: doctor.updatedAt
    };

    console.log(`✅ Détails du médecin ${doctorDetails.fullName} récupérés avec succès`);

    res.json({
      success: true,
      doctor: doctorDetails
    });
    
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des détails du médecin:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des détails du médecin',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
}

module.exports = new DoctorController();