const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../utils/auth');
const Crop = require('../models/Crop');
const TransportJob = require('../models/TransportJob');
const Review = require('../models/Review');
const Farmer = require('../models/Farmer');

// Middleware to check if user is a farmer
const isFarmer = (req, res, next) => {
    if (req.user && req.user.role === 'farmer') {
        next();
    } else {
        req.flash('error_msg', 'Access denied. Farmers only.');
        res.redirect('/');
    }
};

// Middleware to validate crop data
const validateCrop = (req, res, next) => {
    const { cropName, cropVariety, sowingDate, harvestingDate, area, irrigationType, marketPrice } = req.body;
    
    if (!cropName || !cropVariety || !sowingDate || !harvestingDate || !area || !irrigationType || !marketPrice) {
        req.flash('error_msg', 'All fields are required');
        return res.redirect('/farmer/dashboard');
    }

    if (new Date(harvestingDate) <= new Date(sowingDate)) {
        req.flash('error_msg', 'Harvesting date must be after sowing date');
        return res.redirect('/farmer/dashboard');
    }

    next();
};

// Farmer Dashboard
router.get('/dashboard', isAuthenticated, isFarmer, async (req, res) => {
    try {
        const farmer = await Farmer.findOne({ user: req.user._id });
        res.render('farmer/dashboard', {
            title: 'Farmer Dashboard',
            user: req.user,
            farmer: farmer,
            success_msg: req.flash('success_msg'),
            error_msg: req.flash('error_msg')
        });
    } catch (err) {
        console.error('Dashboard error:', err);
        req.flash('error_msg', 'Error loading dashboard');
        res.redirect('/');
    }
});

// GET All Crops (Catalog)
router.get('/crops', isAuthenticated, isFarmer, async (req, res) => {
    try {
        const crops = await Crop.find({ farmerId: req.user._id }).populate('farmerId', 'username');
        res.render('farmer/catalog', { 
            user: req.user, 
            crops,
            success_msg: req.flash('success_msg'),
            error_msg: req.flash('error_msg')
        });
    } catch (err) {
        console.error('Crops error:', err);
        req.flash('error_msg', 'Error loading crops');
        res.redirect('/farmer/dashboard');
    }
});

// GET New Crop Form
router.get('/crops/new', isAuthenticated, isFarmer, (req, res) => {
    res.render('farmer/new', { 
        user: req.user,
        success_msg: req.flash('success_msg'),
        error_msg: req.flash('error_msg')
    });
});

// POST Create Crop
router.post('/crops', isAuthenticated, isFarmer, async (req, res) => {
    const { name, image, price, location, quantity, category, description, unit, harvestDate, expiryDate, organic, certification } = req.body;
    try {
        const crop = await Crop.create({
            name,
            image,
            price,
            location,
            quantity,
            category,
            description,
            unit,
            harvestDate: harvestDate ? new Date(harvestDate) : undefined,
            expiryDate: expiryDate ? new Date(expiryDate) : undefined,
            organic: organic === 'true',
            certification,
            farmerId: req.user._id,
            isAvailable: true
        });
        
        // Update catalog
        const Catalog = require('../models/Catalog');
        await Catalog.create({
            name: crop.name,
            image: crop.image,
            price: crop.price,
            location: crop.location,
            farmerId: crop.farmerId,
            isAvailable: true
        });

        req.flash('success_msg', 'Crop created and added to catalog!');
        res.redirect('/farmer/crops');
    } catch (err) {
        console.error('Crop creation error:', err);
        req.flash('error_msg', 'Error creating crop: ' + err.message);
        res.redirect('/farmer/crops/new');
    }
});

// GET Single Crop with Reviews
router.get('/crops/:id', isAuthenticated, isFarmer, async (req, res) => {
    try {
        const crop = await Crop.findById(req.params.id).populate('farmerId', 'username');
        if (!crop) {
            req.flash('error_msg', 'Crop not found');
            return res.redirect('/farmer/crops');
        }
        const reviews = await Review.find({ crop: crop._id }).populate('createdBy', 'username');
        res.render('farmer/show', { 
            user: req.user, 
            crop, 
            reviews,
            success_msg: req.flash('success_msg'),
            error_msg: req.flash('error_msg')
        });
    } catch (err) {
        console.error('Crop details error:', err);
        req.flash('error_msg', 'Error loading crop details');
        res.redirect('/farmer/crops');
    }
});

