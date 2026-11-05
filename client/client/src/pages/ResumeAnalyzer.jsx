import React, { useState } from 'react';
import { apiRequest } from '../services/api';
import { 
  FileText, 
  Upload, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Award, 
  Layers,
  ArrowRight,
  TrendingUp,
  Brain
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ResumeAnalyzer() {
  const [file, setFile] = useState(null);
  const [resumeText, setResumeText] = useState('');
  const [targetRole, setTargetRole] = useState('Software Engineer');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' | 'text'

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!file && !resumeText.trim()) {
      alert('Please upload a PDF file or paste your resume text.');
      return;
    }

    setLoading(true);

    try {
      let data;
      if (activeTab === 'upload' && file) {
        const formData = new FormData();
        formData.append('resume', file);
        formData.append('targetRole', targetRole);
        data = await apiRequest('/resume/analyze', 'POST', formData, true);
      } else {
        data = await apiRequest('/resume/analyze', 'POST', {
          resumeText,
          targetRole
        });
      }

      setAnalysis(data.resumeAnalysis);

      if (data.resumeAnalysis?.atsScore >= 75) {
        confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
      }
    } catch (err) {
      alert('Resume analysis failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
          <FileText className="w-7 h-7 text-teal-600 dark:text-teal-400" />
          <span>AI Resume & ATS Compatibility Analyzer</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Upload your PDF resume to check ATS keyword density, formatting compliance, missing skills, and score out of 100
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Upload Form */}
        <div className="lg:col-span-1 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Target Position
            </label>
            <select
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            >
              <option value="Software Engineer">Software Engineer</option>
              <option value="Full Stack Developer">Full Stack Developer</option>
              <option value="Data Analyst">Data Analyst</option>
              <option value="System Engineer">System Engineer</option>
              <option value="Web Developer">Web Developer</option>
            </select>
          </div>

          {/* Mode Switcher */}
          <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-bold">
            <button
              onClick={() => setActiveTab('upload')}
              className={`py-1.5 rounded-lg transition-all ${
                activeTab === 'upload'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm'
                  : 'text-slate-500'
              }`}
            >
              Upload PDF
            </button>
            <button
              onClick={() => setActiveTab('text')}
              className={`py-1.5 rounded-lg transition-all ${
                activeTab === 'text'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm'
                  : 'text-slate-500'
              }`}
            >
              Paste Text
            </button>
          </div>

          {activeTab === 'upload' ? (
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-6 text-center hover:border-teal-500 transition-colors">
              <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
                id="resume-upload-input"
              />
              <label htmlFor="resume-upload-input" className="cursor-pointer">
                <span className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline block">
                  {file ? file.name : 'Choose PDF Resume File'}
                </span>
                <span className="text-[11px] text-slate-400">PDF formats supported (Max 5MB)</span>
              </label>
            </div>
          ) : (
            <textarea
              rows={8}
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste your full resume text here (Education, Experience, Skills, Projects)..."
              className="w-full p-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          )}

          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-teal-500/20 disabled:opacity-50 transition-all"
          >
            {loading ? 'Analyzing ATS Compatibility...' : 'Scan & Evaluate Resume'}
          </button>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2 space-y-6">
          {!analysis ? (
            <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <Sparkles className="w-12 h-12 text-teal-500 mx-auto animate-pulse" />
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Ready for ATS Evaluation
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                Upload your resume on the left to benchmark against recruiters' applicant tracking systems.
              </p>
            </div>
          ) : (
            <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6 animate-fade-in">
              
              {/* ATS Score Header */}
              <div className="flex flex-col sm:flex-row items-center justify-between p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 text-white gap-4">
                <div>
                  <span className="text-xs font-bold text-teal-400 uppercase tracking-widest block">
                    Target: {analysis.targetRole}
                  </span>
                  <h2 className="text-xl font-extrabold text-white mt-0.5">
                    ATS Resume Compatibility Score
                  </h2>
                </div>
                <div className="text-center bg-white/10 px-6 py-3 rounded-2xl border border-white/20">
                  <span className="text-4xl font-black text-teal-300">{analysis.atsScore}</span>
                  <span className="text-xs text-slate-300 block font-bold">/ 100</span>
                </div>
              </div>

              {/* Category Gauges */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="text-[11px] font-bold text-slate-400 uppercase block">Keywords Match</span>
                  <span className="text-lg font-black text-teal-600 dark:text-teal-400">{analysis.keywordScore}%</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="text-[11px] font-bold text-slate-400 uppercase block">Formatting Compliance</span>
                  <span className="text-lg font-black text-blue-600 dark:text-blue-400">{analysis.formattingScore}%</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="text-[11px] font-bold text-slate-400 uppercase block">Action & Impact</span>
                  <span className="text-lg font-black text-purple-600 dark:text-purple-400">{analysis.impactScore}%</span>
                </div>
              </div>

              {/* Detected vs Missing Skills Tags */}
              <div className="space-y-4 pt-2">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center space-x-1.5">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span>Detected Key Skills ({analysis.detectedSkills?.length})</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {analysis.detectedSkills?.map((skill, idx) => (
                      <span key={idx} className="px-2.5 py-1 bg-green-50 dark:bg-green-950/60 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 text-xs font-semibold rounded-lg">
                        ✓ {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center space-x-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    <span>Missing Critical Skills for {analysis.targetRole}</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {analysis.missingSkills?.map((skill, idx) => (
                      <span key={idx} className="px-2.5 py-1 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 text-xs font-semibold rounded-lg">
                        + Add {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actionable Recommendations */}
              <div className="p-5 rounded-2xl bg-teal-50/50 dark:bg-slate-800/60 border border-teal-100 dark:border-slate-700 space-y-2 text-xs">
                <h4 className="font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-1.5">
                  <Brain className="w-4 h-4 text-teal-600" />
                  <span>Key Resume Improvement Checklist:</span>
                </h4>
                <ul className="space-y-1.5 text-slate-600 dark:text-slate-300">
                  {analysis.actionableSuggestions?.map((item, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <span className="text-teal-600 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          )}
        </div>

      </div>

    </div>
  );
}
