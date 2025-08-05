const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const config = require('./environment');

class JWTConfig {
  constructor() {
    this.secret = config.jwt.secret;
    this.expiresIn = config.jwt.expiresIn;
    this.refreshExpiresIn = config.jwt.refreshExpiresIn;
    
    // Charger les clés RSA si elles existent
    this.loadRSAKeys();
  }
  
  loadRSAKeys() {
    try {
      const privateKeyPath = config.jwt.privateKeyPath;
      const publicKeyPath = config.jwt.publicKeyPath;
      
      if (fs.existsSync(privateKeyPath) && fs.existsSync(publicKeyPath)) {
        this.privateKey = fs.readFileSync(privateKeyPath, 'utf8');
        this.publicKey = fs.readFileSync(publicKeyPath, 'utf8');
        this.useRSA = true;
        console.log(' Clés RSA chargées avec succès');
      } else {
        this.useRSA = false;
        console.log(' Clés RSA non trouvées, utilisation du secret partagé');
      }
    } catch (error) {
      console.error(' Erreur lors du chargement des clés RSA:', error.message);
      this.useRSA = false;
    }
  }
  
  // Générer un token d'accès
  generateAccessToken(payload) {
    const tokenPayload = {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
      type: 'access'
    };
    
    const options = {
      expiresIn: this.expiresIn,
      issuer: 'health-system',
      audience: 'health-system-users',
    };
    
    if (this.useRSA) {
      return jwt.sign(tokenPayload, this.privateKey, {
        ...options,
        algorithm: 'RS256'
      });
    } else {
      return jwt.sign(tokenPayload, this.secret, options);
    }
  }
  
  // Générer un token de refresh
  generateRefreshToken(payload) {
    const tokenPayload = {
      userId: payload.userId,
      type: 'refresh'
    };
    
    const options = {
      expiresIn: this.refreshExpiresIn,
      issuer: 'health-system',
      audience: 'health-system-users',
    };
    
    if (this.useRSA) {
      return jwt.sign(tokenPayload, this.privateKey, {
        ...options,
        algorithm: 'RS256'
      });
    } else {
      return jwt.sign(tokenPayload, this.secret, options);
    }
  }
  
  // Vérifier un token
  verifyToken(token) {
    try {
      const options = {
        issuer: 'health-system',
        audience: 'health-system-users',
      };
      
      if (this.useRSA) {
        return jwt.verify(token, this.publicKey, {
          ...options,
          algorithms: ['RS256']
        });
      } else {
        return jwt.verify(token, this.secret, options);
      }
    } catch (error) {
      throw new Error(`Token invalide: ${error.message}`);
    }
  }
  
  // Décoder un token sans vérification (pour debugging)
  decodeToken(token) {
    return jwt.decode(token, { complete: true });
  }
  
  // Générer une paire de tokens
  generateTokenPair(payload) {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
      expiresIn: this.expiresIn
    };
  }
  
  // Vérifier si un token est expiré
  isTokenExpired(token) {
    try {
      const decoded = this.decodeToken(token);
      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.payload.exp < currentTime;
    } catch (error) {
      return true;
    }
  }
  
  // Extraire le payload d'un token
  extractPayload(token) {
    try {
      const decoded = this.verifyToken(token);
      return {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role,
        type: decoded.type
      };
    } catch (error) {
      throw new Error(`Impossible d'extraire le payload: ${error.message}`);
    }
  }
}

module.exports = new JWTConfig();