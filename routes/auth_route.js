const express = require('express');
const router = express.Router();
const { signup, login, getUserProfile } = require('../controllers/authContollers');
const auth = require('../middleware/authMiddleware');

router.post('/signup', signup);

router.post('/login', login);

router.get('/profile', auth, getUserProfile);

module.exports = router;
