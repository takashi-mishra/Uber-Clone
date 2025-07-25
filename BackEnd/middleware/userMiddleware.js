const userModel = require('../models/user.model');
const captionModel = require('../models/CaptinModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
 const blacklistModel = require('../models/BlacklistModel'); // Import the blacklist model

module.exports.authUser = async(req,res,next) =>{
    const token = req.cookies?.token || req.headers.authorization?.split(" ")[1]; // Get the token from cookies
    if (!token) {
        return res.status(401).json({ message: 'Authentication token is missing' });
    }
   
    const blacklistedToken = await blacklistModel.findOne({ token }); // Check if the token is blacklisted
    if (blacklistedToken) {
        return res.status(401).json({ message: 'Authentication token is blacklisted' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
        const user = await userModel.findById(decoded._id); // Find the user by ID from the token
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        req.user = user; // Attach user to request object
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        return res.status(401).json({ message: 'Invalid authentication token' });
    }
}

module.exports.authCaption = async(req,res,next)=>{
   const token = req.cookies?.token || req.headers.authorization?.split(" ")[1]; // Get the token from cookies
    if (!token) {
        return res.status(401).json({ message: 'Authentication token is missing' });
    }
   
    const blacklistedToken = await blacklistModel.findOne({ token }); // Check if the token is blacklisted
    if (blacklistedToken) {
        return res.status(401).json({ message: 'Authentication token is blacklisted' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
        console.log(decoded);
      
        const caption = await captionModel.findById(decoded._id); // Find the caption by ID from the token
         // Find the caption by ID from the token
        if (!caption) {
            return res.status(404).json({ message: 'Caption not found' });
        }
        req.caption = caption; // Attach caption to request object  
          return next(); // Proceed to the next middleware or route handler
        } catch (error) {
        return res.status(401).json({ message: 'Invalid authentication token' });
        }
}