import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { apiRequest } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  Bot, 
  Mic, 
  MicOff, 
  Send, 
  Sparkles, 
  Clock, 
  AlertCircle, 
  CheckCircle, 
  Award, 
  Download, 
  Volume2,
  VolumeX,
  RotateCcw,
  MessageSquare,
  ShieldCheck,
  TrendingUp,
  Brain,
  Radio
} from 'lucide-react';
import jsPDF from 'jspdf';
import confetti from 'canvas-confetti';

export default function MockInterview() {
  const { updateUserData } = useAuth();
  const [searchParams] = useSearchParams();
  const urlType = searchParams.get('type');

  // Session state
  const [interviewType, setInterviewType] = useState(urlType || 'HR');
  const [company, setCompany] = useState('General');

  useEffect(() => {
    const curType = searchParams.get('type');
    if (curType) setInterviewType(curType);
  }, [searchParams]);
  const [sessionActive, setSessionActive] = useState(false);
  const [interviewId, setInterviewId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Oral Speech & Voice State
  const [autoSpeakQuestion, setAutoSpeakQuestion] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [userResponse, setUserResponse] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [speechTimerSeconds, setSpeechTimerSeconds] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [evaluations, setEvaluations] = useState([]);
  
  // Session Summary State
  const [isCompleted, setIsCompleted] = useState(false);
  const [finalReport, setFinalReport] = useState(null);
  const [loading, setLoading] = useState(false);

  // Speech Recognition ref
  const recognitionRef = useRef(null);
  const timerIntervalRef = useRef(null);

  // Setup Web Speech Recognition API if available
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setUserResponse((prev) => (prev ? `${prev} ${transcript}` : transcript));
      };

      recognition.onerror = (err) => {
        console.warn('Speech recognition error:', err.error);
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  // Text-to-Speech (Oral Question Reading)
  const speakQuestionOral = (textToSpeak) => {
    if (!('speechSynthesis' in window)) return;
    
    // Stop any existing utterance
    window.speechSynthesis.cancel();
    
    if (!textToSpeak) return;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 0.92; // Natural, clear interview reading pace
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeakingOral = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Auto-speak question when question index or active state updates
  useEffect(() => {
    if (sessionActive && questions[currentIndex]) {
      const questionText = questions[currentIndex].title;
      if (autoSpeakQuestion) {
        speakQuestionOral(questionText);
      }
    }
    return () => {
      stopSpeakingOral();
    };
  }, [currentIndex, sessionActive, questions, autoSpeakQuestion]);

  // Timer tick during speech recording
  useEffect(() => {
    if (isRecording) {
      timerIntervalRef.current = setInterval(() => {
        setSpeechTimerSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerIntervalRef.current);
    }
    return () => clearInterval(timerIntervalRef.current);
  }, [isRecording]);

  const toggleRecording = () => {
    // If AI is speaking question, stop it when user starts recording
    stopSpeakingOral();

    if (!isRecording) {
      setUserResponse('');
      setSpeechTimerSeconds(0);
      setIsRecording(true);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (e) {
          console.warn('Recognition start warning:', e);
        }
      }
    } else {
      setIsRecording(false);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
    }
  };

  const handleStartSession = async () => {
    setLoading(true);
    setEvaluations([]);
    setIsCompleted(false);
    setFinalReport(null);
    setCurrentIndex(0);

    try {
      const data = await apiRequest('/interview/start', 'POST', {
        type: interviewType,
        company,
        questionCount: 5
      });

      setInterviewId(data.interviewId);
      setQuestions(data.questions || []);
      setSessionActive(true);
    } catch (err) {
      alert('Failed to start interview session: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!userResponse.trim()) {
      alert('Please speak or type your answer before submitting.');
      return;
    }

    stopSpeakingOral();

    if (isRecording) {
      toggleRecording();
    }

    setSubmitting(true);
    const currentQ = questions[currentIndex];

    try {
      const result = await apiRequest(`/interview/${interviewId}/submit-answer`, 'POST', {
        questionId: currentQ.id,
        questionTitle: currentQ.title,
        userResponse,
        inputType: isRecording ? 'voice' : 'text',
        durationSeconds: Math.max(15, speechTimerSeconds)
      });

      setEvaluations((prev) => [...prev, result.answerEvaluation]);
      setUserResponse('');
      setSpeechTimerSeconds(0);

      // Check if more questions remain
      if (currentIndex + 1 < questions.length) {
        setCurrentIndex(currentIndex + 1);
      } else {
        // Complete session
        handleCompleteSession();
      }
    } catch (err) {
      alert('Failed to evaluate answer: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCompleteSession = async () => {
    setLoading(true);
    try {
      const data = await apiRequest(`/interview/${interviewId}/complete`, 'POST');
      setFinalReport(data.interview);
      setIsCompleted(true);
      setSessionActive(false);

      if (data.interview?.overallScore >= 75) {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      }

      if (data.interview?.overallScore) {
        updateUserData({ placementReadinessScore: data.interview.overallScore });
      }
    } catch (err) {
      alert('Failed to complete session: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Download PDF Report using jsPDF
  const generatePDFReport = () => {
    if (!finalReport) return;

    const doc = new jsPDF();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('Smart Career Coach - AI Mock Interview Report', 15, 20);

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Interview Type: ${finalReport.type}`, 15, 30);
    doc.text(`Overall Placement Readiness Score: ${finalReport.overallScore}%`, 15, 37);
    doc.text(`Communication Score: ${finalReport.communicationScore}%`, 15, 44);
    doc.text(`Speaking Pace: ${finalReport.avgWordsPerMinute} WPM`, 15, 51);
    doc.text(`Total Filler Words: ${finalReport.totalFillerWords}`, 15, 58);
    doc.text(`Date: ${new Date(finalReport.createdAt).toLocaleDateString()}`, 15, 65);

    doc.setFont('helvetica', 'bold');
    doc.text('Executive Summary & Feedback:', 15, 78);
    doc.setFont('helvetica', 'normal');
    const summaryLines = doc.splitTextToSize(finalReport.executiveSummary, 180);
    doc.text(summaryLines, 15, 86);

    let yPos = 105;
    doc.setFont('helvetica', 'bold');
    doc.text('Question Breakdown:', 15, yPos);
    yPos += 8;

    finalReport.answers.forEach((ans, idx) => {
      if (yPos > 260) {
        doc.addPage();
        yPos = 20;
      }
      doc.setFont('helvetica', 'bold');
      doc.text(`Q${idx + 1}: ${ans.questionTitle}`, 15, yPos);
      yPos += 6;
      doc.setFont('helvetica', 'normal');
      doc.text(`Score: ${ans.overallScore}% | Pace: ${ans.wordsPerMinute} WPM`, 15, yPos);
      yPos += 6;
      const feedbackLines = doc.splitTextToSize(`AI Feedback: ${ans.aiFeedback}`, 180);
      doc.text(feedbackLines, 15, yPos);
      yPos += feedbackLines.length * 6 + 4;
    });

    doc.save(`SmartCareerCoach_InterviewReport_${Date.now()}.pdf`);
  };

  // Helper filler word stats calculation
  const currentWords = userResponse.trim().split(/\s+/).filter(Boolean).length;
  const estimatedWpm = speechTimerSeconds > 0 ? Math.round((currentWords / speechTimerSeconds) * 60) : 0;
  const fillerUmCount = (userResponse.toLowerCase().match(/\b(um|umm)\b/g) || []).length;
  const fillerUhCount = (userResponse.toLowerCase().match(/\b(uh|uhh)\b/g) || []).length;
  const fillerLikeCount = (userResponse.toLowerCase().match(/\b(like)\b/g) || []).length;
  const totalFillers = fillerUmCount + fillerUhCount + fillerLikeCount;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
            <Bot className="w-7 h-7 text-blue-600 dark:text-blue-400" />
            <span>AI Mock HR & Technical Interview</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Interactive Oral & Text Questioning, Speech-to-Text, WPM Pace Gauge & AI Evaluation
          </p>
        </div>

        {!sessionActive && !isCompleted && (
          <div className="flex items-center space-x-3">
            <select
              value={interviewType}
              onChange={(e) => setInterviewType(e.target.value)}
              className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            >
              <option value="HR">HR Interview</option>
              <option value="TECHNICAL">Technical Interview</option>
              <option value="COMPANY">Company Specific</option>
            </select>

            {interviewType === 'COMPANY' && (
              <select
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              >
                <option value="TCS">TCS NQT</option>
                <option value="Infosys">Infosys</option>
                <option value="Wipro">Wipro</option>
                <option value="Cognizant">Cognizant</option>
                <option value="Accenture">Accenture</option>
                <option value="Capgemini">Capgemini</option>
              </select>
            )}

            <button
              onClick={handleStartSession}
              disabled={loading}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all"
            >
              {loading ? 'Starting Session...' : 'Start AI Interview'}
            </button>
          </div>
        )}
      </div>

      {/* Screen 1: Interview Setup Info */}
      {!sessionActive && !isCompleted && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>What to Expect in the AI Interview</span>
            </h3>
            
            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-start space-x-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <Radio className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 dark:text-slate-100 block">Oral & Text Question Delivery</span>
                  The AI Recruiter reads each question out loud orally (Text-to-Speech audio) while simultaneously displaying the written text.
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <Mic className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 dark:text-slate-100 block">Voice Speech Analytics</span>
                  Live transcription measures your speaking pace (WPM) and detects filler words ("um", "uh", "like").
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <Award className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 dark:text-slate-100 block">Instant AI Scorecard & PDF</span>
                  Receive scores for relevance, communication, confidence, grammar, and download an official summary report.
                </div>
              </div>
            </div>

            <button
              onClick={handleStartSession}
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs rounded-2xl shadow-lg transition-all"
            >
              Start Session Now (5 Questions)
            </button>
          </div>

          {/* Quick tips panel */}
          <div className="p-6 rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 text-white space-y-4 shadow-xl">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-blue-400">
              💡 Oral & Speech Tips
            </h4>
            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-start space-x-2">
                <span className="text-blue-400 font-bold">•</span>
                <span>Listen carefully to the AI Recruiter's <strong>oral voice reading</strong> before speaking.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-blue-400 font-bold">•</span>
                <span>Use the <strong>STAR Method</strong> (Situation, Task, Action, Result) for behavioral prompts.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-blue-400 font-bold">•</span>
                <span>Maintain a <strong>110 - 140 WPM pace</strong> for clear delivery.</span>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Screen 2: Active AI Interview Room */}
      {sessionActive && questions.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* AI Avatar & Question Panel */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* AI Avatar Card */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl relative overflow-hidden">
              
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 rounded-2xl ${isSpeaking ? 'bg-blue-500 border-2 border-blue-300 animate-pulse' : 'bg-blue-600/30 border border-blue-400/30'} flex items-center justify-center`}>
                    <Bot className="w-7 h-7 text-blue-400" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-blue-400 uppercase tracking-widest block flex items-center space-x-1">
                      <span>AI Recruiter</span>
                      {isSpeaking && <span className="w-2 h-2 rounded-full bg-green-400 animate-ping" />}
                    </span>
                    <span className="text-sm font-semibold">Smart Placement Evaluator</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {/* Oral Audio Reading Button */}
                  <button
                    onClick={() => {
                      if (isSpeaking) {
                        stopSpeakingOral();
                      } else {
                        speakQuestionOral(questions[currentIndex].title);
                      }
                    }}
                    className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      isSpeaking
                        ? 'bg-blue-500 text-white animate-pulse'
                        : 'bg-white/10 hover:bg-white/20 text-blue-200 border border-white/10'
                    }`}
                    title="Hear Question Read Out Loud Orally"
                  >
                    {isSpeaking ? <Volume2 className="w-4 h-4 text-green-300 animate-bounce" /> : <Volume2 className="w-4 h-4" />}
                    <span>{isSpeaking ? 'Speaking Question...' : 'Read Question Orally 🔊'}</span>
                  </button>

                  <div className="px-3 py-1.5 bg-white/10 rounded-xl text-xs font-bold text-slate-300">
                    Q{currentIndex + 1}/{questions.length}
                  </div>
                </div>
              </div>

              {/* Question Text (Oral + Written) */}
              <div className="space-y-2 py-2">
                <div className="flex items-center space-x-2 text-xs text-blue-300 font-semibold mb-1">
                  <Radio className="w-4 h-4 text-blue-400" />
                  <span>Oral Question (Written & Read Aloud):</span>
                </div>

                <h2 className="text-lg sm:text-xl font-bold leading-snug text-white">
                  "{questions[currentIndex].title}"
                </h2>
                {questions[currentIndex].description && (
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {questions[currentIndex].description}
                  </p>
                )}
              </div>

              {/* Key points to cover hint */}
              {questions[currentIndex].keyPointsToCover?.length > 0 && (
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center space-x-2 text-[11px] text-blue-300">
                  <ShieldCheck className="w-4 h-4 text-blue-400" />
                  <span>Key topics to hit: {questions[currentIndex].keyPointsToCover.join(' • ')}</span>
                </div>
              )}
            </div>

            {/* Candidate Response Input Area */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Your Answer (Respond Orally by Voice or Type Text)
                </label>

                {/* Voice Record Toggle */}
                <button
                  type="button"
                  onClick={toggleRecording}
                  className={`inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    isRecording
                      ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse shadow-lg shadow-red-500/30'
                      : 'bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-100'
                  }`}
                >
                  {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  <span>{isRecording ? 'Stop Recording' : 'Start Voice Recording'}</span>
                </button>
              </div>

              <textarea
                rows={5}
                value={userResponse}
                onChange={(e) => setUserResponse(e.target.value)}
                placeholder="Click 'Start Voice Recording' to speak your response orally, or type your answer text directly here..."
                className="w-full p-4 text-xs sm:text-sm rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-slate-400 font-medium">
                  {userResponse.length > 0 ? `${currentWords} words recorded` : 'Tip: Be clear and provide structured examples.'}
                </span>

                <button
                  onClick={handleSubmitAnswer}
                  disabled={submitting || !userResponse.trim()}
                  className="inline-flex items-center space-x-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-500/20 disabled:opacity-50 transition-all"
                >
                  {submitting ? (
                    <span>Evaluating AI Feedback...</span>
                  ) : (
                    <>
                      <span>Submit Answer</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>

          {/* Real-time Voice & Speech Metrics Side Panel */}
          <div className="space-y-4">
            
            {/* Live Speech Pace & Filler Analytics */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center space-x-2">
                  <Volume2 className="w-4 h-4 text-indigo-500" />
                  <span>Speech Analytics</span>
                </h3>
                <label className="flex items-center space-x-1 cursor-pointer text-[11px] text-slate-500">
                  <input
                    type="checkbox"
                    checked={autoSpeakQuestion}
                    onChange={(e) => setAutoSpeakQuestion(e.target.checked)}
                    className="rounded text-blue-600"
                  />
                  <span>Auto-read Oral</span>
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                  <span className="text-[10px] font-semibold text-slate-400 block uppercase">Pace</span>
                  <span className="text-xl font-black text-blue-600 dark:text-blue-400">
                    {estimatedWpm || 120}
                  </span>
                  <span className="text-[10px] text-slate-400 block">WPM</span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                  <span className="text-[10px] font-semibold text-slate-400 block uppercase">Fillers</span>
                  <span className={`text-xl font-black ${totalFillers > 2 ? 'text-amber-500' : 'text-green-500'}`}>
                    {totalFillers}
                  </span>
                  <span className="text-[10px] text-slate-400 block">"um/uh/like"</span>
                </div>
              </div>

              {/* Filler Breakdown pill tags */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-500 dark:text-slate-400 text-[11px]">
                  <span>"Um / Umm"</span>
                  <span className="font-bold text-slate-700 dark:text-slate-200">{fillerUmCount}</span>
                </div>
                <div className="flex justify-between text-slate-500 dark:text-slate-400 text-[11px]">
                  <span>"Uh / Uhh"</span>
                  <span className="font-bold text-slate-700 dark:text-slate-200">{fillerUhCount}</span>
                </div>
                <div className="flex justify-between text-slate-500 dark:text-slate-400 text-[11px]">
                  <span>"Like"</span>
                  <span className="font-bold text-slate-700 dark:text-slate-200">{fillerLikeCount}</span>
                </div>
              </div>
            </div>

            {/* Evaluated Answers History Feed */}
            {evaluations.length > 0 && (
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Previous Questions Evaluated
                </h4>
                <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                  {evaluations.map((evalItem, idx) => (
                    <div key={idx} className="p-3 rounded-2xl bg-blue-50/60 dark:bg-slate-800/60 border border-blue-100 dark:border-slate-700 space-y-1">
                      <div className="flex justify-between items-center text-xs font-bold text-slate-900 dark:text-slate-100">
                        <span>Q{idx + 1} Score</span>
                        <span className="text-blue-600 dark:text-blue-400">{evalItem.overallScore}%</span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2">
                        {evalItem.aiFeedback}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>
      )}

      {/* Screen 3: Completed Session Final Report & Scorecard */}
      {isCompleted && finalReport && (
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-8 animate-fade-in">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
            <div>
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-green-100 dark:bg-green-950/60 text-green-700 dark:text-green-300 text-xs font-bold mb-2">
                <CheckCircle className="w-4 h-4" />
                <span>Interview Session Completed</span>
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
                {finalReport.title} Performance Scorecard
              </h2>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={generatePDFReport}
                className="inline-flex items-center space-x-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF Summary</span>
              </button>

              <button
                onClick={handleStartSession}
                className="inline-flex items-center space-x-2 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Retake Session</span>
              </button>
            </div>
          </div>

          {/* Metrics summary cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900 text-center">
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase block">Overall Score</span>
              <span className="text-3xl font-black text-blue-700 dark:text-blue-300">{finalReport.overallScore}%</span>
            </div>

            <div className="p-5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-900 text-center">
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase block">Communication</span>
              <span className="text-3xl font-black text-indigo-700 dark:text-indigo-300">{finalReport.communicationScore}%</span>
            </div>

            <div className="p-5 rounded-2xl bg-purple-50 dark:bg-purple-950/50 border border-purple-100 dark:border-purple-900 text-center">
              <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase block">Speaking Pace</span>
              <span className="text-3xl font-black text-purple-700 dark:text-purple-300">{finalReport.avgWordsPerMinute} <span className="text-xs">WPM</span></span>
            </div>

            <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-100 dark:border-amber-900 text-center">
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase block">Filler Words</span>
              <span className="text-3xl font-black text-amber-700 dark:text-amber-300">{finalReport.totalFillerWords}</span>
            </div>
          </div>

          {/* Executive Summary & Key Recommendations */}
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
              <Brain className="w-5 h-5 text-blue-600" />
              <span>AI Evaluator Executive Summary</span>
            </h3>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              {finalReport.executiveSummary}
            </p>

            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">Key Recommendations:</h4>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                {finalReport.keyRecommendations?.map((rec, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
