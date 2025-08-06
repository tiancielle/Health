// client/src/utils/constants.js

// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3
};

// Spécialités médicales
export const MEDICAL_SPECIALTIES = [
  { id: 'general-practitioner', name: 'General Practitioner', icon: '🩺' },
  { id: 'cardiologist', name: 'Cardiologist', icon: '❤️' },
  { id: 'dermatologist', name: 'Dermatologist', icon: '🧴' },
  { id: 'dentist', name: 'Dentist', icon: '🦷' },
  { id: 'gynecologist', name: 'Gynecologist', icon: '👩‍⚕️' },
  { id: 'ophthalmologist', name: 'Ophthalmologist', icon: '👁️' },
  { id: 'pediatrician', name: 'Pediatrician', icon: '👶' },
  { id: 'psychiatrist', name: 'Psychiatrist', icon: '🧠' },
  { id: 'orthopedist', name: 'Orthopedist', icon: '🦴' },
  { id: 'neurologist', name: 'Neurologist', icon: '🧠' },
  { id: 'endocrinologist', name: 'Endocrinologist', icon: '⚗️' },
  { id: 'urologist', name: 'Urologist', icon: '🏥' }
];

// Troubles/Maladies courantes
export const COMMON_DISORDERS = [
  { id: 'headache', name: 'Headache', category: 'neurological' },
  { id: 'back-pain', name: 'Back Pain', category: 'orthopedic' },
  { id: 'anxiety', name: 'Anxiety', category: 'psychiatric' },
  { id: 'diabetes', name: 'Diabetes', category: 'endocrine' },
  { id: 'hypertension', name: 'High Blood Pressure', category: 'cardiovascular' },
  { id: 'skin-problems', name: 'Skin Problems', category: 'dermatological' },
  { id: 'eye-problems', name: 'Vision Problems', category: 'ophthalmological' },
  { id: 'dental-pain', name: 'Dental Pain', category: 'dental' },
  { id: 'cold-flu', name: 'Cold & Flu', category: 'general' },
  { id: 'allergies', name: 'Allergies', category: 'immunological' }
];

// Types de consultation
export const CONSULTATION_TYPES = [
  { id: 'in-person', name: 'In-Person Visit', icon: '🏥', duration: 30 },
  { id: 'video-call', name: 'Video Consultation', icon: '📹', duration: 20 },
  { id: 'phone-call', name: 'Phone Consultation', icon: '📞', duration: 15 },
  { id: 'follow-up', name: 'Follow-up', icon: '🔄', duration: 15 },
  { id: 'emergency', name: 'Emergency', icon: '🚨', duration: 60 }
];

// Statuts de rendez-vous
export const APPOINTMENT_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
  NO_SHOW: 'no-show',
  RESCHEDULED: 'rescheduled'
};

// Rôles utilisateur
export const USER_ROLES = {
  PATIENT: 'patient',
  DOCTOR: 'doctor',
  ADMIN: 'admin',
  NURSE: 'nurse',
  RECEPTIONIST: 'receptionist'
};

// Options de tri pour la recherche
export const SORT_OPTIONS = [
  { value: 'relevance', label: 'Most Relevant' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'distance', label: 'Nearest' },
  { value: 'availability', label: 'Soonest Available' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'name', label: 'Name A-Z' },
  { value: 'experience', label: 'Most Experienced' }
];

// Filtres de disponibilité
export const AVAILABILITY_FILTERS = [
  { value: 'today', label: 'Available Today' },
  { value: 'tomorrow', label: 'Available Tomorrow' },
  { value: 'this-week', label: 'Available This Week' },
  { value: 'next-week', label: 'Available Next Week' },
  { value: 'this-month', label: 'Available This Month' }
];

// Filtres de distance
export const DISTANCE_FILTERS = [
  { value: '5', label: 'Within 5 km' },
  { value: '10', label: 'Within 10 km' },
  { value: '25', label: 'Within 25 km' },
  { value: '50', label: 'Within 50 km' },
  { value: '100', label: 'Within 100 km' }
];

// Filtres de note
export const RATING_FILTERS = [
  { value: '4.5', label: '4.5+ stars' },
  { value: '4.0', label: '4.0+ stars' },
  { value: '3.5', label: '3.5+ stars' },
  { value: '3.0', label: '3.0+ stars' }
];

// Langues supportées
export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'zh', name: '中文', flag: '🇨🇳' }
];

// Créneaux horaires standards
export const TIME_SLOTS = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
  '17:00', '17:30', '18:00', '18:30', '19:00', '19:30'
];

