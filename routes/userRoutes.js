const express = require('express');
const passport = require('passport');
const router = express.Router();

const { 
    registerUser, 
    loginUser, 
    getProfile,
    logoutUser,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.post('/profile', getProfile);

// Auth with Google
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

// Callback route for Google to redirect to
router.get('/google/callback', passport.authenticate('google'), (req, res) => {
    const token = generateToken(req.user._id); // Generate token for the authenticated user
    setTokenCookie(res, token); // Set token in cookie
    // Successful authentication, redirect to your desired route
    res.redirect('/'); // Adjust this to your frontend route
});

// Protected routes
router.get('/profile', protect, getProfile);

module.exports = router;
