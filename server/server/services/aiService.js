/**
 * AI Service for Smart Career Coach
 * Evaluates interviews, analyzes resumes, and generates feedback.
 */

// Helper to analyze filler words and pace in a text response
function analyzeSpeechMetrics(text, durationSeconds = 30) {
  if (!text) return { wpm: 0, fillerWords: { um: 0, uh: 0, like: 0, youKnow: 0, total: 0 } };

  const words = text.trim().split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;
  
  // Calculate WPM based on duration or default assumption (estimated duration if not passed)
  const effectiveSeconds = durationSeconds > 0 ? durationSeconds : Math.max(15, wordCount / 2.2);
  const wpm = Math.round((wordCount / effectiveSeconds) * 60);

  // Count filler words
  const lowerText = text.toLowerCase();
  const umMatches = (lowerText.match(/\b(um|umm|ummm)\b/g) || []).length;
  const uhMatches = (lowerText.match(/\b(uh|uhh)\b/g) || []).length;
  const likeMatches = (lowerText.match(/\b(like)\b/g) || []).length;
  const youKnowMatches = (lowerText.match(/\b(you know)\b/g) || []).length;
  const total = umMatches + uhMatches + likeMatches + youKnowMatches;

  return {
    wpm,
    fillerWords: {
      um: umMatches,
      uh: uhMatches,
      like: likeMatches,
      youKnow: youKnowMatches,
      total
    }
  };
}

// Fallback rule engine for evaluating interview answers
function evaluateAnswerLocally(questionTitle, userResponse, durationSeconds = 30) {
  const speechMetrics = analyzeSpeechMetrics(userResponse, durationSeconds);
  const wordCount = userResponse.trim().split(/\s+/).length;
  
  let relevanceScore = 70;
  let communicationScore = 75;
  let confidenceScore = 75;
  let grammarClarityScore = 80;

  // Length check
  if (wordCount < 15) {
    relevanceScore = 55;
    confidenceScore = 50;
  } else if (wordCount >= 40 && wordCount <= 180) {
    relevanceScore = 88;
    confidenceScore = 85;
  } else if (wordCount > 180) {
    relevanceScore = 78;
    communicationScore = 70; // verbose
  }

  // Filler word penalty
  if (speechMetrics.fillerWords.total > 4) {
    communicationScore -= Math.min(25, speechMetrics.fillerWords.total * 4);
    confidenceScore -= Math.min(20, speechMetrics.fillerWords.total * 3);
  }

  // Pace check (ideal WPM: 110 - 150)
  if (speechMetrics.wpm < 90 && speechMetrics.wpm > 0) {
    confidenceScore -= 10;
  } else if (speechMetrics.wpm > 170) {
    communicationScore -= 10;
  }

  // Clamping scores
  relevanceScore = Math.max(40, Math.min(98, relevanceScore));
  communicationScore = Math.max(40, Math.min(98, communicationScore));
  confidenceScore = Math.max(40, Math.min(98, confidenceScore));
  grammarClarityScore = Math.max(50, Math.min(98, grammarClarityScore));

  const overallScore = Math.round((relevanceScore * 0.35) + (communicationScore * 0.3) + (confidenceScore * 0.2) + (grammarClarityScore * 0.15));

  // Strengths & Improvements generator
  const strengths = [];
  const improvements = [];

  if (wordCount >= 30) strengths.push('Detailed structure with elaboration.');
  if (speechMetrics.fillerWords.total === 0) strengths.push('Clear delivery free of noticeable hesitation or filler words.');
  if (speechMetrics.wpm >= 110 && speechMetrics.wpm <= 160) strengths.push('Paced speech rhythm ideal for professional interviews.');
  if (relevanceScore > 80) strengths.push('Directly addresses key aspect of the prompt with pertinent examples.');

  if (strengths.length === 0) strengths.push('Good attempt with solid foundation to build upon.');

  if (wordCount < 25) improvements.push('Expand your response using the STAR method (Situation, Task, Action, Result).');
  if (speechMetrics.fillerWords.total > 2) improvements.push(`Reduce filler words like "${speechMetrics.fillerWords.um > 0 ? 'um' : 'like'}" to project stronger executive presence.`);
  if (speechMetrics.wpm < 90 && speechMetrics.wpm > 0) improvements.push('Try speaking slightly faster to maintain active audience engagement.');
  if (speechMetrics.wpm > 160) improvements.push('Pause between key sentences to let your core message register clearly.');

  if (improvements.length === 0) improvements.push('Maintain this high standard and practice maintaining eye contact during delivery.');

  const aiFeedback = `Your response scored ${overallScore}/100. ${strengths[0]} To improve further, ${improvements[0].toLowerCase()}`;

  return {
    relevanceScore,
    communicationScore,
    confidenceScore,
    grammarClarityScore,
    overallScore,
    speakingDurationSeconds: durationSeconds,
    wordsPerMinute: speechMetrics.wpm,
    fillerWordsCount: speechMetrics.fillerWords,
    aiFeedback,
    strengths,
    improvements
  };
}

