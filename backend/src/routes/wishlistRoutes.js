const express = require('express');
const router = express.Router();
const { addToWishlist, removeFromWishlist, getMyWishlist } = require('../controllers/wishlistController');
const { protect } = require('../middleware/auth');

router.post('/add', protect, addToWishlist);
router.post('/remove', protect, removeFromWishlist);
router.get('/my', protect, getMyWishlist);

module.exports = router;
