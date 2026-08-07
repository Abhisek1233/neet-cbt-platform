const express = require('express');
const router = express.Router();
const attemptController = require('../controllers/attemptController');

router.post('/submit', attemptController.submitAttempt);

module.exports = router;
