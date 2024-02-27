const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const profileController = require('../controllers/profileController');

// @route   GET /api/user/profile
// @desc    Get current user's profile
// @access  Private
router.get('/profile', auth, profileController.getUserProfile);

// @route   PUT /api/user/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, profileController.updateUserProfile);

// @route   DELETE /api/user/profile
// @desc    Delete user profile
// @access  Private
router.delete('/profile', auth, profileController.deleteUserProfile);

// Add other user routes as needed

module.exports = router;
