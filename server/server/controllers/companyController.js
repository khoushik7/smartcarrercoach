const Question = require('../models/Question');

const COMPANY_METADATA = {
  TCS: {
    name: 'TCS (Tata Consultancy Services)',
    tagline: 'NQT (National Qualifier Test) & Digital / Prime Hiring',
    rounds: ['NQT Aptitude & Coding Round', 'Technical Interview', 'Managerial & HR Round'],
    eligibility: '60% or 6.0 CGPA throughout 10th, 12th, and UG.',
    frequentlyAskedTopics: ['Arrays & Strings', 'DBMS Queries', 'Time Speed Distance', 'Java OOPs', 'Puzzles'],
    hiringTips: 'Focus on coding accuracy and clear basics in SQL & Data Structures. TCS NQT tests speed in quantitative aptitude.'
  },
  Infosys: {
    name: 'Infosys',
    tagline: 'InfyTQ & HackWithInfy Placement Drives',
    rounds: ['Online Assessment (Logical, Verbal, Pseudo Code, Puzzle)', 'Technical + HR Combined Round'],
    eligibility: '60% throughout academic history. No active backlogs.',
    frequentlyAskedTopics: ['Pseudocode Tracing', 'Permutation & Combination', 'Data Structures (Trees & Graphs)', 'Python / Java'],
    hiringTips: 'Practice pseudocode debugging questions. Infosys emphasizes code optimization and logical reasoning speed.'
  },
  Wipro: {
    name: 'Wipro',
    tagline: 'NLTH (Elite & Turbo Hiring)',
    rounds: ['Aptitude & Written Communication Test', 'Online Coding Test (2 questions)', 'Technical & HR Interview'],
    eligibility: '60% in 10th, 12th, and Graduation.',
    frequentlyAskedTopics: ['Percentages & Averages', 'Basic C/C++ Coding', 'Essay Writing (Grammar)', 'Computer Networks'],
    hiringTips: 'Grammar and written communication score carries high weight in Round 1.'
  },
  Cognizant: {
    name: 'Cognizant (CTS)',
    tagline: 'GenC & GenC Elevate Placement Drive',
    rounds: ['Skill-Based Aptitude & Automata Fix', 'Technical Interview', 'HR Assessment'],
    eligibility: '60% or 6.3 CGPA with up to 1 standing backlog allowed at application.',
    frequentlyAskedTopics: ['Code Debugging (Automata Fix)', 'Probability & Ratios', 'DBMS Normalization', 'Web Basics'],
    hiringTips: 'Automata Fix evaluates line-by-line syntax error identification in C++ / Java / Python.'
  },
  Accenture: {
    name: 'Accenture',
    tagline: 'Associate Software Engineer (ASE) & Advanced ASE',
    rounds: ['Cognitive & Technical Assessment', 'Coding Assessment', 'Communication Assessment', 'Virtual HR Interview'],
    eligibility: '65% or 6.5 CGPA in current degree.',
    frequentlyAskedTopics: ['MS Office & Cloud Basics', 'Pseudocode', 'Bit Manipulation', 'Analytical Reasoning'],
    hiringTips: 'Accenture includes a dedicated Cloud & Networking fundamentals section in the first assessment round.'
  },
  Capgemini: {
    name: 'Capgemini',
    tagline: 'Exceller Placement Drive',
    rounds: ['Pseudocode & Technical Test', 'English Communication Test', 'Game-Based Aptitude Test', 'Behavioral HR Interview'],
    eligibility: '55% or 5.5 CGPA in graduation.',
    frequentlyAskedTopics: ['Game-Based Spatial Aptitude', 'Pseudocode Loops', 'Data Interpretation', 'Agile & Software Engineering'],
    hiringTips: 'Prepare for game-based cognitive aptitude challenges (grid movement, pattern memory).'
  }
};

// @route GET /api/company/details
const getCompanyDetails = async (req, res) => {
  try {
    const { company } = req.query;
    if (company && COMPANY_METADATA[company]) {
      const questions = await Question.find({ company });
      return res.json({
        metadata: COMPANY_METADATA[company],
        questions
      });
    }

    res.json({
      companies: Object.keys(COMPANY_METADATA).map(key => COMPANY_METADATA[key])
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch company details.' });
  }
};

module.exports = {
  getCompanyDetails
};
