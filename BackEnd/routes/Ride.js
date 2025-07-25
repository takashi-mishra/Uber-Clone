const express = require('express');
const router = express.Router();
const { body,query } = require('express-validator');
const rideController = require('../controllers/RideController');
const userMiddleware = require('../middleware/userMiddleware');

router.post(
  '/ride',
  userMiddleware.authUser,
  [
    body('pickup').isString().notEmpty().withMessage('Pickup location is required'),
    body('destination').isString().notEmpty().withMessage('Destination is required'),
    body('vehicleType').isString().notEmpty().withMessage('Vehicle type is required')
  ],
  rideController.createRide
);

router.get('/get-fare',
  userMiddleware.authUser,
  query('pickup').isString().notEmpty().withMessage('Pickup location is required'),
  query('destination').isString().notEmpty().withMessage('Destination is required'),

  rideController.getFare
)

router.post('/confirmRide',
  userMiddleware.authCaption,
    body('rideId').isString().notEmpty().withMessage('Ride ID is required'),
    body('driverId').isString().notEmpty().withMessage('Driver ID is required'),
  rideController.confirmRide
);

router.get('/start-ride',
  userMiddleware.authCaption,
  query('rideId').isString().notEmpty().withMessage('Ride ID is required'),
  query('otp').isString().notEmpty().withMessage('OTP is required'),
  rideController.startRide
);

module.exports = router;
