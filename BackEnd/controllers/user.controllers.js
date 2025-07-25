const userModel = require('../models/user.model');
const userService = require('../services/userServices');
const{validationResult} = require('express-validator');
const blacklistToken = require('../models/BlacklistModel');

module.exports.registersUser = async (req,res,next)=>{
   const error = validationResult(req);
   if(!error.isEmpty()){
       return res.status(400).json({errors: error.array()});
   }
   const { fullname, email, password } = req.body;
    const userAlreadyExist = await userModel.findOne({email});
    if(userAlreadyExist){return res.status(400).json({ message: 'User with this email already exists' });}
    
   const hasedPassword = await userModel.hashPassword(password);
   if (!hasedPassword) {
       return res.status(500).json({ message: 'Error hashing password' });
   }
   try {
       const user = await userService.createUser({ fullname, email, password: hasedPassword });
       const token = await user.genrateAuthToken();
       if (!token) {
           return res.status(500).json({ message: 'Error generating token' });
       }
       res.cookie("token",token);
       return res.status(201).json({ user, token });
   } catch (error) {
       return next(error);
   }
}

module.exports.loginUser = async(req,res,next)=>{
  const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({errors: error.array()});
    }

    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({
            email
        }).select('+password'); // Include password in the query result
        if (!user) {
            return res.status(401).json({ message: 'User and email does not match' });
        }
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'User and email does not match' });
        }
        const token = await user.genrateAuthToken();
        if (!token) {
            return res.status(500).json({ message: 'Error generating token' });
        }
         res.cookie("token",token);
        return res.status(200).json({ user, token });
    } catch (error) {
        return next(error);
    }
}

module.exports.getUserprofile = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Convert to plain JS object
    return res.status(200).json({ user: user.toObject() });
  } catch (err) {
    return next(err);
  }
};


module.exports.logoutUser = async(req,res,next) => {
 const token = req.cookies?.token || req.headers.authorization?.split(" ")[1]; // Get the token from cookies
  if (!token) {
      return res.status(401).json({ message: 'Authentication token is missing' });
  }
  try {
      await blacklistToken.create({token}); // Blacklist the token
      res.clearCookie('token'); // Clear the cookie
      return res.status(200).json({ message: 'User logged out successfully' });
  } catch (error) {
      return next(error);
  }
}