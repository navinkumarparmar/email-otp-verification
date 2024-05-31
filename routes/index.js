const express = require('express');
const apiroutes = express.Router();

const user = require('./user');
apiroutes.use('/user',user);

module.exports = apiroutes;