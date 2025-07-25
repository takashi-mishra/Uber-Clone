const captionModel = require('../models/CaptinModel');
const captionService = require('../services/captionService');
const { validationResult } = require('express-validator');
const blacklistToken = require('../models/BlacklistModel');

module.exports.registerCaption = async (req, res, next) => {
const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ errors: error.array() });
    }
    const { fullname, email, password, vehicle , Status } = req.body;
    
    const captionAleradyExist = await captionModel.findOne({ email });
    if (captionAleradyExist) {
        return res.status(400).json({ message: 'Caption with this email already exists' });
    }

    const hasedPassword = await captionModel.hashPassword(password);
    if (!hasedPassword) {
        return res.status(500).json({ message: 'Error hashing password' });
    }

    try {
        const caption = await captionService.createCaption({
            fullname,
            email,
            password: hasedPassword,
            Status,
            vehicleType: vehicle.vehicleType,
            capacity: vehicle.capacity,
            color: vehicle.color,
            plateNumber: vehicle.plateNumber
        });
        const token = await caption.genrateAuthToken();
        if (!token) {
            return res.status(500).json({ message: 'Error generating token' });
        }  
         res.cookie("token",token); 
        return res.status(201).json({ caption, token });
    } catch (err) {
        return next(err);
    }
}

module.exports.loginCaption = async (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ errors: error.array() });
    }

    const { email, password } = req.body;
    try {
        const caption =  await captionModel.findOne({ email }).select('+password +role'); // Include password in the query result
        if (!caption) {
            return res.status(401).json({ message: 'Caption and email does not match' });
        }
        const isPasswordValid = await caption.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Caption and email does not match' });
        }
        const token = await caption.genrateAuthToken();
        if (!token) {
            return res.status(500).json({ message: 'Error generating token' });
        }

        res.cookie("token", token);
        return res.status(200).json({ caption, token });
    } catch (err) {
        return next(err);
    }
}

module.exports.getCaptionProfile = async (req, res, next) => {
    try {
        const caption = req.caption; // The caption is attached to the request object by the middleware
        if (!caption) {
            return res.status(404).json({ message: 'Caption not found' });
        }
        return res.status(200).json({ caption });
    } catch (err) {
        return next(err);
    }
} 

module.exports.logoutCaption = async (req, res, next) => {
    try {
        const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
 // Get the token from cookies
        if (!token) {
            return res.status(401).json({ message: 'Authentication token is missing' });
        }
        
       await blacklistToken.create({token}); // Blacklist the token
        res.clearCookie("token"); // Clear the cookie
        return res.status(200).json({ message: 'Logged out successfully' });
    } catch (err) {
        return next(err);
    }
}
