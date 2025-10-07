const express = require('express');
const { sendMessage } = require('../controllers/chatController');

const router = express.Router();

// Chat endpoint
router.post('/', sendMessage);

module.exports = router;
