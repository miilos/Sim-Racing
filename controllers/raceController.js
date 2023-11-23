const Race = require('../models/raceModel');

exports.createRace = async (req, res) => {
    try {
        const race = await Race.create(req.body);

        res.status(201).json({
            status: 'success',
            race
        });
    }
    catch {
        res.status(404).json({
            status: 'fail',
            message: 'bad data sent!'
        });
    }
}

exports.getRace = async (req, res) => {
    try {
        const uid = req.params.uid;
        const race = await Race.find({ uid: uid });
        
        res.status(200).json({
            status: 'success',
            race
        });
    }
    catch {
        res.status(404).json({
            status: 'fail',
            message: 'uid not found!'
        });
    }
}

exports.editRace = async (req, res) => {
    try {
        const race = await Race.findOneAndUpdate({ uid: req.params.uid }, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            status: 'success',
            race
        });
    }
    catch {
        res.status(404).json({
            status: 'fail',
            message: 'could not find race or bad data sent'
        });
    }
}

exports.deleteRace = async (req, res) => {
    try {
        const uid = req.params.uid;
        const race = await Race.findOneAndDelete({ uid: uid });

        res.status(204).json({
            status: 'success',
            race
        })
    }
    catch {
        res.status(404).json({
            status: 'fail',
            message: 'uid not found!'
        });
    }
}