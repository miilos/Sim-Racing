const startBtn = document.querySelector('.start_btn');
let selectedName, selectedEl;

// function to handle keeping track of the selected track on the ui and in the script
const toggleActive = event => {
    if(selectedEl)
        selectedEl.classList.remove('selected');
    
    // get the newly selected track div and add .selected to it
    selectedEl = event.target.closest('.track');
    selectedEl.classList.add('selected');

    // replace the value of selectedTrack with the name of the newly selected track
    selectedName = selectedEl.querySelector('.track_name').textContent;
}

// function to handle all api calls and fill out race data
const fillRaceDoc = async () => {
    // get the id of the race that's being created
    const url = window.location.href;
    const i = url.lastIndexOf('/'); // the race's uid starts with a / in the url
    const uid = url.substring(i+1);
    
    // get race and track data from api if a track is selected
    if(selectedName) {
        const raceRes = await fetch(`/race/${uid}`);
        const race = (await raceRes.json()).race[0];

        const trackRes = await fetch(`/track/${selectedName}`);
        const track = (await trackRes.json()).track[0];
        
        // fill out race data
        race.length = track.length;
        race.effect = track.effects;
        race.doublePoints = track.doublePoints;
        race.track = track.name;
        
        // edit the race document in the database
        await fetch(`/race/${uid}`, {
            method: 'PATCH',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(race)
        });

        // open the race simulation page
        window.location.href = `/simRace/${uid}`;
    }
}

// add event listeners to tracks in the ui
document.querySelectorAll('.track').forEach(curr => curr.addEventListener('click', toggleActive));
startBtn.addEventListener('click', fillRaceDoc);