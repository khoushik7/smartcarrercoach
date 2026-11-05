import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { apiRequest } from '../services/api';
import DogAvatar from '../components/DogAvatar';
import { 
  Code, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Sparkles, 
  Award, 
  Layers, 
  BookOpen,
  Terminal,
  Volume2,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

const CATEGORIES = [
  'All',
  'Java',
  'Python',
  'C Programming',
  'Data Structures',
  'Algorithms',
  'DBMS',
  'Operating Systems',
  'Computer Networks',
  'OOP Concepts',
  'Web Development'
];

const DIFFICULTIES = ['All', 'Beginner', 'Intermediate', 'Advanced'];

export default function TechnicalPrep() {
  const [searchParams] = useSearchParams();
  const urlCategory = searchParams.get('category');
  const [category, setCategory] = useState(urlCategory && CATEGORIES.includes(urlCategory) ? urlCategory : 'All');
  const [difficulty, setDifficulty] = useState('All');
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sync category if URL parameter changes
  useEffect(() => {
    const currentUrlCategory = searchParams.get('category');
    if (currentUrlCategory && CATEGORIES.includes(currentUrlCategory)) {
      setCategory(currentUrlCategory);
    }
  }, [searchParams]);

  // Quiz execution state
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { qId: optionIndex }
  const [submitted, setSubmitted] = useState(false);
  const [scoreResult, setScoreResult] = useState(null);
  const [speakingId, setSpeakingId] = useState(null);

  useEffect(() => {
    fetchQuestions();
  }, [category, difficulty]);

  const fetchQuestions = async () => {
    setLoading(true);
    setSubmitted(false);
    setSelectedAnswers({});
    setScoreResult(null);

    try {
      const data = await apiRequest(`/practice/technical?category=${category}&difficulty=${difficulty}`);
      setQuestions(data || []);
    } catch (err) {
      console.warn('Technical questions fetch error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const speakOralQuestion = (qId, text) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    if (speakingId === qId) {
      setSpeakingId(null);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.onstart = () => setSpeakingId(qId);
    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    window.speechSynthesis.speak(utterance);
  };

  const handleSelectOption = (qId, optionIdx) => {
    if (submitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [qId]: optionIdx }));
  };

  const handleSubmitQuiz = async () => {
    if (Object.keys(selectedAnswers).length < questions.length) {
      if (!window.confirm('You have unanswered questions. Are you sure you want to submit?')) return;
    }

    const payload = {
      moduleType: 'TECHNICAL',
      category: category !== 'All' ? category : 'General',
      difficulty: difficulty !== 'All' ? difficulty : 'Intermediate',
      answers: Object.keys(selectedAnswers).map((qId) => ({
        questionId: qId,
        selectedOptionIndex: selectedAnswers[qId]
      }))
    };

    try {
      const result = await apiRequest('/practice/submit-test', 'POST', payload);
      setScoreResult(result);
      setSubmitted(true);

      if (result.scorePercentage >= 75) {
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
      }
    } catch (err) {
      alert('Failed to submit quiz: ' + err.message);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
            <Code className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
            <span>Technical Interview Practice Module</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Master core Computer Science fundamentals across 10 essential categories & 3 difficulty tiers (Text & Oral Audio Question Support)
          </p>
        </div>

        {submitted && scoreResult && (
          <div className="flex items-center space-x-3 bg-indigo-50 dark:bg-slate-800 px-4 py-2 rounded-2xl border border-indigo-200 dark:border-slate-700">
            <Award className="w-5 h-5 text-indigo-600" />
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400 block">Quiz Score:</span>
              <span className="text-lg font-black text-indigo-700 dark:text-indigo-300">
                {scoreResult.scorePercentage}% ({scoreResult.correctCount}/{scoreResult.totalQuestions})
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Noah AI Pup Guidance Note */}
      {category !== 'All' && (
        <div className="flex items-center space-x-3 p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/80 shadow-sm animate-in fade-in duration-300">
          <DogAvatar size={36} mood="excited" />
          <div className="flex-1 text-xs">
            <span className="font-bold text-amber-800 dark:text-amber-300 block">
              🐶 Noah's Priority 1 Focus: {category}
            </span>
            <span className="text-slate-600 dark:text-slate-300">
              Master these questions first to clear your initial technical screening round!
            </span>
          </div>
          <button 
            onClick={() => window.dispatchEvent(new CustomEvent('open-Noah-assistant'))}
            className="text-[11px] font-bold text-amber-700 dark:text-amber-400 hover:underline shrink-0"
          >
            Ask Noah 🐾
          </button>
        </div>
      )}

      {/* Category Pills & Filters */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center space-x-1.5">
            <Layers className="w-4 h-4 text-indigo-500" />
            <span>Select Domain Category</span>
          </span>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-400">Difficulty:</span>
            {DIFFICULTIES.map((diff) => (
              <button
                key={diff}
                onClick={() => setDifficulty(diff)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  difficulty === diff
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Category Selector */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                category === cat
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-indigo-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Questions Feed */}
      {loading ? (
        <div className="py-16 text-center text-slate-400 text-xs">
          Loading technical questions...
        </div>
      ) : questions.length === 0 ? (
        <div className="py-12 text-center bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
          <BookOpen className="w-10 h-10 text-slate-400 mx-auto mb-2" />
          <p className="text-xs font-bold text-slate-600 dark:text-slate-300">No questions found for this filter combination.</p>
          <button onClick={() => { setCategory('All'); setDifficulty('All'); }} className="text-xs text-blue-600 hover:underline mt-2">
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {questions.map((q, qIdx) => {
            const isSelected = selectedAnswers[q._id] !== undefined;
            const chosenOption = selectedAnswers[q._id];
            const isCorrect = chosenOption === q.correctOptionIndex;

            return (
              <div
                key={q._id}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
              >
                {/* Question Top Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-extrabold flex items-center justify-center">
                      {qIdx + 1}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-300 text-[11px] font-bold">
                      {q.category}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 text-[11px] font-semibold">
                      {q.difficulty}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    {/* Oral Speech Audio Button */}
                    <button
                      onClick={() => speakOralQuestion(q._id, q.title)}
                      className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                        speakingId === q._id
                          ? 'bg-indigo-600 text-white animate-pulse'
                          : 'bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-100'
                      }`}
                      title="Hear Oral Question Audio"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{speakingId === q._id ? 'Reading Orally...' : 'Hear Oral Question 🔊'}</span>
                    </button>

                    {submitted && (
                      <span className={`flex items-center space-x-1 text-xs font-bold ${isCorrect ? 'text-green-600' : 'text-red-500'}`}>
                        {isCorrect ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                        <span>{isCorrect ? 'Correct' : 'Incorrect'}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  {q.title}
                </h3>

                {/* Optional Code Snippet */}
                {q.codeSnippet && (
                  <div className="p-4 rounded-xl bg-slate-950 text-slate-100 font-mono text-xs overflow-x-auto border border-slate-800">
                    <pre>{q.codeSnippet}</pre>
                  </div>
                )}

                {/* MCQ Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  {q.options?.map((opt, optIdx) => {
                    let btnStyle = 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-indigo-50/50';

                    if (chosenOption === optIdx) {
                      btnStyle = 'bg-indigo-100 dark:bg-indigo-950 border-indigo-500 text-indigo-900 dark:text-indigo-200 font-bold';
                    }

                    if (submitted) {
                      if (optIdx === q.correctOptionIndex) {
                        btnStyle = 'bg-green-100 dark:bg-green-950/80 border-green-500 text-green-900 dark:text-green-200 font-bold';
                      } else if (chosenOption === optIdx && !isCorrect) {
                        btnStyle = 'bg-red-100 dark:bg-red-950/80 border-red-500 text-red-900 dark:text-red-200 font-bold';
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        disabled={submitted}
                        onClick={() => handleSelectOption(q._id, optIdx)}
                        className={`w-full p-3 rounded-2xl border text-left text-xs transition-all flex items-center space-x-3 ${btnStyle}`}
                      >
                        <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-[10px] font-bold shrink-0">
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span>{opt}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Detailed Solution Explanation */}
                {submitted && q.explanation && (
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-1 text-xs text-slate-600 dark:text-slate-300">
                    <span className="font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-1.5 text-xs">
                      <HelpCircle className="w-4 h-4 text-indigo-500" />
                      <span>Detailed Explanation:</span>
                    </span>
                    <p className="leading-relaxed whitespace-pre-line pt-1">{q.explanation}</p>
                  </div>
                )}

              </div>
            );
          })}

          {/* Submit Button Bar */}
          {!submitted && (
            <div className="p-6 rounded-3xl bg-slate-900 text-white flex items-center justify-between shadow-xl">
              <div>
                <span className="text-xs font-semibold text-slate-400 block">Technical Practice Quiz</span>
                <span className="text-sm font-bold">
                  {Object.keys(selectedAnswers).length} of {questions.length} Questions Answered
                </span>
              </div>

              <button
                onClick={handleSubmitQuiz}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-lg transition-all"
              >
                Submit & Evaluate Quiz
              </button>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
