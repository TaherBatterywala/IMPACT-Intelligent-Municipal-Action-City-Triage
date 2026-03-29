const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Officer = require('../models/Officer');

const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from the token
            // Check if it's a user or officer
            let user = await User.findById(decoded.id).select('-password');
            if (!user) {
                user = await Officer.findById(decoded.id).select('-password');
            }

            req.user = user;
            next();
        } catch (error) {
            console.log(error);
            res.status(401).json({ message: 'Not authorized' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

module.exports = { protect };
