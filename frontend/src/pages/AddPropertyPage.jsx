import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import toast from 'react-hot-toast';
import { FiImage, FiMapPin, FiDollarSign, FiUsers, FiHome, FiPlus, FiX } from 'react-icons/fi';

const amenitiesList = [
  'WiFi', 'Air Conditioning', 'Kitchen', 'TV', 'Pool', 'Hot Tub',
  'Parking', 'Washer', 'Dryer', 'Heating', 'Fireplace', 'BBQ Grill',
  'Gym', 'Elevator', 'Beach Access', 'Garden', 'Balcony', 'Patio',
  'Lake Access', 'Terrace', 'Sea View', 'Nature View', 'Breakfast',
  'Yoga Deck', 'Wine Cellar', 'Smart Lock', 'Doorman', 'Kayak',
];

const AddPropertyPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    country: '',
    state: '',
    city: '',
    address: '',
    pricePerNight: '',
    maxGuests: 1,
    bedrooms: 1,
    bathrooms: 1,
    amenities: [],
    imageUrls: [''],
  });

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const toggleAmenity = (amenity) => {
    setForm((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const addImageUrl = () => {
    setForm((prev) => ({ ...prev, imageUrls: [...prev.imageUrls, ''] }));
  };

  const removeImageUrl = (index) => {
    setForm((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index),
    }));
  };

  const updateImageUrl = (index, value) => {
    const urls = [...form.imageUrls];
    urls[index] = value;
    setForm((prev) => ({ ...prev, imageUrls: urls }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        title: form.title,
        description: form.description,
        location: {
          country: form.country,
          state: form.state,
          city: form.city,
          address: form.address,
        },
        pricePerNight: Number(form.pricePerNight),
        maxGuests: Number(form.maxGuests),
        bedrooms: Number(form.bedrooms),
        bathrooms: Number(form.bathrooms),
        amenities: form.amenities,
        images: form.imageUrls.filter((url) => url.trim()),
      };

      await API.post('/properties', payload);
      toast.success('Property listed successfully! 🏠');
      navigate('/host/listings');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create property');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 animate-fade-in">
      <h1 className="section-title mb-2">List Your Property</h1>
      <p className="text-dark-400 mb-8">Share your space with travelers from around the world</p>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <div className="card p-6 border border-dark-100 space-y-4">
          <h2 className="text-lg font-semibold text-dark-800 flex items-center gap-2">
            <FiHome className="text-primary-500" /> Basic Information
          </h2>
          <div>
            <label className="block text-sm font-medium text-dark-700 mb-1.5">Property Title</label>
            <input type="text" value={form.title} onChange={(e) => handleChange('title', e.target.value)} className="input-field" placeholder="Cozy Beach Villa with Ocean View" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-700 mb-1.5">Description</label>
            <textarea value={form.description} onChange={(e) => handleChange('description', e.target.value)} className="input-field min-h-[120px]" placeholder="Describe your property, what makes it special..." required />
          </div>
        </div>

        {/* Location */}
        <div className="card p-6 border border-dark-100 space-y-4">
          <h2 className="text-lg font-semibold text-dark-800 flex items-center gap-2">
            <FiMapPin className="text-primary-500" /> Location
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark-700 mb-1.5">Country</label>
              <input type="text" value={form.country} onChange={(e) => handleChange('country', e.target.value)} className="input-field" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-700 mb-1.5">State / Region</label>
              <input type="text" value={form.state} onChange={(e) => handleChange('state', e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-700 mb-1.5">City</label>
              <input type="text" value={form.city} onChange={(e) => handleChange('city', e.target.value)} className="input-field" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-700 mb-1.5">Address</label>
              <input type="text" value={form.address} onChange={(e) => handleChange('address', e.target.value)} className="input-field" required />
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="card p-6 border border-dark-100 space-y-4">
          <h2 className="text-lg font-semibold text-dark-800 flex items-center gap-2">
            <FiDollarSign className="text-primary-500" /> Property Details
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark-700 mb-1.5">Price / Night ($)</label>
              <input type="number" value={form.pricePerNight} onChange={(e) => handleChange('pricePerNight', e.target.value)} className="input-field" min="1" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-700 mb-1.5">Max Guests</label>
              <input type="number" value={form.maxGuests} onChange={(e) => handleChange('maxGuests', e.target.value)} className="input-field" min="1" />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-700 mb-1.5">Bedrooms</label>
              <input type="number" value={form.bedrooms} onChange={(e) => handleChange('bedrooms', e.target.value)} className="input-field" min="0" />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-700 mb-1.5">Bathrooms</label>
              <input type="number" value={form.bathrooms} onChange={(e) => handleChange('bathrooms', e.target.value)} className="input-field" min="0" />
            </div>
          </div>
        </div>

        {/* Amenities */}
        <div className="card p-6 border border-dark-100">
          <h2 className="text-lg font-semibold text-dark-800 mb-4">Amenities</h2>
          <div className="flex flex-wrap gap-2">
            {amenitiesList.map((amenity) => (
              <button
                key={amenity}
                type="button"
                onClick={() => toggleAmenity(amenity)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                  form.amenities.includes(amenity)
                    ? 'bg-primary-500 text-white border-primary-500'
                    : 'bg-white text-dark-600 border-dark-300 hover:border-dark-400'
                }`}
              >
                {amenity}
              </button>
            ))}
          </div>
        </div>

        {/* Images */}
        <div className="card p-6 border border-dark-100 space-y-4">
          <h2 className="text-lg font-semibold text-dark-800 flex items-center gap-2">
            <FiImage className="text-primary-500" /> Property Images
          </h2>
          <p className="text-dark-400 text-sm">Add image URLs for your property photos</p>
          {form.imageUrls.map((url, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="url"
                value={url}
                onChange={(e) => updateImageUrl(index, e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="input-field flex-1"
              />
              {form.imageUrls.length > 1 && (
                <button type="button" onClick={() => removeImageUrl(index)} className="p-3 text-red-500 hover:bg-red-50 rounded-lg transition">
                  <FiX size={18} />
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={addImageUrl} className="flex items-center gap-2 text-primary-500 text-sm font-medium hover:text-primary-600 transition">
            <FiPlus size={16} /> Add another image
          </button>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full flex items-center justify-center gap-2 text-lg py-4 disabled:opacity-50"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <FiPlus size={20} /> List Property
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default AddPropertyPage;
