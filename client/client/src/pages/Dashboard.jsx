import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import DogAvatar from '../components/DogAvatar';
import { sniffOutRoadmap, POPULAR_ROLES } from '../data/careerRoadmaps';
import { 
  Sparkles, 
  Bot, 
  Code, 
  Calculator, 
  FileText, 
  Building2, 
  TrendingUp, 
  Award, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  Flame,
  BarChart3,
  Brain,
  Compass,
  Bone
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  RadialBarChart, 
  RadialBar 
} from 'recharts';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentRole = user?.targetRole || localStorage.getItem('Noah_target_role') || 'Full Stack Engineer';
  const NoahRoadmap = sniffOutRoadmap(currentRole);

  const openNoahWithRole = (role) => {
    window.dispatchEvent(new CustomEvent('open-Noah-assistant', { detail: { role } }));
  };

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const historyData = await apiRequest('/interview/history');
        setHistory(historyData || []);
      } catch (err) {
        console.warn('History fetch error:', err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboardData();
  }, []);

  const readinessScore = user?.placementReadinessScore || 75;

  const scoreData = [
    { name: 'HR Interview', score: user?.avgHrScore || 82, fill: '#3b82f6' },
    { name: 'Technical', score: user?.avgTechScore || 76, fill: '#6366f1' },
    { name: 'Aptitude', score: user?.avgAptitudeScore || 80, fill: '#8b5cf6' },
    { name: 'Communication', score: user?.avgCommunicationScore || 75, fill: '#ec4899' },
  ];

  const radialData = [
    { name: 'Readiness', score: readinessScore, fill: '#2563eb' }
  ];

  return (
    <div className="space-y-8 pb-12">
      
      {/* Top Welcome & Readiness Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          
          <div className="lg:col-span-2 space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white/15 backdrop-blur-md rounded-full text-xs font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>AI Placement Preparation Engine Active</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Welcome back, {user?.name || 'Candidate'}! 👋
            </h1>
            <p className="text-blue-100 text-xs sm:text-sm max-w-xl leading-relaxed">
              Target Role: <span className="font-semibold text-white">{user?.targetRole || 'Software Engineer'}</span>. 
              Keep up your daily streak to maximize campus placement conversion.
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                to="/mock-interview"
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-white text-blue-700 font-bold text-xs shadow-lg hover:bg-blue-50 transition-all transform hover:-translate-y-0.5"
              >
                <Bot className="w-4 h-4 text-blue-600" />
                <span>Launch AI Mock Interview</span>
              </Link>
              <Link
                to="/daily-challenge"
                className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-semibold text-xs border border-white/20 transition-colors"
              >
                <Flame className="w-4 h-4 text-amber-400" />
                <span>Daily Sprint ({user?.dailyStreak || 5} Day Streak)</span>
              </Link>
            </div>
          </div>

          {/* Readiness Score Gauge */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-center flex flex-col items-center justify-center relative">
            <h3 className="text-xs font-bold uppercase tracking-wider text-blue-200 mb-1">
              Placement Readiness Score
            </h3>
            <div className="relative w-32 h-32 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart 
                  innerRadius="75%" 
                  outerRadius="100%" 
                  data={radialData} 
                  startAngle={180} 
                  endAngle={0}
                >
                  <RadialBar background dataKey="score" cornerRadius={10} fill="#60a5fa" />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/3 text-center">
                <span className="text-3xl font-black text-white">{readinessScore}%</span>
                <span className="block text-[10px] text-blue-200 font-medium">Placement Ready</span>
              </div>
            </div>
            <p className="text-[11px] text-blue-100 font-medium mt-[-10px]">
              Top 15% among college peers
            </p>
          </div>

        </div>
      </div>

      {/* --- Noah AI CAREER PUP SPOTLIGHT & FIRST PREPARATION FOCUS --- */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500/10 via-amber-400/5 to-indigo-500/10 border-2 border-amber-300/80 dark:border-amber-600/40 p-5 sm:p-7 shadow-lg backdrop-blur-sm">
        
        {/* Cute background paws/sparkles pattern */}
        <div className="absolute top-2 right-4 text-3xl opacity-15 select-none pointer-events-none">
          🐾 🦴 ✨
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Left: Dog Avatar Presentation */}
          <div className="lg:col-span-4 flex items-center space-x-4">
            <div 
              onClick={() => openNoahWithRole(currentRole)}
              className="relative cursor-pointer group shrink-0"
              title="Click to talk to Noah!"
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-amber-400 to-amber-200 dark:from-amber-600 dark:to-amber-400 p-2 shadow-xl group-hover:scale-105 group-hover:rotate-2 transition-transform duration-300 flex items-center justify-center">
                <DogAvatar size={80} mood="happy" />
              </div>
              <span className="absolute -bottom-2 -right-1 px-2 py-0.5 rounded-full bg-amber-600 text-white text-[10px] font-extrabold shadow">
                AI Pup
              </span>
            </div>

            <div className="space-y-1">
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 text-[10px] font-bold">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>AI Preparation Guide</span>
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white leading-tight">
                Meet Noah! 🐶
              </h2>
              <p className="text-[11px] text-slate-600 dark:text-slate-300">
                Sniffs out what you must prepare 1st so you don't get filtered out.
              </p>
            </div>
          </div>

          {/* Center / Right: What to Prepare 1st for this role */}
          <div className="lg:col-span-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white/70 dark:bg-slate-900/80 p-4 sm:p-5 rounded-2xl border border-amber-200/70 dark:border-slate-800 shadow-sm">
            
            <div className="space-y-1.5 flex-1 pr-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Target Role:
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-extrabold text-xs">
                  {NoahRoadmap.title}
                </span>
                <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-800">
                  {NoahRoadmap.prepareFirst.badge}
                </span>
              </div>

              <h3 className="font-extrabold text-slate-900 dark:text-white text-sm sm:text-base flex items-center space-x-1.5">
                <span className="text-amber-500">👉 Prepare 1st:</span>
                <span>{NoahRoadmap.prepareFirst.headline}</span>
              </h3>

              <p className="text-slate-600 dark:text-slate-300 text-[11px] line-clamp-2 leading-relaxed">
                {NoahRoadmap.prepareFirst.whyFirst}
              </p>

              {/* Quick Role Switch Chips */}
              <div className="pt-2 flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] text-slate-400 font-semibold mr-1">Switch:</span>
                {POPULAR_ROLES.slice(0, 4).map((r) => (
                  <button
                    key={r.id}
                    onClick={() => openNoahWithRole(r.title)}
                    className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 hover:bg-amber-100 dark:bg-slate-800 dark:hover:bg-amber-950/60 text-slate-700 dark:text-slate-300 hover:text-amber-800 dark:hover:text-amber-300 border border-slate-200 dark:border-slate-700 transition-colors"
                  >
                    {r.icon} {r.title.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Direct Action Buttons */}
            <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0 w-full md:w-auto">
              <button
                onClick={() => navigate(NoahRoadmap.prepareFirst.path)}
                className="inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-extrabold text-xs shadow-md hover:shadow-amber-500/30 transform hover:-translate-y-0.5 transition-all"
              >
                <Compass className="w-4 h-4" />
                <span>Go to Step 1 Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => openNoahWithRole(currentRole)}
                className="inline-flex items-center justify-center space-x-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors border border-slate-200 dark:border-slate-700"
              >
                <span>🐶 Ask Noah Custom Plan</span>
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">Interviews Taken</span>
            <span className="text-xl font-bold text-slate-900 dark:text-slate-100">{user?.totalInterviews || history.length || 4}</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Code className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">Technical Score</span>
            <span className="text-xl font-bold text-slate-900 dark:text-slate-100">{user?.avgTechScore || 76}%</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">Aptitude Score</span>
            <span className="text-xl font-bold text-slate-900 dark:text-slate-100">{user?.avgAptitudeScore || 80}%</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-pink-100 dark:bg-pink-950/60 text-pink-600 dark:text-pink-400 flex items-center justify-center">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">Communication</span>
            <span className="text-xl font-bold text-slate-900 dark:text-slate-100">{user?.avgCommunicationScore || 75}%</span>
          </div>
        </div>

      </div>

      {/* Main Grid: Chart & Quick Launch Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Performance Breakdown Chart */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span>Placement Competency Breakdown</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Evaluation across key placement interview rounds
              </p>
            </div>
            <span className="px-2.5 py-1 bg-green-100 dark:bg-green-950/60 text-green-700 dark:text-green-300 text-[11px] font-bold rounded-md">
              +12% vs last week
            </span>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scoreData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.15} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                  formatter={(val) => [`${val}%`, 'Score']}
                />
                <Bar dataKey="score" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Launch Cards */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span>Preparation Modules</span>
          </h3>

          <div className="space-y-3">
            
            <Link
              to="/mock-interview"
              className="flex items-center justify-between p-3.5 rounded-xl border border-blue-100 dark:border-slate-800 bg-blue-50/50 dark:bg-slate-800/40 hover:bg-blue-100/60 transition-colors group"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-blue-600 text-white">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block">AI Mock HR Interview</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">Voice/Text speech analysis</span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/technical-prep"
              className="flex items-center justify-between p-3.5 rounded-xl border border-indigo-100 dark:border-slate-800 bg-indigo-50/50 dark:bg-slate-800/40 hover:bg-indigo-100/60 transition-colors group"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-indigo-600 text-white">
                  <Code className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block">Technical Practice</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">10 categories & 3 levels</span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-indigo-600 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/aptitude-prep"
              className="flex items-center justify-between p-3.5 rounded-xl border border-purple-100 dark:border-slate-800 bg-purple-50/50 dark:bg-slate-800/40 hover:bg-purple-100/60 transition-colors group"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-purple-600 text-white">
                  <Calculator className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block">Aptitude Practice</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">11 quantitative topics</span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-purple-600 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/resume-analyzer"
              className="flex items-center justify-between p-3.5 rounded-xl border border-teal-100 dark:border-slate-800 bg-teal-50/50 dark:bg-slate-800/40 hover:bg-teal-100/60 transition-colors group"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-teal-600 text-white">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block">Resume ATS Analyzer</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">PDF score & missing skills</span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-teal-600 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/company-prep"
              className="flex items-center justify-between p-3.5 rounded-xl border border-amber-100 dark:border-slate-800 bg-amber-50/50 dark:bg-slate-800/40 hover:bg-amber-100/60 transition-colors group"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-amber-600 text-white">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block">Company Placement Hub</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">TCS, Infosys, Wipro, etc.</span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-amber-600 group-hover:translate-x-1 transition-transform" />
            </Link>

          </div>
        </div>

      </div>

      {/* Recent Interviews History */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
            <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>Recent Mock Interview History</span>
          </h3>
          <Link to="/mock-interview" className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline">
            Take New Interview →
          </Link>
        </div>

        {history.length === 0 ? (
          <div className="py-8 text-center bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
            <Bot className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">No mock interviews taken yet.</p>
            <p className="text-[11px] text-slate-400 mb-3">Practice with the AI interviewer to generate detailed speech & content feedback.</p>
            <Link
              to="/mock-interview"
              className="inline-flex items-center space-x-1.5 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold shadow"
            >
              <span>Start First Mock HR Interview</span>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-3">Interview Session</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Score</th>
                  <th className="p-3">Speaking Pace</th>
                  <th className="p-3">Filler Words</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {history.slice(0, 5).map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="p-3 font-semibold text-slate-900 dark:text-slate-100">{item.title}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-300 font-medium">
                        {item.type}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`font-bold ${item.overallScore >= 80 ? 'text-green-600' : 'text-blue-600'}`}>
                        {item.overallScore}%
                      </span>
                    </td>
                    <td className="p-3 text-slate-600 dark:text-slate-300">{item.avgWordsPerMinute || 125} WPM</td>
                    <td className="p-3 text-slate-600 dark:text-slate-300">{item.totalFillerWords || 2} detected</td>
                    <td className="p-3 text-slate-500">{new Date(item.createdAt).toLocaleDateString()}</td>
                    <td className="p-3">
                      <span className="inline-flex items-center space-x-1 text-green-600 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Completed</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
