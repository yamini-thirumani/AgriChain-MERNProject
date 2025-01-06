
function toggleMenu() {
    const menu = document.querySelector('.menu-links')
    const icon = document.querySelector('.hamburger-icon')
    menu.classList.toggle("open")
    icon.classList.toggle("open")
}
document.getElementById('inventory-form').addEventListener('submit', function(event) {
    event.preventDefault(); 

    // Capture form values
    const arrivalDate = document.getElementById('arrival-date').value;
    const stockLocation = document.getElementById('stock-location').value;
    const productName = document.getElementById('product-name').value;
    const quantity = document.getElementById('quantity').value;
    const additionalInfo = document.getElementById('additional-info').value;

    // Create an object to store the details
    const productDetails = {
        arrivalDate,
        stockLocation,
        productName,
        quantity,
        additionalInfo
    };

    // Save to local storage
    let products = JSON.parse(localStorage.getItem('products')) || [];
    products.push(productDetails);
    localStorage.setItem('products', JSON.stringify(products));

    // Provide feedback to the user
    alert('Product details have been saved successfully!');

    // Clear the form
    document.getElementById('inventory-form').reset();
});

// Function to load products from local storage and display them
window.onload = function() {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const container = document.querySelector('.inventory-form-container');
    
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
        container.appendChild(productCard);
    });
    
};
