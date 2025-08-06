// client/src/pages/public/ContactUsPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';

export default function ContactPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' or 'error'

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission (replace with API call later)
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1500);
  };

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
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Contact Us</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Have questions or need support? We're here to help. Reach out to our team for inquiries, feedback, or partnership opportunities.
          </p>
          <img
            src="/images/hospital.png"
            alt="Medical team in Morocco using Health platform"
            className="mx-auto mt-12 rounded-2xl shadow-xl h-72 object-cover w-full max-w-4xl"
          />
        </div>
      </section>

      {/* Contact Info Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-16">
            {/* Address */}
            <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
                <MapPin className="h-8 w-8 text-[#4d89b1]" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Office</h3>
              <p className="text-gray-600">
                Immeuble Health, 123 Avenue Mohammed V<br />
                Quartier des Hôpitaux, Bureau 500<br />
                Casablanca 20360<br />
                Morocco
              </p>
            </div>

            {/* Phone */}
            <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                <Phone className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Call Us</h3>
              <p className="text-gray-600">
                <strong>Support:</strong> +212 5 22 34 56 78<br />
                <strong>Medical Emergencies:</strong> 141<br />
                <small className="text-gray-500">Mon-Fri, 8:00 AM – 8:00 PM • Sat, 9:00 AM – 5:00 PM</small>
              </p>
            </div>

            {/* Email */}
            <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-purple-100 rounded-full flex items-center justify-center">
                <Mail className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Email Us</h3>
              <p className="text-gray-600">
                <strong>General:</strong> contact@health.ma<br />
                <strong>Doctors:</strong> docteurs@health.ma<br />
                <strong>Support:</strong> support@health.ma
              </p>
            </div>
          </div>

          {/* Hours */}
          <div className="text-center bg-gray-50 p-8 rounded-2xl border border-gray-100">
            <div className="flex items-center justify-center mb-4">
              <Clock className="h-6 w-6 text-[#4d89b1] mr-2" />
              <h3 className="text-2xl font-bold text-gray-900">Support Hours</h3>
            </div>
            <p className="text-gray-600">
              Monday to Friday: 8:00 AM – 8:00 PM • Saturday: 9:00 AM – 5:00 PM • Sunday: Closed
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Send Us a Message</h2>
            <p className="text-gray-600 text-center mb-10">
              Fill out the form below and our team will get back to you within 24 hours.
            </p>

            {submitStatus === 'success' ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                <p className="text-gray-600">
                  Thank you for contacting us. We'll get back to you shortly.
                </p>
                <button
                  onClick={() => setSubmitStatus(null)}
                  className="mt-6 text-[#4d89b1] hover:underline font-medium"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4d89b1] focus:border-transparent"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4d89b1] focus:border-transparent"
                      placeholder="your.email@domain.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4d89b1] focus:border-transparent"
                  >
                    <option value="">Select a subject</option>
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Doctor Registration">Doctor Registration</option>
                    <option value="Technical Support">Technical Support</option>
                    <option value="Billing & Payments">Billing & Payments</option>
                    <option value="Partnership">Partnership / Clinic Integration</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4d89b1] focus:border-transparent"
                    placeholder="Please describe your request or question..."
                  ></textarea>
                </div>

                <div className="text-center">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-[#4d89b1] text-white px-10 py-3 rounded-lg font-semibold hover:bg-[#3d6c91] transition flex items-center justify-center mx-auto disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-5 w-5" /> Send Message
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-16 bg-[#4d89b1] text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4">Need Immediate Help?</h2>
          <p className="text-lg opacity-90 mb-8">
            Call our support team at <strong>+212 5 22 34 56 78</strong> or email us at <strong>support@health.ma</strong>
          </p>
          <button
            onClick={() => navigate('/auth/Login')}
            className="bg-white text-[#4d89b1] px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Log In to Your Account
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500 text-sm">
          © 2025 Health. All rights reserved. Morocco.
        </div>
      </footer>
    </div>
  );
}