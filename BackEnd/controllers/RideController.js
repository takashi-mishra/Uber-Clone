const rideService = require('../services/RideService');
const { validationResult } = require('express-validator');
const mapService = require('../services/Maps');
const { sendMessageToSocketId } = require('../socket');
const rideModel = require('../models/RideModel');

module.exports.createRide = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { pickup, destination, vehicleType } = req.body;
  const userId = req.user?._id;

  try {
    const ride = await rideService.createRide({ userId, pickup, destination, vehicleType });
    res.status(201).json({ ride });

    const coordinates = await mapService.getAddressCoordinates(pickup);

    const captionInRadius = await mapService.getCaptionsInTheRadius(coordinates.lat, coordinates.lon, 5000);
 
        ride.otp = ''
        const rideDataWithUser = await rideModel.findById(ride._id).populate('user');

    captionInRadius.map(caption => {
       sendMessageToSocketId(caption.socketId, 
       {
        event : 'rideRequest',
        data : rideDataWithUser
       })
    }
    )

  } catch (err) {
    next(err);
  }
};

module.exports.getFare = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { pickup, destination } = req.query;

  try {
    const fareDetails = await rideService.getFare(pickup, destination);
    return res.status(200).json(fareDetails);
  } catch (err) {
    return next(err);
  }
};

module.exports.confirmRide = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  

  const { rideId, driverId } = req.body;

  try {
    const ride = await rideService.confirmRide(rideId, driverId);
    if (!ride) return res.status(404).json({ message: 'Ride not found' });

   const rideDataWithUser = await rideModel.findById(ride._id).populate('caption').populate('user').select('+otp');
   console.log("📡 Emitting to user socketId:", rideDataWithUser);

    if (!rideDataWithUser) {
      return res.status(404).json({ message: 'Ride data not found' });
    }
    sendMessageToSocketId(rideDataWithUser.user.socketId, {
      event: 'rideConfirmed',
      data: rideDataWithUser
    });

    return res.status(200).json({ ride });
  } catch (err) {
    console.log('🚨 Ride confirmation error:', err.message);
    return res.status(400).json({ message: err.message });
  }
};

module.exports.startRide = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { rideId, otp } = req.query;

  try {
    const ride = await rideService.startRide(rideId, otp);
    if (!ride) return res.status(404).json({ message: 'Ride not found' });

    // ❌ Bug: `rideDataWithUser` is not defined
    sendMessageToSocketId(ride.user?.socketId, {
      event: 'rideStarted',
      data: ride
    });

    return res.status(200).json({ ride });
  } catch (err) {
    console.log('🚨 Ride start error:', err.message);
    return res.status(400).json({ message: err.message });
  }
};

