// src/config/jwt.js
const jwt = require('jsonwebtoken');
const config = require('./environment');

/**
 * Generate Access Token (short-lived)
 */
const generateAccessToken = (payload) => {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
    issuer: 'health-api',
    audience: 'health-app'
  });
};

/**
 * Generate Refresh Token (long-lived)
 */
const generateRefreshToken = (payload) => {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.refreshExpiresIn,
    issuer: 'health-api',
    audience: 'health-app'
  });
};

/**
 * Verify Token
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, config.jwt.secret, {
      issuer: 'health-api',
      audience: 'health-app'
    });
  } catch (error) {
    throw new Error(`Invalid token: ${error.message}`);
  }
};

/**
 * Decode Token (without verification)
 */
const decodeToken = (token) => {
  return jwt.decode(token);
};

/**
 * Generate Token Pair (access + refresh)
 */
const generateTokenPair = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
    firstName: user.firstName,
    lastName: user.lastName
  };

  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken({ id: user.id, email: user.email })
  };
};

/**
 * Extract token from Authorization header
 */
const extractTokenFromHeader = (authHeader) => {
  if (!authHeader) return null;
  
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return null;
  
  return parts[1];
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
  decodeToken,
  generateTokenPair,
  extractTokenFromHeader
};