const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
const hpp = require('hpp');
const validator = require('validator');

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

// Input validation middleware
const validateRegistration = (req, res, next) => {
  const { username, email, password, role } = req.body;
  const errors = [];

  if (!username || !validator.isLength(username, { min: 3, max: 30 })) {
    errors.push('Username must be between 3 and 30 characters');
  }

  if (!email || !validator.isEmail(email)) {
    errors.push('Please provide a valid email');
  }

  if (!password || !validator.isLength(password, { min: 6 })) {
    errors.push('Password must be at least 6 characters long');
  }

  if (!role || !['farmer', 'transporter', 'retailer', 'consumer'].includes(role)) {
    errors.push('Please select a valid role');
  }

  if (errors.length > 0) {
    req.flash('error_msg', errors.join(', '));
    return res.redirect('/auth/register');
  }

  next();
};

// Crop validation middleware
const validateCrop = (req, res, next) => {
    const { cropName, cropVariety, sowingDate, harvestingDate, area, irrigationType, marketPrice } = req.body;
    const errors = [];

    if (!cropName || cropName.trim().length === 0) {
        errors.push('Crop name is required');
    }

    if (!cropVariety || cropVariety.trim().length === 0) {
        errors.push('Crop variety is required');
    }

    if (!sowingDate) {
        errors.push('Sowing date is required');
    }

    if (!harvestingDate) {
        errors.push('Harvesting date is required');
    } else if (new Date(harvestingDate) <= new Date(sowingDate)) {
        errors.push('Harvesting date must be after sowing date');
    }

    if (!area || !/^\d+(\.\d+)?\s*(acres|hectares)$/i.test(area)) {
        errors.push('Area must be in acres or hectares (e.g., "10 acres" or "5 hectares")');
    }

    if (!irrigationType) {
        errors.push('Irrigation type is required');
    }

    if (!marketPrice || isNaN(marketPrice) || marketPrice <= 0) {
        errors.push('Please enter a valid market price');
    }

    if (errors.length > 0) {
        req.flash('error_msg', errors.join(', '));
        return res.redirect('back');
    }

    next();
};

// Error handling middleware
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    // Handle different types of errors
    if (err.name === 'ValidationError') {
        return res.status(400).render('error', {
            message: Object.values(err.errors).map(e => e.message).join(', '),
            user: req.user
        });
    }

    if (err.name === 'CastError') {
        return res.status(400).render('error', {
            message: 'Invalid ID format',
            user: req.user
        });
    }

    if (err.name === 'JsonWebTokenError') {
        return res.status(401).render('error', {
            message: 'Invalid token. Please log in again.',
            user: null
        });
    }

    if (err.name === 'TokenExpiredError') {
        return res.status(401).render('error', {
            message: 'Session expired. Please log in again.',
            user: null
        });
    }

    // Handle database connection errors
    if (err.name === 'MongoError' || err.name === 'MongoServerError') {
        return res.status(500).render('error', {
            message: 'Database error. Please try again later.',
            user: req.user
        });
    }

    // Handle file upload errors
    if (err.name === 'MulterError') {
        return res.status(400).render('error', {
            message: 'File upload error: ' + err.message,
            user: req.user
        });
    }

    // Default error
    res.status(err.status || 500).render('error', {
        message: process.env.NODE_ENV === 'production' 
            ? 'Something went wrong! Please try again later.' 
            : err.message,
        user: req.user
    });
};

// Input sanitization middleware
const sanitizeInput = (req, res, next) => {
    if (req.body) {
        Object.keys(req.body).forEach(key => {
            if (typeof req.body[key] === 'string') {
                req.body[key] = req.body[key].trim();
            }
        });
    }
    next();
};

// CSRF protection middleware
const csrfProtection = (req, res, next) => {
    if (req.method === 'POST' || req.method === 'PUT' || req.method === 'DELETE') {
        const csrfToken = req.headers['x-csrf-token'];
        if (!csrfToken || csrfToken !== req.session.csrfToken) {
            return res.status(403).render('error', {
                message: 'Invalid CSRF token',
                user: req.user
            });
        }
    }
    next();
};

// Session timeout middleware
const sessionTimeout = (req, res, next) => {
    const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
    if (req.session && req.session.lastActivity) {
        const timeSinceLastActivity = Date.now() - req.session.lastActivity;
        if (timeSinceLastActivity > SESSION_TIMEOUT) {
            req.session.destroy((err) => {
                if (err) {
                    console.error('Error destroying session:', err);
                }
                return res.status(401).render('error', {
                    message: 'Session expired. Please log in again.',
                    user: null
                });
            });
            return;
        }
    }
    req.session.lastActivity = Date.now();
    next();
};

// Security middleware setup
const setupSecurityMiddleware = (app) => {
  // Basic security headers
  app.use(helmet());

  // Prevent XSS attacks
  app.use(xss());

  // Prevent HTTP Parameter Pollution
  app.use(hpp());

  // Rate limiting
  app.use('/api/', limiter);

  // Additional security headers
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
  });
};

// Role-based middleware
const isFarmer = (req, res, next) => {
    if (req.user && req.user.role === 'farmer') {
        return next();
    }
    req.flash('error', 'Access denied. Farmers only.');
    res.redirect('/');
};

const isTransporter = (req, res, next) => {
    if (req.user && req.user.role === 'transporter') {
        return next();
    }
    req.flash('error', 'Access denied. Transporters only.');
    res.redirect('/');
};

const isRetailer = (req, res, next) => {
    if (req.user && req.user.role === 'retailer') {
        return next();
    }
    req.flash('error', 'Access denied. Retailers only.');
    res.redirect('/');
};

const isConsumer = (req, res, next) => {
    if (req.user && req.user.role === 'consumer') {
        return next();
    }
    req.flash('error', 'Access denied. Consumers only.');
    res.redirect('/');
};

module.exports = {
  validateRegistration,
  errorHandler,
  setupSecurityMiddleware,
  isFarmer,
  isTransporter,
  isRetailer,
  isConsumer,
  sanitizeInput,
  csrfProtection,
  sessionTimeout,
  validateCrop
}; 