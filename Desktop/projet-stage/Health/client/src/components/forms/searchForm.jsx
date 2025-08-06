// client/src/components/forms/SearchForm.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, X, Clock } from 'lucide-react';
import { searchDoctors } from '../../services/searchService'; // ← Service API

export default function SearchForm({ onSearch, className = '' }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const searchInputRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Charger les recherches récentes au montage
  useEffect(() => {
    const recent = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    setRecentSearches(recent.slice(0, 5));
  }, []);

  // Générer des suggestions (basées sur spécialités ou historique)
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.length >= 2) {
        const mockSuggestions = [
          { text: 'Cardiologist', type: 'specialty' },
          { text: 'General Practitioner', type: 'specialty' },
          { text: 'Dermatologist', type: 'specialty' },
          { text: 'Dentist', type: 'specialty' },
          { text: 'Gynecologist', type: 'specialty' },
          { text: 'Ophthalmologist', type: 'specialty' },
          { text: 'Pediatrician', type: 'specialty' },
          { text: 'Neurologist', type: 'specialty' }
        ].filter(item =>
          item.text.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSuggestions(mockSuggestions);
      } else {
        setSuggestions([]);
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Fermer les suggestions au clic extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target) &&
        !searchInputRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 🔍 Recherche principale → Appel API + gestion des résultats
  const handleSearch = async (query = searchQuery, loc = location) => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const finalQuery = query.trim();
      const finalLocation = loc.trim();

      // Sauvegarder dans l'historique
      const searchItem = {
        query: finalQuery,
        location: finalLocation,
        timestamp: new Date().toISOString(),
      };
      const recent = JSON.parse(localStorage.getItem('recentSearches') || '[]');
      const updatedRecent = [searchItem, ...recent.filter(item =>
        item.query !== finalQuery || item.location !== finalLocation
      )].slice(0, 10);
      localStorage.setItem('recentSearches', JSON.stringify(updatedRecent));
      setRecentSearches(updatedRecent.slice(0, 5));

      // 🔥 Appel API vers ton backend (PostgreSQL)
      const results = await searchDoctors(finalQuery, finalLocation);

      // ✅ Envoi des résultats structurés au parent (ex: SearchDoctors.jsx)
      if (onSearch) {
        onSearch(results); // ← { doctors: [...], total: 5 }
      }

      setShowSuggestions(false);
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
      // Optionnel : afficher un toast ou message d'erreur
    } finally {
      setLoading(false);
    }
  };

  // Clic sur une suggestion
  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.text);
    setShowSuggestions(false);
    handleSearch(suggestion.text, location);
  };

  // Clic sur une recherche récente
  const handleRecentSearchClick = (recent) => {
    setSearchQuery(recent.query);
    setLocation(recent.location);
    handleSearch(recent.query, recent.location);
  };

  // Vider l'historique
  const clearRecentSearches = () => {
    localStorage.removeItem('recentSearches');
    setRecentSearches([]);
  };

  // Gestion des touches
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
    if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
        <div className="grid md:grid-cols-3 gap-4">
          {/* Champ de recherche */}
          <div className="md:col-span-2 relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What are you looking for?
            </label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                onKeyDown={handleKeyDown}
                placeholder="Doctor, specialty, disorder..."
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4d89b1] focus:border-transparent text-base transition"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSuggestions([]);
                  }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Suggestions ou historique */}
            {showSuggestions && (searchQuery.length >= 2 || recentSearches.length > 0) && (
              <div
                ref={suggestionsRef}
                className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-lg mt-1 z-50 max-h-80 overflow-y-auto"
              >
                {/* Suggestions dynamiques */}
                {suggestions.length > 0 && (
                  <div className="p-2">
                    <div className="text-xs font-medium text-gray-500 px-3 py-2">Suggestions</div>
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg flex items-center space-x-3"
                      >
                        <Search className="h-4 w-4 text-gray-400" />
                        <div>
                          <div className="font-medium text-gray-900">{suggestion.text}</div>
                          <div className="text-xs text-gray-500 capitalize">{suggestion.type}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Recherches récentes */}
                {recentSearches.length > 0 && searchQuery.length < 2 && (
                  <div className="p-2 border-t border-gray-100">
                    <div className="flex items-center justify-between px-3 py-2">
                      <div className="text-xs font-medium text-gray-500">Recent searches</div>
                      <button
                        onClick={clearRecentSearches}
                        className="text-xs text-gray-400 hover:text-gray-600"
                      >
                        Clear
                      </button>
                    </div>
                    {recentSearches.map((recent, index) => (
                      <button
                        key={index}
                        onClick={() => handleRecentSearchClick(recent)}
                        className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg flex items-center space-x-3"
                      >
                        <Clock className="h-4 w-4 text-gray-400" />
                        <div>
                          <div className="font-medium text-gray-900">{recent.query}</div>
                          {recent.location && (
                            <div className="text-xs text-gray-500">{recent.location}</div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Localisation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Where?</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="City, ZIP code"
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4d89b1] focus:border-transparent text-base transition"
              />
            </div>
          </div>
        </div>

        {/* Bouton de recherche */}
        <button
          onClick={handleSearch}
          disabled={loading || !searchQuery.trim()}
          className="w-full mt-6 bg-[#4d89b1] text-white py-3 px-8 rounded-xl text-base font-semibold hover:bg-[#3d6c91] disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Searching...</span>
            </>
          ) : (
            <>
              <Search className="h-4 w-4" />
              <span>Search</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}