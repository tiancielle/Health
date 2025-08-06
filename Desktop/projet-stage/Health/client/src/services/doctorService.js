// client/src/services/doctorService.js
import api from './api';

const doctorService = {
  // Obtenir tous les médecins avec pagination et filtres
  getAllDoctors: async (params = {}) => {
    try {
      const response = await api.get('/doctors', { params });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des médecins:', error);
      throw error;
    }
  },

  // Obtenir un médecin par ID
  getDoctorById: async (doctorId) => {
    try {
      const response = await api.get(`/doctors/${doctorId}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération du médecin:', error);
      throw error;
    }
  },

  // Obtenir le profil public d'un médecin
  getDoctorPublicProfile: async (doctorId) => {
    try {
      const response = await api.get(`/doctors/${doctorId}/public`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération du profil public:', error);
      throw error;
    }
  },

  // Obtenir les créneaux disponibles d'un médecin
  getDoctorAvailability: async (doctorId, date = null) => {
    try {
      const params = date ? { date } : {};
      const response = await api.get(`/doctors/${doctorId}/availability`, { params });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des disponibilités:', error);
      throw error;
    }
  },

  // Obtenir les avis d'un médecin
  getDoctorReviews: async (doctorId, params = {}) => {
    try {
      const response = await api.get(`/doctors/${doctorId}/reviews`, { params });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des avis:', error);
      throw error;
    }
  },

  // Rechercher des médecins par spécialité
  getDoctorsBySpecialty: async (specialty, params = {}) => {
    try {
      const response = await api.get(`/doctors/specialty/${specialty}`, { params });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la recherche par spécialité:', error);
      throw error;
    }
  },

  // Obtenir les médecins favoris d'un patient
  getFavoriteDoctors: async () => {
    try {
      const response = await api.get('/patient/favorites');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des favoris:', error);
      throw error;
    }
  },

  // Ajouter un médecin aux favoris
  addToFavorites: async (doctorId) => {
    try {
      const response = await api.post(`/patient/favorites/${doctorId}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'ajout aux favoris:', error);
      throw error;
    }
  },

  // Retirer un médecin des favoris
  removeFromFavorites: async (doctorId) => {
    try {
      const response = await api.delete(`/patient/favorites/${doctorId}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la suppression des favoris:', error);
      throw error;
    }
  },

  // Laisser un avis sur un médecin
  addReview: async (doctorId, reviewData) => {
    try {
      const response = await api.post(`/doctors/${doctorId}/reviews`, reviewData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'avis:', error);
      throw error;
    }
  },

  // Obtenir les statistiques d'un médecin
  getDoctorStats: async (doctorId) => {
    try {
      const response = await api.get(`/doctors/${doctorId}/stats`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      throw error;
    }
  },

  // Vérifier si un médecin est disponible
  checkDoctorAvailability: async (doctorId, date, time) => {
    try {
      const response = await api.get(`/doctors/${doctorId}/check-availability`, {
        params: { date, time }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la vérification de disponibilité:', error);
      throw error;
    }
  },

  // Obtenir les médecins recommandés
  getRecommendedDoctors: async (patientId = null) => {
    try {
      const params = patientId ? { patientId } : {};
      const response = await api.get('/doctors/recommended', { params });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des recommandations:', error);
      throw error;
    }
  },

  // Obtenir les médecins populaires
  getPopularDoctors: async (limit = 10) => {
    try {
      const response = await api.get('/doctors/popular', { params: { limit } });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des médecins populaires:', error);
      throw error;
    }
  },

  // Obtenir les médecins récemment consultés
  getRecentlyViewedDoctors: async () => {
    try {
      const response = await api.get('/patient/recently-viewed');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'historique:', error);
      throw error;
    }
  },

  // Enregistrer une vue de profil médecin
  recordDoctorView: async (doctorId) => {
    try {
      const response = await api.post(`/doctors/${doctorId}/view`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement de la vue:', error);
      // Ne pas faire échouer silencieusement
      return null;
    }
  }
};

export default doctorService;