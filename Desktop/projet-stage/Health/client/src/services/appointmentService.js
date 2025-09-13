// client/src/services/appointmentService.js

const APPOINTMENTS_STORAGE_KEY = 'healthApp_appointments';

// Données mockées par défaut (comme dans AppointmentsPage)
const defaultAppointments = {
  upcoming: [
    {
      id: 1,
      doctor: 'Dr. Sarah Johnson',
      specialty: 'Cardiologue',
      date: '2025-09-15',
      time: '14:30',
      location: 'Cabinet Médical Central',
      address: '123 Rue de la Santé, Casablanca',
      phone: '+212 5 22 XX XX XX',
      status: 'confirmed',
      notes: 'Consultation de suivi - Apporter les derniers résultats'
    },
    {
      id: 2,
      doctor: 'Dr. Ahmed Benali',
      specialty: 'Dermatologue',
      date: '2025-09-20',
      time: '10:00',
      location: 'Clinique Atlas',
      address: '456 Avenue Mohammed V, Casablanca',
      phone: '+212 5 22 YY YY YY',
      status: 'pending',
      notes: 'Contrôle dermatologique annuel'
    },
    {
      id: 3,
      doctor: 'Dr. Fatima El Amrani',
      specialty: 'Ophtalmologue',
      date: '2025-10-05',
      time: '16:15',
      location: 'Centre Vision Plus',
      address: '789 Boulevard Zerktouni, Casablanca',
      phone: '+212 5 22 ZZ ZZ ZZ',
      status: 'confirmed',
      notes: 'Examen de vue complet'
    }
  ],
  past: [
    {
      id: 4,
      doctor: 'Dr. Karim Alaoui',
      specialty: 'Médecin généraliste',
      date: '2025-08-28',
      time: '09:30',
      location: 'Cabinet Dr. Alaoui',
      address: '321 Rue Ibn Sina, Casablanca',
      phone: '+212 5 22 AA AA AA',
      status: 'completed',
      notes: 'Consultation générale - Bilan de santé'
    },
    {
      id: 5,
      doctor: 'Dr. Laila Berrada',
      specialty: 'Gynécologue',
      date: '2025-08-15',
      time: '11:00',
      location: 'Clinique Internationale',
      address: '654 Avenue Hassan II, Casablanca',
      phone: '+212 5 22 BB BB BB',
      status: 'completed',
      notes: 'Consultation de routine'
    },
    {
      id: 6,
      doctor: 'Dr. Omar Fassi',
      specialty: 'Neurologue',
      date: '2025-07-10',
      time: '15:45',
      location: 'Hôpital Ibn Sina',
      address: '987 Rue des Hôpitaux, Casablanca',
      phone: '+212 5 22 CC CC CC',
      status: 'cancelled',
      notes: 'Rendez-vous annulé par le patient',
      cancellationReason: 'scheduling_conflict'
    }
  ]
};

class AppointmentService {
  // Initialiser les données par défaut si elles n'existent pas
  initializeDefaultData() {
    const stored = localStorage.getItem(APPOINTMENTS_STORAGE_KEY);
    if (!stored) {
      this.saveAppointments(defaultAppointments);
    }
  }

