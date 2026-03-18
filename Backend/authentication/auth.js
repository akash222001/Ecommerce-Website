const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authenticate = (req, res, next) => {
    try {
        const token = req.header('Authorization');
        
        if (!token) {
            return res.status(401).json({ success: false, message: 'Authentication failed. No token provided.' });
        }
        
        const pureToken = token.startsWith('Bearer ') ? token.slice(7) : token;
        
        const decodedUserToken = jwt.verify(pureToken, process.env.JWT_USER_SECRET);
        
        User.findByPk(decodedUserToken.userId).then(user => {
            if(!user){
                 return res.status(404).json({ success: false, message: 'User not found in DB.' });
            }
            req.user = user; 
            next();
        }).catch(err => {
            throw new Error(err);
        })

    } catch(err) {
        return res.status(401).json({ success: false, message: 'Invalid token or token expired.'});
    }
}

module.exports = {
    authenticate
};
