const express = require('express');

const signupLoginController = require('../controllers/signuploginController');

const router = express.Router();

router.post('/signup', signupLoginController.postSignup);

router.post('/login', signupLoginController.postLogin);

module.exports = router;
