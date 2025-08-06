// client/src/pages/public/ForDoctorsPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ForDoctorsPage() {
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
      <section className="py-20 bg-gradient-to-br from-indigo-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Dear Doctors</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Grow your practice, manage appointments efficiently, and deliver better care — all from one secure platform.
          </p>
          <img
            src="/images/doctor2.png"
            alt="Doctor using Health platform"
            className="mx-auto mt-12 rounded-2xl shadow-xl h-72 object-cover w-full max-w-4xl"
          />
        </div>
      </section>

      {/* Why Join */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">Why Join Health?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Reach More Patients</h3>
              <p className="text-gray-600">
                Get discovered by thousands of patients searching for specialists in your field. Your profile appears in targeted search results.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Smart Scheduling</h3>
              <p className="text-gray-600">
                Set your availability, manage appointments, and receive automatic reminders — no more double bookings or missed visits.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Secure Records</h3>
              <p className="text-gray-600">
                Access and update patient histories, prescriptions, and notes securely within the platform.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Telehealth Ready</h3>
              <p className="text-gray-600">
                Offer virtual consultations with integrated video and chat — perfect for follow-ups and remote care.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Zero Commission</h3>
              <p className="text-gray-600">
                We don’t take a cut from your appointments. Transparent pricing with no hidden fees.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Dedicated Support</h3>
              <p className="text-gray-600">
                Our team is here to help with onboarding, technical issues, and marketing your profile.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { step: '1', title: 'Sign Up', desc: 'Create your verified doctor profile in minutes' },
              { step: '2', title: 'Set Schedule', desc: 'Define your availability and services' },
              { step: '3', title: 'Get Booked', desc: 'Patients find and book appointments with you' },
              { step: '4', title: 'Consult & Care', desc: 'Deliver quality care, in person or online' }
            ].map((item, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow">
                <div className="w-12 h-12 mx-auto mb-4 bg-[#4d89b1] text-white rounded-full flex items-center justify-center font-bold text-lg">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Specialties & Hospital Integration */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <img
              src="/images/cherrurgie.png"
              alt="Surgery room with digital interface"
              className="rounded-2xl shadow-xl h-96 w-full object-cover"
            />
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Support for All Specialties</h2>
              <p className="text-lg text-gray-700 mb-6">
                From general practitioners to surgeons, dermatologists to pediatricians — Health supports every medical specialty.
              </p>
              <p className="text-lg text-gray-700 mb-6">
                We also offer <strong>clinic and hospital integration</strong>, allowing entire medical teams to collaborate on one platform.
              </p>
              <ul className="space-y-2 text-gray-700">
                <li>     Multi-doctor practices</li>
                <li> Shared calendars</li>
                <li> Centralized patient records</li>
                <li> Billing & insurance tools</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#4d89b1] text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Practice?</h2>
          <p className="text-lg opacity-90 mb-8">
            Join over 5,000 doctors who trust Health to manage their appointments and patient care.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/auth/Register')}
              className="bg-white text-[#4d89b1] px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Log in as a Doctor
            </button>
            <button
              onClick={() => navigate('/contact')}
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition"
            >
              Contact Us
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