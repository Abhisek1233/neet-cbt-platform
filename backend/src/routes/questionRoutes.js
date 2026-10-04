const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');

router.get('/', questionController.getQuestions);
router.post('/', questionController.createQuestion);
router.delete('/clear-all', questionController.clearAllQuestions);
router.delete('/:id', questionController.deleteQuestion);
router.post('/generate-question', questionController.generateAiQuestion);
router.post('/ai/generate-question', questionController.generateAiQuestion);
router.post('/generate-batch', questionController.generateAiQuestionsBatch);
router.post('/ai/generate-batch', questionController.generateAiQuestionsBatch);

module.exports = router;

