// src/components/layout/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom'; // Assure-toi d'avoir react-router-dom installé
import { Activity } from 'lucide-react';

export default function Header({ hideAuthButtons = false }) {
  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center cursor-pointer">
            <Activity className="h-8 w-8 text-[#4d89b1]" />
            <span className="ml-2 text-2xl font-bold text-gray-900">Health</span>
          </div>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/find-doctor" className="text-gray-700 hover:text-[#4d89b1] px-3 py-2 text-sm font-medium transition">
              Find a Doctor
            </Link>
            <Link to="/for-doctors" className="text-gray-700 hover:text-[#4d89b1] px-3 py-2 text-sm font-medium transition">
              For Doctors
            </Link>
            <Link to="/about-us" className="text-gray-700 hover:text-[#4d89b1] px-3 py-2 text-sm font-medium transition">
              About Us
            </Link>
          </nav>

          {/* Boutons d'authentification */}
          {!hideAuthButtons && (
            <div className="hidden md:flex items-center space-x-4">
              <button
                className="text-gray-700 hover:text-[#4d89b1] px-4 py-2 text-sm font-medium transition"
                onClick={() => window.location.href = '/auth/Login'}
              >
                Log In
              </button>
              <button
                style={{ backgroundColor: '#4d89b1' }}
                className="text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-[#3d6c91] transition"
                onClick={() => window.location.href = '/auth/Register'}
              >
                Sign Up
              </button>
            </div>
          )}

          {/* Bouton menu mobile */}
          <div className="md:hidden">
            <button
              className="text-gray-700 hover:text-[#4d89b1] p-2"
            >
              {/* Icône de menu ici */}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}