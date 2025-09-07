import React, { useState } from 'react';
import { FileText, Download, Calendar, User, Search, Filter, Eye, Plus, Activity, Pill, FlaskConical } from 'lucide-react';

export default function MedicalRecordsPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Données simulées
  const records = [
    {
      id: 1,
      type: 'prescription',
      title: 'Ordonnance - Hypertension',
      doctor: 'Dr. Sarah Johnson',
      date: '2025-09-05',
      description: 'Traitement pour l\'hypertension artérielle',
      medications: ['Amlodipine 5mg', 'Lisinopril 10mg'],
      status: 'active',
      file: 'prescription_001.pdf'
    },
    {
      id: 2,
      type: 'analysis',
      title: 'Analyses sanguines complètes',
      doctor: 'Dr. Ahmed Benali',
      date: '2025-08-28',
      description: 'Bilan sanguin complet avec profil lipidique',
      results: {
        'Cholestérol total': '4.2 mmol/L (Normal)',
        'Glycémie': '5.1 mmol/L (Normal)',
        'Créatinine': '80 μmol/L (Normal)'
      },
      status: 'completed',
      file: 'analyses_001.pdf'
    },
    {
      id: 3,
      type: 'report',
      title: 'Rapport de consultation - Cardiologie',
      doctor: 'Dr. Sarah Johnson',
      date: '2025-08-15',
      description: 'Consultation de suivi cardiologique avec ECG',
      findings: 'Rythme cardiaque régulier, pas d\'anomalie détectée',
      status: 'completed',
      file: 'rapport_cardio_001.pdf'
    },
    {
      id: 4,
      type: 'imaging',
      title: 'Radiographie thoracique',
      doctor: 'Dr. Karim Alaoui',
      date: '2025-07-20',
      description: 'Radiographie du thorax de face et profil',
      findings: 'Poumons clairs, pas d\'anomalie visible',
      status: 'completed',
      file: 'radio_thorax_001.pdf'
    },
    {
      id: 5,
      type: 'prescription',
      title: 'Ordonnance - Antibiotique',
      doctor: 'Dr. Fatima El Amrani',
      date: '2025-07-10',
      description: 'Traitement antibiotique pour infection respiratoire',
      medications: ['Amoxicilline 500mg', 'Paracétamol 1000mg'],
      status: 'completed',
      file: 'prescription_002.pdf'
    }
  ];

  const getTypeIcon = (type) => {
    switch (type) {
      case 'prescription':
        return Pill;
      case 'analysis':
        return FlaskConical;
      case 'report':
        return FileText;
      case 'imaging':
        return Activity;
      default:
        return FileText;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'prescription':
        return 'bg-green-100 text-green-800';
      case 'analysis':
        return 'bg-blue-100 text-blue-800';
      case 'report':
        return 'bg-purple-100 text-purple-800';
      case 'imaging':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeName = (type) => {
    switch (type) {
      case 'prescription':
        return 'Ordonnance';
      case 'analysis':
        return 'Analyse';
      case 'report':
        return 'Rapport';
      case 'imaging':
        return 'Imagerie';
      default:
        return 'Document';
    }
  };

  const filteredRecords = records.filter(record => {
    const matchesSearch = record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    return matchesSearch && record.type === activeTab;
  });

  const tabs = [
    { id: 'all', name: 'Tous', count: records.length },
    { id: 'prescription', name: 'Ordonnances', count: records.filter(r => r.type === 'prescription').length },
    { id: 'analysis', name: 'Analyses', count: records.filter(r => r.type === 'analysis').length },
    { id: 'report', name: 'Rapports', count: records.filter(r => r.type === 'report').length },
    { id: 'imaging', name: 'Imagerie', count: records.filter(r => r.type === 'imaging').length }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dossier Médical</h1>
          <p className="text-gray-600">Consultez vos documents médicaux et résultats</p>
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
                  placeholder="Rechercher dans vos documents..."
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

            {/* Upload Button */}
            <button className="bg-[#4d89b1] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#3d6c91] transition flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Ajouter un document</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <div className="flex space-x-8 px-6 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 border-b-2 font-medium text-sm whitespace-nowrap transition ${
                    activeTab === tab.id
                      ? 'border-[#4d89b1] text-[#4d89b1]'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.name} ({tab.count})
                </button>
              ))}
            </div>
          </div>

          {/* Records List */}
          <div className="divide-y divide-gray-200">
            {filteredRecords.length > 0 ? (
              filteredRecords.map((record) => {
                const IconComponent = getTypeIcon(record.type);
                return (
                  <div key={record.id} className="p-6 hover:bg-gray-50 transition">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="flex-shrink-0">
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getTypeColor(record.type)}`}>
                            <IconComponent className="h-6 w-6" />
                          </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 truncate">{record.title}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(record.type)}`}>
                              {getTypeName(record.type)}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
                            <div className="flex items-center space-x-2 text-gray-600">
                              <User className="h-4 w-4" />
                              <span>{record.doctor}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-gray-600">
                              <Calendar className="h-4 w-4" />
                              <span>{new Date(record.date).toLocaleDateString('fr-FR')}</span>
                            </div>
                          </div>

                          <p className="text-gray-600 mb-3">{record.description}</p>

                          {/* Medications */}
                          {record.medications && (
                            <div className="mb-3">
                              <h4 className="font-medium text-gray-900 mb-2">Médicaments prescrits :</h4>
                              <div className="flex flex-wrap gap-2">
                                {record.medications.map((med, index) => (
                                  <span key={index} className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm">
                                    {med}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Results */}
                          {record.results && (
                            <div className="mb-3">
                              <h4 className="font-medium text-gray-900 mb-2">Résultats :</h4>
                              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                {Object.entries(record.results).map(([key, value]) => (
                                  <div key={key} className="flex justify-between items-center py-1">
                                    <span className="text-sm font-medium text-gray-700">{key}:</span>
                                    <span className="text-sm text-blue-800">{value}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Findings */}
                          {record.findings && (
                            <div className="mb-3">
                              <h4 className="font-medium text-gray-900 mb-2">Observations :</h4>
                              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{record.findings}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col space-y-2 ml-4">
                        <button className="flex items-center space-x-2 px-4 py-2 bg-[#4d89b1] text-white rounded-lg text-sm hover:bg-[#3d6c91] transition">
                          <Eye className="h-4 w-4" />
                          <span>Voir</span>
                        </button>
                        <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50 transition">
                          <Download className="h-4 w-4" />
                          <span>Télécharger</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-12 text-center">
                <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Aucun document trouvé
                </h3>
                <p className="text-gray-500">
                  {searchTerm
                    ? 'Aucun document ne correspond à votre recherche.'
                    : 'Vous n\'avez encore aucun document médical.'
                  }
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Pill className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{records.filter(r => r.type === 'prescription').length}</p>
                <p className="text-gray-600">Ordonnances</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FlaskConical className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{records.filter(r => r.type === 'analysis').length}</p>
                <p className="text-gray-600">Analyses</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{records.filter(r => r.type === 'report').length}</p>
                <p className="text-gray-600">Rapports</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Activity className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{records.filter(r => r.type === 'imaging').length}</p>
                <p className="text-gray-600">Imageries</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}