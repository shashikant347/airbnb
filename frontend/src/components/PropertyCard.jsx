import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiStar, FiMapPin } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import toast from 'react-hot-toast';

const PropertyCard = ({ property, wishlisted = false, onWishlistChange }) => {
  const { isAuthenticated } = useAuth();
  const [isWishlisted, setIsWishlisted] = useState(wishlisted);
  const [currentImage, setCurrentImage] = useState(0);
  const [imgLoaded, setImgLoaded] = useState(false);

  const images = property.images?.length > 0
    ? property.images
    : ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800'];

  const toggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error('Please login to save properties');
      return;
    }
    try {
      if (isWishlisted) {
        await API.post('/wishlist/remove', { propertyId: property._id });
        toast.success('Removed from wishlist');
      } else {
        await API.post('/wishlist/add', { propertyId: property._id });
        toast.success('Saved to wishlist ❤️');
      }
      setIsWishlisted(!isWishlisted);
      onWishlistChange?.();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    }
  };

  const nextImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <Link to={`/property/${property._id}`} className="group block">
      <div className="relative overflow-hidden rounded-xl aspect-[4/3] bg-dark-100">
        {/* Image */}
        <img
          src={images[currentImage]}
          alt={property.title}
          className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImgLoaded(true)}
          loading="lazy"
        />
        {!imgLoaded && (
          <div className="absolute inset-0 bg-dark-100 animate-pulse" />
        )}

        {/* Wishlist */}
        <button
          onClick={toggleWishlist}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-200 transform hover:scale-110 z-10"
        >
          {isWishlisted ? (
            <FaHeart className="text-primary-500" size={18} />
          ) : (
            <FiHeart className="text-dark-700" size={18} />
          )}
        </button>

        {/* Image navigation */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
            >
              ‹
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
            >
              ›
            </button>
            {/* Dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((_, idx) => (
                <span
                  key={idx}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${idx === currentImage ? 'bg-white w-3' : 'bg-white/60'}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Info */}
      <div className="mt-3 space-y-1">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-dark-800 truncate pr-2">{property.title}</h3>
          {property.ratingAverage > 0 && (
            <div className="flex items-center gap-1 text-sm flex-shrink-0">
              <FiStar className="text-dark-800 fill-dark-800" size={14} />
              <span className="font-medium">{property.ratingAverage}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-1 text-dark-500 text-sm">
          <FiMapPin size={13} />
          <span className="truncate">{property.location?.city}, {property.location?.country}</span>
        </div>
        <p className="text-dark-500 text-sm">
          {property.bedrooms} bed{property.bedrooms !== 1 ? 's' : ''} · {property.bathrooms} bath{property.bathrooms !== 1 ? 's' : ''} · {property.maxGuests} guest{property.maxGuests !== 1 ? 's' : ''}
        </p>
        <p className="text-dark-900 font-semibold">
          ${property.pricePerNight} <span className="font-normal text-dark-500">/ night</span>
        </p>
      </div>
    </Link>
  );
};

export default PropertyCard;
