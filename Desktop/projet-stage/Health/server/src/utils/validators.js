// src/utils/validators.js

/**
 * Email validation
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Password strength validation
 */
const isValidPassword = (password) => {
  // At least 8 characters, one uppercase, one lowercase, one number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

/**
 * Phone number validation (international format)
 */
const isValidPhone = (phone) => {
  const phoneRegex = /^[+]?[\d\s\-\(\)]+$/;
  return phoneRegex.test(phone) && phone.length >= 10;
};

/**
 * Name validation (letters, spaces, hyphens, apostrophes only)
 */
const isValidName = (name) => {
  const nameRegex = /^[a-zA-Z\s'-]+$/;
  return nameRegex.test(name) && name.length >= 2 && name.length <= 50;
};

/**
 * UUID validation
 */
const isValidUUID = (uuid) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

/**
 * Date validation (not in future, reasonable age range)
 */
const isValidBirthDate = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  const age = today.getFullYear() - date.getFullYear();
  
  return date <= today && age >= 13 && age <= 120;
};

/**
 * Role validation
 */
const isValidRole = (role) => {
  const validRoles = ['PATIENT', 'DOCTOR', 'ADMIN'];
  return validRoles.includes(role);
};

/**
 * Gender validation
 */
const isValidGender = (gender) => {
  const validGenders = ['MALE', 'FEMALE', 'OTHER'];
  return validGenders.includes(gender);
};

/**
 * File type validation
 */
const isValidImageType = (mimetype) => {
  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  return validTypes.includes(mimetype);
};

/**
 * File size validation (in bytes)
 */
const isValidFileSize = (size, maxSize = 5 * 1024 * 1024) => {
  return size <= maxSize;
};

/**
 * URL validation
 */
const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Sanitize string input
 */
const sanitizeString = (str) => {
  if (typeof str !== 'string') return str;
  
  return str
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .trim() // Remove leading/trailing whitespace
    .replace(/\s+/g, ' '); // Replace multiple spaces with single space
};

/**
 * Validate appointment time (must be in future, during business hours)
 */
const isValidAppointmentTime = (dateTime) => {
  const appointmentDate = new Date(dateTime);
  const now = new Date();
  
  // Must be in the future
  if (appointmentDate <= now) return false;
  
  // Must be during business hours (9 AM - 5 PM)
  const hours = appointmentDate.getHours();
  if (hours < 9 || hours >= 17) return false;
  
  // Must be on weekdays
  const dayOfWeek = appointmentDate.getDay();
  if (dayOfWeek === 0 || dayOfWeek === 6) return false; // Sunday = 0, Saturday = 6
  
  return true;
};

/**
 * Validate pagination parameters
 */
const isValidPagination = (page, limit) => {
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  
  return pageNum > 0 && limitNum > 0 && limitNum <= 100;
};

/**
 * Clean and validate search query
 */
const sanitizeSearchQuery = (query) => {
  if (!query || typeof query !== 'string') return '';
  
  return query
    .trim()
    .replace(/[<>]/g, '') // Remove potential XSS characters
    .substring(0, 100); // Limit length
};

/**
 * Validate medical record data
 */
const isValidMedicalData = (data) => {
  // Basic validation for medical record objects
  if (!data || typeof data !== 'object') return false;
  
  // Check required fields exist
  const requiredFields = ['patientId', 'doctorId', 'diagnosis'];
  return requiredFields.every(field => data[field]);
};

/**
 * Validate time slot duration (in minutes)
 */
const isValidDuration = (duration) => {
  const validDurations = [15, 30, 45, 60, 90, 120];
  return validDurations.includes(parseInt(duration));
};

/**
 * Comprehensive input validation function
 */
const validateUserInput = (data) => {
  const errors = [];
  
  if (data.email && !isValidEmail(data.email)) {
    errors.push('Invalid email format');
  }
  
  if (data.password && !isValidPassword(data.password)) {
    errors.push('Password must be at least 8 characters with uppercase, lowercase, and number');
  }
  
  if (data.firstName && !isValidName(data.firstName)) {
    errors.push('First name must be 2-50 characters with letters only');
  }
  
  if (data.lastName && !isValidName(data.lastName)) {
    errors.push('Last name must be 2-50 characters with letters only');
  }
  
  if (data.phone && !isValidPhone(data.phone)) {
    errors.push('Invalid phone number format');
  }
  
  if (data.dateOfBirth && !isValidBirthDate(data.dateOfBirth)) {
    errors.push('Invalid birth date or age not between 13-120 years');
  }
  
  if (data.role && !isValidRole(data.role)) {
    errors.push('Invalid role specified');
  }
  
  if (data.gender && !isValidGender(data.gender)) {
    errors.push('Invalid gender specified');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

module.exports = {
  isValidEmail,
  isValidPassword,
  isValidPhone,
  isValidName,
  isValidUUID,
  isValidBirthDate,
  isValidRole,
  isValidGender,
  isValidImageType,
  isValidFileSize,
  isValidUrl,
  sanitizeString,
  isValidAppointmentTime,
  isValidPagination,
  sanitizeSearchQuery,
  isValidMedicalData,
  isValidDuration,
  validateUserInput
};