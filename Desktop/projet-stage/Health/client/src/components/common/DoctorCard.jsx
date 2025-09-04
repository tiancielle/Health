// client/src/components/common/DoctorCard.jsx
import React from 'react';
import { 
  Star, 
  MapPin, 
  Clock, 
  UserCheck,
  Building2,
  Calendar
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function DoctorCard({ doctor, viewMode = 'grid' }) {
  const navigate = useNavigate();

  const handleSeeProfile = () => {
    navigate(`/doctor/${doctor.id}`);
  };

  const handleBookAppointment = (e) => {
    e.stopPropagation();
    console.log('Booking appointment for doctor:', doctor.id);
    // navigate(`/book-appointment/${doctor.id}`);
  };

  const getSpecialtyColor = (specialty) => {
    const colors = {
      'general-practitioner': 'bg-blue-100 text-blue-800 border-blue-200',
      'cardiologist': 'bg-red-100 text-red-800 border-red-200',
      'dermatologist': 'bg-green-100 text-green-800 border-green-200',
      'dentist': 'bg-purple-100 text-purple-800 border-purple-200',
      'gynecologist': 'bg-pink-100 text-pink-800 border-pink-200',
      'ophthalmologist': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'pediatrician': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'psychiatrist': 'bg-teal-100 text-teal-800 border-teal-200'
    };
    return colors[specialty] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const formatSpecialty = (specialty) => {
    const specialties = {
      'general-practitioner': 'General Practitioner',
      'cardiologist': 'Cardiologist',
      'dermatologist': 'Dermatologist',
      'dentist': 'Dentist',
      'gynecologist': 'Gynecologist',
      'ophthalmologist': 'Ophthalmologist',
      'pediatrician': 'Pediatrician',
      'psychiatrist': 'Psychiatrist'
    };
    return specialties[specialty] || specialty;
  };

  const formatAvailability = (nextSlot) => {
    if (!nextSlot) return null;
    const lower = nextSlot.toLowerCase();
    if (lower.includes('today') || lower.includes('aujourd\'hui')) return "Today";
    if (lower.includes('tomorrow') || lower.includes('demain')) return "Tomorrow";
    if (lower.includes('3 days') || lower.includes('3 jours')) return "In 3 days";
    return nextSlot;
  };

  const getBadges = () => {
    const badges = [];
    if (doctor.hasTelemedicine || doctor.teleconsultationAvailable) {
      badges.push({ text: 'Teleconsultation', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' });
    }
    if (doctor.gender === 'female' || doctor.isFemale) {
      badges.push({ text: 'Female', color: 'bg-purple-100 text-purple-700 border-purple-200' });
    }
    if (doctor.acceptsNewPatients !== false) {
      badges.push({ text: 'Accepts New Patients', color: 'bg-green-100 text-green-700 border-green-200' });
    }
    return badges;
  };

  // Fix pour l'affichage de la ville
  const getCityName = (doctor) => {
    // Essayer plusieurs champs possibles pour la ville
    if (doctor.city) return doctor.city;
    if (doctor.location) return doctor.location;
    if (doctor.address) {
      // Si c'est une adresse complète, essayer d'extraire la ville
      const addressParts = doctor.address.split(',');
      if (addressParts.length > 1) {
        return addressParts[addressParts.length - 1].trim();
      }
    }
    if (doctor.clinics && doctor.clinics.length > 0 && doctor.clinics[0].city) {
      return doctor.clinics[0].city;
    }
    return 'Location not specified';
  };

  if (!doctor || !doctor.id) return null;

  const availability = formatAvailability(doctor.nextAvailableSlot);
  const badges = getBadges();
  const fullName = `Dr. ${doctor.firstName || ''} ${doctor.lastName || 'Unknown'}`.trim();
  const city = getCityName(doctor); // Utiliser la fonction corrigée
  const price = doctor.consultationPrice || doctor.consultationFee;

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg">
        <div className="flex gap-6">
          <div className="w-28 h-28 rounded-xl bg-gray-200 flex items-center justify-center">
            {doctor.profileImage ? (
              <img src={doctor.profileImage} alt={fullName} className="w-full h-full object-cover rounded-xl" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#4d89b1] to-[#3d6c91] text-white text-xl font-bold">
                {doctor.firstName?.charAt(0) || 'D'}{doctor.lastName?.charAt(0) || 'R'}
              </div>
            )}
          </div>

          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-2">{fullName}</h3>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getSpecialtyColor(doctor.specialty)}`}>
              {formatSpecialty(doctor.specialty)}
            </span>

            {doctor.rating && (
              <div className="flex items-center gap-2 mb-3">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < Math.floor(doctor.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                  ))}
                  <span className="ml-1 font-semibold">{doctor.rating}</span>
                </div>
                <span className="text-gray-600">({doctor.reviewCount || 0} reviews)</span>
              </div>
            )}

            <div className="flex items-center text-gray-600 mb-2">
              <MapPin className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">{city}</span>
            </div>

            {doctor.clinicName && (
              <div className="flex items-center text-gray-600 mb-3">
                <Building2 className="h-4 w-4 mr-2" />
                <span className="text-sm">{doctor.clinicName}</span>
              </div>
            )}

            {doctor.testimonial && (
              <div className="bg-gray-50 rounded-lg p-3 mb-3">
                <p className="text-sm text-gray-700 italic line-clamp-2">"{doctor.testimonial}"</p>
              </div>
            )}

            {availability && (
              <div className="flex items-center text-green-600 mb-3">
                <Clock className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">Available {availability}</span>
              </div>
            )}

            {badges.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {badges.map((badge, i) => (
                  <span key={i} className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${badge.color}`}>
                    {badge.text}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col justify-between">
            {price && (
              <div className="text-right mb-4">
                <div className="text-2xl font-bold text-[#4d89b1]">{price} MAD</div>
                <div className="text-sm text-gray-600">Consultation</div>
              </div>
            )}
            <div className="flex flex-col gap-2">
              <button
                onClick={handleSeeProfile}
                className="bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 font-medium"
              >
                View Profile
              </button>
              <button
                onClick={handleBookAppointment}
                className="bg-[#4d89b1] text-white px-6 py-2 rounded-lg hover:bg-[#3d6c91] font-medium flex items-center justify-center"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg">
      <div className="h-48 bg-gray-200 flex items-center justify-center">
        {doctor.profileImage ? (
          <img src={doctor.profileImage} alt={fullName} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#4d89b1] to-[#3d6c91] text-white text-3xl font-bold">
            {doctor.firstName?.charAt(0) || 'D'}{doctor.lastName?.charAt(0) || 'R'}
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 mb-2">{fullName}</h3>
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getSpecialtyColor(doctor.specialty)}`}>
          {formatSpecialty(doctor.specialty)}
        </span>

        {doctor.rating && (
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`h-4 w-4 ${i < Math.floor(doctor.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
              ))}
              <span className="ml-1 font-semibold">{doctor.rating}</span>
              <span className="ml-1 text-gray-600">({doctor.reviewCount || 0})</span>
            </div>
          </div>
        )}

        <div className="flex items-center text-gray-600 mb-2">
          <MapPin className="h-4 w-4 mr-2" />
          <span className="text-sm font-medium truncate">{city}</span>
        </div>

        {doctor.clinicName && (
          <div className="flex items-center text-gray-600 mb-3">
            <Building2 className="h-4 w-4 mr-2" />
            <span className="text-sm truncate">{doctor.clinicName}</span>
          </div>
        )}

        {doctor.testimonial && (
          <div className="bg-gray-50 rounded-lg p-3 mb-3">
            <p className="text-sm text-gray-700 italic line-clamp-2">"{doctor.testimonial}"</p>
          </div>
        )}

        {availability && (
          <div className="flex items-center text-green-600 mb-3">
            <Clock className="h-4 w-4 mr-2" />
            <span className="text-sm font-medium">Available {availability}</span>
          </div>
        )}

        {price && (
          <div className="text-center mb-4">
            <div className="text-xl font-bold text-[#4d89b1]">{price} MAD</div>
            <div className="text-sm text-gray-600">Consultation</div>
          </div>
        )}

        {badges.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {badges.slice(0, 2).map((badge, i) => (
              <span key={i} className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${badge.color}`}>
                {badge.text}
              </span>
            ))}
          </div>
        )}

        <div className="flex flex-col gap-2">
          <button
            onClick={handleSeeProfile}
            className="w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 font-medium text-sm"
          >
            View Profile
          </button>
          <button
            onClick={handleBookAppointment}
            className="w-full bg-[#4d89b1] text-white py-2 px-4 rounded-lg hover:bg-[#3d6c91] font-medium text-sm flex items-center justify-center"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}