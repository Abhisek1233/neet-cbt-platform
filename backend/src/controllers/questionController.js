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

exports.createQuestion = async (req, res, next) => {
  try {
    const q = req.body;
    const newQ = await Question.create(q);

    const io = req.app.get('io');
    if (io) io.emit('db:new-question', newQ);

    return responseHandler.success(res, newQ, 'Question created successfully.', 201);
  } catch (err) {
    next(err);
  }
};

exports.deleteQuestion = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Question.deleteById(id);
    return responseHandler.success(res, null, 'Question deleted successfully.');
  } catch (err) {
    next(err);
  }
};

exports.clearAllQuestions = async (req, res, next) => {
  try {
    await Question.deleteAll();
    return responseHandler.success(res, null, 'All questions cleared successfully.');
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

exports.generateAiQuestionsBatch = async (req, res, next) => {
  try {
    const { category, subjects, count = 10, difficulty, type, chapter } = req.body;
    const questions = await aiService.generateNeetQuestionsBatch({
      category,
      subjects,
      count: parseInt(count, 10) || 10,
      difficulty,
      type,
      chapter
    });

    return responseHandler.success(res, questions, 'Batch AI Questions generated successfully.', 200);
  } catch (err) {
    next(err);
  }
};

