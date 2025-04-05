const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true, // Assuming it's unique across users
  },
  name: {
    type: String,
    required: true,
    default: '',
  },
  email: {
    type: String,
    required: true,
    default: '',
  },
  password: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    default: '',
  },
  joined: {
    type: Date,
    required: true,
    default: Date.now,
  },
  posts: {
    type: Number,
    required: true,
    default: 0,
  },
});

module.exports = mongoose.model('User', userSchema);