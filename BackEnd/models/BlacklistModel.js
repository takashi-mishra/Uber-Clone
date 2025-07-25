// Description: This model defines a schema for storing blacklisted tokens in MongoDB.
const mongoose = require('mongoose');
const blacklistSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: '24h', // Automatically remove the document after 24 hours
  },
});
const Blacklist = mongoose.model('Blacklist', blacklistSchema);
module.exports = Blacklist;