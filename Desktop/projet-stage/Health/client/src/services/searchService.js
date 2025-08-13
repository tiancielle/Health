// client/src/services/searchService.js
import api from './api';

export const searchService = {
  // Recherche principale de médecins
  searchDoctors: async (query, location = '', filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      // Paramètres de base
      if (query?.trim()) params.append('q', query.trim());
      if (location?.trim()) params.append('location', location.trim());
      
      // Filtres optionnels
      if (filters.specialty) params.append('specialty', filters.specialty);
      if (filters.rating) params.append('minRating', filters.rating);
      if (filters.availability) params.append('availability', filters.availability);
      if (filters.distance) params.append('maxDistance', filters.distance);
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.page) params.append('page', filters.page);
      if (filters.limit) params.append('limit', filters.limit);

      const response = await api.get(`/doctors/search?${params.toString()}`);
      
      return {
        doctors: response.data.doctors || [],
        total: response.data.total || 0,
        page: response.data.page || 1,
        totalPages: response.data.totalPages || 1,
        hasNext: response.data.hasNext || false,
        hasPrev: response.data.hasPrev || false
      };
    } catch (error) {
      console.error('Erreur lors de la recherche de médecins:', error);
      throw new Error('Impossible de rechercher les médecins. Veuillez réessayer.');
    }
  },

  // Recherche par spécialité
  searchBySpecialty: async (specialty, location = '', filters = {}) => {
    return searchService.searchDoctors('', location, { ...filters, specialty });
  },

  // Suggestions de recherche
  getSearchSuggestions: async (query) => {
    try {
      if (!query?.trim() || query.length < 2) return [];
      
      const response = await api.get(`/doctors/suggestions?q=${encodeURIComponent(query)}`);
      return response.data.suggestions || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des suggestions:', error);
      return [];
    }
  },

  // Médecins populaires/recommandés
  getPopularDoctors: async (limit = 6) => {
    try {
      const response = await api.get(`/doctors/popular?limit=${limit}`);
      return response.data.doctors || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des médecins populaires:', error);
      return [];
    }
  },

  // Spécialités disponibles
  getSpecialties: async () => {
    try {
      const response = await api.get('/doctors/specialties');
      return response.data.specialties || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des spécialités:', error);
      return [];
    }
  }
};

// Export par défaut pour compatibilité
export const searchDoctors = searchService.searchDoctors;
export default searchService;