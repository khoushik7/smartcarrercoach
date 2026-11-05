const Interview = require('../models/Interview');
const Question = require('../models/Question');
const User = require('../models/User');
const { evaluateInterviewAnswer } = require('../services/aiService');

// @route POST /api/interview/start
const startInterview = async (req, res) => {
  try {
    const { type = 'HR', company = 'General', questionCount = 5 } = req.body;
    
    // Fetch questions matching filter
    let query = {};
    if (type === 'HR') {
      query.moduleType = 'HR';
    } else if (type === 'COMPANY') {
      query = { moduleType: 'COMPANY', company };
    } else if (type === 'TECHNICAL') {
      query.moduleType = 'TECHNICAL';
    }

    let questions = await Question.find(query).limit(Number(questionCount));

    // Fallback if no questions matched specific query
    if (questions.length === 0) {
      questions = await Question.find({ moduleType: 'HR' }).limit(5);
    }

    const interview = await Interview.create({
      user: req.user.id,
      title: `${type === 'COMPANY' ? company : type} Mock Interview`,
      type,
      company,
      status: 'in_progress',
      answers: []
    });

    console.log(`\n[INTERVIEW] 🎙️ NEW MOCK INTERVIEW SESSION STARTED:`);
    console.log(`  Session ID: ${interview._id} | Type: ${type} | Company: ${company}`);
    console.log(`  Loaded ${questions.length} questions for user: ${req.user.name || req.user.id}\n`);

    res.status(201).json({
      message: 'Interview session created.',
      interviewId: interview._id,
      questions: questions.map(q => ({
        id: q._id,
        title: q.title,
        description: q.description,
        category: q.category,
        difficulty: q.difficulty,
        sampleAnswer: q.sampleAnswer,
        keyPointsToCover: q.keyPointsToCover
      }))
    });
  } catch (err) {
    console.error('Start interview error:', err);
    res.status(500).json({ error: 'Failed to start interview session.' });
  }
};

// @route POST /api/interview/:id/submit-answer
const submitAnswer = async (req, res) => {
  try {
    const { interviewId } = req.params;
    const { questionId, questionTitle, userResponse, inputType = 'text', durationSeconds = 30 } = req.body;

    if (!userResponse || !userResponse.trim()) {
      return res.status(400).json({ error: 'Response content cannot be empty.' });
    }

    const interview = await Interview.findById(interviewId);
    if (!interview) {
      return res.status(404).json({ error: 'Interview session not found.' });
    }

    // Evaluate answer with AI / NLP Service
    const evaluation = await evaluateInterviewAnswer(questionTitle, userResponse, durationSeconds);

    const answerData = {
      questionId,
      questionTitle,
      userResponse,
      inputType,
      speakingDurationSeconds: durationSeconds,
      wordsPerMinute: evaluation.wordsPerMinute,
      fillerWordsCount: evaluation.fillerWordsCount,
      relevanceScore: evaluation.relevanceScore,
      communicationScore: evaluation.communicationScore,
      confidenceScore: evaluation.confidenceScore,
      grammarClarityScore: evaluation.grammarClarityScore,
      overallScore: evaluation.overallScore,
      aiFeedback: evaluation.aiFeedback,
      strengths: evaluation.strengths,
      improvements: evaluation.improvements
    };

    interview.answers.push(answerData);
    await interview.save();

    console.log(`[INTERVIEW] 💬 ANSWER EVALUATED & STORED IN DATABASE:`);
    console.log(`  Session ID: ${interviewId} | Question: "${questionTitle.slice(0, 45)}..."`);
    console.log(`  🎯 Score: ${evaluation.overallScore}% | Pace: ${evaluation.wordsPerMinute} WPM | Fillers: ${evaluation.fillerWordsCount.total}`);

    res.json({
      message: 'Answer evaluated successfully.',
      answerEvaluation: answerData
    });
  } catch (err) {
    console.error('Submit answer error:', err);
    res.status(500).json({ error: 'Failed to evaluate response.' });
  }
};

