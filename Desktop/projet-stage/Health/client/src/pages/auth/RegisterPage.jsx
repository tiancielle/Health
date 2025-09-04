// src/pages/auth/RegisterPage.jsx
import React, { useState } from 'react';
import api from '../../services/api';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    dateOfBirth: '',
    gender: '',
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Validation frontend
    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    if (formData.password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/auth/register', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender.toLowerCase(),
        password: formData.password,
        role: 'patient',
      });

      setSuccess(true);

      // Redirection après 1.5s
      setTimeout(() => {
        window.location.href = '/auth/Login';
      }, 1500);

    } catch (err) {
      const message = err.response?.data?.message || 'Erreur réseau ou serveur.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* === Formulaire d'inscription (gauche) === */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 py-24">
        <div
          className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
          style={{
            boxShadow: '0 20px 40px rgba(77, 137, 177, 0.1)',
          }}
        >
          {/* Logo centré */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <img
                src="/images/Health.PNG"
                alt="Health Logo"
                className="h-14 w-14 object-contain"
                style={{
                  boxShadow: '0 4px 12px rgba(77, 137, 177, 0.2)',
                  borderRadius: '1rem',
                }}
              />
            </div>
            <h2
              className="text-3xl font-bold text-gray-900"
              style={{ color: '#1f3a4b' }}
            >
              Create Your Account
            </h2>
            <p className="text-gray-600 mt-2">Sign up to book appointments</p>
          </div>

          {/* Messages d'erreur/succès */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm text-center">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm text-center">
               Inscription réussie ! Redirection vers la connexion...
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nom et Prénom */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Last name"
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base transition"
                  style={{ borderColor: '#e0e0e0' }}
                />
              </div>
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="first name"
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base transition"
                  style={{ borderColor: '#e0e0e0' }}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your-email@example.com"
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base transition"
                style={{ borderColor: '#e0e0e0' }}
              />
            </div>

            {/* Date de naissance */}
            <div>
              <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-2">
                Date of Birth
              </label>
              <input
                id="dateOfBirth"
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base transition"
                style={{ borderColor: '#e0e0e0' }}
              />
            </div>

            {/* Sexe */}
            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                style={{ borderColor: '#e0e0e0', color: '#1f3a4b' }}
              >
                <option value="" disabled>Select your gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            {/* Mot de passe */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base transition"
                style={{ borderColor: '#e0e0e0' }}
              />
            </div>

            {/* Confirmation mot de passe */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base transition"
                style={{ borderColor: '#e0e0e0' }}
              />
            </div>

            {/* Bouton d'inscription */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-6 rounded-xl font-semibold text-white transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg"
              style={{
                backgroundColor: loading ? '#88a9c3' : '#4d89b1',
                boxShadow: '0 4px 15px rgba(77, 137, 177, 0.3)',
              }}
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          {/* Lien vers Login */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <a href="/auth/Login" className="font-medium hover:underline" style={{ color: '#4d89b1' }}>
                Log in
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* === Image de fond (droite) === */}
      <div
        className="hidden lg:flex lg:w-1/2 bg-cover bg-center relative"
        style={{
          backgroundImage: "url('/images/patient_bg.png')",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: 'rgba(31, 58, 75, 0.6)',
          }}
        ></div>
        <div className="relative z-10 flex items-center justify-center w-full p-12 text-white text-center">
          <div>
            <h1 className="text-4xl font-bold mb-6">Welcome to Health</h1>
            <p className="text-lg opacity-90 max-w-md mx-auto">
              Take control of your health with smart appointment booking and secure medical records.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}