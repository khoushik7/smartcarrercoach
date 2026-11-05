const mongoose = require('mongoose');

const testSubmissionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  userEmail: { type: String, default: 'student@smartcareer.com' },
  userName: { type: String, default: 'Candidate' },
  moduleType: { 
    type: String, 
    enum: ['TECHNICAL', 'APTITUDE', 'COMPANY', 'DAILY_CHALLENGE'], 
    required: true 
  },
  category: { type: String, default: 'General' },
  difficulty: { type: String, default: 'Intermediate' },
  totalQuestions: { type: Number, required: true },
  correctCount: { type: Number, required: true },
  scorePercentage: { type: Number, required: true },
  answers: [{
    questionId: { type: String },
    title: { type: String },
    selectedOptionIndex: { type: Number },
    correctOptionIndex: { type: Number },
    isCorrect: { type: Boolean },
    explanation: { type: String }
  }]
}, { timestamps: true });

module.exports = mongoose.model('TestSubmission', testSubmissionSchema);
