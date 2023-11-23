const table = document.querySelector('.standings');
const malfunctions = document.querySelector('.malfunctions');
const stopBtn = document.querySelector('.stop_btn');
const modal = document.querySelector('.modal');
const speed = 500; // time between passes in the race sim
let race; // variable to contain race info from api call
let vehicles = []; // main array that holds vehicles in the race from the api call
let tableHtml = '';
let vehiclesFinished = [];
let sortStartIndex = 0;
let raceGoing = true; // this will be false if the user clicks the stop race button
let betOn = '' // the name of the vehicle the user bet on, so that the script knows which table row to put .bet css class on
let betted = false;

modal.style.visibility = 'hidden'; // make the modal invisible until the user wins a bet

// function to make all api calls needed to get the data to start
const getData = async () => {
    // the uid is gonna be the last element in the array if it's split by '/', and pop() will return the last element
    const uid = window.location.href.split('/').pop();

    const raceRes = await fetch(`/race/${uid}`);
    const raceFull = await raceRes.json();
    race = raceFull.race[0];

    const vehiclesRes = await fetch('/vehicles');
    const vehiclesAll = (await vehiclesRes.json()).data;
    // instead of api requests for every vehicle in race.vehicles, the vehicles from the db that aren't in that array are just filtered out here
    vehicles = vehiclesAll.filter(curr => race.vehicles.includes(curr.name));

    // add the crossed property to represent the crossed distance
    vehicles.forEach(curr => {
        curr.crossed = 0;
        curr.streak = 0;
    });
}

// function to run simulation of a pass for a single vehicle
const simulate = curr => {
    // run chances for malfunction
    const num = Math.floor(Math.random()*100)+1;
    const malf = num < (curr.malfunctionChance + race.effect);

    if(malf) {
        const html = `<p class="malfunction">${curr.name} broke down!</p>`;
        malfunctions.insertAdjacentHTML('beforeend', html);
        curr.streak = 0;
    }
    else {
        let placeBonus = 0;

        // the vehicles in the bottom half of the race have a 50% chance to get a 100m bonus
        if(vehicles.indexOf(curr) < Math.ceil(vehicles.length/2)) {
            const bonus = Math.floor(Math.random()*100);
            bonus >= 50 ? placeBonus = 100 : placeBonus = 0;
        }

        curr.crossed += curr.maxSpeed + curr.streak*5 + placeBonus;
        curr.streak++; // for every lap a vehicle doesn't break down, it gets +1 on it's streak, resulting in it crossing a bigger distance every lap it doesn't break down (if it breaks down, the streak goes back down to 0)
    }

    return curr.crossed;
}

// function to add row into table html
const addRow = (i, data) => {
    let icon;

    if(data.vehicleType === 'sports_bike' || data.vehicleType === 'cross_bike')
        icon = 'fas fa-motorcycle';
    else if(data.vehicleType === 'sports_car' || data.vehicleType === 'cross_bike')
        icon = 'fas fa-car-side';
    else
        icon = 'fas fa-truck-monster';

    tableHtml = tableHtml.concat(`
        <tr ${betOn === data.name ? 'class="bet"' : ''}>
            <td>${i}.</td>
            <td><i class="${icon}"></i></td>
            <td>${data.name}</td>
            <!-- <td>${data.status === 'working' ? data.crossed + 'm' : '<strong>Finished!</strong>'}</td> -->
            <td><input type="range" name="" id="range" value="${data.crossed > race.length ? 100 : data.crossed/90}"></td>
            <td>0 pts</td>
        </tr>
    `);
}

// function to sort the vehicles array, starting at a certain index so that once vehicles are finished they'll remain in their position
const sort = (arr, startIndex = 0) => {
    for(let i = startIndex; i < arr.length; i++) {
        for(let j = startIndex; j < arr.length-1; j++) {
            if(arr[j].crossed < arr[j+1].crossed) {
                const temp = arr[j];
                arr[j] = arr[j+1];
                arr[j+1] = temp;
            }
        }
    }
}

// function to calculate points to be given to a vehicle after the race
const calcPoints = (vehicle, place) => {
    // the amount of points a vehicle gets is the sum of it's placement (first gets length-i points, and so on...) and the distance the vehicle crossed
    const divideBy = vehicle.crossed >= 1000 ? 1000 : 100;
    const pts = vehicles.length-place + Math.floor(vehicle.crossed / divideBy);
    return pts;
}

