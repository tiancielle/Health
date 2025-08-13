// client/src/components/common/DoctorCard.jsx
import React from 'react';
import { Star, MapPin, Clock, Phone, Award, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function DoctorCard({ doctor, viewMode = 'grid' }) {
  const navigate = useNavigate();

  const handleSeeDetails = () => {
    navigate(`/doctor/${doctor.id}`);
  };

  // Fonction pour obtenir la couleur du badge selon la spécialité
  const getSpecialtyColor = (specialty) => {
    const colors = {
      'general-practitioner': 'bg-blue-100 text-blue-800',
      'cardiologist': 'bg-red-100 text-red-800',
      'dermatologist': 'bg-green-100 text-green-800',
      'dentist': 'bg-purple-100 text-purple-800',
      'gynecologist': 'bg-pink-100 text-pink-800',
      'ophthalmologist': 'bg-indigo-100 text-indigo-800',
      'pediatrician': 'bg-yellow-100 text-yellow-800',
      'psychiatrist': 'bg-teal-100 text-teal-800'
    };
    return colors[specialty] || 'bg-gray-100 text-gray-800';
  };

  // Fonction pour formater la spécialité
  const formatSpecialty = (specialty) => {
    const specialties = {
      'general-practitioner': 'Médecin Généraliste',
      'cardiologist': 'Cardiologue',
      'dermatologist': 'Dermatologue',
      'dentist': 'Dentiste',
      'gynecologist': 'Gynécologue',
      'ophthalmologist': 'Ophtalmologue',
      'pediatrician': 'Pédiatre',
      'psychiatrist': 'Psychiatre'
    };
    return specialties[specialty] || specialty;
  };

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Photo du médecin */}
          <div className="flex-shrink-0">
            <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden">
              {doctor.profileImage ? (
                <img
                  src={doctor.profileImage}
                  alt={`Dr. ${doctor.firstName} ${doctor.lastName}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#4d89b1] text-white text-2xl font-bold">
                  {doctor.firstName?.charAt(0)}{doctor.lastName?.charAt(0)}
                </div>
              )}
            </div>
          </div>

          {/* Informations principales */}
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex-1">
                {/* Nom et spécialité */}
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Dr. {doctor.firstName} {doctor.lastName}
                </h3>
                
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSpecialtyColor(doctor.specialty)}`}>
                    {formatSpecialty(doctor.specialty)}
                  </span>
                  
                  {/* Note et recommandations */}
                  {doctor.rating && (
                    <div className="flex items-center">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="ml-1 text-sm font-medium text-gray-900">
                          {doctor.rating}
                        </span>
                      </div>
                      <span className="text-sm text-gray-600 ml-1">
                        ({doctor.reviewCount || 0} avis)
                      </span>
                    </div>
                  )}
                  
                  {doctor.recommendationCount && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Award className="h-4 w-4 mr-1" />
                      <span>{doctor.recommendationCount} recommandations</span>
                    </div>
                  )}
                </div>

                {/* Localisation */}
                {doctor.address && (
                  <div className="flex items-center text-gray-600 mb-3">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span className="text-sm">{doctor.address}</span>
                    {doctor.distance && (
                      <span className="text-sm ml-2">• {doctor.distance} km</span>
                    )}
                  </div>
                )}

                {/* Disponibilité */}
                {doctor.nextAvailableSlot && (
                  <div className="flex items-center text-green-600 mb-3">
                    <Clock className="h-4 w-4 mr-2" />
                    <span className="text-sm">
                      Disponible {doctor.nextAvailableSlot}
                    </span>
                  </div>
                )}

                {/* Phrase d'accroche ou description */}
                {doctor.description && (
                  <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                    "{doctor.description}"
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2 md:ml-4">
                <button
                  onClick={handleSeeDetails}
                  className="bg-[#4d89b1] text-white px-6 py-2 rounded-lg hover:bg-[#3d6c91] transition-colors font-medium"
                >
                  Voir détails
                </button>
                
                {doctor.phone && (
                  <button className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center justify-center">
                    <Phone className="h-4 w-4 mr-2" />
                    Appeler
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Mode grille (par défaut)
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* Photo du médecin */}
      <div className="aspect-w-3 aspect-h-2 bg-gray-200">
        {doctor.profileImage ? (
          <img
            src={doctor.profileImage}
            alt={`Dr. ${doctor.firstName} ${doctor.lastName}`}
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="w-full h-48 flex items-center justify-center bg-[#4d89b1] text-white text-4xl font-bold">
            {doctor.firstName?.charAt(0)}{doctor.lastName?.charAt(0)}
          </div>
        )}
      </div>

      <div className="p-6">
        {/* Nom et spécialité */}
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          Dr. {doctor.firstName} {doctor.lastName}
        </h3>
        
        <div className="mb-3">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSpecialtyColor(doctor.specialty)}`}>
            {formatSpecialty(doctor.specialty)}
          </span>
        </div>

        {/* Note et recommandations */}
        <div className="flex items-center justify-between mb-3">
          {doctor.rating && (
            <div className="flex items-center">
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="ml-1 text-sm font-medium text-gray-900">
                  {doctor.rating}
                </span>
              </div>
              <span className="text-sm text-gray-600 ml-1">
                ({doctor.reviewCount || 0})
              </span>
            </div>
          )}
          
          {doctor.recommendationCount && (
            <div className="flex items-center text-sm text-gray-600">
              <Award className="h-4 w-4 mr-1" />
              <span>{doctor.recommendationCount}</span>
            </div>
          )}
        </div>

        {/* Localisation */}
        {doctor.address && (
          <div className="flex items-center text-gray-600 mb-3">
            <MapPin className="h-4 w-4 mr-2" />
            <span className="text-sm truncate">{doctor.address}</span>
          </div>
        )}

        {/* Distance */}
        {doctor.distance && (
          <div className="text-sm text-gray-600 mb-3">
            À {doctor.distance} km
          </div>
        )}

        {/* Disponibilité */}
        {doctor.nextAvailableSlot && (
          <div className="flex items-center text-green-600 mb-4">
            <Clock className="h-4 w-4 mr-2" />
            <span className="text-sm">
              Disponible {doctor.nextAvailableSlot}
            </span>
          </div>
        )}

        {/* Phrase d'accroche */}
        {doctor.description && (
          <p className="text-gray-600 text-sm line-clamp-3 mb-4">
            "{doctor.description}"
          </p>
        )}

        {/* Bouton d'action */}
        <button
          onClick={handleSeeDetails}
          className="w-full bg-[#4d89b1] text-white py-2 px-4 rounded-lg hover:bg-[#3d6c91] transition-colors font-medium"
        >
          Voir détails
        </button>
      </div>
    </div>
  );
}