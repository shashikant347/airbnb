import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMenu, FiX, FiUser, FiHeart, FiCalendar, FiHome, FiLogOut, FiPlusCircle, FiGrid } from 'react-icons/fi';
import { FaAirbnb } from 'react-icons/fa';

const Navbar = () => {
  const { user, isAuthenticated, isHost, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-navbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <FaAirbnb className="text-primary-500 text-3xl md:text-4xl transition-transform group-hover:scale-110" />
            <span className="hidden sm:block text-xl font-bold text-primary-500">airbnb</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-2">
            {isHost && (
              <Link to="/host/dashboard" className="btn-ghost text-sm">
                Host Dashboard
              </Link>
            )}
            {!isAuthenticated && (
              <Link to="/host/dashboard" className="btn-ghost text-sm font-semibold">
                Airbnb your home
              </Link>
            )}
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-3">
            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-full hover:bg-dark-100 transition"
            >
              {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>

            {/* Desktop User Button */}
            <div ref={menuRef} className="relative hidden md:block">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-3 border border-dark-300 rounded-full py-2 px-4 hover:shadow-md transition-all duration-200"
                id="user-menu-btn"
              >
                <FiMenu size={16} />
                <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                  {user ? user.name[0].toUpperCase() : <FiUser size={16} />}
                </div>
              </button>

              {/* Dropdown */}
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-dark-100 py-2 animate-scale-in">
                  {isAuthenticated ? (
                    <>
                      <div className="px-4 py-3 border-b border-dark-100">
                        <p className="font-semibold text-dark-800">{user.name}</p>
                        <p className="text-sm text-dark-400">{user.email}</p>
                      </div>
                      <Link to="/profile" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 hover:bg-dark-50 transition text-dark-700">
                        <FiUser size={18} /> Profile
                      </Link>
                      <Link to="/my-bookings" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 hover:bg-dark-50 transition text-dark-700">
                        <FiCalendar size={18} /> My Bookings
                      </Link>
                      <Link to="/wishlist" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 hover:bg-dark-50 transition text-dark-700">
                        <FiHeart size={18} /> Wishlist
                      </Link>
                      {isHost && (
                        <>
                          <div className="border-t border-dark-100 my-1" />
                          <Link to="/host/dashboard" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 hover:bg-dark-50 transition text-dark-700">
                            <FiGrid size={18} /> Host Dashboard
                          </Link>
                          <Link to="/host/add-property" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 hover:bg-dark-50 transition text-dark-700">
                            <FiPlusCircle size={18} /> Add Property
                          </Link>
                          <Link to="/host/listings" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 hover:bg-dark-50 transition text-dark-700">
                            <FiHome size={18} /> Manage Listings
                          </Link>
                        </>
                      )}
                      <div className="border-t border-dark-100 my-1" />
                      <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 hover:bg-dark-50 transition text-dark-700">
                        <FiLogOut size={18} /> Log out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link to="/login" onClick={() => setMenuOpen(false)} className="block px-4 py-3 font-semibold hover:bg-dark-50 transition text-dark-800">
                        Log in
                      </Link>
                      <Link to="/register" onClick={() => setMenuOpen(false)} className="block px-4 py-3 hover:bg-dark-50 transition text-dark-700">
                        Sign up
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-dark-100 bg-white animate-slide-up">
          <div className="px-4 py-4 space-y-1">
            {isAuthenticated ? (
              <>
                <div className="pb-3 mb-3 border-b border-dark-100">
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-sm text-dark-400">{user.email}</p>
                </div>
                <Link to="/profile" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 py-2 text-dark-700"><FiUser size={18} /> Profile</Link>
                <Link to="/my-bookings" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 py-2 text-dark-700"><FiCalendar size={18} /> My Bookings</Link>
                <Link to="/wishlist" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 py-2 text-dark-700"><FiHeart size={18} /> Wishlist</Link>
                {isHost && (
                  <>
                    <div className="border-t border-dark-100 my-2" />
                    <Link to="/host/dashboard" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 py-2 text-dark-700"><FiGrid size={18} /> Host Dashboard</Link>
                    <Link to="/host/add-property" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 py-2 text-dark-700"><FiPlusCircle size={18} /> Add Property</Link>
                    <Link to="/host/listings" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 py-2 text-dark-700"><FiHome size={18} /> Manage Listings</Link>
                  </>
                )}
                <div className="border-t border-dark-100 my-2" />
                <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="flex items-center gap-3 py-2 text-dark-700 w-full"><FiLogOut size={18} /> Log out</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)} className="block py-2 font-semibold text-dark-800">Log in</Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="block py-2 text-dark-700">Sign up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
