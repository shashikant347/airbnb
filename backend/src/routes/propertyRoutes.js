const express = require('express');
const router = express.Router();
const {
  createProperty,
  getProperties,
  getProperty,
  updateProperty,
  deleteProperty,
  getMyListings,
} = require('../controllers/propertyController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public routes
router.get('/', getProperties);
router.get('/my-listings', protect, getMyListings);
router.get('/:id', getProperty);

// Protected routes (host/admin)
router.post('/', protect, upload.array('images', 10), createProperty);
router.put('/:id', protect, upload.array('images', 10), updateProperty);
router.delete('/:id', protect, deleteProperty);

module.exports = router;
