import React, { useEffect, useState } from 'react';
import { apiRequest } from '../services/api';
import { 
  ShieldAlert, 
  Users, 
  Bot, 
  HelpCircle, 
  FileText, 
  Plus, 
  Trash2, 
  Edit3, 
  Search,
  CheckCircle2,
  X
} from 'lucide-react';

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('questions'); // 'questions' | 'users'
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Add Question Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newModuleType, setNewModuleType] = useState('TECHNICAL');
  const [newCategory, setNewCategory] = useState('Java');
  const [newDifficulty, setNewDifficulty] = useState('Intermediate');
  const [newCompany, setNewCompany] = useState('None');
  const [newTitle, setNewTitle] = useState('');
  const [newExplanation, setNewExplanation] = useState('');
  const [newOptions, setNewOptions] = useState(['', '', '', '']);
  const [newCorrectIdx, setNewCorrectIdx] = useState(0);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const stats = await apiRequest('/admin/analytics');
      setAnalytics(stats);

      const qs = await apiRequest('/admin/questions');
      setQuestions(qs || []);

      const usrs = await apiRequest('/admin/users');
      setUsers(usrs || []);
    } catch (err) {
      console.warn('Admin data fetch error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQuestion = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return alert('Question title is required');

    try {
      await apiRequest('/admin/question', 'POST', {
        moduleType: newModuleType,
        category: newCategory,
        difficulty: newDifficulty,
        company: newCompany,
        title: newTitle,
        explanation: newExplanation,
        options: newOptions.filter(Boolean),
        correctOptionIndex: newCorrectIdx
      });

      alert('Question added to Question Bank!');
      setIsModalOpen(false);
      setNewTitle('');
      setNewExplanation('');
      fetchAdminData();
    } catch (err) {
      alert('Failed to add question: ' + err.message);
    }
  };

  const handleDeleteQuestion = async (id) => {
    if (!window.confirm('Are you sure you want to delete this question?')) return;
    try {
      await apiRequest(`/admin/question/${id}`, 'DELETE');
      setQuestions(questions.filter((q) => q._id !== id));
    } catch (err) {
      alert('Failed to delete question: ' + err.message);
    }
  };

  const handleToggleUserRole = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'student' : 'admin';
    try {
      await apiRequest(`/user/${userId}/role`, 'PUT', { role: newRole });
      fetchAdminData();
    } catch (err) {
      alert('Failed to update role: ' + err.message);
    }
  };

  const filteredQuestions = questions.filter(q => 
    q.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
            <ShieldAlert className="w-7 h-7 text-amber-500" />
            <span>Admin Management & Platform Portal</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage platform users, populate interview question banks, and monitor student metrics
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center space-x-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-lg transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Question</span>
        </button>
      </div>

      {/* Metric Overview Cards */}
      {analytics && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center space-x-3">
            <Users className="w-8 h-8 text-blue-600" />
            <div>
              <span className="text-[11px] font-semibold text-slate-400 block">Total Users</span>
              <span className="text-xl font-bold text-slate-900 dark:text-slate-100">{analytics.totalUsers}</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center space-x-3">
            <Bot className="w-8 h-8 text-indigo-600" />
            <div>
              <span className="text-[11px] font-semibold text-slate-400 block">Interviews Taken</span>
              <span className="text-xl font-bold text-slate-900 dark:text-slate-100">{analytics.totalInterviews}</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center space-x-3">
            <HelpCircle className="w-8 h-8 text-purple-600" />
            <div>
              <span className="text-[11px] font-semibold text-slate-400 block">Question Bank</span>
              <span className="text-xl font-bold text-slate-900 dark:text-slate-100">{analytics.totalQuestions}</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center space-x-3">
            <FileText className="w-8 h-8 text-teal-600" />
            <div>
              <span className="text-[11px] font-semibold text-slate-400 block">Resumes Analyzed</span>
              <span className="text-xl font-bold text-slate-900 dark:text-slate-100">{analytics.totalResumes}</span>
            </div>
          </div>
        </div>
      )}

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex space-x-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('questions')}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeTab === 'questions' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm' : 'text-slate-500'
            }`}
          >
            Question Bank Manager ({questions.length})
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeTab === 'users' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm' : 'text-slate-500'
            }`}
          >
            User Management ({users.length})
          </button>
        </div>

        {activeTab === 'questions' && (
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search question bank..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            />
          </div>
        )}
      </div>

      {/* Question Bank Table */}
      {activeTab === 'questions' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-3">Module</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Question Title</th>
                  <th className="p-3">Difficulty</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredQuestions.map((q) => (
                  <tr key={q._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-bold text-blue-600 dark:text-blue-400">{q.moduleType}</td>
                    <td className="p-3 text-slate-700 dark:text-slate-300">{q.category}</td>
                    <td className="p-3 font-semibold text-slate-900 dark:text-slate-100">{q.title}</td>
                    <td className="p-3 text-slate-500">{q.difficulty}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleDeleteQuestion(q._id)}
                        className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                        title="Delete Question"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* User Manager Table */}
      {activeTab === 'users' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-3">User Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Placement Score</th>
                  <th className="p-3 text-right">Toggle Admin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-bold text-slate-900 dark:text-slate-100">{u.name}</td>
                    <td className="p-3 text-slate-600 dark:text-slate-300">{u.email}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded font-bold uppercase text-[10px] ${u.role === 'admin' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3 font-bold text-slate-700 dark:text-slate-200">{u.placementReadinessScore || 70}%</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleToggleUserRole(u._id, u.role)}
                        className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-[11px] font-bold rounded-lg"
                      >
                        Switch to {u.role === 'admin' ? 'Student' : 'Admin'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Question Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 w-full max-w-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Add New Question</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateQuestion} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-600 dark:text-slate-400 mb-1">Module</label>
                  <select
                    value={newModuleType}
                    onChange={(e) => setNewModuleType(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    <option value="HR">HR Interview</option>
                    <option value="TECHNICAL">Technical</option>
                    <option value="APTITUDE">Aptitude</option>
                    <option value="COMPANY">Company Specific</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-600 dark:text-slate-400 mb-1">Category / Topic</label>
                  <input
                    type="text"
                    required
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-600 dark:text-slate-400 mb-1">Question Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. What is Polymorphism in Java?"
                  className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              {newModuleType !== 'HR' && (
                <div className="space-y-2 pt-1">
                  <label className="block font-medium text-slate-600 dark:text-slate-400">MCQ Options</label>
                  {newOptions.map((opt, idx) => (
                    <input
                      key={idx}
                      type="text"
                      placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                      value={opt}
                      onChange={(e) => {
                        const updated = [...newOptions];
                        updated[idx] = e.target.value;
                        setNewOptions(updated);
                      }}
                      className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                    />
                  ))}
                  <div className="flex items-center space-x-2 pt-1">
                    <span className="font-semibold text-slate-500">Correct Option Index:</span>
                    <select
                      value={newCorrectIdx}
                      onChange={(e) => setNewCorrectIdx(Number(e.target.value))}
                      className="p-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                    >
                      <option value={0}>A</option>
                      <option value={1}>B</option>
                      <option value={2}>C</option>
                      <option value={3}>D</option>
                    </select>
                  </div>
                </div>
              )}

              <div>
                <label className="block font-medium text-slate-600 dark:text-slate-400 mb-1">Explanation / Sample Answer</label>
                <textarea
                  rows={3}
                  value={newExplanation}
                  onChange={(e) => setNewExplanation(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all mt-2"
              >
                Save to Question Bank
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
