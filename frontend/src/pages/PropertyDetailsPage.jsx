import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import API from '../api/axios';
import ReviewCard from '../components/ReviewCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import {
  FiStar, FiMapPin, FiUsers, FiHome, FiDroplet,
  FiWifi, FiWind, FiTv, FiHeart, FiShare2, FiCheck, FiChevronLeft, FiChevronRight
} from 'react-icons/fi';
import { FaHeart, FaParking, FaSwimmingPool, FaFire, FaUmbrellaBeach } from 'react-icons/fa';

const amenityIcons = {
  WiFi: <FiWifi />, 'Air Conditioning': <FiWind />, TV: <FiTv />,
  Pool: <FaSwimmingPool />, Parking: <FaParking />, Fireplace: <FaFire />,
  'Beach Access': <FaUmbrellaBeach />,
};

const PropertyDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [property, setProperty] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [bookedDates, setBookedDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [guests, setGuests] = useState(1);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    fetchProperty();
    fetchReviews();
    fetchBookedDates();
  }, [id]);

  const fetchProperty = async () => {
    try {
      const { data } = await API.get(`/properties/${id}`);
      setProperty(data.property);
    } catch (err) {
      toast.error('Property not found');
      navigate('/');
    }
    setLoading(false);
  };

  const fetchReviews = async () => {
    try {
      const { data } = await API.get(`/reviews/${id}`);
      setReviews(data.reviews);
    } catch (err) {}
  };

  const fetchBookedDates = async () => {
    try {
      const { data } = await API.get(`/bookings/property/${id}/dates`);
      const dates = [];
      data.bookings.forEach((b) => {
        const start = new Date(b.checkIn);
        const end = new Date(b.checkOut);
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          dates.push(new Date(d));
        }
      });
      setBookedDates(dates);
    } catch (err) {}
  };

  const totalDays = checkIn && checkOut
    ? Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24))
    : 0;
  const totalPrice = totalDays * (property?.pricePerNight || 0);
  const serviceFee = Math.round(totalPrice * 0.12);
  const grandTotal = totalPrice + serviceFee;

  const handleBooking = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to book');
      navigate('/login');
      return;
    }
    if (!checkIn || !checkOut) {
      toast.error('Please select check-in and check-out dates');
      return;
    }
    setBookingLoading(true);
    try {
      await API.post('/bookings', {
        propertyId: id,
        checkIn,
        checkOut,
        guests,
      });
      toast.success('Booking confirmed! 🎉');
      setCheckIn(null);
      setCheckOut(null);
      fetchBookedDates();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    }
    setBookingLoading(false);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to review');
      return;
    }
    try {
      await API.post('/reviews', { propertyId: id, ...reviewForm });
      toast.success('Review submitted! ⭐');
      setReviewForm({ rating: 5, comment: '' });
      fetchReviews();
      fetchProperty();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    }
  };

  const toggleWishlist = async () => {
    if (!isAuthenticated) { toast.error('Please login'); return; }
    try {
      if (isWishlisted) {
        await API.post('/wishlist/remove', { propertyId: id });
        toast.success('Removed from wishlist');
      } else {
        await API.post('/wishlist/add', { propertyId: id });
        toast.success('Saved to wishlist ❤️');
      }
      setIsWishlisted(!isWishlisted);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!property) return null;

  const images = property.images?.length > 0
    ? property.images
    : ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-fade-in">
      {/* Title Bar */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-dark-900">{property.title}</h1>
          <div className="flex items-center gap-3 mt-2 text-sm text-dark-500">
            {property.ratingAverage > 0 && (
              <span className="flex items-center gap-1 font-medium text-dark-800">
                <FiStar className="fill-dark-800" /> {property.ratingAverage} ({property.ratingCount} reviews)
              </span>
            )}
            <span className="flex items-center gap-1">
              <FiMapPin size={14} /> {property.location.city}, {property.location.country}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success('Link copied!'); }} className="flex items-center gap-2 text-sm font-medium text-dark-600 hover:text-dark-800 underline transition">
            <FiShare2 size={16} /> Share
          </button>
          <button onClick={toggleWishlist} className="flex items-center gap-2 text-sm font-medium text-dark-600 hover:text-dark-800 underline transition">
            {isWishlisted ? <FaHeart className="text-primary-500" /> : <FiHeart />} Save
          </button>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="relative rounded-2xl overflow-hidden aspect-[16/9] md:aspect-[2/1] bg-dark-100 mb-8">
        <img
          src={images[currentImage]}
          alt={property.title}
          className="w-full h-full object-cover"
        />
        {images.length > 1 && (
          <>
            <button
              onClick={() => setCurrentImage((prev) => (prev - 1 + images.length) % images.length)}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition"
            >
              <FiChevronLeft size={20} />
            </button>
            <button
              onClick={() => setCurrentImage((prev) => (prev + 1) % images.length)}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition"
            >
              <FiChevronRight size={20} />
            </button>
            <div className="absolute bottom-4 right-4 bg-dark-800/80 text-white text-xs font-medium px-3 py-1.5 rounded-lg">
              {currentImage + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Host & Quick Info */}
          <div className="flex items-center justify-between pb-6 border-b border-dark-100">
            <div>
              <h2 className="text-xl font-semibold text-dark-800">
                Hosted by {property.host?.name || 'Host'}
              </h2>
              <div className="flex items-center gap-4 mt-2 text-dark-500 text-sm">
                <span className="flex items-center gap-1"><FiUsers size={15} /> {property.maxGuests} guests</span>
                <span className="flex items-center gap-1"><FiHome size={15} /> {property.bedrooms} bedrooms</span>
                <span className="flex items-center gap-1"><FiDroplet size={15} /> {property.bathrooms} bathrooms</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
              {property.host?.name ? property.host.name[0] : 'H'}
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold text-dark-800 mb-3">About this place</h3>
            <p className="text-dark-600 leading-relaxed">{property.description}</p>
          </div>

          {/* Amenities */}
          {property.amenities?.length > 0 && (
            <div className="pb-6 border-b border-dark-100">
              <h3 className="text-lg font-semibold text-dark-800 mb-4">What this place offers</h3>
              <div className="grid grid-cols-2 gap-3">
                {property.amenities.map((amenity, i) => (
                  <div key={i} className="flex items-center gap-3 text-dark-600">
                    <span className="text-lg">{amenityIcons[amenity] || <FiCheck />}</span>
                    <span className="text-sm">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reviews */}
          <div>
            <h3 className="text-lg font-semibold text-dark-800 mb-4">
              {reviews.length > 0 ? (
                <span className="flex items-center gap-2">
                  <FiStar className="fill-dark-800" /> {property.ratingAverage} · {reviews.length} review{reviews.length !== 1 ? 's' : ''}
                </span>
              ) : (
                'No reviews yet'
              )}
            </h3>

            {/* Review Form */}
            {isAuthenticated && (
              <form onSubmit={handleReviewSubmit} className="mb-6 p-4 bg-dark-50 rounded-xl">
                <p className="font-medium text-dark-700 mb-3">Leave a review</p>
                <div className="flex items-center gap-2 mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                    >
                      <FiStar
                        size={22}
                        className={`transition ${star <= reviewForm.rating ? 'text-yellow-400 fill-yellow-400' : 'text-dark-300'}`}
                      />
                    </button>
                  ))}
                </div>
                <textarea
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  placeholder="Share your experience..."
                  className="input-field text-sm min-h-[80px] mb-3"
                  required
                />
                <button type="submit" className="btn-primary text-sm py-2 px-5">Submit Review</button>
              </form>
            )}

            <div className="space-y-6">
              {reviews.map((review) => (
                <ReviewCard key={review._id} review={review} />
              ))}
            </div>
          </div>
        </div>

        {/* Right: Booking Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 card p-6 border border-dark-200">
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-2xl font-bold text-dark-900">${property.pricePerNight}</span>
              <span className="text-dark-500">/ night</span>
            </div>

            {/* Date Pickers */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div>
                <label className="block text-xs font-semibold text-dark-600 mb-1 uppercase">Check-in</label>
                <DatePicker
                  selected={checkIn}
                  onChange={(date) => setCheckIn(date)}
                  selectsStart
                  startDate={checkIn}
                  endDate={checkOut}
                  minDate={new Date()}
                  excludeDates={bookedDates}
                  placeholderText="Add date"
                  className="input-field text-sm py-2.5"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-dark-600 mb-1 uppercase">Check-out</label>
                <DatePicker
                  selected={checkOut}
                  onChange={(date) => setCheckOut(date)}
                  selectsEnd
                  startDate={checkIn}
                  endDate={checkOut}
                  minDate={checkIn || new Date()}
                  excludeDates={bookedDates}
                  placeholderText="Add date"
                  className="input-field text-sm py-2.5"
                />
              </div>
            </div>

            {/* Guests */}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-dark-600 mb-1 uppercase">Guests</label>
              <select
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="input-field text-sm py-2.5"
              >
                {Array.from({ length: property.maxGuests }, (_, i) => i + 1).map((g) => (
                  <option key={g} value={g}>{g} guest{g > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>

            {/* Reserve Button */}
            <button
              onClick={handleBooking}
              disabled={bookingLoading || !checkIn || !checkOut}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 mb-4"
            >
              {bookingLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'Reserve'
              )}
            </button>

            {/* Price Breakdown */}
            {totalDays > 0 && (
              <div className="space-y-3 pt-4 border-t border-dark-100">
                <div className="flex justify-between text-dark-600 text-sm">
                  <span>${property.pricePerNight} × {totalDays} night{totalDays > 1 ? 's' : ''}</span>
                  <span>${totalPrice}</span>
                </div>
                <div className="flex justify-between text-dark-600 text-sm">
                  <span>Service fee</span>
                  <span>${serviceFee}</span>
                </div>
                <div className="flex justify-between font-bold text-dark-900 pt-3 border-t border-dark-100">
                  <span>Total</span>
                  <span>${grandTotal}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailsPage;
