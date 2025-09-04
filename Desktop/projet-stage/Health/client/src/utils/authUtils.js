// client/src/utils/authUtils.js

/**
 * Check if user is authenticated
 * @returns {boolean} - true if user is logged in, false otherwise
 */
export const isAuthenticated = () => {
  const token = localStorage.getItem('authToken');
  
  if (!token) {
    return false;
  }

  try {
    // Check if token is expired (basic JWT structure check)
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    
    if (payload.exp && payload.exp < currentTime) {
      // Token is expired, remove it
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      return false;
    }
    
    return true;
  } catch (error) {
    // Invalid token format, remove it
    console.error('Invalid token format:', error);
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    return false;
  }
};

/**
 * Get current user from localStorage
 * @returns {Object|null} - user object or null if not found
 */
export const getCurrentUser = () => {
  try {
    const userString = localStorage.getItem('user');
    return userString ? JSON.parse(userString) : null;
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

/**
 * Get user role
 * @returns {string|null} - user role or null if not found
 */
export const getUserRole = () => {
  const user = getCurrentUser();
  return user?.role || null;
};

/**
 * Check if user has specific role
 * @param {string} requiredRole - required role to check
 * @returns {boolean} - true if user has the role, false otherwise
 */
export const hasRole = (requiredRole) => {
  const userRole = getUserRole();
  return userRole === requiredRole;
};

/**
 * Login user - store token and user data
 * @param {Object} authData - authentication data from backend
 */
export const loginUser = (authData) => {
  const { token, user } = authData;
  
  if (token && user) {
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));
  }
};

/**
 * Logout user - clear all authentication data
 */
export const logoutUser = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
  
  // Optionally redirect to home page
  window.location.href = '/';
};

/**
 * Get authentication token
 * @returns {string|null} - auth token or null if not found
 */
export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

/**
 * Check if user is a patient
 * @returns {boolean}
 */
export const isPatient = () => {
  return hasRole('PATIENT');
};

/**
 * Check if user is a doctor
 * @returns {boolean}
 */
export const isDoctor = () => {
  return hasRole('DOCTOR');
};

/**
 * Check if user is an admin
 * @returns {boolean}
 */
export const isAdmin = () => {
  return hasRole('ADMIN');
};

/**
 * Redirect to login with return URL
 * @param {string} returnUrl - URL to return to after login
 */
export const redirectToLogin = (returnUrl = null) => {
  const currentUrl = returnUrl || window.location.pathname + window.location.search;
  const loginUrl = `/auth/login?redirect=${encodeURIComponent(currentUrl)}`;
  window.location.href = loginUrl;
};