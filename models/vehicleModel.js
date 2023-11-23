const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A vehicle must have a name!'],
        unique: true
    },
    maxSpeed: {
        type: Number,
        default: 0
    },
    distance: {
        type: Number,
        default: 0
    },
    points: {
        type: Number,
        default: 0
    },
    malfunctionChance: {    
        type: Number,
        required: [true, 'Internal error: No malfunction chance specified']
    },
    vehicleType: {
        type: String,
        required: [true, 'Internal error: A vehicle must have a type']
    },
    class: {
        type: String,
        required: [true, 'Internal error: A vehicle must belong to a class']
    },
    status: {
        type: String,
        default: 'working'
    },
    special: {
        type: Boolean,
        default: false
    }/* ,
    wins: {
        type: Number,
        default: 0
    } */
});

const Vehicle = mongoose.model('Vehicle', schema);
module.exports = Vehicle;