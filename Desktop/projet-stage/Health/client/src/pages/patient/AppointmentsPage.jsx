// client/src/pages/patient/AppointmentsPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, User, Phone, Plus, Filter, Search, ChevronLeft, CheckCircle, XCircle, AlertCircle, RefreshCw, X, Edit2, Trash2 } from 'lucide-react';
import Header from '../../components/layout/Header';
import appointmentService from '../../services/appointmentService';

// Modal de modification de rendez-vous
const ModifyAppointmentModal = ({ appointment, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (appointment && isOpen) {
      setFormData({
        date: appointment.date,
        time: appointment.time,
        notes: appointment.notes || ''
      });
    }
  }, [appointment, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(appointment.id, formData);
      onClose();
    } catch (error) {
      console.error('Error modifying appointment:', error);
      alert('Error modifying appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!isOpen || !appointment) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Modify Appointment</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Doctor Info (read-only) */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#4d89b1] rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{appointment.doctor}</h3>
                <p className="text-sm text-gray-600">{appointment.specialty}</p>
              </div>
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => handleChange('date', e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4d89b1] focus:border-transparent"
              required
            />
          </div>

          {/* Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Time
            </label>
            <select
              value={formData.time}
              onChange={(e) => handleChange('time', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4d89b1] focus:border-transparent"
              required
            >
              <option value="">Select a time</option>
              <option value="08:00">08:00 AM</option>
              <option value="09:00">09:00 AM</option>
              <option value="10:00">10:00 AM</option>
              <option value="11:00">11:00 AM</option>
              <option value="14:00">02:00 PM</option>
              <option value="15:00">03:00 PM</option>
              <option value="16:00">04:00 PM</option>
              <option value="17:00">05:00 PM</option>
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes (Optional)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="Add any special notes or requirements..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4d89b1] focus:border-transparent resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-[#4d89b1] text-white rounded-lg hover:bg-[#3d6c91] transition disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Modal de confirmation d'annulation
const CancelAppointmentModal = ({ appointment, isOpen, onClose, onConfirm }) => {
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm(appointment.id, reason);
      onClose();
      setReason('');
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      alert('Error cancelling appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !appointment) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Cancel Appointment</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Appointment Info */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-2">
              <XCircle className="h-5 w-5 text-red-500" />
              <h3 className="font-medium text-red-900">You're about to cancel this appointment:</h3>
            </div>
            <div className="ml-8 space-y-1 text-sm">
              <p><strong>Doctor:</strong> {appointment.doctor}</p>
              <p><strong>Date:</strong> {new Date(appointment.date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</p>
              <p><strong>Time:</strong> {appointment.time}</p>
            </div>
          </div>

          {/* Cancellation Reason */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason for cancellation (Optional)
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="">Select a reason</option>
              <option value="scheduling_conflict">Scheduling conflict</option>
              <option value="no_longer_needed">No longer needed</option>
              <option value="emergency">Emergency</option>
              <option value="doctor_unavailable">Doctor unavailable</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="text-sm text-gray-600">
            <p>⚠️ <strong>Important:</strong> Please cancel at least 24 hours in advance to avoid cancellation fees.</p>
          </div>

          {/* Actions */}
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              disabled={loading}
            >
              Keep Appointment
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Cancelling...' : 'Cancel Appointment'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function AppointmentsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [searchTerm, setSearchTerm] = useState('');
  const [appointments, setAppointments] = useState({ upcoming: [], past: [] });
  const [loading, setLoading] = useState(true);
  
  // États pour les modales
  const [modifyModal, setModifyModal] = useState({ isOpen: false, appointment: null });
  const [cancelModal, setCancelModal] = useState({ isOpen: false, appointment: null });

  // Charger les rendez-vous depuis le service
  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = () => {
    try {
      setLoading(true);
      const allAppointments = appointmentService.getAllAppointments();
      setAppointments(allAppointments);
    } catch (error) {
      console.error('Error loading appointments:', error);
      // Fallback aux données par défaut
      setAppointments({ upcoming: [], past: [] });
    } finally {
      setLoading(false);
    }
  };

  // Rafraîchir les données
  const handleRefresh = () => {
    loadAppointments();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'rescheduled':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return CheckCircle;
      case 'pending':
        return AlertCircle;
      case 'completed':
        return CheckCircle;
      case 'cancelled':
        return XCircle;
      case 'rescheduled':
        return RefreshCw;
      default:
        return AlertCircle;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmed';
      case 'pending':
        return 'Pending';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      case 'rescheduled':
        return 'Rescheduled';
      default:
        return status;
    }
  };

  // Gérer la modification d'un rendez-vous
  const handleModifyAppointment = (appointment) => {
    setModifyModal({ isOpen: true, appointment });
  };

  // Sauvegarder les modifications
  const handleSaveModification = async (appointmentId, modifiedData) => {
    try {
      // Appeler le service pour modifier le rendez-vous
      await appointmentService.modifyAppointment(appointmentId, modifiedData);
      
      // Recharger les données
      loadAppointments();
      
      // Afficher un message de succès
      alert('Appointment modified successfully!');
    } catch (error) {
      console.error('Error modifying appointment:', error);
      throw error;
    }
  };

  // Gérer l'annulation d'un rendez-vous
  const handleCancelAppointment = (appointment) => {
    setCancelModal({ isOpen: true, appointment });
  };

  // Confirmer l'annulation
  const handleConfirmCancellation = async (appointmentId, reason) => {
    try {
      // Appeler le service pour annuler le rendez-vous
      await appointmentService.cancelAppointment(appointmentId, reason);
      
      // Recharger les données
      loadAppointments();
      
      // Afficher un message de succès
      alert('Appointment cancelled successfully!');
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      throw error;
    }
  };

  // Gérer la création d'un nouveau rendez-vous
  const handleNewAppointment = () => {
    // Rediriger vers la page de recherche de médecins
    navigate('/');
  };

  const filteredAppointments = appointments[activeTab].filter(appointment =>
    appointment.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin text-[#4d89b1] mx-auto mb-2" />
            <p className="text-gray-600">Loading appointments...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header avec bouton retour */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-600 hover:text-[#4d89b1] font-medium mb-4 transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
            <span>Back</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Appointments</h1>
          <p className="text-gray-600">Manage your medical consultations</p>
        </div>

        {/* Actions Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search doctor or specialty..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4d89b1] focus:border-transparent w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              {/* Filter */}
              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                <Filter className="h-4 w-4" />
                <span>Filter</span>
              </button>

              {/* Refresh */}
              <button 
                onClick={handleRefresh}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Refresh</span>
              </button>
            </div>

            {/* New Appointment Button */}
            <button 
              onClick={handleNewAppointment}
              className="bg-[#4d89b1] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#3d6c91] transition flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>New Appointment</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6">
          <div className="border-b border-gray-200">
            <div className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`py-4 border-b-2 font-medium text-sm transition ${
                  activeTab === 'upcoming'
                    ? 'border-[#4d89b1] text-[#4d89b1]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Upcoming ({appointments.upcoming.length})
              </button>
              <button
                onClick={() => setActiveTab('past')}
                className={`py-4 border-b-2 font-medium text-sm transition ${
                  activeTab === 'past'
                    ? 'border-[#4d89b1] text-[#4d89b1]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Past ({appointments.past.length})
              </button>
            </div>
          </div>

          {/* Appointments List */}
          <div className="divide-y divide-gray-100">
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map((appointment) => {
                const StatusIcon = getStatusIcon(appointment.status);
                return (
                  <div key={appointment.id} className="p-6 hover:bg-gray-50 transition">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-4">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-[#4d89b1] rounded-full flex items-center justify-center">
                              <User className="h-6 w-6 text-white" />
                            </div>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900">{appointment.doctor}</h3>
                            <p className="text-gray-600">{appointment.specialty}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <StatusIcon className="h-4 w-4" />
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                              {getStatusText(appointment.status)}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                          <div className="flex items-center space-x-2 text-gray-600">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(appointment.date).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-gray-600">
                            <Clock className="h-4 w-4" />
                            <span>{appointment.time}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-gray-600">
                            <Phone className="h-4 w-4" />
                            <span>{appointment.phone}</span>
                          </div>
                        </div>

                        <div className="flex items-start space-x-2 text-gray-600 mb-4">
                          <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium">{appointment.location}</p>
                            <p className="text-sm">{appointment.address}</p>
                          </div>
                        </div>

                        {appointment.notes && (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                            <p className="text-sm text-blue-800">
                              <span className="font-medium">Note:</span> {appointment.notes}
                            </p>
                          </div>
                        )}

                        {/* Show cancellation reason if cancelled */}
                        {appointment.status === 'cancelled' && appointment.cancellationReason && (
                          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                            <p className="text-sm text-red-800">
                              <span className="font-medium">Cancellation reason:</span> {appointment.cancellationReason}
                            </p>
                          </div>
                        )}

                        {/* Show creation date for new appointments */}
                        {appointment.createdAt && (
                          <div className="mt-2">
                            <p className="text-xs text-gray-500">
                              Booked on {new Date(appointment.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      {activeTab === 'upcoming' && appointment.status !== 'cancelled' && (
                        <div className="flex flex-col space-y-2 ml-4">
                          <button 
                            onClick={() => handleModifyAppointment(appointment)}
                            className="px-4 py-2 bg-[#4d89b1] text-white rounded-lg text-sm hover:bg-[#3d6c91] transition flex items-center space-x-2"
                          >
                            <Edit2 className="h-3 w-3" />
                            <span>Modify</span>
                          </button>
                          <button 
                            onClick={() => handleCancelAppointment(appointment)}
                            className="px-4 py-2 border border-red-300 text-red-600 rounded-lg text-sm hover:bg-red-50 transition flex items-center space-x-2"
                          >
                            <Trash2 className="h-3 w-3" />
                            <span>Cancel</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-12 text-center">
                <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No appointments found
                </h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm
                    ? 'No appointments match your search.'
                    : `You have no ${activeTab === 'upcoming' ? 'upcoming' : 'past'} appointments.`
                  }
                </p>
                {activeTab === 'upcoming' && !searchTerm && (
                  <button 
                    onClick={handleNewAppointment}
                    className="bg-[#4d89b1] text-white px-6 py-2 rounded-lg hover:bg-[#3d6c91] transition flex items-center space-x-2 mx-auto"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Schedule Appointment</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Debug info (only in development) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-medium text-yellow-800 mb-2">Debug Info</h4>
            <p className="text-sm text-yellow-700">
              Total appointments: {appointments.upcoming.length + appointments.past.length} 
              (Upcoming: {appointments.upcoming.length}, Past: {appointments.past.length})
            </p>
            <button 
              onClick={() => {
                appointmentService.resetToDefaults();
                loadAppointments();
              }}
              className="mt-2 text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded"
            >
              Reset to defaults
            </button>
          </div>
        )}
      </div>

      {/* Modales */}
      <ModifyAppointmentModal
        appointment={modifyModal.appointment}
        isOpen={modifyModal.isOpen}
        onClose={() => setModifyModal({ isOpen: false, appointment: null })}
        onSave={handleSaveModification}
      />

      <CancelAppointmentModal
        appointment={cancelModal.appointment}
        isOpen={cancelModal.isOpen}
        onClose={() => setCancelModal({ isOpen: false, appointment: null })}
        onConfirm={handleConfirmCancellation}
      />
    </div>
  );
}