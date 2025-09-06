// src/utils/encryption.js
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const config = require('../config/environment');

/**
 * Hash password using bcrypt
 */
const hashPassword = async (password) => {
  try {
    return await bcrypt.hash(password, config.security.bcryptRounds);
  } catch (error) {
    console.error('Password hashing error:', error);
    throw new Error('Password hashing failed');
  }
};

/**
 * Compare password with hash
 */
const comparePassword = async (plainPassword, hashedPassword) => {
  try {
    return await bcrypt.compare(plainPassword, hashedPassword);
  } catch (error) {
    console.error('Password comparison error:', error);
    return false;
  }
};

/**
 * Generate secure random token
 */
const generateSecureToken = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

/**
 * Generate verification code (6-digit numeric)
 */
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Hash data using SHA-256
 */
const hashData = (data) => {
  return crypto.createHash('sha256').update(data).digest('hex');
};

/**
 * Encrypt sensitive data (AES-256-GCM)
 */
const encryptData = (text, secretKey = config.jwt.secret) => {
  try {
    const algorithm = 'aes-256-gcm';
    const key = crypto.scryptSync(secretKey, 'salt', 32);
    const iv = crypto.randomBytes(16);
    
    const cipher = crypto.createCipher(algorithm, key);
    cipher.setAAD(Buffer.from('health-system', 'utf8'));
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag();
    
    return {
      encrypted,
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex')
    };
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Data encryption failed');
  }
};

/**
 * Decrypt sensitive data (AES-256-GCM)
 */
const decryptData = (encryptedData, secretKey = config.jwt.secret) => {
  try {
    const algorithm = 'aes-256-gcm';
    const key = crypto.scryptSync(secretKey, 'salt', 32);
    const iv = Buffer.from(encryptedData.iv, 'hex');
    const authTag = Buffer.from(encryptedData.authTag, 'hex');
    
    const decipher = crypto.createDecipher(algorithm, key);
    decipher.setAuthTag(authTag);
    decipher.setAAD(Buffer.from('health-system', 'utf8'));
    
    let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Data decryption failed');
  }
};

/**
 * Generate HMAC signature
 */
const generateHMAC = (data, secret = config.jwt.secret) => {
  return crypto.createHmac('sha256', secret).update(data).digest('hex');
};

/**
 * Verify HMAC signature
 */
const verifyHMAC = (data, signature, secret = config.jwt.secret) => {
  const expectedSignature = generateHMAC(data, secret);
  return crypto.timingSafeEqual(
    Buffer.from(signature, 'hex'),
    Buffer.from(expectedSignature, 'hex')
  );
};

/**
 * Generate random salt
 */
const generateSalt = (length = 16) => {
  return crypto.randomBytes(length).toString('hex');
};

/**
 * Hash password with custom salt
 */
const hashPasswordWithSalt = async (password, salt) => {
  try {
    return await bcrypt.hash(password + salt, config.security.bcryptRounds);
  } catch (error) {
    console.error('Password hashing with salt error:', error);
    throw new Error('Password hashing failed');
  }
};

/**
 * Generate secure session ID
 */
const generateSessionId = () => {
  const timestamp = Date.now().toString();
  const randomBytes = crypto.randomBytes(16).toString('hex');
  return hashData(timestamp + randomBytes);
};

/**
 * Encrypt medical data (with additional security)
 */
const encryptMedicalData = (data) => {
  try {
    const jsonString = JSON.stringify(data);
    const compressed = Buffer.from(jsonString).toString('base64');
    return encryptData(compressed);
  } catch (error) {
    console.error('Medical data encryption error:', error);
    throw new Error('Medical data encryption failed');
  }
};

/**
 * Decrypt medical data
 */
const decryptMedicalData = (encryptedData) => {
  try {
    const decrypted = decryptData(encryptedData);
    const decompressed = Buffer.from(decrypted, 'base64').toString('utf8');
    return JSON.parse(decompressed);
  } catch (error) {
    console.error('Medical data decryption error:', error);
    throw new Error('Medical data decryption failed');
  }
};

