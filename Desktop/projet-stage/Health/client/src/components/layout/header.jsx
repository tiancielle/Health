import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, User, LogOut, Calendar, FileText, MessageCircle, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

export default function Header({ onLogoClick }) {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogoClick = () => {
    if (onLogoClick) onLogoClick();
  };

  const handleLoginClick = () => {
    navigate('/auth/login');
  };

  const handleSignUpClick = () => {
    navigate('/auth/register');
  };

  const handleLogoutClick = () => {
    logout();
    navigate('/');
    setIsDropdownOpen(false);
  };

  // Fonction pour extraire le nom de famille (dernier mot)
  const getLastName = (fullName) => {
    if (!fullName) return '';
    const words = fullName.trim().split(' ');
    return words.length > 0 ? words[words.length - 1] : fullName;
  };

  // Fonction pour déterminer le titre (M. / Mme)
  const getSalutation = (user) => {
    if (!user) return 'M.';
    return user.role === 'Patient' ? 'Mme' : 'M.';
  };

  // Fermer le dropdown si on clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Options du menu dropdown
  const menuItems = [
    {
      icon: User,
      label: 'My Profile',
      path: '/patient/profile'
    },
    {
      icon: Calendar,
      label: 'My Appointments',
      path: '/patient/appointments'
    },
    {
      icon: FileText,
      label: 'Medical Records',
      path: '/patient/records'
    },
    {
      icon: MessageCircle,
      label: 'Messages',
      path: '/patient/messages'
    }
  ];

  const handleMenuItemClick = (path) => {
    navigate(path);
    setIsDropdownOpen(false);
  };

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div
              className="flex-shrink-0 flex items-center cursor-pointer"
              onClick={handleLogoClick}
            >
              <Activity className="h-8 w-8 text-[#4d89b1]" />
              <span className="ml-2 text-2xl font-bold text-gray-900">Health</span>
            </div>
          </div>

          {/* Navigation Desktop */}
          <nav className="flex space-x-8">
            <button
              onClick={() => navigate('/')}
              className="text-gray-700 hover:text-[#4d89b1] px-3 py-2 text-sm font-medium transition"
            >
              Find a Doctor
            </button>
            <button
              onClick={() => navigate('/about-us')}
              className="text-gray-700 hover:text-[#4d89b1] px-3 py-2 text-sm font-medium transition"
            >
              About Us
            </button>
            <button
              onClick={() => navigate('/for-doctors')}
              className="text-gray-700 hover:text-[#4d89b1] px-3 py-2 text-sm font-medium transition"
            >
              For Doctors
            </button>
          </nav>

          {/* Actions Desktop */}
          <div className="flex items-center space-x-4">
            {currentUser ? (
              <div className="relative" ref={dropdownRef}>
                {/* Bouton du menu utilisateur */}
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-[#4d89b1] font-medium transition px-3 py-2 rounded-lg hover:bg-gray-50"
                  aria-label="User menu"
                >
                  <User className="h-5 w-5" />
                  <span>
                    {getSalutation(currentUser)} {getLastName(currentUser.name)}
                  </span>
                  <ChevronDown 
                    className={`h-4 w-4 transition-transform duration-200 ${
                      isDropdownOpen ? 'rotate-180' : ''
                    }`} 
                  />
                </button>

                {/* Menu déroulant */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    {menuItems.map((item, index) => {
                      const IconComponent = item.icon;
                      return (
                        <button
                          key={index}
                          onClick={() => handleMenuItemClick(item.path)}
                          className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#4d89b1] transition-colors"
                        >
                          <IconComponent className="h-4 w-4" />
                          <span>{item.label}</span>
                        </button>
                      );
                    })}
                    
                    {/* Séparateur */}
                    <div className="border-t border-gray-100 my-2"></div>
                    
                    {/* Bouton Logout */}
                    <button
                      onClick={handleLogoutClick}
                      className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}