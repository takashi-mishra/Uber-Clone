// ✅ Caption Model (models/CaptinModel.js)
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const captionSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
    trim: true,
    minlength: [3, 'Full name must be at least 3 characters long']
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: [5, 'Email must be at least 5 characters long']
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  socketId: {
    type: String
  },
  Status: {
    type: String,
    enum: ['Online', 'Offline', 'Away']
  },
  role: {
    type: String,
    enum: ['caption', 'user'],
    default: 'caption'
  },
  vehicle: {
    color: {
      type: String,
      required: true,
      minlength: [3, 'Color must be at least 3 characters long']
    },
    capacity: {
      type: Number,
      required: true,
      min: [1, 'Capacity must be at least 1']
    },
    vehicleType: {
      type: String,
      required: true,
      enum: ['Car', 'Bike', 'Auto']
    },
    plateNumber: {
      type: String,
      required: true,
      unique: true,
      minlength: [5, 'Plate number must be at least 5 characters long']
    }
  },
  // ✅ Correct GeoJSON location format
  location: {
    type: {
      type: String,
      enum: ['Point'],
  
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
     
    }
  }
});

// ✅ Add geospatial index
captionSchema.index({ location: '2dsphere' });

captionSchema.methods.genrateAuthToken = async function () {
  return jwt.sign({ _id: this._id, role: this.role }, process.env.JWT_SECRET, { expiresIn: '24h' });
};

captionSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

captionSchema.statics.hashPassword = async function (password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

module.exports = mongoose.model('Caption', captionSchema);