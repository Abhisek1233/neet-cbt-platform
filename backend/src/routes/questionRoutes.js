const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');

router.get('/', questionController.getQuestions);
router.post('/generate-question', questionController.generateAiQuestion);
router.post('/ai/generate-question', questionController.generateAiQuestion);

module.exports = router;
