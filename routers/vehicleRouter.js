const express = require('express');
const vehicleController = require('../controllers/vehicleController');

const router = express.Router();


router.route('/')
.post(vehicleController.addVehicle)
.get(vehicleController.getAllVehicles);

router.route('/:name')
.get(vehicleController.getVehicle)
.patch(vehicleController.updateVehicle)
.delete(vehicleController.deleteVehicle);

router.post('/award', vehicleController.createAward);

module.exports = router;