const mongoose = require('mongoose');

const interviewAnswerSchema = new mongoose.Schema({
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
  questionTitle: { type: String, required: true },
  userResponse: { type: String, required: true },
  inputType: { type: String, enum: ['voice', 'text'], default: 'text' },
  
  // Voice & Speech Analytics
  speakingDurationSeconds: { type: Number, default: 0 },
  wordsPerMinute: { type: Number, default: 0 },
  fillerWordsCount: {
    um: { type: Number, default: 0 },
    uh: { type: Number, default: 0 },
    like: { type: Number, default: 0 },
    youKnow: { type: Number, default: 0 },
    total: { type: Number, default: 0 }
  },

  // AI Evaluation metrics (0-100)
  relevanceScore: { type: Number, default: 75 },
  communicationScore: { type: Number, default: 75 },
  confidenceScore: { type: Number, default: 75 },
  grammarClarityScore: { type: Number, default: 75 },
  overallScore: { type: Number, default: 75 },

  aiFeedback: { type: String, default: '' },
  strengths: [{ type: String }],
  improvements: [{ type: String }]
});

const interviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, default: 'AI Mock HR Interview' },
  type: { type: String, enum: ['HR', 'TECHNICAL', 'COMPANY'], default: 'HR' },
  company: { type: String, default: 'General' },
  status: { type: String, enum: ['in_progress', 'completed'], default: 'in_progress' },
  
  answers: [interviewAnswerSchema],

  // Cumulative Session Analytics
  overallScore: { type: Number, default: 0 },
  communicationScore: { type: Number, default: 0 },
  technicalScore: { type: Number, default: 0 },
  confidenceScore: { type: Number, default: 0 },
  avgWordsPerMinute: { type: Number, default: 0 },
  totalFillerWords: { type: Number, default: 0 },
  
  executiveSummary: { type: String, default: '' },
  keyRecommendations: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Interview', interviewSchema);
