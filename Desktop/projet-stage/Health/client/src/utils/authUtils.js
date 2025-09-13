// client/src/utils/authUtils.js

/**
 * Check if user is authenticated (synchronisé avec AuthContext)
 * @returns {boolean} - true if user is logged in, false otherwise
 */
export const isAuthenticated = () => {
  try {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    
    // Vérifier si le token et l'utilisateur existent
    if (!token || !user) {
      return false;
    }

    // Vérifier la structure du token
    const tokenParts = token.split('.');
    if (tokenParts.length === 3) {
      // C'est un JWT, vérifier l'expiration
      const payload = JSON.parse(atob(tokenParts[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      
      if (payload.exp && payload.exp < currentTime) {
        console.log('Token expired');
        clearAuthData();
        return false;
      }
    }

    // Vérifier que les données utilisateur sont valides
    const userData = JSON.parse(user);
    if (!userData || !userData.id) {
      console.error('Invalid user data');
      clearAuthData();
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error checking authentication:', error);
    clearAuthData();
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
    if (!userString) return null;
    
    const userData = JSON.parse(userString);
    return (userData && userData.id) ? userData : null;
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
  if (!userRole || !requiredRole) return false;
  
  // Normaliser la comparaison (insensible à la casse)
  return userRole.toUpperCase() === requiredRole.toUpperCase();
};

/**
 * Login user - store token and user data (synchronisé avec AuthContext)
 * @param {Object} authData - authentication data from backend
 */
export const loginUser = (authData) => {
  try {
    const { token, user } = authData;
    
    if (!token || !user) {
      throw new Error('Invalid authentication data');
    }
    
    // Valider les données utilisateur
    if (!user.id || !user.role) {
      throw new Error('Invalid user data');
    }
    
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    console.log('User logged in successfully:', user.email || user.name);
    return true;
  } catch (error) {
    console.error('Error during login:', error);
    clearAuthData();
    return false;
  }
};

/**
 * Logout user - clear all authentication data
 */
export const logoutUser = () => {
  clearAuthData();
  window.location.href = '/';
};

/**
 * Clear all authentication data
 */
const clearAuthData = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
  localStorage.removeItem('returnUrl');
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
  // Stocker l'URL de retour
  const currentUrl = returnUrl || window.location.pathname + window.location.search;
  if (currentUrl && currentUrl !== '/auth/login') {
    localStorage.setItem('returnUrl', currentUrl);
  }
  
  console.log('Redirecting to login, return URL:', currentUrl);
  window.location.href = '/auth/login';
};

/**
 * Get return URL after login
 * @returns {string} - URL to return to after login
 */
export const getReturnUrl = () => {
  const returnUrl = localStorage.getItem('returnUrl');
  if (returnUrl) {
    localStorage.removeItem('returnUrl');
    return returnUrl;
  }
  
  // URL par défaut basée sur le rôle de l'utilisateur
  const user = getCurrentUser();
  if (user) {
    switch (user.role?.toUpperCase()) {
      case 'PATIENT':
        return '/patient/dashboard';
      case 'DOCTOR':
        return '/doctor/dashboard';
      case 'ADMIN':
        return '/admin/dashboard';
      default:
        return '/';
    }
  }
  
  return '/';
};

/**
 * Check authentication and redirect if needed
 * @param {string} requiredRole - optional role requirement
 * @param {string} redirectUrl - custom redirect URL if not authenticated
 * @returns {boolean} - true if authenticated and authorized
 */
export const requireAuth = (requiredRole = null, redirectUrl = null) => {
  if (!isAuthenticated()) {
    redirectToLogin(redirectUrl);
    return false;
  }
  
  if (requiredRole && !hasRole(requiredRole)) {
    console.warn(`Access denied. Required role: ${requiredRole}`);
    const dashboardUrl = getReturnUrl();
    window.location.href = dashboardUrl;
    return false;
  }
  
  return true;
};

/**
 * Get user initials for avatar display
 * @returns {string} - user initials
 */
export const getUserInitials = () => {
  const user = getCurrentUser();
  if (!user) return 'U';
  
  const firstName = user.firstName || user.first_name || '';
  const lastName = user.lastName || user.last_name || '';
  
  if (firstName && lastName) {
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
  }
  
  if (user.name) {
    const nameParts = user.name.split(' ');
    if (nameParts.length > 1) {
      return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
    }
    return user.name.charAt(0).toUpperCase();
  }
  
  if (user.email) {
    return user.email.charAt(0).toUpperCase();
  }
  
  return 'U';
};

/**
 * Get user full name
 * @returns {string} - user full name or email
 */
export const getUserFullName = () => {
  const user = getCurrentUser();
  if (!user) return 'Unknown User';
  
  const firstName = user.firstName || user.first_name || '';
  const lastName = user.lastName || user.last_name || '';
  
  if (firstName && lastName) {
    return `${firstName} ${lastName}`;
  }
  
  if (user.name) return user.name;
  if (firstName) return firstName;
  if (lastName) return lastName;
  if (user.email) return user.email;
  
  return 'Unknown User';
};

/**
 * Debug function to log current auth state
 */
export const debugAuthState = () => {
  console.log('=== AUTH DEBUG ===');
  console.log('Token exists:', !!localStorage.getItem('authToken'));
  console.log('User exists:', !!localStorage.getItem('user'));
  console.log('Is authenticated:', isAuthenticated());
  console.log('Current user:', getCurrentUser());
  console.log('User role:', getUserRole());
  console.log('==================');
};