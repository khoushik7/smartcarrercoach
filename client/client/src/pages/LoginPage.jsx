import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap, Mail, Lock, User, Eye, EyeOff,
  Sparkles, ArrowRight, CheckCircle2, ArrowLeft
} from 'lucide-react';
import DogAvatar from '../components/DogAvatar';

const NOAH_TIPS = [
  "Woof! 75% of campus selections happen in the first round — let me guide you!",
  "Hey! Did you know most students fail because they skip aptitude prep? Not you!",
  "Woof woof! I'm Noah, your AI pup career guide. Let's ace your placement!",
  "Bark! Resume ATS score matters more than CGPA at most tech companies!",
];

export default function LoginPage() {
  const navigate = useNavigate();
  // Fixed: destructure forgotPassword to match your AuthContext
  const { login, register, forgotPassword, user, loading } = useAuth();

  const [isRegister, setIsRegister] = useState(false);
  const [isForgot, setIsForgot]     = useState(false);
  const [email, setEmail]           = useState('');
  const [password, setPassword]     = useState('');
  const [name, setName]             = useState('');
  const [targetRole, setTargetRole] = useState('Software Engineer');
  const [role, setRole]             = useState('student');
  const [showPass, setShowPass]     = useState(false);
  const [error, setError]           = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [dogMood, setDogMood]       = useState('happy');
  const [tipIdx, setTipIdx]         = useState(0);

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (!loading && user) navigate('/', { replace: true });
  }, [user, loading, navigate]);

  // Rotate Noah's tips
  useEffect(() => {
    const id = setInterval(() => setTipIdx(i => (i + 1) % NOAH_TIPS.length), 4200);
    return () => clearInterval(id);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setSubmitting(true);
    setDogMood('thinking');

    try {
      if (isForgot) {
        if (!email) {
          setError('Please enter your email address.');
          setSubmitting(false);
          setDogMood('happy');
          return;
        }

        // Fixed: calls forgotPassword directly to trigger /api/auth/forgot-password
        let responseData;
        if (typeof forgotPassword === 'function') {
          responseData = await forgotPassword(email.trim());
        } else {
          const res = await fetch('/api/auth/forgot-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email.trim() }),
          });
          responseData = await res.json();
          if (!res.ok) throw new Error(responseData.error || responseData.message || 'Failed to send reset link.');
        }

        setDogMood('excited');
        if (responseData?.resetUrl) {
          setSuccessMsg(
            <span>
              Reset link ready in development mode. Click{' '}
              <a href={responseData.resetUrl} className="text-blue-300 underline break-all" target="_blank" rel="noreferrer">
                {responseData.resetUrl}
              </a>
              {' '}to set a new password.
            </span>
          );
        } else {
          setSuccessMsg(`A password reset link has been sent to ${email}. Check your inbox.`);
        }
      } else if (isRegister) {
        await register({ name, email, password, role, targetRole });
        setDogMood('excited');
        navigate('/', { replace: true });
      } else {
        await login(email, password);
        setDogMood('excited');
        navigate('/', { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Operation failed. Please check your details.');
      setDogMood('happy');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <DogAvatar size={64} mood="thinking" />
          <p className="text-slate-400 text-sm animate-pulse">Noah is waking up...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-slate-950 overflow-hidden">

      {/* ── LEFT PANEL (hero) ─────────────────────────────── */}
      <div className="hidden lg:flex flex-col justify-between w-[52%] relative
                      bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-12">

        {/* Background glow orbs */}
        <div className="absolute top-20 left-16 w-72 h-72 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-32 right-10 w-56 h-56 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Brand */}
        <div className="relative flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="font-extrabold text-xl text-white">Smart Career Coach</span>
            <span className="block text-[10px] font-medium text-indigo-300 uppercase tracking-widest">AI Placement Platform</span>
          </div>
        </div>

        {/* Noah + tip bubble */}
        <div className="relative flex flex-col items-center gap-6">
          <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-5 py-4 max-w-xs text-center shadow-xl">
            <p className="text-white/90 text-sm font-medium leading-relaxed">
              {NOAH_TIPS[tipIdx]}
            </p>
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-4 h-4 bg-white/10 rotate-45 border-b border-r border-white/20" />
          </div>

          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-amber-400/25 blur-2xl animate-pulse" />
            <div className="relative w-36 h-36 rounded-full bg-gradient-to-br from-amber-400 to-amber-600
                            flex items-center justify-center shadow-2xl border-4 border-white/20 animate-float-bob">
              <DogAvatar size={100} mood={dogMood} />
            </div>
            <span className="absolute -top-1 -right-1 flex h-8 w-8">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex rounded-full h-8 w-8 bg-emerald-500 border-2 border-slate-900
                               items-center justify-center text-[11px] text-white font-extrabold shadow">AI</span>
            </span>
          </div>

          <div className="text-center">
            <h2 className="text-2xl font-extrabold text-white">Hi, I'm Noah! 🐶</h2>
            <p className="text-indigo-300 text-sm mt-1">Your AI baby-pup career guide</p>
          </div>
        </div>

        {/* Feature list */}
        <div className="relative space-y-3">
          {[
            "AI Mock Interviews with real-time scoring",
            "Personalized placement roadmap by role",
            "ATS Resume Analyzer & company prep",
            "Noah guides you to prep the RIGHT thing first",
          ].map((feat, i) => (
            <div key={i} className="flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-sm text-slate-300">{feat}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── RIGHT PANEL (login form) ───────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">

          {/* Mobile brand header */}
          <div className="flex lg:hidden items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="font-extrabold text-lg text-white">Smart Career Coach</span>
          </div>

          {/* Card */}
          <div className="bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden">

            {/* Card header */}
            <div className="p-6 sm:p-8 bg-gradient-to-r from-blue-700 via-indigo-700 to-indigo-800 text-white text-center">
              <div className="lg:hidden flex justify-center mb-4">
                <div className="w-16 h-16 rounded-2xl bg-white/20 p-1.5 flex items-center justify-center border border-white/30">
                  <DogAvatar size={48} mood={dogMood} />
                </div>
              </div>
              <h1 className="text-2xl font-extrabold">
                {isForgot ? 'Reset Password' : isRegister ? 'Create Account' : 'Welcome Back!'}
              </h1>
              <p className="text-indigo-200 text-sm mt-1">
                {isForgot
                  ? "Enter your email and we'll send you a reset link"
                  : isRegister
                  ? 'Join Smart Career Coach today'
                  : 'Login to continue your placement journey'}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">

              {/* Error Alert */}
              {error && (
                <div className="p-3 rounded-xl bg-red-950/60 border border-red-800 text-red-300 text-xs flex items-start gap-2">
                  <span className="text-base">⚠️</span>
                  <span>{error}</span>
                </div>
              )}

              {/* Success Alert */}
              {successMsg && (
                <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* Full Name (register only) */}
              {!isForgot && isRegister && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="e.g. Alex Johnson"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800 border border-slate-700
                                 text-slate-100 text-sm placeholder-slate-500
                                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                 transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Email Address */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800 border border-slate-700
                               text-slate-100 text-sm placeholder-slate-500
                               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                               transition-all"
                  />
                </div>
              </div>

              {/* Password field (hidden in forgot-password mode) */}
              {!isForgot && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPass ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-12 py-3 rounded-xl bg-slate-800 border border-slate-700
                                 text-slate-100 text-sm placeholder-slate-500
                                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                 transition-all"
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => setShowPass(p => !p)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                    >
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Forgot Password Link - Directly Below Password Box */}
                  {!isRegister && (
                    <div className="flex justify-end mt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setIsForgot(true);
                          setError('');
                          setSuccessMsg('');
                        }}
                        className="text-xs text-blue-400 hover:text-blue-300 font-medium hover:underline transition-colors"
                      >
                        Forgot password?
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Register extra fields */}
              {!isForgot && isRegister && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Account Type</label>
                    <select
                      value={role}
                      onChange={e => setRole(e.target.value)}
                      className="w-full px-3 py-3 rounded-xl bg-slate-800 border border-slate-700
                                 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="student">Student</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Target Role</label>
                    <input
                      type="text"
                      value={targetRole}
                      onChange={e => setTargetRole(e.target.value)}
                      placeholder="Software Engineer"
                      className="w-full px-3 py-3 rounded-xl bg-slate-800 border border-slate-700
                                 text-slate-100 text-sm placeholder-slate-500
                                 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl
                           bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700
                           hover:from-blue-500 hover:to-indigo-600
                           text-white font-bold text-sm shadow-lg shadow-blue-900/50
                           transition-all hover:-translate-y-0.5 active:translate-y-0
                           disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              >
                {submitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    {isForgot ? 'Sending link...' : isRegister ? 'Creating account...' : 'Logging in...'}
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    {isForgot ? 'Send Reset Link' : isRegister ? 'Create My Account' : 'Login & Start Preparing'}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Bottom switch links */}
              {isForgot ? (
                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgot(false);
                      setError('');
                      setSuccessMsg('');
                    }}
                    className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
                  </button>
                </div>
              ) : (
                <p className="text-center text-xs text-slate-400 pt-1">
                  {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setIsRegister(r => !r);
                      setError('');
                      setSuccessMsg('');
                    }}
                    className="text-blue-400 font-semibold hover:underline"
                  >
                    {isRegister ? 'Login here' : 'Register free'}
                  </button>
                </p>
              )}

            </form>
          </div>

          {/* Bottom note */}
          <p className="text-center text-xs text-slate-600 mt-6">
            🔒 Your data is safe &amp; never shared
          </p>
        </div>
      </div>

    </div>
  );
}