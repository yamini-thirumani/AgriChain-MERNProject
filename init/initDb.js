const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('../models/User');
const Catalog = require('../models/Catalog');
const RetailerListing = require('../models/RetailerListing');
const TransportJob = require('../models/TransportJob');
const Review = require('../models/Review');

// Sample data
const sampleUsers = [
  {
    username: 'farmer1',
    email: 'farmer1@example.com',
    password: 'password123',
    role: 'farmer'
  },
  {
    username: 'transporter1',
    email: 'transporter1@example.com',
    password: 'password123',
    role: 'transporter'
  },
  {
    username: 'retailer1',
    email: 'retailer1@example.com',
    password: 'password123',
    role: 'retailer'
  },
  {
    username: 'consumer1',
    email: 'consumer1@example.com',
    password: 'password123',
    role: 'consumer'
  }
];

const sampleCrops = [
  {
    name: 'Organic Tomatoes',
    image: '/images/tomatoes.jpg',
    price: 2.50,
    location: 'California',
    isAvailable: true
  },
  {
    name: 'Fresh Lettuce',
    image: '/images/lettuce.jpg',
    price: 1.75,
    location: 'Arizona',
    isAvailable: true
  },
  {
    name: 'Sweet Corn',
    image: '/images/corn.jpg',
    price: 3.00,
    location: 'Iowa',
    isAvailable: true
  }
];

// Initialize database
async function initializeDb() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/agrichain', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Catalog.deleteMany({}),
      RetailerListing.deleteMany({}),
      TransportJob.deleteMany({}),
      Review.deleteMany({})
    ]);
    console.log('Cleared existing data');

    // Create users
    const users = await User.create(sampleUsers);
    console.log('Created sample users');

    // Create crops
    const crops = await Catalog.create(
      sampleCrops.map(crop => ({
        ...crop,
        farmerId: users[0]._id // Assign to first farmer
      }))
    );
    console.log('Created sample crops');

    // Create some retailer listings
    await RetailerListing.create({
      cropId: crops[0]._id,
      retailerId: users[2]._id, // Assign to retailer
      price: 3.50,
      isAvailable: true
    });
    console.log('Created sample retailer listings');

    // Create some transport jobs
    await TransportJob.create({
      cropId: crops[1]._id,
      farmerId: users[0]._id,
      retailerId: users[2]._id,
      transporterId: users[1]._id,
      status: 'In Transit'
    });
    console.log('Created sample transport jobs');

    // Create some reviews
    await Review.create({
      cropId: crops[0]._id,
      consumerId: users[3]._id,
      rating: 5,
      comment: 'Excellent quality!'
    });
    console.log('Created sample reviews');

    console.log('Database initialized successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

initializeDb(); 