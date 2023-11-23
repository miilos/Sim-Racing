const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const app = require('./app');

dotenv.config({ path: './config.env' });

const db = process.env.DATABASE.replace('<password>', process.env.DATABASE_PASSWORD);

mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(() => console.log('DB connection succesful!') );

app.listen(3500, () => { console.log('listening on port 3500!') });