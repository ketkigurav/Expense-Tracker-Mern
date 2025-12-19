const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true, // Usernames must be unique
    trim: true,
    minlength: 3
  },
  password: {
    type: String,
    required: true,
    minlength: 6 // Enforce a minimum password length
  }
});

module.exports = mongoose.model('User', userSchema);