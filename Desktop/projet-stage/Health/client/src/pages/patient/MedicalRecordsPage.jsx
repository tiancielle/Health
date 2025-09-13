//pages/patient/MedicalRecords
import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Eye, 
  Search, 
  Filter, 
  Calendar, 
  User, 
  Activity, 
  TestTube, 
  Pill, 
  File,
  Stethoscope,
  FileCheck,
  Save,
  X,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle
} from 'lucide-react';

// Header Component - copié de votre fichier
const Header = ({ onLogoClick }) => {
  const handleLogoClick = () => {
    if (onLogoClick) onLogoClick();
  };

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div
              className="flex-shrink-0 flex items-center cursor-pointer"
              onClick={handleLogoClick}
            >
              <Activity className="h-8 w-8 text-[#4d89b1]" />
              <span className="ml-2 text-2xl font-bold text-gray-900">Health</span>
            </div>
          </div>

          {/* Navigation simulée */}
          <nav className="flex space-x-8">
            <button className="text-gray-700 hover:text-[#4d89b1] px-3 py-2 text-sm font-medium transition">
              Find a Doctor
            </button>
            <button className="text-gray-700 hover:text-[#4d89b1] px-3 py-2 text-sm font-medium transition">
              About Us
            </button>
          </nav>

          {/* User Menu simulé */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-gray-700">
              <User className="h-5 w-5" />
              <span>M. Benali</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default function MedicalRecordsPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewingRecord, setViewingRecord] = useState(null);

  // Données complètes des dossiers médicaux
  const medicalRecords = {
    all: [
      {
        id: 1,
        title: 'Blood Analysis - Complete Panel',
        type: 'analysis',
        doctor: 'Dr. Sarah Johnson',
        specialty: 'Cardiologue',
        date: '2025-09-05',
        time: '10:30 AM',
        status: 'ready',
        fileSize: '2.4 MB',
        description: 'Complete blood count, lipid panel, glucose level',
        location: 'HealthLab Center - Casablanca',
        results: {
          summary: 'All values within normal ranges. Excellent cardiovascular health indicators.',
          details: [
            { parameter: 'Hemoglobin', value: '14.2 g/dL', range: '12.0-16.0', status: 'normal' },
            { parameter: 'White Blood Cells', value: '6,800/μL', range: '4,500-11,000', status: 'normal' },
            { parameter: 'Cholesterol Total', value: '185 mg/dL', range: '<200', status: 'excellent' },
            { parameter: 'HDL Cholesterol', value: '58 mg/dL', range: '>40', status: 'excellent' },
            { parameter: 'LDL Cholesterol', value: '110 mg/dL', range: '<130', status: 'normal' },
            { parameter: 'Glucose', value: '92 mg/dL', range: '70-100', status: 'normal' }
          ],
          notes: 'Patient shows excellent metabolic health. Continue current lifestyle and diet.'
        }
      },
      {
        id: 2,
        title: 'Prescription - Hypertension',
        type: 'prescription',
        doctor: 'Dr. Sarah Johnson',
        specialty: 'Cardiologue',
        date: '2025-09-05',
        time: '11:15 AM',
        status: 'active',
        fileSize: '1.1 MB',
        description: 'Amlodipine 5mg, Lisinopril 10mg - 30 days',
        location: 'CardioHealth Clinic - Casablanca',
        prescription: {
          medications: [
            {
              name: 'Amlodipine',
              dosage: '5mg',
              frequency: 'Once daily',
              duration: '30 days',
              instructions: 'Take in the morning with or without food',
              quantity: '30 tablets'
            },
            {
              name: 'Lisinopril',
              dosage: '10mg',
              frequency: 'Once daily',
              duration: '30 days',
              instructions: 'Take in the evening, preferably at the same time',
              quantity: '30 tablets'
            }
          ],
          notes: 'Monitor blood pressure daily. Return if experiencing dizziness, persistent cough, or swelling.',
          nextVisit: '2025-10-05',
          refills: 2
        }
      },
      {
        id: 3,
        title: 'Dermatological Examination Report',
        type: 'report',
        doctor: 'Dr. Ahmed Benali',
        specialty: 'Dermatologue',
        date: '2025-08-28',
        time: '2:00 PM',
        status: 'ready',
        fileSize: '3.2 MB',
        description: 'Annual skin examination with photographs',
        location: 'SkinCare Clinic - Casablanca',
        report: {
          findings: 'No suspicious lesions detected. Several benign moles documented with photographs.',
          recommendations: [
            'Continue monthly self-examinations',
            'Use broad-spectrum sunscreen SPF 30+',
            'Schedule next examination in 12 months'
          ],
          images: 3,
          followUp: '2026-08-28'
        }
      },
      {
        id: 4,
        title: 'General Consultation Notes',
        type: 'consultation',
        doctor: 'Dr. Karim Alaoui',
        specialty: 'Médecin généraliste',
        date: '2025-07-20',
        time: '9:30 AM',
        status: 'ready',
        fileSize: '0.9 MB',
        description: 'Annual health checkup - Overall good health',
        location: 'Family Health Center - Casablanca',
        consultation: {
          chiefComplaint: 'Annual routine checkup',
          vitals: {
            bloodPressure: '120/78 mmHg',
            heartRate: '72 bpm',
            temperature: '36.8°C',
            weight: '75 kg',
            height: '175 cm',
            bmi: '24.5'
          },
          assessment: 'Patient in excellent health. All systems normal.',
          plan: 'Continue current lifestyle. Regular exercise and balanced diet recommended.',
          nextVisit: '2026-07-20'
        }
      }
    ]
  };

  // Filtrer par type
  medicalRecords.prescriptions = medicalRecords.all.filter(record => record.type === 'prescription');
  medicalRecords.analyses = medicalRecords.all.filter(record => record.type === 'analysis');
  medicalRecords.reports = medicalRecords.all.filter(record => record.type === 'report');
  medicalRecords.consultations = medicalRecords.all.filter(record => record.type === 'consultation');

  const getTypeColor = (type) => {
    switch (type) {
      case 'prescription': return 'bg-green-100 text-green-800';
      case 'analysis': return 'bg-blue-100 text-blue-800';
      case 'report': return 'bg-purple-100 text-purple-800';
      case 'consultation': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'prescription': return Pill;
      case 'analysis': return TestTube;
      case 'report': return FileCheck;
      case 'consultation': return Stethoscope;
      default: return File;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ready': return 'bg-green-50 text-green-700 border-green-200';
      case 'active': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'expired': return 'bg-red-50 text-red-700 border-red-200';
      case 'pending': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getResultStatusIcon = (status) => {
    switch (status) {
      case 'excellent': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'normal': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'critical': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <CheckCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const filteredRecords = medicalRecords[activeTab]?.filter(record =>
    record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.description.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const tabs = [
    { key: 'all', label: 'All Records', count: medicalRecords.all.length },
    { key: 'prescriptions', label: 'Prescriptions', count: medicalRecords.prescriptions.length },
    { key: 'analyses', label: 'Analyses', count: medicalRecords.analyses.length },
    { key: 'reports', label: 'Reports', count: medicalRecords.reports.length },
    { key: 'consultations', label: 'Consultations', count: medicalRecords.consultations.length }
  ];

  // Fonction pour voir les détails d'un record
  const handleViewRecord = (record) => {
    setViewingRecord(record);
  };

  // Fonction pour télécharger un record lisible (JSON)
  const handleDownloadRecord = (record) => {
    const dataToDownload = {
      title: record.title,
      type: record.type,
      doctor: record.doctor,
      specialty: record.specialty,
      date: record.date,
      time: record.time,
      status: record.status,
      description: record.description,
      location: record.location,
      ...record.results && { results: record.results },
      ...record.prescription && { prescription: record.prescription },
      ...record.report && { report: record.report },
      ...record.consultation && { consultation: record.consultation }
    };

    const jsonString = JSON.stringify(dataToDownload, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const element = document.createElement('a');
    element.href = url;
    element.download = `${record.title.replace(/\s+/g, '_')}_${record.date}.json`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    URL.revokeObjectURL(url);
  };

  // Fonction pour sauvegarder/bookmarker
  const handleSaveRecord = (record) => {
    alert(`Record "${record.title}" saved to your bookmarks!`);
  };

  const renderRecordDetails = () => {
    if (!viewingRecord) return null;

    const TypeIcon = getTypeIcon(viewingRecord.type);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="bg-gray-50 px-8 py-6 border-b border-gray-200 rounded-t-2xl">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-${viewingRecord.type === 'prescription' ? 'green' : viewingRecord.type === 'analysis' ? 'blue' : viewingRecord.type === 'report' ? 'purple' : 'orange'}-500`}>
                  <TypeIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{viewingRecord.title}</h2>
                  <p className="text-gray-600">{viewingRecord.description}</p>
                </div>
              </div>
              <button
                onClick={() => setViewingRecord(null)}
                className="p-2 hover:bg-gray-200 rounded-lg transition"
              >
                <X className="h-6 w-6 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-gray-400" />
                <div>
                  <div className="font-medium text-gray-900">{viewingRecord.doctor}</div>
                  <div className="text-gray-500 text-sm">{viewingRecord.specialty}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <div>
                  <div className="font-medium text-gray-900">{viewingRecord.date}</div>
                  <div className="text-gray-500 text-sm">{viewingRecord.time}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                <div className="font-medium text-gray-900">{viewingRecord.location}</div>
              </div>
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-gray-400" />
                <div className="font-medium text-gray-900">{viewingRecord.fileSize}</div>
              </div>
            </div>

            {/* Type-specific content */}
            {viewingRecord.type === 'analysis' && viewingRecord.results && (
              <div className="space-y-6">
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <h3 className="font-semibold text-green-800 mb-2">Summary</h3>
                  <p className="text-green-700">{viewingRecord.results.summary}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Results</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 font-medium text-gray-900">Parameter</th>
                          <th className="text-left py-3 font-medium text-gray-900">Value</th>
                          <th className="text-left py-3 font-medium text-gray-900">Range</th>
                          <th className="text-left py-3 font-medium text-gray-900">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {viewingRecord.results.details.map((item, index) => (
                          <tr key={index} className="border-b border-gray-100">
                            <td className="py-3 font-medium text-gray-900">{item.parameter}</td>
                            <td className="py-3 text-gray-700">{item.value}</td>
                            <td className="py-3 text-gray-500">{item.range}</td>
                            <td className="py-3">
                              <div className="flex items-center space-x-2">
                                {getResultStatusIcon(item.status)}
                                <span className="capitalize text-sm">{item.status}</span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div className="bg-blue-50 rounded-xl p-4">
                  <h3 className="font-semibold text-blue-800 mb-2">Doctor's Notes</h3>
                  <p className="text-blue-700">{viewingRecord.results.notes}</p>
                </div>
              </div>
            )}

            {viewingRecord.type === 'prescription' && viewingRecord.prescription && (
              <div className="space-y-6">
                {viewingRecord.prescription.medications.map((med, index) => (
                  <div key={index} className="border border-gray-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">{med.name} {med.dosage}</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div><span className="font-medium">Frequency:</span> {med.frequency}</div>
                      <div><span className="font-medium">Duration:</span> {med.duration}</div>
                      <div><span className="font-medium">Quantity:</span> {med.quantity}</div>
                      <div><span className="font-medium">Refills:</span> {viewingRecord.prescription.refills} remaining</div>
                    </div>
                    <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                      <div className="font-medium text-yellow-800">Instructions:</div>
                      <div className="text-yellow-700">{med.instructions}</div>
                    </div>
                  </div>
                ))}
                <div className="bg-blue-50 rounded-xl p-4">
                  <h3 className="font-semibold text-blue-800 mb-2">Additional Notes</h3>
                  <p className="text-blue-700">{viewingRecord.prescription.notes}</p>
                </div>
              </div>
            )}

            {viewingRecord.type === 'report' && viewingRecord.report && (
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <h3 className="font-semibold text-blue-800 mb-2">Findings</h3>
                  <p className="text-blue-700">{viewingRecord.report.findings}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Recommendations</h3>
                  <ul className="space-y-2">
                    {viewingRecord.report.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {viewingRecord.type === 'consultation' && viewingRecord.consultation && (
              <div className="space-y-6">
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                  <h3 className="font-semibold text-orange-800 mb-2">Chief Complaint</h3>
                  <p className="text-orange-700">{viewingRecord.consultation.chiefComplaint}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Vital Signs</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.entries(viewingRecord.consultation.vitals).map(([key, value]) => (
                      <div key={key} className="bg-gray-50 rounded-lg p-3 text-center">
                        <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </div>
                        <div className="font-semibold text-gray-900">{value}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <h3 className="font-semibold text-green-800 mb-2">Assessment & Plan</h3>
                  <p className="text-green-700 mb-2">{viewingRecord.consultation.assessment}</p>
                  <p className="text-green-700">{viewingRecord.consultation.plan}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Medical Records</h1>
          <p className="text-gray-600">Access your medical documents, prescriptions and test results</p>
        </div>

        {/* Actions Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search records, doctors, or descriptions..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4d89b1] focus:border-transparent w-80"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                <Filter className="h-4 w-4" />
                <span>Filter</span>
              </button>
            </div>
            <button className="bg-[#4d89b1] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#3d6c91] transition flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Download All</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6">
          <div className="border-b border-gray-200">
            <div className="flex space-x-8 px-6 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`py-4 border-b-2 font-medium text-sm transition whitespace-nowrap ${
                    activeTab === tab.key
                      ? 'border-[#4d89b1] text-[#4d89b1]'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>
          </div>

          {/* Records List */}
          <div className="divide-y divide-gray-100">
            {filteredRecords.length > 0 ? (
              filteredRecords.map((record) => {
                const TypeIcon = getTypeIcon(record.type);
                return (
                  <div key={record.id} className="p-6 hover:bg-gray-50 transition">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getTypeColor(record.type)}`}>
                              <TypeIcon className="h-6 w-6" />
                            </div>
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">{record.title}</h3>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(record.type)}`}>
                                {record.type.charAt(0).toUpperCase() + record.type.slice(1)}
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(record.status)}`}>
                                {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                              </span>
                            </div>

                            <p className="text-gray-600 mb-3">{record.description}</p>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-500">
                              <div className="flex items-center space-x-2">
                                <User className="h-4 w-4" />
                                <span>{record.doctor}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Calendar className="h-4 w-4" />
                                <span>{new Date(record.date).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <FileText className="h-4 w-4" />
                                <span>{record.fileSize}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-2 ml-4">
                        <button 
                          onClick={() => handleViewRecord(record)}
                          className="p-2 text-gray-600 hover:text-[#4d89b1] hover:bg-gray-100 rounded-lg transition"
                          title="View Details"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                        <button 
                          onClick={() => handleSaveRecord(record)}
                          className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition"
                          title="Save/Bookmark"
                        >
                          <Save className="h-5 w-5" />
                        </button>
                        <button 
                          onClick={() => handleDownloadRecord(record)}
                          className="p-2 text-gray-600 hover:text-[#4d89b1] hover:bg-gray-100 rounded-lg transition"
                          title="Download JSON"
                        >
                          <Download className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-12 text-center">
                <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No records found</h3>
                <p className="text-gray-500">
                  {searchTerm
                    ? 'No medical records match your search criteria.'
                    : `You have no ${activeTab === 'all' ? '' : activeTab} records yet.`
                  }
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <Pill className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Active Prescriptions</h3>
                <p className="text-2xl font-bold text-green-600">
                  {medicalRecords.prescriptions.filter(p => p.status === 'active').length}
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-600">Current medications and treatments</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <TestTube className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Recent Analyses</h3>
                <p className="text-2xl font-bold text-blue-600">
                  {medicalRecords.analyses.filter(a => {
                    const recordDate = new Date(a.date);
                    const threeMonthsAgo = new Date();
                    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
                    return recordDate >= threeMonthsAgo;
                  }).length}
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-600">Lab results from last 3 months</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-purple-100 rounded-xl">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Total Records</h3>
                <p className="text-2xl font-bold text-purple-600">{medicalRecords.all.length}</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">All medical documents available</p>
          </div>
        </div>
      </div>

      {/* Modal pour voir les détails */}
      {renderRecordDetails()}
    </div>
  );
}