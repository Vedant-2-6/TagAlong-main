const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const authenticate = require('../middlewares/auth');

// Get chat history between two users
router.get('/history', authenticate, chatController.getChatHistory);

// Get all chats for a user
router.get('/user/:userId', authenticate, chatController.getUserChats);

module.exports = router;