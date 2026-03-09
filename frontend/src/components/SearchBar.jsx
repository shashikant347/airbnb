import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiMapPin, FiUsers, FiCalendar } from 'react-icons/fi';

const SearchBar = () => {
  const [search, setSearch] = useState('');
  const [guests, setGuests] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (guests) params.set('guests', guests);
    navigate(`/?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="w-full max-w-3xl mx-auto">
      <div className="flex flex-col md:flex-row items-center bg-white rounded-full shadow-card hover:shadow-card-hover transition-all duration-300 border border-dark-200">
        {/* Location */}
        <div className="flex-1 flex items-center gap-3 px-6 py-4 border-b md:border-b-0 md:border-r border-dark-200 w-full md:w-auto">
          <FiMapPin className="text-primary-500 text-lg flex-shrink-0" />
          <div className="w-full">
            <label className="block text-xs font-semibold text-dark-800">Where</label>
            <input
              type="text"
              placeholder="Search destinations"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-sm text-dark-600 placeholder-dark-400 outline-none bg-transparent"
              id="search-location"
            />
          </div>
        </div>

        {/* Guests */}
        <div className="flex items-center gap-3 px-6 py-4 w-full md:w-auto">
          <FiUsers className="text-primary-500 text-lg flex-shrink-0" />
          <div className="w-full">
            <label className="block text-xs font-semibold text-dark-800">Guests</label>
            <input
              type="number"
              placeholder="Add guests"
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              min="1"
              max="20"
              className="w-full text-sm text-dark-600 placeholder-dark-400 outline-none bg-transparent"
              id="search-guests"
            />
          </div>
        </div>

        {/* Search Button */}
        <div className="px-3 py-2 w-full md:w-auto flex justify-center">
          <button
            type="submit"
            className="bg-gradient-to-r from-primary-500 to-primary-600 text-white p-3 md:p-4 rounded-full hover:from-primary-600 hover:to-primary-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
            id="search-btn"
          >
            <FiSearch size={20} />
          </button>
        </div>
      </div>
    </form>
  );
};

export default SearchBar;
