const express = require('express');
const router = express.Router();
const { sendMessage, getMessages } = require('../controllers/supportController');

router.post('/message', sendMessage);
router.get('/messages', getMessages);

module.exports = router;
