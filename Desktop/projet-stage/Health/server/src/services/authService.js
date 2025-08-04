const crypto = require('crypto');
const { User } = require('../models/postgresql');
const jwtConfig = require('../config/jwt');
const emailService = require('./emailService');
const config = require('../config/environment');

class AuthService {
  // Inscription d'un nouvel utilisateur
  async register(userData) {
    try {
      const { email, password, role, firstName, lastName, phone, dateOfBirth, gender } = userData;
      
      // Vérifier si l'utilisateur existe déjà
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        throw new Error('Un utilisateur avec cet email existe déjà');
      }
      
      // Générer un token de vérification d'email
      const emailVerificationToken = crypto.randomBytes(32).toString('hex');
      const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 heures
      
      // Créer l'utilisateur
      const user = await User.create({
        email: email.toLowerCase(),
        password,
        role: role || 'patient',
        firstName,
        lastName,
        phone,
        dateOfBirth,
        gender,
        emailVerificationToken,
        emailVerificationExpires,
      });
      
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
      // Rechercher l'utilisateur
      const user = await User.findByEmail(email);
      if (!user) {
        throw new Error('Email ou mot de passe incorrect');
      }
      
      // Vérifier si le compte est verrouillé
      if (user.isLocked()) {
        throw new Error('Compte temporairement verrouillé. Réessayez plus tard.');
      }
      
      // Vérifier si le compte est actif
      if (!user.isActive) {
        throw new Error('Compte désactivé. Contactez l\'administrateur.');
      }
      
      // Vérifier le mot de passe
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        await user.incrementLoginAttempts();
        throw new Error('Email ou mot de passe incorrect');
      }
      
      // Réinitialiser les tentatives de connexion
      if (user.loginAttempts > 0) {
        await user.resetLoginAttempts();
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
      await user.update({
        refreshToken: tokens.refreshToken,
        refreshTokenExpires,
        lastLoginAt: new Date()
      });
      
      return {
        user,
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
      const user = await User.findByPk(decoded.userId);
      if (!user) {
        throw new Error('Utilisateur non trouvé');
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
        user,
        message: 'Token renouvelé avec succès'
      };
    } catch (error) {
      throw new Error(`Erreur lors du renouvellement du token: ${error.message}`);
    }
  }
  
  // Déconnexion
  async logout(userId) {
    try {
      const user = await User.findByPk(userId);
      if (!user) {
        throw new Error('Utilisateur non trouvé');
      }
      
      // Supprimer le refresh token
      await user.update({
        refreshToken: null,
        refreshTokenExpires: null
      });
      
      return { message: 'Déconnexion réussie' };
    } catch (error) {
      throw new Error(`Erreur lors de la déconnexion: ${error.message}`);
    }
  }
  
  // Vérification d'email
  async verifyEmail(token) {
    try {
      const user = await User.findByVerificationToken(token);
      if (!user) {
        throw new Error('Token de vérification invalide ou expiré');
      }
      
      await user.update({
        isEmailVerified: true,
        emailVerificationToken: null,
        emailVerificationExpires: null
      });
      
      return {
        user,
        message: 'Email vérifié avec succès'
      };
    } catch (error) {
      throw new Error(`Erreur lors de la vérification d'email: ${error.message}`);
    }
  }
  
