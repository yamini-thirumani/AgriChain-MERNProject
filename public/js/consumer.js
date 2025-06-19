function toggleMenu() {
    const menu = document.querySelector('.menu-links')
    const icon = document.querySelector('.hamburger-icon')
    menu.classList.toggle("open")
    icon.classList.toggle("open")
}

document.addEventListener('DOMContentLoaded', () => {
    const lkpbutton = document.getElementById('lkpbutton');
    const productJourney = document.getElementById('productJourney')
    const productdetailsForm = document.getElementById('productdetails-form');

    // Product lookup functionality
    if (lkpbutton) {
        lkpbutton.addEventListener('click',(event)=>{
            event.preventDefault();
            const productCode = document.getElementById('productCode').value;
            
            if (!productCode) {
                alert('Please enter a product code');
                return;
            }
            
            const journeyHTML = 
                `<h2>Product Journey</h2>
                <ul style="list-style:none; padding: 0;">
                <li style="margin: 10px 0; padding: 10px; background: #f0f0f0; border-radius: 5px;">Farmer : StockType - Wheat, Harvested on - 05/11/2023</li>
                <li style="margin: 10px 0; padding: 10px; background: #f0f0f0; border-radius: 5px;">Transport : Truck, Date - 9/11/2023, QualityCheck - Passed</li>
                <li style="margin: 10px 0; padding: 10px; background: #f0f0f0; border-radius: 5px;">Retailer : Received on - 05-11-2023, Stocked At Hyderabad</li>
                </ul>
                `
                ;
            
            productJourney.innerHTML = journeyHTML;
            productJourney.style.display = "block";
        });
    }

    // Get started button functionality
    const getStartedBtn = document.querySelector('.get-started-btn');
    if (getStartedBtn) {
        getStartedBtn.addEventListener('click', function() {
            // Scroll to catalog section
            document.getElementById('catelog').scrollIntoView({ behavior: 'smooth' });
        });
    }

    // Search functionality
    const searchBtn = document.querySelector('.search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            const searchInput = document.querySelector('.search-input').value;
            if (searchInput) {
                alert(`Searching for: ${searchInput}. This feature is coming soon!`);
            } else {
                alert('Please enter a search term');
            }
        });
    }

    // Filter functionality
    const filterSelects = document.querySelectorAll('.filter-select');
    filterSelects.forEach(select => {
        select.addEventListener('change', function() {
            if (this.value) {
                alert(`Filtering by: ${this.value}. This feature is coming soon!`);
            }
        });
    });
});

