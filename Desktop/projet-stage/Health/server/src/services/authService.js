// src/services/authService.js
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { prisma } = require('../config/database');
const jwtConfig = require('../config/jwt');
const emailService = require('./emailService');
const config = require('../config/environment');

class AuthService {
  // Inscription d'un nouvel utilisateur
  async register(userData) {
    try {
      const { email, password, role, firstName, lastName, phone, dateOfBirth, gender } = userData;
      
      // Vérifier si l'utilisateur existe déjà
      const existingUser = await prisma.user.findUnique({
        where: { email: email.toLowerCase() }
      });
      
      if (existingUser) {
        throw new Error('Un utilisateur avec cet email existe déjà');
      }
      
      // Générer un token de vérification d'email
      const emailVerificationToken = crypto.randomBytes(32).toString('hex');
      const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 heures
      
      // Hasher le mot de passe
      const hashedPassword = await bcrypt.hash(password, config.security.bcryptRounds);
      
      // Créer l'utilisateur avec Prisma
      const user = await prisma.user.create({
        data: {
          email: email.toLowerCase(),
          password: hashedPassword,
          role: role?.toUpperCase() || 'PATIENT',
          firstName,
          lastName,
          phone,
          dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
          gender: gender?.toUpperCase(),
          emailVerificationToken,
          emailVerificationExpires,
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          isEmailVerified: true,
          createdAt: true
        }
      });
      
      // Créer le profil patient ou docteur selon le rôle
      if (user.role === 'PATIENT') {
        await prisma.patient.create({
          data: {
            userId: user.id,
            allergies: [],
            chronicDiseases: []
          }
        });
      } else if (user.role === 'DOCTOR') {
        // Pour les docteurs, on créera le profil après vérification admin
        console.log('Profil docteur à créer après validation admin');
      }
      
      // Envoyer l'email de vérification
      await emailService.sendVerificationEmail(user.email, emailVerificationToken);
      
      return {
        user,
        message: 'Utilisateur créé avec succès. Veuillez vérifier votre email.'
      };
    } catch (error) {
      throw new Error(`Erreur lors de l'inscription: ${error.message}`);
    }
  }
  
  // Connexion d'un utilisateur
  async login(email, password) {
    try {
      // Rechercher l'utilisateur avec ses relations
      const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
        include: {
          patient: true,
          doctor: {
            include: {
              specialty: true
            }
          }
        }
      });
      
      if (!user) {
        throw new Error('Email ou mot de passe incorrect');
      }
      
      // Vérifier si le compte est verrouillé
      if (user.lockUntil && user.lockUntil > new Date()) {
        throw new Error('Compte temporairement verrouillé. Réessayez plus tard.');
      }
      
      // Vérifier si le compte est actif
      if (!user.isActive) {
        throw new Error('Compte désactivé. Contactez l\'administrateur.');
      }
      
