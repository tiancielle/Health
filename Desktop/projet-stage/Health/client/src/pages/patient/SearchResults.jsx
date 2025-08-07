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

        const data = await searchService.searchDoctors(query, location, searchFilters);
        
        setResults(data.doctors || []);
        setTotalResults(data.total || 0);
      } catch (err) {
        console.error('Erreur lors de la recherche:', err);
        setError('Une erreur est survenue lors de la recherche. Veuillez réessayer.');
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
              Search Results
            </h1>
            <p className="text-gray-600">
              {totalResults > 0 ? (
                <>
                  <span className="font-medium">{totalResults.toLocaleString()}</span> doctors found
                  {query && <> for "<span className="font-medium">{query}</span>"</>}
                  {location && <> in <span className="font-medium">{location}</span></>}
                </>
              ) : (
                <>No doctors found for your search</>
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
                <span>Filters</span>
              </button>

              {/* Mode d'affichage */}
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-[#4d89b1] text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-[#4d89b1] text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
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
                <option value="relevance">Most Relevant</option>
                <option value="rating">Highest Rated</option>
                <option value="distance">Nearest</option>
                <option value="availability">Soonest Available</option>
                <option value="name">Name A-Z</option>
              </select>
            </div>
          )}
        </div>

        <div className="flex gap-8">
          {/* Filtres sidebar */}
          <div className={`w-64 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-[#4d89b1] hover:text-[#3d6c91]"
                >
                  Clear all
                </button>
              </div>

              {/* Spécialité */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Specialty
                </label>
                <select
                  value={filters.specialty}
                  onChange={(e) => handleFilterChange('specialty', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4d89b1] focus:border-transparent"
                >
                  <option value="">All specialties</option>
                  <option value="general-practitioner">General Practitioner</option>
                  <option value="cardiologist">Cardiologist</option>
                  <option value="dermatologist">Dermatologist</option>
                  <option value="dentist">Dentist</option>
                  <option value="gynecologist">Gynecologist</option>
                  <option value="ophthalmologist">Ophthalmologist</option>
                </select>
              </div>

              {/* Note minimum */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Rating
                </label>
                <select
                  value={filters.rating}
                  onChange={(e) => handleFilterChange('rating', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4d89b1] focus:border-transparent"
                >
                  <option value="">Any rating</option>
                  <option value="4.5">4.5+ stars</option>
                  <option value="4.0">4.0+ stars</option>
                  <option value="3.5">3.5+ stars</option>
                  <option value="3.0">3.0+ stars</option>
                </select>
              </div>

              {/* Disponibilité */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Availability
                </label>
                <select
                  value={filters.availability}
                  onChange={(e) => handleFilterChange('availability', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4d89b1] focus:border-transparent"
                >
                  <option value="">Any time</option>
                  <option value="today">Available today</option>
                  <option value="tomorrow">Available tomorrow</option>
                  <option value="this-week">Available this week</option>
                  <option value="next-week">Available next week</option>
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
                    <option value="">Any distance</option>
                    <option value="5">Within 5 km</option>
                    <option value="10">Within 10 km</option>
                    <option value="25">Within 25 km</option>
                    <option value="50">Within 50 km</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Résultats */}
          <div className="flex-1">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-700">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-2 text-red-600 hover:text-red-800 font-medium"
                >
                  Try again
                </button>
              </div>
            )}

            {results.length === 0 && !loading && !error && (
              <div className="text-center py-16">
                <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No doctors found</h3>
                <p className="text-gray-600 mb-8">
                  Try adjusting your search criteria or location
                </p>
                <button
                  onClick={clearFilters}
                  className="bg-[#4d89b1] text-white px-6 py-3 rounded-lg hover:bg-[#3d6c91] transition"
                >
                  Clear all filters
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
                      onBookAppointment={() => handleBookAppointment(doctor)}
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