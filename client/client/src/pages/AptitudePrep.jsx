import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { apiRequest } from '../services/api';
import DogAvatar from '../components/DogAvatar';
import { 
  Calculator, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Award, 
  Clock, 
  Brain,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

const TOPICS = [
  'All',
  'Percentages',
  'Ratio and Proportion',
  'Profit and Loss',
  'Average',
  'Time and Work',
  'Time Speed Distance',
  'Number System',
  'Probability',
  'Permutation and Combination',
  'Data Interpretation',
  'Logical Reasoning'
];

export default function AptitudePrep() {
  const [searchParams] = useSearchParams();
  const urlTopic = searchParams.get('topic');
  const [topic, setTopic] = useState(urlTopic && TOPICS.includes(urlTopic) ? urlTopic : 'All');
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sync topic if URL parameter changes
  useEffect(() => {
    const currentUrlTopic = searchParams.get('topic');
    if (currentUrlTopic && TOPICS.includes(currentUrlTopic)) {
      setTopic(currentUrlTopic);
    }
  }, [searchParams]);

  // Quiz state
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [scoreResult, setScoreResult] = useState(null);

  useEffect(() => {
    fetchQuestions();
  }, [topic]);

  const fetchQuestions = async () => {
    setLoading(true);
    setSubmitted(false);
    setSelectedAnswers({});
    setScoreResult(null);

    try {
      const data = await apiRequest(`/practice/aptitude?topic=${topic}`);
      setQuestions(data || []);
    } catch (err) {
      console.warn('Aptitude fetch error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (qId, optionIdx) => {
    if (submitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [qId]: optionIdx }));
  };

  const handleSubmitTest = async () => {
    const payload = {
      moduleType: 'APTITUDE',
      category: topic !== 'All' ? topic : 'Quantitative Aptitude',
      difficulty: 'Intermediate',
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
      alert('Failed to submit test: ' + err.message);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
            <Calculator className="w-7 h-7 text-purple-600 dark:text-purple-400" />
            <span>Quantitative & Logical Aptitude Module</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Master quantitative aptitude and logical reasoning questions frequently featured in IT placement drives
          </p>
        </div>

        {submitted && scoreResult && (
          <div className="flex items-center space-x-3 bg-purple-50 dark:bg-slate-800 px-4 py-2 rounded-2xl border border-purple-200 dark:border-slate-700">
            <Award className="w-5 h-5 text-purple-600" />
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400 block">Aptitude Score:</span>
              <span className="text-lg font-black text-purple-700 dark:text-purple-300">
                {scoreResult.scorePercentage}% ({scoreResult.correctCount}/{scoreResult.totalQuestions})
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Noah AI Pup Guidance Note */}
      {topic !== 'All' && (
        <div className="flex items-center space-x-3 p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/80 shadow-sm animate-in fade-in duration-300">
          <DogAvatar size={36} mood="excited" />
          <div className="flex-1 text-xs">
            <span className="font-bold text-amber-800 dark:text-amber-300 block">
              🐶 Noah's Priority 1 Focus: {topic}
            </span>
            <span className="text-slate-600 dark:text-slate-300">
              Aptitude is the #1 Round 1 elimination filter. Clear these drills first to qualify for technical rounds!
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

      {/* Topic Chips */}
      <div className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center space-x-1.5">
          <Brain className="w-4 h-4 text-purple-500" />
          <span>Aptitude Topic Practice Drills</span>
        </span>

        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
          {TOPICS.map((t) => (
            <button
              key={t}
              onClick={() => setTopic(t)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                topic === t
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-purple-300'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Questions Feed */}
      {loading ? (
        <div className="py-16 text-center text-slate-400 text-xs">Loading aptitude questions...</div>
      ) : questions.length === 0 ? (
        <div className="py-12 text-center bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-500">
          No aptitude questions available for this topic.
        </div>
      ) : (
        <div className="space-y-6">
          {questions.map((q, qIdx) => {
            const chosenOption = selectedAnswers[q._id];
            const isCorrect = chosenOption === q.correctOptionIndex;

            return (
              <div
                key={q._id}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-7 h-7 rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-xs font-extrabold flex items-center justify-center">
                      {qIdx + 1}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-300 text-[11px] font-bold">
                      {q.topic || q.category}
                    </span>
                  </div>

                  {submitted && (
                    <span className={`flex items-center space-x-1 text-xs font-bold ${isCorrect ? 'text-green-600' : 'text-red-500'}`}>
                      {isCorrect ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                      <span>{isCorrect ? 'Correct' : 'Incorrect'}</span>
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 leading-snug">
                  {q.title}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  {q.options?.map((opt, optIdx) => {
                    let btnStyle = 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-purple-50/50';

                    if (chosenOption === optIdx) {
                      btnStyle = 'bg-purple-100 dark:bg-purple-950 border-purple-500 text-purple-900 dark:text-purple-200 font-bold';
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

                {submitted && q.explanation && (
                  <div className="p-4 rounded-2xl bg-purple-50/60 dark:bg-slate-800/80 border border-purple-100 dark:border-slate-700 space-y-1 text-xs text-slate-600 dark:text-slate-300">
                    <span className="font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-1.5">
                      <HelpCircle className="w-4 h-4 text-purple-600" />
                      <span>Step-by-Step Solution:</span>
                    </span>
                    <p className="leading-relaxed whitespace-pre-line pt-1">{q.explanation}</p>
                  </div>
                )}
              </div>
            );
          })}

          {!submitted && (
            <div className="p-6 rounded-3xl bg-slate-900 text-white flex items-center justify-between shadow-xl">
              <div>
                <span className="text-xs font-semibold text-slate-400 block">Aptitude Drill</span>
                <span className="text-sm font-bold">
                  {Object.keys(selectedAnswers).length} of {questions.length} Solved
                </span>
              </div>

              <button
                onClick={handleSubmitTest}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-lg transition-all"
              >
                Submit & Check Answers
              </button>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
