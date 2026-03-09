import { useState, useEffect } from 'react';
import API from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { FiCalendar, FiMapPin, FiXCircle, FiCheckCircle, FiClock } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const statusIcons = {
  pending: <FiClock size={14} />,
  confirmed: <FiCheckCircle size={14} />,
  cancelled: <FiXCircle size={14} />,
};

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const { data } = await API.get('/bookings/my');
      setBookings(data.bookings);
    } catch (err) {
      toast.error('Failed to load bookings');
    }
    setLoading(false);
  };

  const cancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await API.put(`/bookings/${bookingId}/cancel`);
      toast.success('Booking cancelled');
      fetchBookings();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel');
    }
  };

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      <h1 className="section-title mb-8">My Bookings</h1>

      {bookings.length === 0 ? (
        <div className="text-center py-20">
          <FiCalendar className="mx-auto text-5xl text-dark-300 mb-4" />
          <h3 className="text-xl font-semibold text-dark-700 mb-2">No bookings yet</h3>
          <p className="text-dark-400 mb-6">Start exploring and book your perfect stay!</p>
          <Link to="/" className="btn-primary">Explore Properties</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking._id} className="card p-4 md:p-6 border border-dark-100 flex flex-col md:flex-row gap-4">
              {/* Property Image */}
              <Link to={`/property/${booking.property?._id}`} className="w-full md:w-48 flex-shrink-0">
                <div className="aspect-[4/3] md:aspect-square rounded-xl overflow-hidden bg-dark-100">
                  <img
                    src={booking.property?.images?.[0] || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400'}
                    alt={booking.property?.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </Link>

              {/* Booking Info */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <Link to={`/property/${booking.property?._id}`} className="text-lg font-semibold text-dark-800 hover:text-primary-500 transition">
                      {booking.property?.title || 'Property'}
                    </Link>
                    <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${statusColors[booking.status]}`}>
                      {statusIcons[booking.status]} {booking.status}
                    </span>
                  </div>
                  <p className="text-dark-500 text-sm flex items-center gap-1 mb-3">
                    <FiMapPin size={14} /> {booking.property?.location?.city}, {booking.property?.location?.country}
                  </p>
                  <div className="flex flex-wrap gap-4 text-sm text-dark-600">
                    <span className="flex items-center gap-1"><FiCalendar size={14} /> {formatDate(booking.checkIn)} → {formatDate(booking.checkOut)}</span>
                    <span>{booking.totalDays} night{booking.totalDays > 1 ? 's' : ''}</span>
                    <span className="font-semibold text-dark-800">${booking.totalPrice}</span>
                  </div>
                </div>

                {booking.status !== 'cancelled' && (
                  <div className="mt-4">
                    <button
                      onClick={() => cancelBooking(booking._id)}
                      className="text-sm text-red-500 hover:text-red-600 font-medium transition"
                    >
                      Cancel Booking
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookingsPage;
