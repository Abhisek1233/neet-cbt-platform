const express = require('express');
const router = express.Router();
const predictorController = require('../controllers/predictorController');

router.post('/counseling-advice', predictorController.getCounselingAdvice);

module.exports = router;
