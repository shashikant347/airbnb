const express = require('express');
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  getHostBookings,
  cancelBooking,
  getBookedDates,
} = require('../controllers/bookingController');
const { protect } = require('../middleware/auth');

router.post('/', protect, createBooking);
router.get('/my', protect, getMyBookings);
router.get('/host', protect, getHostBookings);
router.put('/:id/cancel', protect, cancelBooking);
router.get('/property/:propertyId/dates', getBookedDates);

module.exports = router;
