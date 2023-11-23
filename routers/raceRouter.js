const express = require('express');
const raceController = require('../controllers/raceController');

const router = express.Router();

router.route('/')
 .post(raceController.createRace);

router.route('/:uid')
 .get(raceController.getRace)
 .patch(raceController.editRace)
 .delete(raceController.deleteRace);

module.exports = router;