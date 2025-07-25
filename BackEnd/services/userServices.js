const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



module.exports.createUser = async ({ fullname,email,password}) => {
    if (!fullname || !email || !password) {
        throw new Error('All fields are required');
    }

    const user = userModel.create({
        fullname,
        email,
        password
    });
    
    return user;
}
