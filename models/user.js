const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
    default: '',
  },
  email: {
    type: String,
    required: false,
    default: '',
  },
  password: {
    type: String,
    required: false,
  },
  image: {
    type: String,
    required: false,
    default: '',
  },
  joined: {
    type: Date,
    required: false,
    default: Date.now,
  },
  posts: {
    type: Number,
    required: false,
    default: 0,
  },
});

module.exports = mongoose.model('User', userSchema);