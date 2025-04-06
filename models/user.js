const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
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
    required: false,
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