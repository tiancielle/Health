// client/src/pages/public/AboutUsPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div
            className="flex items-center text-[#4d89b1] font-bold text-2xl cursor-pointer"
            onClick={() => navigate('/')}
          >
            <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-8 14h-2v-4H5v-2h4V7h2v4h4v2h-4v4zm-4-8h10v2H7V9z"/>
            </svg>
            <span className="ml-2">Health</span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">About Health</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We're on a mission to transform healthcare access through technology, connecting patients and doctors seamlessly and securely.
          </p>
          <img
            src="/images/about-us.PNG"
            alt="Modern hospital with digital interface"
            className="mx-auto mt-12 rounded-2xl shadow-xl h-64 object-cover w-full max-w-4xl"
          />
        </div>
      </section>

      {/* Story & Mission */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
              <p className="text-lg text-gray-700 mb-6">
                Founded in 2025, Health was created by a team of healthcare professionals and tech innovators who saw a gap in the patient-doctor connection.
              </p>
              <p className="text-lg text-gray-700 mb-6">
                Today, we serve over <strong>50,000 patients</strong> and <strong>5,000 verified doctors</strong>, making healthcare scheduling faster, smarter, and more secure.
              </p>
              <p className="text-lg text-gray-700">
                Our platform combines user-friendly design with advanced data protection to deliver a trusted experience for everyone.
              </p>
            </div>
            <img
              src="/images/doctor1.png"
              alt="Doctor using digital tablet"
              className="rounded-2xl shadow-lg h-96 w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Vision & Values */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">Our Vision & Values</h2>
          <div className="grid md:grid-cols-3 gap-10">
            <div className="bg-white p-8 rounded-2xl shadow-md text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-[#4d89b1]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Accessibility</h3>
              <p className="text-gray-600">
                We believe quality healthcare should be accessible to everyone, regardless of location or background.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-md text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Security</h3>
              <p className="text-gray-600">
                Your medical data is protected with end-to-end encryption and GDPR-compliant storage.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-md text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 7c0-2.21-1.79-4-4-4S8 4.79 8 7v2H6v11h12V9h-2V7z"/>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Innovation</h3>
              <p className="text-gray-600">
                We continuously improve our platform with AI-driven insights, telehealth, and smart scheduling.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-16 bg-[#4d89b1] text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4">Join Our Growing Community</h2>
          <p className="text-lg opacity-90 mb-8">
            Whether you're a patient or a healthcare provider, Health is here to simplify your journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/auth/Register')}
              className="bg-white text-[#4d89b1] px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Sign Up as Patient
            </button>
            <button
              onClick={() => navigate('/for-doctors')}
              className="border-2 border-[rgb(67,119,153)] text-[rgb(67,119,153)] px-8 py-3 rounded-lg font-semibold hover:bg-[rgb(67,119,153)]/10 transition"
            >
              Learn About Doctor Program
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500 text-sm">
          © 2025 Health. All rights reserved.
        </div>
      </footer>
    </div>
  );
}