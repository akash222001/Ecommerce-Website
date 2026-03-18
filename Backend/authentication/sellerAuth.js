const jwt = require('jsonwebtoken');
const Seller = require('../models/seller');

const authenticateSeller = (req, res, next) => {
    try {
        const token = req.header('Authorization');
        
        if (!token) {
            return res.status(401).json({ success: false, message: 'Seller Authentication failed. No token provided.' });
        }
        
        const pureToken = token.startsWith('Bearer ') ? token.slice(7) : token;
        
        const decodedSellerToken = jwt.verify(pureToken, process.env.JWT_SELLER_SECRET);
        
        Seller.findByPk(decodedSellerToken.sellerId).then(seller => {
            if(!seller){
                 return res.status(404).json({ success: false, message: 'Seller not found in DB.' });
            }
            req.seller = seller; 
            next();
        }).catch(err => {
            throw new Error(err);
        })

    } catch(err) {
        return res.status(401).json({ success: false, message: 'Invalid seller token or token expired.'});
    }
}

module.exports = {
    authenticateSeller
};