  // Demande de réinitialisation de mot de passe
  async forgotPassword(email) {
    try {
      const user = await User.findByEmail(email);
      if (!user) {
        // Pour des raisons de sécurité, on ne révèle pas si l'email existe
        return { message: 'Si l\'email existe, un lien de réinitialisation a été envoyé.' };
      }
      
      // Générer un token de réinitialisation
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 heure
      
      await user.update({
        passwordResetToken: resetToken,
        passwordResetExpires: resetExpires
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
      const user = await User.findByResetToken(token);
      if (!user) {
        throw new Error('Token de réinitialisation invalide ou expiré');
      }
      
      // Mettre à jour le mot de passe
      await user.update({
        password: newPassword,
        passwordResetToken: null,
        passwordResetExpires: null,
        // Invalider tous les refresh tokens existants
        refreshToken: null,
        refreshTokenExpires: null
      });
      
      return {
        user,
        message: 'Mot de passe réinitialisé avec succès'
      };
    } catch (error) {
      throw new Error(`Erreur lors de la réinitialisation: ${error.message}`);
    }
  }
  
  // Changement de mot de passe (utilisateur authentifié)
  async changePassword(userId, currentPassword, newPassword) {
    try {
      const user = await User.findByPk(userId);
      if (!user) {
        throw new Error('Utilisateur non trouvé');
      }
      
      // Vérifier le mot de passe actuel
      const isCurrentPasswordValid = await user.comparePassword(currentPassword);
      if (!isCurrentPasswordValid) {
        throw new Error('Mot de passe actuel incorrect');
      }
      
      // Mettre à jour le mot de passe
      await user.update({
        password: newPassword,
        // Invalider tous les refresh tokens existants pour forcer une nouvelle connexion
        refreshToken: null,
        refreshTokenExpires: null
      });
      
      return {
        user,
        message: 'Mot de passe modifié avec succès'
      };
    } catch (error) {
      throw new Error(`Erreur lors du changement de mot de passe: ${error.message}`);
    }
  }
  
  // Obtenir le profil utilisateur
  async getProfile(userId) {
    try {
      const user = await User.findByPk(userId);
      if (!user) {
        throw new Error('Utilisateur non trouvé');
      }
      
      return { user };
    } catch (error) {
      throw new Error(`Erreur lors de la récupération du profil: ${error.message}`);
    }
  }
  
  // Mise à jour du profil
  async updateProfile(userId, updateData) {
    try {
      const user = await User.findByPk(userId);
      if (!user) {
        throw new Error('Utilisateur non trouvé');
      }
      
      // Champs autorisés pour la mise à jour
      const allowedFields = ['firstName', 'lastName', 'phone', 'dateOfBirth', 'gender', 'profilePicture'];
      const filteredData = {};
      
      Object.keys(updateData).forEach(key => {
        if (allowedFields.includes(key)) {
          filteredData[key] = updateData[key];
        }
      });
      
      await user.update(filteredData);
      
      return {
        user,
        message: 'Profil mis à jour avec succès'
      };
    } catch (error) {
      throw new Error(`Erreur lors de la mise à jour du profil: ${error.message}`);
    }
  }
  
  // Renvoyer l'email de vérification
  async resendVerificationEmail(email) {
    try {
      const user = await User.findByEmail(email);
      if (!user) {
        return { message: 'Si l\'email existe, un nouveau lien de vérification a été envoyé.' };
      }
      
      if (user.isEmailVerified) {
        throw new Error('Email déjà vérifié');
      }
      
      // Générer un nouveau token
      const emailVerificationToken = crypto.randomBytes(32).toString('hex');
      const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 heures
      
      await user.update({
        emailVerificationToken,
        emailVerificationExpires
      });
      
      // Envoyer l'email
      await emailService.sendVerificationEmail(user.email, emailVerificationToken);
      
      return { message: 'Si l\'email existe, un nouveau lien de vérification a été envoyé.' };
    } catch (error) {
      throw new Error(`Erreur lors du renvoi de l'email: ${error.message}`);
    }
  }
  
  // Désactiver un compte
  async deactivateAccount(userId) {
    try {
      const user = await User.findByPk(userId);
      if (!user) {
        throw new Error('Utilisateur non trouvé');
      }
      
      await user.update({
        isActive: false,
        refreshToken: null,
        refreshTokenExpires: null
      });
      
      return {
        user,
        message: 'Compte désactivé avec succès'
      };
    } catch (error) {
      throw new Error(`Erreur lors de la désactivation: ${error.message}`);
    }
  }
  
  // Réactiver un compte
  async reactivateAccount(userId) {
    try {
      const user = await User.findByPk(userId);
      if (!user) {
        throw new Error('Utilisateur non trouvé');
      }
      
      await user.update({
        isActive: true,
        loginAttempts: 0,
        lockUntil: null
      });
      
      return {
        user,
        message: 'Compte réactivé avec succès'
      };
    } catch (error) {
      throw new Error(`Erreur lors de la réactivation: ${error.message}`);
    }
  }
  
  // Vérifier si un email est disponible
  async checkEmailAvailability(email) {
    try {
      const user = await User.findByEmail(email);
      return {
        available: !user,
        message: user ? 'Email déjà utilisé' : 'Email disponible'
      };
    } catch (error) {
      throw new Error(`Erreur lors de la vérification: ${error.message}`);
    }
  }
  
  // Obtenir les statistiques d'authentification
  async getAuthStats() {
    try {
      const totalUsers = await User.count();
      const activeUsers = await User.count({ where: { isActive: true } });
      const verifiedUsers = await User.count({ where: { isEmailVerified: true } });
      const lockedUsers = await User.count({
        where: {
          lockUntil: {
            [User.sequelize.Sequelize.Op.gt]: new Date()
          }
        }
      });
      
      const usersByRole = await User.findAll({
        attributes: ['role', [User.sequelize.fn('COUNT', User.sequelize.col('role')), 'count']],
        group: ['role']
      });
      
      return {
        totalUsers,
        activeUsers,
        verifiedUsers,
        lockedUsers,
        usersByRole: usersByRole.map(item => ({
          role: item.role,
          count: parseInt(item.dataValues.count)
        }))
      };
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des statistiques: ${error.message}`);
    }
  }
}

module.exports = new AuthService();