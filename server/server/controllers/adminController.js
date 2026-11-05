const User = require('../models/User');
const Question = require('../models/Question');
const Interview = require('../models/Interview');
const Resume = require('../models/Resume');

// @route GET /api/admin/analytics
const getPlatformAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalInterviews = await Interview.countDocuments();
    const totalQuestions = await Question.countDocuments();
    const totalResumes = await Resume.countDocuments();

    const users = await User.find({ role: 'student' }).select('placementReadinessScore avgHrScore avgTechScore avgAptitudeScore avgCommunicationScore');
    
    let avgReadiness = 0;
    if (users.length > 0) {
      avgReadiness = Math.round(users.reduce((acc, u) => acc + (u.placementReadinessScore || 0), 0) / users.length);
    }

    const questionCountsByModule = {
      HR: await Question.countDocuments({ moduleType: 'HR' }),
      TECHNICAL: await Question.countDocuments({ moduleType: 'TECHNICAL' }),
      APTITUDE: await Question.countDocuments({ moduleType: 'APTITUDE' }),
      COMPANY: await Question.countDocuments({ moduleType: 'COMPANY' })
    };

    res.json({
      totalUsers,
      totalInterviews,
      totalQuestions,
      totalResumes,
      avgReadiness,
      questionCountsByModule
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch platform analytics.' });
  }
};

// @route GET /api/admin/questions
const getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find().sort({ createdAt: -1 });
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch questions.' });
  }
};

// @route POST /api/admin/question
const createQuestion = async (req, res) => {
  try {
    const { moduleType, category, topic, difficulty, company, title, description, codeSnippet, options, correctOptionIndex, explanation, sampleAnswer, keyPointsToCover } = req.body;

    if (!moduleType || !category || !title) {
      return res.status(400).json({ error: 'Module type, category, and title are required.' });
    }

    const newQuestion = await Question.create({
      moduleType,
      category,
      topic: topic || '',
      difficulty: difficulty || 'Intermediate',
      company: company || 'None',
      title,
      description: description || '',
      codeSnippet: codeSnippet || '',
      options: options || [],
      correctOptionIndex: correctOptionIndex || 0,
      explanation: explanation || '',
      sampleAnswer: sampleAnswer || '',
      keyPointsToCover: keyPointsToCover || [],
      createdFromAdmin: true
    });

    res.status(201).json({ message: 'Question created successfully.', question: newQuestion });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create question.' });
  }
};

// @route PUT /api/admin/question/:id
const updateQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!question) return res.status(404).json({ error: 'Question not found.' });
    res.json({ message: 'Question updated successfully.', question });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update question.' });
  }
};

// @route DELETE /api/admin/question/:id
const deleteQuestion = async (req, res) => {
  try {
    await Question.findByIdAndDelete(req.params.id);
    res.json({ message: 'Question deleted successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete question.' });
  }
};

// @route GET /api/admin/users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users.' });
  }
};

// @route PUT /api/admin/user/:id/role
const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found.' });

    user.role = role;
    await user.save();
    res.json({ message: `User role updated to ${role}.`, user });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update user role.' });
  }
};

// @route GET /api/leaderboard
const getLeaderboard = async (req, res) => {
  try {
    const students = await User.find({ role: 'student' })
      .select('name college degree placementReadinessScore totalInterviews dailyStreak avatar')
      .sort({ placementReadinessScore: -1, totalInterviews: -1 })
      .limit(50);
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch leaderboard.' });
  }
};

module.exports = {
  getPlatformAnalytics,
  getAllQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  getAllUsers,
  updateUserRole,
  getLeaderboard
};
