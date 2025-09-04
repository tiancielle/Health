// client/src/pages/patient/DoctorProfile.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Star, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Calendar, 
  Award,
  Users,
  Building2,
  Globe,
  ChevronLeft,
  Heart,
  MessageCircle,
  Navigation,
  Shield,
  CheckCircle,
  ExternalLink,
  AlertCircle
} from 'lucide-react';
import Header from '../../components/layout/Header';
import Loading from '../../components/ui/Loading';
import doctorService from '../../services/doctorService';
import { isAuthenticated, redirectToLogin } from '../../utils/authUtils';

export default function DoctorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('info');

  useEffect(() => {
    const loadDoctor = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Try to get doctor from backend
        const data = await doctorService.getDoctorById(id);
        setDoctor(data);
      } catch (err) {
        console.error('Error loading doctor:', err);
        setError('Doctor not found');
        
        // Fallback to mock data for development
        if (process.env.NODE_ENV === 'development') {
          const mockDoctor = {
            id: id,
            firstName: 'Ahmed',
            lastName: 'Benali',
            specialty: 'general-practitioner',
            rating: 4.5,
            reviewCount: 45,
            city: 'Casablanca',
            address: '123 Avenue Mohammed V, Casablanca',
            phone: '+212 522 123456',
            email: 'dr.benali@healthcare.ma',
            profileImage: null,
            consultationPrice: 300,
            teleconsultationPrice: 250,
            acceptsNewPatients: true,
            teleconsultationAvailable: true,
            verified: true,
            languages: ['Arabic', 'French', 'English'],
            experience: 15,
            education: 'MD from University of Mohammed V',
            bio: 'Experienced general practitioner with over 15 years of practice. Specialized in family medicine and preventive care.',
            clinics: [
              {
                name: 'Central Medical Clinic',
                address: '123 Avenue Mohammed V, Casablanca',
                phone: '+212 522 123456',
                isMain: true
              }
            ],
            schedule: {
              monday: ['09:00-12:00', '14:00-18:00'],
              tuesday: ['09:00-12:00', '14:00-18:00'],
              wednesday: ['09:00-12:00', '14:00-18:00'],
              thursday: ['09:00-12:00', '14:00-18:00'],
              friday: ['09:00-12:00'],
              saturday: ['09:00-13:00'],
              sunday: []
            },
            reviews: [
              {
                patientName: 'Sara M.',
                rating: 5,
                comment: 'Very professional and caring doctor. Highly recommended!',
                date: '2024-01-15'
              },
              {
                patientName: 'Mohammed K.',
                rating: 4,
                comment: 'Good consultation, took time to explain everything.',
                date: '2024-01-10'
              }
            ]
          };
          setDoctor(mockDoctor);
          setError('');
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadDoctor();
    }
  }, [id]);

  const handleBookAppointment = () => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      // Store the current page URL to redirect back after login
      const currentUrl = window.location.pathname;
      redirectToLogin(currentUrl);
      return;
    }
    
    // If authenticated, navigate to booking page
    navigate(`/book-appointment/${doctor.id}`);
  };

  const formatSpecialty = (specialty) => {
    const specialties = {
      'general-practitioner': 'General Practitioner',
      'cardiologist': 'Cardiologist',
      'dermatologist': 'Dermatologist',
      'dentist': 'Dentist',
      'gynecologist': 'Gynecologist',
      'ophthalmologist': 'Ophthalmologist',
      'pediatrician': 'Pediatrician',
      'psychiatrist': 'Psychiatrist'
    };
    return specialties[specialty] || specialty;
  };

  // Interactive Map Component
  const InteractiveMap = ({ doctor }) => {
    const [selectedClinic, setSelectedClinic] = useState(0);

    const openGoogleMaps = (address) => {
      const encodedAddress = encodeURIComponent(address);
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
    };

    const openWaze = (address) => {
      const encodedAddress = encodeURIComponent(address);
      window.open(`https://waze.com/ul?q=${encodedAddress}`, '_blank');
    };

    return (
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
        <div className="p-4 bg-gradient-to-r from-[#4d89b1] to-[#5a9bc4] text-white">
          <h3 className="text-lg font-semibold flex items-center">
            <MapPin className="h-5 w-5 mr-2" />
            Clinic Location
          </h3>
        </div>
        
        {/* Interactive map simulation with modern design */}
        <div className="relative">
          <div className="w-full h-80 bg-gradient-to-br from-blue-50 to-indigo-100 relative overflow-hidden">
            {/* Map elements simulation */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-8 left-8 w-32 h-16 bg-green-200 rounded-lg"></div>
              <div className="absolute top-16 right-12 w-24 h-24 bg-blue-200 rounded-full"></div>
              <div className="absolute bottom-12 left-16 w-20 h-28 bg-yellow-200 rounded-lg"></div>
              <div className="absolute bottom-8 right-8 w-28 h-12 bg-purple-200 rounded-lg"></div>
            </div>
            
            {/* Simulated roads */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 320">
              <path d="M50 50 Q200 100 350 80" stroke="#cbd5e0" strokeWidth="3" fill="none" />
              <path d="M80 150 Q200 200 320 180" stroke="#cbd5e0" strokeWidth="3" fill="none" />
              <path d="M100 250 Q250 200 350 240" stroke="#cbd5e0" strokeWidth="3" fill="none" />
            </svg>

            {/* Main doctor marker */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="relative">
                <div className="w-16 h-16 bg-[#4d89b1] rounded-full shadow-lg flex items-center justify-center border-4 border-white">
                  <Building2 className="h-8 w-8 text-white" />
                </div>
                <div className="absolute inset-0 w-16 h-16 bg-[#4d89b1] rounded-full animate-ping opacity-30"></div>
              </div>
            </div>

            {/* Secondary markers */}
            <div className="absolute top-16 right-20">
              <div className="w-3 h-3 bg-red-500 rounded-full shadow-md"></div>
            </div>
            <div className="absolute bottom-20 left-20">
              <div className="w-3 h-3 bg-green-500 rounded-full shadow-md"></div>
            </div>

            {/* Info overlay */}
            <div className="absolute bottom-4 left-4 right-4">
              <div className="bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 text-[#4d89b1] mr-2" />
                    <span className="text-sm font-medium text-gray-700">Main Clinic</span>
                  </div>
                  <span className="text-xs text-gray-500">Click to expand</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Clinic list */}
        <div className="p-4 space-y-4">
          {doctor.clinics && doctor.clinics.map((clinic, index) => (
            <div 
              key={index} 
              className={`p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
                selectedClinic === index 
                  ? 'border-[#4d89b1] bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedClinic(index)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <Building2 className="h-4 w-4 text-[#4d89b1] mr-2" />
                    <h4 className="font-semibold text-gray-900">{clinic.name}</h4>
                    {index === 0 && (
                      <span className="ml-2 px-2 py-1 bg-[#4d89b1] text-white text-xs rounded-full">
                        Main
                      </span>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2 flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    {clinic.address}
                  </p>
                  
                  {clinic.phone && (
                    <p className="text-sm text-gray-600 flex items-center">
                      <Phone className="h-3 w-3 mr-1" />
                      {clinic.phone}
                    </p>
                  )}
                </div>
              </div>
              
              {/* Action buttons */}
              <div className="flex gap-2 mt-3">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    openGoogleMaps(clinic.address);
                  }}
                  className="flex-1 bg-[#4d89b1] text-white py-2 px-3 rounded-lg text-sm hover:bg-[#3d6c91] transition-colors flex items-center justify-center"
                >
                  <Navigation className="h-4 w-4 mr-1" />
                  Google Maps
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    openWaze(clinic.address);
                  }}
                  className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg text-sm hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Waze
                </button>
              </div>
            </div>
          ))}

          {/* Default clinic if no clinics defined */}
          {(!doctor.clinics || doctor.clinics.length === 0) && (
            <div className="p-4 rounded-lg border-2 border-gray-200">
              <div className="flex items-center mb-2">
                <Building2 className="h-4 w-4 text-[#4d89b1] mr-2" />
                <h4 className="font-semibold text-gray-900">Medical Clinic</h4>
              </div>
              
              <p className="text-sm text-gray-600 mb-3 flex items-center">
                <MapPin className="h-3 w-3 mr-1" />
                {doctor.address || doctor.city || "123 Avenue Mohammed V, Casablanca"}
              </p>
              
              <div className="flex gap-2">
                <button 
                  onClick={() => openGoogleMaps(doctor.address || doctor.city || "123 Avenue Mohammed V, Casablanca")}
                  className="flex-1 bg-[#4d89b1] text-white py-2 px-3 rounded-lg text-sm hover:bg-[#3d6c91] transition-colors flex items-center justify-center"
                >
                  <Navigation className="h-4 w-4 mr-1" />
                  Get Directions
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loading size="large" />
        </div>
      </div>
    );
  }

  if (error || !doctor) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {error || 'Doctor not found'}
            </h2>
            <button
              onClick={() => navigate('/search')}
              className="bg-[#4d89b1] text-white px-6 py-3 rounded-lg hover:bg-[#3d6c91]"
            >
              Back to Search
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ChevronLeft className="h-5 w-5 mr-1" />
          Back to Results
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Interactive map (35%) */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <InteractiveMap doctor={doctor} />
            </div>
          </div>

          {/* Right column - Doctor details (65%) */}
          <div className="lg:col-span-2">
            {/* Profile header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Doctor photo */}
                <div className="flex-shrink-0">
                  <div className="w-32 h-32 rounded-full bg-gray-200 overflow-hidden border-4 border-white shadow-lg">
                    {doctor.profileImage ? (
                      <img
                        src={doctor.profileImage}
                        alt={`Dr. ${doctor.firstName} ${doctor.lastName}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#4d89b1] to-[#5a9bc4] text-white text-4xl font-bold">
                        {doctor.firstName?.charAt(0)}{doctor.lastName?.charAt(0)}
                      </div>
                    )}
                  </div>
                </div>

                {/* Main information */}
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                    <div className="flex-1">
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Dr. {doctor.firstName} {doctor.lastName}
                      </h1>
                      
                      <p className="text-xl text-gray-600 mb-3">
                        {formatSpecialty(doctor.specialty)}
                      </p>

                      {/* Rating and reviews */}
                      <div className="flex items-center gap-4 mb-4">
                        {doctor.rating && (
                          <div className="flex items-center">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-5 w-5 ${
                                    i < Math.floor(doctor.rating)
                                      ? 'text-yellow-400 fill-current'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="ml-2 text-lg font-medium text-gray-900">
                              {doctor.rating}
                            </span>
                            <span className="text-gray-600 ml-1">
                              ({doctor.reviewCount || 0} reviews)
                            </span>
                          </div>
                        )}
                        
                        {doctor.experience && (
                          <div className="flex items-center text-gray-600">
                            <Award className="h-5 w-5 mr-1" />
                            <span>{doctor.experience} years experience</span>
                          </div>
                        )}
                      </div>

                      {/* Badges */}
                      <div className="flex flex-wrap gap-2">
                        {doctor.acceptsNewPatients && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Accepting New Patients
                          </span>
                        )}
                        {doctor.teleconsultationAvailable && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Teleconsultation Available
                          </span>
                        )}
                        {doctor.verified && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                            <Shield className="h-3 w-3 mr-1" />
                            Verified
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Main action button */}
                    <div className="mt-4 md:mt-0 md:ml-6">
                      <div className="space-y-2">
                        <button
                          onClick={handleBookAppointment}
                          className="bg-gradient-to-r from-[#4d89b1] to-[#5a9bc4] text-white px-8 py-3 rounded-lg hover:from-[#3d6c91] hover:to-[#4a8ab3] transition-all duration-200 font-semibold text-lg shadow-lg transform hover:scale-105 w-full"
                        >
                          Book Appointment
                        </button>
                        
                        {/* Login notice for non-authenticated users */}
                        {!isAuthenticated() && (
                          <div className="flex items-center text-sm text-amber-600 bg-amber-50 px-3 py-2 rounded-lg border border-amber-200">
                            <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                            <span>Please login to book an appointment</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  {[
                    { id: 'info', label: 'Information', icon: Building2 },
                    { id: 'schedule', label: 'Schedule', icon: Calendar },
                    { id: 'reviews', label: 'Reviews', icon: MessageCircle },
                    { id: 'about', label: 'About', icon: Users }
                  ].map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                          activeTab === tab.id
                            ? 'border-[#4d89b1] text-[#4d89b1]'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        <Icon className="h-4 w-4 mr-2" />
                        {tab.label}
                      </button>
                    );
                  })}
                </nav>
              </div>

              <div className="p-6">
                {/* Information Tab */}
                {activeTab === 'info' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Practical Information
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <h4 className="font-medium text-gray-900">Contact</h4>
                          {doctor.phone && (
                            <div className="flex items-center text-gray-600">
                              <Phone className="h-4 w-4 mr-3" />
                              <span>{doctor.phone}</span>
                            </div>
                          )}
                          {doctor.email && (
                            <div className="flex items-center text-gray-600">
                              <Mail className="h-4 w-4 mr-3" />
                              <span>{doctor.email}</span>
                            </div>
                          )}
                        </div>

                        <div className="space-y-3">
                          <h4 className="font-medium text-gray-900">Fees</h4>
                          {doctor.consultationPrice && (
                            <div className="text-gray-600">
                              <span className="font-medium">Standard consultation:</span> {doctor.consultationPrice} MAD
                            </div>
                          )}
                          {doctor.teleconsultationPrice && (
                            <div className="text-gray-600">
                              <span className="font-medium">Teleconsultation:</span> {doctor.teleconsultationPrice} MAD
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {doctor.languages && doctor.languages.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Languages Spoken</h4>
                        <div className="flex flex-wrap gap-2">
                          {doctor.languages.map((language, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800"
                            >
                              <Globe className="h-3 w-3 mr-1" />
                              {language}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Schedule Tab */}
                {activeTab === 'schedule' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Next Available Appointments
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {['Today', 'Tomorrow', 'Wednesday'].map((day, dayIndex) => (
                        <div key={dayIndex} className="border border-gray-200 rounded-lg p-4">
                          <h4 className="font-medium text-gray-900 mb-3">{day}</h4>
                          <div className="space-y-2">
                            {['09:00', '14:30', '16:00'].map((time, timeIndex) => (
                              <button
                                key={timeIndex}
                                onClick={() => {
                                  if (!isAuthenticated()) {
                                    redirectToLogin();
                                  } else {
                                    handleBookAppointment();
                                  }
                                }}
                                className="w-full text-left px-3 py-2 text-sm border border-gray-200 rounded hover:bg-[#4d89b1] hover:text-white transition-colors"
                              >
                                {time}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Reviews Tab */}
                {activeTab === 'reviews' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Patient Reviews
                    </h3>
                    <div className="space-y-4">
                      {doctor.reviews && doctor.reviews.length > 0 ? (
                        doctor.reviews.map((review, index) => (
                          <div key={index} className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center">
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-4 w-4 ${
                                        i < review.rating
                                          ? 'text-yellow-400 fill-current'
                                          : 'text-gray-300'
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="ml-2 font-medium text-gray-900">
                                  {review.patientName}
                                </span>
                              </div>
                              <span className="text-sm text-gray-500">{review.date}</span>
                            </div>
                            <p className="text-gray-700">{review.comment}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-600">No reviews yet.</p>
                      )}
                    </div>
                  </div>
                )}

                {/* About Tab */}
                {activeTab === 'about' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        About Dr. {doctor.firstName} {doctor.lastName}
                      </h3>
                      {doctor.bio && (
                        <p className="text-gray-700 leading-relaxed mb-4">
                          {doctor.bio}
                        </p>
                      )}
                    </div>

                    {doctor.education && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Education</h4>
                        <p className="text-gray-700">{doctor.education}</p>
                      </div>
                    )}

                    {doctor.experience && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Experience</h4>
                        <p className="text-gray-700">{doctor.experience} years of practice</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}