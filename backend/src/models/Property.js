const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    location: {
      country: { type: String, required: true, trim: true },
      state: { type: String, trim: true },
      city: { type: String, required: true, trim: true },
      address: { type: String, required: true, trim: true },
    },
    pricePerNight: {
      type: Number,
      required: [true, 'Price per night is required'],
      min: [1, 'Price must be at least 1'],
    },
    maxGuests: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    bedrooms: {
      type: Number,
      required: true,
      min: 0,
      default: 1,
    },
    bathrooms: {
      type: Number,
      required: true,
      min: 0,
      default: 1,
    },
    amenities: {
      type: [String],
      default: [],
    },
    images: {
      type: [String],
      default: [],
    },
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    ratingAverage: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    ratingCount: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for search and filtering
propertySchema.index({ 'location.city': 'text', 'location.country': 'text', title: 'text' });
propertySchema.index({ pricePerNight: 1 });
propertySchema.index({ host: 1 });

module.exports = mongoose.model('Property', propertySchema);
