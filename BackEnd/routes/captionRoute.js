const express = require('express');
const router = express.Router();
const {body} = require('express-validator');
const captionConteroller = require('../controllers/captionController'); // Import the caption controller
const userMiddleware = require('../middleware/userMiddleware'); // Import the user middleware for authentication

router.post('/register',[
    body('fullname').isLength({ min: 3 }).withMessage('Full name must be at least 3 characters long'),
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('vehicle.color').isLength({ min: 3 }).withMessage('Vehicle color must be at least 3 characters long'),
    body('vehicle.capacity').isInt({ min: 1 }).withMessage('Vehicle capacity must be at least 1'),
    body('vehicle.vehicleType').isIn(['Car', 'Bike', 'Auto']).withMessage('Invalid vehicle type'),
    body('vehicle.plateNumber').isLength({ min: 5 }).withMessage('Plate number must be at least 5 characters long')
    ], captionConteroller.registerCaption);

    router.post('/login',[
        body('email').isEmail().withMessage('Invalid email format'), 
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
    ],captionConteroller.loginCaption);

    router.get('/profile', userMiddleware.authCaption, captionConteroller.getCaptionProfile );
    router.get('/logout', userMiddleware.authCaption, captionConteroller.logoutCaption);

module.exports = router;