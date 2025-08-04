// client/src/services/api.js
import axios from 'axios';

// Base URL du backend
const API_BASE_URL = 'http://localhost:5000/api';

// Créer une instance Axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false, // Pas de cookies pour l'instant (ou true si tu gères les cookies)
});

// Interceptor pour ajouter le token d'accès si disponible
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken'); // ou sessionStorage
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor pour gérer les erreurs globalement
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;
    if (response?.status === 401) {
      // Si non autorisé, déconnexion
      localStorage.removeItem('accessToken');
      window.location.href = '/auth/Login';
    }
    return Promise.reject(error);
  }
);

export default api;