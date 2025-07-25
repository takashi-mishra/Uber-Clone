const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const userController = require('../controllers/user.controllers');
const userMiddleware = require('../middleware/userMiddleware');

router.post('/register',[
    body('email').isEmail().withMessage('Please enter a valid email address'),
    body('fullname').isLength({ min: 3 }).withMessage('Full name must be at least 3 characters long'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
],
userController.registersUser
)

router.post("/login",[
    body('email').isEmail().withMessage('Please enter a valid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
],
userController.loginUser
)

router.get('/profile',userMiddleware.authUser, userController.getUserprofile);
router.get("/logout",userMiddleware.authUser,userController.logoutUser);


module.exports = router;