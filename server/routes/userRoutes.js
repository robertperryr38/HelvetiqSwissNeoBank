const express = require('express');
const router = express.Router();
const { register, login, getMe, getAllUsers } = require('../controllers/userController');

router.post('/register', register);
router.post('/login', login);
router.get('/me', getMe);
router.get('/', getAllUsers);

module.exports = router;
