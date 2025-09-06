// src/controllers/authController.js
const authService = require('../services/authService');

class AuthController {
  /**
   * Register new user
   * POST /api/auth/register
   */
  async register(req, res) {
    try {
      const {
        firstName,
        lastName,
        email,
        password,
        role,
        phone,
        dateOfBirth,
        gender
      } = req.body;
      
      // Basic validation
      if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({
          success: false,
          message: 'First name, last name, email, and password are required'
        });
      }

      if (password.length < 8) {
        return res.status(400).json({
          success: false,
          message: 'Password must be at least 8 characters long'
        });
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid email format'
        });
      }

      const result = await authService.register({
        firstName,
        lastName,
        email,
        password,
        role,
        phone,
        dateOfBirth,
        gender
      });

      res.status(201).json(result);

    } catch (error) {
      console.error('Registration error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Registration failed'
      });
    }
  }

  /**
   * User login
   * POST /api/auth/login
   */
  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email and password are required'
        });
      }

      const result = await authService.login(email, password);

      // Set HTTP-only cookie for refresh token (optional, more secure)
      res.cookie('refreshToken', result.tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
      });

      res.status(200).json(result);

    } catch (error) {
      console.error('Login error:', error);
      res.status(401).json({
        success: false,
        message: error.message || 'Login failed'
      });
    }
  }

  /**
   * Refresh access token
   * POST /api/auth/refresh
   */
  async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;
      const cookieRefreshToken = req.cookies?.refreshToken;

      const tokenToUse = refreshToken || cookieRefreshToken;

      if (!tokenToUse) {
        return res.status(401).json({
          success: false,
          message: 'Refresh token is required'
        });
      }

      const result = await authService.refreshToken(tokenToUse);

      // Update refresh token cookie
      res.cookie('refreshToken', result.tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000
      });

      res.status(200).json(result);

    } catch (error) {
      console.error('Token refresh error:', error);
      res.status(401).json({
        success: false,
        message: error.message || 'Token refresh failed'
      });
    }
  }

  /**
   * Get current user profile
   * GET /api/auth/profile
   */
  async getProfile(req, res) {
    try {
      const result = await authService.getProfile(req.user.id);
      res.status(200).json(result);

    } catch (error) {
      console.error('Get profile error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to get profile'
      });
    }
  }

  /**
   * Update user profile
   * PUT /api/auth/profile
   */
  async updateProfile(req, res) {
    try {
      const {
        firstName,
        lastName,
        phone,
        profileImage
      } = req.body;

      const result = await authService.updateProfile(req.user.id, {
        firstName,
        lastName,
        phone,
        profileImage
      });

      res.status(200).json(result);

    } catch (error) {
      console.error('Update profile error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to update profile'
      });
    }
  }

  /**
   * Change password
   * PUT /api/auth/change-password
   */
  async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          message: 'Current password and new password are required'
        });
      }

      if (newPassword.length < 8) {
        return res.status(400).json({
          success: false,
          message: 'New password must be at least 8 characters long'
        });
      }

      const result = await authService.changePassword(
        req.user.id,
        currentPassword,
        newPassword
      );

      res.status(200).json(result);

    } catch (error) {
      console.error('Change password error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to change password'
      });
    }
  }

  /**
   * Request password reset
   * POST /api/auth/forgot-password
   */
  async forgotPassword(req, res) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          message: 'Email is required'
        });
      }

      const result = await authService.generatePasswordResetToken(email);
      res.status(200).json(result);

    } catch (error) {
      console.error('Forgot password error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to process password reset request'
      });
    }
  }

  /**
   * Logout user
   * POST /api/auth/logout
   */
  async logout(req, res) {
    try {
      // Clear refresh token cookie
      res.clearCookie('refreshToken');

      res.status(200).json({
        success: true,
        message: 'Logged out successfully'
      });

    } catch (error) {
      console.error('Logout error:', error);
      res.status(400).json({
        success: false,
        message: 'Logout failed'
      });
    }
  }

  /**
   * Verify token (for testing)
   * GET /api/auth/verify
   */
  async verifyToken(req, res) {
    try {
      res.status(200).json({
        success: true,
        user: req.user,
        message: 'Token is valid'
      });

    } catch (error) {
      console.error('Token verification error:', error);
      res.status(401).json({
        success: false,
        message: 'Token verification failed'
      });
    }
  }
}

module.exports = new AuthController();