  // Récupérer tous les rendez-vous
  getAllAppointments() {
    try {
      this.initializeDefaultData();
      const stored = localStorage.getItem(APPOINTMENTS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : defaultAppointments;
    } catch (error) {
      console.error('Error loading appointments:', error);
      return defaultAppointments;
    }
  }

  // Sauvegarder tous les rendez-vous
  saveAppointments(appointments) {
    try {
      localStorage.setItem(APPOINTMENTS_STORAGE_KEY, JSON.stringify(appointments));
    } catch (error) {
      console.error('Error saving appointments:', error);
    }
  }

  // Créer un nouveau rendez-vous
  createAppointment(appointmentData) {
    try {
      const appointments = this.getAllAppointments();
      
      // Générer un nouvel ID
      const allIds = [
        ...appointments.upcoming.map(apt => apt.id),
        ...appointments.past.map(apt => apt.id)
      ];
      const newId = Math.max(...allIds, 0) + 1;

      // Créer le nouveau rendez-vous avec le format correct
      const newAppointment = {
        id: newId,
        doctor: appointmentData.doctor,
        specialty: appointmentData.specialty,
        date: appointmentData.date,
        time: appointmentData.time,
        location: appointmentData.location || 'Medical Clinic',
        address: appointmentData.address || appointmentData.location,
        phone: appointmentData.phone,
        status: 'confirmed',
        notes: appointmentData.notes || 'Appointment booked through online system',
        createdAt: new Date().toISOString()
      };

      // Ajouter aux rendez-vous à venir
      appointments.upcoming.push(newAppointment);

      // Trier par date
      appointments.upcoming.sort((a, b) => new Date(a.date) - new Date(b.date));

      // Sauvegarder
      this.saveAppointments(appointments);

      console.log('New appointment created:', newAppointment);
      return newAppointment;
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw error;
    }
  }

  // Récupérer les rendez-vous à venir
  getUpcomingAppointments() {
    const appointments = this.getAllAppointments();
    return appointments.upcoming || [];
  }

  // Récupérer les rendez-vous passés
  getPastAppointments() {
    const appointments = this.getAllAppointments();
    return appointments.past || [];
  }

  // Modifier un rendez-vous (NOUVELLE MÉTHODE)
  modifyAppointment(appointmentId, modifiedData) {
    try {
      const appointments = this.getAllAppointments();
      
      // Chercher le rendez-vous dans upcoming
      const appointmentIndex = appointments.upcoming.findIndex(apt => apt.id === appointmentId);
      
      if (appointmentIndex === -1) {
        throw new Error('Appointment not found or cannot be modified');
      }

      const currentAppointment = appointments.upcoming[appointmentIndex];

      // Vérifier si le créneau est disponible (seulement si date/heure changent)
      if ((modifiedData.date !== currentAppointment.date || modifiedData.time !== currentAppointment.time)) {
        const isAvailable = this.isTimeSlotAvailable(
          currentAppointment.doctor, 
          modifiedData.date, 
          modifiedData.time,
          appointmentId // Exclure le rendez-vous actuel de la vérification
        );
        
        if (!isAvailable) {
          throw new Error('This time slot is no longer available');
        }
      }

      // Mettre à jour le rendez-vous
      const updatedAppointment = {
        ...currentAppointment,
        date: modifiedData.date || currentAppointment.date,
        time: modifiedData.time || currentAppointment.time,
        notes: modifiedData.notes !== undefined ? modifiedData.notes : currentAppointment.notes,
        status: 'rescheduled', // Marquer comme reprogrammé si date/heure changent
        updatedAt: new Date().toISOString()
      };

      // Si seules les notes changent, garder le statut original
      if (modifiedData.date === currentAppointment.date && 
          modifiedData.time === currentAppointment.time) {
        updatedAppointment.status = currentAppointment.status;
      }

      appointments.upcoming[appointmentIndex] = updatedAppointment;

      // Re-trier par date
      appointments.upcoming.sort((a, b) => new Date(a.date) - new Date(b.date));

      this.saveAppointments(appointments);
      
      console.log('Appointment modified:', updatedAppointment);
      return updatedAppointment;
    } catch (error) {
      console.error('Error modifying appointment:', error);
      throw error;
    }
  }

  // Modifier un rendez-vous (méthode générique existante - mise à jour)
  updateAppointment(appointmentId, updates) {
    try {
      const appointments = this.getAllAppointments();
      
      // Chercher dans upcoming
      let appointmentIndex = appointments.upcoming.findIndex(apt => apt.id === appointmentId);
      let appointmentType = 'upcoming';
      
      // Si pas trouvé dans upcoming, chercher dans past
      if (appointmentIndex === -1) {
        appointmentIndex = appointments.past.findIndex(apt => apt.id === appointmentId);
        appointmentType = 'past';
      }

      if (appointmentIndex !== -1) {
        // Mettre à jour le rendez-vous
        appointments[appointmentType][appointmentIndex] = {
          ...appointments[appointmentType][appointmentIndex],
          ...updates,
          updatedAt: new Date().toISOString()
        };

        this.saveAppointments(appointments);
        return appointments[appointmentType][appointmentIndex];
      }

      throw new Error('Appointment not found');
    } catch (error) {
      console.error('Error updating appointment:', error);
      throw error;
    }
  }

  // Annuler un rendez-vous (MÉTHODE AMÉLIORÉE)
  cancelAppointment(appointmentId, reason = '') {
    try {
      const appointments = this.getAllAppointments();
      
      // Chercher le rendez-vous dans upcoming
      const appointmentIndex = appointments.upcoming.findIndex(apt => apt.id === appointmentId);
      
      if (appointmentIndex === -1) {
        throw new Error('Appointment not found or cannot be cancelled');
      }

      const currentAppointment = appointments.upcoming[appointmentIndex];

      // Mettre à jour le statut et la raison d'annulation
      const cancelledAppointment = {
        ...currentAppointment,
        status: 'cancelled',
        cancellationReason: reason || 'No reason provided',
        cancelledAt: new Date().toISOString(),
        notes: currentAppointment.notes ? 
          `${currentAppointment.notes} | Cancelled by patient` : 
          'Cancelled by patient'
      };

      appointments.upcoming[appointmentIndex] = cancelledAppointment;

      this.saveAppointments(appointments);
      
      console.log('Appointment cancelled:', cancelledAppointment);
      return cancelledAppointment;
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      throw error;
    }
  }

  // Supprimer un rendez-vous
  deleteAppointment(appointmentId) {
    try {
      const appointments = this.getAllAppointments();
      
      // Supprimer des upcoming
      appointments.upcoming = appointments.upcoming.filter(apt => apt.id !== appointmentId);
      
      // Supprimer des past
      appointments.past = appointments.past.filter(apt => apt.id !== appointmentId);

      this.saveAppointments(appointments);
      return true;
    } catch (error) {
      console.error('Error deleting appointment:', error);
      throw error;
    }
  }

  // Vérifier si un créneau est disponible (MÉTHODE AMÉLIORÉE)
  isTimeSlotAvailable(doctorName, date, time, excludeAppointmentId = null) {
    const appointments = this.getAllAppointments();
    
    return !appointments.upcoming.some(apt => 
      apt.doctor === doctorName && 
      apt.date === date && 
      apt.time === time &&
      apt.status !== 'cancelled' &&
      apt.id !== excludeAppointmentId // Exclure le rendez-vous en cours de modification
    );
  }

  // Obtenir les créneaux disponibles pour un médecin à une date donnée
  getAvailableTimeSlots(doctorName, date) {
    const allTimeSlots = [
      '08:00', '09:00', '10:00', '11:00',
      '14:00', '15:00', '16:00', '17:00'
    ];

    const appointments = this.getAllAppointments();
    const bookedSlots = appointments.upcoming
      .filter(apt => 
        apt.doctor === doctorName && 
        apt.date === date && 
        apt.status !== 'cancelled'
      )
      .map(apt => apt.time);

    return allTimeSlots.filter(slot => !bookedSlots.includes(slot));
  }

  // Obtenir les raisons d'annulation les plus courantes
  getCancellationReasons() {
    return [
      { value: 'scheduling_conflict', label: 'Scheduling conflict' },
      { value: 'no_longer_needed', label: 'No longer needed' },
      { value: 'emergency', label: 'Emergency' },
      { value: 'doctor_unavailable', label: 'Doctor unavailable' },
      { value: 'other', label: 'Other' }
    ];
  }

  // Obtenir les statistiques des rendez-vous
  getAppointmentStats() {
    const appointments = this.getAllAppointments();
    
    const stats = {
      total: appointments.upcoming.length + appointments.past.length,
      upcoming: appointments.upcoming.length,
      past: appointments.past.length,
      confirmed: 0,
      pending: 0,
      completed: 0,
      cancelled: 0,
      rescheduled: 0
    };

    [...appointments.upcoming, ...appointments.past].forEach(apt => {
      if (stats.hasOwnProperty(apt.status)) {
        stats[apt.status]++;
      }
    });

    return stats;
  }

  // Nettoyer le localStorage (utile pour le développement)
  clearAllAppointments() {
    localStorage.removeItem(APPOINTMENTS_STORAGE_KEY);
  }

  // Réinitialiser avec les données par défaut
  resetToDefaults() {
    this.clearAllAppointments();
    this.saveAppointments(defaultAppointments);
  }
}

// Exporter une instance singleton
const appointmentService = new AppointmentService();
export default appointmentService;