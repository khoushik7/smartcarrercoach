import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DogAvatar from './DogAvatar';
import { POPULAR_ROLES, sniffOutRoadmap } from '../data/careerRoadmaps';
import {
  playBarkSound,
  playSuccessChime,
  playPopSound,
  playBegForTreatBark,
  playTreatCrunchSound,
  speakAnimatedDogVoice,
} from '../utils/audioEffects';
import { apiRequest } from '../services/api';
import {
  X,
  Volume2,
  VolumeX,
  Sparkles,
  Compass,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  Bone,
  Mic,
  MicOff,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Flame,
} from 'lucide-react';
import confetti from 'canvas-confetti';

/* ─── Noah's rotating greeting lines ───────────────────────────── */
const GREETINGS = [
  'Woof! 🐶 Not sure what to study 1st? Click me!',
  '🐾 Noah here! Let me sniff out your study plan!',
  "🦴 Tell me your role — I'll find what to prep FIRST!",
  "🐶 Arf! Most students start wrong. I'll fix that!",
];

/* ─── tiny helper: POST to backend silently (no crash on offline) ─── */
async function silentPost(endpoint, body) {
  try {
    await apiRequest(endpoint, 'POST', body);
  } catch (_) {
    /* silently ignore – UI never breaks if backend is offline */
  }
}

