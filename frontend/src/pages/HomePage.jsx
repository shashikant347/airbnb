import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../api/axios';
import SearchBar from '../components/SearchBar';
import PropertyCard from '../components/PropertyCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { FiFilter, FiChevronDown, FiX } from 'react-icons/fi';

const categories = [
  { label: 'All', icon: '🏠' },
  { label: 'Beach', icon: '🏖️' },
  { label: 'Mountain', icon: '⛰️' },
  { label: 'City', icon: '🏙️' },
  { label: 'Countryside', icon: '🌿' },
  { label: 'Lake', icon: '🏞️' },
  { label: 'Tropical', icon: '🌴' },
  { label: 'Arctic', icon: '❄️' },
  { label: 'Desert', icon: '🏜️' },
  { label: 'Island', icon: '🏝️' },
];

const HomePage = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ minPrice: '', maxPrice: '', bedrooms: '', rating: '' });
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchParams] = useSearchParams();

  const fetchProperties = async (page = 1) => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 12,
        sort: sortBy,
        search: searchParams.get('search') || '',
        guests: searchParams.get('guests') || '',
        ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v)),
      };
      const { data } = await API.get('/properties', { params });
      setProperties(data.properties);
      setTotalPages(data.totalPages);
      setCurrentPage(data.currentPage);
    } catch (err) {
      console.error('Failed to fetch properties:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProperties(1);
  }, [searchParams, sortBy, filters]);

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 leading-tight">
            Find Your Perfect<br />
            <span className="text-primary-100">Getaway</span>
          </h1>
          <p className="text-primary-100 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
            Discover unique homes, experiences, and places around the world
          </p>
          <SearchBar />
        </div>
      </section>

      {/* Categories */}
      <section className="border-b border-dark-100 sticky top-16 md:top-20 z-30 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6 py-4 overflow-x-auto scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.label}
                onClick={() => setActiveCategory(cat.label)}
                className={`flex flex-col items-center gap-1 min-w-fit px-3 py-2 rounded-xl transition-all duration-200 ${
                  activeCategory === cat.label
                    ? 'bg-dark-800 text-white shadow-md'
                    : 'text-dark-500 hover:text-dark-800 hover:bg-dark-50'
                }`}
              >
                <span className="text-xl">{cat.icon}</span>
                <span className="text-xs font-medium whitespace-nowrap">{cat.label}</span>
              </button>
            ))}

            {/* Filter & Sort */}
            <div className="flex items-center gap-2 ml-auto">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 border border-dark-300 rounded-xl text-sm font-medium hover:bg-dark-50 transition"
              >
                <FiFilter size={16} /> Filters
              </button>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-dark-300 rounded-xl text-sm font-medium bg-white hover:bg-dark-50 transition cursor-pointer outline-none"
              >
                <option value="newest">Newest</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white border-b border-dark-200 animate-slide-up">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-dark-800">Filters</h3>
              <button onClick={() => setShowFilters(false)} className="p-1 hover:bg-dark-100 rounded-full transition">
                <FiX size={20} />
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-medium text-dark-500 mb-1">Min Price</label>
                <input
                  type="number"
                  placeholder="$0"
                  value={filters.minPrice}
                  onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                  className="input-field text-sm py-2"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-dark-500 mb-1">Max Price</label>
                <input
                  type="number"
                  placeholder="$1000+"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                  className="input-field text-sm py-2"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-dark-500 mb-1">Bedrooms</label>
                <select
                  value={filters.bedrooms}
                  onChange={(e) => setFilters({ ...filters, bedrooms: e.target.value })}
                  className="input-field text-sm py-2"
                >
                  <option value="">Any</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-dark-500 mb-1">Min Rating</label>
                <select
                  value={filters.rating}
                  onChange={(e) => setFilters({ ...filters, rating: e.target.value })}
                  className="input-field text-sm py-2"
                >
                  <option value="">Any</option>
                  <option value="3">3+ Stars</option>
                  <option value="4">4+ Stars</option>
                  <option value="4.5">4.5+ Stars</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Properties Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <LoadingSpinner />
        ) : properties.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-6xl mb-4">🏠</p>
            <h3 className="text-xl font-semibold text-dark-700 mb-2">No properties found</h3>
            <p className="text-dark-400">Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {properties.map((property) => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => fetchProperties(page)}
                    className={`w-10 h-10 rounded-full font-medium transition-all ${
                      currentPage === page
                        ? 'bg-dark-800 text-white'
                        : 'bg-dark-50 text-dark-600 hover:bg-dark-100'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default HomePage;
