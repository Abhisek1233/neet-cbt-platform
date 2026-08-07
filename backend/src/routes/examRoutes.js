const express = require('express');
const router = express.Router();
const examController = require('../controllers/examController');

router.get('/', examController.getExams);
router.post('/', examController.createExam);

module.exports = router;