export default function DogAIAssistant() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { user, updateUserData } = useAuth();

  /* ── core dialog state ───────────────────────────────────────────── */
  const [isOpen,          setIsOpen]          = useState(false);
  const [showTeaser,      setShowTeaser]      = useState(true);
  const [mood,            setMood]            = useState('happy');
  const [selectedRole,    setSelectedRole]    = useState(null);
  const [customRoleInput, setCustomRoleInput] = useState('');
  const [isSniffing,      setIsSniffing]      = useState(false);
  const [showFullRoadmap, setShowFullRoadmap] = useState(false);
  const [pageNote,        setPageNote]        = useState(null);

  /* ── treat / sound prefs ─────────────────────────────────────────── */
  const [isMuted,       setIsMuted]       = useState(() => localStorage.getItem('Noah_muted') === 'true');
  const [voiceEnabled,  setVoiceEnabled]  = useState(false);
  const [treatCount,    setTreatCount]    = useState(() => parseInt(localStorage.getItem('Noah_treats') || '0', 10));
  const [treatAnim,     setTreatAnim]     = useState(false); // bone wiggle class
  const [bubbleText,    setBubbleText]    = useState(GREETINGS[0]);

  /* ── greeting rotation ───────────────────────────────────────────── */
  useEffect(() => {
    const id = setInterval(() => {
      setBubbleText(prev => {
        const idx = GREETINGS.indexOf(prev);
        return GREETINGS[(idx + 1) % GREETINGS.length];
      });
    }, 5000);
    return () => clearInterval(id);
  }, []);

  /* ── auto-hide teaser ────────────────────────────────────────────── */
  useEffect(() => {
    const t = setTimeout(() => setShowTeaser(false), 9000);
    return () => clearTimeout(t);
  }, []);

  /* ── restore saved role ──────────────────────────────────────────── */
  useEffect(() => {
    const saved = localStorage.getItem('Noah_target_role') || user?.targetRole;
    if (saved) setSelectedRole(sniffOutRoadmap(saved));
  }, [user?.targetRole]);

  /* ── page-arrival coaching notes ─────────────────────────────────── */
  useEffect(() => {
    const notes = {
      '/technical-prep':   '🐾 Great start! These technical drills clear the #1 coding gate!',
      '/aptitude-prep':    '🐾 Aptitude screens 70%+ of candidates — master these first!',
      '/mock-interview':   '🐾 Voice & pace matter! The AI will score your WPM & filler words.',
      '/resume-analyzer':  '🐾 ATS keywords win shortlists. Let me check your resume score!',
      '/company-prep':     '🐾 Study this company\'s exact exam pattern before applying!',
      '/leaderboard':      '🐾 Compete daily to keep your streak alive!',
      '/daily-challenge':  '🐾 One challenge a day keeps placement rejection away! 🦴',
    };
    setPageNote(notes[location.pathname] || null);
  }, [location.pathname]);

  /* ── global custom event: open Noah (optionally with a role) ──── */
  // NOTE: wrapped in useCallback so it can be stable across renders
  const selectRoleHandler = useCallback((role) => {
    if (!isMuted) playPopSound();
    setIsSniffing(true);
    setMood('thinking');

    setTimeout(() => {
      const roadmap = typeof role === 'string' ? sniffOutRoadmap(role) : role;
      setSelectedRole(roadmap);
      setIsSniffing(false);
      setMood('excited');
      if (!isMuted) playSuccessChime();

      /* persist */
      localStorage.setItem('Noah_target_role', roadmap.title);
      if (updateUserData) updateUserData({ targetRole: roadmap.title });

      /* POST to backend — saves targetRole in MongoDB */
      silentPost('/assistant/guidance', {
        targetRole:    roadmap.title,
        step1Headline: roadmap.prepareFirst.headline,
        targetPath:    roadmap.prepareFirst.path,
      });

      /* animated dog voice narration */
      if (voiceEnabled) {
        speakAnimatedDogVoice(
          `Woof! For ${roadmap.title}, prepare ${roadmap.prepareFirst.headline} first! Tap the button and let's go!`,
          () => setMood('talking'),
          () => setMood('happy'),
        );
      }

      setTimeout(() => setMood('happy'), 1600);
    }, 460);
  }, [isMuted, voiceEnabled, updateUserData]);

  useEffect(() => {
    const handler = (e) => {
      setIsOpen(true);
      setShowTeaser(false);
      if (!isMuted) playBarkSound();
      if (e.detail?.role) {
        selectRoleHandler(e.detail.role);
      } else {
        setMood('excited');
        setTimeout(() => setMood('happy'), 1000);
      }
    };
    window.addEventListener('open-Noah-assistant', handler);
    return () => window.removeEventListener('open-Noah-assistant', handler);
  }, [isMuted, selectRoleHandler]);

  /* ── open / close ────────────────────────────────────────────────── */
  const toggleOpen = () => {
    if (!isOpen) {
      if (!isMuted) playBarkSound();
      setMood('excited');
      setTimeout(() => setMood('happy'), 1200);
      setShowTeaser(false);
    } else {
      if (!isMuted) playPopSound();
    }
    setIsOpen(prev => !prev);
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    const next = !isMuted;
    setIsMuted(next);
    localStorage.setItem('Noah_muted', next ? 'true' : 'false');
  };

  /* ── 🦴 GIVE TREAT ──────────────────────────────────────────────── */
  const handleGiveTreat = (e) => {
    e.stopPropagation();
    const next = treatCount + 1;
    setTreatCount(next);
    localStorage.setItem('Noah_treats', next.toString());

    /* 1. Noah BEGS with a bark + rising chime */
    if (!isMuted) playBegForTreatBark();

    /* 2. Bone wiggle animation */
    setTreatAnim(true);
    setTimeout(() => setTreatAnim(false), 600);

    /* 3. Show excited face */
    setMood('excited');

    /* 4. 400 ms later: crunch sound (treat is eaten!) */
    setTimeout(() => {
      if (!isMuted) playTreatCrunchSound();
    }, 420);

    /* 5. Confetti burst */
    confetti({
      particleCount: 45,
      spread: 75,
      origin: { y: 0.82, x: 0.9 },
      colors: ['#f59e0b', '#fbbf24', '#fde68a', '#ffffff'],
    });

    /* 6. Animated dog voice thanks */
    if (voiceEnabled) {
      setTimeout(() => {
        speakAnimatedDogVoice(
          'Woof woof! Yum yum! Thank you for the treat! You are the best human ever!',
          () => setMood('talking'),
          () => setMood('happy'),
        );
      }, 650);
    }

    /* 7. POST to backend so VS Code terminal shows the bark */
    silentPost('/assistant/treat', { treatNumber: next });

    /* 8. Reset mood */
    setTimeout(() => setMood('happy'), 2800);
  };

  /* ── navigate to prep page ───────────────────────────────────────── */
  const goTo = (path) => {
    if (!isMuted) playSuccessChime();
    setIsOpen(false);
    navigate(path);
  };

  /* ── custom role form ────────────────────────────────────────────── */
  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!customRoleInput.trim()) return;
    selectRoleHandler(customRoleInput.trim());
    setCustomRoleInput('');
  };

  /* ════════════════════════════════════════════════════════════════════
     RENDER
     ════════════════════════════════════════════════════════════════════ */
  return (
    <>
      {/* ── PAGE-ARRIVAL NOTE ─────────────────────────────────────── */}
      {pageNote && (
        <div className="fixed bottom-[6.5rem] right-4 sm:right-6 z-40 max-w-sm hidden sm:flex items-center gap-3
                        bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-4 py-3 rounded-2xl
                        border border-amber-300 dark:border-amber-700/60 shadow-xl">
          <DogAvatar size={34} mood="excited" />
          <div className="flex-1 text-xs">
            <span className="font-bold text-amber-700 dark:text-amber-400 block">Noah's Tip</span>
            <span className="text-slate-700 dark:text-slate-300">{pageNote}</span>
          </div>
          <button onClick={() => setPageNote(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ── SPEECH BUBBLE TEASER ─────────────────────────────────── */}
      {!isOpen && showTeaser && (
        <div className="fixed bottom-[6.5rem] right-4 sm:right-6 z-40 max-w-xs">
          <div className="relative bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs
                          font-semibold px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2
                          border border-amber-300/40">
            <span>{bubbleText}</span>
            <button onClick={(e) => { e.stopPropagation(); setShowTeaser(false); }}
                    className="text-white/80 hover:text-white p-0.5 rounded-full hover:bg-white/20">
              <X className="w-3.5 h-3.5" />
            </button>
            {/* Tail pointing to dog icon */}
            <div className="absolute -bottom-2 right-7 w-3 h-3 bg-amber-600 rotate-45" />
          </div>
        </div>
      )}

      {/* ── FLOATING DOG BUTTON ───────────────────────────────────── */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={toggleOpen}
          aria-label="Open Noah AI Career Assistant"
          className="group relative flex items-center justify-center w-16 h-16 rounded-full
                     bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600
                     shadow-2xl hover:shadow-amber-400/60 hover:scale-105 active:scale-95
                     transition-all duration-300 border-2 border-white dark:border-slate-800
                     animate-float-bob"
        >
          {/* glow ring */}
          <div className="absolute inset-0 rounded-full bg-amber-400/40 blur-md group-hover:blur-xl animate-pulse" />
          {/* dog face */}
          <div className="relative w-full h-full rounded-full bg-amber-100 dark:bg-slate-900 flex items-center justify-center">
            <DogAvatar size={48} mood={isOpen ? 'excited' : mood} />
          </div>
          {/* AI badge */}
          <span className="absolute -top-1 -right-1 flex h-5 w-5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-5 w-5 bg-emerald-500 border-2 border-white
                             dark:border-slate-900 items-center justify-center text-[10px] text-white font-extrabold">
              AI
            </span>
          </span>
        </button>
      </div>

      {/* ── EXPANDED PANEL ───────────────────────────────────────── */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-50 w-[94vw] sm:w-[440px] max-h-[86vh]
                        flex flex-col bg-white dark:bg-slate-900 rounded-3xl shadow-2xl
                        border border-amber-200 dark:border-slate-800 overflow-hidden
                        animate-in fade-in zoom-in-95 duration-200">

          {/* ── HEADER ─────────────────────────────────────────── */}
          <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-white flex-shrink-0">
            <div className="flex items-center justify-between">

              {/* avatar + name */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md p-1 flex items-center justify-center
                                border border-white/30 shadow-inner">
                  <DogAvatar size={40} mood={mood} />
                </div>
                <div>
                  <h3 className="font-extrabold text-base flex items-center gap-1.5">
                    Noah
                    <span className="text-amber-200 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/20">AI Pup</span>
                  </h3>
                  <p className="text-[11px] text-amber-100 font-medium">Sniffing out what to prepare 1st 🐾</p>
                </div>
              </div>

              {/* controls */}
              <div className="flex items-center gap-1.5">

                {/* 🦴 Treat button */}
                <button
                  onClick={handleGiveTreat}
                  title={`Give Noah a treat! (${treatCount} given so far)`}
                  className={`px-2.5 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white
                              text-xs font-bold flex items-center gap-1 transition-all active:scale-90
                              ${treatAnim ? 'scale-125 rotate-12' : ''}`}
                >
                  <Bone className={`w-4 h-4 text-amber-200 ${treatAnim ? 'animate-bounce' : ''}`} />
                  <span>{treatCount}</span>
                </button>

                {/* voice toggle */}
                <button
                  onClick={() => setVoiceEnabled(prev => !prev)}
                  title={voiceEnabled ? 'Dog voice ON — click to mute narration' : 'Enable Noah dog voice narration'}
                  className={`p-1.5 rounded-xl transition-colors ${voiceEnabled
                    ? 'bg-amber-300 text-amber-900 font-bold'
                    : 'bg-white/20 hover:bg-white/30 text-white'}`}
                >
                  {voiceEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                </button>

                {/* sound FX toggle */}
                <button onClick={toggleMute}
                        title={isMuted ? 'Unmute bark sounds' : 'Mute bark sounds'}
                        className="p-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-colors">
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>

                {/* close */}
                <button onClick={toggleOpen}
                        className="p-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* treat progress bar */}
            {treatCount > 0 && (
              <div className="mt-3 flex items-center gap-2">
                <span className="text-[10px] text-amber-200 font-semibold whitespace-nowrap">
                  🦴 {treatCount} treat{treatCount !== 1 ? 's' : ''} given
                </span>
                <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white/70 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(treatCount * 10, 100)}%` }}
                  />
                </div>
                {treatCount >= 10 && (
                  <span className="text-[10px] text-amber-200 font-bold">Max love! 🥰</span>
                )}
              </div>
            )}
          </div>

          {/* ── SCROLLABLE BODY ────────────────────────────────── */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-xs text-slate-800 dark:text-slate-200">

            {/* greeting bubble */}
            <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40
                            border border-amber-200 dark:border-amber-800/60 flex items-start gap-3">
              <span className="text-xl">🐶</span>
              <div className="space-y-1">
                <span className="font-bold text-amber-900 dark:text-amber-300 block">
                  Woof! I'm here to save your precious prep time!
                </span>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-[11px]">
                  Most students fail because they study advanced topics before clearing the{' '}
                  <strong className="text-amber-800 dark:text-amber-300">Round 1 elimination gate</strong>.
                  Tell me your job role and I'll point you to exactly what to prepare first!
                </p>
                {!isMuted && (
                  <button
                    onClick={() => speakAnimatedDogVoice(
                      'Hello! I am Noah, your AI career guide dog! I will help you figure out what to study first so you don\'t get eliminated in round one!',
                      () => setMood('talking'),
                      () => setMood('happy'),
                    )}
                    className="mt-1 inline-flex items-center gap-1 text-[10px] font-bold text-amber-700
                               dark:text-amber-400 hover:underline"
                  >
                    <Volume2 className="w-3 h-3" /> Hear Noah introduce himself
                  </button>
                )}
              </div>
            </div>

            {/* sniffing loader */}
            {isSniffing && (
              <div className="py-10 text-center space-y-4">
                <div className="flex justify-center">
                  <DogAvatar size={72} mood="thinking" />
                </div>
                <div className="flex items-center justify-center gap-2 text-amber-600 dark:text-amber-400 font-bold">
                  <span className="animate-bounce">🐾</span>
                  <span>Noah is sniffing out the syllabus…</span>
                  <span className="animate-bounce delay-150">🐾</span>
                </div>
                <p className="text-[11px] text-slate-400">Finding the exact #1 Round 1 filter for your role…</p>
              </div>
            )}

            {/* ── RESULT: role selected ──────────────────────── */}
            {!isSniffing && selectedRole && (
              <div className="space-y-4 animate-in fade-in duration-300">

                {/* active role chip */}
                <div className="flex items-center justify-between p-3 rounded-2xl
                                bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">{selectedRole.icon || '🎯'}</span>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Target Role</span>
                      <span className="font-extrabold text-slate-900 dark:text-white text-sm">{selectedRole.title}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => { if (!isMuted) playPopSound(); setSelectedRole(null); }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold
                               text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded-lg transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" /> Change
                  </button>
                </div>

                {/* ★ PRIORITY #1 CARD ★ */}
                <div className="p-4 rounded-2xl border-2 border-amber-400 dark:border-amber-500/70
                                bg-gradient-to-br from-amber-50 via-white to-amber-50/30
                                dark:from-amber-950/30 dark:via-slate-900 dark:to-amber-950/10
                                shadow-lg space-y-3">

                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full
                                     bg-amber-500 text-white font-extrabold text-[10px] tracking-wide uppercase shadow">
                      <Sparkles className="w-3 h-3" /> Prepare This 1st — Step 1
                    </span>
                    <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400
                                     bg-amber-100 dark:bg-amber-950/70 px-2 py-0.5 rounded-md">
                      {selectedRole.prepareFirst.badge}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white leading-snug">
                      {selectedRole.prepareFirst.headline}
                    </h4>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
                      {selectedRole.prepareFirst.whyFirst}
                    </p>
                  </div>

                  {/* skills checklist */}
                  {selectedRole.prepareFirst.keySkills && (
                    <div className="pt-1 space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                        Week 1 Targets ({selectedRole.prepareFirst.timeEstimate}):
                      </span>
                      <div className="grid grid-cols-1 gap-1">
                        {selectedRole.prepareFirst.keySkills.map((skill, i) => (
                          <div key={i} className="flex items-center gap-1.5 text-[11px] text-slate-700 dark:text-slate-300">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            {skill}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* CTA button */}
                  <div className="pt-1">
                    <button
                      onClick={() => goTo(selectedRole.prepareFirst.path)}
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl
                                 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700
                                 hover:from-amber-600 hover:to-amber-800 text-white font-extrabold text-xs
                                 shadow-lg hover:shadow-amber-500/40 transform hover:-translate-y-0.5
                                 active:translate-y-0 transition-all duration-200"
                    >
                      <Compass className="w-4 h-4 animate-spin-slow" />
                      {selectedRole.prepareFirst.buttonText || 'Take Me There Now'}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <p className="text-center text-[10px] text-slate-400 mt-1.5">
                      Noah will navigate you and pre-select the right category! 🐾
                    </p>
                  </div>

                  {/* voice explain button */}
                  {!isMuted && (
                    <button
                      onClick={() => speakAnimatedDogVoice(
                        `For ${selectedRole.title}, the most important thing to prepare first is ${selectedRole.prepareFirst.headline}. ${selectedRole.prepareFirst.whyFirst} Let's go!`,
                        () => setMood('talking'),
                        () => setMood('happy'),
                      )}
                      className="w-full flex items-center justify-center gap-1.5 py-1.5 text-[11px]
                                 font-semibold text-amber-700 dark:text-amber-400 hover:bg-amber-50
                                 dark:hover:bg-amber-950/30 rounded-lg transition-colors"
                    >
                      <Volume2 className="w-3.5 h-3.5" /> Hear Noah explain this in his voice
                    </button>
                  )}
                </div>

                {/* collapsible full roadmap */}
                <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
                  <button
                    onClick={() => setShowFullRoadmap(p => !p)}
                    className="w-full p-3 flex items-center justify-between text-left
                               bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800
                               text-slate-900 dark:text-white font-bold text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <Flame className="w-4 h-4 text-amber-500" />
                      View Full 3-Step Placement Roadmap
                    </div>
                    {showFullRoadmap ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  {showFullRoadmap && (
                    <div className="p-3 space-y-2.5 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
                      {selectedRole.roadmap.map(step => (
                        <div
                          key={step.step}
                          className={`p-2.5 rounded-xl border flex items-start justify-between gap-2
                                      ${step.isFirst
                                        ? 'border-amber-300 dark:border-amber-700/80 bg-amber-50/50 dark:bg-amber-950/20'
                                        : 'border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30'}`}
                        >
                          <div className="flex items-start gap-2">
                            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px]
                                             font-extrabold shrink-0 mt-0.5
                                             ${step.isFirst ? 'bg-amber-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
                              {step.step}
                            </span>
                            <div>
                              <span className="font-bold text-slate-900 dark:text-white block text-[11px]">{step.title}</span>
                              <p className="text-[10px] text-slate-500 dark:text-slate-400">{step.description}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => goTo(step.page)}
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 p-1
                                       text-[10px] font-semibold flex items-center gap-0.5 shrink-0"
                          >
                            Open <ExternalLink className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── ROLE SELECTION VIEW ─────────────────────────── */}
            {!isSniffing && !selectedRole && (
              <div className="space-y-4">
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                    What is your target job role? <span className="text-amber-500">🎯</span>
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Pick a popular role below or type your dream position:
                  </p>
                </div>

                {/* popular roles grid */}
                <div className="grid grid-cols-2 gap-2">
                  {POPULAR_ROLES.map(role => (
                    <button
                      key={role.id}
                      onClick={() => selectRoleHandler(role)}
                      className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800
                                 bg-slate-50/70 dark:bg-slate-800/40 hover:bg-amber-50/80
                                 dark:hover:bg-amber-950/40 hover:border-amber-300 dark:hover:border-amber-700
                                 text-left transition-all duration-150 group"
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="text-base group-hover:scale-110 transition-transform">{role.icon}</span>
                        <span className="font-bold text-slate-900 dark:text-slate-100 text-[11px] truncate">{role.title}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-1 block">
                        {role.shortDesc}
                      </span>
                    </button>
                  ))}
                </div>

                {/* custom role input */}
                <form onSubmit={handleCustomSubmit} className="pt-1">
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      value={customRoleInput}
                      onChange={e => setCustomRoleInput(e.target.value)}
                      placeholder="Type any role (e.g. Android Dev, PM, Blockchain)…"
                      className="w-full pl-3 pr-20 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800
                                 border border-slate-200 dark:border-slate-700 text-xs text-slate-900
                                 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <button
                      type="submit"
                      disabled={!customRoleInput.trim()}
                      className="absolute right-1 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600
                                 disabled:opacity-50 text-white font-bold text-[11px] transition-colors"
                    >
                      Sniff 🐾
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* ── FOOTER ─────────────────────────────────────────── */}
          <div className="flex-shrink-0 px-4 py-3 bg-slate-50 dark:bg-slate-950/80
                          border-t border-slate-100 dark:border-slate-800
                          flex items-center justify-between text-[10px] text-slate-400">
            <span>🐶 Noah AI Companion • Smart Career Coach</span>
            {treatCount >= 5 && (
              <span className="font-bold text-amber-600 dark:text-amber-400 animate-pulse">
                🦴 Noah loves you!
              </span>
            )}
          </div>
        </div>
      )}
    </>
  );
}
