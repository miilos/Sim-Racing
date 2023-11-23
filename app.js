const express = require('express');
const path = require('path');
const vehicleRouter = require('./routers/vehicleRouter');
const viewRouter = require('./routers/viewRouter');
const raceRouter = require('./routers/raceRouter');
const trackRouter = require('./routers/trackRouter');
const hallRouter = require('./routers/hallRouter');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// MIDDLEWARE
app.use(express.static('public'));

app.use('/pickTrack/test_data', express.static('public/test_data'));
app.use('/pickTrack/util', express.static('public/util'));
app.use('/simRace/css/track_styles', express.static('public/css/track_styles'));
app.use('/simRace/util', express.static('public/util'));

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

// ROUTERS
app.use('/', viewRouter);
app.use('/vehicles', vehicleRouter);
app.use('/race', raceRouter);
app.use('/track', trackRouter);
app.use('/hall', hallRouter);

module.exports = app;