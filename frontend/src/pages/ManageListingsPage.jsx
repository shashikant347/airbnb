import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { FiEdit2, FiTrash2, FiEye, FiStar, FiMapPin, FiDollarSign, FiPlusCircle } from 'react-icons/fi';

const ManageListingsPage = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const { data } = await API.get('/properties/my-listings');
      setListings(data.properties);
    } catch (err) {
      toast.error('Failed to load listings');
    }
    setLoading(false);
  };

  const deleteListing = async (id) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    try {
      await API.delete(`/properties/${id}`);
      toast.success('Listing deleted');
      fetchListings();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <h1 className="section-title">My Listings</h1>
        <Link to="/host/add-property" className="btn-primary flex items-center gap-2 text-sm">
          <FiPlusCircle size={18} /> Add New
        </Link>
      </div>

      {listings.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-6xl mb-4">🏠</p>
          <h3 className="text-xl font-semibold text-dark-700 mb-2">No listings yet</h3>
          <p className="text-dark-400 mb-6">Create your first property listing!</p>
          <Link to="/host/add-property" className="btn-primary">Add Property</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {listings.map((listing) => (
            <div key={listing._id} className="card p-4 border border-dark-100 flex flex-col md:flex-row gap-4">
              {/* Image */}
              <div className="w-full md:w-40 flex-shrink-0">
                <div className="aspect-[4/3] md:aspect-square rounded-xl overflow-hidden bg-dark-100">
                  <img
                    src={listing.images?.[0] || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400'}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Info */}
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-dark-800 mb-1">{listing.title}</h3>
                <p className="text-dark-500 text-sm flex items-center gap-1 mb-2">
                  <FiMapPin size={14} /> {listing.location?.city}, {listing.location?.country}
                </p>
                <div className="flex flex-wrap gap-3 text-sm text-dark-600 mb-3">
                  <span className="flex items-center gap-1"><FiDollarSign size={14} /> ${listing.pricePerNight}/night</span>
                  <span>{listing.bedrooms} beds · {listing.bathrooms} baths</span>
                  {listing.ratingAverage > 0 && (
                    <span className="flex items-center gap-1"><FiStar size={14} className="fill-dark-800" /> {listing.ratingAverage}</span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex md:flex-col gap-2 justify-end">
                <Link to={`/property/${listing._id}`} className="p-2.5 bg-dark-50 rounded-lg hover:bg-dark-100 transition text-dark-600" title="View">
                  <FiEye size={18} />
                </Link>
                <button onClick={() => deleteListing(listing._id)} className="p-2.5 bg-red-50 rounded-lg hover:bg-red-100 transition text-red-500" title="Delete">
                  <FiTrash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageListingsPage;
