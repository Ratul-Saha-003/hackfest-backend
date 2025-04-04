const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  description: {
    type: String
  },
  location: {
    type: String,
    required: true
  },
  map_url: {
    type: String
  },
  blocks: [
    {
      topLeft: {
        x: { type: Number },
        y: { type: Number },
      },
      bottomRight: {
        x: { type: Number },
        y: { type: Number },
      },
    },
  ],

}, {
  timestamps: true // adds createdAt and updatedAt fields
});

module.exports = mongoose.model('Event', eventSchema);
