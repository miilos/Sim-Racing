const Vehicle = require('../models/vehicleModel');
const inputController = require('./inputController');

exports.addVehicle = async (req, res) => {
    try {
        const vehicle = await Vehicle.create(inputController.appendToRequest(req.body));

        res.status(201).render('success_create', {
            title: 'Success!',
            name: vehicle.name
        });
    } catch(err) {
        res.status(400).json({
            status: "fail",
            message: err.message
        });
    }
}

exports.createAward = async (req, res) => {
    try {
        const vehicle = await Vehicle.create(req.body);

        res.status(201).json({
            status: "success",
            data: vehicle
        });
    }
    catch(err) {
        res.status(400).json({
            status: "fail",
            message: err
        });
    }

}

exports.getAllVehicles = async (req, res) => {
    try {
        let vehicles;
        const sort = req.query.sort;
        const vClass = req.query.class ? { class: req.query.class } : {};

        if(!sort)
            vehicles = await Vehicle.find(vClass);
        else
            vehicles = await Vehicle.find(vClass).sort(sort);

        res.status(200).json({
            status: "success",
            results: vehicles.length,
            data: vehicles
        });
    } catch(err) {
        res.status(404).json({
            status: "fail",
            message: "Not Found!"
        });
    }
}

exports.getVehicle = async (req, res) => {
    try {
        const vehicle = await Vehicle.find({ name: { '$regex': req.params.name, '$options': 'i'} });

        res.status(200).json({
            status: "success",
            data: vehicle
        });
    } catch(err) {
        res.status(404).json({
            status: "fail",
            message: "Not Found!"
        });
    }
}

exports.updateVehicle = async (req, res) => {
    try {
        const vehicle = await Vehicle.findOneAndUpdate({ name: req.params.name }, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            status: "success",
            data: vehicle
        });
    } catch(err) {
        res.status(404).json({
            status: "fail",
            message: "Not Found!"
        });
    }
}

exports.deleteVehicle = async (req, res) => {
    try {
        const vehicle = await Vehicle.findOneAndDelete({ name: req.params.name });

        res.status(204).json({
            status: "success",
            data: vehicle
        });
    } catch(err) {
        res.status(404).json({
            status: "fail",
            message: "Not Found!"
        });
    }
}