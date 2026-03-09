import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { FiHome, FiCalendar, FiDollarSign, FiStar, FiPlusCircle, FiTrendingUp } from 'react-icons/fi';

const HostDashboard = () => {
  const [stats, setStats] = useState({ listings: 0, bookings: 0, revenue: 0 });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const [listingsRes, bookingsRes] = await Promise.all([
        API.get('/properties/my-listings'),
        API.get('/bookings/host'),
      ]);

      const listings = listingsRes.data.properties;
      const bookings = bookingsRes.data.bookings;
      const revenue = bookings
        .filter((b) => b.status === 'confirmed')
        .reduce((sum, b) => sum + b.totalPrice, 0);

      setStats({
        listings: listings.length,
        bookings: bookings.length,
        revenue,
      });
      setRecentBookings(bookings.slice(0, 5));
    } catch (err) {
      toast.error('Failed to load dashboard');
    }
    setLoading(false);
  };

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <h1 className="section-title">Host Dashboard</h1>
        <Link to="/host/add-property" className="btn-primary flex items-center gap-2 text-sm">
          <FiPlusCircle size={18} /> Add Property
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="card p-6 border border-dark-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <FiHome className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-dark-400 text-sm">Total Listings</p>
              <p className="text-3xl font-bold text-dark-900">{stats.listings}</p>
            </div>
          </div>
        </div>
        <div className="card p-6 border border-dark-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <FiCalendar className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-dark-400 text-sm">Total Bookings</p>
              <p className="text-3xl font-bold text-dark-900">{stats.bookings}</p>
            </div>
          </div>
        </div>
        <div className="card p-6 border border-dark-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
              <FiDollarSign className="text-primary-600" size={24} />
            </div>
            <div>
              <p className="text-dark-400 text-sm">Total Revenue</p>
              <p className="text-3xl font-bold text-dark-900">${stats.revenue.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <Link to="/host/add-property" className="card p-4 border border-dark-100 text-center hover:border-primary-300 transition group">
          <FiPlusCircle className="mx-auto text-2xl text-primary-500 mb-2 group-hover:scale-110 transition-transform" />
          <span className="text-sm font-medium text-dark-700">Add Property</span>
        </Link>
        <Link to="/host/listings" className="card p-4 border border-dark-100 text-center hover:border-primary-300 transition group">
          <FiHome className="mx-auto text-2xl text-blue-500 mb-2 group-hover:scale-110 transition-transform" />
          <span className="text-sm font-medium text-dark-700">My Listings</span>
        </Link>
        <Link to="/host/bookings" className="card p-4 border border-dark-100 text-center hover:border-primary-300 transition group">
          <FiCalendar className="mx-auto text-2xl text-green-500 mb-2 group-hover:scale-110 transition-transform" />
          <span className="text-sm font-medium text-dark-700">Bookings</span>
        </Link>
        <Link to="/profile" className="card p-4 border border-dark-100 text-center hover:border-primary-300 transition group">
          <FiTrendingUp className="mx-auto text-2xl text-purple-500 mb-2 group-hover:scale-110 transition-transform" />
          <span className="text-sm font-medium text-dark-700">Profile</span>
        </Link>
      </div>

      {/* Recent Bookings */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-dark-800">Recent Bookings</h2>
          <Link to="/host/bookings" className="text-primary-500 text-sm font-medium hover:text-primary-600 transition">View All →</Link>
        </div>
        {recentBookings.length === 0 ? (
          <p className="text-dark-400 py-8 text-center">No bookings yet. List your first property!</p>
        ) : (
          <div className="card border border-dark-100 overflow-hidden">
            <table className="w-full">
              <thead className="bg-dark-50">
                <tr>
                  <th className="text-left text-xs font-semibold text-dark-500 px-4 py-3 uppercase">Property</th>
                  <th className="text-left text-xs font-semibold text-dark-500 px-4 py-3 uppercase hidden md:table-cell">Guest</th>
                  <th className="text-left text-xs font-semibold text-dark-500 px-4 py-3 uppercase">Dates</th>
                  <th className="text-right text-xs font-semibold text-dark-500 px-4 py-3 uppercase">Amount</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((booking) => (
                  <tr key={booking._id} className="border-t border-dark-100 hover:bg-dark-50 transition">
                    <td className="px-4 py-3 text-sm text-dark-700 font-medium">{booking.property?.title?.substring(0, 30)}...</td>
                    <td className="px-4 py-3 text-sm text-dark-500 hidden md:table-cell">{booking.user?.name}</td>
                    <td className="px-4 py-3 text-sm text-dark-500">{formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}</td>
                    <td className="px-4 py-3 text-sm text-dark-800 font-semibold text-right">${booking.totalPrice}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default HostDashboard;
