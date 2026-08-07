const responseHandler = require('../utils/responseHandler');

const memoryTeams = [
  {
    id: 'team-1',
    name: 'AIIMS Champions 2026',
    membersCount: 18,
    avgScore: 685,
    topRanker: 'Aarav Sharma (715)',
    description: 'High-focus study squad aiming for top 100 AIR in NEET 2026.',
    isMember: true,
    chat: [
      { sender: 'Aarav Sharma', text: 'Hey team! Anyone solved Physics Q2 from Mock 1?', time: '18:30' },
      { sender: 'Sneha Reddy', text: 'Yes! Remember to convert focal length into meters.', time: '18:32' }
    ]
  }
];

exports.getTeams = async (req, res, next) => {
  try {
    return responseHandler.success(res, memoryTeams, 'Study teams retrieved successfully.');
  } catch (err) {
    next(err);
  }
};

exports.sendTeamMessage = async (req, res, next) => {
  try {
    const { teamId, text, sender } = req.body;
    const team = memoryTeams.find(t => t.id === teamId);
    const newMsg = { sender: sender || 'Candidate', text, time: new Date().toLocaleTimeString() };
    if (team) {
      team.chat.push(newMsg);
    }
    const io = req.app.get('io');
    if (io) io.emit('team:chat-broadcast', { teamId, message: newMsg });

    return responseHandler.success(res, newMsg, 'Message sent.', 201);
  } catch (err) {
    next(err);
  }
};
