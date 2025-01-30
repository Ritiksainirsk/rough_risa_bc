const express = require('express');
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

// Protected routes
router.get('/profile', protect, getProfile);

module.exports = router;
