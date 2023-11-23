const Vehicle = require('../models/vehicleModel');
const Track = require('../models/trackModel');
const Race = require('../models/raceModel');
const Hall = require('../models/hallOfFameModel');

exports.getMainPage = (req, res) => {
    res.status(200).render('main_menu', {
        title: 'Main Page'
    });
}

exports.getHead2head = async (req, res) => {
    res.status(200).render('head_2_head', {
        title: 'Head 2 Head'
    });
}

exports.getGarage = async (req, res) => {
    const vehicles = await Vehicle.find();

    res.status(200).render('_cards', {
       title: 'Garage',
       vehicles 
    });
}

exports.getAddVehicle = (req, res) => {
    res.status(200).render('add_vehicle', {
        title: 'Add vehicle'
    })
}

exports.getSearch = (req, res) => {
    res.status(200).render('search', {
        title: 'Search'
    });
}

exports.getLeaderboards = (req, res) => {
    res.status(200).render('leaderboards', {
        title: 'Leaderboards'
    });
}

exports.getRules = (req, res) => {
    res.status(200).render('rules', {
        title: 'Rules'
    });
}

exports.getStartRace = (req, res) => {
    res.status(200).render('start_race', {
        title: 'Start race'
    })
}

exports.getPickTrack = async (req, res) => {
    const data = await Track.find();

    res.status(200).render('select_track', {
        title: 'Select track',
        tracks: data
    });
}

exports.getRace = async (req, res) => {
    const race = await Race.find({ uid: req.params.uid });
    const vehicles = [];
    
    for(let i = 0; i < race[0].vehicles.length; i++) {
        try {
            const v = await Vehicle.find({ name: race[0].vehicles[i] });
            vehicles.push({
                type: v[0].vehicleType,
                name: v[0].name
            });
        }
        catch { 
            console.log('what the fuck');
            continue; 
        }
    }

    res.status(200).render('race', {
        title: 'Race',
        race: race[0],
        vehicles
    });
}

exports.getHallOfFame = async (req, res) => {
    const entries = await Hall.find();

    res.status(200).render('hall_of_fame', {
        title: 'Hall Of Fame',
        entries
    });
}