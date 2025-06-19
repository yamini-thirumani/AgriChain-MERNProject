const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../utils/auth');
const { isTransporter } = require('../utils/middleware');
const TransportJob = require('../models/TransportJob');
const Crop = require('../models/Crop');

// Transporter Dashboard
router.get('/dashboard', isAuthenticated, isTransporter, async (req, res) => {
    try {
        const activeJobs = await TransportJob.find({ 
            transporterId: req.user._id,
            status: { $in: ['assigned', 'in_transit'] }
        }).populate('cropId').populate('farmerId').populate('retailerId');

        const completedJobs = await TransportJob.find({
            transporterId: req.user._id,
            status: 'completed'
        }).populate('cropId').populate('farmerId').populate('retailerId');

        res.render('transporter/dashboard', {
            activeJobs,
            completedJobs
        });
    } catch (error) {
        console.error('Dashboard Error:', error);
        req.flash('error', 'Error loading dashboard');
        res.redirect('/');
    }
});

// Accept transport job
router.post('/jobs/:id/accept', isAuthenticated, isTransporter, async (req, res) => {
    try {
        const job = await TransportJob.findById(req.params.id);
        if (!job) {
            return res.status(404).json({ error: 'Job not found' });
        }

        if (job.status !== 'pending') {
            return res.status(400).json({ error: 'Job is not available' });
        }

        job.transporterId = req.user._id;
        job.status = 'assigned';
        await job.save();

        res.json({ success: true, job });
    } catch (error) {
        console.error('Accept Job Error:', error);
        res.status(500).json({ error: 'Error accepting job' });
    }
});

// Update job status
router.put('/jobs/:id/status', isAuthenticated, isTransporter, async (req, res) => {
    try {
        const { status } = req.body;
        const job = await TransportJob.findOne({
            _id: req.params.id,
            transporterId: req.user._id
        });

        if (!job) {
            return res.status(404).json({ error: 'Job not found' });
        }

        job.status = status;
        await job.save();

        res.json({ success: true, job });
    } catch (error) {
        console.error('Update Status Error:', error);
        res.status(500).json({ error: 'Error updating job status' });
    }
});

// Get available jobs
router.get('/jobs/available', isAuthenticated, isTransporter, async (req, res) => {
    try {
        const availableJobs = await TransportJob.find({
            status: 'pending',
            transporterId: { $exists: false }
        }).populate('cropId').populate('farmerId').populate('retailerId');

        res.json(availableJobs);
    } catch (error) {
        console.error('Get Available Jobs Error:', error);
        res.status(500).json({ error: 'Error fetching available jobs' });
    }
});

module.exports = router; 