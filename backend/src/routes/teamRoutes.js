const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');

router.get('/', teamController.getTeams);
router.post('/message', teamController.sendTeamMessage);

module.exports = router;
