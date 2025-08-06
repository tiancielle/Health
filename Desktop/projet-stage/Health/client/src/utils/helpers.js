// client/src/utils/helpers.js
import { MEDICAL_SPECIALTIES, COMMON_DISORDERS } from './constants';

/**
 * Formate un nom complet de médecin
 */
export const formatDoctorName = (firstName, lastName, title = 'Dr.') => {
  if (!firstName || !lastName) return 'Unknown Doctor';
  return `${title} ${firstName} ${lastName}`;
};

/**
 * Formate une adresse complète
 */
export const formatAddress = (address, city, zipCode, country) => {
  const parts = [address, city, zipCode, country].filter(Boolean);
  return parts.join(', ');
};

/**
 * Calcule la distance entre deux points géographiques
 */
export const calculateDistance = (lat1, lon1, lat2, lon2, unit = 'km') => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;

  const R = unit === 'km' ? 6371 : 3959; // Rayon de la Terre
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 10) / 10; // Arrondi à 1 décimale
};

const toRadians = (degrees) => degrees * (Math.PI / 180);

/**
 * Formate la distance avec unité
 */
export const formatDistance = (distance, unit = 'km') => {
  if (!distance) return '';
  if (distance < 1 && unit === 'km') {
    return `${Math.round(distance * 1000)}m`;
  }
  return `${distance}${unit}`;
};

/**
 * Génère des initiales à partir d'un nom
 */
export const getInitials = (name) => {
  if (!name) return '';
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
};

/**
 * Vérifie si une chaîne correspond à une spécialité médicale
 */
export const isValidMedicalSpecialty = (query) => {
  const normalizedQuery = query.toLowerCase().trim();
  return MEDICAL_SPECIALTIES.some(specialty => 
    specialty.name.toLowerCase().includes(normalizedQuery) ||
    specialty.id.includes(normalizedQuery)
  );
};

/**
 * Vérifie si une chaîne correspond à un trouble médical
 */
export const isValidMedicalDisorder = (query) => {
  const normalizedQuery = query.toLowerCase().trim();
  return COMMON_DISORDERS.some(disorder => 
    disorder.name.toLowerCase().includes(normalizedQuery) ||
    disorder.id.includes(normalizedQuery)
  );
};

/**
 * Détermine le type de recherche (médecin, spécialité, trouble)
 */
export const determineSearchType = (query) => {
  const normalizedQuery = query.toLowerCase().trim();
  
  // Vérifier s'il s'agit d'un nom de médecin (contient "dr" ou "doctor")
  if (normalizedQuery.includes('dr') || normalizedQuery.includes('doctor')) {
    return 'doctor';
  }
  
  // Vérifier s'il s'agit d'une spécialité
  if (isValidMedicalSpecialty(query)) {
    return 'specialty';
  }
  
  // Vérifier s'il s'agit d'un trouble
  if (isValidMedicalDisorder(query)) {
    return 'disorder';
  }
  
  // Par défaut, recherche générale
  return 'general';
};

/**
 * Nettoie et normalise une requête de recherche
 */
export const sanitizeSearchQuery = (query) => {
  if (!query) return '';
  
  return query
    .trim()
    .replace(/\s+/g, ' ') // Remplace les espaces multiples par un seul
    .toLowerCase();
};

/**
 * Génère des suggestions de recherche basées sur une requête partielle
 */
export const generateSearchSuggestions = (query, limit = 10) => {
  if (!query || query.length < 2) return [];
  
  const normalizedQuery = query.toLowerCase();
  const suggestions = [];
  
  // Ajouter les spécialités correspondantes
  MEDICAL_SPECIALTIES.forEach(specialty => {
    if (specialty.name.toLowerCase().includes(normalizedQuery)) {
      suggestions.push({
        text: specialty.name,
        type: 'specialty',
        icon: specialty.icon,
        category: 'Medical Specialty'
      });
    }
  });
  
  // Ajouter les troubles correspondants
  COMMON_DISORDERS.forEach(disorder => {
    if (disorder.name.toLowerCase().includes(normalizedQuery)) {
      suggestions.push({
        text: disorder.name,
        type: 'disorder',
        category: 'Medical Condition'
      });
    }
  });
  
  return suggestions.slice(0, limit);
};

