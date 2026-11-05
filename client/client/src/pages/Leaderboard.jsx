import React, { useEffect, useState } from 'react';
import { apiRequest } from '../services/api';
import { Trophy, Flame, GraduationCap, Award, Sparkles } from 'lucide-react';

export default function Leaderboard() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const data = await apiRequest('/practice/leaderboard');
        setStudents(data || []);
      } catch (err) {
        console.warn('Leaderboard fetch error:', err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchLeaderboard();
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
          <Trophy className="w-7 h-7 text-amber-500" />
          <span>Placement Readiness Leaderboard</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Top engineering students ranked by Placement Readiness Score, interview attempts, and daily practice streaks
        </p>
      </div>

      {loading ? (
        <div className="py-16 text-center text-slate-400 text-xs">Loading placement rankings...</div>
      ) : (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-3">Rank</th>
                  <th className="p-3">Candidate</th>
                  <th className="p-3">College & Degree</th>
                  <th className="p-3 text-center">Readiness Score</th>
                  <th className="p-3 text-center">Interviews Taken</th>
                  <th className="p-3 text-center">Streak</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {students.map((st, idx) => (
                  <tr key={st._id || idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-black text-slate-900 dark:text-slate-100">
                      {idx === 0 ? '🥇 #1' : idx === 1 ? '🥈 #2' : idx === 2 ? '🥉 #3' : `#${idx + 1}`}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center text-xs">
                          {st.name ? st.name.charAt(0) : 'S'}
                        </div>
                        <span className="font-bold text-slate-900 dark:text-slate-100">{st.name}</span>
                      </div>
                    </td>
                    <td className="p-3 text-slate-600 dark:text-slate-300">
                      <span className="font-semibold block">{st.college || 'Engineering Institute'}</span>
                      <span className="text-[10px] text-slate-400">{st.degree}</span>
                    </td>
                    <td className="p-3 text-center">
                      <span className="px-3 py-1 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-extrabold rounded-full text-xs">
                        {st.placementReadinessScore}%
                      </span>
                    </td>
                    <td className="p-3 text-center font-bold text-slate-700 dark:text-slate-200">
                      {st.totalInterviews || 0}
                    </td>
                    <td className="p-3 text-center">
                      <span className="inline-flex items-center space-x-1 font-bold text-amber-600 dark:text-amber-400">
                        <Flame className="w-4 h-4 fill-amber-500" />
                        <span>{st.dailyStreak || 1}d</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
