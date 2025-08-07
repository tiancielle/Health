// client/src/services/searchService.js

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

/**
 * Recherche de docteurs avec filtres avancés
 * @param {string} query - Nom du docteur, spécialité ou trouble
 * @param {string} location - Ville ou code postal
 * @param {Object} filters - Filtres additionnels
 * @returns {Promise<Object>} Résultats de recherche
 */
export const searchDoctors = async (query = '', location = '', filters = {}) => {
  try {
    const params = new URLSearchParams();
    
    // Paramètres de recherche principaux
    if (query.trim()) params.append('q', query.trim());
    if (location.trim()) params.append('location', location.trim());
    
    // Filtres additionnels
    const {
      specialty = '',
      minRating = 0,
      availableToday = false,
      sortBy = 'relevance',
      page = 1,
      limit = 12
    } = filters;
    
    if (specialty) params.append('specialty', specialty);
    if (minRating > 0) params.append('minRating', minRating);
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
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      doctors: data.doctors || [],
      total: data.total || 0,
      page: data.page || 1,
      totalPages: data.totalPages || 1,
      hasNextPage: data.hasNextPage || false,
      hasPrevPage: data.hasPrevPage || false
    };
    
  } catch (error) {
    console.error('Erreur lors de la recherche de docteurs:', error);
    throw new Error('Impossible de rechercher les docteurs. Veuillez réessayer.');
  }
};

/**
 * Recherche de suggestions pour l'autocomplétion
 * @param {string} query - Requête de recherche
 * @returns {Promise<Array>} Suggestions
 */
export const getSuggestions = async (query) => {
  try {
    if (!query || query.length < 2) return [];

    const params = new URLSearchParams();
    params.append('q', query);
    params.append('limit', '8');

    const response = await fetch(`${API_BASE_URL}/doctors/suggestions?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    return await response.json();
    
  } catch (error) {
    console.error('Erreur lors de la récupération des suggestions:', error);
    return [];
  }
};

/**
 * Récupérer les spécialités disponibles
 * @returns {Promise<Array>} Liste des spécialités
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
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    return await response.json();
    
  } catch (error) {
    console.error('Erreur lors de la récupération des spécialités:', error);
    return [];
  }
};

/**
 * Récupérer les villes populaires
 * @returns {Promise<Array>} Liste des villes
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
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    return await response.json();
    
  } catch (error) {
    console.error('Erreur lors de la récupération des villes:', error);
    return [];
  }
};

/**
 * Recherche de troubles/maladies
 * @param {string} query - Nom du trouble
 * @returns {Promise<Array>} Liste des troubles correspondants
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
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    return await response.json();
    
  } catch (error) {
    console.error('Erreur lors de la recherche de troubles:', error);
    return [];
  }
};

/**
 * Récupérer les détails d'un docteur
 * @param {number} doctorId - ID du docteur
 * @returns {Promise<Object>} Détails du docteur
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
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    return await response.json();
    
  } catch (error) {
    console.error('Erreur lors de la récupération du docteur:', error);
    throw new Error('Impossible de récupérer les détails du docteur.');
  }
};

/**
 * Recherche géolocalisée (optionnel)
 * @param {number} latitude - Latitude
 * @param {number} longitude - Longitude
 * @param {number} radius - Rayon en km
 * @param {Object} filters - Filtres additionnels
 * @returns {Promise<Object>} Docteurs à proximité
 */
export const searchDoctorsNearby = async (latitude, longitude, radius = 10, filters = {}) => {
  try {
    const params = new URLSearchParams();
    params.append('lat', latitude);
    params.append('lng', longitude);
    params.append('radius', radius);
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });

    const response = await fetch(`${API_BASE_URL}/doctors/nearby?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    return await response.json();
    
  } catch (error) {
    console.error('Erreur lors de la recherche géolocalisée:', error);
    throw new Error('Impossible de rechercher les docteurs à proximité.');
  }
};

// Export par défaut
export default {
  searchDoctors,
  getSuggestions,
  getSpecialties,
  getPopularCities,
  searchDisorders,
  getDoctorDetails,
  searchDoctorsNearby
};