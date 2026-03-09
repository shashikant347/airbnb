import { useState, useEffect } from 'react';
import API from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { FiCalendar, FiCheckCircle, FiXCircle, FiClock, FiUser } from 'react-icons/fi';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const HostBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const { data } = await API.get('/bookings/host');
      setBookings(data.bookings);
    } catch (err) {
      toast.error('Failed to load bookings');
    }
    setLoading(false);
  };

  const cancelBooking = async (id) => {
    if (!window.confirm('Cancel this booking?')) return;
    try {
      await API.put(`/bookings/${id}/cancel`);
      toast.success('Booking cancelled');
      fetchBookings();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel');
    }
  };

  const filtered = filter === 'all'
    ? bookings
    : bookings.filter((b) => b.status === filter);

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-fade-in">
      <h1 className="section-title mb-6">Host Bookings</h1>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {['all', 'confirmed', 'pending', 'cancelled'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-all whitespace-nowrap ${
              filter === status
                ? 'bg-dark-800 text-white'
                : 'bg-dark-50 text-dark-600 hover:bg-dark-100'
            }`}
          >
            {status} ({status === 'all' ? bookings.length : bookings.filter((b) => b.status === status).length})
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <FiCalendar className="mx-auto text-4xl text-dark-300 mb-4" />
          <p className="text-dark-500">No {filter !== 'all' ? filter : ''} bookings found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((booking) => (
            <div key={booking._id} className="card p-4 md:p-6 border border-dark-100">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-dark-800">{booking.property?.title || 'Property'}</h3>
                    <span className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusColors[booking.status]}`}>
                      {booking.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-dark-500">
                    <span className="flex items-center gap-1"><FiUser size={14} /> {booking.user?.name || 'Guest'}</span>
                    <span className="flex items-center gap-1"><FiCalendar size={14} /> {formatDate(booking.checkIn)} → {formatDate(booking.checkOut)}</span>
                    <span>{booking.totalDays} nights</span>
                    <span className="font-semibold text-dark-800">${booking.totalPrice}</span>
                  </div>
                </div>
                {booking.status !== 'cancelled' && (
                  <button
                    onClick={() => cancelBooking(booking._id)}
                    className="text-sm text-red-500 hover:text-red-600 font-medium px-4 py-2 border border-red-200 rounded-lg hover:bg-red-50 transition whitespace-nowrap"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HostBookingsPage;
