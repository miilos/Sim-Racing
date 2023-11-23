const leaderboard = document.querySelector('.content_table');
const table = document.querySelector('.content_table');
let category = 'all' // global variable to indicate for which category should the leaderboard be displayed

// Function to match selector's class to a value for category
const matchCategory = domClass => {
    const classMap = new Map();
    classMap.set('selector_text', 'all');
    classMap.set('fa-motorcycle', 'bike');
    classMap.set('fa-car-side', 'car');
    classMap.set('fa-truck-monster', 'truck');

    const key = domClass.split(' ')[1];
    category = classMap.get(key);
}

// Function to toggle .active class on table top selectors
const toggleActive = target => {
    const oldActive = document.querySelector('.active');
    const currActive = target.closest('.board_selector');

    oldActive.classList.remove('active');
    currActive.classList.add('active');
}

// Function to display a single <tr> in the leaderboard
const displayTr = (data, i) => {
    let icon;

    if(data.vehicleType === 'sports_bike' || data.vehicleType === 'cross_bike')
        icon = 'fas fa-motorcycle selector_icon';
    else if(data.vehicleType === 'sports_car' || data.vehicleType === 'terrain_car')
        icon = 'fas fa-car-side selector_icon';
    else
        icon = 'fas fa-truck-monster selector_icon';

    const html = `
        <tr>
            <td>${i}.</td>
            <td><i class="${icon}"></i></td>
            <td>${data.name}</td>
            <td>${data.points}pts</td>
        </tr>
    `;

    table.insertAdjacentHTML('beforeend', html);
}

// Function to go through API call results and call displayTr() for every element from result
const displayData = res => {
    let i = 1;
    res.forEach(curr => displayTr(curr, i++));
}

// Function to make API request and call function to display it
const displayLeaderboard = async () => {
    let data;

    if(category !== 'all')
        data = await fetch(`/vehicles?class=${category}&sort=-points`);
    else
        data = await fetch('/vehicles?sort=-points');

    const res = await data.json();
    table.innerHTML = '';
    displayData(res.data);
}

// Function to bring together all the operations to be done on click
const handleChange = event => {
    matchCategory(event.target.classList.value);
    toggleActive(event.target);
    displayLeaderboard();
}

// Add event listeners to each icon in the table top selectors
const selectors = Array.from(document.querySelectorAll('.selector_icon'))
selectors.forEach(curr => {
    curr.addEventListener('click', handleChange);
});


// Display leaderboard for all vehicles on load
window.addEventListener('load', async () => {
    const data = await fetch('/vehicles?sort=-points');
    const res = await data.json();
    displayData(res.data);
});