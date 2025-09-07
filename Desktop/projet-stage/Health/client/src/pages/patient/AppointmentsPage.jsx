import React, { useState } from 'react';
import { Calendar, Clock, MapPin, User, Phone, Plus, Filter, Search } from 'lucide-react';

export default function AppointmentsPage() {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [searchTerm, setSearchTerm] = useState('');

  // Données simulées
  const appointments = {
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
      }
    ]
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
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmé';
      case 'pending':
        return 'En attente';
      case 'completed':
        return 'Terminé';
      case 'cancelled':
        return 'Annulé';
      default:
        return status;
    }
  };

  const filteredAppointments = appointments[activeTab].filter(appointment =>
    appointment.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mes Rendez-vous</h1>
          <p className="text-gray-600">Gérez vos consultations médicales</p>
        </div>

        {/* Actions Bar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Rechercher un médecin ou spécialité..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4d89b1] focus:border-transparent w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              {/* Filter */}
              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                <Filter className="h-4 w-4" />
                <span>Filtrer</span>
              </button>
            </div>

            {/* New Appointment Button */}
            <button className="bg-[#4d89b1] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#3d6c91] transition flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Nouveau RDV</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
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
                À venir ({appointments.upcoming.length})
              </button>
              <button
                onClick={() => setActiveTab('past')}
                className={`py-4 border-b-2 font-medium text-sm transition ${
                  activeTab === 'past'
                    ? 'border-[#4d89b1] text-[#4d89b1]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Passés ({appointments.past.length})
              </button>
            </div>
          </div>

          {/* Appointments List */}
          <div className="divide-y divide-gray-200">
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map((appointment) => (
                <div key={appointment.id} className="p-6 hover:bg-gray-50 transition">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-3">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-[#4d89b1] rounded-full flex items-center justify-center">
                            <User className="h-6 w-6 text-white" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">{appointment.doctor}</h3>
                          <p className="text-gray-600">{appointment.specialty}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                          {getStatusText(appointment.status)}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center space-x-2 text-gray-600">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(appointment.date).toLocaleDateString('fr-FR', {
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
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <p className="text-sm text-blue-800">
                            <span className="font-medium">Note :</span> {appointment.notes}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    {activeTab === 'upcoming' && (
                      <div className="flex flex-col space-y-2 ml-4">
                        <button className="px-4 py-2 bg-[#4d89b1] text-white rounded-lg text-sm hover:bg-[#3d6c91] transition">
                          Modifier
                        </button>
                        <button className="px-4 py-2 border border-red-300 text-red-600 rounded-lg text-sm hover:bg-red-50 transition">
                          Annuler
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center">
                <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Aucun rendez-vous trouvé
                </h3>
                <p className="text-gray-500">
                  {searchTerm
                    ? 'Aucun rendez-vous ne correspond à votre recherche.'
                    : `Vous n'avez aucun rendez-vous ${activeTab === 'upcoming' ? 'à venir' : 'passé'}.`
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}