/**
 * Generate API key
 */
const generateApiKey = (prefix = 'hk') => {
  const randomPart = crypto.randomBytes(32).toString('hex');
  return `${prefix}_${randomPart}`;
};

/**
 * Hash API key for storage
 */
const hashApiKey = (apiKey) => {
  return crypto.createHash('sha256').update(apiKey).digest('hex');
};

/**
 * Generate secure filename for uploads
 */
const generateSecureFilename = (originalname) => {
  const extension = originalname.split('.').pop();
  const randomName = crypto.randomBytes(16).toString('hex');
  const timestamp = Date.now();
  return `${timestamp}_${randomName}.${extension}`;
};

/**
 * Create password reset token with expiration
 */
const createPasswordResetToken = () => {
  const token = generateSecureToken(32);
  const expires = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour
  
  return {
    token,
    expires,
    hash: hashData(token)
  };
};

/**
 * Create email verification token
 */
const createEmailVerificationToken = () => {
  const token = generateSecureToken(32);
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  
  return {
    token,
    expires,
    hash: hashData(token)
  };
};

/**
 * Sanitize and hash sensitive search queries
 */
const hashSearchQuery = (query) => {
  const sanitized = query.toLowerCase().trim();
  return crypto.createHash('sha256').update(sanitized).digest('hex');
};

/**
 * Generate checksum for file integrity
 */
const generateFileChecksum = (fileBuffer) => {
  return crypto.createHash('sha256').update(fileBuffer).digest('hex');
};

/**
 * Verify file integrity
 */
const verifyFileIntegrity = (fileBuffer, expectedChecksum) => {
  const actualChecksum = generateFileChecksum(fileBuffer);
  return actualChecksum === expectedChecksum;
};

/**
 * Encrypt user session data
 */
const encryptSessionData = (sessionData) => {
  try {
    const jsonString = JSON.stringify(sessionData);
    return encryptData(jsonString);
  } catch (error) {
    console.error('Session data encryption error:', error);
    throw new Error('Session data encryption failed');
  }
};

/**
 * Decrypt user session data
 */
const decryptSessionData = (encryptedSessionData) => {
  try {
    const decrypted = decryptData(encryptedSessionData);
    return JSON.parse(decrypted);
  } catch (error) {
    console.error('Session data decryption error:', error);
    throw new Error('Session data decryption failed');
  }
};

/**
 * Generate secure OTP (One-Time Password)
 */
const generateOTP = (length = 6) => {
  const digits = '0123456789';
  let otp = '';
  
  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(0, digits.length);
    otp += digits[randomIndex];
  }
  
  return otp;
};

/**
 * Hash OTP for storage
 */
const hashOTP = (otp, secret = config.jwt.secret) => {
  return crypto.createHmac('sha256', secret).update(otp).digest('hex');
};

/**
 * Verify OTP
 */
const verifyOTP = (inputOTP, storedHash, secret = config.jwt.secret) => {
  const inputHash = hashOTP(inputOTP, secret);
  return crypto.timingSafeEqual(
    Buffer.from(inputHash, 'hex'),
    Buffer.from(storedHash, 'hex')
  );
};

module.exports = {
  hashPassword,
  comparePassword,
  generateSecureToken,
  generateVerificationCode,
  hashData,
  encryptData,
  decryptData,
  generateHMAC,
  verifyHMAC,
  generateSalt,
  hashPasswordWithSalt,
  generateSessionId,
  encryptMedicalData,
  decryptMedicalData,
  generateApiKey,
  hashApiKey,
  generateSecureFilename,
  createPasswordResetToken,
  createEmailVerificationToken,
  hashSearchQuery,
  generateFileChecksum,
  verifyFileIntegrity,
  encryptSessionData,
  decryptSessionData,
  generateOTP,
  hashOTP,
  verifyOTP
};