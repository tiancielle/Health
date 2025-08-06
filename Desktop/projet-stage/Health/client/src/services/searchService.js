// client/src/services/searchService.js
import api from './api';

const searchService = {
  // Recherche globale de médecins
  searchDoctors: async (query, location, filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      if (query) params.append('query', query);
      if (location) params.append('location', location);
      
      // Filtres optionnels
      if (filters.specialty) params.append('specialty', filters.specialty);
      if (filters.availability) params.append('availability', filters.availability);
      if (filters.rating) params.append('rating', filters.rating);
      if (filters.page) params.append('page', filters.page);
      if (filters.limit) params.append('limit', filters.limit);

      const response = await api.get(`/doctors/search?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la recherche de médecins:', error);
      throw error;
    }
  },

  // Recherche par spécialité
  searchBySpecialty: async (specialty, location) => {
    try {
      const response = await api.get(`/doctors/specialty/${specialty}`, {
        params: { location }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la recherche par spécialité:', error);
      throw error;
    }
  },

  // Recherche par troubles/maladies
  searchByDisorder: async (disorder, location) => {
    try {
      const response = await api.get(`/doctors/disorder/${disorder}`, {
        params: { location }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la recherche par trouble:', error);
      throw error;
    }
  },

  // Obtenir les suggestions de recherche
  getSearchSuggestions: async (query) => {
    try {
      const response = await api.get(`/search/suggestions?query=${query}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des suggestions:', error);
      return [];
    }
  },

  // Obtenir toutes les spécialités
  getSpecialties: async () => {
    try {
      const response = await api.get('/specialties');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des spécialités:', error);
      return [];
    }
  },

  // Obtenir les troubles/maladies les plus recherchés
  getPopularDisorders: async () => {
    try {
      const response = await api.get('/disorders/popular');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des troubles:', error);
      return [];
    }
  }
};

export default searchService;