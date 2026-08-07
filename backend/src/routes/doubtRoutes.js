const express = require('express');
const router = express.Router();
const doubtController = require('../controllers/doubtController');

router.get('/', doubtController.getDoubts);
router.post('/', doubtController.createDoubt);
router.post('/reply', doubtController.addReply);

module.exports = router;
