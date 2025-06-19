const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../utils/auth');
const TransportJob = require('../models/TransportJob');

// Home page
router.get('/', (req, res) => {
  res.render('index', {
    title: 'AgriChain - Agricultural Supply Chain Management',
    user: req.user
  });
});

// Role-specific pages (public access)
router.get('/farmer-overview', (req, res) => {
  res.render('farmer', {
    user: req.user,
    success_msg: req.flash('success_msg'),
    error_msg: req.flash('error_msg')
  });
});

router.get('/transporter-overview', async (req, res) => {
  try {
    let activeDeliveries = [];
    let deliveryHistory = [];
    
    if (req.user && req.user.role === 'transporter') {
      // Get active deliveries
      activeDeliveries = await TransportJob.find({ 
        transporterId: req.user._id,
        status: { $in: ['Picked Up', 'In Transit'] }
      }).populate('cropId').populate('farmerId').populate('retailerId');

      // Get delivery history
      deliveryHistory = await TransportJob.find({
        transporterId: req.user._id,
        status: 'Delivered'
      }).populate('cropId').populate('farmerId').populate('retailerId');
    }

    res.render('transport', {
      user: req.user,
      activeDeliveries,
      deliveryHistory,
      success_msg: req.flash('success_msg'),
      error_msg: req.flash('error_msg')
    });
  } catch (error) {
    console.error('Transporter overview error:', error);
    res.render('transport', {
      user: req.user,
      activeDeliveries: [],
      deliveryHistory: [],
      success_msg: req.flash('success_msg'),
      error_msg: req.flash('error_msg')
    });
  }
});

router.get('/retailer-overview', (req, res) => {
  res.render('retailer', {
    user: req.user,
    success_msg: req.flash('success_msg'),
    error_msg: req.flash('error_msg')
  });
});

router.get('/consumer-overview', (req, res) => {
  res.render('consumer', {
    user: req.user,
    success_msg: req.flash('success_msg'),
    error_msg: req.flash('error_msg')
  });
});

// Keep original routes for backward compatibility
router.get('/farmer', (req, res) => {
  res.render('farmer', {
    user: req.user,
    success_msg: req.flash('success_msg'),
    error_msg: req.flash('error_msg')
  });
});

router.get('/transporter', async (req, res) => {
  try {
    let activeDeliveries = [];
    let deliveryHistory = [];
    
    if (req.user && req.user.role === 'transporter') {
      // Get active deliveries
      activeDeliveries = await TransportJob.find({ 
        transporterId: req.user._id,
        status: { $in: ['Picked Up', 'In Transit'] }
      }).populate('cropId').populate('farmerId').populate('retailerId');

      // Get delivery history
      deliveryHistory = await TransportJob.find({
        transporterId: req.user._id,
        status: 'Delivered'
      }).populate('cropId').populate('farmerId').populate('retailerId');
    }

    res.render('transport', {
      user: req.user,
      activeDeliveries,
      deliveryHistory,
      success_msg: req.flash('success_msg'),
      error_msg: req.flash('error_msg')
    });
  } catch (error) {
    console.error('Transporter route error:', error);
    res.render('transport', {
      user: req.user,
      activeDeliveries: [],
      deliveryHistory: [],
      success_msg: req.flash('success_msg'),
      error_msg: req.flash('error_msg')
    });
  }
});

router.get('/retailer', (req, res) => {
  res.render('retailer', {
    user: req.user,
    success_msg: req.flash('success_msg'),
    error_msg: req.flash('error_msg')
  });
});

router.get('/consumer', (req, res) => {
  res.render('consumer', {
    user: req.user,
    success_msg: req.flash('success_msg'),
    error_msg: req.flash('error_msg')
  });
});

// Protected routes for adding products
router.get('/farmer/add', isAuthenticated, (req, res) => {
  res.render('farmer', {
    user: req.user,
    success_msg: req.flash('success_msg'),
    error_msg: req.flash('error_msg')
  });
});

router.get('/retailer/add', isAuthenticated, (req, res) => {
  res.render('retailer', {
    user: req.user,
    success_msg: req.flash('success_msg'),
    error_msg: req.flash('error_msg')
  });
});

router.get('/transporter/add', isAuthenticated, (req, res) => {
  res.render('transport', {
    user: req.user,
    success_msg: req.flash('success_msg'),
    error_msg: req.flash('error_msg')
  });
});

router.get('/consumer/add', isAuthenticated, (req, res) => {
  res.render('consumer', {
    user: req.user,
    success_msg: req.flash('success_msg'),
    error_msg: req.flash('error_msg')
  });
});

// Catalog page
router.get('/catalog', async (req, res) => {
  try {
    const Crop = require('../models/Crop');
    const products = await Crop.find({ isAvailable: true })
      .populate('farmerId', 'username')
      .sort({ createdAt: -1 });
      
    res.render('catalog', { 
      products, 
      user: req.user,
      success_msg: req.flash('success_msg'),
      error_msg: req.flash('error_msg')
    });
  } catch (error) {
    console.error('Catalog error:', error);
    req.flash('error_msg', 'Error loading catalog');
    res.redirect('/');
  }
});

