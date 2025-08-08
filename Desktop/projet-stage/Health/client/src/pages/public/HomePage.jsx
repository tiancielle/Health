import React, { useState, useEffect } from 'react';
import { Search, MapPin, Calendar, Clock, Star, Shield, Users, Activity, ChevronRight, Menu, X, Filter, Grid, List } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { searchDoctors, getSuggestions, getLocationSuggestions, getSpecialties } from '../../services/searchService';

// Enhanced SearchForm Component
const SearchForm = ({ onSearch, className = '' }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch search suggestions (doctors, specialties, disorders)
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.length >= 2) {
        try {
          const results = await getSuggestions(searchQuery, 'all');
          setSuggestions(results);
        } catch (error) {
          console.error('Error fetching suggestions:', error);
          setSuggestions([]);
        }
      } else {
        setSuggestions([]);
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Fetch location suggestions
  useEffect(() => {
    const fetchLocationSuggestions = async () => {
      if (location.length >= 2) {
        try {
          const results = await getLocationSuggestions(location);
          setLocationSuggestions(results);
        } catch (error) {
          console.error('Error fetching location suggestions:', error);
          setLocationSuggestions([]);
        }
      } else {
        setLocationSuggestions([]);
      }
    };

    const timeoutId = setTimeout(fetchLocationSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [location]);

  const handleSearch = async (query = searchQuery, loc = location) => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    setShowSuggestions(false);
    setShowLocationSuggestions(false);
    
    try {
      await onSearch(query.trim(), loc.trim());
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.text);
    setShowSuggestions(false);
    handleSearch(suggestion.text, location);
  };

  const handleLocationSuggestionClick = (locationSuggestion) => {
    const locationText = `${locationSuggestion.name}, ${locationSuggestion.postal_code}`;
    setLocation(locationText);
    setShowLocationSuggestions(false);
    handleSearch(searchQuery, locationText);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  const getSuggestionIcon = (type) => {
    switch (type) {
      case 'doctor': return '👨‍⚕️';
      case 'specialty': return '🏥';
      case 'disorder': return '🩺';
      default: return '🔍';
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
        <div className="grid md:grid-cols-3 gap-4">
          {/* Main Search Field */}
          <div className="md:col-span-2 relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What are you looking for?
            </label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                onKeyDown={handleKeyDown}
                placeholder="Doctor name, specialty, or medical condition..."
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4d89b1] focus:border-transparent text-base transition"
              />
            </div>

            {/* Search Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-lg mt-1 z-50 max-h-80 overflow-y-auto">
                <div className="p-2">
                  <div className="text-xs font-medium text-gray-500 px-3 py-2">Suggestions</div>
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg flex items-center space-x-3"
                    >
                      <span className="text-lg">{getSuggestionIcon(suggestion.type)}</span>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{suggestion.text}</div>
                        <div className="text-xs text-gray-500 capitalize">{suggestion.type}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Location Field */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">Where?</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onFocus={() => setShowLocationSuggestions(true)}
                onKeyDown={handleKeyDown}
                placeholder="City or postal code"
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4d89b1] focus:border-transparent text-base transition"
              />
            </div>

            {/* Location Suggestions Dropdown */}
            {showLocationSuggestions && locationSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-lg mt-1 z-50 max-h-60 overflow-y-auto">
                <div className="p-2">
                  <div className="text-xs font-medium text-gray-500 px-3 py-2">Cities</div>
                  {locationSuggestions.map((city, index) => (
                    <button
                      key={index}
                      onClick={() => handleLocationSuggestionClick(city)}
                      className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg flex items-center space-x-3"
                    >
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{city.name}</div>
                        <div className="text-xs text-gray-500">{city.postal_code} • {city.region}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={() => handleSearch()}
          disabled={isLoading || !searchQuery.trim()}
          className="w-full mt-6 bg-[#4d89b1] text-white py-3 px-8 rounded-xl text-base font-semibold hover:bg-[#3d6c91] disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Searching...</span>
            </>
          ) : (
            <>
              <Search className="h-4 w-4" />
              <span>Search</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

// Enhanced DoctorCard Component
const DoctorCard = ({ doctor, onBookAppointment }) => {
  const {
    id,
    first_name,
    last_name,
    specialties,
    avg_rating,
    review_count,
    profile_image,
    city,
    postal_code,
    next_available_slot,
    consultation_fee,
    is_verified,
    is_available_today,
    clinic_name,
    years_of_experience
  } = doctor;

  const fullName = `Dr. ${first_name} ${last_name}`;
  const location = `${city}${postal_code ? `, ${postal_code}` : ''}`;
  const rating = parseFloat(avg_rating || 0).toFixed(1);
  const reviewCount = parseInt(review_count || 0);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-[#a0c3e0] transition-all duration-200 cursor-pointer overflow-hidden group">
      <div className="relative p-6 pb-4">
        <div className="flex items-start space-x-4">
          <div className="relative">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
              {profile_image ? (
                <img src={profile_image} alt={fullName} className="w-16 h-16 rounded-full object-cover" />
              ) : (
                <span className="text-xl font-bold text-gray-600">
                  {first_name?.[0]}{last_name?.[0]}
                </span>
              )}
            </div>
            {is_verified && (
              <div className="absolute -top-1 -right-1 bg-blue-500 rounded-full p-1">
                <Shield className="h-3 w-3 text-white" />
              </div>
            )}
            {is_available_today && (
              <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full w-3 h-3 border-2 border-white"></div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-[#4d89b1] transition-colors">
              {fullName}
            </h3>
            <p className="text-[#4d89b1] font-medium text-sm">{specialties}</p>
            {clinic_name && (
              <p className="text-gray-500 text-xs mt-1">{clinic_name}</p>
            )}
            {years_of_experience && (
              <p className="text-gray-500 text-xs">{years_of_experience} years experience</p>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2 mt-3">
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="font-medium text-gray-900 text-sm">{rating}</span>
          </div>
          <span className="text-gray-500 text-sm">({reviewCount} reviews)</span>
        </div>
      </div>

      <div className="px-6 pb-4">
        <div className="flex items-center space-x-2 text-gray-600 mb-3">
          <MapPin className="h-4 w-4 flex-shrink-0" />
          <span className="text-sm truncate">{location}</span>
        </div>

        {next_available_slot && (
          <div className="flex items-center space-x-2 text-gray-600 mb-4">
            <Clock className="h-4 w-4 flex-shrink-0" />
            <span className="text-sm">{next_available_slot}</span>
          </div>
        )}

        {consultation_fee && (
          <div className="text-center mb-4">
            <span className="text-lg font-semibold text-gray-900">{consultation_fee} MAD</span>
            <span className="text-gray-500 text-sm ml-1">consultation</span>
          </div>
        )}
      </div>

      <div className="px-6 pb-6">
        <button
          onClick={() => onBookAppointment(doctor)}
          className="w-full bg-[#4d89b1] text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-[#3d6c91] transition-colors duration-200 flex items-center justify-center space-x-2"
        >
          <Calendar className="h-4 w-4" />
          <span>Book Appointment</span>
        </button>
      </div>
    </div>
  );
};

const Loading = () => (
  <div className="flex items-center justify-center py-12">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4d89b1]"></div>
  </div>
);

export default function HealthHomepage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [specialties, setSpecialties] = useState([]);
  const navigate = useNavigate();

  // Load specialties on component mount
  useEffect(() => {
    const loadSpecialties = async () => {
      try {
        const data = await getSpecialties();
        setSpecialties(data.slice(0, 6)); // Show only first 6 specialties
      } catch (error) {
        console.error('Error loading specialties:', error);
      }
    };

    loadSpecialties();
  }, []);

  const handleLoginClick = () => {
    navigate('/auth/Login');
  };

  const handleSignUpClick = () => {
    navigate('/auth/Register');
  };

  const handleSearch = async (query, location) => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    setSearchQuery(query);
    setSearchLocation(location);

    try {
      const data = await searchDoctors(query, location);
      setSearchResults({
        doctors: data.doctors || [],
        total: data.total || 0,
        query,
        location
      });
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults({
        doctors: [],
        total: 0,
        query,
        location,
        error: error.message
      });
    } finally {
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchResults(null);
    setSearchQuery('');
    setSearchLocation('');
  };

  const handleBookAppointment = (doctor) => {
    // Navigate to appointment booking page or show booking modal
    console.log('Booking appointment with:', doctor);
    // For now, just show an alert
    alert(`Booking appointment with Dr. ${doctor.first_name} ${doctor.last_name}`);
  };

  const handleSpecialtyClick = (specialtyName) => {
    handleSearch(specialtyName, '');
  };

  const stats = [
    { label: 'Active Patients', value: '50,000+', icon: Users },
    { label: 'Partner Doctors', value: '5,000+', icon: Activity },
    { label: 'Appointments booked daily', value: '15,000+', icon: Calendar },
    { label: 'Patient satisfaction', value: '4.8/5', icon: Star }
  ];

  const testimonials = [
    { name: 'Amina Benali', rating: 5, text: 'Very intuitive interface, I booked an appointment in just a few clicks!', specialty: 'Patient' },
    { name: 'Dr. Ahmed Tazi', rating: 5, text: 'Excellent platform for managing my consultations and patients.', specialty: 'Cardiologist' },
    { name: 'Fatima Alaoui', rating: 5, text: 'My medical records are finally centralized and secure.', specialty: 'Patient' }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => { navigate('/'); clearSearch(); }}>
                <Activity className="h-8 w-8 text-[#4d89b1]" />
                <span className="ml-2 text-2xl font-bold text-gray-900">Health</span>
              </div>
            </div>
            <nav className="hidden md:flex space-x-8">
              <button 
                onClick={() => handleSearch('', '')} 
                className="text-gray-700 hover:text-[#4d89b1] px-3 py-2 text-sm font-medium transition"
              >
                Find a Doctor
              </button>
              <button 
                onClick={() => navigate('/about-us')} 
                className="text-gray-700 hover:text-[#4d89b1] px-3 py-2 text-sm font-medium transition"
              >
                About Us
              </button>
              <button 
                onClick={() => navigate('/for-doctors')} 
                className="text-gray-700 hover:text-[#4d89b1] px-3 py-2 text-sm font-medium transition"
              >
                For Doctors
              </button>
            </nav>
            <div className="hidden md:flex items-center space-x-4">
              <button 
                className="text-gray-700 hover:text-[#4d89b1] px-4 py-2 text-sm font-medium transition" 
                onClick={handleLoginClick}
              >
                Log In
              </button>
              <button
                style={{ backgroundColor: '#4d89b1' }}
                className="text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-[#3d6c91] transition"
                onClick={handleSignUpClick}
              >
                Sign Up
              </button>
            </div>
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-[#4d89b1] p-2"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
          {isMenuOpen && (
            <div className="md:hidden bg-white border-t border-gray-100">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <button 
                  onClick={() => handleSearch('', '')} 
                  className="block w-full text-left px-3 py-2 text-gray-700 hover:text-[#4d89b1]"
                >
                  Find a Doctor
                </button>
                <a href="#" className="block px-3 py-2 text-gray-700 hover:text-[#4d89b1]">For Doctors</a>
                <a href="#" className="block px-3 py-2 text-gray-700 hover:text-[#4d89b1]">About Us</a>
                <div className="pt-4 pb-2 border-t border-gray-100">
                  <button 
                    className="block w-full text-left px-3 py-2 text-gray-700 hover:text-[#4d89b1]"
                    onClick={handleLoginClick}
                  >
                    Log In
                  </button>
                  <button
                    style={{ backgroundColor: '#4d89b1' }}
                    className="block w-full text-left px-3 py-2 text-white font-medium mt-2 rounded"
                    onClick={handleSignUpClick}
                  >
                    Sign Up
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Conditional Display: Search Results or Homepage */}
      {searchResults ? (
        /* Search Results Section */
        <div className="min-h-screen bg-gray-50">
          {/* Search bar at top */}
          <div className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <SearchForm onSearch={handleSearch} />
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Results header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Search Results
                </h1>
                <p className="text-gray-600">
                  {searchResults.error ? (
                    <span className="text-red-600">Error: {searchResults.error}</span>
                  ) : searchResults.total > 0 ? (
                    <>
                      <span className="font-medium">{searchResults.total}</span> doctors found
                      {searchQuery && <> for "<span className="font-medium">{searchQuery}</span>"</>}
                      {searchLocation && <> in <span className="font-medium">{searchLocation}</span></>}
                    </>
                  ) : (
                    <>No doctors found for your search</>
                  )}
                </p>
              </div>
              
              <button
                onClick={clearSearch}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition"
              >
                Back to Home
              </button>
            </div>

            {/* Results */}
            {isSearching ? (
              <Loading />
            ) : searchResults.error ? (
              <div className="text-center py-16">
                <div className="text-red-500 text-xl mb-4">⚠️ Search Error</div>
                <p className="text-gray-600 mb-8">
                  There was an error with your search. Please try again.
                </p>
                <button
                  onClick={clearSearch}
                  className="bg-[#4d89b1] text-white px-6 py-3 rounded-lg hover:bg-[#3d6c91] transition"
                >
                  Back to Home
                </button>
              </div>
            ) : searchResults.doctors.length === 0 ? (
              <div className="text-center py-16">
                <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No doctors found</h3>
                <p className="text-gray-600 mb-8">
                  Try adjusting your search criteria or search in a different city
                </p>
                <button
                  onClick={clearSearch}
                  className="bg-[#4d89b1] text-white px-6 py-3 rounded-lg hover:bg-[#3d6c91] transition"
                >
                  Back to Home
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {searchResults.doctors.map((doctor) => (
                  <DoctorCard
                    key={doctor.id}
                    doctor={doctor}
                    onBookAppointment={handleBookAppointment}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Normal Homepage */
        <>
          {/* Hero with background image */}
          <section
            className="py-20 relative"
            style={{
              backgroundImage: "url('/images/health_bg.PNG')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          >
            <div className="absolute inset-0 bg-black/40"></div>
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mb-16 text-left text-white">
                <h1 className="text-5xl md:text-6xl font-bold mb-6">
                  Your Health,
                  <span style={{ color: '#1f3a4b' }} className="block">Our Priority</span>
                </h1>
                <p className="text-xl max-w-3xl leading-relaxed">
                  Book online appointments with thousands of healthcare professionals in Morocco. Securely manage your medical records.
                </p>
              </div>
              
              <div className="max-w-4xl ml-0 md:ml-0">
                <SearchForm 
                  onSearch={handleSearch}
                  className="shadow-2xl"
                />
              </div>
            </div>
          </section>

          {/* Specialties */}
          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Find the Right Specialist</h2>
                <p className="text-xl text-gray-600">Instant access to healthcare professionals near you</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {specialties.length > 0 ? specialties.map((specialty, index) => (
                  <div
                    key={specialty.id}
                    className="bg-white border border-gray-200 rounded-2xl p-8 text-center hover:border-[#a0c3e0] hover:shadow-lg transition-all duration-200 cursor-pointer group"
                    onClick={() => handleSpecialtyClick(specialty.name)}
                  >
                    <div className="mb-4">
                      <div className="h-16 w-16 mx-auto rounded-full bg-[#4d89b1] flex items-center justify-center text-white text-2xl font-bold">
                        {specialty.name.charAt(0)}
                      </div>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-[#4d89b1] transition">
                      {specialty.name}
                    </h3>
                    <p className="text-sm text-gray-500">{specialty.doctor_count || 0} doctors</p>
                  </div>
                )) : (
                  // Default specialties if API fails
                  [
                    { name: 'General Practice', count: '2,847' },
                    { name: 'Dentistry', count: '1,234' },
                    { name: 'Cardiology', count: '567' },
                    { name: 'Dermatology', count: '432' },
                    { name: 'Gynecology', count: '389' },
                    { name: 'Pediatrics', count: '298' }
                  ].map((specialty, index) => (
                    <div
                      key={index}
                      className="bg-white border border-gray-200 rounded-2xl p-8 text-center hover:border-[#a0c3e0] hover:shadow-lg transition-all duration-200 cursor-pointer group"
                      onClick={() => handleSpecialtyClick(specialty.name)}
                    >
                      <div className="mb-4">
                        <div className="h-16 w-16 mx-auto rounded-full bg-[#4d89b1] flex items-center justify-center text-white text-2xl font-bold">
                          {specialty.name.charAt(0)}
                        </div>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-[#4d89b1] transition">
                        {specialty.name}
                      </h3>
                      <p className="text-sm text-gray-500">{specialty.count} doctors</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>

          {/* Features */}
          <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Health?</h2>
                <p className="text-xl text-gray-600">A modern platform for optimal healthcare management in Morocco</p>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                  <div className="bg-blue-100 rounded-2xl p-4 w-fit mb-6">
                    <Calendar className="h-8 w-8 text-[#4d89b1]" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Instant Booking</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Book appointments 24/7 with your preferred healthcare providers across Morocco. Instant confirmation and automatic reminders.
                  </p>
                </div>
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                  <div className="bg-green-100 rounded-2xl p-4 w-fit mb-6">
                    <Shield className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Secure Data</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Your medical information is protected with bank-level encryption. Full compliance with Moroccan data protection laws.
                  </p>
                </div>
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                  <div className="bg-purple-100 rounded-2xl p-4 w-fit mb-6">
                    <Clock className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Save Time</h3>
                  <p className="text-gray-600 leading-relaxed">
                    No more phone calls or waiting in line. Manage all your appointments from one single platform.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Stats */}
          <section className="py-20" style={{ backgroundColor: '#4d89b1' }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div key={index} className="text-center">
                      <Icon className="h-12 w-12 text-white mx-auto mb-4" />
                      <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
                      <div className="text-[#c7d8ef]">{stat.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Testimonials */}
          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
                <p className="text-xl text-gray-600">Over 50,000 patients and 5,000 doctors trust us across Morocco</p>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="bg-gray-50 rounded-2xl p-8">
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-700 mb-6 italic leading-relaxed">"{testimonial.text}"</p>
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-500">{testimonial.specialty}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="py-20" style={{ background: 'linear-gradient(to r, #4d89b1, #3d6c91)' }}>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-4xl font-bold text-white mb-6">Ready to Get Started?</h2>
              <p className="text-xl mb-8" style={{ color: '#c7d8ef' }}>Join thousands of users who trust Health for their healthcare needs in Morocco</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  style={{ backgroundColor: 'white', color: '#4d89b1' }}
                  className="px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-50 transition-all duration-200 transform hover:scale-105"
                  onClick={handleSignUpClick}
                >
                  I'm a Patient
                </button>
                <button
                  style={{ backgroundColor: '#3d6c91', color: 'white' }}
                  className="px-8 py-4 rounded-xl text-lg font-semibold hover:bg-[#2d5471] transition-all duration-200 transform hover:scale-105"
                  onClick={handleLoginClick}
                >
                  I'm a Doctor
                </button>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="bg-white">
            <div className="py-16" style={{ background: 'linear-gradient(to r, #f0f5fa, #e8f0ea)' }}>
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Stay Informed About Health News</h2>
                <p className="text-lg text-gray-600 mb-8">Receive health tips, news, and exclusive offers directly in your inbox</p>
                <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4d89b1] focus:border-transparent"
                  />
                  <button
                    style={{ backgroundColor: '#4d89b1' }}
                    className="text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#3d6c91] transition"
                  >
                    Subscribe
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-4">No spam, unsubscribe anytime</p>
              </div>
            </div>

            <div className="bg-white py-16 border-t border-gray-100">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
                  <div className="col-span-2">
                    <div className="flex items-center mb-6">
                      <Activity className="h-8 w-8 text-[#4d89b1]" />
                      <span className="ml-2 text-2xl font-bold text-gray-900">Health</span>
                    </div>
                    <p className="text-gray-600 leading-relaxed mb-6">
                      The leading platform for your online medical appointments in Morocco. Find and consult qualified healthcare professionals near you.
                    </p>
                    <div className="flex space-x-4">
                      <div style={{ backgroundColor: '#4d89b1' }} className="text-white px-3 py-2 rounded-lg text-sm font-medium">
                        ⭐ 4.8/5
                      </div>
                      <div className="text-sm text-gray-500 flex items-center">+50,000 satisfied patients</div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">Specialties</h3>
                    <ul className="space-y-3 text-sm">
                      {['General Practice', 'Dentistry', 'Cardiology', 'Dermatology', 'Gynecology', 'All Specialties'].map((item, i) => (
                        <li key={i}>
                          <button 
                            onClick={() => handleSpecialtyClick(item)}
                            className="text-gray-600 hover:text-[#4d89b1] transition text-left"
                          >
                            {item}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">Services</h3>
                    <ul className="space-y-3 text-sm">
                      <li><button onClick={() => handleSearch('', '')} className="text-gray-600 hover:text-[#4d89b1] transition">Find a Doctor</button></li>
                      <li><a href="#" className="text-gray-600 hover:text-[#4d89b1] transition">Book Appointment</a></li>
                      <li><a href="#" className="text-gray-600 hover:text-[#4d89b1] transition">Medical Records</a></li>
                      <li><a href="#" className="text-gray-600 hover:text-[#4d89b1] transition">Telemedicine</a></li>
                      <li><a href="#" className="text-gray-600 hover:text-[#4d89b1] transition">Health Tips</a></li>
                      <li><a href="#" className="text-gray-600 hover:text-[#4d89b1] transition">Emergency Care</a></li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">For Professionals</h3>
                    <ul className="space-y-3 text-sm">
                      <li><a href="#" className="text-gray-600 hover:text-[#4d89b1] transition">Join as Doctor</a></li>
                      <li><a href="#" className="text-gray-600 hover:text-[#4d89b1] transition">Practice Management</a></li>
                      <li><a href="#" className="text-gray-600 hover:text-[#4d89b1] transition">Billing & Insurance</a></li>
                      <li><a href="#" className="text-gray-600 hover:text-[#4d89b1] transition">Patient Analytics</a></li>
                      <li><a href="#" className="text-gray-600 hover:text-[#4d89b1] transition">Medical Tools</a></li>
                      <li><a href="#" className="text-gray-600 hover:text-[#4d89b1] transition">Support Center</a></li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">Company</h3>
                    <ul className="space-y-3 text-sm">
                      <li><a href="#" className="text-gray-600 hover:text-[#4d89b1] transition">About Us</a></li>
                      <li><a href="#" className="text-gray-600 hover:text-[#4d89b1] transition">Contact</a></li>
                      <li><a href="#" className="text-gray-600 hover:text-[#4d89b1] transition">Careers</a></li>
                      <li><a href="#" className="text-gray-600 hover:text-[#4d89b1] transition">Press</a></li>
                      <li><a href="#" className="text-gray-600 hover:text-[#4d89b1] transition">Blog</a></li>
                      <li><a href="#" className="text-gray-600 hover:text-[#4d89b1] transition">Help Center</a></li>
                    </ul>
                  </div>
                </div>
                
                <div className="mt-12 pt-8 border-t border-gray-100">
                  <div className="flex flex-col md:flex-row items-center justify-between">
                    <div className="flex flex-wrap items-center gap-6 mb-6 md:mb-0">
                      <div className="flex items-center space-x-2">
                        <Shield className="h-5 w-5 text-green-600" />
                        <span className="text-sm text-gray-600">Secure & GDPR-Compliant Data</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="h-5 w-5 rounded-full bg-[#4d89b1] flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                        <span className="text-sm text-gray-600">Verified Doctors</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-5 w-5 text-orange-500" />
                        <span className="text-sm text-gray-600">24/7 Support</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 py-4">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
                  <div className="flex flex-wrap items-center space-x-6 mb-4 md:mb-0">
                    <span>© 2025 Health Morocco. All rights reserved.</span>
                    <a href="#" className="hover:text-gray-700 transition">Legal Notice</a>
                    <a href="#" className="hover:text-gray-700 transition">Privacy Policy</a>
                    <a href="#" className="hover:text-gray-700 transition">Terms of Service</a>
                    <a href="#" className="hover:text-gray-700 transition">Cookies</a>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span>🇲🇦 Morocco</span>
                    <span>•</span>
                    <span>English | العربية | Français</span>
                  </div>
                </div>
              </div>
            </div>
          </footer>
        </>
      )}
    </div>
  );
}