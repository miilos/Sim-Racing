/*
    The entire script basically just manipulates the same results array that containes the result of an API call every time
    the user searches something. The array is filtered/sorted based on what the user selects in the <select>s on the page
*/

// Global variables & search elements
const searchBar = document.querySelector('.search_bar');
const searchBtn = document.querySelector('.search_btn');
const sortSelect = document.getElementById('sort_select');
const displaySelect = document.getElementById('display_select');
const cardsContainer = document.querySelector('.cards_container');
let results;
// Sorting/grouping variables
let displayedCards = [];
let grouped = false;
// Variable to check if modal is beiong displayed, used to add a click listener to the 'x' button on the modal if it's         displayed
let modalDisplayed = false;

/** SEARCH FUNCTIONALITY **/

// Function to place data in the card HTML
const placeData = data => {
    // Fill the card template
    let icon;

    if(data.vehicleType === 'sports_bike' || data.vehicleType === 'cross_bike')
        icon = 'fas fa-motorcycle';
    else if(data.vehicleType === 'sports_car' || data.vehicleType === 'cross_bike')
        icon = 'fas fa-car-side';
    else
        icon = 'fas fa-truck-monster';

    const html = `
    <div class="card ${data.special ? 'special_card' : ''}">
        <div class="top_container">
            <h3 class="name">${data.name}</h3>
            <div class="icon_container">
                <i class="${icon}"></i>
            </div>
        </div>
        <table class="info_container">
            <tr>
                <td>Max speed: </td>
                <td>${data.maxSpeed} km/h</td>
            </tr>
            <tr>
                <td>Distance: </td>
                <td>${data.distance} km</td>
            </tr>
            <tr>
                <td>Points: </td>
                <td>${data.points} pts</td>
            </tr>
        </table>
    </div>
    `;

    // Insert the filled out template into the DOM
    cardsContainer.insertAdjacentHTML('beforeend', html);
}

// Function to display the data from the request
const displayCards = results => {
    // Clear everything in the cards container beforehand
    cardsContainer.innerHTML = '';

    // Loop over the results and display them
    results.forEach(curr => placeData(curr));
}

// Function to get data from input fields and make request
const makeRequest = async () => {
    // Get search query and clear search bar
    const searchQuery = searchBar.value;
    searchBar.value = '';
    searchBar.focus();
    grouped = false;
    
    // Make API request
    const response = await fetch(`/vehicles/${searchQuery}`);
    results = await response.json();

    // Display the data
    displayCards(results.data);
}

// Get input from search elements on button click
searchBtn.addEventListener('click', makeRequest);
document.addEventListener('keydown', event => {
    if(event.key === 'Enter') {
        makeRequest();
    }
});


/** SORTING AND GROUPING **/

// SORTING
// Function to sort the search results based on the selection
const sortArr = (property, arr) => {
    for(let i = 0; i < arr.length; i++) {
        for(let j = 0; j < arr.length-1; j++) {
            if(arr[j][property] > arr[j+1][property]) {
                const pom = arr[j];
                arr[j] = arr[j+1];
                arr[j+1] = pom;
            }
        }
    }
}
const sort = property => {
    if(!grouped) {
        sortArr(property, results.data);
    }
    else {
        sortArr(property, displayedCards);
    }
}

// Display the sorted results
const renderSort = () => {   
    // Get the property by which the results will be sorted and sort them
    const sortBy = sortSelect.value;
    sort(sortBy);

    // If grouped === true, that means only a certain type of card is shown, so only sort and render those cards
    if(!grouped)
        displayCards(results.data);
    else
        displayCards(displayedCards);
}

// Change listeners to sort results on select option change
sortSelect.addEventListener('change', () => {
    const option = sortSelect.value;

    if(option !== 'n/a') {
        renderSort();
    }
    else {
        if(!grouped)
            makeRequest();
        else {
            const type = displaySelect.value;
            groupCards(type);
        }
    }
});

// GROUPING
// Function to filter out the vehicles which aren't of the selected type
const groupCards = type => {
    cardsContainer.innerHTML = '';
    displayedCards = [];

    // Go through results and display any card that matches the selected type
    results.data.forEach(curr => {
        if(curr.vehicleType === type) {
            placeData(curr);
            displayedCards.push(curr);
            grouped = true;
        }
    });
}

// Add event listener for grouping select
displaySelect.addEventListener('change', () => {
    const type = displaySelect.value;

    if(type !== 'n/a') {
        groupCards(type);
    }
    else {
        displayCards(results.data);
        grouped = false;
    }
});


/*
    This part of the script is for implementing the modal that displays extra info for every card
*/

const displayModal = data => {
    let icon;

    if(data.vehicleType === 'sports_bike' || data.vehicleType === 'cross_bike')
        icon = 'fas fa-motorcycle icon';
    else if(data.vehicleType === 'sports_car' || data.vehicleType === 'terrain_car')
        icon = 'fas fa-car-side icon';
    else
        icon = 'fas fa-truck-monster icon';

    const html = `
        <div class="modal">
            <div class="top_row">
                <i class="fas fa-times close"></i>
                <h1 class="vehicle_name">${data.name}</h1>
            </div>
            <div class="mid_row">
                <div class="icon_outline">
                    <i class="${icon}"></i>
                </div>
            </div>
            <div class="bottom_row">
                <table class="info">
                    <tr>
                        <td>Type</td>
                        <td>${data.vehicleType}</td>
                    </tr>
                    <tr>
                        <td>Malf. chance</td>
                        <td>${data.malfunctionChance}%</td>
                    </tr>
                    <tr>
                        <td>Max speed:</td>
                        <td>${data.maxSpeed} km/h</td>
                    </tr>
                    <tr>
                        <td>Distance:</td>
                        <td>${data.distance} km</td>
                    </tr>
                    <tr>
                        <td>Points:</td>
                        <td>${data.points} pts</td>
                    </tr>
                </table>
            </div>
        </div>
    `
    document.querySelector('body').insertAdjacentHTML('beforeend', html);
    document.querySelector('.close').addEventListener('click', () => {
        const modal = document.querySelector('.modal');
        document.querySelector('body').removeChild(modal);
    });
}

document.addEventListener('click', event => {
    if(event.target.matches('.name')) {
        const data = results.data.find(curr => curr.name === event.target.innerText);
        displayModal(data);
    }
});