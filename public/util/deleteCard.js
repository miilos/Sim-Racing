// Select all trash icons and convert result from NodeList to array
const cards = Array.from(document.querySelectorAll('.trash_icon'));

// Function to be called on click of trash icons
const deleteCard = async event => {
    // Get the card who's icon was clicked
    const card = event.target.closest('.card');

    // Get the name on the card to make API request
    const cardName = card.querySelector('.name').innerText;

    // Make API request
    await fetch(`/vehicles/${cardName}`, {
        method: 'DELETE'
    });

    // Delete card from UI
    card.style.display = 'none';
}

// Add event listener to every trash icon on the page
cards.forEach(curr => curr.addEventListener('click', deleteCard));