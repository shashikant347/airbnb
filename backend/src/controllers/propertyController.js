const Property = require('../models/Property');
const ApiError = require('../utils/ApiError');

// @desc    Create a new property
// @route   POST /api/properties
exports.createProperty = async (req, res, next) => {
  try {
    req.body.host = req.user._id;

    // If images uploaded via multer/cloudinary
    if (req.files && req.files.length > 0) {
      req.body.images = req.files.map((file) => file.path);
    }

    const property = await Property.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Property created successfully',
      property,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all properties with filters, search, pagination
// @route   GET /api/properties
exports.getProperties = async (req, res, next) => {
  try {
    const {
      search,
      location,
      minPrice,
      maxPrice,
      guests,
      bedrooms,
      bathrooms,
      rating,
      amenities,
      sort,
      page = 1,
      limit = 12,
    } = req.query;

    // Build query
    const query = { isActive: true };

    // Text search (location or title)
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { 'location.city': { $regex: search, $options: 'i' } },
        { 'location.country': { $regex: search, $options: 'i' } },
        { 'location.state': { $regex: search, $options: 'i' } },
      ];
    }

    // Location filter
    if (location) {
      query.$or = [
        { 'location.city': { $regex: location, $options: 'i' } },
        { 'location.country': { $regex: location, $options: 'i' } },
        { 'location.state': { $regex: location, $options: 'i' } },
      ];
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.pricePerNight = {};
      if (minPrice) query.pricePerNight.$gte = Number(minPrice);
      if (maxPrice) query.pricePerNight.$lte = Number(maxPrice);
    }

    // Guests filter
    if (guests) {
      query.maxGuests = { $gte: Number(guests) };
    }

    // Bedrooms filter
    if (bedrooms) {
      query.bedrooms = { $gte: Number(bedrooms) };
    }

    // Bathrooms filter
    if (bathrooms) {
      query.bathrooms = { $gte: Number(bathrooms) };
    }

    // Rating filter
    if (rating) {
      query.ratingAverage = { $gte: Number(rating) };
    }

    // Amenities filter
    if (amenities) {
      const amenityList = amenities.split(',');
      query.amenities = { $all: amenityList };
    }

    // Sort options
    let sortOption = { createdAt: -1 }; // default: newest first
    if (sort === 'price_low') sortOption = { pricePerNight: 1 };
    else if (sort === 'price_high') sortOption = { pricePerNight: -1 };
    else if (sort === 'rating') sortOption = { ratingAverage: -1 };
    else if (sort === 'newest') sortOption = { createdAt: -1 };

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);
    const total = await Property.countDocuments(query);
    const properties = await Property.find(query)
      .populate('host', 'name profileImage')
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      count: properties.length,
      total,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      properties,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single property
// @route   GET /api/properties/:id
exports.getProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id).populate('host', 'name profileImage email');

    if (!property) {
      return next(new ApiError(404, 'Property not found'));
    }

    res.status(200).json({
      success: true,
      property,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update property
// @route   PUT /api/properties/:id
exports.updateProperty = async (req, res, next) => {
  try {
    let property = await Property.findById(req.params.id);

    if (!property) {
      return next(new ApiError(404, 'Property not found'));
    }

    // Check ownership
    if (property.host.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return next(new ApiError(403, 'Not authorized to update this property'));
    }

    // Handle new images if uploaded
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file) => file.path);
      req.body.images = [...(property.images || []), ...newImages];
    }

    property = await Property.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Property updated successfully',
      property,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete property
// @route   DELETE /api/properties/:id
exports.deleteProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return next(new ApiError(404, 'Property not found'));
    }

    // Check ownership
    if (property.host.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return next(new ApiError(403, 'Not authorized to delete this property'));
    }

    await Property.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Property deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get properties by host (my listings)
// @route   GET /api/properties/my-listings
exports.getMyListings = async (req, res, next) => {
  try {
    const properties = await Property.find({ host: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: properties.length,
      properties,
    });
  } catch (error) {
    next(error);
  }
};
