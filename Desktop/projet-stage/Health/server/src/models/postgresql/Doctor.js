// server/src/models/postgresql/Doctor.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Doctor = sequelize.define('Doctor', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  licenseNumber: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
    validate: {
      notEmpty: true
    }
  },
  specialty: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 100]
    }
  },
  subSpecialty: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: [0, 100]
    }
  },
  averageRating: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 0.0,
    validate: {
      min: 0,
      max: 5
    }
  },
  totalReviews: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  consultationFee: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    validate: {
      min: 0
    }
  },
  currency: {
    type: DataTypes.STRING(3),
    defaultValue: 'USD',
    validate: {
      isIn: [['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'MAD']]
    }
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isAvailableToday: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  nextAvailableSlot: {
    type: DataTypes.STRING,
    allowNull: true
  },
  // Informations de contact et localisation
  address: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  city: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: [0, 100]
    }
  },
  state: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: [0, 100]
    }
  },
  zipCode: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  country: {
    type: DataTypes.STRING(2),
    defaultValue: 'US',
    validate: {
      isIn: [['US', 'CA', 'GB', 'FR', 'DE', 'MA', 'AU']]
    }
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: true,
    validate: {
      is: /^[\+]?[0-9\s\-\(\)]{10,20}$/
    }
  },
  officePhone: {
    type: DataTypes.STRING(20),
    allowNull: true,
    validate: {
      is: /^[\+]?[0-9\s\-\(\)]{10,20}$/
    }
  },
  // Coordonnées géographiques pour recherche par distance
  latitude: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: true,
    validate: {
      min: -90,
      max: 90
    }
  },
  longitude: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: true,
    validate: {
      min: -180,
      max: 180
    }
  },
  // Informations professionnelles
  languages: {
    type: DataTypes.JSON,
    defaultValue: ['English'],
    validate: {
      isArray(value) {
        if (!Array.isArray(value)) {
          throw new Error('Languages must be an array');
        }
      }
    }
  },
  experienceYears: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0,
      max: 70
    }
  },
  education: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  certifications: {
    type: DataTypes.JSON,
    allowNull: true
  },
  about: {
    type: DataTypes.TEXT,
    allowNull: true,
    validate: {
      len: [0, 2000]
    }
  },
  // Paramètres de pratique
  acceptsInsurance: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  acceptsNewPatients: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  telemedicineAvailable: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  emergencyServices: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  // Informations de disponibilité
  workingHours: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Format: {"monday": {"start": "09:00", "end": "17:00", "isWorking": true}, ...}'
  },
  consultationDuration: {
    type: DataTypes.INTEGER,
    defaultValue: 30,
    validate: {
      min: 15,
      max: 120
    },
    comment: 'Duration in minutes'
  },
  appointmentBuffer: {
    type: DataTypes.INTEGER,
    defaultValue: 15,
    validate: {
      min: 0,
      max: 60
    },
    comment: 'Buffer time between appointments in minutes'
  },
  // Statistiques et métadonnées
  totalAppointments: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  completedAppointments: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  cancelledAppointments: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  responseTime: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Average response time in minutes'
  },
  lastActiveDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  // Informations de vérification
  verificationDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  verificationDocuments: {
    type: DataTypes.JSON,
    allowNull: true
  },
  // Paramètres de notification
  emailNotifications: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  smsNotifications: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  // Informations financières
  paymentMethods: {
    type: DataTypes.JSON,
    defaultValue: ['cash', 'card', 'insurance'],
    validate: {
      isArray(value) {
        if (!Array.isArray(value)) {
          throw new Error('Payment methods must be an array');
        }
      }
    }
  },
  taxId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  // Métadonnées pour l'administration
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Internal notes for admin use'
  },
  tags: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Tags for categorization and search'
  },
  // Timestamps automatiques
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'doctors',
  timestamps: true,
  indexes: [
    {
      fields: ['userId']
    },
    {
      fields: ['specialty']
    },
    {
      fields: ['city']
    },
    {
      fields: ['zipCode']
    },
    {
      fields: ['isActive', 'isVerified']
    },
    {
      fields: ['averageRating']
    },
    {
      fields: ['licenseNumber'],
      unique: true
    },
    {
      fields: ['latitude', 'longitude']
    },
    {
      fields: ['createdAt']
    }
  ],
  hooks: {
    // Hook avant la création
    beforeCreate: async (doctor, options) => {
      // Normaliser la spécialité
      if (doctor.specialty) {
        doctor.specialty = doctor.specialty.trim();
      }
      
      // Normaliser la ville
      if (doctor.city) {
        doctor.city = doctor.city.trim();
      }

      // Définir la date de dernière activité
      doctor.lastActiveDate = new Date();
    },
    
    // Hook avant la mise à jour
    beforeUpdate: async (doctor, options) => {
      // Mettre à jour la date de dernière activité si des champs importants changent
      const importantFields = ['isActive', 'consultationFee', 'workingHours', 'acceptsNewPatients'];
      const changedFields = Object.keys(doctor.changed());
      
      if (importantFields.some(field => changedFields.includes(field))) {
        doctor.lastActiveDate = new Date();
      }
    }
  },
  scopes: {
    // Scope pour les médecins actifs et vérifiés
    active: {
      where: {
        isActive: true,
        isVerified: true
      }
    },
    
    // Scope pour les médecins acceptant de nouveaux patients
    acceptingPatients: {
      where: {
        acceptsNewPatients: true,
        isActive: true,
        isVerified: true
      }
    },
    
    // Scope pour les médecins avec télémédecine
    telemedicine: {
      where: {
        telemedicineAvailable: true,
        isActive: true,
        isVerified: true
      }
    },
    
    // Scope pour recherche par localisation
    inLocation: (city) => ({
      where: {
        city: {
          [sequelize.Sequelize.Op.iLike]: `%${city}%`
        },
        isActive: true,
        isVerified: true
      }
    }),
    
    // Scope pour recherche par spécialité
    bySpecialty: (specialty) => ({
      where: {
        [sequelize.Sequelize.Op.or]: [
          {
            specialty: {
              [sequelize.Sequelize.Op.iLike]: `%${specialty}%`
            }
          },
          {
            subSpecialty: {
              [sequelize.Sequelize.Op.iLike]: `%${specialty}%`
            }
          }
        ],
        isActive: true,
        isVerified: true
      }
    })
  }
});

