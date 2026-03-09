import { useState, useEffect } from 'react';
import API from '../api/axios';
import PropertyCard from '../components/PropertyCard';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { FiHeart } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const WishlistPage = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const { data } = await API.get('/wishlist/my');
      setProperties(data.wishlist?.properties || []);
    } catch (err) {
      toast.error('Failed to load wishlist');
    }
    setLoading(false);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <h1 className="section-title mb-8">My Wishlist</h1>

      {properties.length === 0 ? (
        <div className="text-center py-20">
          <FiHeart className="mx-auto text-5xl text-dark-300 mb-4" />
          <h3 className="text-xl font-semibold text-dark-700 mb-2">Your wishlist is empty</h3>
          <p className="text-dark-400 mb-6">Save properties you love by tapping the heart icon</p>
          <Link to="/" className="btn-primary">Explore Properties</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {properties.map((property) => (
            <PropertyCard
              key={property._id}
              property={property}
              wishlisted={true}
              onWishlistChange={fetchWishlist}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
