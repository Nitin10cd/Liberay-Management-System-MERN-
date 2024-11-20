const express = require('express');
const Controller = require('../Controllers/controller')
const router = express.Router();

// POST route for user registration
router.post('/register', Controller.registerUser);
router.post('/login', Controller.loginUser);
router.post('/issue' , Controller.BookIssue);
router.post('/logout' , Controller.logout_post)

module.exports = router;