// Jours de la semaine
export const WEEKDAYS = [
  { value: 0, label: 'Sunday', short: 'Sun' },
  { value: 1, label: 'Monday', short: 'Mon' },
  { value: 2, label: 'Tuesday', short: 'Tue' },
  { value: 3, label: 'Wednesday', short: 'Wed' },
  { value: 4, label: 'Thursday', short: 'Thu' },
  { value: 5, label: 'Friday', short: 'Fri' },
  { value: 6, label: 'Saturday', short: 'Sat' }
];

// Messages d'erreur
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNAUTHORIZED: 'Please log in to access this feature.',
  FORBIDDEN: 'You do not have permission to access this resource.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  APPOINTMENT_CONFLICT: 'This time slot is no longer available.',
  PAYMENT_ERROR: 'Payment processing failed. Please try again.'
};

// Messages de succès
export const SUCCESS_MESSAGES = {
  APPOINTMENT_BOOKED: 'Appointment booked successfully!',
  APPOINTMENT_CANCELLED: 'Appointment cancelled successfully.',
  PROFILE_UPDATED: 'Profile updated successfully.',
  REVIEW_SUBMITTED: 'Review submitted successfully.',
  FAVORITE_ADDED: 'Doctor added to favorites.',
  FAVORITE_REMOVED: 'Doctor removed from favorites.'
};

// Configuration de pagination
export const PAGINATION_CONFIG = {
  DEFAULT_PAGE_SIZE: 12,
  MAX_PAGE_SIZE: 50,
  VISIBLE_PAGES: 5
};

// Formats de date et heure
export const DATE_FORMATS = {
  DISPLAY: 'MMM DD, YYYY',
  INPUT: 'YYYY-MM-DD',
  TIME: 'HH:mm',
  DATETIME: 'MMM DD, YYYY [at] HH:mm',
  RELATIVE: 'relative' // pour "2 hours ago", etc.
};

// Thème et couleurs
export const THEME_COLORS = {
  PRIMARY: '#4d89b1',
  PRIMARY_DARK: '#3d6c91',
  PRIMARY_LIGHT: '#a0c3e0',
  SUCCESS: '#10b981',
  ERROR: '#ef4444',
  WARNING: '#f59e0b',
  INFO: '#3b82f6',
  GRAY_50: '#f9fafb',
  GRAY_100: '#f3f4f6',
  GRAY_200: '#e5e7eb',
  GRAY_300: '#d1d5db',
  GRAY_400: '#9ca3af',
  GRAY_500: '#6b7280',
  GRAY_600: '#4b5563',
  GRAY_700: '#374151',
  GRAY_800: '#1f2937',
  GRAY_900: '#111827'
};

// Configuration des notifications
export const NOTIFICATION_CONFIG = {
  DURATION: 5000, // 5 secondes
  POSITION: 'top-right',
  MAX_NOTIFICATIONS: 3
};

// URLs des images par défaut
export const DEFAULT_IMAGES = {
  DOCTOR_AVATAR: '/images/default-doctor.png',
  PATIENT_AVATAR: '/images/default-patient.png',
  CLINIC_PLACEHOLDER: '/images/clinic-placeholder.png',
  NO_IMAGE: '/images/no-image.png'
};

// Configuration des médias sociaux (pour le footer)
export const SOCIAL_LINKS = {
  FACEBOOK: 'https://facebook.com/health-app',
  TWITTER: 'https://twitter.com/health-app',
  INSTAGRAM: 'https://instagram.com/health-app',
  LINKEDIN: 'https://linkedin.com/company/health-app'
};

// Configuration des métadonnées SEO
export const SEO_CONFIG = {
  DEFAULT_TITLE: 'Health - Book Medical Appointments Online',
  DEFAULT_DESCRIPTION: 'Find and book appointments with qualified healthcare professionals. Secure, fast, and reliable.',
  DEFAULT_KEYWORDS: 'doctor, appointment, healthcare, medical, booking, online',
  DEFAULT_IMAGE: '/images/og-image.png'
};

export default {
  API_CONFIG,
  MEDICAL_SPECIALTIES,
  COMMON_DISORDERS,
  CONSULTATION_TYPES,
  APPOINTMENT_STATUS,
  USER_ROLES,
  SORT_OPTIONS,
  AVAILABILITY_FILTERS,
  DISTANCE_FILTERS,
  RATING_FILTERS,
  SUPPORTED_LANGUAGES,
  TIME_SLOTS,
  WEEKDAYS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  PAGINATION_CONFIG,
  DATE_FORMATS,
  THEME_COLORS,
  NOTIFICATION_CONFIG,
  DEFAULT_IMAGES,
  SOCIAL_LINKS,
  SEO_CONFIG
};