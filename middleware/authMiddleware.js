const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

const protect = asyncHandler(async (req, res, next) => {
    let token;

    // First check the cookie
    token = req.cookies.jwt;

    // If no cookie, check Authorization header
    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        res.status(401);
        throw new Error('Not authorized, no token please first login or signin');
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);


        // Get user from the token
        req.user = await User.findById(decoded.id).select('-password');
        next();
    } catch (error) {
        res.status(401);
        throw new Error('Not authorized');
    }
});

module.exports = { protect };