// GET Edit Crop Form
router.get('/crops/:id/edit', isAuthenticated, isFarmer, async (req, res) => {
    try {
        const crop = await Crop.findById(req.params.id);
        if (!crop) {
            req.flash('error_msg', 'Crop not found');
            return res.redirect('/farmer/crops');
        }
        if (!crop.farmerId.equals(req.user._id)) {
            req.flash('error_msg', 'Unauthorized');
            return res.redirect('/farmer/crops');
        }
        res.render('farmer/edit', { 
            user: req.user, 
            crop,
            success_msg: req.flash('success_msg'),
            error_msg: req.flash('error_msg')
        });
    } catch (err) {
        console.error('Edit crop error:', err);
        req.flash('error_msg', 'Error loading edit form');
        res.redirect('/farmer/crops');
    }
});

// PUT Update Crop
router.post('/crops/:id', isAuthenticated, isFarmer, async (req, res) => {
    try {
        const crop = await Crop.findById(req.params.id);
        if (!crop) {
            req.flash('error_msg', 'Crop not found');
            return res.redirect('/farmer/crops');
        }
        if (!crop.farmerId.equals(req.user._id)) {
            req.flash('error_msg', 'Unauthorized');
            return res.redirect('/farmer/crops');
        }
        const { name, image, price, location, quantity, category, description, unit, harvestDate, expiryDate, organic, certification } = req.body;
        await Crop.findByIdAndUpdate(req.params.id, {
            name,
            image,
            price,
            location,
            quantity,
            category,
            description,
            unit,
            harvestDate: harvestDate ? new Date(harvestDate) : undefined,
            expiryDate: expiryDate ? new Date(expiryDate) : undefined,
            organic: organic === 'true',
            certification
        });
        req.flash('success_msg', 'Crop updated!');
        res.redirect('/farmer/crops');
    } catch (err) {
        console.error('Update crop error:', err);
        req.flash('error_msg', 'Error updating crop: ' + err.message);
        res.redirect(`/farmer/crops/${req.params.id}/edit`);
    }
});

// DELETE Crop
router.post('/crops/:id/delete', isAuthenticated, isFarmer, async (req, res) => {
    try {
        const crop = await Crop.findById(req.params.id);
        if (!crop) {
            req.flash('error_msg', 'Crop not found');
            return res.redirect('/farmer/crops');
        }
        if (!crop.farmerId.equals(req.user._id)) {
            req.flash('error_msg', 'Unauthorized');
            return res.redirect('/farmer/crops');
        }
        await Crop.findByIdAndDelete(req.params.id);
        req.flash('success_msg', 'Crop deleted!');
        res.redirect('/farmer/crops');
    } catch (err) {
        console.error('Delete crop error:', err);
        req.flash('error_msg', 'Error deleting crop');
        res.redirect('/farmer/crops');
    }
});

// POST Add Review
router.post('/crops/:id/reviews', isAuthenticated, isFarmer, async (req, res) => {
    try {
        const { content, rating } = req.body;
        await Review.create({
            content,
            rating,
            crop: req.params.id,
            createdBy: req.user._id
        });
        req.flash('success_msg', 'Review added!');
        res.redirect(`/farmer/crops/${req.params.id}`);
    } catch (err) {
        console.error('Add review error:', err);
        req.flash('error_msg', 'Error adding review');
        res.redirect(`/farmer/crops/${req.params.id}`);
    }
});

// Farmer Jobs Tracking
router.get('/jobs', isAuthenticated, isFarmer, async (req, res) => {
    try {
        const jobs = await TransportJob.find({ farmerId: req.user._id })
            .populate('cropId')
            .populate('transporterId', 'username')
            .populate('retailerId', 'username');
        res.render('farmer/jobs', { 
            user: req.user, 
            jobs,
            success_msg: req.flash('success_msg'),
            error_msg: req.flash('error_msg')
        });
    } catch (err) {
        console.error('Jobs error:', err);
        req.flash('error_msg', 'Error loading jobs');
        res.redirect('/farmer/dashboard');
    }
});

// Alias /farmer/transport to /farmer/jobs
router.get('/transport', (req, res) => res.redirect('/farmer/jobs'));

// Add crop route
router.post('/add-crop', isAuthenticated, isFarmer, validateCrop, async (req, res) => {
    try {
        const farmer = await Farmer.findOne({ user: req.user._id });
        if (!farmer) {
            req.flash('error_msg', 'Farmer profile not found');
            return res.redirect('/farmer/dashboard');
        }

        const {
            cropName,
            cropVariety,
            sowingDate,
            harvestingDate,
            area,
            irrigationType,
            marketPrice
        } = req.body;

        farmer.crops.push({
            name: cropName,
            variety: cropVariety,
            sowingDate,
            harvestingDate,
            area,
            irrigationType,
            marketPrice
        });

        await farmer.save();
        req.flash('success_msg', 'Crop added successfully');
        res.redirect('/farmer/dashboard');
    } catch (err) {
        console.error('Add crop error:', err);
        req.flash('error_msg', 'Error adding crop');
        res.redirect('/farmer/dashboard');
    }
});

module.exports = router; 