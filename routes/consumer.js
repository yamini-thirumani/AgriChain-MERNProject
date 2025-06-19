const express = require('express');
const router = express.Router();
const { isAuthenticated, checkRole } = require('../utils/auth');
const RetailerListing = require('../models/RetailerListing');
const Review = require('../models/Review');

// Middleware to ensure user is a consumer
router.use(isAuthenticated);
router.use(checkRole(['consumer']));

// Dashboard
router.get('/dashboard', async (req, res) => {
  try {
    const availableProducts = await RetailerListing.find({ isAvailable: true })
      .populate({
        path: 'cropId',
        populate: { path: 'farmerId', select: 'username' }
      })
      .populate('retailerId', 'username');

    const myReviews = await Review.find({ consumerId: req.user._id })
      .populate('cropId');

    res.render('consumer/dashboard', {
      availableProducts,
      myReviews
    });
  } catch (error) {
    req.flash('error_msg', 'Error loading dashboard');
    res.redirect('/');
  }
});

// Search products
router.get('/search', async (req, res) => {
  try {
    const { query, location } = req.query;
    let searchQuery = { isAvailable: true };

    if (query) {
      searchQuery['cropId.name'] = { $regex: query, $options: 'i' };
    }
    if (location) {
      searchQuery['cropId.location'] = { $regex: location, $options: 'i' };
    }

    const products = await RetailerListing.find(searchQuery)
      .populate({
        path: 'cropId',
        populate: { path: 'farmerId', select: 'username' }
      })
      .populate('retailerId', 'username');

    res.render('consumer/search', { products, query, location });
  } catch (error) {
    req.flash('error_msg', 'Error searching products');
    res.redirect('/consumer/dashboard');
  }
});

// Submit review
router.post('/reviews/:cropId', async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const review = new Review({
      cropId: req.params.cropId,
      consumerId: req.user._id,
      rating,
      comment
    });

    await review.save();
    req.flash('success_msg', 'Review submitted successfully');
    res.redirect('/consumer/dashboard');
  } catch (error) {
    req.flash('error_msg', 'Error submitting review');
    res.redirect('/consumer/dashboard');
  }
});

// View product details
router.get('/products/:id', async (req, res) => {
  try {
    const product = await RetailerListing.findById(req.params.id)
      .populate({
        path: 'cropId',
        populate: { path: 'farmerId', select: 'username' }
      })
      .populate('retailerId', 'username');

    const reviews = await Review.find({ cropId: product.cropId._id })
      .populate('consumerId', 'username');

    res.render('consumer/product-details', {
      product,
      reviews
    });
  } catch (error) {
    req.flash('error_msg', 'Error loading product details');
    res.redirect('/consumer/dashboard');
  }
});

module.exports = router; 