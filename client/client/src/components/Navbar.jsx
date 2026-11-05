import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  GraduationCap, 
  Bot, 
  Code, 
  Calculator, 
  FileText, 
  Building2, 
  Trophy, 
  Flame, 
  Sun, 
  Moon, 
  UserCheck, 
  ShieldAlert, 
  LogOut, 
  Menu, 
  X,
  Sparkles
} from 'lucide-react';
import AuthModal from './AuthModal';

export default function Navbar() {
  const { user, logout, switchRole } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { name: 'Dashboard', path: '/', icon: GraduationCap },
    { name: 'AI HR Interview', path: '/mock-interview', icon: Bot, highlight: true },
    { name: 'Technical Prep', path: '/technical-prep', icon: Code },
    { name: 'Aptitude Practice', path: '/aptitude-prep', icon: Calculator },
    { name: 'Resume Analyzer', path: '/resume-analyzer', icon: FileText },
    { name: 'Company Hub', path: '/company-prep', icon: Building2 },
    { name: 'Leaderboard', path: '/leaderboard', icon: Trophy },
    { name: 'Daily Sprint', path: '/daily-challenge', icon: Flame },
  ];

  if (user?.role === 'admin') {
    navLinks.push({ name: 'Admin Portal', path: '/admin', icon: ShieldAlert, admin: true });
  }

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Brand Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <span className="font-extrabold text-xl bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                  Smart Career Coach
                </span>
                <span className="hidden sm:block text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-widest -mt-1">
                  AI Placement Platform
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                      active
                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 shadow-sm'
                        : link.highlight
                        ? 'text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 font-bold'
                        : link.admin
                        ? 'text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${link.highlight ? 'animate-bounce text-indigo-500' : ''}`} />
                    <span>{link.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Actions & Utilities */}
            <div className="hidden sm:flex items-center space-x-3">
              
              {/* Noah AI Pup Shortcut */}
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('open-Noah-assistant'))}
                title="Ask Noah: What should I prepare 1st?"
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-950/70 dark:to-amber-900/50 border border-amber-300 dark:border-amber-700/80 rounded-full text-xs font-bold text-amber-900 dark:text-amber-200 hover:shadow-md hover:scale-105 active:scale-95 transition-all shadow-sm"
              >
                <span className="text-base animate-bounce">🐶</span>
                <span>Ask Noah AI</span>
              </button>

              {/* Placement Readiness Badge */}
              {user && user.role === 'student' && (
                <div className="flex items-center space-x-2 px-3 py-1.5 bg-blue-50 dark:bg-slate-800 border border-blue-200 dark:border-slate-700 rounded-full">
                  <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400 animate-spin" style={{ animationDuration: '4s' }} />
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-300">Readiness:</span>
                  <span className="text-xs font-extrabold text-blue-700 dark:text-blue-300">
                    {user.placementReadinessScore || 75}%
                  </span>
                </div>
              )}

              {/* Quick Role Switcher Button */}
              <button
                onClick={() => switchRole(user?.role === 'admin' ? 'student' : 'admin')}
                title="Switch role view (Demo Mode)"
                className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded-md border border-indigo-300 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 transition-colors"
              >
                Role: <span className="underline">{user?.role || 'student'}</span> (Switch)
              </button>

              {/* Dark/Light Mode Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Toggle Theme"
              >
                {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
              </button>

              {/* User Profile / Logout */}
              {user ? (
                <div className="flex items-center space-x-2 border-l border-slate-200 dark:border-slate-800 pl-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold flex items-center justify-center text-xs shadow-sm">
                    {user.name ? user.name.charAt(0) : 'U'}
                  </div>
                  <button
                    onClick={logout}
                    className="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md transition-colors"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Login / Register</span>
                </button>
              )}
            </div>

            {/* Mobile Hamburger Toggle */}
            <div className="flex items-center space-x-2 sm:hidden">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-slate-500 dark:text-slate-400"
              >
                {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-slate-600 dark:text-slate-300"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-2 pb-4 space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <button
                onClick={() => switchRole(user?.role === 'admin' ? 'student' : 'admin')}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400"
              >
                Switch Role to {user?.role === 'admin' ? 'Student' : 'Admin'}
              </button>
              {user ? (
                <button onClick={logout} className="text-xs text-red-600 font-semibold flex items-center space-x-1">
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              ) : (
                <button onClick={() => setAuthModalOpen(true)} className="text-xs text-blue-600 font-semibold">
                  Login
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {authModalOpen && <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />}
    </>
  );
}
