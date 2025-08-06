// client/src/components/common/DoctorCard.jsx
import React from 'react';
import { Star, MapPin, Clock, Calendar, Heart, Shield, Award, Phone } from 'lucide-react';
import Avatar from './Avatar';

export default function DoctorCard({ 
  doctor, 
  viewMode = 'grid', 
  onBookAppointment,
  onViewProfile,
  showBookButton = true 
}) {
  const {
    id,
    firstName,
    lastName,
    specialty,
    rating,
    reviewCount,
    profileImage,
    location,
    address,
    distance,
    nextAvailableSlot,
    consultationFee,
    languages,
    experience,
    verified,
    acceptsInsurance,
    availableToday
  } = doctor;

  const fullName = `Dr. ${firstName} ${lastName}`;
  
  const handleBookClick = (e) => {
    e.stopPropagation();
    if (onBookAppointment) {
      onBookAppointment(doctor);
    }
  };

  const handleCardClick = () => {
    if (onViewProfile) {
      onViewProfile(doctor);
    }
  };

  const formatNextSlot = (slot) => {
    if (!slot) return 'Contact for availability';
    
    const date = new Date(slot);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return `Today at ${date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true 
      })}`;
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return `Tomorrow at ${date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true 
      })}`;
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true 
      });
    }
  };

  if (viewMode === 'list') {
    return (
      <div 
        className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden"
        onClick={handleCardClick}
      >
        <div className="p-6">
          <div className="flex items-start space-x-4">
            {/* Photo et badges */}
            <div className="relative flex-shrink-0">
              <Avatar 
                src={profileImage} 
                alt={fullName}
                size="large"
                className="ring-2 ring-gray-100"
              />
              {verified && (
                <div className="absolute -top-1 -right-1 bg-blue-500 rounded-full p-1">
                  <Shield className="h-3 w-3 text-white" />
                </div>
              )}
              {availableToday && (
                <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full w-4 h-4 border-2 border-white"></div>
              )}
            </div>

            {/* Informations principales */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    {fullName}
                  </h3>
                  <p className="text-[#4d89b1] font-medium mb-2 capitalize">
                    {specialty}
                  </p>
                  
                  {/* Rating et avis */}
                  <div className="flex items-center space-x-4 mb-3">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="font-medium text-gray-900">{rating}</span>
                      <span className="text-gray-500">({reviewCount} reviews)</span>
                    </div>
                    {experience && (
                      <div className="flex items-center space-x-1 text-gray-600">
                        <Award className="h-4 w-4" />
                        <span className="text-sm">{experience} years exp.</span>
                      </div>
                    )}
                  </div>

                  {/* Localisation */}
                  <div className="flex items-center space-x-2 text-gray-600 mb-3">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">{address || location}</span>
                    {distance && (
                      <span className="text-sm text-gray-500">• {distance}</span>
                    )}
                  </div>

                  {/* Langues */}
                  {languages && languages.length > 0 && (
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="text-sm text-gray-600">Languages:</span>
                      <div className="flex flex-wrap gap-1">
                        {languages.slice(0, 3).map((lang, index) => (
                          <span 
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                          >
                            {lang}
                          </span>
                        ))}
                        {languages.length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{languages.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Prix et disponibilité */}
                <div className="text-right ml-4">
                  {consultationFee && (
                    <div className="text-lg font-semibold text-gray-900 mb-1">
                      ${consultationFee}
                    </div>
                  )}
                  <div className="flex items-center space-x-1 text-sm text-gray-600 mb-3">
                    <Clock className="h-4 w-4" />
                    <span>{formatNextSlot(nextAvailableSlot)}</span>
                  </div>
                  
                  {/* Badges */}
                  <div className="flex flex-col space-y-1 mb-4">
                    {acceptsInsurance && (
                      <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        <Shield className="h-3 w-3 mr-1" />
                        Insurance
                      </span>
                    )}
                    {availableToday && (
                      <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        <Calendar className="h-3 w-3 mr-1" />
                        Today
                      </span>
                    )}
                  </div>

                  {/* Boutons d'action */}
                  <div className="flex flex-col space-y-2">
                    {showBookButton && (
                      <button
                        onClick={handleBookClick}
                        className="bg-[#4d89b1] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#3d6c91] transition-colors duration-200"
                      >
                        Book Appointment
                      </button>
                    )}
                    <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors duration-200">
                      View Profile
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Mode grille (par défaut)
  return (
    <div 
      className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-[#a0c3e0] transition-all duration-200 cursor-pointer overflow-hidden group"
      onClick={handleCardClick}
    >
      {/* En-tête avec photo */}
      <div className="relative p-6 pb-4">
        <div className="flex items-start space-x-4">
          <div className="relative">
            <Avatar 
              src={profileImage} 
              alt={fullName}
              size="medium"
              className="ring-2 ring-gray-100 group-hover:ring-[#4d89b1] transition-all duration-200"
            />
            {verified && (
              <div className="absolute -top-1 -right-1 bg-blue-500 rounded-full p-1">
                <Shield className="h-3 w-3 text-white" />
              </div>
            )}
            {availableToday && (
              <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full w-3 h-3 border-2 border-white"></div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-[#4d89b1] transition-colors">
              {fullName}
            </h3>
            <p className="text-[#4d89b1] font-medium text-sm capitalize">
              {specialty}
            </p>
          </div>

          {/* Icône favoris */}
          <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
            <Heart className="h-5 w-5 text-gray-400 hover:text-red-500" />
          </button>
        </div>

        {/* Rating */}
        <div className="flex items-center space-x-2 mt-3">
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="font-medium text-gray-900 text-sm">{rating}</span>
          </div>
          <span className="text-gray-500 text-sm">({reviewCount})</span>
          {experience && (
            <span className="text-gray-500 text-sm">• {experience}y exp.</span>
          )}
        </div>
      </div>

      {/* Informations */}
      <div className="px-6 pb-4">
        {/* Localisation */}
        <div className="flex items-center space-x-2 text-gray-600 mb-3">
          <MapPin className="h-4 w-4 flex-shrink-0" />
          <span className="text-sm truncate">{location}</span>
          {distance && (
            <span className="text-sm text-gray-500 flex-shrink-0">• {distance}</span>
          )}
        </div>

        {/* Disponibilité */}
        <div className="flex items-center space-x-2 text-gray-600 mb-4">
          <Clock className="h-4 w-4 flex-shrink-0" />
          <span className="text-sm">{formatNextSlot(nextAvailableSlot)}</span>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          {acceptsInsurance && (
            <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
              <Shield className="h-3 w-3 mr-1" />
              Insurance
            </span>
          )}
          {availableToday && (
            <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
              <Calendar className="h-3 w-3 mr-1" />
              Today
            </span>
          )}
          {languages && languages.length > 0 && (
            <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
              {languages[0]}
              {languages.length > 1 && ` +${languages.length - 1}`}
            </span>
          )}
        </div>

        {/* Prix */}
        {consultationFee && (
          <div className="text-center mb-4">
            <span className="text-lg font-semibold text-gray-900">
              ${consultationFee}
            </span>
            <span className="text-gray-500 text-sm ml-1">consultation</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="px-6 pb-6">
        <div className="flex space-x-2">
          {showBookButton && (
            <button
              onClick={handleBookClick}
              className="flex-1 bg-[#4d89b1] text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-[#3d6c91] transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <Calendar className="h-4 w-4" />
              <span>Book Now</span>
            </button>
          )}
          <button className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors duration-200">
            View Profile
          </button>
        </div>
      </div>
    </div>
  );
}