const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Passport config
passport.use(
  new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
      const user = await User.findOne({ email });
      if (!user) return done(null, false, { message: 'That email is not registered' });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return done(null, false, { message: 'Incorrect password' });

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// Auth middleware
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  req.flash('error_msg', 'Please log in to access this page');
  res.redirect('/auth/login');
};

// Generic role checker
const checkRole = (roles) => {
  return (req, res, next) => {
    if (req.user && roles.includes(req.user.role)) {
      return next();
    }
    res.status(403).render('error', { message: 'Access denied' });
  };
};

const isFarmer = (req, res, next) => {
  if (req.user && req.user.role === 'farmer') return next();
  res.status(403).render('error', { message: 'Access denied' });
};

const isTransporter = (req, res, next) => {
  if (req.user && req.user.role === 'transporter') return next();
  res.status(403).render('error', { message: 'Access denied' });
};

const isRetailer = (req, res, next) => {
  if (req.user && req.user.role === 'retailer') return next();
  res.status(403).render('error', { message: 'Access denied' });
};

const isConsumer = (req, res, next) => {
  if (req.user && req.user.role === 'consumer') return next();
  res.status(403).render('error', { message: 'Access denied' });
};

module.exports = {
  passport,
  isAuthenticated,
  isFarmer,
  isTransporter,
  isRetailer,
  isConsumer,
  checkRole
};
