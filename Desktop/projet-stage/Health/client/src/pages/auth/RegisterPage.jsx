import React, { useState } from 'react';

export default function RegisterPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Les mots de passe ne correspondent pas !");
      return;
    }

    console.log('Inscription avec :', { firstName, lastName, email, birthDate, gender, password });
    // Ici, tu feras l'appel API pour enregistrer l'utilisateur

    // Simulation de succès
    alert('Inscription réussie ! (simulation)');
    window.location.href = '/login'; // Redirection vers login après inscription
  };

  const handleBackToHome = () => {
    window.location.href = '/';
  };

  return (
    <div
      className="flex min-h-screen bg-gray-50"
      style={{ fontFamily: 'Inter, sans-serif' }}
    >
      {/* Partie gauche : Formulaire d'inscription */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 py-12">
        <div
          className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
          style={{
            boxShadow: '0 20px 40px rgba(77, 137, 177, 0.1)',
          }}
        >
          {/* Bouton retour */}
          <div className="mb-4">
            <button
              onClick={handleBackToHome}
              className="flex items-center text-gray-600 hover:text-[#4d89b1] transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Home
            </button>
          </div>

          {/* Logo et titre */}
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

          {/* Formulaire d'inscription */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nom et Prénom en ligne */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Doe"
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
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="John"
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john.doe@example.com"
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base transition"
                style={{ borderColor: '#e0e0e0' }}
              />
            </div>

            {/* Date de naissance */}
            <div>
              <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-2">
                Date of Birth
              </label>
              <input
                id="birthDate"
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
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
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                style={{ borderColor: '#e0e0e0', color: '#1f3a4b' }}
              >
                <option value="" disabled>
                  Select your gender
                </option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base transition"
                style={{ borderColor: '#e0e0e0' }}
              />
            </div>

            {/* Bouton d'inscription */}
            <button
              type="submit"
              className="w-full py-3 px-6 rounded-xl font-semibold text-white transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg"
              style={{
                backgroundColor: '#4d89b1',
                boxShadow: '0 4px 15px rgba(77, 137, 177, 0.3)',
              }}
            >
              Sign Up
            </button>
          </form>

          {/* Lien vers Login */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <a
                href="/login"
                className="font-medium hover:underline"
                style={{ color: '#4d89b1' }}
              >
                Log in
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Partie droite : Image de fond (patient_bg.png) */}
      <div
        className="hidden lg:flex lg:w-1/2 bg-cover bg-center relative"
        style={{
          backgroundImage: "url('/images/patient_bg.png')",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: 'rgba(31, 58, 75, 0.6)', // Overlay bleu foncé
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