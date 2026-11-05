import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { apiRequest } from '../services/api';
import { 
  Building2, 
  CheckCircle2, 
  HelpCircle, 
  Bot, 
  ChevronRight, 
  Award, 
  BookOpen,
  Sparkles
} from 'lucide-react';

export default function CompanyPrep() {
  const [searchParams] = useSearchParams();
  const urlCompany = searchParams.get('company');
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(urlCompany || 'TCS');
  const [companyDetails, setCompanyDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cur = searchParams.get('company');
    if (cur) setSelectedCompany(cur);
  }, [searchParams]);

  useEffect(() => {
    async function loadCompanyData() {
      try {
        const listRes = await apiRequest('/company/details');
        setCompanies(listRes.companies || []);
        
        const detailsRes = await apiRequest(`/company/details?company=${selectedCompany}`);
        setCompanyDetails(detailsRes);
      } catch (err) {
        console.warn('Company details fetch error:', err.message);
      } finally {
        setLoading(false);
      }
    }
    loadCompanyData();
  }, [selectedCompany]);

  const companyList = ['TCS', 'Infosys', 'Wipro', 'Cognizant', 'Accenture', 'Capgemini'];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      
      {/* Top Banner */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
          <Building2 className="w-7 h-7 text-amber-600 dark:text-amber-400" />
          <span>Company-Specific Placement Hub</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Exam patterns, eligibility criteria, frequently asked technical & HR questions for top IT recruiters
        </p>
      </div>

      {/* Company Selector Chips */}
      <div className="flex items-center space-x-3 overflow-x-auto pb-2 scrollbar-none">
        {companyList.map((comp) => (
          <button
            key={comp}
            onClick={() => setSelectedCompany(comp)}
            className={`px-5 py-3 rounded-2xl text-xs font-bold transition-all flex items-center space-x-2 border shrink-0 ${
              selectedCompany === comp
                ? 'bg-amber-600 text-white border-amber-600 shadow-lg shadow-amber-500/20'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-amber-400'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>{comp}</span>
          </button>
        ))}
      </div>

      {/* Main Company Layout */}
      {loading || !companyDetails ? (
        <div className="py-16 text-center text-slate-400 text-xs">Loading company details...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Metadata Card */}
          <div className="lg:col-span-1 space-y-6">
            <div className="p-6 rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white shadow-xl space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400">
                <Building2 className="w-7 h-7" />
              </div>
              
              <div>
                <h2 className="text-xl font-extrabold text-white">
                  {companyDetails.metadata?.name}
                </h2>
                <p className="text-xs text-amber-300 mt-0.5">
                  {companyDetails.metadata?.tagline}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800 space-y-3 text-xs">
                <div>
                  <span className="font-bold text-slate-400 uppercase text-[10px] block mb-1">Eligibility Criteria</span>
                  <p className="text-slate-200">{companyDetails.metadata?.eligibility}</p>
                </div>

                <div>
                  <span className="font-bold text-slate-400 uppercase text-[10px] block mb-1">Recruitment Rounds</span>
                  <ul className="space-y-1 text-slate-300">
                    {companyDetails.metadata?.rounds?.map((r, idx) => (
                      <li key={idx} className="flex items-center space-x-1.5">
                        <span className="w-4 h-4 rounded-full bg-amber-500/30 text-amber-300 text-[10px] font-bold flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <Link
                to="/mock-interview"
                className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2"
              >
                <Bot className="w-4 h-4" />
                <span>Launch {selectedCompany} Mock Interview</span>
              </Link>

            </div>

            {/* Strategic Hiring Tips */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Strategy & Hiring Tips</span>
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {companyDetails.metadata?.hiringTips}
              </p>
            </div>
          </div>

          {/* Company Question Sets */}
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-amber-600" />
                <span>Frequently Asked {selectedCompany} Questions</span>
              </h3>

              {companyDetails.questions?.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">No stored questions for this company yet.</p>
              ) : (
                <div className="space-y-4">
                  {companyDetails.questions?.map((q, idx) => (
                    <div key={q._id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-slate-100">
                        <span>Q{idx + 1}: {q.title}</span>
                        <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-[10px]">
                          {q.category}
                        </span>
                      </div>

                      {q.codeSnippet && (
                        <div className="p-3 rounded-xl bg-slate-950 text-slate-100 font-mono text-[11px]">
                          <pre>{q.codeSnippet}</pre>
                        </div>
                      )}

                      <p className="text-xs text-slate-600 dark:text-slate-300">
                        <span className="font-bold text-slate-700 dark:text-slate-200">Solution Note: </span>
                        {q.explanation || q.description}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
