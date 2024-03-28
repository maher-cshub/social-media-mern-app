const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', authController.login);

// @route   GET /api/auth/logout
// @desc    Logout user
// @access  Private
router.get('/logout', auth, authController.logout);

// @route   POST /api/auth/register
// @desc    Register user
// @access  Public
router.post('/register',authController.register);




module.exports = router;