// function to display earned points in the table
const displayPtsTable = () => {
    const rows = document.querySelectorAll('tr');
    rows.forEach((curr, i) => curr.lastElementChild.innerHTML = `<td>${vehicles[i].points} pts</td>`);
}

// function to update documents in the database
const updateData = () => {
    // for each vehicle in the race...
    vehicles.forEach(async (curr, i) => {
        const newData = {
            distance: curr.distance + curr.crossed,
            points: curr.points + calcPoints(curr, i),
            /* wins: curr.wins */
        }

        // also update the vehicles with the new points cus they need to be displayed
        curr.points = newData.points;//

        // ... send a patch request to update it's data after the race
        await fetch(`/vehicles/${curr.name}`, {
            method: 'PATCH',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(newData)
        })
    });
}

// function to run the main loop to simulate the race
const loopPass = async () => {
    vehicles.forEach(async curr => {
        if(curr.status === 'working') {
            // add crossed distance
            curr.crossed = simulate(curr);
    
            if(curr.crossed >= race.length) {
                curr.status = 'finished';
                /* if(sortStartIndex === 0)
                    curr.wins++; */

                sortStartIndex++;
            }
        }
    });

    // sort the array in descending order based on the crossed distance
    sort(vehicles, sortStartIndex);

    // add html for each vehicle into the html string, and set the table html to that string
    vehicles.forEach((curr, i) => addRow(i+1, curr));
    table.innerHTML = tableHtml;
    tableHtml = '';

    // after the set timeout, check if all the conditions to run another lap are met, and run it if they are. Otherwise, write the data in the database and exit the function
    setTimeout(() => {
        if(!raceGoing) {
            updateData();
            displayPtsTable();  
            
            if(betOn && betOn === vehicles[0].name)
                modal.style.visibility = 'visible';
        }
        else if(!vehicles.some(curr => curr.status === 'working')) {
            updateData();
            displayPtsTable();

            if(betOn && betOn === vehicles[0].name)
                modal.style.visibility = 'visible';
        }
        else
            loopPass();
    }, speed);
}

// function to run simulation
const run = async () => {
    await getData();
    loopPass();
}

// add event listener to change the race running state var to false and make the home button visible
stopBtn.addEventListener('click', () => {
    raceGoing = false
    document.querySelector('.home_btn').style.visibility = 'visible';
});

// add event listener to table rows to highlight the vehicle the user bet on
table.addEventListener('click', event => {
    if(!betted) {
        const row = event.target.closest('tr');
        row.classList.add('bet');
        betOn = row.children[2].textContent;
    }
    betted = true;
});

// add event listener to write the user into the hall of fame if he wins a bet
modal.querySelector('.write_hall_entry_btn').addEventListener('click', async () => {
    const name = document.getElementById('name_input').value;
    const vehicle = betOn;
    const track = race.track;

    const reqBody = { name, vehicle, track }

    await fetch('/hall', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(reqBody)
    });

    // create randomized award vehicle and write it into the db
    const types = ['cross_bike', 'sports_bike', 'sports_car', 'terrain_car', 'truck'];
    const typeIndex = Math.floor(Math.random() * types.length);

    const propertiesMap = new Map();
    propertiesMap.set('sports_car', { maxSpeed: 140, malfunctionChance: 12, class: 'car' });
    propertiesMap.set('terrain_car', { maxSpeed: 100, malfunctionChance: 3, class: 'car' });
    propertiesMap.set('cross_bike', { maxSpeed: 85, malfunctionChance: 3, class: 'bike' });
    propertiesMap.set('sports_bike', { maxSpeed: 130, malfunctionChance: 18, class: 'bike' });
    propertiesMap.set('truck', { maxSpeed: 80, malfunctionChance: 6, class: 'truck' });

    const awardName = name + '\'s ' + propertiesMap.get(types[typeIndex]).class;

    // the rest of the required info will be filled out by the input controller in the api 
    const awardVehicle = {
        name: awardName,
        vehicleType: types[typeIndex],
        ...propertiesMap.get(types[typeIndex]),
        special: true
    };

    await fetch('/vehicles/award', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(awardVehicle)
    });

    modal.style.visibility = 'hidden';
});

run();