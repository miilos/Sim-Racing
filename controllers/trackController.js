const Track = require('../models/trackModel');

exports.createTrack = async (req, res) => {
    try {
        const track = await Track.create(req.body);

        res.status(201).json({
            status: 'success',
            track
        });
    }
    catch {
        res.status(400).json({
            status: 'fail',
            message: 'Bad data sent!'
        });
    }
}

exports.getAllTracks = async (req, res) => {
    try {
        const tracks = await Track.find();

        res.status(200).json({
            status: 'success',
            tracks
        });
    }
    catch {
        res.status(404).json({
            status: 'fail',
            message: 'Something went wrong'
        });
    }
}

exports.getTrack = async (req, res) => {
    try {
        const track = await Track.find({ name: req.params.name });

        if(!track.length) throw new Error('No track found');

        res.status(200).json({
           status: 'success',
           track
        });
    }
    catch(err) {
        res.status(404).json({
            status: 'fail',
            message: err.message
        });
    }
}