function toggleMenu() {
    const menu = document.querySelector('.menu-links')
    const icon = document.querySelector('.hamburger-icon')
    menu.classList.toggle("open")
    icon.classList.toggle("open")
}

document.addEventListener('DOMContentLoaded', function() {
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

    // Inventory form functionality
    const inventoryForm = document.querySelector('#inventory form');
    if (inventoryForm) {
        inventoryForm.addEventListener('submit', function(event) {
            event.preventDefault();

            // Capture form values
            const arrivalDate = document.getElementById('arrival-date').value;
            const stockLocation = document.getElementById('stock-location').value.trim();
            const productName = document.getElementById('product-name').value.trim();
            const quantity = document.getElementById('quantity').value;
            const additionalInfo = document.getElementById('additional-info').value.trim();

            // Validation
            let errors = [];

            // Date validation
            if (!arrivalDate) {
                errors.push('Arrival date is required');
            } else if (new Date(arrivalDate) < new Date()) {
                errors.push('Arrival date cannot be in the past');
            }

            // Location validation
            if (!stockLocation) {
                errors.push('Stock location is required');
            }

            // Product name validation
            if (!productName) {
                errors.push('Product name is required');
            }

            // Quantity validation
            if (!quantity) {
                errors.push('Quantity is required');
            } else if (isNaN(quantity) || quantity <= 0) {
                errors.push('Please enter a valid quantity');
            }

            if (errors.length > 0) {
                const errorDiv = document.createElement('div');
                errorDiv.className = 'alert alert-danger';
                errorDiv.innerHTML = errors.join('<br>');
                
                const existingError = document.querySelector('.alert-danger');
                if (existingError) {
                    existingError.remove();
                }
                
                inventoryForm.insertBefore(errorDiv, inventoryForm.firstChild);
                return;
            }

            // Create an object to store the details
            const productDetails = {
                arrivalDate,
                stockLocation,
                productName,
                quantity: parseFloat(quantity),
                additionalInfo,
                timestamp: new Date().toISOString()
            };

            // Save to local storage
            let products = JSON.parse(localStorage.getItem('products')) || [];
            products.push(productDetails);
            localStorage.setItem('products', JSON.stringify(products));

            // Show success message
            const successDiv = document.createElement('div');
            successDiv.className = 'alert alert-success';
            successDiv.innerHTML = 'Product details have been saved successfully!';
            
            const existingSuccess = document.querySelector('.alert-success');
            if (existingSuccess) {
                existingSuccess.remove();
            }
            
            inventoryForm.insertBefore(successDiv, inventoryForm.firstChild);

            // Clear the form
            this.reset();
        });
    }

    // Load and display saved products
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const container = document.querySelector('.inventory-form-container');
    
    if (container && products.length > 0) {
        const productsSection = document.createElement('div');
        productsSection.innerHTML = '<h3>Saved Products</h3>';
        
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.style.border = '1px solid #ccc';
            productCard.style.borderRadius = '8px';
            productCard.style.padding = '15px';
            productCard.style.marginTop = '15px';
            productCard.style.backgroundColor = '#f9f9f9';

            productCard.innerHTML = `
                <h4>${product.productName}</h4>
                <p><strong>Arrival Date:</strong> ${product.arrivalDate}</p>
                <p><strong>Stock Location:</strong> ${product.stockLocation}</p>
                <p><strong>Quantity:</strong> ${product.quantity}</p>
                <p><strong>Additional Info:</strong> ${product.additionalInfo || 'N/A'}</p>
            `;
            productsSection.appendChild(productCard);
        });
        
        container.appendChild(productsSection);
    }
});
