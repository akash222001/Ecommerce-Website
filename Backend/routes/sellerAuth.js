const express = require('express');

const sellerAuthController = require('../controllers/sellerAuthController');

const router = express.Router();

router.post('/signup', sellerAuthController.postSignup);

router.post('/login', sellerAuthController.postLogin);

module.exports = router;
