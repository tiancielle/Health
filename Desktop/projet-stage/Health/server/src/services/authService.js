// src/services/authService.js
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { prisma } = require('../config/database');
const { generateTokenPair, verifyToken } = require('../config/jwt');
const config = require('../config/environment');

class AuthService {
  /**
   * Register a new user
   */
  async register(userData) {
    try {
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: userData.email.toLowerCase() }
      });

      if (existingUser) {
        throw new Error('User already exists with this email');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, config.security.bcryptRounds);

      // Create user with transaction
      const result = await prisma.$transaction(async (tx) => {
        // Create user
        const user = await tx.user.create({
          data: {
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email.toLowerCase(),
            password: hashedPassword,
            role: userData.role || 'patient', // ✅ Corrigé : minuscule
            phone: userData.phone || null,
            isActive: true,
            isVerified: false
          }
        });

        // Create patient profile if role is patient
        if (user.role === 'patient') { // ✅ Corrigé : minuscule
          await tx.patient.create({
            data: {
              userId: user.id,
              dateOfBirth: userData.dateOfBirth ? new Date(userData.dateOfBirth) : null,
              gender: userData.gender ? userData.gender.toLowerCase() : null // ✅ Corrigé : toLowerCase()
            }
          });
        }

        return user;
      });

      // Return user without sensitive data
      const { password, ...userWithoutPassword } = result;
      return {
        success: true,
        user: userWithoutPassword,
        message: 'User registered successfully'
      };

    } catch (error) {
      console.error('Registration error:', error);
      throw new Error(error.message || 'Registration failed');
    }
  }

  /**
   * Login user
   */
  async login(email, password) {
    try {
      // Find user with patient/doctor profile
      const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
        include: {
          patient: true,
          doctor: true
        }
      });

      if (!user) {
        throw new Error('Invalid email or password');
      }

      if (!user.isActive) {
        throw new Error('Account is deactivated');
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        throw new Error('Invalid email or password');
      }

      // Generate tokens
      const tokens = generateTokenPair(user);

      // Update last login
      await prisma.user.update({
        where: { id: user.id },
        data: {
          updatedAt: new Date()
        }
      });

      // Return user without sensitive data
      const { password: _, ...userWithoutPassword } = user;
      
      return {
        success: true,
        user: userWithoutPassword,
        tokens,
        message: 'Login successful'
      };

    } catch (error) {
      console.error('Login error:', error);
      throw new Error(error.message || 'Login failed');
    }
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken) {
    try {
      // Verify refresh token
      const decoded = verifyToken(refreshToken);
      
      // Find user
      const user = await prisma.user.findUnique({
        where: { 
          id: decoded.id,
          email: decoded.email 
        },
        include: {
          patient: true,
          doctor: true
        }
      });

      if (!user || !user.isActive) {
        throw new Error('Invalid refresh token');
      }

      // Generate new token pair
      const tokens = generateTokenPair(user);

      const { password, ...userWithoutPassword } = user;
      
      return {
        success: true,
        user: userWithoutPassword,
        tokens,
        message: 'Token refreshed successfully'
      };

    } catch (error) {
      console.error('Token refresh error:', error);
      throw new Error('Invalid or expired refresh token');
    }
  }

  /**
   * Get user profile
   */
  async getProfile(userId) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          patient: true,
          doctor: true
        }
      });

      if (!user) {
        throw new Error('User not found');
      }

      const { password, ...userWithoutPassword } = user;
      
      return {
        success: true,
        user: userWithoutPassword
      };

    } catch (error) {
      console.error('Get profile error:', error);
      throw new Error(error.message || 'Failed to get user profile');
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(userId, updateData) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        throw new Error('User not found');
      }

      // Prepare update data
      const updates = {};
      if (updateData.firstName) updates.firstName = updateData.firstName;
      if (updateData.lastName) updates.lastName = updateData.lastName;
      if (updateData.phone) updates.phone = updateData.phone;
      if (updateData.profileImage !== undefined) updates.profileImage = updateData.profileImage;

      // Update user
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: updates,
        include: {
          patient: true,
          doctor: true
        }
      });

      const { password, ...userWithoutPassword } = updatedUser;
      
      return {
        success: true,
        user: userWithoutPassword,
        message: 'Profile updated successfully'
      };

    } catch (error) {
      console.error('Update profile error:', error);
      throw new Error(error.message || 'Failed to update profile');
    }
  }

  /**
   * Change password
   */
  async changePassword(userId, currentPassword, newPassword) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        throw new Error('User not found');
      }

      // Verify current password
      const isValidPassword = await bcrypt.compare(currentPassword, user.password);
      if (!isValidPassword) {
        throw new Error('Current password is incorrect');
      }

      // Hash new password
      const hashedNewPassword = await bcrypt.hash(newPassword, config.security.bcryptRounds);

      // Update password
      await prisma.user.update({
        where: { id: userId },
        data: { password: hashedNewPassword }
      });

      return {
        success: true,
        message: 'Password changed successfully'
      };

    } catch (error) {
      console.error('Change password error:', error);
      throw new Error(error.message || 'Failed to change password');
    }
  }

  /**
   * Generate password reset token
   */
  async generatePasswordResetToken(email) {
    try {
      const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase() }
      });

      if (!user) {
        // Don't reveal if email exists
        return {
          success: true,
          message: 'If the email exists, a reset link has been sent'
        };
      }

      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpires = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour

      // Save token (in a real app, you might store this separately)
      await prisma.user.update({
        where: { id: user.id },
        data: {
          // Note: Add these fields to your Prisma schema if needed
          // passwordResetToken: resetToken,
          // passwordResetExpires: resetTokenExpires
        }
      });

      // In a real app, send email with reset link
      console.log(`Password reset token for ${email}: ${resetToken}`);

      return {
        success: true,
        message: 'If the email exists, a reset link has been sent',
        resetToken // Remove this in production
      };

    } catch (error) {
      console.error('Generate reset token error:', error);
      throw new Error('Failed to generate reset token');
    }
  }

  /**
   * Verify user by ID (for middleware)
   */
  async verifyUserById(userId) {
    try {
      const user = await prisma.user.findUnique({
        where: { 
          id: userId,
          isActive: true 
        },
        include: {
          patient: true,
          doctor: true
        }
      });

      if (!user) {
        return null;
      }

      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;

    } catch (error) {
      console.error('Verify user error:', error);
      return null;
    }
  }
}

module.exports = new AuthService();