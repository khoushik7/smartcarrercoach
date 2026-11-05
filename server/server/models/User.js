const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  college: { type: String, default: 'Engineering & Technology Institute' },
  degree: { type: String, default: 'B.Tech Computer Science' },
  graduationYear: { type: Number, default: 2026 },
  targetRole: { type: String, default: 'Software Engineer' },
  skills: [{ type: String }],
  bio: { type: String, default: 'Aspiring software developer preparing for campus placements.' },
  
  // Placement stats & progress
  placementReadinessScore: { type: Number, default: 65 },
  totalInterviews: { type: Number, default: 0 },
  avgHrScore: { type: Number, default: 0 },
  avgTechScore: { type: Number, default: 0 },
  avgAptitudeScore: { type: Number, default: 0 },
  avgCommunicationScore: { type: Number, default: 0 },
  dailyStreak: { type: Number, default: 1 },
  lastActiveDate: { type: Date, default: Date.now },

  // Password reset fields
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);