/**
 * Formate un numéro de téléphone
 */
export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  
  // Supprimer tous les caractères non numériques
  const cleaned = phone.replace(/\D/g, '');
  
  // Format US: (XXX) XXX-XXXX
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  
  // Format international: +X XXX XXX XXXX
  if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return `+1 ${cleaned.slice(1, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
  }
  
  return phone; // Retourner tel quel si format non reconnu
};

/**
 * Valide un email
 */
export const isValidEmail = (email) => {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valide un numéro de téléphone
 */
export const isValidPhoneNumber = (phone) => {
  if (!phone) return false;
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length >= 10 && cleaned.length <= 15;
};

/**
 * Génère une couleur d'avatar basée sur un nom
 */
export const getAvatarColor = (name) => {
  if (!name) return '#4d89b1';
  
  const colors = [
    '#4d89b1', '#10b981', '#f59e0b', '#ef4444',
    '#8b5cf6', '#06b6d4', '#84cc16', '#f97316',
    '#ec4899', '#6366f1', '#14b8a6', '#eab308'
  ];
  
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
};

/**
 * Convertit une chaîne en slug URL-friendly
 */
export const slugify = (text) => {
  if (!text) return '';
  
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Supprimer les caractères spéciaux
    .replace(/[\s_-]+/g, '-') // Remplacer espaces et underscores par des tirets
    .replace(/^-+|-+$/g, ''); // Supprimer les tirets en début/fin
};

/**
 * Capitalise la première lettre de chaque mot
 */
export const capitalizeWords = (text) => {
  if (!text) return '';
  
  return text
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

/**
 * Tronque un texte à une longueur donnée
 */
export const truncateText = (text, maxLength = 100, suffix = '...') => {
  if (!text || text.length <= maxLength) return text;
  
  return text.slice(0, maxLength - suffix.length).trim() + suffix;
};

/**
 * Formate un nombre avec des séparateurs de milliers
 */
export const formatNumber = (number, locale = 'en-US') => {
  if (typeof number !== 'number') return number;
  
  return new Intl.NumberFormat(locale).format(number);
};

/**
 * Génère un ID unique
 */
export const generateId = (prefix = '') => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2);
  return `${prefix}${timestamp}${random}`;
};

/**
 * Détermine si une couleur est sombre ou claire
 */
export const isColorDark = (color) => {
  if (!color) return false;
  
  // Convertir hex en RGB
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  // Calculer la luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  return luminance < 0.5;
};

/**
 * Mélange un tableau (algorithme Fisher-Yates)
 */
export const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Groupe un tableau d'objets par une propriété
 */
export const groupBy = (array, key) => {
  return array.reduce((groups, item) => {
    const value = item[key];
    if (!groups[value]) {
      groups[value] = [];
    }
    groups[value].push(item);
    return groups;
  }, {});
};

/**
 * Supprime les doublons d'un tableau d'objets basé sur une propriété
 */
export const uniqueBy = (array, key) => {
  const seen = new Set();
  return array.filter(item => {
    const value = item[key];
    if (seen.has(value)) {
      return false;
    }
    seen.add(value);
    return true;
  });
};

/**
 * Vérifie si un objet est vide
 */
export const isEmpty = (obj) => {
  if (!obj) return true;
  if (Array.isArray(obj)) return obj.length === 0;
  if (typeof obj === 'object') return Object.keys(obj).length === 0;
  return false;
};

export default {
  formatDoctorName,
  formatAddress,
  calculateDistance,
  formatDistance,
  getInitials,
  isValidMedicalSpecialty,
  isValidMedicalDisorder,
  determineSearchType,
  sanitizeSearchQuery,
  generateSearchSuggestions,
  formatPhoneNumber,
  isValidEmail,
  isValidPhoneNumber,
  getAvatarColor,
  slugify,
  capitalizeWords,
  truncateText,
  formatNumber,
  generateId,
  isColorDark,
  shuffleArray,
  groupBy,
  uniqueBy,
  isEmpty
};