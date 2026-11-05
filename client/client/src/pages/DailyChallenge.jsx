import React, { useEffect, useState } from 'react';
import { apiRequest } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Flame, CheckCircle2, Award, Sparkles, Clock, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function DailyChallenge() {
  const { user, updateUserData } = useAuth();
  const [challenge, setChallenge] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [scoreResult, setScoreResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadChallenge() {
      try {
        const data = await apiRequest('/practice/daily-challenge');
        setChallenge(data);
      } catch (err) {
        console.warn('Daily challenge load error:', err.message);
      } finally {
        setLoading(false);
      }
    }
    loadChallenge();
  }, []);

  const handleSelectOption = (qId, optionIdx) => {
    if (submitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [qId]: optionIdx }));
  };

  const handleSubmitChallenge = async () => {
    const payload = {
      moduleType: 'TECHNICAL',
      answers: Object.keys(selectedAnswers).map((qId) => ({
        questionId: qId,
        selectedOptionIndex: selectedAnswers[qId]
      }))
    };

    try {
      const result = await apiRequest('/practice/submit-test', 'POST', payload);
      setScoreResult(result);
      setSubmitted(true);

      const newStreak = (user?.dailyStreak || 1) + 1;
      updateUserData({ dailyStreak: newStreak });

      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    } catch (err) {
      alert('Failed to submit challenge: ' + err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      
      {/* Top Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-amber-500 via-orange-600 to-red-600 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-white/20 rounded-full text-xs font-bold">
            <Flame className="w-4 h-4 fill-white" />
            <span>Daily Placement Sprint Challenge</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            Keep Your Placement Streak Alive! 🔥
          </h1>
          <p className="text-xs text-amber-100">
            Solve 5 quick daily questions to build muscle memory and earn streak badges.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/20 text-center">
          <span className="text-xs uppercase tracking-widest text-amber-200 font-bold block">Current Streak</span>
          <span className="text-4xl font-black text-white">{user?.dailyStreak || 5} Days</span>
        </div>
      </div>

      {loading ? (
        <div className="py-16 text-center text-slate-400 text-xs">Loading daily challenge questions...</div>
      ) : !challenge ? (
        <div className="py-12 text-center text-slate-400 text-xs">Unable to load daily challenge.</div>
      ) : (
        <div className="space-y-6">
          {challenge.questions?.map((q, idx) => {
            const chosenOption = selectedAnswers[q._id];
            const isCorrect = chosenOption === q.correctOptionIndex;

            return (
              <div key={q._id} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                    Question {idx + 1} of 5 ({q.moduleType})
                  </span>
                  {submitted && (
                    <span className={`font-bold ${isCorrect ? 'text-green-600' : 'text-red-500'}`}>
                      {isCorrect ? '✓ Correct' : '✕ Incorrect'}
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{q.title}</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  {q.options?.map((opt, optIdx) => {
                    let btnStyle = 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200';
                    if (chosenOption === optIdx) btnStyle = 'bg-amber-100 dark:bg-amber-950 border-amber-500 text-amber-900 dark:text-amber-200 font-bold';
                    if (submitted && optIdx === q.correctOptionIndex) btnStyle = 'bg-green-100 dark:bg-green-950 border-green-500 text-green-900 dark:text-green-200 font-bold';

                    return (
                      <button
                        key={optIdx}
                        disabled={submitted}
                        onClick={() => handleSelectOption(q._id, optIdx)}
                        className={`w-full p-3 rounded-2xl border text-left text-xs transition-all flex items-center space-x-3 ${btnStyle}`}
                      >
                        <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-[10px] font-bold">
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span>{opt}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {!submitted && (
            <button
              onClick={handleSubmitChallenge}
              className="w-full py-4 bg-gradient-to-r from-amber-500 to-red-600 hover:from-amber-600 hover:to-red-700 text-white font-extrabold text-xs rounded-2xl shadow-xl shadow-amber-500/20 transition-all"
            >
              Complete Daily Sprint & Claim Streak Bonus
            </button>
          )}

          {submitted && scoreResult && (
            <div className="p-6 rounded-3xl bg-slate-900 text-white text-center space-y-2">
              <Award className="w-10 h-10 text-amber-400 mx-auto" />
              <h3 className="text-xl font-bold">Sprint Complete! Score: {scoreResult.scorePercentage}%</h3>
              <p className="text-xs text-slate-300">Your daily streak is now boosted to {user?.dailyStreak} Days!</p>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