// Méthodes d'instance
Doctor.prototype.getFullName = function() {
  // Cette méthode nécessitera l'inclusion de l'utilisateur associé
  return `Dr. ${this.User?.firstName || ''} ${this.User?.lastName || ''}`.trim();
};

Doctor.prototype.getCompletionRate = function() {
  if (this.totalAppointments === 0) return 0;
  return ((this.completedAppointments / this.totalAppointments) * 100).toFixed(2);
};

Doctor.prototype.getCancellationRate = function() {
  if (this.totalAppointments === 0) return 0;
  return ((this.cancelledAppointments / this.totalAppointments) * 100).toFixed(2);
};

Doctor.prototype.isAvailableNow = function() {
  const now = new Date();
  const currentDay = now.toLocaleLowerCase();
  const currentTime = now.toTimeString().slice(0, 5); // HH:MM format
  
  if (!this.workingHours || !this.workingHours[currentDay]) {
    return false;
  }
  
  const todaySchedule = this.workingHours[currentDay];
  if (!todaySchedule.isWorking) {
    return false;
  }
  
  return currentTime >= todaySchedule.start && currentTime <= todaySchedule.end;
};

// Méthodes de classe statiques
Doctor.findBySpecialty = function(specialty, options = {}) {
  return this.scope({ method: ['bySpecialty', specialty] }).findAll(options);
};

Doctor.findInLocation = function(city, options = {}) {
  return this.scope({ method: ['inLocation', city] }).findAll(options);
};

Doctor.findActive = function(options = {}) {
  return this.scope('active').findAll(options);
};

module.exports = Doctor;