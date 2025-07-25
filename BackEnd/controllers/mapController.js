const mapServices = require('../services/Maps');
const {validationResult} = require('express-validator')

// 📍 Controller: Get Coordinates from Address
module.exports.getCoordinates = async (req, res, next) => {
    const errors = validationResult(req);
 if(!errors.isEmpty()){
    return res.status(400).json({errors:errors.array()})
 }

    const { address } = req.query;

    if (!address) {
        return res.status(400).json({ message: 'Address is required' });
    }

    try {
        const coordinates = await mapServices.getAddressCoordinates(address);
        res.status(200).json(coordinates)

    } catch (error) {
        console.error('[Get Coordinates] Error:', error.message || error);
        return res.status(500).json({
            message: 'Error fetching coordinates',
            error: error.message || 'Internal Server Error'
        });
    }
};

// 🧭 Controller: Get Distance between Two Locations
module.exports.getDistance = async (req, res, next) => {
    const { origin, destination } = req.query;

    if (!origin || !destination) {
        return res.status(400).json({ message: 'Origin and destination are required' });
    }

    try {
        const distanceData = await mapServices.getDistances(origin, destination);
        return res.status(200).json(distanceData);
    } catch (error) {
        console.error('[Get Distance] Error:', error.message || error);
        return res.status(500).json({
            message: 'Error fetching distance',
            error: error.message || 'Internal Server Error'
        });
    }
};

module.exports.getAutoSuggestions = async(req,res,next)=>{
try {
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({errors:error.array()});
        }
        const { input } = req.query;
        const suggestions = await mapServices.getAutoSuggestions(input);
        return res.status(200).json({suggestions});
} catch (error) {
    console.error(error);
    throw error;
}
}