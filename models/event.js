const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    platform: String,
    post_id: String,
    username: String,
    text: String,
    timestamp: mongoose.Schema.Types.Mixed,
    likes: Number,
    comments: Number,
    shares: Number,
    url: mongoose.Schema.Types.Mixed,
  });

const CommunityPostSchema = new mongoose.Schema({
    id: String,
    title: String,
    summary: String,
    body: String,
    imageURL: String,
    postTime: Date,
    reacts: Number,
    views: Number,
    isPoll: Boolean,
  });

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
  passkey: {
    type: String
  },
  category: {
    type: String
  },
  location: {
    type: String,
    required: true
  },
  map_url: {
    type: String
  },
  alerts: [{ type: String }], 
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
      problems: {
        type: Map,
        of: Number,
        default: {}
      }    
    },
  ],
  hashtags: [{ type: String }], 
  posts: [PostSchema],
  communityPosts: [CommunityPostSchema],
}, {
  timestamps: true // adds createdAt and updatedAt fields
});

module.exports = mongoose.model('Event', eventSchema);
