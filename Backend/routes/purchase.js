const express = require('express');

const purchaseController = require('../controllers/purchaseController');
const authMiddleware = require('../authentication/auth');

const router = express.Router();

router.post('/checkout', authMiddleware.authenticate, purchaseController.purchaseStorecart);

router.post('/update-transaction', authMiddleware.authenticate, purchaseController.updateTransactionStatus);

module.exports = router;
