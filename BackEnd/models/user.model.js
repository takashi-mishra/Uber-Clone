const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema =new mongoose.Schema({
    fullname :{
        type : String,
        required: true,
        trim: true,
        minlength : [3, 'Full name must be at least 3 characters long'],

    },
    email :{
        type : String,
        required: true,
        unique: true,
        trim: true,
        minlength : [5, 'Email must be at least 5 characters long'],
    },

    password :{
        type : String,
        required: true,
        select : false, // Exclude password from queries by default
    },
    socketId : {
        type: String,
    },
    role: {
    type: String,
    enum: ['caption', 'user'],
    default: 'user'
  }
}) 

userSchema.methods.genrateAuthToken = async function(){
    const token = jwt.sign({ _id: this._id, role: this.role  }, process.env.JWT_SECRET, {expiresIn: '24h'});
    return token;
}

userSchema.methods.comparePassword = async function(password){
   return await bcrypt.compare(password, this.password);
}

userSchema.statics.hashPassword = async function(password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
    
}
const userModel = mongoose.model('User', userSchema);
module.exports = userModel;

 