      // Vérifier le mot de passe
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        // Incrémenter les tentatives de connexion
        await this.incrementLoginAttempts(user.id, user.loginAttempts);
        throw new Error('Email ou mot de passe incorrect');
      }
      
      // Réinitialiser les tentatives de connexion
      if (user.loginAttempts > 0) {
        await this.resetLoginAttempts(user.id);
      }
      
      // Générer les tokens
      const tokenPayload = {
        userId: user.id,
        email: user.email,
        role: user.role
      };
      
      const tokens = jwtConfig.generateTokenPair(tokenPayload);
      
      // Sauvegarder le refresh token
      const refreshTokenExpires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 jours
      await prisma.user.update({
        where: { id: user.id },
        data: {
          refreshToken: tokens.refreshToken,
          refreshTokenExpires,
          lastLoginAt: new Date()
        }
      });
      
      // Exclure les données sensibles
      const { password: _, refreshToken: __, ...userWithoutSensitiveData } = user;
      
      return {
        user: userWithoutSensitiveData,
        tokens,
        message: 'Connexion réussie'
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }
  
  // Renouvellement du token d'accès
  async refreshToken(refreshToken) {
    try {
      // Vérifier le refresh token
      const decoded = jwtConfig.verifyToken(refreshToken);
      if (decoded.type !== 'refresh') {
        throw new Error('Token de refresh invalide');
      }
      
      // Rechercher l'utilisateur
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          email: true,
          role: true,
          refreshToken: true,
          refreshTokenExpires: true,
          isActive: true
        }
      });
      
      if (!user) {
        throw new Error('Utilisateur non trouvé');
      }
      
      if (!user.isActive) {
        throw new Error('Compte désactivé');
      }
      
      // Vérifier si le refresh token correspond
      if (user.refreshToken !== refreshToken || user.refreshTokenExpires < new Date()) {
        throw new Error('Refresh token expiré ou invalide');
      }
      
      // Générer un nouveau token d'accès
      const tokenPayload = {
        userId: user.id,
        email: user.email,
        role: user.role
      };
      
      const newAccessToken = jwtConfig.generateAccessToken(tokenPayload);
      
      return {
        accessToken: newAccessToken,
        user: {
          id: user.id,
          email: user.email,
          role: user.role
        },
        message: 'Token renouvelé avec succès'
      };
    } catch (error) {
      throw new Error(`Erreur lors du renouvellement du token: ${error.message}`);
    }
  }
  
  // Déconnexion
  async logout(userId) {
    try {
      await prisma.user.update({
        where: { id: userId },
        data: {
          refreshToken: null,
          refreshTokenExpires: null
        }
      });
      
      return { message: 'Déconnexion réussie' };
    } catch (error) {
      throw new Error(`Erreur lors de la déconnexion: ${error.message}`);
    }
  }
  
  // Vérification d'email
  async verifyEmail(token) {
    try {
      const user = await prisma.user.findFirst({
        where: {
          emailVerificationToken: token,
          emailVerificationExpires: {
            gt: new Date()
          }
        }
      });
      
      if (!user) {
        throw new Error('Token de vérification invalide ou expiré');
      }
      
      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: {
          isEmailVerified: true,
          emailVerificationToken: null,
          emailVerificationExpires: null
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          isEmailVerified: true
        }
      });
      
      return {
        user: updatedUser,
        message: 'Email vérifié avec succès'
      };
    } catch (error) {
      throw new Error(`Erreur lors de la vérification d'email: ${error.message}`);
    }
  }
  
  // Demande de réinitialisation de mot de passe
  async forgotPassword(email) {
    try {
      const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase() }
      });
      
      if (!user) {
        // Pour des raisons de sécurité, on ne révèle pas si l'email existe
        return { message: 'Si l\'email existe, un lien de réinitialisation a été envoyé.' };
      }
      
      // Générer un token de réinitialisation
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 heure
      
      await prisma.user.update({
        where: { id: user.id },
        data: {
          passwordResetToken: resetToken,
          passwordResetExpires: resetExpires
        }
      });
      
      // Envoyer l'email de réinitialisation
      await emailService.sendPasswordResetEmail(user.email, resetToken);
      
      return { message: 'Si l\'email existe, un lien de réinitialisation a été envoyé.' };
    } catch (error) {
      throw new Error(`Erreur lors de la demande de réinitialisation: ${error.message}`);
    }
  }
  
  // Réinitialisation du mot de passe
  async resetPassword(token, newPassword) {
    try {
      const user = await prisma.user.findFirst({
        where: {
          passwordResetToken: token,
          passwordResetExpires: {
            gt: new Date()
          }
        }
      });
      
      if (!user) {
        throw new Error('Token de réinitialisation invalide ou expiré');
      }
      
      // Hasher le nouveau mot de passe
      const hashedPassword = await bcrypt.hash(newPassword, config.security.bcryptRounds);
      
      // Mettre à jour le mot de passe
      await prisma.user.update({
        where: { id: user.id },
        data: {
          password: hashedPassword,
          passwordResetToken: null,
          passwordResetExpires: null,
          // Invalider tous les refresh tokens existants
          refreshToken: null,
          refreshTokenExpires: null
        }
      });
      
      return {
        message: 'Mot de passe réinitialisé avec succès'
      };
    } catch (error) {
      throw new Error(`Erreur lors de la réinitialisation: ${error.message}`);
    }
  }
  
  // Changement de mot de passe (utilisateur authentifié)
  async changePassword(userId, currentPassword, newPassword) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });
      
      if (!user) {
        throw new Error('Utilisateur non trouvé');
      }
      
      // Vérifier le mot de passe actuel
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isCurrentPasswordValid) {
        throw new Error('Mot de passe actuel incorrect');
      }
      
      // Hasher le nouveau mot de passe
      const hashedPassword = await bcrypt.hash(newPassword, config.security.bcryptRounds);
      
      // Mettre à jour le mot de passe
      await prisma.user.update({
        where: { id: userId },
        data: {
          password: hashedPassword,
          // Invalider tous les refresh tokens existants pour forcer une nouvelle connexion
          refreshToken: null,
          refreshTokenExpires: null
        }
      });
      
      return {
        message: 'Mot de passe modifié avec succès'
      };
    } catch (error) {
      throw new Error(`Erreur lors du changement de mot de passe: ${error.message}`);
    }
  }
  
  // Obtenir le profil utilisateur
  async getProfile(userId) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          role: true,
          firstName: true,
          lastName: true,
          phone: true,
          dateOfBirth: true,
          gender: true,
          profilePicture: true,
          isEmailVerified: true,
          lastLoginAt: true,
          createdAt: true,
        }
      });
      
      if (!user) {
        throw new Error('Utilisateur non trouvé');
      }
      
      return { user };
    } catch (error) {
      throw new Error(`Erreur lors de la récupération du profil: ${error.message}`);
    }
  }
  
  // Méthodes utilitaires
  async incrementLoginAttempts(userId, currentAttempts) {
    const updates = { loginAttempts: currentAttempts + 1 };
    
    // Si on atteint le maximum de tentatives, on verrouille le compte
    if (currentAttempts + 1 >= 5) {
      updates.lockUntil = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 heures
    }
    
    await prisma.user.update({
      where: { id: userId },
      data: updates
    });
  }
  
  async resetLoginAttempts(userId) {
    await prisma.user.update({
      where: { id: userId },
      data: {
        loginAttempts: 0,
        lockUntil: null
      }
    });
  }
  
  // Obtenir les statistiques d'authentification
  async getAuthStats() {
    try {
      const [totalUsers, activeUsers, verifiedUsers, usersByRole] = await Promise.all([
        prisma.user.count(),
        prisma.user.count({ where: { isActive: true } }),
        prisma.user.count({ where: { isEmailVerified: true } }),
        prisma.user.groupBy({
          by: ['role'],
          _count: {
            role: true
          }
        })
      ]);
      
      const lockedUsers = await prisma.user.count({
        where: {
          lockUntil: {
            gt: new Date()
          }
        }
      });
      
      return {
        totalUsers,
        activeUsers,
        verifiedUsers,
        lockedUsers,
        usersByRole: usersByRole.map(item => ({
          role: item.role,
          count: item._count.role
        }))
      };
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des statistiques: ${error.message}`);
    }
  }
}

module.exports = new AuthService();