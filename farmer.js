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
      const cropName = document.getElementById('cropName').value;
      const cropVariety = document.getElementById('cropVariety').value;
      const sowingDate = document.getElementById('sowingDate').value;
      const harvestingDate = document.getElementById('harvestingDate').value;
      const area = document.getElementById('area').value;
      const irrigationType = document.getElementById('irrigationType').value;
      const fertilizers = document.getElementById('fertilizers').value;
      const marketPrice = document.getElementById('marketPrice').value;
      const additionalNotes = document.getElementById('additionalNotes').value;

      // Validate form inputs
      if (!cropName || !cropVariety || !sowingDate || !harvestingDate || !area || !irrigationType || !marketPrice) {
        alert('Please fill out all required fields!');
        return;
      }

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