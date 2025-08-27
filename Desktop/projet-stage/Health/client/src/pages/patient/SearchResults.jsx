// client/src/pages/patient/SearchResults.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, MapPin, Star, Clock, Calendar, Filter, Grid, List } from 'lucide-react';
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
  const [viewMode, setViewMode] = useState('grid');

  const [filters, setFilters] = useState({
    specialty: '',
    rating: '',
    availability: '',
    distance: '',
    sortBy: 'relevance'
  });

  const query = searchParams.get('q') || '';
  const location = searchParams.get('location') || '';

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

        const data = await searchDoctors(query, location, searchFilters);
        setResults(data.doctors || []);
        setTotalResults(data.total || 0);
      } catch (err) {
        console.error('Search error:', err);
        setError('Failed to load doctors. Please try again.');

        // ✅ DONNÉES DE TEST EN ANGLAIS + MAD
        if (process.env.NODE_ENV === 'development') {
          setResults([
            {
              id: '1',
              firstName: 'Ahmed',
              lastName: 'Benali',
              specialty: 'general-practitioner',
              rating: 4.5,
              reviewCount: 45,
              city: 'Casablanca',
              clinicName: 'Central Clinic',
              address: '123 Avenue Mohammed V, Casablanca',
              profileImage: null,
              nextAvailableSlot: 'today',
              testimonial: 'Very professional and kind doctor.',
              consultationPrice: 300,
              hasTelemedicine: true,
              gender: 'male',
              acceptsNewPatients: true
            },
            {
              id: '2',
              firstName: 'Fatima',
              lastName: 'Zahra',
              specialty: 'cardiologist',
              rating: 4.8,
              reviewCount: 72,
              city: 'Rabat',
              clinicName: 'Heart Care Center',
              address: '456 Rue des FAR, Rabat',
              profileImage: null,
              nextAvailableSlot: 'tomorrow',
              testimonial: 'Excellent specialist, very attentive.',
              consultationPrice: 450,
              hasTelemedicine: false,
              gender: 'female',
              acceptsNewPatients: true
            }
          ]);
          setTotalResults(2);
          setError('');
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
    setFilters(prev => ({ ...prev, [filterName]: value }));
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
      
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <SearchForm onSearch={handleNewSearch} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Search Results</h1>
            <p className="text-gray-600">
              {totalResults > 0 ? (
                <>
                  <span className="font-medium">{totalResults}</span> doctors found
                  {query && <> for "<span className="font-medium">{query}</span>"</>}
                  {location && <> in <span className="font-medium">{location}</span></>}
                </>
              ) : (
                <>No doctors found for your search</>
              )}
            </p>
          </div>

          {results.length > 0 && (
            <div className="flex items-center space-x-4 mt-4 lg:mt-0">
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

              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4d89b1]"
              >
                <option value="relevance">Most Relevant</option>
                <option value="rating">Top Rated</option>
                <option value="distance">Closest</option>
                <option value="availability">Earliest Available</option>
                <option value="name">Name A-Z</option>
              </select>
            </div>
          )}
        </div>

        <div className="flex gap-8">
          <div className="w-64 flex-shrink-0 hidden lg:block">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                <button onClick={clearFilters} className="text-sm text-[#4d89b1]">Clear all</button>
              </div>
              {/* Filtres ici (tu peux les garder) */}
            </div>
          </div>

          <div className="flex-1">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {results.length === 0 && !loading && (
              <div className="text-center py-16">
                <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No doctors found</h3>
                <p className="text-gray-600 mb-8">Try adjusting your search criteria</p>
                <button
                  onClick={clearFilters}
                  className="bg-[#4d89b1] text-white px-6 py-3 rounded-lg hover:bg-[#3d6c91]"
                >
                  Clear Filters
                </button>
              </div>
            )}

            {results.length > 0 && (
              <>
                <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
                  {results.map((doctor) => (
                    <DoctorCard
                      key={doctor.id}
                      doctor={doctor}
                      viewMode={viewMode}
                    />
                  ))}
                </div>

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
          </div>
        </div>
      </div>
    </div>
  );
}