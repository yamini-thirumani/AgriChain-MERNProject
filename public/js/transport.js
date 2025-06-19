function toggleMenu() {
    const menu = document.querySelector('.menu-links')
    const icon = document.querySelector('.hamburger-icon')
    menu.classList.toggle("open")
    icon.classList.toggle("open")
}

// Function to update delivery status
async function updateStatus(deliveryId, newStatus) {
    try {
        const response = await fetch(`/transporter/jobs/${deliveryId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: newStatus })
        });

        if (response.ok) {
            alert(`Status updated to ${newStatus}`);
            location.reload(); // Refresh the page to show updated data
        } else {
            const error = await response.json();
            alert(`Error: ${error.error}`);
        }
    } catch (error) {
        console.error('Error updating status:', error);
        alert('Error updating status. Please try again.');
    }
}

// Add functionality for transport management
document.addEventListener('DOMContentLoaded', function() {
    // Get started button functionality
    const getStartedBtn = document.querySelector('.get-started-btn');
    if (getStartedBtn) {
        getStartedBtn.addEventListener('click', function() {
            // Scroll to delivery section
            document.getElementById('delivery').scrollIntoView({ behavior: 'smooth' });
        });
    }

    // Add click handlers for cards
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('click', function() {
            const cardTitle = this.querySelector('h3').textContent;
            alert(`You clicked on ${cardTitle}. This feature is coming soon!`);
        });
    });

    // Add functionality for any forms on the page
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Form submitted successfully! This feature is coming soon.');
        });
    });
});