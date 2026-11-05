const Question = require('../models/Question');
const User = require('../models/User');
const TestSubmission = require('../models/TestSubmission');

// @route GET /api/practice/technical
const getTechnicalQuestions = async (req, res) => {
  try {
    const { category, difficulty, limit = 10 } = req.query;
    const query = { moduleType: 'TECHNICAL' };

    if (category && category !== 'All') query.category = category;
    if (difficulty && difficulty !== 'All') query.difficulty = difficulty;

    const questions = await Question.find(query).limit(Number(limit));
    console.log(`[PRACTICE] 📚 Fetched ${questions.length} Technical Questions (Category: ${category || 'All'}, Difficulty: ${difficulty || 'All'})`);
    res.json(questions);
  } catch (err) {
    console.error('[PRACTICE] ❌ Fetch technical error:', err);
    res.status(500).json({ error: 'Failed to fetch technical questions.' });
  }
};

// @route GET /api/practice/aptitude
const getAptitudeQuestions = async (req, res) => {
  try {
    const { topic, difficulty, limit = 10 } = req.query;
    const query = { moduleType: 'APTITUDE' };

    if (topic && topic !== 'All') query.topic = topic;
    if (difficulty && difficulty !== 'All') query.difficulty = difficulty;

    const questions = await Question.find(query).limit(Number(limit));
    console.log(`[PRACTICE] 🧮 Fetched ${questions.length} Aptitude Questions (Topic: ${topic || 'All'}, Difficulty: ${difficulty || 'All'})`);
    res.json(questions);
  } catch (err) {
    console.error('[PRACTICE] ❌ Fetch aptitude error:', err);
    res.status(500).json({ error: 'Failed to fetch aptitude questions.' });
  }
};

// @route POST /api/practice/submit-test
const submitPracticeTest = async (req, res) => {
  try {
    const { moduleType = 'TECHNICAL', answers = [], category = 'General', difficulty = 'Intermediate' } = req.body;
    
    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ error: 'Invalid answers array.' });
    }

    let correctCount = 0;
    const evaluatedResults = [];

    for (const ans of answers) {
      const q = await Question.findById(ans.questionId);
      if (q) {
        const isCorrect = q.correctOptionIndex === ans.selectedOptionIndex;
        if (isCorrect) correctCount++;
        
        evaluatedResults.push({
          questionId: q._id.toString(),
          title: q.title,
          selectedOptionIndex: ans.selectedOptionIndex,
          correctOptionIndex: q.correctOptionIndex,
          isCorrect,
          explanation: q.explanation || 'Verified answer key.'
        });
      } else {
        // Fallback if question was synthetic or demo
        evaluatedResults.push({
          questionId: ans.questionId || 'demo-q',
          title: 'Practice Question',
          selectedOptionIndex: ans.selectedOptionIndex,
          correctOptionIndex: 0,
          isCorrect: ans.selectedOptionIndex === 0,
          explanation: 'Standard domain answer'
        });
      }
    }

    const totalQuestions = answers.length;
    const scorePercentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

    // Determine current user
    let user = null;
    let userName = 'Student Candidate';
    let userEmail = 'student@smartcareer.com';

    if (req.user && req.user.id) {
      user = await User.findById(req.user.id);
    } else {
      user = await User.findOne({ email: 'student@smartcareer.com' });
    }

    if (user) {
      userName = user.name;
      userEmail = user.email;

      if (moduleType === 'APTITUDE') {
        user.avgAptitudeScore = user.avgAptitudeScore === 0 ? scorePercentage : Math.round((user.avgAptitudeScore + scorePercentage) / 2);
      } else if (moduleType === 'TECHNICAL') {
        user.avgTechScore = user.avgTechScore === 0 ? scorePercentage : Math.round((user.avgTechScore + scorePercentage) / 2);
      }

      user.placementReadinessScore = Math.round(
        (user.avgHrScore * 0.25) + 
        (user.avgTechScore * 0.35) + 
        (user.avgAptitudeScore * 0.20) + 
        (user.avgCommunicationScore * 0.20) || scorePercentage
      );

      await user.save();
    }

    // --- STORE TEST SUBMISSION IN DATABASE ---
    const savedTest = await TestSubmission.create({
      user: user ? user._id : null,
      userName,
      userEmail,
      moduleType,
      category: category || (answers[0]?.category) || 'General',
      difficulty: difficulty || 'Intermediate',
      totalQuestions,
      correctCount,
      scorePercentage,
      answers: evaluatedResults
    });

    // --- PROMINENT TERMINAL LOGGING IN VS CODE SERVER TERMINAL ---
    console.log(`\n========================================================================`);
    console.log(`[PRACTICE] 📝 TEST SUBMITTED & STORED IN DATABASE!`);
    console.log(`  👤 Student: ${userName} <${userEmail}>`);
    console.log(`  📚 Module: ${moduleType} | Target Category: ${category || 'General'}`);
    console.log(`  🎯 Score: ${scorePercentage}% (${correctCount}/${totalQuestions} correct)`);
    console.log(`  💾 Stored Document ID: ${savedTest._id}`);
    if (user) {
      console.log(`  📈 Updated Placement Readiness: ${user.placementReadinessScore}%`);
    }
    console.log(`========================================================================\n`);

    res.json({
      message: 'Test evaluated and stored in database successfully.',
      submissionId: savedTest._id,
      scorePercentage,
      correctCount,
      totalQuestions,
      results: evaluatedResults,
      updatedReadinessScore: user ? user.placementReadinessScore : scorePercentage
    });
  } catch (err) {
    console.error('[PRACTICE] ❌ Test submission error:', err);
    res.status(500).json({ error: 'Failed to evaluate practice test: ' + err.message });
  }
};

// @route GET /api/practice/daily-challenge
const getDailyChallenge = async (req, res) => {
  try {
    const techQuestion = await Question.findOne({ moduleType: 'TECHNICAL', difficulty: 'Intermediate' });
    const aptQuestion = await Question.findOne({ moduleType: 'APTITUDE', difficulty: 'Intermediate' });

    console.log(`[DAILY SPRINT] ⚡ Served Daily Challenge questions`);
    res.json({
      date: new Date().toISOString().split('T')[0],
      streak: req.user ? req.user.dailyStreak : 5,
      questions: [techQuestion, aptQuestion].filter(Boolean)
    });
  } catch (err) {
    console.error('[DAILY SPRINT] ❌ Error fetching daily challenge:', err);
    res.status(500).json({ error: 'Failed to fetch daily sprint challenge.' });
  }
};

module.exports = {
  getTechnicalQuestions,
  getAptitudeQuestions,
  submitPracticeTest,
  getDailyChallenge
};
