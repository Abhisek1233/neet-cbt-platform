const Question = require('../models/Question');
const aiService = require('../services/aiService');
const responseHandler = require('../utils/responseHandler');

exports.getQuestions = async (req, res, next) => {
  try {
    const questions = await Question.findAll();
    return responseHandler.success(res, questions, 'Questions retrieved successfully.');
  } catch (err) {
    next(err);
  }
};

exports.generateAiQuestion = async (req, res, next) => {
  try {
    const { subject = 'Physics', chapter = 'Ray Optics', type = 'Assertion-Reason' } = req.body;
    const generatedQuestion = await aiService.generateNeetQuestion(subject, chapter, type);
    await Question.create(generatedQuestion);

    const io = req.app.get('io');
    if (io) io.emit('db:new-question', generatedQuestion);

    return responseHandler.success(res, generatedQuestion, 'AI Question generated successfully.', 201);
  } catch (err) {
    next(err);
  }
};
