import React, { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Patient');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Connexion avec :', { email, password, role });
    // Ici, vous ajouterez l'appel API de login
    
    // Simulation de succès de connexion - redirection vers home
    alert('Connexion réussie ! (simulation)');
    window.location.href = '/';
  };

  const handleBackToHome = () => {
    window.location.href = '/';
  };

  const handleSignUp = () => {
    // Pour l'instant, afficher un message
    alert('Page d\'inscription en cours de développement');
  };

  const handleForgotPassword = () => {
    // Pour l'instant, afficher un message
    alert('Page de récupération de mot de passe en cours de développement');
  };

  return (
    <div
      className="flex min-h-screen bg-gray-50"
      style={{ fontFamily: 'Inter, sans-serif' }}
    >
      {/* Partie gauche : Image de fond */}
      <div
        className="hidden lg:flex lg:w-1/2 bg-cover bg-center relative"
        style={{
          backgroundImage: "url('/images/doctor_bg.png')",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: 'rgba(31, 58, 75, 0.6)', // Overlay bleu foncé #1f3a4b à 60%
          }}
        ></div>
        <div className="relative z-10 flex items-center justify-center w-full p-12 text-white text-center">
          <div>
            <h1 className="text-4xl font-bold mb-6">Welcome Back</h1>
            <p className="text-lg opacity-90 max-w-md mx-auto">
              Access your dashboard and manage your appointments, patients, or health records securely.
            </p>
          </div>
        </div>
      </div>

      {/* Partie droite : Formulaire de connexion */}
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
            <div
              className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-4"
              style={{ backgroundColor: '#4d89b1' }}
            >
              <span
                className="text-2xl font-bold text-white"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                H
              </span>
            </div>
            <h2
              className="text-3xl font-bold text-gray-900"
              style={{ color: '#1f3a4b' }}
            >
              Log In
            </h2>
            <p className="text-gray-600 mt-2">Sign in to your account</p>
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base transition"
                style={{
                  borderColor: '#e0e0e0',
                }}
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base transition"
                style={{
                  borderColor: '#e0e0e0',
                }}
              />
            </div>

            {/* Role Selection */}
            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                I am a
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                style={{
                  borderColor: '#e0e0e0',
                  color: '#1f3a4b',
                }}
              >
                <option value="Patient">Patient</option>
                <option value="Doctor">Doctor</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 px-6 rounded-xl font-semibold text-white transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg"
              style={{
                backgroundColor: '#4d89b1',
                boxShadow: '0 4px 15px rgba(77, 137, 177, 0.3)',
              }}
            >
              Log In
            </button>
          </form>

          {/* Lien vers Sign Up */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <button
                onClick={handleSignUp}
                className="font-medium hover:underline"
                style={{ color: '#4d89b1' }}
              >
                Sign up as a patient
              </button>
            </p>
          </div>

          {/* Mot de passe oublié */}
          <div className="mt-4 text-center">
            <button
              onClick={handleForgotPassword}
              className="text-sm hover:underline"
              style={{ color: '#4d89b1' }}
            >
              Forgot your password?
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}