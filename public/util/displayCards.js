const container = document.querySelector('.cards_container');
const raceBtn = document.querySelector('.race_btn');
const participants = [] // array of vehicles selected for the race that are gonna be stored in the db
let cards;

const getCards = async () => {
    const res = await fetch('/vehicles');
    cards = await res.json();

    renderCards(cards.data);
    addListeners();
}

const renderCards = cards => {
    let icon;

    cards.forEach(data => {
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
        container.insertAdjacentHTML('beforeend', html);
    });
}

const addListeners = () => {
    container.querySelectorAll('.card').forEach(curr => {
        curr.addEventListener('click', event => {
            // get the name of the vehicle from the html card
            const name = event.target.closest('.card').querySelector('.name').textContent;

            // if it's already in the array, the user changed his mind and doesn't want the vehicle in the race, therefore, it's removed from the array which will ultimately be submitted to the database
            if(!participants.includes(name))
                participants.push(name);
            else {
                const i = participants.findIndex(curr => curr === name);
                participants.splice(i, 1);
            }

            curr.classList.toggle('card_selected');
        });
    });
}

raceBtn.addEventListener('click', async () => {
    // create the race object for the race document
    const uid = Date.now().toString();
    const reqBody = {
        uid: uid,
        vehicles: participants
    };

    try {
        // make api request to write document into the database
        await fetch('/race', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reqBody)
        });

        // open next page where the user picks the reace track
        window.location.href = `/pickTrack/${uid}`;
    }
    catch(err) {
        console.log(err);
    }
});

getCards();