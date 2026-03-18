const express = require('express');

const productController = require('../controllers/productController');
const sellerAuthMiddleware = require('../authentication/sellerAuth');
const userAuthMiddleware = require('../authentication/auth');

const router = express.Router();

router.get('/', productController.getProducts);

router.get('/seller-inventory', sellerAuthMiddleware.authenticateSeller, productController.getSellerProducts);

router.post('/add', sellerAuthMiddleware.authenticateSeller, productController.postAddProduct);

router.get('/cart', userAuthMiddleware.authenticate, productController.getCart);
router.post('/cart', userAuthMiddleware.authenticate, productController.postCart);

module.exports = router;
