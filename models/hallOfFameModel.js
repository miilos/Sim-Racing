const mongoose = require('mongoose');

const hallSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    vehicle: {
        type: String,
        required: true
    },
    track: {
        type: String,
        required: true
    }
});

const Hall = mongoose.model('HallOfFame', hallSchema);
module.exports = Hall;