// client/src/services/api.js
import axios from 'axios';

// Configuration de base d'Axios pour Vite
const api = axios.create({
  // 🔥 Correction: utilisation de import.meta.env au lieu de process.env pour Vite
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour les requêtes (ajouter le token JWT)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('healthToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // 🔥 Debug: afficher l'URL utilisée en développement
    if (import.meta.env.DEV) {
      console.log('API Request URL:', config.baseURL + config.url);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour les réponses (gestion des erreurs)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 🔥 Gestion améliorée des erreurs
    if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
      console.error('❌ Impossible de se connecter au serveur backend');
      console.error('Vérifiez que le serveur est démarré sur:', import.meta.env.VITE_API_URL);
    }
    
    // Gestion des erreurs globales
    if (error.response?.status === 401) {
      // Token expiré ou invalide
      localStorage.removeItem('healthToken');
      localStorage.removeItem('healthUser');
      window.location.href = '/auth/login';
    }
    
    if (error.response?.status === 403) {
      // Accès refusé
      console.warn('Accès refusé:', error.response.data);
    }
    
    if (error.response?.status >= 500) {
      // Erreur serveur
      console.error('Erreur serveur:', error.response.data);
    }
    
    return Promise.reject(error);
  }
);

// 🔥 Debug: afficher la configuration en mode développement
if (import.meta.env.DEV) {
  console.log('🔧 API Configuration:');
  console.log('- Base URL:', import.meta.env.VITE_API_URL || 'http://localhost:5000/api');
  console.log('- Environment:', import.meta.env.MODE);
}

export default api;