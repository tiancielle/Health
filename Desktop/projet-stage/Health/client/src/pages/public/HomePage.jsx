import React, { useState } from 'react';
import { Search, MapPin, Calendar, Clock, Star, Shield, Users, Activity, ChevronRight, Menu, X } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';

export default function HealthHomepage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // const navigate = useNavigate();

  const specialties = [
    { name: 'General Practitioner', image: 'public/images/generalist.jpg', count: '2,847' },
    { name: 'Dentist', image: 'public/images/dentist.jpg', count: '1,234' },
    { name: 'Cardiologist', image: 'public/images/Cardiologist.PNG', count: '567' },
    { name: 'Dermatologist', image: 'public/images/dermatologue.PNG', count: '432' },
    { name: 'Gynecologist', image: 'public/images/Gynecologist.png', count: '389' },
    { name: 'Ophthalmologist', image: 'public/images/ophtalmologue.PNG', count: '298' }
  ];

  const stats = [
    { label: 'Active Patients', value: '50,000+', icon: Users },
    { label: 'Partner Doctors', value: '5,000+', icon: Activity },
    { label: 'Appointments booked daily', value: '15,000+', icon: Calendar },
    { label: 'Patient satisfaction', value: '4.8/5', icon: Star }
  ];

  const testimonials = [
    { name: 'Marie Dubois', rating: 5, text: 'Very intuitive interface, I booked an appointment in just a few clicks!', specialty: 'Patient' },
    { name: 'Dr. Jean Martin', rating: 5, text: 'Excellent platform for managing my consultations and patients.', specialty: 'Cardiologist' },
    { name: 'Sophie Laurent', rating: 5, text: 'My medical records are finally centralized and secure.', specialty: 'Patient' }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <Activity className="h-8 w-8 text-[#4d89b1]" />
                <span className="ml-2 text-2xl font-bold text-gray-900">Health</span>
              </div>
            </div>
            {/* Navigation Desktop */}
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-700 hover:text-[#4d89b1] px-3 py-2 text-sm font-medium transition">Find a Doctor</a>
              <a href="#" className="text-gray-700 hover:text-[#4d89b1] px-3 py-2 text-sm font-medium transition">For Doctors</a>
              <a href="#" className="text-gray-700 hover:text-[#4d89b1] px-3 py-2 text-sm font-medium transition">About Us</a>
            </nav>
            <div className="hidden md:flex items-center space-x-4">
              <button></button>
              <button className="text-gray-700 hover:text-[#4d89b1] px-4 py-2 text-sm font-medium transition">Log In</button>
              <button
                style={{ backgroundColor: '#4d89b1' }}
                className="text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-[#3d6c91] transition"
              >
                Sign Up
              </button>
            </div>
            {/* Bouton menu mobile */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-[#4d89b1] p-2"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
          {/* Menu mobile */}
          {isMenuOpen && (
            <div className="md:hidden bg-white border-t border-gray-100">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <a href="#" className="block px-3 py-2 text-gray-700 hover:text-[#4d89b1]">Find a Doctor</a>
                <a href="#" className="block px-3 py-2 text-gray-700 hover:text-[#4d89b1]">For Doctors</a>
                <a href="#" className="block px-3 py-2 text-gray-700 hover:text-[#4d89b1]">About Us</a>
                <div className="pt-4 pb-2 border-t border-gray-100">
                  <button className="block w-full text-left px-3 py-2 text-gray-700 hover:text-[#4d89b1]">Log In</button>
                  <button
                    style={{ backgroundColor: '#4d89b1' }}
                    className="block w-full text-left px-3 py-2 text-white font-medium mt-2 rounded"
                  >
                    Sign Up
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero avec image de fond */}
      <section
        className="py-20 relative"
        style={{
          backgroundImage: "url('/public/images/health_bg.PNG')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Overlay foncé pour améliorer la lisibilité */}
        <div className="absolute inset-0 bg-black/40"></div>

        {/* Contenu */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-left text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Your Health,
              <span style={{ color: '#1f3a4b' }} className="block">Our Priority</span>
            </h1>
            <p className="text-xl max-w-3xl leading-relaxed">
              Book online appointments with thousands of healthcare professionals. Securely manage your medical records.
            </p>
          </div>

          {/* Formulaire aligné à gauche */}
          <div className="max-w-4xl bg-white rounded-2xl shadow-2xl p-8 border border-gray-100 ml-0 md:ml-0">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What are you looking for?
                </label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Doctor, specialty, disorder..."
                    className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4d89b1] focus:border-transparent text-lg"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Where?
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="City, ZIP code"
                    className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4d89b1] focus:border-transparent text-lg"
                  />
                </div>
              </div>
            </div>
            <button
              style={{ backgroundColor: '#4d89b1' }}
              className="w-full mt-8 text-white py-4 px-8 rounded-xl text-lg font-semibold hover:bg-[#3d6c91] transition-all duration-200 transform hover:scale-[1.02]"
            >
              Search
            </button>
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
            {specialties.map((specialty, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-2xl p-8 text-center hover:border-[#a0c3e0] hover:shadow-lg transition-all duration-200 cursor-pointer group"
              >
                <div className="mb-4">
                  <img
                    src={specialty.image}
                    alt={specialty.name}
                    className="h-16 w-16 mx-auto rounded-full object-cover border-2 border-gray-100 shadow-sm"
                  />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-[#4d89b1] transition">
                  {specialty.name}
                </h3>
                <p className="text-sm text-gray-500">{specialty.count} doctors</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Health?</h2>
            <p className="text-xl text-gray-600">A modern platform for optimal healthcare management</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="bg-blue-100 rounded-2xl p-4 w-fit mb-6">
                <Calendar className="h-8 w-8 text-[#4d89b1]" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Instant Booking</h3>
              <p className="text-gray-600 leading-relaxed">
                Book appointments 24/7 with your preferred healthcare providers. Instant confirmation and automatic reminders.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="bg-green-100 rounded-2xl p-4 w-fit mb-6">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Secure Data</h3>
              <p className="text-gray-600 leading-relaxed">
                Your medical information is protected with bank-level encryption. GDPR compliance guaranteed.
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
            <p className="text-xl text-gray-600">Over 50,000 patients and 5,000 doctors trust us</p>
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
          <p className="text-xl mb-8" style={{ color: '#1f3a4b' }}>Join thousands of users who trust Health for their healthcare needs</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              style={{ backgroundColor: 'white', color: '#4d89b1' }}
              className="px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-50 transition-all duration-200 transform hover:scale-105"
            >
              I'm a Patient
            </button>
            <button
              style={{ backgroundColor: '#3d6c91', color: 'white' }}
              className="px-8 py-4 rounded-xl text-lg font-semibold hover:bg-[#2d5471] transition-all duration-200 transform hover:scale-105"
              // onClick={() => navigate('/auth/doctor-login')}
            >
              I'm a Doctor
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white">
        {/* Newsletter */}
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

        {/* Contenu principal */}
        <div className="bg-white py-16 border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
              <div className="col-span-2">
                <div className="flex items-center mb-6">
                  <Activity className="h-8 w-8 text-[#4d89b1]" />
                  <span className="ml-2 text-2xl font-bold text-gray-900">Health</span>
                </div>
                <p className="text-gray-600 leading-relaxed mb-6">
                  The leading platform for your online medical appointments. Find and consult qualified healthcare professionals near you.
                </p>
                <div className="flex space-x-4">
                  <div style={{ backgroundColor: '#4d89b1' }} className="text-white px-3 py-2 rounded-lg text-sm font-medium">
                    ⭐ 4.8/5
                  </div>
                  <div className="text-sm text-gray-500 flex items-center">+50,000 satisfied patients</div>
                </div>
              </div>
              {/* Colonnes de liens */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Specialties</h3>
                <ul className="space-y-3 text-sm">
                  {['General Practitioner', 'Dentist', 'Cardiologist', 'Dermatologist', 'Gynecologist', 'All Specialties'].map((item, i) => (
                    <li key={i}>
                      <a href="#" className="text-gray-600 hover:text-[#4d89b1] transition">{item}</a>
                    </li>
                  ))}
                </ul>
              </div>
              {/* Services, Pros, About... similaire */}
            </div>
            {/* Trust Indicators */}
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

        {/* Bas de page */}
        <div className="bg-gray-50 py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
              <div className="flex flex-wrap items-center space-x-6 mb-4 md:mb-0">
                <span>© 2025 Health. All rights reserved.</span>
                <a href="#" className="hover:text-gray-700 transition">Legal Notice</a>
                <a href="#" className="hover:text-gray-700 transition">Privacy Policy</a>
                <a href="#" className="hover:text-gray-700 transition">Terms of Service</a>
                <a href="#" className="hover:text-gray-700 transition">Cookies</a>
              </div>
              <div className="flex items-center space-x-4">
                <span>🇺🇸 United States</span>
                <span>•</span>
                <span>English</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}