const Booking = require('../models/Booking');
const Property = require('../models/Property');
const ApiError = require('../utils/ApiError');

// @desc    Create a booking
// @route   POST /api/bookings
exports.createBooking = async (req, res, next) => {
  try {
    const { propertyId, checkIn, checkOut, guests } = req.body;

    // Validate property exists
    const property = await Property.findById(propertyId);
    if (!property) {
      return next(new ApiError(404, 'Property not found'));
    }

    // Cannot book own property
    if (property.host.toString() === req.user._id.toString()) {
      return next(new ApiError(400, 'You cannot book your own property'));
    }

    // Validate dates
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (checkInDate >= checkOutDate) {
      return next(new ApiError(400, 'Check-out date must be after check-in date'));
    }

    if (checkInDate < new Date()) {
      return next(new ApiError(400, 'Check-in date cannot be in the past'));
    }

    // Check for overlapping bookings
    const overlapping = await Booking.findOne({
      property: propertyId,
      status: { $ne: 'cancelled' },
      $or: [
        { checkIn: { $lt: checkOutDate }, checkOut: { $gt: checkInDate } },
      ],
    });

    if (overlapping) {
      return next(new ApiError(400, 'Property is already booked for selected dates'));
    }

    // Calculate total days and price
    const totalDays = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    const totalPrice = totalDays * property.pricePerNight;

    // Validate guests
    if (guests && guests > property.maxGuests) {
      return next(new ApiError(400, `Maximum ${property.maxGuests} guests allowed`));
    }

    const booking = await Booking.create({
      property: propertyId,
      user: req.user._id,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      totalDays,
      totalPrice,
      guests: guests || 1,
      status: 'confirmed',
      paymentStatus: 'paid',
    });

    await booking.populate('property', 'title images pricePerNight location');

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get my bookings (as a guest)
// @route   GET /api/bookings/my
exports.getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('property', 'title images pricePerNight location')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get bookings for host's properties
// @route   GET /api/bookings/host
exports.getHostBookings = async (req, res, next) => {
  try {
    // Get all properties by this host
    const myProperties = await Property.find({ host: req.user._id }).select('_id');
    const propertyIds = myProperties.map((p) => p._id);

    const bookings = await Booking.find({ property: { $in: propertyIds } })
      .populate('property', 'title images pricePerNight location')
      .populate('user', 'name email profileImage')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel a booking
// @route   PUT /api/bookings/:id/cancel
exports.cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return next(new ApiError(404, 'Booking not found'));
    }

    // Check if user owns the booking or is the host
    const property = await Property.findById(booking.property);
    const isGuest = booking.user.toString() === req.user._id.toString();
    const isHost = property && property.host.toString() === req.user._id.toString();

    if (!isGuest && !isHost && req.user.role !== 'admin') {
      return next(new ApiError(403, 'Not authorized to cancel this booking'));
    }

    if (booking.status === 'cancelled') {
      return next(new ApiError(400, 'Booking is already cancelled'));
    }

    booking.status = 'cancelled';
    booking.paymentStatus = 'refunded';
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get booked dates for a property
// @route   GET /api/bookings/property/:propertyId/dates
exports.getBookedDates = async (req, res, next) => {
  try {
    const bookings = await Booking.find({
      property: req.params.propertyId,
      status: { $ne: 'cancelled' },
      checkOut: { $gte: new Date() },
    }).select('checkIn checkOut');

    res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    next(error);
  }
};
