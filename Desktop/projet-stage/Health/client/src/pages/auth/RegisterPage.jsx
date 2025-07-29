import React from "react";
import {useState} from "react";
import { Link } from 'react-router-dom';


export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    birthDate: '',
    gender: 'Male',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Effacer l'erreur quand l'utilisateur tape
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.birthDate) newErrors.birthDate = 'Date of birth is required';
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      // Simuler un succès d'inscription
      setIsSuccess(true);
      // En vrai, ici vous feriez un appel API
      console.log('Inscription réussie:', formData);
      // Réinitialiser après 3 secondes
      setTimeout(() => {
        setIsSuccess(false);
        setFormData({
          name: '',
          email: '',
          birthDate: '',
          gender: 'Male',
          password: '',
          confirmPassword: '',
        });
      }, 3000);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Partie gauche : Image de fond */}
      <div
        className="hidden lg:flex lg:w-1/2 bg-cover bg-center relative"
        style={{
          backgroundImage: "url('/public/images/doctor_bg.png')",
        }}
      >
        <div
          className="absolute inset-0"
          style={{ backgroundColor: 'rgba(31, 58, 75, 0.6)' }}
        ></div>
        <div className="relative z-10 flex items-center justify-center w-full p-12 text-white text-center">
          <div>
            <h1 className="text-4xl font-bold mb-6">Welcome to Health</h1>
            <p className="text-lg opacity-90 max-w-md mx-auto">
              Take control of your health journey. Register now to book appointments, access your records, and more.
            </p>
          </div>
        </div>
      </div>

      {/* Partie droite : Formulaire d'inscription */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 py-12">
        <div
          className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
          style={{
            boxShadow: '0 20px 40px rgba(77, 137, 177, 0.1)',
          }}
        >
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

          {/* Message de succès */}
          {isSuccess && (
            <div
              className="mb-6 p-4 text-center text-green-700 bg-green-100 rounded-lg"
              style={{ backgroundColor: '#d4edda', color: '#155724' }}
            >
               Registration successful! Redirecting...
            </div>
          )}

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nom */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base transition ${
                  errors.name ? 'border-red-500' : 'border-gray-200'
                }`}
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base transition ${
                  errors.email ? 'border-red-500' : 'border-gray-200'
                }`}
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            {/* Date de naissance */}
            <div>
              <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-2">
                Date of Birth
              </label>
              <input
                id="birthDate"
                name="birthDate"
                type="date"
                value={formData.birthDate}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base transition ${
                  errors.birthDate ? 'border-red-500' : 'border-gray-200'
                }`}
              />
              {errors.birthDate && <p className="mt-1 text-sm text-red-600">{errors.birthDate}</p>}
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
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                style={{ color: '#1f3a4b' }}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                
              </select>
            </div>

            {/* Mot de passe */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base transition ${
                  errors.password ? 'border-red-500' : 'border-gray-200'
                }`}
              />
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>

            {/* Confirmation mot de passe */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base transition ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-200'
                }`}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Bouton d'inscription */}
            <button
              type="submit"
              className="w-full py-3 px-6 rounded-xl font-semibold text-white transition-all duration-200 transform hover:scale-[1.02]"
              style={{
                backgroundColor: '#4d89b1',
                boxShadow: '0 4px 15px rgba(77, 137, 177, 0.3)',
              }}
            >
              Sign Up
            </button>
          </form>

          {/* Lien vers connexion */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link
                to="/auth/Login"
                className="font-medium"
                style={{ color: '#4d89b1' }}
              >
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}