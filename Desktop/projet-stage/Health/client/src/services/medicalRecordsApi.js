import api from './api';

export const medicalRecordsApi = {
  // Récupérer tous les records d'un patient
  getPatientRecords: (patientId) => api.get(`/patients/${patientId}/records`),
  
  // Récupérer un record spécifique
  getRecordById: (recordId) => api.get(`/records/${recordId}`),
  
  // Télécharger un record
  downloadRecord: (recordId) => api.get(`/records/${recordId}/download`, {
    responseType: 'blob'
  }),
  
  // Sauvegarder/bookmarker un record
  saveRecord: (recordId) => api.post(`/records/${recordId}/save`)
};