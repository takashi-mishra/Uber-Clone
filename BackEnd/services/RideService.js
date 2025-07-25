const CaptinModel = require('../models/CaptinModel');
const rideModel = require('../models/RideModel');
const mapService = require('./Maps'); // make sure getDistances() works correctly
const crypto = require('crypto');

async function getFare(pickup, destination) {
  if (!pickup || !destination) {
    throw new Error('Pickup and destination are required');
  }

  const distanceInfo = await mapService.getDistances(pickup, destination);


  if (!distanceInfo?.distance || !distanceInfo?.duration) {
    throw new Error('Failed to get distance or duration from mapService');
  }

  const distanceInKm = parseFloat(distanceInfo.distance.replace('km', '').trim());
  const durationInMin = parseFloat(distanceInfo.duration.replace('mins', '').trim());

  if (isNaN(distanceInKm) || isNaN(durationInMin)) {
    throw new Error(`Invalid distance or duration parsed. Got distance: ${distanceInKm}, duration: ${durationInMin}`);
  }

  const baseFare = { auto: 30, car: 50, bike: 20 };
  const perKmRate = { auto: 10, car: 15, bike: 5 };
  const perMinuteRate = { auto: 2, car: 3, bike: 1 };

  const fare = {
    auto: baseFare.auto + (distanceInKm * perKmRate.auto) + (durationInMin * perMinuteRate.auto),
    car: baseFare.car + (distanceInKm * perKmRate.car) + (durationInMin * perMinuteRate.car),
    bike: baseFare.bike + (distanceInKm * perKmRate.bike) + (durationInMin * perMinuteRate.bike)
  };


  return {
    fare,
    distance: distanceInKm,
    duration: durationInMin
  };
}


module.exports.getFare = getFare;

function genOtp(num){
  function genrateOtp(num){
    const otp = crypto.randomInt(Math.pow(10, num-1), Math.pow(10, num )).toString();
    return otp;
  }
  return genrateOtp(num);
}


module.exports.createRide = async ({ userId, pickup, destination, vehicleType }) => {
  if (!userId || !pickup || !destination || !vehicleType) {
    throw new Error('All fields are required');
  }

  const { fare, distance, duration } = await getFare(pickup, destination);

  const ride = await rideModel.create({
    user: userId,
    pickup,
    destination,
    fare: fare[vehicleType.toLowerCase()], // ✅ FIXED
    distance,
    duration,
    otp : genOtp(6)
  });

  return ride;
};


module.exports.confirmRide = async (rideId, driverId) => {
  console.log('📡 Confirming ride with ID:', rideId, 'for driver ID:', driverId);
  if (!rideId || !driverId) {
    throw new Error('Ride ID and Driver ID are required');
  }

  // ✅ Find the caption (driver)
  const caption = await CaptinModel.findById(driverId);
  if (!caption) {
    throw new Error('Caption (driver) not found');
  }

  // ✅ Update the ride status and assign the driver
  await rideModel.findByIdAndUpdate(
    rideId,
    {
      status: 'confirmed',
      caption: caption._id
    },
    { new: true }
  );

  // ✅ Fetch the updated ride with populated user (and optionally driver/caption)
  const ride = await rideModel.findById(rideId)
    .populate('caption'); // optional if you want full driver details


  if (!ride) {
    throw new Error('Ride not found after update');
  }

  return ride;
};

module.exports.startRide = async (rideId, otp) => {
  if (!rideId || !otp) {
    throw new Error('Ride ID and OTP are required');
  }

  const ride = await rideModel.findById(rideId)
    .populate('caption')
    .populate('user')
    .select('+otp'); // Make sure `otp` is set with `select: false` in your schema

  if (!ride) throw new Error('Ride not found');
  if (ride.otp !== otp) throw new Error('Invalid OTP');

  ride.status = 'ongoing';
  await ride.save();

  return ride;
};
