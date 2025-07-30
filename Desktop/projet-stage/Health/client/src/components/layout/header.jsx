// src/components/layout/Header.jsx
import React, { useState } from 'react';
import { Activity, Menu, X } from 'lucide-react';

export default function Header({ hideAuthButtons = false }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLoginClick = () => {
    window.location.href = '/auth/Login';
  };

  const handleSignUpClick = () => {
    window.location.href = '/auth/Register';
  };

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div
            className="flex items-center cursor-pointer"
            onClick={() => (window.location.href = '/')}
          >
            <Activity className="h-8 w-8 text-[#4d89b1]" />
            <span className="ml-2 text-2xl font-bold text-gray-900">Health</span>
          </div>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex space-x-8">
            <a href="#" className="text-gray-700 hover:text-[#4d89b1] px-3 py-2 text-sm font-medium transition">
              Find a Doctor
            </a>
            <a href="#" className="text-gray-700 hover:text-[#4d89b1] px-3 py-2 text-sm font-medium transition">
              For Doctors
            </a>
            <a href="#" className="text-gray-700 hover:text-[#4d89b1] px-3 py-2 text-sm font-medium transition">
              About Us
            </a>
          </nav>

          {/* Boutons Login / Sign Up (cachés si demandé) */}
          {!hideAuthButtons && (
            <div className="hidden md:flex items-center space-x-4">
              <button
                className="text-gray-700 hover:text-[#4d89b1] px-4 py-2 text-sm font-medium transition"
                onClick={handleLoginClick}
              >
                Log In
              </button>
              <button
                style={{ backgroundColor: '#4d89b1' }}
                className="text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-[#3d6c91] transition"
                onClick={handleSignUpClick}
              >
                Sign Up
              </button>
            </div>
          )}

          {/* Bouton menu mobile */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-[#4d89b1] p-2"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Menu mobile */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a href="#" className="block px-3 py-2 text-gray-700 hover:text-[#4d89b1]">Find a Doctor</a>
              <a href="#" className="block px-3 py-2 text-gray-700 hover:text-[#4d89b1]">For Doctors</a>
              <a href="#" className="block px-3 py-2 text-gray-700 hover:text-[#4d89b1]">About Us</a>

              {!hideAuthButtons && (
                <div className="pt-4 pb-2 border-t border-gray-100">
                  <button
                    className="block w-full text-left px-3 py-2 text-gray-700 hover:text-[#4d89b1]"
                    onClick={handleLoginClick}
                  >
                    Log In
                  </button>
                  <button
                    style={{ backgroundColor: '#4d89b1' }}
                    className="block w-full text-left px-3 py-2 text-white font-medium mt-2 rounded"
                    onClick={handleSignUpClick}
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}