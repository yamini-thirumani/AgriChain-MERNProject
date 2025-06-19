function toggleMenu() {
  const menu = document.querySelector('.menu-links')
  const icon = document.querySelector('.hamburger-icon')
  menu.classList.toggle("open")
  icon.classList.toggle("open")
}

const addCropButton = document.getElementById('addCropButton');
    const cropForm = document.getElementById('cropForm');
    const submitCrop = document.getElementById('submitCrop');
    const cardContainer = document.getElementById('cardContainer');

    // Show the form when "Add Crops" is clicked
    addCropButton.addEventListener('click', () => {
      cropForm.style.display = 'block';
    });

    // Add crop details functionality
    submitCrop.addEventListener('click', () => {
      // Get form values
      const cropName = document.getElementById('cropName').value.trim();
      const cropVariety = document.getElementById('cropVariety').value.trim();
      const sowingDate = document.getElementById('sowingDate').value;
      const harvestingDate = document.getElementById('harvestingDate').value;
      const area = document.getElementById('area').value.trim();
      const irrigationType = document.getElementById('irrigationType').value;
      const fertilizers = document.getElementById('fertilizers').value;
      const marketPrice = document.getElementById('marketPrice').value;
      const additionalNotes = document.getElementById('additionalNotes').value;

      // Validation
      let errors = [];

      if (!cropName) {
          errors.push('Crop name is required');
      }

      if (!cropVariety) {
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

      if (!area) {
          errors.push('Area is required');
      } else if (!/^\d+(\.\d+)?\s*(acres|hectares)$/i.test(area)) {
          errors.push('Area must be in acres or hectares (e.g., "10 acres" or "5 hectares")');
      }

      if (!irrigationType) {
          errors.push('Irrigation type is required');
      }

      if (!marketPrice || isNaN(marketPrice) || marketPrice <= 0) {
          errors.push('Please enter a valid market price');
      }

      if (errors.length > 0) {
          const errorDiv = document.createElement('div');
          errorDiv.className = 'alert alert-danger';
          errorDiv.innerHTML = errors.join('<br>');
          
          const existingError = document.querySelector('.alert-danger');
          if (existingError) {
              existingError.remove();
          }
          
          document.querySelector('.crop-form-container').insertBefore(errorDiv, document.querySelector('.crop-form-container').firstChild);
          return;
      }

      // If validation passes, proceed with form submission
      // Create a new crop card
      const card = document.createElement('div');
      card.className = 'crop-card';
      card.innerHTML = `
        <h2>${cropName}</h2>
        <p><strong>Variety:</strong> ${cropVariety}</p>
        <p><strong>Sowing Date:</strong> ${sowingDate}</p>
        <p><strong>Harvesting Date:</strong> ${harvestingDate}</p>
        <p><strong>Area:</strong> ${area}</p>
        <p><strong>Irrigation Type:</strong> ${irrigationType}</p>
        <p><strong>Fertilizers:</strong> ${fertilizers}</p>
        <p><strong>Market Price:</strong> ${marketPrice}</p>
        <p><strong>Notes:</strong> ${additionalNotes}</p>
      `;

      // Add the card to the card container
      cardContainer.appendChild(card);

      // Clear the form and hide it
      document.getElementById('cropName').value = '';
      document.getElementById('cropVariety').value = '';
      document.getElementById('sowingDate').value = '';
      document.getElementById('harvestingDate').value = '';
      document.getElementById('area').value = '';
      document.getElementById('irrigationType').value = '';
      document.getElementById('fertilizers').value = '';
      document.getElementById('marketPrice').value = '';
      document.getElementById('additionalNotes').value = '';
      cropForm.style.display = 'none';

      // Display alert
      alert('Crop details saved successfully!');
    });