// @route POST /api/interview/:id/complete
const completeInterview = async (req, res) => {
  try {
    const { id } = req.params;
    const interview = await Interview.findById(id);
    if (!interview) {
      return res.status(404).json({ error: 'Interview session not found.' });
    }

    const answers = interview.answers;
    if (answers.length === 0) {
      return res.status(400).json({ error: 'No answers submitted for this interview.' });
    }

    // Calculate averages
    let totalScore = 0;
    let totalComm = 0;
    let totalConf = 0;
    let totalWpm = 0;
    let totalFillers = 0;

    answers.forEach(ans => {
      totalScore += ans.overallScore;
      totalComm += ans.communicationScore;
      totalConf += ans.confidenceScore;
      totalWpm += ans.wordsPerMinute;
      totalFillers += ans.fillerWordsCount.total;
    });

    const count = answers.length;
    const overallScore = Math.round(totalScore / count);
    const communicationScore = Math.round(totalComm / count);
    const confidenceScore = Math.round(totalConf / count);
    const avgWordsPerMinute = Math.round(totalWpm / count);

    interview.status = 'completed';
    interview.overallScore = overallScore;
    interview.communicationScore = communicationScore;
    interview.confidenceScore = confidenceScore;
    interview.avgWordsPerMinute = avgWordsPerMinute;
    interview.totalFillerWords = totalFillers;

    interview.executiveSummary = `Completed ${interview.type} interview with an overall readiness rating of ${overallScore}%. Candidate demonstrated strong clarity with average speaking pace of ${avgWordsPerMinute} WPM.`;
    interview.keyRecommendations = [
      totalFillers > 3 ? `Reduce filler words (detected ${totalFillers} instances)` : 'Excellent verbal fluency with minimal hesitation.',
      communicationScore < 75 ? 'Structure answers using Situation, Task, Action, Result framework.' : 'Strong structured articulation maintained throughout.',
      'Review technical domain keywords to boost score.'
    ];

    await interview.save();

    // Update user cumulative stats & Placement Readiness Score
    const user = await User.findById(req.user.id);
    if (user) {
      user.totalInterviews += 1;
      
      if (interview.type === 'HR') {
        user.avgHrScore = Math.round((user.avgHrScore * (user.totalInterviews - 1) + overallScore) / user.totalInterviews);
      } else {
        user.avgTechScore = Math.round((user.avgTechScore * (user.totalInterviews - 1) + overallScore) / user.totalInterviews);
      }
      user.avgCommunicationScore = Math.round((user.avgCommunicationScore * (user.totalInterviews - 1) + communicationScore) / user.totalInterviews);
      
      // Update overall Placement Readiness Score (weighted average of HR, Tech, Aptitude, Comm)
      user.placementReadinessScore = Math.round(
        (user.avgHrScore * 0.25) + 
        (user.avgTechScore * 0.35) + 
        (user.avgAptitudeScore * 0.20) + 
        (user.avgCommunicationScore * 0.20) || overallScore
      );

      await user.save();
    }

    res.json({
      message: 'Interview completed successfully.',
      interview
    });
  } catch (err) {
    console.error('Complete interview error:', err);
    res.status(500).json({ error: 'Failed to complete interview.' });
  }
};

// @route GET /api/interview/history
const getInterviewHistory = async (req, res) => {
  try {
    const interviews = await Interview.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .select('-answers.userResponse');
    res.json(interviews);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch interview history.' });
  }
};

// @route GET /api/interview/:id
const getInterviewById = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);
    if (!interview) return res.status(404).json({ error: 'Interview session not found.' });
    res.json(interview);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch interview details.' });
  }
};

module.exports = {
  startInterview,
  submitAnswer,
  completeInterview,
  getInterviewHistory,
  getInterviewById
};
