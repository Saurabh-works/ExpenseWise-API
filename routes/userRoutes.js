const express = require('express');
const router = express.Router();
const { getUserByEmail } = require('../controllers/userController');  // Import the controller

// Route to get user by email
router.get('/', getUserByEmail);

module.exports = router;
