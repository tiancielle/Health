// client/src/pages/patient/DoctorProfile.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Star, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Calendar, 
  Award,
  Users,
  Building2,
  Globe,
  ChevronLeft,
  Heart,
  MessageCircle,
  Navigation,
  Shield,
  CheckCircle
} from 'lucide-react';
import Header from '../../components/layout/Header';
import Loading from '../../components/ui/Loading';
import doctorService from '../../services/doctorService';

export default function DoctorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('info');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);

  useEffect(() => {
    const loadDoctor = async () => {
      try {
        setLoading(true);
        const data = await doctorService.getDoctorById(id);
        setDoctor(data);
      } catch (err) {
        setError('Médecin non trouvé');
        console.error('Erreur lors du chargement du médecin:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadDoctor();
    }
  }, [id]);

  const handleBookAppointment = () => {
    navigate(`/book-appointment/${doctor.id}`);
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loading size="large" />
        </div>
      </div>
    );
  }

  if (error || !doctor) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {error || 'Médecin non trouvé'}
            </h2>
            <button
              onClick={() => navigate('/search')}
              className="bg-[#4d89b1] text-white px-6 py-3 rounded-lg hover:bg-[#3d6c91]"
            >
              Retour à la recherche
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Bouton retour */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ChevronLeft className="h-5 w-5 mr-1" />
          Retour aux résultats
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne de gauche - Carte interactive (30-35%) */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Localisation
              </h3>
              
              {/* Mini-carte (placeholder) */}
              <div className="w-full h-64 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <MapPin className="h-12 w-12 mx-auto mb-2" />
                  <p>Carte interactive</p>
                  <p className="text-sm">{doctor.address}</p>
                </div>
              </div>

              {/* Adresse */}
              {doctor.clinics && doctor.clinics.map((clinic, index) => (
                <div key={index} className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{clinic.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">{clinic.address}</p>
                      {clinic.phone && (
                        <p className="text-sm text-gray-600 flex items-center mt-2">
                          <Phone className="h-4 w-4 mr-1" />
                          {clinic.phone}
                        </p>
                      )}
                    </div>
                  </div>
                  <button className="mt-3 w-full bg-blue-600 text-white py-2 px-4 rounded-lg text-sm hover:bg-blue-700 flex items-center justify-center">
                    <Navigation className="h-4 w-4 mr-2" />
                    Itinéraire
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Colonne de droite - Détails du médecin (65-70%) */}
          <div className="lg:col-span-2">
            {/* En-tête du profil */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Photo du médecin */}
                <div className="flex-shrink-0">
                  <div className="w-32 h-32 rounded-full bg-gray-200 overflow-hidden">
                    {doctor.profileImage ? (
                      <img
                        src={doctor.profileImage}
                        alt={`Dr. ${doctor.firstName} ${doctor.lastName}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#4d89b1] text-white text-4xl font-bold">
                        {doctor.firstName?.charAt(0)}{doctor.lastName?.charAt(0)}
                      </div>
                    )}
                  </div>
                </div>

                {/* Informations principales */}
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                    <div className="flex-1">
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Dr. {doctor.firstName} {doctor.lastName}
                      </h1>
                      
                      <p className="text-xl text-gray-600 mb-3">
                        {formatSpecialty(doctor.specialty)}
                      </p>

                      {/* Note et avis */}
                      <div className="flex items-center gap-4 mb-4">
                        {doctor.rating && (
                          <div className="flex items-center">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-5 w-5 ${
                                    i < Math.floor(doctor.rating)
                                      ? 'text-yellow-400 fill-current'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="ml-2 text-lg font-medium text-gray-900">
                              {doctor.rating}
                            </span>
                            <span className="text-gray-600 ml-1">
                              ({doctor.reviewCount || 0} avis)
                            </span>
                          </div>
                        )}
                        
                        {doctor.recommendationCount && (
                          <div className="flex items-center text-gray-600">
                            <Award className="h-5 w-5 mr-1" />
                            <span>{doctor.recommendationCount} recommandations</span>
                          </div>
                        )}
                      </div>

                      {/* Badges */}
                      <div className="flex flex-wrap gap-2">
                        {doctor.acceptsNewPatients && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Nouveaux patients acceptés
                          </span>
                        )}
                        {doctor.teleconsultationAvailable && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Téléconsultation
                          </span>
                        )}
                        {doctor.verified && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                            <Shield className="h-3 w-3 mr-1" />
                            Vérifié
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Bouton principal */}
                    <div className="mt-4 md:mt-0 md:ml-6">
                      <button
                        onClick={handleBookAppointment}
                        className="bg-[#4d89b1] text-white px-8 py-3 rounded-lg hover:bg-[#3d6c91] transition-colors font-semibold text-lg"
                      >
                        Prendre rendez-vous
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Onglets */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  {[
                    { id: 'info', label: 'Informations', icon: Building2 },
                    { id: 'schedule', label: 'Disponibilités', icon: Calendar },
                    { id: 'reviews', label: 'Avis', icon: MessageCircle },
                    { id: 'about', label: 'À propos', icon: Users }
                  ].map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                          activeTab === tab.id
                            ? 'border-[#4d89b1] text-[#4d89b1]'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        <Icon className="h-4 w-4 mr-2" />
                        {tab.label}
                      </button>
                    );
                  })}
                </nav>
              </div>

              <div className="p-6">
                {/* Contenu des onglets */}
                {activeTab === 'info' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Informations pratiques
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Contact */}
                        <div className="space-y-3">
                          <h4 className="font-medium text-gray-900">Contact</h4>
                          {doctor.phone && (
                            <div className="flex items-center text-gray-600">
                              <Phone className="h-4 w-4 mr-3" />
                              <span>{doctor.phone}</span>
                            </div>
                          )}
                          {doctor.email && (
                            <div className="flex items-center text-gray-600">
                              <Mail className="h-4 w-4 mr-3" />
                              <span>{doctor.email}</span>
                            </div>
                          )}
                        </div>

                        {/* Prix */}
                        <div className="space-y-3">
                          <h4 className="font-medium text-gray-900">Tarifs</h4>
                          {doctor.consultationPrice && (
                            <div className="text-gray-600">
                              <span className="font-medium">Consultation standard:</span> {doctor.consultationPrice} MAD
                            </div>
                          )}
                          {doctor.teleconsultationPrice && (
                            <div className="text-gray-600">
                              <span className="font-medium">Téléconsultation:</span> {doctor.teleconsultationPrice} MAD
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Langues */}
                    {doctor.languages && doctor.languages.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Langues parlées</h4>
                        <div className="flex flex-wrap gap-2">
                          {doctor.languages.map((language, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800"
                            >
                              <Globe className="h-3 w-3 mr-1" />
                              {language}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'schedule' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Prochaines disponibilités
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Créneaux factices pour la démonstration */}
                      {['Aujourd\'hui', 'Demain', 'Mercredi'].map((day, dayIndex) => (
                        <div key={dayIndex} className="border border-gray-200 rounded-lg p-4">
                          <h4 className="font-medium text-gray-900 mb-3">{day}</h4>
                          <div className="space-y-2">
                            {['09:00', '14:30', '16:00'].map((time, timeIndex) => (
                              <button
                                key={timeIndex}
                                className="w-full text-left px-3 py-2 text-sm border border-gray-200 rounded hover:bg-[#4d89b1] hover:text-white transition-colors"
                              >
                                {time}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Avis des patients
                    </h3>
                    
                    {/* Résumé des notes */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold text-gray-900">{doctor.rating || '4.8'}</div>
                          <div className="text-sm text-gray-600">Note moyenne</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-gray-900">4.7</div>
                          <div className="text-sm text-gray-600">Écoute</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-gray-900">4.9</div>
                          <div className="text-sm text-gray-600">Ponctualité</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-gray-900">95%</div>
                          <div className="text-sm text-gray-600">Recommandent</div>
                        </div>
                      </div>
                    </div>

                    {/* Avis individuels */}
                    <div className="space-y-4">
                      {[
                        {
                          rating: 5,
                          text: "Excellente consultation, médecin à l'écoute et très professionnel. Je recommande vivement.",
                          date: "Il y a 2 jours",
                          criteria: { ecoute: 5, ponctualite: 5, ambiance: 4 }
                        },
                        {
                          rating: 4,
                          text: "Très bon médecin, explications claires et prise en charge rapide. Seul bémol : un peu d'attente.",
                          date: "Il y a 1 semaine",
                          criteria: { ecoute: 5, ponctualite: 3, ambiance: 4 }
                        },
                        {
                          rating: 5,
                          text: "Dr. {doctor.lastName} est fantastique ! Très rassurant et compétent. Cabinet moderne et accueillant.",
                          date: "Il y a 2 semaines",
                          criteria: { ecoute: 5, ponctualite: 5, ambiance: 5 }
                        }
                      ].map((review, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center">
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="ml-2 text-sm font-medium text-gray-900">
                                Patient anonyme
                              </span>
                            </div>
                            <span className="text-sm text-gray-600">{review.date}</span>
                          </div>
                          
                          <p className="text-gray-700 text-sm mb-3">
                            {review.text.replace('{doctor.lastName}', doctor.lastName)}
                          </p>

                          {/* Critères détaillés */}
                          <div className="flex flex-wrap gap-4 text-xs text-gray-600">
                            <div className="flex items-center">
                              <span className="mr-1">Écoute:</span>
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-3 w-3 ${
                                      i < review.criteria.ecoute ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <div className="flex items-center">
                              <span className="mr-1">Ponctualité:</span>
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-3 w-3 ${
                                      i < review.criteria.ponctualite ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <div className="flex items-center">
                              <span className="mr-1">Ambiance:</span>
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-3 w-3 ${
                                      i < review.criteria.ambiance ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {/* Bouton voir plus d'avis */}
                      <div className="text-center">
                        <button className="text-[#4d89b1] hover:text-[#3d6c91] font-medium">
                          Voir tous les avis ({doctor.reviewCount || 127})
                        </button>
                      </div>
                    </div>

                    {/* Formulaire pour laisser un avis */}
                    <div className="mt-8 border-t border-gray-200 pt-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">
                        Laisser un avis
                      </h4>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-blue-800 text-sm">
                          <Heart className="h-4 w-4 inline mr-1" />
                          Vous devez avoir eu une consultation confirmée pour laisser un avis.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'about' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        À propos du Dr. {doctor.firstName} {doctor.lastName}
                      </h3>
                      
                      {/* Biographie */}
                      <div className="mb-6">
                        <h4 className="font-medium text-gray-900 mb-3">Présentation</h4>
                        <p className="text-gray-700 leading-relaxed">
                          {doctor.biography || `Le Dr. ${doctor.firstName} ${doctor.lastName} est un ${formatSpecialty(doctor.specialty).toLowerCase()} expérimenté avec plus de 15 ans d'expérience dans le domaine médical. Diplômé de la Faculté de Médecine et de Pharmacie de Casablanca, il s'est spécialisé en ${formatSpecialty(doctor.specialty).toLowerCase()} et exerce avec passion depuis de nombreuses années.`}
                        </p>
                      </div>

                      {/* Formation et parcours */}
                      <div className="mb-6">
                        <h4 className="font-medium text-gray-900 mb-3">Formation et parcours</h4>
                        <div className="space-y-3">
                          {doctor.education && doctor.education.map((edu, index) => (
                            <div key={index} className="flex items-start">
                              <div className="w-2 h-2 bg-[#4d89b1] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                              <div>
                                <div className="font-medium text-gray-900">{edu.degree}</div>
                                <div className="text-gray-600 text-sm">{edu.institution} • {edu.year}</div>
                              </div>
                            </div>
                          )) || (
                            // Données factices si pas d'informations
                            <>
                              <div className="flex items-start">
                                <div className="w-2 h-2 bg-[#4d89b1] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                <div>
                                  <div className="font-medium text-gray-900">Doctorat en Médecine</div>
                                  <div className="text-gray-600 text-sm">Faculté de Médecine de Casablanca • 2008</div>
                                </div>
                              </div>
                              <div className="flex items-start">
                                <div className="w-2 h-2 bg-[#4d89b1] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                <div>
                                  <div className="font-medium text-gray-900">Spécialisation en {formatSpecialty(doctor.specialty)}</div>
                                  <div className="text-gray-600 text-sm">CHU Ibn Rochd • 2010-2013</div>
                                </div>
                              </div>
                              <div className="flex items-start">
                                <div className="w-2 h-2 bg-[#4d89b1] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                <div>
                                  <div className="font-medium text-gray-900">Formation continue</div>
                                  <div className="text-gray-600 text-sm">Université Mohammed V • En cours</div>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Affiliations */}
                      <div className="mb-6">
                        <h4 className="font-medium text-gray-900 mb-3">Affiliations professionnelles</h4>
                        <div className="space-y-2">
                          {doctor.affiliations && doctor.affiliations.map((affiliation, index) => (
                            <div key={index} className="flex items-center text-gray-700">
                              <Building2 className="h-4 w-4 mr-2 text-gray-500" />
                              {affiliation}
                            </div>
                          )) || (
                            <>
                              <div className="flex items-center text-gray-700">
                                <Building2 className="h-4 w-4 mr-2 text-gray-500" />
                                Ordre National des Médecins du Maroc
                              </div>
                              <div className="flex items-center text-gray-700">
                                <Building2 className="h-4 w-4 mr-2 text-gray-500" />
                                Association Marocaine de {formatSpecialty(doctor.specialty)}
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Expérience */}
                      {doctor.experience && (
                        <div className="mb-6">
                          <h4 className="font-medium text-gray-900 mb-3">Expérience</h4>
                          <div className="space-y-3">
                            {doctor.experience.map((exp, index) => (
                              <div key={index} className="border-l-2 border-gray-200 pl-4">
                                <div className="font-medium text-gray-900">{exp.position}</div>
                                <div className="text-gray-600">{exp.institution}</div>
                                <div className="text-sm text-gray-500">{exp.duration}</div>
                                {exp.description && (
                                  <p className="text-sm text-gray-700 mt-1">{exp.description}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Domaines de spécialisation */}
                      {doctor.specializations && doctor.specializations.length > 0 && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-3">Domaines d'expertise</h4>
                          <div className="flex flex-wrap gap-2">
                            {doctor.specializations.map((specialization, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                              >
                                {specialization}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}