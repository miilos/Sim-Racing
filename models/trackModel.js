const mongoose = require('mongoose');

const trackSchema = new mongoose.Schema({
    cssId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
        unique: true
    },
    shapeImgPath: {
        type: String,
        required: true
    },
    effects: {
        type: Number,
        default: 0
    },
    length: {
        type: Number,
        required: true
    },
    doublePoints: {
        type: Boolean,
        default: false
    }
});

const Track = mongoose.model('Track', trackSchema);
module.exports = Track;