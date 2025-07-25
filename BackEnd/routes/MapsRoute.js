const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const userMiddleware = require('../middleware/userMiddleware'); 
const mapController = require('../controllers/mapController'); // Import the map controller
const {query} = require('express-validator');


router.get('/coordinates',userMiddleware.authCaption,
    query('address').notEmpty().withMessage('Address is required'),
    mapController.getCoordinates); // Route to get coordinates from address

    router.post('/get-distance',userMiddleware.authCaption,
    query('origin').notEmpty().withMessage('Origin is required'),       
    query('destination').notEmpty().withMessage('Destination is required'),
    mapController.getDistance); // Route to get distance between two locations

router.get('/get-suggestions',
    query('input').isString().isLength({min : 3}),
     userMiddleware.authUser, mapController.getAutoSuggestions)

module.exports = router;