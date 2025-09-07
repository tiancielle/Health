import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  MessageCircle,
  FileText,
  User,
  Clock,
  Bell,
  Activity,
  Heart,
  Thermometer,
  Weight,
  ChevronRight,
  Plus,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

export default function PatientDashboardPage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Données simulées
  const dashboardData = {
    upcomingAppointments: [
      {
        id: 1,
        doctor: 'Dr. Sarah Johnson',
        specialty: 'Cardiologue',
        date: '2025-09-15',
        time: '14:30',
        location: 'Cabinet Médical Central',
      },
      {
        id: 2,
        doctor: 'Dr. Ahmed Benali',
        specialty: 'Dermatologue',
        date: '2025-09-20',
        time: '10:00',
        location: 'Clinique Atlas',
      },
    ],
    recentMessages: [
      {
        id: 1,
        doctor: 'Dr. Sarah Johnson',
        message: 'Vos derniers résultats sont très encourageants...',
        timestamp: '2025-09-07T10:30:00',
        unread: true,
      },
      {
        id: 2,
        doctor: 'Dr. Ahmed Benali',
        message: 'Merci pour les photos. Le traitement semble...',
        timestamp: '2025-09-06T14:20:00',
        unread: false,
      },
    ],
    recentDocuments: [
      {
        id: 1,
        title: 'Ordonnance - Hypertension',
        type: 'prescription',
        doctor: 'Dr. Sarah Johnson',
        date: '2025-09-05',
      },
      {
        id: 2,
        title: 'Analyses sanguines complètes',
        type: 'analysis',
        doctor: 'Dr. Ahmed Benali',
        date: '2025-08-28',
      },
    ],
    vitals: {
      heartRate: { value: 72, unit: 'bpm', status: 'normal', lastUpdate: '2025-09-07' },
      bloodPressure: { value: '120/80', unit: 'mmHg', status: 'normal', lastUpdate: '2025-09-05' },
      temperature: { value: 36.8, unit: '°C', status: 'normal', lastUpdate: '2025-09-07' },
      weight: { value: 70, unit: 'kg', status: 'stable', lastUpdate: '2025-09-01' },
    },
    notifications: [
      {
        id: 1,
        type: 'appointment',
        title: 'Rendez-vous demain',
        message: "N'oubliez pas votre RDV avec Dr. Sarah Johnson à 14h30",
        timestamp: '2025-09-07T08:00:00',
        urgent: true,
      },
      {
        id: 2,
        type: 'medication',
        title: 'Prise de médicament',
        message: 'Il est temps de prendre votre Amlodipine',
        timestamp: '2025-09-07T08:00:00',
        urgent: false,
      },
    ],
  };

  const getVitalIcon = (key) => {
    switch (key) {
      case 'heartRate':
        return Heart;
      case 'bloodPressure':
        return Activity;
      case 'temperature':
        return Thermometer;
      case 'weight':
        return Weight;
      default:
        return Activity;
    }
  };

  const getVitalColor = (status) => {
    switch (status) {
      case 'normal':
        return 'text-green-600 bg-green-100';
      case 'warning':
        return 'text-yellow-600 bg-yellow-100';
      case 'danger':
        return 'text-red-600 bg-red-100';
      case 'stable':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getVitalName = (key) => {
    switch (key) {
      case 'heartRate':
        return 'Fréquence cardiaque';
      case 'bloodPressure':
        return 'Tension artérielle';
      case 'temperature':
        return 'Température';
      case 'weight':
        return 'Poids';
      default:
        return key;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bonjour, {currentUser?.name} 👋
          </h1>
          <p className="text-gray-600">Voici un aperçu de votre santé aujourd'hui</p>
        </div>

        {/* Notifications urgentes */}
        {dashboardData.notifications.some((n) => n.urgent) && (
          <div className="mb-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Bell className="h-5 w-5 text-red-600 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-red-800 mb-1">Notifications importantes</h3>
                  {dashboardData.notifications
                    .filter((n) => n.urgent)
                    .map((notification) => (
                      <p key={notification.id} className="text-red-700 text-sm">
                        {notification.message}
                      </p>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Stat 1: RDV à venir */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {dashboardData.upcomingAppointments.length}
                </p>
                <p className="text-gray-600">RDV à venir</p>
              </div>
            </div>
          </div>

          {/* Stat 2: Messages non lus */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <MessageCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {dashboardData.recentMessages.filter((m) => m.unread).length}
                </p>
                <p className="text-gray-600">Messages non lus</p>
              </div>
            </div>
          </div>

          {/* Stat 3: Nouveaux documents */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {dashboardData.recentDocuments.length}
                </p>
                <p className="text-gray-600">Nouveaux documents</p>
              </div>
            </div>
          </div>

          {/* Stat 4: Notifications */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Bell className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {dashboardData.notifications.length}
                </p>
                <p className="text-gray-600">Notifications</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Prochains rendez-vous */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Prochains rendez-vous</h2>
                  <button
                    onClick={() => navigate('/patient/appointments')}
                    className="text-[#4d89b1] hover:text-[#3d6c91] font-medium flex items-center space-x-1"
                  >
                    <span>Voir tout</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="p-6">
                {dashboardData.upcomingAppointments.length > 0 ? (
                  <div className="space-y-4">
                    {dashboardData.upcomingAppointments.slice(0, 2).map((appointment) => (
                      <div
                        key={appointment.id}
                        className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-[#4d89b1] rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-white" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{appointment.doctor}</h3>
                          <p className="text-sm text-gray-600">{appointment.specialty}</p>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4" />
                              <span>{new Date(appointment.date).toLocaleDateString('fr-FR')}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="h-4 w-4" />
                              <span>{appointment.time}</span>
                            </div>
                          </div>
                        </div>
                        <button className="px-4 py-2 text-[#4d89b1] border border-[#4d89b1] rounded-lg hover:bg-[#4d89b1] hover:text-white transition text-sm">
                          Détails
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Aucun rendez-vous à venir</p>
                    <button className="mt-4 bg-[#4d89b1] text-white px-6 py-2 rounded-lg hover:bg-[#3d6c91] transition flex items-center space-x-2 mx-auto">
                      <Plus className="h-4 w-4" />
                      <span>Prendre rendez-vous</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Messages récents */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Messages récents</h2>
                  <button
                    onClick={() => navigate('/patient/messages')}
                    className="text-[#4d89b1] hover:text-[#3d6c91] font-medium flex items-center space-x-1"
                  >
                    <span>Voir tout</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="p-6">
                {dashboardData.recentMessages.length > 0 ? (
                  <div className="space-y-4">
                    {dashboardData.recentMessages.slice(0, 3).map((message) => (
                      <div
                        key={message.id}
                        className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
                      >
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-[#4d89b1] rounded-full flex items-center justify-center">
                            <User className="h-4 w-4 text-white" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium text-gray-900">{message.doctor}</h4>
                            {message.unread && (
                              <span className="w-2 h-2 bg-[#4d89b1] rounded-full"></span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 truncate">{message.message}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(message.timestamp).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Aucun message récent</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Signes vitaux */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Signes vitaux</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {Object.entries(dashboardData.vitals).map(([key, vital]) => {
                    const IconComponent = getVitalIcon(key);
                    return (
                      <div
                        key={key}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${getVitalColor(vital.status)}`}>
                            <IconComponent className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{getVitalName(key)}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(vital.lastUpdate).toLocaleDateString('fr-FR')}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            {vital.value} {vital.unit}
                          </p>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${getVitalColor(vital.status)}`}
                          >
                            {vital.status}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Documents récents */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Documents récents</h2>
                  <button
                    onClick={() => navigate('/patient/records')}
                    className="text-[#4d89b1] hover:text-[#3d6c91] font-medium flex items-center space-x-1"
                  >
                    <span>Voir tout</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="p-6">
                {dashboardData.recentDocuments.length > 0 ? (
                  <div className="space-y-3">
                    {dashboardData.recentDocuments.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
                      >
                        <FileText className="h-5 w-5 text-[#4d89b1]" />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 text-sm">{doc.title}</p>
                          <p className="text-xs text-gray-500">{doc.doctor}</p>
                          <p className="text-xs text-gray-400">
                            {new Date(doc.date).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <FileText className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">Aucun document récent</p>
                  </div>
                )}
              </div>
            </div>

            {/* Actions rapides */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Actions rapides</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => navigate('/patient/appointments')}
                    className="flex flex-col items-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition"
                  >
                    <Calendar className="h-6 w-6 text-blue-600 mb-2" />
                    <span className="text-sm font-medium text-blue-800">Rendez-vous</span>
                  </button>
                  <button
                    onClick={() => navigate('/patient/messages')}
                    className="flex flex-col items-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition"
                  >
                    <MessageCircle className="h-6 w-6 text-green-600 mb-2" />
                    <span className="text-sm font-medium text-green-800">Messages</span>
                  </button>
                  <button
                    onClick={() => navigate('/patient/records')}
                    className="flex flex-col items-center p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition"
                  >
                    <FileText className="h-6 w-6 text-purple-600 mb-2" />
                    <span className="text-sm font-medium text-purple-800">Dossiers</span>
                  </button>
                  <button
                    onClick={() => navigate('/patient/profile')}
                    className="flex flex-col items-center p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition"
                  >
                    <User className="h-6 w-6 text-orange-600 mb-2" />
                    <span className="text-sm font-medium text-orange-800">Profil</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}