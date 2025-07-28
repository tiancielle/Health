// import api from './api';

// export const doctorService = {
//   // Authentification docteur
//   login: async (credentials) => {
//     try {
//       const response = await api.post('/auth/doctor/login', credentials);
      
//       // Stocker le token si rememberMe est activé
//       if (credentials.rememberMe && response.data.token) {
//         localStorage.setItem('doctorToken', response.data.token);
//         localStorage.setItem('doctorRefreshToken', response.data.refreshToken);
//       } else {
//         sessionStorage.setItem('doctorToken', response.data.token);
//       }
      
//       return response;
//     } catch (error) {
//       console.error('Doctor login error:', error);
//       throw error;
//     }
//   },

//   // Déconnexion docteur
//   logout: async () => {
//     try {
//       await api.post('/auth/doctor/logout');
      
//       // Nettoyer les tokens
//       localStorage.removeItem('doctorToken');
//       localStorage.removeItem('doctorRefreshToken');
//       sessionStorage.removeItem('doctorToken');
      
//     } catch (error) {
//       console.error('Doctor logout error:', error);
//       // Nettoyer les tokens même en cas d'erreur
//       localStorage.removeItem('doctorToken');
//       localStorage.removeItem('doctorRefreshToken');
//       sessionStorage.removeItem('doctorToken');
//     }
//   },

//   // Vérifier le token
//   verifyToken: async (token) => {
//     try {
//       const response = await api.get('/auth/doctor/verify', {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       return response.data;
//     } catch (error) {
//       throw error;
//     }
//   },

//   // Récupérer le profil du docteur
//   getProfile: async () => {
//     try {
//       const response = await api.get('/doctor/profile');
//       return response.data;
//     } catch (error) {
//       console.error('Get doctor profile error:', error);
//       throw error;
//     }
//   },

//   // Mettre à jour le profil
//   updateProfile: async (profileData) => {
//     try {
//       const response = await api.put('/doctor/profile', profileData);
//       return response.data;
//     } catch (error) {
//       console.error('Update doctor profile error:', error);
//       throw error;
//     }
//   },

//   // Récupérer le planning
//   getSchedule: async (dateRange) => {
//     try {
//       const response = await api.get('/doctor/schedule', {
//         params: dateRange
//       });
//       return response.data;
//     } catch (error) {
//       console.error('Get doctor schedule error:', error);
//       throw error;
//     }
//   },

//   // Mettre à jour le planning
//   updateSchedule: async (scheduleData) => {
//     try {
//       const response = await api.put('/doctor/schedule', scheduleData);
//       return response.data;
//     } catch (error) {
//       console.error('Update doctor schedule error:', error);
//       throw error;
//     }
//   },

//   // Récupérer les rendez-vous
//   getAppointments: async (filters) => {
//     try {
//       const response = await api.get('/doctor/appointments', {
//         params: filters
//       });
//       return response.data;
//     } catch (error) {
//       console.error('Get doctor appointments error:', error);
//       throw error;
//     }
//   },

//   // Confirmer un rendez-vous
//   confirmAppointment: async (appointmentId) => {
//     try {
//       const response = await api.patch(`/doctor/appointments/${appointmentId}/confirm`);
//       return response.data;
//     } catch (error) {
//       console.error('Confirm appointment error:', error);
//       throw error;
//     }
//   },

//   // Annuler un rendez-vous
//   cancelAppointment: async (appointmentId, reason) => {
//     try {
//       const response = await api.patch(`/doctor/appointments/${appointmentId}/cancel`, {
//         reason
//       });
//       return response.data;
//     } catch (error) {
//       console.error('Cancel appointment error:', error);
//       throw error;
//     }
//   },

//   // Récupérer les patients
//   getPatients: async (filters) => {
//     try {
//       const response = await api.get('/doctor/patients', {
//         params: filters
//       });
//       return response.data;
//     } catch (error) {
//       console.error('Get doctor patients error:', error);
//       throw error;
//     }
//   },

//   // Récupérer les dossiers médicaux d'un patient
//   getPatientRecords: async (patientId) => {
//     try {
//       const response = await api.get(`/doctor/patients/${patientId}/records`);
//       return response.data;
//     } catch (error) {
//       console.error('Get patient records error:', error);
//       throw error;
//     }
//   },

//   // Ajouter une note médicale
//   addMedicalNote: async (patientId, noteData) => {
//     try {
//       const response = await api.post(`/doctor/patients/${patientId}/notes`, noteData);
//       return response.data;
//     } catch (error) {
//       console.error('Add medical note error:', error);
//       throw error;
//     }
//   },

//   // Prescrire un médicament
//   prescribeMedication: async (patientId, prescriptionData) => {
//     try {
//       const response = await api.post(`/doctor/patients/${patientId}/prescriptions`, prescriptionData);
//       return response.data;
//     } catch (error) {
//       console.error('Prescribe medication error:', error);
//       throw error;
//     }
//   },

//   // Récupérer les statistiques du docteur
//   getStats: async (period) => {
//     try {
//       const response = await api.get('/doctor/stats', {
//         params: { period }
//       });
//       return response.data;
//     } catch (error) {
//       console.error('Get doctor stats error:', error);
//       throw error;
//     }
//   },

//   // Demander la réinitialisation du mot de passe
//   requestPasswordReset: async (email) => {
//     try {
//       const response = await api.post('/auth/doctor/forgot-password', { email });
//       return response.data;
//     } catch (error) {
//       console.error('Request password reset error:', error);
//       throw error;
//     }
//   },

//   // Réinitialiser le mot de passe
//   resetPassword: async (token, newPassword) => {
//     try {
//       const response = await api.post('/auth/doctor/reset-password', {
//         token,
//         password: newPassword
//       });
//       return response.data;
//     } catch (error) {
//       console.error('Reset password error:', error);
//       throw error;
//     }
//   },

//   // Changer le mot de passe
//   changePassword: async (currentPassword, newPassword) => {
//     try {
//       const response = await api.put('/doctor/change-password', {
//         currentPassword,
//         newPassword
//       });
//       return response.data;
//     } catch (error) {
//       console.error('Change password error:', error);
//       throw error;
//     }
//   }
// };

// export default doctorService;