const Review = require('../models/Review');
const Booking = require('../models/Booking');
const ApiError = require('../utils/ApiError');

// @desc    Create a review
// @route   POST /api/reviews
exports.createReview = async (req, res, next) => {
  try {
    const { propertyId, rating, comment } = req.body;

    // Check if user has booked this property
    const hasBooked = await Booking.findOne({
      property: propertyId,
      user: req.user._id,
      status: 'confirmed',
    });

    if (!hasBooked) {
      return next(new ApiError(400, 'You can only review properties you have booked'));
    }

    // Check if already reviewed
    const existingReview = await Review.findOne({
      property: propertyId,
      user: req.user._id,
    });

    if (existingReview) {
      return next(new ApiError(400, 'You have already reviewed this property'));
    }

    const review = await Review.create({
      property: propertyId,
      user: req.user._id,
      rating,
      comment,
    });

    await review.populate('user', 'name profileImage');

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      review,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get reviews for a property
// @route   GET /api/reviews/:propertyId
exports.getPropertyReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ property: req.params.propertyId })
      .populate('user', 'name profileImage')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    next(error);
  }
};
