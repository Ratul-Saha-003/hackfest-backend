const express = require('express');
const mongoose = require('mongoose');

const multer = require('multer');
const storage = multer.memoryStorage(); 
const upload = multer({ storage }); 
const cors = require('cors')

// const cloudinary = require('./utils/cloudinary');
const Event = require('./models/event');

require('dotenv').config();

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

// Basic route
app.get('/', (req, res) => {
  res.send('Hello from Node server 👋');
});

app.get('/api/events', async (req, res) => {
    try {
      const events = await Event.find();
      res.status(201).json({ events });
    } catch (error) {
      console.error('Error fetching events:', error);
      res.status(500).json({ error: 'Failed to fetch events' });
    }
  });
// Test route to create a new document
app.post('/api/events', async (req, res) => {
    console.log(req.body);
    try {
      const { name, date, description, location, map_url, blocks } = req.body;
  
      const newEvent = new Event({
        name,
        date,
        description,
        location,
        map_url,
        blocks
      });
  
      await newEvent.save();
  
      res.status(201).json({ message: 'Event created successfully', event: newEvent });
    } catch (error) {
      console.error('Error creating event:', error);
      res.status(500).json({ error: 'Failed to create event' });
    }
  });
  

// const router = express.Router();
// const storage = multer.memoryStorage();


app.post('/api/upload', upload.single('image'), async (req, res) => {
  try {
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
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
