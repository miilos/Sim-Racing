const mongoose = require('mongoose');

const raceSchema = new mongoose.Schema({
    uid: {
        type: String,
        unique: true,
        required: true
    },
    vehicles: {
        type: [String],
        required: true
    },
    length: {
        type: Number,
        default: 0
    },
    effect: {
        type: Number,
        default: 0
    },
    doublePoints: {
        type: Boolean,
        default: false
    },
    track: String
});

const Race = mongoose.model('Race', raceSchema);
module.exports = Race;