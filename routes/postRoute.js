const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const postController = require('../controllers/postController');

// @route   POST /api/post/create
// @desc    Create a post
// @access  Private
router.post('/create', auth, postController.createPost);

// @route   GET /api/post/all
// @desc    Get all posts
// @access  Public
router.get('/all', postController.getAllPosts);

// @route   PUT /api/post/:id
// @desc    Update a post
// @access  Private
router.put('/:id', auth, postController.updatePost);


// @route   DELETE /api/post/:id
// @desc    Delete a post
// @access  Private
router.delete('/:id', auth, postController.deletePost);

// Add other post routes as needed

module.exports = router;
