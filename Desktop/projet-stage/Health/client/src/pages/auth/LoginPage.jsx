// client/src/pages/auth/LoginPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Header from '../../components/layout/Header';
import { useAuth } from '../../context/AuthContext.jsx';
import { getReturnUrl, debugAuthState } from '../../utils/authUtils';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Patient');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login, isAuthenticated, currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Debug
  useEffect(() => {
    debugAuthState();
  }, []);

  // Rediriger si déjà connecté
  useEffect(() => {
    if (isAuthenticated && isAuthenticated()) {
      const returnUrl = getReturnUrl();
      console.log('User already authenticated, redirecting to:', returnUrl);
      navigate(returnUrl, { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Gérer les paramètres de redirection de l'URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const redirectParam = searchParams.get('redirect');
    
    if (redirectParam) {
      localStorage.setItem('returnUrl', decodeURIComponent(redirectParam));
      console.log('Redirect parameter found:', decodeURIComponent(redirectParam));
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Attempting login with:', { email, role });
      
      // Appel à la fonction login du contexte
      const result = await login(email, password, role);
      
      if (result && result.success) {
        console.log('Login successful:', result.user);
        
        // Obtenir l'URL de retour
        const returnUrl = getReturnUrl();
        console.log('Redirecting to:', returnUrl);
        
        // Rediriger vers l'URL de retour ou tableau de bord approprié
        navigate(returnUrl, { replace: true });
      } else {
        throw new Error('Login failed');
      }
    } catch (error) {
      console.error("Erreur de connexion:", error);
      setError('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  const handleForgotPassword = () => {
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
            backgroundColor: 'rgba(31, 58, 75, 0.6)',
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
              Log In to Your Account
            </h2>
            <p className="text-gray-600 mt-2">Sign in to manage your appointments</p>
          </div>

          {/* Message d'erreur */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base transition disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ borderColor: '#e0e0e0' }}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base transition disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ borderColor: '#e0e0e0' }}
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                I am a
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ borderColor: '#e0e0e0', color: '#1f3a4b' }}
              >
                <option value="Patient">Patient</option>
                <option value="Doctor">Doctor</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-6 rounded-xl font-semibold text-white transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              style={{
                backgroundColor: '#4d89b1',
                boxShadow: '0 4px 15px rgba(77, 137, 177, 0.3)',
              }}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                  Logging in...
                </div>
              ) : (
                'Log In'
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link
                to="/auth/register"
                className="font-medium hover:underline"
                style={{ color: '#4d89b1' }}
              >
                Sign up as a patient
              </Link>
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