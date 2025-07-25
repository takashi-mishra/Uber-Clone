const captionModel = require('../models/CaptinModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


module.exports.createCaption = async ({ fullname, email, password, Status, vehicleType, capacity, color, plateNumber, }) => {
    if (!fullname || !email || !password || !vehicleType || !capacity || !color || !plateNumber) {
        throw new Error('All fields are required');
    }

    const existingCaption = await captionModel.findOne({ email });
    if (existingCaption) {
        throw new Error('Caption with this email already exists');
    }


    const caption = await captionModel.create({
        fullname,
        email,
        password,
        Status,
        vehicle: {
            vehicleType,
            capacity,
            color,
            plateNumber
        }
    });

    return caption;
}

module.exports.findNearestCaption = async function(userCoords, maxDistance = 5000) {
    // userCoords: [longitude, latitude]
    // Ensure captions have a 2dsphere index on location
    return await captionModel.findOne({
        location: {
            $near: {
                $geometry: { type: 'Point', coordinates: userCoords },
                $maxDistance: maxDistance // meters
            }
        },
        Status: 'Online'
    });
};