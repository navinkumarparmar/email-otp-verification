// const express = require('express');
// const { create, verifyEmail } = require('../controller/user');
// const apiroutes = express.Router();

// apiroutes.post('/create', create);
// apiroutes.get('/verify/:token', verifyEmail);

// module.exports = apiroutes;
 

const express = require('express');
const apiroutes = express.Router();
const { create, verifyOtp } = require('../controller/user');

apiroutes.post('/create', create);
apiroutes.post('/verify-otp', verifyOtp);

module.exports = apiroutes;
