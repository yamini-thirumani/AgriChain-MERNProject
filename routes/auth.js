const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/User');

// Show registration form
router.get('/register', (req, res) => {
  res.render('register');
});

// Handle registration form submission
router.post('/register', async (req, res) => {
  const { username, email, password, role } = req.body;
  let errors = [];

  if (!username || !email || !password || !role) {
    errors.push('Please fill in all fields');
  }
  if (password.length < 6) {
    errors.push('Password must be at least 6 characters');
  }

  if (errors.length > 0) {
    req.flash('error_msg', errors.join('<br>'));
    return res.redirect('/auth/register');
  }

  try {
    let user = await User.findOne({ email: email.toLowerCase() });
    if (user) {
      req.flash('error_msg', 'Email is already registered');
      return res.redirect('/auth/register');
    }
    user = new User({ username, email: email.toLowerCase(), password, role });
    await user.save();
    req.flash('success_msg', 'You are now registered and can log in');
    res.redirect('/auth/login');
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Something went wrong. Please try again.');
    res.redirect('/auth/register');
  }
});

// Show login form
router.get('/login', (req, res) => {
  res.render('login');
});

// Handle login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      req.flash('error_msg', info.message);
      return res.redirect('/auth/login');
    }
    req.logIn(user, err => {
      if (err) return next(err);
      switch (user.role) {
        case 'farmer':
          return res.redirect('/farmer/dashboard');
        case 'transporter':
          return res.redirect('/transporter/dashboard');
        case 'retailer':
          return res.redirect('/retailer/dashboard');
        case 'consumer':
          return res.redirect('/consumer/dashboard');
        default:
          return res.redirect('/');
      }
    });
  })(req, res, next);
});

// Handle logout
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      req.flash('error_msg', 'Error logging out');
      return res.redirect('/');
    }
    req.flash('success_msg', 'You are logged out');
    res.redirect('/');
  });
});

module.exports = router;
  