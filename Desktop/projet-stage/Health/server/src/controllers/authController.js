const authService = require('../services/authService');
const { validationResult } = require('express-validator');

class AuthController {
  // Inscription
  async register(req, res) {
    try {
      // Vérifier les erreurs de validation
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Données invalides',
          errors: errors.array()
        });
      }

      const result = await authService.register(req.body);
      
      res.status(201).json({
        success: true,
        message: result.message,
        data: {
          user: result.user
        }
      });
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Connexion
  async login(req, res) {
    try {
      // Vérifier les erreurs de validation
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Données invalides',
          errors: errors.array()
        });
      }

      const { email, password } = req.body;
      const result = await authService.login(email, password);
      
      // Définir le refresh token dans un cookie httpOnly
      res.cookie('refreshToken', result.tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 jours
      });

      res.status(200).json({
        success: true,
        message: result.message,
        data: {
          user: result.user,
          accessToken: result.tokens.accessToken,
          expiresIn: result.tokens.expiresIn
        }
      });
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      res.status(401).json({
        success: false,
        message: error.message
      });
    }
  }

  // Renouvellement du token
  async refreshToken(req, res) {
    try {
      const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
      
      if (!refreshToken) {
        return res.status(401).json({
          success: false,
          message: 'Refresh token manquant'
        });
      }

      const result = await authService.refreshToken(refreshToken);
      
      res.status(200).json({
        success: true,
        message: result.message,
        data: {
          user: result.user,
          accessToken: result.accessToken
        }
      });
    } catch (error) {
      console.error('Erreur lors du renouvellement du token:', error);
      res.status(401).json({
        success: false,
        message: error.message
      });
    }
  }

  // Déconnexion
  async logout(req, res) {
    try {
      await authService.logout(req.user.userId);
      
      // Supprimer le cookie refresh token
      res.clearCookie('refreshToken');
      
      res.status(200).json({
        success: true,
        message: 'Déconnexion réussie'
      });
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Vérification d'email
  async verifyEmail(req, res) {
    try {
      const { token } = req.params;
      const result = await authService.verifyEmail(token);
      
      res.status(200).json({
        success: true,
        message: result.message,
        data: {
          user: result.user
        }
      });
    } catch (error) {
      console.error('Erreur lors de la vérification d\'email:', error);
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Demande de réinitialisation de mot de passe
  async forgotPassword(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Email invalide',
          errors: errors.array()
        });
      }

      const { email } = req.body;
      const result = await authService.forgotPassword(email);
      
      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      console.error('Erreur lors de la demande de réinitialisation:', error);
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Réinitialisation du mot de passe
  async resetPassword(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Données invalides',
          errors: errors.array()
        });
      }

      const { token } = req.params;
      const { password } = req.body;
      const result = await authService.resetPassword(token, password);
      
      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      console.error('Erreur lors de la réinitialisation:', error);
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Changement de mot de passe
  async changePassword(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Données invalides',
          errors: errors.array()
        });
      }

      const { currentPassword, newPassword } = req.body;
      const result = await authService.changePassword(req.user.userId, currentPassword, newPassword);
      
      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      console.error('Erreur lors du changement de mot de passe:', error);
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Obtenir le profil
  async getProfile(req, res) {
    try {
      const result = await authService.getProfile(req.user.userId);
      
      res.status(200).json({
        success: true,
        data: {
          user: result.user
        }
      });
    } catch (error) {
      console.error('Erreur lors de la récupération du profil:', error);
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Mise à jour du profil
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

      const result = await authService.updateProfile(req.user.userId, req.body);
      
      res.status(200).json({
        success: true,
        message: result.message,
        data: {
          user: result.user
        }
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Renvoyer l'email de vérification
  async resendVerificationEmail(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Email invalide',
          errors: errors.array()
        });
      }

      const { email } = req.body;
      const result = await authService.resendVerificationEmail(email);
      
      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      console.error('Erreur lors du renvoi de l\'email:', error);
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Vérifier la disponibilité d'un email
  async checkEmailAvailability(req, res) {
    try {
      const { email } = req.query;
      
      if (!email) {
        return res.status(400).json({
          success: false,
          message: 'Email requis'
        });
      }

      const result = await authService.checkEmailAvailability(email);
      
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Erreur lors de la vérification de disponibilité:', error);
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Désactiver le compte
  async deactivateAccount(req, res) {
    try {
      const result = await authService.deactivateAccount(req.user.userId);
      
      // Supprimer le cookie refresh token
      res.clearCookie('refreshToken');
      
      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      console.error('Erreur lors de la désactivation:', error);
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Obtenir les informations de l'utilisateur actuel
  async getCurrentUser(req, res) {
    try {
      const result = await authService.getProfile(req.user.userId);
      
      res.status(200).json({
        success: true,
        data: {
          user: result.user,
          permissions: this.getUserPermissions(result.user.role)
        }
      });
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error);
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Obtenir les permissions selon le rôle
  getUserPermissions(role) {
    const permissions = {
      patient: [
        'view_own_profile',
        'update_own_profile',
        'book_appointments',
        'view_own_appointments',
        'view_own_medical_records'
      ],
      doctor: [
        'view_own_profile',
        'update_own_profile',
        'view_appointments',
        'manage_appointments',
        'view_patients',
        'create_medical_records',
        'view_medical_records'
      ],
      admin: [
        'view_all_users',
        'manage_users',
        'view_all_appointments',
        'manage_appointments',
        'view_analytics',
        'manage_system'
      ]
    };

    return permissions[role] || [];
  }

  // Obtenir les statistiques (admin uniquement)
  async getAuthStats(req, res) {
    try {
      const result = await authService.getAuthStats();
      
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new AuthController();