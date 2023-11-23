const express = require('express');
const viewController = require('../controllers/viewController');

const router = new express.Router();

router.get('/', viewController.getMainPage);
router.get('/startRace', viewController.getStartRace);
router.get('/simRace/:uid', viewController.getRace);
router.get('/pickTrack/:uid', viewController.getPickTrack);
router.get('/h2h', viewController.getHead2head);
router.get('/garage', viewController.getGarage);
router.get('/add_vehicle', viewController.getAddVehicle);
router.get('/search', viewController.getSearch);
router.get('/leaderboards', viewController.getLeaderboards);
router.get('/rules', viewController.getRules);
router.get('/hall_of_fame', viewController.getHallOfFame);

module.exports = router;