// Evaluate single interview answer
async function evaluateInterviewAnswer(questionTitle, userResponse, durationSeconds = 30) {
  // Check if API keys exist
  const geminiKey = process.env.GEMINI_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  if (!geminiKey && !openaiKey) {
    return evaluateAnswerLocally(questionTitle, userResponse, durationSeconds);
  }

  // If Gemini or OpenAI key is available, call API (with catch fallback to local)
  try {
    if (geminiKey) {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are an expert HR interviewer. Evaluate this candidate response:
Question: "${questionTitle}"
Response: "${userResponse}"

Return ONLY JSON format:
{
  "relevanceScore": 85,
  "communicationScore": 80,
  "confidenceScore": 78,
  "grammarClarityScore": 88,
  "overallScore": 83,
  "aiFeedback": "Summary feedback",
  "strengths": ["strength 1", "strength 2"],
  "improvements": ["improvement 1"]
}`
            }]
          }]
        })
      });
      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          const speechMetrics = analyzeSpeechMetrics(userResponse, durationSeconds);
          return {
            ...parsed,
            speakingDurationSeconds: durationSeconds,
            wordsPerMinute: speechMetrics.wpm,
            fillerWordsCount: speechMetrics.fillerWords
          };
        }
      }
    }
  } catch (err) {
    console.warn('AI API call failed, using fallback evaluator:', err.message);
  }

  return evaluateAnswerLocally(questionTitle, userResponse, durationSeconds);
}

// Analyze Resume Text against target role
function analyzeResumeText(resumeText, targetRole = 'Software Engineer') {
  const text = resumeText.toLowerCase();
  
  const techKeywords = ['javascript', 'react', 'node.js', 'express', 'python', 'java', 'c++', 'sql', 'mongodb', 'git', 'data structures', 'algorithms', 'html', 'css', 'aws', 'rest api', 'docker', 'typescript', 'testing', 'oops'];
  const softKeywords = ['leadership', 'communication', 'teamwork', 'problem solving', 'project management', 'agile', 'analytical'];
  
  const detectedSkills = [];
  const missingSkills = [];

  techKeywords.forEach(skill => {
    if (text.includes(skill)) {
      detectedSkills.push(skill.toUpperCase());
    } else {
      missingSkills.push(skill.toUpperCase());
    }
  });

  // Pick top missing skills relevant for target role
  const topMissing = missingSkills.slice(0, 6);
  
  let keywordScore = Math.min(95, Math.max(45, Math.round((detectedSkills.length / techKeywords.length) * 100) + 20));
  let formattingScore = text.length > 500 ? 85 : 60;
  let impactScore = text.includes('%') || text.includes('increased') || text.includes('built') || text.includes('developed') ? 88 : 65;

  const atsScore = Math.round((keywordScore * 0.45) + (formattingScore * 0.3) + (impactScore * 0.25));

  const strengths = [
    `Detected ${detectedSkills.length} key technical & engineering competencies.`,
    text.includes('built') || text.includes('developed') ? 'Includes strong action verbs demonstrating hands-on project delivery.' : 'Clean section structure and readable flow.'
  ];

  const improvements = [
    `Incorporate missing high-demand industry skills: ${topMissing.slice(0, 3).join(', ')}.`,
    'Quantify project outcomes using metrics (e.g. "Improved query performance by 35%").',
    'Ensure email, LinkedIn, and GitHub links are formatted clearly at the top.'
  ];

  const actionableSuggestions = [
    'Add an Executive Summary section at the top highlighting key tech stack and graduation year.',
    'Use standard headers: Education, Technical Skills, Projects, Experience, Certifications.',
    'Tailor keywords specifically for ' + targetRole + ' positions.'
  ];

  return {
    atsScore,
    targetRole,
    formattingScore,
    keywordScore,
    impactScore,
    detectedSkills: detectedSkills.slice(0, 12),
    missingSkills: topMissing,
    strengths,
    improvements,
    actionableSuggestions
  };
}

module.exports = {
  analyzeSpeechMetrics,
  evaluateAnswerLocally,
  evaluateInterviewAnswer,
  analyzeResumeText
};
