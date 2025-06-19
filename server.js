const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');
require('dotenv').config();

const { passport, isAuthenticated, isFarmer, isTransporter, isRetailer, isConsumer } = require('./utils/auth');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Flash messages
app.use(flash());

// Global variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/agrichain', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Import routes
const authRoutes = require('./routes/auth');
const farmerRoutes = require('./routes/farmer');
const transporterRoutes = require('./routes/transporter');
const retailerRoutes = require('./routes/retailer');
const consumerRoutes = require('./routes/consumer');
const contactRoutes = require('./routes/contact');
const indexRoutes = require('./routes/index');

// Routes
app.use('/', indexRoutes);
app.use('/auth', authRoutes);
app.use('/farmer', isAuthenticated, isFarmer, farmerRoutes);
app.use('/transporter', isAuthenticated, isTransporter, transporterRoutes);
app.use('/retailer', isAuthenticated, isRetailer, retailerRoutes);
app.use('/consumer', isAuthenticated, isConsumer, consumerRoutes);
app.use('/contact', contactRoutes);

// Error handling middleware
app.use((req, res, next) => {
    res.status(404).render('error', {
        message: 'Page not found'
    });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).render('error', {
        message: err.message || 'Something went wrong!'
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
