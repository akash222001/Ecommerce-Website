const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Seller = require('../models/seller');

function generateAccessToken(id, email) {
    return jwt.sign({ sellerId: id, email: email }, process.env.JWT_SELLER_SECRET, { expiresIn: '24h' });
}

exports.postSignup = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        
        if (!email || !password || !name) {
            return res.status(400).json({ message: 'Bad parameters. Something is missing.' });
        }
        
        const existingSeller = await Seller.findOne({ where: { email: email } });
        if (existingSeller) {
            return res.status(409).json({ message: 'Email is already registered as a seller' });
        }
        
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        await Seller.create({
            name: name,
            email: email,
            password: hashedPassword
        });
        
        res.status(201).json({ message: 'Seller registered successfully!' });
        
    } catch (err) {
        console.error('Seller Signup Error: ', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.postLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        
        const seller = await Seller.findOne({ where: { email: email } });
        
        if (!seller) {
            return res.status(404).json({ message: 'Seller not found' });
        }
        
        const doMatch = await bcrypt.compare(password, seller.password);
        
        if (doMatch) {
            const token = generateAccessToken(seller.id, seller.email);
            
            res.status(200).json({ 
                message: 'Seller login successful', 
                token: token,
                seller: { id: seller.id, name: seller.name, email: seller.email }
            });
        } else {
            res.status(401).json({ message: 'Seller not authorized, Invalid password' });
        }
        
    } catch (err) {
        console.error('Seller Login Error: ', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
