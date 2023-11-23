const express = require('express');
const trackController = require('../controllers/trackController');

const router = express.Router();

router.route('/')
 .get(trackController.getAllTracks)
 .post(trackController.createTrack);

router.route('/:name')
 .get(trackController.getTrack);

module.exports = router;