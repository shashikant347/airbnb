const express = require('express');
const router = express.Router();
const { createReview, getPropertyReviews } = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

router.post('/', protect, createReview);
router.get('/:propertyId', getPropertyReviews);

module.exports = router;
