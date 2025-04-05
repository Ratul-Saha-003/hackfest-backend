require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const storage = multer.memoryStorage(); 
const upload = multer({ storage }); 
const cors = require('cors')
// const { GoogleGenerativeAI } = require("@google/generative-ai");

// const { getHashtags } = require('./utils/gemini');
const Event = require('./models/event');
const User = require('./models/user');



const app = express();
app.use(cors())
app.use(express.json()); // for parsing application/json

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));


  const { v2: cloudinary } = require('cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
async function getHashtags(event) {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  
    const prompt = `
    Generate a list of relevant hashtags for an event with the following details:
    - Name: ${event.name}
    - Description: ${event.description}
    - Location: ${event.location}
    - Date: ${event.date}

    Return only a JavaScript array of strings (hashtags), separated by commas.
    Example: ["#TechEvent", "#AI", "#Innovation"]
    No explanation, no markdown, just the array.
  `;
  
    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      const match = text.match(/\[\s*"(?:[^"\\]|\\.)*"(?:\s*,\s*"(?:[^"\\]|\\.)*")*\s*\]/);

  
      if (match) {
        const hashtagsArray = JSON.parse(match[0]);
        return hashtagsArray;
      } else {
        console.warn("No valid hashtag array found in response:", text);
        return [];
      }// Convert response to an array
    } catch (error) {
      console.error("Error generating hashtags:", error);
      return [];
    }
  }


// Basic route
app.get('/', (req, res) => {
  res.send('Hello from Node server 👋');
});

app.get('/api/users', async (req, res) => {
    try {
      const users = await User.find();
      res.status(200).json({ users });
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Failed to fetch user' });
    }
  });

  app.post('/api/users', async (req, res) => {
    try {
        const newUser = new User({...req.body}); 
        await newUser.save();
      res.status(200).json({ newUser });
    } catch (error) {
      console.error('Error posting user:', error);
      res.status(500).json({ error: 'Failed to post user' });
    }
  });

app.get('/api/events', async (req, res) => {
    try {
      const events = await Event.find();
      res.status(200).json({ events });
    } catch (error) {
      console.error('Error fetching events:', error);
      res.status(500).json({ error: 'Failed to fetch events' });
    }
  });
// Test route to create a new document
app.post('/api/events', async (req, res) => {
    // console.log(req.body);
    try {
      const { name, date, description, location, map_url, blocks, category } = req.body;
      const hashtags = await getHashtags({name,date,description,location});
    //   console.log(hashtags);
      const newEvent = new Event({
        name,
        date,
        description,
        location,
        map_url,
        blocks,
        hashtags,
        category
      }); 
      await newEvent.save();
  
      res.status(201).json({ message: 'Event created successfully', event: newEvent });
    } catch (error) {
      console.error('Error creating event:', error);
      res.status(500).json({ error: 'Failed to create event' });
    }
  });

  app.post('/api/events/addPost', async (req, res) => {
    // console.log(req.body);
    try {
      const { info, eventId } = req.body;

    const updateEvent = await Event.findByIdAndUpdate(
        eventId,
        { $push: { posts: info } },
      );
  
      res.status(201).json({ message: 'Post added successfully', event: updateEvent });
    } catch (error) {
      console.error('Error adding post:', error);
      res.status(500).json({ error: 'Failed to add post' });
    }
  });

  app.post('/api/events/updatePost', async (req, res) => {
    // console.log(req.body);
    try {
      const { info, eventId, postId } = req.body;

      const result = await Event.updateOne(
        { _id: eventId, "posts.id": postId },
        {
          $set: info
        }
      );
    
      res.status(201).json({ message: 'Post updated successfully', event: result });
    } catch (error) {
      console.error('Error updating post:', error);
      res.status(500).json({ error: 'Failed to update post' });
    }
  });

  app.post('/api/event/problem', async (req, res) => {
    // console.log(req.body);
    try {
      const { data, eventId } = req.body;
      const problemPath = `blocks.${data.name-1}.problems.${data.issue}`;

      const result = await Event.updateOne(
        { _id: eventId },
        {
          $inc: {
            [problemPath]: 1
          }
        }
      );
    
      res.status(201).json({ message: 'Problem updated successfully', event: result });
    } catch (error) {
      console.error('Error updatng problem:', error);
      res.status(500).json({ error: 'Failed to update problem' });
    }
  });





app.post('/api/upload', upload.single('image'), async (req, res) => {
  try {
    console.log("kjssknvk")
    const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

    const result = await cloudinary.uploader.upload(base64Image, {
      folder: 'events',
    });

    res.json({ url: result.secure_url });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Failed to upload image' });
  }
})



// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running hello on port ${PORT}`));
