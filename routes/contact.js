const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { 'contact-name': name, 'contact-email': email, 'contact-message': message } = req.body;

        // Here you would typically:
        // 1. Validate the input
        // 2. Send an email
        // 3. Store the message in a database
        // For now, we'll just log it and show a success message
        console.log('Contact form submission:', { name, email, message });

        req.flash('success', 'Thank you for your message! We will get back to you soon.');
        res.redirect('/#contact-us');
    } catch (error) {
        console.error('Error processing contact form:', error);
        req.flash('error', 'Sorry, there was an error sending your message. Please try again later.');
        res.redirect('/#contact-us');
    }
});

module.exports = router; 