// client/src/services/searchService.js

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

/**
 * Search doctors with advanced filters using PostgreSQL
 * @param {string} query - Doctor name, specialty, or disorder
 * @param {string} location - City name or postal code
 * @param {Object} filters - Additional filters
 * @returns {Promise<Object>} Search results
 */
export const searchDoctors = async (query = '', location = '', filters = {}) => {
  try {
    const params = new URLSearchParams();
    
    // Main search parameters
    if (query.trim()) params.append('q', query.trim());
    if (location.trim()) params.append('location', location.trim());
    
    // Additional filters
    const {
      specialty = '',
      disorder = '',
      minRating = 0,
      maxFee = 0,
      availableToday = false,
      sortBy = 'relevance',
      page = 1,
      limit = 12
    } = filters;
    
    if (specialty) params.append('specialty', specialty);
    if (disorder) params.append('disorder', disorder);
    if (minRating > 0) params.append('minRating', minRating);
    if (maxFee > 0) params.append('maxFee', maxFee);
    if (availableToday) params.append('availableToday', 'true');
    if (sortBy) params.append('sortBy', sortBy);
    if (page) params.append('page', page);
    if (limit) params.append('limit', limit);

    const response = await fetch(`${API_BASE_URL}/doctors/search?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP Error: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      doctors: data.doctors || [],
      total: data.total || 0,
      page: data.page || 1,
      totalPages: data.totalPages || 1,
      hasNextPage: data.hasNextPage || false,
      hasPrevPage: data.hasPrevPage || false,
      searchQuery: query,
      searchLocation: location
    };
    
  } catch (error) {
    console.error('Error searching doctors:', error);
    throw new Error('Unable to search doctors. Please try again.');
  }
};

/**
 * Get search suggestions for autocomplete
 * @param {string} query - Search query
 * @param {string} type - Type of suggestion (doctor, specialty, disorder, city)
 * @returns {Promise<Array>} Suggestions
 */
export const getSuggestions = async (query, type = 'all') => {
  try {
    if (!query || query.length < 2) return [];

    const params = new URLSearchParams();
    params.append('q', query);
    params.append('type', type);
    params.append('limit', '8');

    const response = await fetch(`${API_BASE_URL}/search/suggestions?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    return await response.json();
    
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    return [];
  }
};

/**
 * Get location suggestions (cities)
 * @param {string} query - City or postal code
 * @returns {Promise<Array>} City suggestions
 */
export const getLocationSuggestions = async (query) => {
  try {
    if (!query || query.length < 2) return [];

    const params = new URLSearchParams();
    params.append('q', query);
    params.append('limit', '8');

    const response = await fetch(`${API_BASE_URL}/cities/search?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    return await response.json();
    
  } catch (error) {
    console.error('Error fetching location suggestions:', error);
    return [];
  }
};

/**
 * Get all available specialties
 * @returns {Promise<Array>} List of specialties
 */
export const getSpecialties = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/specialties`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    return await response.json();
    
  } catch (error) {
    console.error('Error fetching specialties:', error);
    return [];
  }
};

/**
 * Get popular cities
 * @returns {Promise<Array>} List of popular cities
 */
export const getPopularCities = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/cities/popular`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    return await response.json();
    
  } catch (error) {
    console.error('Error fetching popular cities:', error);
    return [];
  }
};

/**
 * Search disorders/conditions
 * @param {string} query - Disorder name
 * @returns {Promise<Array>} List of matching disorders
 */
export const searchDisorders = async (query) => {
  try {
    if (!query || query.length < 2) return [];

    const params = new URLSearchParams();
    params.append('q', query);
    params.append('limit', '10');

    const response = await fetch(`${API_BASE_URL}/disorders/search?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    return await response.json();
    
  } catch (error) {
    console.error('Error searching disorders:', error);
    return [];
  }
};

/**
 * Get doctor details by ID
 * @param {number} doctorId - Doctor ID
 * @returns {Promise<Object>} Doctor details
 */
export const getDoctorDetails = async (doctorId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/doctors/${doctorId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    return await response.json();
    
  } catch (error) {
    console.error('Error fetching doctor details:', error);
    throw new Error('Unable to fetch doctor details.');
  }
};

// Export default
export default {
  searchDoctors,
  getSuggestions,
  getLocationSuggestions,
  getSpecialties,
  getPopularCities,
  searchDisorders,
  getDoctorDetails
};