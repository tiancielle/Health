import React from 'react';
import { Link } from 'react-router-dom';
import { Home, AlertCircle } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center px-4 sm:px-6 lg:px-8"
      style={{
        backgroundColor: '#f0f4f8', 
      }}
    >
      {/* Image de fond semi-transparente */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-10"
        style={{
          backgroundImage: "url('/public/images/health_background.png')",
        }}
      ></div>

      {/* Contenu principal */}
      <div 
        className="relative z-10 text-center max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-10 border border-gray-200"
        style={{
          boxShadow: '0 10px 30px rgba(77, 137, 177, 0.15)',
        }}
      >
        {/* Icône d'alerte */}
        <div className="flex justify-center mb-6">
          <div 
            className="bg-red-100 rounded-full p-4"
            style={{
              backgroundColor: '#fee2e2',
            }}
          >
            <AlertCircle className="h-12 w-12" style={{ color: '#dc2626' }} />
          </div>
        </div>

        {/* Titre 404 */}
        <h1 
          className="text-6xl font-bold mb-4"
          style={{ color: '#1f3a4b' }} // Bleu foncé
        >
          404
        </h1>

        <h2 
          className="text-3xl font-semibold mb-6"
          style={{ color: '#1f3a4b' }}
        >
          Page Not Found
        </h2>

        {/* Description */}
        <p 
          className="text-lg text-gray-600 mb-8 leading-relaxed"
          style={{ color: '#4d4d4d' }}
        >
          Oops! The page you're looking for doesn't exist or has been moved. 
          Let us help you get back on track.
        </p>

        {/* Boutons d'action */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 text-white"
            style={{
              backgroundColor: '#4d89b1', // Votre bleu principal
              boxShadow: '0 4px 12px rgba(77, 137, 177, 0.3)',
            }}
          >
            <Home className="h-5 w-5" />
            Back to Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition"
            style={{
              color: '#4d89b1',
              borderColor: '#4d89b1',
            }}
          >
            Go Back
          </button>
        </div>

        {/* Message de support */}
        <div 
          className="mt-10 text-sm text-gray-500"
          style={{ color: '#555' }}
        >
          If you believe this is a mistake, please contact our support team.
        </div>
      </div>
    </div>
  );
}