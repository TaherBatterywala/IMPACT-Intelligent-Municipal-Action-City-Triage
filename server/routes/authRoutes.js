const express = require('express');
const router = express.Router();
const { registerUser, loginUser, loginOfficer, registerOfficer } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware'); // For seeding officer if needed, or open

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/officer/login', loginOfficer);
router.post('/officer/register', registerOfficer); // Maybe protect this in real app

module.exports = router;
