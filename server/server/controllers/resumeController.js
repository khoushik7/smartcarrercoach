const Resume = require('../models/Resume');
const pdfParse = require('pdf-parse');
const { analyzeResumeText } = require('../services/aiService');

// @route POST /api/resume/analyze
const analyzeResume = async (req, res) => {
  try {
    let extractedText = '';
    let fileName = 'Uploaded_Resume.pdf';
    let fileSize = 0;

    if (req.file) {
      fileName = req.file.originalname;
      fileSize = req.file.size;
      try {
        const parsed = await pdfParse(req.file.buffer);
        extractedText = parsed.text;
      } catch (pdfErr) {
        console.warn('PDF parsing warning:', pdfErr.message);
        extractedText = req.file.buffer.toString('utf8');
      }
    } else if (req.body.resumeText) {
      extractedText = req.body.resumeText;
      fileName = req.body.fileName || 'Pasted_Resume.txt';
    } else {
      return res.status(400).json({ error: 'Please upload a PDF resume file or provide text content.' });
    }

    const targetRole = req.body.targetRole || 'Software Engineer';
    const analysis = analyzeResumeText(extractedText, targetRole);

    const savedResume = await Resume.create({
      user: req.user.id,
      fileName,
      fileSize,
      parsedText: extractedText.substring(0, 1000), // store sample preview
      atsScore: analysis.atsScore,
      targetRole,
      formattingScore: analysis.formattingScore,
      keywordScore: analysis.keywordScore,
      impactScore: analysis.impactScore,
      detectedSkills: analysis.detectedSkills,
      missingSkills: analysis.missingSkills,
      strengths: analysis.strengths,
      improvements: analysis.improvements,
      actionableSuggestions: analysis.actionableSuggestions
    });

    console.log(`\n========================================================================`);
    console.log(`[RESUME] 📄 RESUME ATS ANALYSIS SAVED TO DATABASE:`);
    console.log(`  File: ${fileName} | Target Role: ${targetRole}`);
    console.log(`  🎯 ATS Score: ${savedResume.atsScore}% (Formatting: ${savedResume.formattingScore}%, Keywords: ${savedResume.keywordScore}%)`);
    console.log(`  💾 Document ID: ${savedResume._id}`);
    console.log(`========================================================================\n`);

    res.json({
      message: 'Resume analyzed successfully.',
      resumeAnalysis: savedResume
    });
  } catch (err) {
    console.error('Analyze resume error:', err);
    res.status(500).json({ error: 'Failed to analyze resume.' });
  }
};

// @route GET /api/resume/my-analyses
const getMyResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(resumes);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch resume analyses.' });
  }
};

module.exports = {
  analyzeResume,
  getMyResumes
};
