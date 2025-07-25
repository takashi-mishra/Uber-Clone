const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  caption: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Caption'
  },
  pickup: {
    type: String,
    required: true
  },
  destination: {
    type: String,
    required: true
  },
  fare: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'ongoing', 'completed', 'cancelled', 'confirmed'],
    default: 'pending'
  },
  duration: {
    type: Number,
    required: true
  },
  distance: {
    type: Number,
    required: true
  },
  otp :{
    type: String,
    select : false,
  },
  paymentId: String,
  orderId: String,
  signature: String
});

module.exports = mongoose.model('Ride', rideSchema);
