const express = require('express');
const router = express.Router();
const { isAuthenticated, checkRole } = require('../utils/auth');

// Dashboard route with role validation
router.get('/', isAuthenticated, checkRole(['farmer', 'transporter', 'retailer', 'consumer']), (req, res) => {
    res.render('dashboard', {
        title: 'Dashboard',
        user: req.user.getPublicProfile(),
        success_msg: req.flash('success_msg'),
        error_msg: req.flash('error_msg')
    });
});

// Role-specific dashboard routes
router.get('/farmer', isAuthenticated, checkRole(['farmer']), (req, res) => {
    res.render('farmer/dashboard', {
        title: 'Farmer Dashboard',
        user: req.user.getPublicProfile(),
        success_msg: req.flash('success_msg'),
        error_msg: req.flash('error_msg')
    });
});

router.get('/transporter', isAuthenticated, checkRole(['transporter']), (req, res) => {
    res.render('transporter/dashboard', {
        title: 'Transporter Dashboard',
        user: req.user.getPublicProfile(),
        success_msg: req.flash('success_msg'),
        error_msg: req.flash('error_msg')
    });
});

router.get('/retailer', isAuthenticated, checkRole(['retailer']), (req, res) => {
    res.render('retailer/dashboard', {
        title: 'Retailer Dashboard',
        user: req.user.getPublicProfile(),
        success_msg: req.flash('success_msg'),
        error_msg: req.flash('error_msg')
    });
});

router.get('/consumer', isAuthenticated, checkRole(['consumer']), (req, res) => {
    res.render('consumer/dashboard', {
        title: 'Consumer Dashboard',
        user: req.user.getPublicProfile(),
        success_msg: req.flash('success_msg'),
        error_msg: req.flash('error_msg')
    });
});

module.exports = router; 