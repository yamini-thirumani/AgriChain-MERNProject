const express = require('express');
const router = express.Router();
const { isAuthenticated, checkRole } = require('../utils/auth');
const RetailerListing = require('../models/RetailerListing');
const TransportJob = require('../models/TransportJob');

// Middleware to ensure user is a retailer
router.use(isAuthenticated);
router.use(checkRole(['retailer']));

// Dashboard
router.get('/dashboard', async (req, res) => {
  try {
    const activeDeliveries = await TransportJob.find({
      retailerId: req.user._id,
      status: { $ne: 'Delivered' }
    }).populate('cropId').populate('farmerId', 'username').populate('transporterId', 'username');

    const listings = await RetailerListing.find({ retailerId: req.user._id })
      .populate('cropId');

    res.render('retailer/dashboard', {
      activeDeliveries,
      listings
    });
  } catch (error) {
    req.flash('error_msg', 'Error loading dashboard');
    res.redirect('/');
  }
});

// Mark delivery as received and create listing
router.post('/deliveries/:id/receive', async (req, res) => {
  try {
    const { price } = req.body;
    const delivery = await TransportJob.findOne({
      _id: req.params.id,
      retailerId: req.user._id,
      status: 'Delivered'
    });

    if (!delivery) {
      req.flash('error_msg', 'Delivery not found or not ready');
      return res.redirect('/retailer/dashboard');
    }

    const listing = new RetailerListing({
      cropId: delivery.cropId,
      retailerId: req.user._id,
      price
    });

    await listing.save();
    req.flash('success_msg', 'Product listed successfully');
    res.redirect('/retailer/dashboard');
  } catch (error) {
    req.flash('error_msg', 'Error creating listing');
    res.redirect('/retailer/dashboard');
  }
});

// Rate transporter
router.post('/deliveries/:id/rate', async (req, res) => {
  try {
    const { rating } = req.body;
    const delivery = await TransportJob.findOneAndUpdate(
      { _id: req.params.id, retailerId: req.user._id },
      { rating },
      { new: true }
    );

    if (!delivery) {
      req.flash('error_msg', 'Delivery not found');
      return res.redirect('/retailer/dashboard');
    }

    req.flash('success_msg', 'Rating submitted successfully');
    res.redirect('/retailer/dashboard');
  } catch (error) {
    req.flash('error_msg', 'Error submitting rating');
    res.redirect('/retailer/dashboard');
  }
});

// Update listing availability
router.put('/listings/:id', async (req, res) => {
  try {
    const { isAvailable } = req.body;
    const listing = await RetailerListing.findOneAndUpdate(
      { _id: req.params.id, retailerId: req.user._id },
      { isAvailable },
      { new: true }
    );

    if (!listing) {
      req.flash('error_msg', 'Listing not found');
      return res.redirect('/retailer/dashboard');
    }

    req.flash('success_msg', 'Listing updated successfully');
    res.redirect('/retailer/dashboard');
  } catch (error) {
    req.flash('error_msg', 'Error updating listing');
    res.redirect('/retailer/dashboard');
  }
});

module.exports = router; 