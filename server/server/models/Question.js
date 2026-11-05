const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  moduleType: { 
    type: String, 
    enum: ['HR', 'TECHNICAL', 'APTITUDE', 'COMPANY'], 
    required: true 
  },
  category: { 
    type: String, 
    required: true // e.g. "Java", "Python", "Data Structures", "Percentages", "TCS", "Behavioral", etc.
  },
  topic: { type: String, default: '' },
  difficulty: { 
    type: String, 
    enum: ['Beginner', 'Intermediate', 'Advanced'], 
    default: 'Intermediate' 
  },
  company: { 
    type: String, 
    enum: ['TCS', 'Infosys', 'Wipro', 'Cognizant', 'Accenture', 'Capgemini', 'All', 'None'], 
    default: 'None' 
  },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  codeSnippet: { type: String, default: '' },
  options: [{ type: String }], // For MCQ
  correctOptionIndex: { type: Number, default: 0 },
  explanation: { type: String, default: '' },
  sampleAnswer: { type: String, default: '' }, // For HR/Tech oral questions
  keyPointsToCover: [{ type: String }],
  createdFromAdmin: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Question', questionSchema);
