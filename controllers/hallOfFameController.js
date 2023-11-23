const Hall = require('../models/hallOfFameModel');

const messages = [
    " got lucky.",
    " showed us all he can tell the future.",
    " wiped the floor with the rest of us."
];

exports.createEntry = async (req, res) => {
    const messageIndex = Math.floor(Math.random()*messages.length);

    const date = new Date();
    const dateString = `${date.getDate()}.${date.getMonth()+1}.${date.getFullYear()}.`;

    const docProperties = {
        message: messages[messageIndex],
        date: dateString
    }

    try {
        const entry = await Hall.create({...req.body, ...docProperties });

        res.status(201).json({
            status: 'success',
            data: entry
        });
    }
    catch(e) {
        res.status(400).json({
            status: 'fail',
            message: e
        });
    }
}

exports.getAllEntries = async (req, res) => {
    try {
        const entries = await Hall.find();

        res.status(200).json({
            status: 'success',
            entries: entries.length,
            data: entries
        });
    }
    catch {
        res.status(404).json({
            status: 'fail',
            message: 'no entries found!'
        });
    }
}