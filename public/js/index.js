// Function to toggle the hamburger menu
function toggleMenu() {
    const menu = document.querySelector('.menu-links');
    const icon = document.querySelector('.hamburger-icon');
    menu.classList.toggle('open');
    icon.classList.toggle('open');
}

// Wait for the DOM content to load
document.addEventListener('DOMContentLoaded', () => {
    // References to important DOM elements
    const lkpbutton = document.getElementById('lkpbutton');
    const productJourney = document.getElementById('productJourney');

    if (lkpbutton && productJourney) {
        // Add event listener to the button for product journey
        lkpbutton.addEventListener('click', (event) => {
            event.preventDefault();

            // Dynamic content for product journey
            const journeyHTML = `
                <h2>Product Journey</h2>
                <ul style="list-style: none; padding: 0;">
                    <li>Farmer: Stock Type - Wheat, Harvested on - 05/11/2023</li>
                    <li>Transport: Truck, Date - 09/11/2023, Quality Check - Passed</li>
                    <li>Retailer: Received on - 05/11/2023, Stocked at Hyderabad</li>
                </ul>
            `;

            // Update the product journey section
            productJourney.innerHTML = journeyHTML;
            productJourney.style.display = 'block';
        });
    }

    // Ensure all links in the hamburger menu close the menu after clicking
    const menuLinks = document.querySelectorAll('.menu-links a');
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            toggleMenu();
        });
    });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Form validation
const contactForm = document.querySelector('#contact-us form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        const name = document.getElementById('contact-name').value.trim();
        const email = document.getElementById('contact-email').value.trim();
        const message = document.getElementById('contact-message').value.trim();

        if (!name || !email || !message) {
            e.preventDefault();
            alert('Please fill in all fields');
            return;
        }

        if (!isValidEmail(email)) {
            e.preventDefault();
            alert('Please enter a valid email address');
            return;
        }
    });
}

// Email validation helper
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Mobile menu toggle
const hamburgerIcon = document.querySelector('.hamburger-icon');
const menuLinks = document.querySelector('.menu-links');

if (hamburgerIcon && menuLinks) {
    hamburgerIcon.addEventListener('click', function() {
        menuLinks.classList.toggle('active');
        hamburgerIcon.classList.toggle('active');
    });
}

// Close mobile menu when clicking outside
document.addEventListener('click', function(e) {
    if (menuLinks && menuLinks.classList.contains('active')) {
        if (!e.target.closest('.hamburger-menu')) {
            menuLinks.classList.remove('active');
            hamburgerIcon.classList.remove('active');
        }
    }
});

// Registration form validation
const registrationForm = document.querySelector('#registration-form');
if (registrationForm) {
    registrationForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const role = document.getElementById('role').value;
        
        let errors = [];
        
        // Username validation
        if (!username || username.length < 3) {
            errors.push('Username must be at least 3 characters long');
        }
        
        // Email validation
        if (!email || !isValidEmail(email)) {
            errors.push('Please enter a valid email address');
        }
        
        // Password validation
        if (!password || password.length < 6) {
            errors.push('Password must be at least 6 characters long');
        }
        
        // Role validation
        if (!role) {
            errors.push('Please select a role');
        }
        
        if (errors.length > 0) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'alert alert-danger';
            errorDiv.innerHTML = errors.join('<br>');
            
            const existingError = registrationForm.querySelector('.alert-danger');
            if (existingError) {
                existingError.remove();
            }
            
            registrationForm.insertBefore(errorDiv, registrationForm.firstChild);
            return;
        }
        
        // If validation passes, submit the form
        this.submit();
    });
}
