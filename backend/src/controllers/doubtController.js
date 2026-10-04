const responseHandler = require('../utils/responseHandler');
const aiService = require('../services/aiService');

const memoryDoubts = [
  {
    id: 'd1',
    author: 'Priya Sundaram',
    subject: 'Physics',
    topic: 'Ray Optics',
    question: 'Why do we add powers algebraically P = P1 + P2 when lenses are placed in contact?',
    upvotes: 14,
    replies: [
      { author: 'Prof. V. K. Mehta (Teacher)', role: 'Teacher', text: 'Because image formed by 1st lens acts as virtual object for 2nd lens. Effective focal length: 1/F = 1/f1 + 1/f2 => P = P1 + P2.', time: '2 hours ago' },
      { author: 'Dr. AI Senior Faculty (Gemini 3.8)', role: 'Teacher', text: '📌 **Key Concept**: The refraction by first lens produces an intermediate image that serves as the object for the second lens.\n\n📖 **NCERT Explanation**: Using lens maker formula for thin lenses in contact: 1/v - 1/u = (1/f1) + (1/f2) = 1/F. Since optical power P = 1/f in meters, P_net = P1 + P2.\n\n💡 **NEET Tip**: Powers are added algebraically with their signs: convex is +P, concave is -P.', time: '1 hour ago' }
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
      subject: subject || 'Physics',
      topic: topic || 'Core NCERT',
      question: questionText,
      upvotes: 1,
      replies: []
    };

    // Auto-generate instant AI Teacher reply using Gemini
    try {
      const aiReply = await aiService.solveNeetDoubt(questionText, questionText, subject);
      if (aiReply && aiReply.summary) {
        newDoubt.replies.push({
          author: 'Dr. AI Senior Faculty (Gemini 3.8)',
          role: 'Teacher',
          text: `📌 **Key Concept**: ${aiReply.summary}\n\n📖 **NCERT Breakdown**: ${aiReply.detailedExplanation}\n\n💡 **NEET Exam Tip**: ${aiReply.keyTakeaway}`,
          time: 'Just now'
        });
      }
    } catch (aiErr) {
      console.warn('Auto AI Doubt reply skipped:', aiErr.message);
    }

    memoryDoubts.unshift(newDoubt);
    return responseHandler.success(res, newDoubt, 'Doubt posted and analyzed by AI Senior Faculty.', 201);
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
