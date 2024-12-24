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

lkpbutton.addEventListener('click',(event)=>{
    event.preventDefault();
    const journeyHTML = 
        `<h2>Product Journey</h2>
        <ul style = "line-style:none">
        <li>Farmer : StockType - Wheat, Harversted on - 05/11/2023</li>
        <li>Transport : Truck, Date - 9/11/2023, QualityCheck - Passes\d</li>
        <li>Retailer :  Received  on - 05-11-2023,Stocked At Hyderabad</li>
        </ul>
        `
        ;
    
     productJourney.innerHTML = journeyHTML;

 

     productJourney.style.display = "block";
});
});

