const responseHandler = require('../utils/responseHandler');

const memoryDoubts = [
  {
    id: 'd1',
    author: 'Priya Sundaram',
    subject: 'Physics',
    topic: 'Ray Optics',
    question: 'Why do we add powers algebraically P = P1 + P2 when lenses are placed in contact?',
    upvotes: 14,
    replies: [
      { author: 'Prof. V. K. Mehta (Teacher)', role: 'Teacher', text: 'Because image formed by 1st lens acts as virtual object for 2nd lens.', time: '2 hours ago' }
    ]
  }
];

exports.getDoubts = async (req, res, next) => {
  try {
    return responseHandler.success(res, memoryDoubts, 'Doubts retrieved successfully.');
  } catch (err) {
    next(err);
  }
};

exports.createDoubt = async (req, res, next) => {
  try {
    const { subject, topic, questionText, author } = req.body;
    const newDoubt = {
      id: `d_${Date.now()}`,
      author: author || 'Student',
      subject,
      topic,
      question: questionText,
      upvotes: 1,
      replies: []
    };
    memoryDoubts.unshift(newDoubt);
    return responseHandler.success(res, newDoubt, 'Doubt posted successfully.', 201);
  } catch (err) {
    next(err);
  }
};

exports.addReply = async (req, res, next) => {
  try {
    const { doubtId, text, author, role } = req.body;
    const doubt = memoryDoubts.find(d => d.id === doubtId);
    if (!doubt) return responseHandler.error(res, 'Doubt not found', 404);

    const newReply = { author: author || 'User', role: role || 'Student', text, time: 'Just now' };
    doubt.replies.push(newReply);

    return responseHandler.success(res, newReply, 'Reply added successfully.', 201);
  } catch (err) {
    next(err);
  }
};
