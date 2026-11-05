const express = require('express');
const router = express.Router();
const { getTechnicalQuestions, getAptitudeQuestions, submitPracticeTest, getDailyChallenge } = require('../controllers/practiceController');
const { getLeaderboard } = require('../controllers/adminController');
const { protect, optionalProtect } = require('../middleware/authMiddleware');

router.get('/technical', optionalProtect, getTechnicalQuestions);
router.get('/aptitude', optionalProtect, getAptitudeQuestions);
router.post('/submit-test', optionalProtect, submitPracticeTest);
router.get('/daily-challenge', optionalProtect, getDailyChallenge);
router.get('/leaderboard', optionalProtect, getLeaderboard);

module.exports = router;
