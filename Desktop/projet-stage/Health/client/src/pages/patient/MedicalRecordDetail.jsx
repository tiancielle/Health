import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  ChevronLeft, 
  User, 
  Calendar, 
  Clock, 
  MapPin,
  Pill,
  TestTube,
  Activity,
  Stethoscope,
  FileCheck,
  AlertCircle,
  CheckCircle,
  XCircle,
  Heart,
  ArrowLeft
} from 'lucide-react';

// Header Component (simplified version based on your structure)
const Header = () => (
  <header className="bg-white shadow-sm border-b border-gray-200">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center py-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-[#4d89b1] rounded-lg flex items-center justify-center">
            <Heart className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">Health</span>
        </div>
      </div>
    </div>
  </header>
);

export default function MedicalRecordDetail() {
  const [isDownloading, setIsDownloading] = useState(false);
  const [currentRecordId, setCurrentRecordId] = useState('1');

  // Mock data - you'll replace this with actual API call
  const recordData = {
    1: {
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
          { parameter: 'Glucose', value: '92 mg/dL', range: '70-100', status: 'normal' },
          { parameter: 'Triglycerides', value: '120 mg/dL', range: '<150', status: 'normal' }
        ],
        notes: 'Patient shows excellent metabolic health. Continue current lifestyle and diet. Next checkup recommended in 6 months.'
      }
    },
    2: {
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
    3: {
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
          'Schedule next examination in 12 months',
          'Monitor mole on left shoulder - photograph provided'
        ],
        images: 3,
        followUp: '2026-08-28'
      }
    },
    4: {
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
  };

  const record = recordData[currentRecordId];

  const getTypeIcon = (type) => {
    switch (type) {
      case 'prescription':
        return Pill;
      case 'analysis':
        return TestTube;
      case 'report':
        return FileCheck;
      case 'consultation':
        return Stethoscope;
      default:
        return FileText;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'prescription':
        return 'bg-green-500';
      case 'analysis':
        return 'bg-blue-500';
      case 'report':
        return 'bg-purple-500';
      case 'consultation':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ready':
        return 'text-green-600 bg-green-50';
      case 'active':
        return 'text-blue-600 bg-blue-50';
      case 'expired':
        return 'text-red-600 bg-red-50';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getResultStatusIcon = (status) => {
    switch (status) {
      case 'excellent':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'normal':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'critical':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <CheckCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    // Simulate download process
    setTimeout(() => {
      // Create a mock file download
      const element = document.createElement('a');
      const file = new Blob([`Medical Record: ${record.title}\nDate: ${record.date}\nDoctor: ${record.doctor}`], 
        { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = `${record.title.replace(/\s+/g, '_')}_${record.date}.pdf`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      setIsDownloading(false);
    }, 2000);
  };

  const TypeIcon = getTypeIcon(record.type);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Record Selector (for demo purposes) */}
        <div className="mb-6 bg-white rounded-xl p-4 shadow-sm border">
          <div className="flex items-center space-x-4">
            <span className="font-medium text-gray-700">View Record:</span>
            <select 
              value={currentRecordId} 
              onChange={(e) => setCurrentRecordId(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#4d89b1] focus:border-transparent"
            >
              <option value="1">Blood Analysis</option>
              <option value="2">Prescription - Hypertension</option>
              <option value="3">Dermatological Report</option>
              <option value="4">General Consultation</option>
            </select>
          </div>
        </div>

        {/* Back Button */}
        <div className="mb-6">
          <button className="flex items-center space-x-2 text-gray-600 hover:text-[#4d89b1] font-medium transition-colors">
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Medical Records</span>
          </button>
        </div>

        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-6">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${getTypeColor(record.type)}`}>
                <TypeIcon className="h-8 w-8 text-white" />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-3">
                  <h1 className="text-2xl font-bold text-gray-900">{record.title}</h1>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(record.status)}`}>
                    {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-4">{record.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <User className="h-4 w-4" />
                    <div>
                      <div className="font-medium">{record.doctor}</div>
                      <div className="text-gray-500">{record.specialty}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <div>
                      <div className="font-medium">{new Date(record.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</div>
                      <div className="text-gray-500">{record.time}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <div>
                      <div className="font-medium">Location</div>
                      <div className="text-gray-500">{record.location}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-gray-600">
                    <FileText className="h-4 w-4" />
                    <div>
                      <div className="font-medium">File Size</div>
                      <div className="text-gray-500">{record.fileSize}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="bg-[#4d89b1] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#3d6c91] transition flex items-center space-x-2 disabled:opacity-50"
            >
              <Download className="h-5 w-5" />
              <span>{isDownloading ? 'Downloading...' : 'Download'}</span>
            </button>
          </div>
        </div>

        {/* Content Based on Type - Analysis */}
        {record.type === 'analysis' && record.results && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Analysis Results</h2>
            
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
              <h3 className="font-semibold text-green-800 mb-2">Summary</h3>
              <p className="text-green-700">{record.results.summary}</p>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Detailed Results</h3>
              <div className="overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Parameter</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Value</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Reference Range</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {record.results.details.map((item, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium text-gray-900">{item.parameter}</td>
                        <td className="py-3 px-4 text-gray-700">{item.value}</td>
                        <td className="py-3 px-4 text-gray-500">{item.range}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            {getResultStatusIcon(item.status)}
                            <span className="capitalize text-sm font-medium">{item.status}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-xl">
              <h3 className="font-semibold text-blue-800 mb-2">Doctor's Notes</h3>
              <p className="text-blue-700">{record.results.notes}</p>
            </div>
          </div>
        )}

        {/* Content Based on Type - Prescription */}
        {record.type === 'prescription' && record.prescription && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Prescription Details</h2>
            
            <div className="space-y-6">
              {record.prescription.medications.map((med, index) => (
                <div key={index} className="border border-gray-200 rounded-xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{med.name}</h3>
                      <p className="text-gray-600">{med.dosage}</p>
                    </div>
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      Active
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="font-medium text-gray-900">Frequency</div>
                      <div className="text-gray-600">{med.frequency}</div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Duration</div>
                      <div className="text-gray-600">{med.duration}</div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Quantity</div>
                      <div className="text-gray-600">{med.quantity}</div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Refills</div>
                      <div className="text-gray-600">{record.prescription.refills} remaining</div>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                    <div className="font-medium text-yellow-800 mb-1">Instructions</div>
                    <div className="text-yellow-700 text-sm">{med.instructions}</div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-xl">
              <h3 className="font-semibold text-blue-800 mb-2">Additional Notes</h3>
              <p className="text-blue-700 mb-3">{record.prescription.notes}</p>
              <div className="text-sm">
                <span className="font-medium text-blue-800">Next Visit: </span>
                <span className="text-blue-700">{new Date(record.prescription.nextVisit).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</span>
              </div>
            </div>
          </div>
        )}

        {/* Content Based on Type - Report */}
        {record.type === 'report' && record.report && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Medical Report</h2>
            
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h3 className="font-semibold text-blue-800 mb-2">Findings</h3>
                <p className="text-blue-700">{record.report.findings}</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Recommendations</h3>
                <ul className="space-y-2">
                  {record.report.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-purple-50 rounded-xl p-4">
                  <h4 className="font-semibold text-purple-800 mb-2">Images Included</h4>
                  <p className="text-purple-700">{record.report.images} clinical photographs</p>
                </div>
                <div className="bg-green-50 rounded-xl p-4">
                  <h4 className="font-semibold text-green-800 mb-2">Follow-up</h4>
                  <p className="text-green-700">{new Date(record.report.followUp).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content Based on Type - Consultation */}
        {record.type === 'consultation' && record.consultation && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Consultation Notes</h2>
            
            <div className="space-y-6">
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                <h3 className="font-semibold text-orange-800 mb-2">Chief Complaint</h3>
                <p className="text-orange-700">{record.consultation.chiefComplaint}</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Vital Signs</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {Object.entries(record.consultation.vitals).map(([key, value]) => (
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
                <h3 className="font-semibold text-green-800 mb-2">Assessment</h3>
                <p className="text-green-700">{record.consultation.assessment}</p>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h3 className="font-semibold text-blue-800 mb-2">Plan</h3>
                <p className="text-blue-700 mb-3">{record.consultation.plan}</p>
                <div className="text-sm">
                  <span className="font-medium text-blue-800">Next Visit: </span>
                  <span className="text-blue-700">{new Date(record.consultation.nextVisit).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions</h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="bg-[#4d89b1] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#3d6c91] transition flex items-center space-x-2 disabled:opacity-50"
            >
              <Download className="h-4 w-4" />
              <span>{isDownloading ? 'Downloading...' : 'Download PDF'}</span>
            </button>
            
            <button className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-50 transition flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Print</span>
            </button>
            
            <button className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-50 transition flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>Contact Doctor</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}