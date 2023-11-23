const express = require('express');
const hallOfFameController = require('../controllers/hallOfFameController');

const hallRouter = express.Router();

hallRouter.route('/')
 .post(hallOfFameController.createEntry)
 .get(hallOfFameController.getAllEntries)

module.exports = hallRouter;