// Product Details page
router.get('/catalog/:id', async (req, res) => {
  try {
    const Crop = require('../models/Crop');
    const product = await Crop.findById(req.params.id)
      .populate('farmerId', 'username');
      
    if (!product) {
      req.flash('error_msg', 'Product not found');
      return res.redirect('/catalog');
    }
    
    res.render('product-details', { 
      product,
      user: req.user,
      success_msg: req.flash('success_msg'),
      error_msg: req.flash('error_msg')
    });
  } catch (error) {
    console.error('Product details error:', error);
    req.flash('error_msg', 'Error loading product details');
    res.redirect('/catalog');
  }
});

// Role Exploration Routes
router.get('/explore/farmer', (req, res) => {
    res.render('explore-role', {
        title: 'Farmer Role',
        subtitle: 'Join our community of farmers and connect directly with retailers and consumers',
        role: 'farmer',
        features: [
            {
                icon: 'fas fa-seedling',
                title: 'Crop Management',
                description: 'Easily manage your crops, track growth, and monitor harvest dates'
            },
            {
                icon: 'fas fa-chart-line',
                title: 'Market Insights',
                description: 'Access real-time market prices and demand trends'
            },
            {
                icon: 'fas fa-handshake',
                title: 'Direct Sales',
                description: 'Connect directly with retailers and consumers, eliminating middlemen'
            },
            {
                icon: 'fas fa-truck',
                title: 'Logistics Support',
                description: 'Coordinate with transporters for efficient delivery of your produce'
            }
        ],
        benefits: [
            'Higher profit margins through direct sales',
            'Real-time market insights and price trends',
            'Efficient crop management and tracking',
            'Direct communication with buyers',
            'Secure payment processing',
            'Professional profile and reputation building'
        ]
    });
});

router.get('/explore/transporter', (req, res) => {
    res.render('explore-role', {
        title: 'Transporter Role',
        subtitle: 'Become a trusted logistics partner in our agricultural supply chain',
        role: 'transporter',
        features: [
            {
                icon: 'fas fa-route',
                title: 'Route Optimization',
                description: 'Smart route planning for efficient deliveries'
            },
            {
                icon: 'fas fa-truck-loading',
                title: 'Load Management',
                description: 'Manage multiple deliveries and track shipments'
            },
            {
                icon: 'fas fa-map-marked-alt',
                title: 'Real-time Tracking',
                description: 'Track shipments and provide updates to all parties'
            },
            {
                icon: 'fas fa-hand-holding-usd',
                title: 'Secure Payments',
                description: 'Get paid securely for your transportation services'
            }
        ],
        benefits: [
            'Steady flow of transportation jobs',
            'Flexible scheduling and route planning',
            'Secure and timely payments',
            'Professional profile building',
            'Direct communication with farmers and retailers',
            'Opportunity to expand your business'
        ]
    });
});

router.get('/explore/retailer', (req, res) => {
    res.render('explore-role', {
        title: 'Retailer Role',
        subtitle: 'Connect with farmers and offer quality produce to your customers',
        role: 'retailer',
        features: [
            {
                icon: 'fas fa-store',
                title: 'Direct Sourcing',
                description: 'Source fresh produce directly from farmers'
            },
            {
                icon: 'fas fa-box',
                title: 'Inventory Management',
                description: 'Track and manage your inventory efficiently'
            },
            {
                icon: 'fas fa-tags',
                title: 'Price Management',
                description: 'Set competitive prices and manage margins'
            },
            {
                icon: 'fas fa-users',
                title: 'Customer Base',
                description: 'Build and maintain your customer relationships'
            }
        ],
        benefits: [
            'Access to fresh, quality produce',
            'Direct communication with farmers',
            'Competitive pricing and better margins',
            'Efficient inventory management',
            'Reliable delivery through trusted transporters',
            'Business growth opportunities'
        ]
    });
});

router.get('/explore/consumer', (req, res) => {
    res.render('explore-role', {
        title: 'Consumer Role',
        subtitle: 'Get fresh, quality produce directly from farmers',
        role: 'consumer',
        features: [
            {
                icon: 'fas fa-shopping-basket',
                title: 'Fresh Produce',
                description: 'Access fresh, quality produce directly from farmers'
            },
            {
                icon: 'fas fa-search',
                title: 'Product Discovery',
                description: 'Browse and discover a variety of fresh produce'
            },
            {
                icon: 'fas fa-truck',
                title: 'Home Delivery',
                description: 'Get your orders delivered to your doorstep'
            },
            {
                icon: 'fas fa-star',
                title: 'Reviews & Ratings',
                description: 'Share your experience and read others\' reviews'
            }
        ],
        benefits: [
            'Fresh, quality produce',
            'Transparent pricing',
            'Convenient home delivery',
            'Direct connection with farmers',
            'Product reviews and ratings',
            'Regular updates on new products'
        ]
    });
});

module.exports = router; 