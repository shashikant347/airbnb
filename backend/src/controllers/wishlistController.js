const Wishlist = require('../models/Wishlist');
const ApiError = require('../utils/ApiError');

// @desc    Add property to wishlist
// @route   POST /api/wishlist/add
exports.addToWishlist = async (req, res, next) => {
  try {
    const { propertyId } = req.body;

    let wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: req.user._id,
        properties: [propertyId],
      });
    } else {
      // Check if already in wishlist
      if (wishlist.properties.includes(propertyId)) {
        return next(new ApiError(400, 'Property already in wishlist'));
      }
      wishlist.properties.push(propertyId);
      await wishlist.save();
    }

    res.status(200).json({
      success: true,
      message: 'Property added to wishlist',
      wishlist,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove property from wishlist
// @route   POST /api/wishlist/remove
exports.removeFromWishlist = async (req, res, next) => {
  try {
    const { propertyId } = req.body;

    const wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      return next(new ApiError(404, 'Wishlist not found'));
    }

    wishlist.properties = wishlist.properties.filter(
      (id) => id.toString() !== propertyId
    );
    await wishlist.save();

    res.status(200).json({
      success: true,
      message: 'Property removed from wishlist',
      wishlist,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get my wishlist
// @route   GET /api/wishlist/my
exports.getMyWishlist = async (req, res, next) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id }).populate({
      path: 'properties',
      populate: { path: 'host', select: 'name profileImage' },
    });

    res.status(200).json({
      success: true,
      wishlist: wishlist || { properties: [] },
    });
  } catch (error) {
    next(error);
  }
};
