// client/src/pages/patient/SearchResults.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, MapPin, Star, Clock, Calendar, Filter, Grid, List, ChevronDown } from 'lucide-react';
import Header from '../../components/layout/Header';
import SearchForm from '../../components/forms/searchForm';
import DoctorCard from '../../components/common/DoctorCard';
import Loading from '../../components/ui/Loading';
import Pagination from '../../components/ui/Pagination';
import { searchDoctors } from '../../services/searchService';

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' ou 'list'
  
  // Filtres
  const [filters, setFilters] = useState({
    specialty: '',
    rating: '',
    availability: '',
    distance: '',
    sortBy: 'relevance'
  });
  const [showFilters, setShowFilters] = useState(false);

  // Paramètres de recherche
  const query = searchParams.get('q') || '';
  const location = searchParams.get('location') || '';

  // Charger les résultats
  useEffect(() => {
    const loadResults = async () => {
      if (!query.trim()) {
        navigate('/');
        return;
      }

      setLoading(true);
      setError('');

      try {
        const searchFilters = {
          ...filters,
          page: currentPage,
          limit: 12
        };

        // CORRECTION: utiliser searchDoctors directement au lieu de searchService.searchDoctors
        const data = await searchDoctors(query, location, searchFilters);
        
        setResults(data.doctors || []);
        setTotalResults(data.total || 0);
      } catch (err) {
        console.error('Erreur lors de la recherche:', err);
        setError('Une erreur est survenue lors de la recherche. Veuillez réessayer.');
        
        // Pour le développement, ajoutons des données de test si le service ne fonctionne pas
        if (process.env.NODE_ENV === 'development') {
          console.log('Mode développement: ajout de données de test');
          setResults([
            {
              id: '1',
              firstName: 'Ahmed',
              lastName: 'Benali',
              specialty: 'general-practitioner',
              rating: 4.5,
              reviewCount: 45,
              address: '123 Avenue Mohammed V, Casablanca',
              phone: '+212 522 123 456',
              profileImage: null,
              nextAvailableSlot: 'aujourd\'hui',
              description: 'Médecin généraliste avec plus de 10 ans d\'expérience.',
              distance: 2.3,
              recommendationCount: 23
            },
            {
              id: '2',
              firstName: 'Fatima',
              lastName: 'Zahra',
              specialty: 'cardiologist',
              rating: 4.8,
              reviewCount: 72,
              address: '456 Rue des FAR, Rabat',
              phone: '+212 537 456 789',
              profileImage: null,
              nextAvailableSlot: 'demain',
              description: 'Cardiologue spécialisée dans les maladies cardiovasculaires.',
              distance: 5.1,
              recommendationCount: 35
            },
            {
              id: '3',
              firstName: 'Youssef',
              lastName: 'Alami',
              specialty: 'dentist',
              rating: 4.3,
              reviewCount: 28,
              address: '789 Boulevard Zerktouni, Casablanca',
              phone: '+212 522 987 654',
              profileImage: null,
              nextAvailableSlot: 'mercredi',
              description: 'Dentiste moderne avec équipements de pointe.',
              distance: 1.8,
              recommendationCount: 15
            }
          ]);
          setTotalResults(3);
          setError(''); // Effacer l'erreur pour les données de test
        }
      } finally {
        setLoading(false);
      }
    };

    loadResults();
  }, [query, location, currentPage, filters, navigate]);

  const handleNewSearch = (newQuery, newLocation) => {
    const params = new URLSearchParams();
    params.append('q', newQuery);
    if (newLocation) params.append('location', newLocation);
    
    navigate(`/search?${params.toString()}`);
    setCurrentPage(1);
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      specialty: '',
      rating: '',
      availability: '',
      distance: '',
      sortBy: 'relevance'
    });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBookAppointment = (doctor) => {
    navigate(`/book-appointment/${doctor.id}`);
  };

  if (loading && currentPage === 1) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loading size="large" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Barre de recherche en haut */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <SearchForm onSearch={handleNewSearch} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* En-tête des résultats */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Résultats de recherche
            </h1>
            <p className="text-gray-600">
              {totalResults > 0 ? (
                <>
                  <span className="font-medium">{totalResults.toLocaleString()}</span> médecins trouvés
                  {query && <> pour "<span className="font-medium">{query}</span>"</>}
                  {location && <> à <span className="font-medium">{location}</span></>}
                </>
              ) : (
                <>Aucun médecin trouvé pour votre recherche</>
              )}
            </p>
          </div>

          {/* Contrôles de vue et tri */}
          {results.length > 0 && (
            <div className="flex items-center space-x-4 mt-4 lg:mt-0">
              {/* Bouton filtres mobile */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Filter className="h-4 w-4" />
                <span>Filtres</span>
              </button>

              {/* Mode d'affichage */}
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-[#4d89b1] text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                  title="Vue grille"
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-[#4d89b1] text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                  title="Vue liste"
                >
                  <List className="h-4 w-4" />
                </button>
              </div>

              {/* Tri */}
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4d89b1] focus:border-transparent"
              >
                <option value="relevance">Plus pertinents</option>
                <option value="rating">Mieux notés</option>
                <option value="distance">Plus proches</option>
                <option value="availability">Plus tôt disponibles</option>
                <option value="name">Nom A-Z</option>
              </select>
            </div>
          )}
        </div>

        <div className="flex gap-8">
          {/* Filtres sidebar */}
          <div className={`w-64 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Filtres</h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-[#4d89b1] hover:text-[#3d6c91]"
                >
                  Effacer tout
                </button>
              </div>

              {/* Spécialité */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Spécialité
                </label>
                <select
                  value={filters.specialty}
                  onChange={(e) => handleFilterChange('specialty', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4d89b1] focus:border-transparent"
                >
                  <option value="">Toutes les spécialités</option>
                  <option value="general-practitioner">Médecin généraliste</option>
                  <option value="cardiologist">Cardiologue</option>
                  <option value="dermatologist">Dermatologue</option>
                  <option value="dentist">Dentiste</option>
                  <option value="gynecologist">Gynécologue</option>
                  <option value="ophthalmologist">Ophtalmologue</option>
                </select>
              </div>

              {/* Note minimum */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Note minimum
                </label>
                <select
                  value={filters.rating}
                  onChange={(e) => handleFilterChange('rating', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4d89b1] focus:border-transparent"
                >
                  <option value="">Toutes les notes</option>
                  <option value="4.5">4.5+ étoiles</option>
                  <option value="4.0">4.0+ étoiles</option>
                  <option value="3.5">3.5+ étoiles</option>
                  <option value="3.0">3.0+ étoiles</option>
                </select>
              </div>

              {/* Disponibilité */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Disponibilité
                </label>
                <select
                  value={filters.availability}
                  onChange={(e) => handleFilterChange('availability', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4d89b1] focus:border-transparent"
                >
                  <option value="">À tout moment</option>
                  <option value="today">Disponible aujourd'hui</option>
                  <option value="tomorrow">Disponible demain</option>
                  <option value="this-week">Disponible cette semaine</option>
                  <option value="next-week">Disponible la semaine prochaine</option>
                </select>
              </div>

              {/* Distance */}
              {location && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Distance
                  </label>
                  <select
                    value={filters.distance}
                    onChange={(e) => handleFilterChange('distance', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4d89b1] focus:border-transparent"
                  >
                    <option value="">Toute distance</option>
                    <option value="5">Dans un rayon de 5 km</option>
                    <option value="10">Dans un rayon de 10 km</option>
                    <option value="25">Dans un rayon de 25 km</option>
                    <option value="50">Dans un rayon de 50 km</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Résultats */}
          <div className="flex-1">
            {error && process.env.NODE_ENV !== 'development' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-700">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-2 text-red-600 hover:text-red-800 font-medium"
                >
                  Réessayer
                </button>
              </div>
            )}

            {results.length === 0 && !loading && !error && (
              <div className="text-center py-16">
                <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun médecin trouvé</h3>
                <p className="text-gray-600 mb-8">
                  Essayez d'ajuster vos critères de recherche ou votre localisation
                </p>
                <button
                  onClick={clearFilters}
                  className="bg-[#4d89b1] text-white px-6 py-3 rounded-lg hover:bg-[#3d6c91] transition"
                >
                  Effacer tous les filtres
                </button>
              </div>
            )}

            {results.length > 0 && (
              <>
                {/* Grille des résultats */}
                <div className={`grid gap-6 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
                    : 'grid-cols-1'
                }`}>
                  {results.map((doctor) => (
                    <DoctorCard
                      key={doctor.id}
                      doctor={doctor}
                      viewMode={viewMode}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalResults > 12 && (
                  <div className="mt-12">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={Math.ceil(totalResults / 12)}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </>
            )}

            {loading && currentPage > 1 && (
              <div className="flex justify-center mt-8">
                <Loading />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}