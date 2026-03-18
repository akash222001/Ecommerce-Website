const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

function generateAccessToken(id, email) {
    return jwt.sign({ userId: id, email: email }, process.env.JWT_USER_SECRET, { expiresIn: '24h' });
}

exports.postSignup = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        
        if (!email || !password || !username) {
            return res.status(400).json({ message: 'Bad parameters. Something is missing.' });
        }
        
        const existingUser = await User.findOne({ where: { email: email } });
        if (existingUser) {
            return res.status(409).json({ message: 'Email is already registered' });
        }
        
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        await User.create({
            username: username,
            email: email,
            password: hashedPassword
        });
        
        res.status(201).json({ message: 'User registered successfully!' });
        
    } catch (err) {
        console.error('Signup Error: ', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.postLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ where: { email: email } });
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        const doMatch = await bcrypt.compare(password, user.password);
        
        if (doMatch) {
            const token = generateAccessToken(user.id, user.email);
            
            res.status(200).json({ 
                message: 'Login successful', 
                token: token,
                user: { id: user.id, username: user.username, email: user.email }
            });
        } else {
            res.status(401).json({ message: 'User not authorized, Invalid password' });
        }
        
    } catch (err) {
        console.error('Login Error: ', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
