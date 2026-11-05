const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fileName: { type: String, required: true },
  fileSize: { type: Number, default: 0 },
  parsedText: { type: String, default: '' },
  
  atsScore: { type: Number, required: true }, // Out of 100
  targetRole: { type: String, default: 'Software Engineer' },
  
  formattingScore: { type: Number, default: 80 },
  keywordScore: { type: Number, default: 75 },
  impactScore: { type: Number, default: 70 },
  
  detectedSkills: [{ type: String }],
  missingSkills: [{ type: String }],
  strengths: [{ type: String }],
  improvements: [{ type: String }],
  actionableSuggestions: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Resume', resumeSchema);
