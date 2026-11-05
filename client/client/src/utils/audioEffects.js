// Web Audio API Sound Synthesizer for Noah the AI Career Pup 🐶
// Zero external audio files required - works 100% offline and in all modern browsers

let audioCtx = null;

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

/**
 * Friendly animated puppy bark ("Yip! Woof-woof!")
 */
export function playBarkSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // First friendly yip (pup bark)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    const filter1 = ctx.createBiquadFilter();

    filter1.type = 'bandpass';
    filter1.frequency.setValueAtTime(800, now);
    filter1.Q.setValueAtTime(3, now);

    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(460, now);
    osc1.frequency.exponentialRampToValueAtTime(860, now + 0.04);
    osc1.frequency.exponentialRampToValueAtTime(340, now + 0.13);

    gain1.gain.setValueAtTime(0.001, now);
    gain1.gain.linearRampToValueAtTime(0.3, now + 0.025);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

    osc1.connect(filter1);
    filter1.connect(gain1);
    gain1.connect(ctx.destination);

    osc1.start(now);
    osc1.stop(now + 0.15);

    // Second slightly higher playful yip (0.16s later)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    const filter2 = ctx.createBiquadFilter();

    const t2 = now + 0.16;
    filter2.type = 'bandpass';
    filter2.frequency.setValueAtTime(950, t2);
    filter2.Q.setValueAtTime(3, t2);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(540, t2);
    osc2.frequency.exponentialRampToValueAtTime(960, t2 + 0.04);
    osc2.frequency.exponentialRampToValueAtTime(400, t2 + 0.13);

    gain2.gain.setValueAtTime(0.001, t2);
    gain2.gain.linearRampToValueAtTime(0.32, t2 + 0.025);
    gain2.gain.exponentialRampToValueAtTime(0.001, t2 + 0.14);

    osc2.connect(filter2);
    filter2.connect(gain2);
    gain2.connect(ctx.destination);

    osc2.start(t2);
    osc2.stop(t2 + 0.15);
  } catch (err) {
    // Graceful no-op
  }
}

/**
 * Excited "Bark for Treat" sound!
 * A double puppy yip followed by an eager rising chime ("Arf-arf! 🦴 Please feed me!")
 */
export function playBegForTreatBark() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    playBarkSound();

    const now = ctx.currentTime;
    // Rising sweet chime 0.35s later
    const chimeTimes = [0.36, 0.45, 0.54];
    const freqs = [659.25, 880.00, 1046.50]; // E5, A5, C6

    chimeTimes.forEach((delay, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const t = now + delay;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freqs[idx], t);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.18, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 0.23);
    });
  } catch (err) {
    // Graceful no-op
  }
}

/**
 * Crunchy Treat Munch Sound + Happy Puppy Whimper of Joy
 */
export function playTreatCrunchSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // 3 rapid playful "crunch" clicks
    [0, 0.08, 0.16].forEach((offset) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const t = now + offset;

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(1200, t);
      osc.frequency.exponentialRampToValueAtTime(180, t + 0.04);

      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 0.06);
    });

    // Followed by a joyous high-pitch puppy whimper / chime
    const happyOsc = ctx.createOscillator();
    const happyGain = ctx.createGain();
    const ht = now + 0.26;

    happyOsc.type = 'sine';
    happyOsc.frequency.setValueAtTime(700, ht);
    happyOsc.frequency.exponentialRampToValueAtTime(1150, ht + 0.12);
    happyOsc.frequency.exponentialRampToValueAtTime(880, ht + 0.28);

    happyGain.gain.setValueAtTime(0.001, ht);
    happyGain.gain.linearRampToValueAtTime(0.22, ht + 0.04);
    happyGain.gain.exponentialRampToValueAtTime(0.001, ht + 0.32);

    happyOsc.connect(happyGain);
    happyGain.connect(ctx.destination);

    happyOsc.start(ht);
    happyOsc.stop(ht + 0.35);
  } catch (err) {
    // Graceful no-op
  }
}

/**
 * Pleasant UI Success Chime
 */
export function playSuccessChime() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    const now = ctx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      const startTime = now + (idx * 0.08);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.linearRampToValueAtTime(0.18, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.36);
    });
  } catch (err) {
    // Graceful no-op
  }
}

/**
 * Bubble pop click
 */
export function playPopSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.08);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.09);
  } catch (err) {
    // Graceful no-op
  }
}

/**
 * Noah's Baby Boy Dog Voice Synthesis Helper
 * Tuned for a small baby boy puppy: soft, warm, slightly lower pitch,
 * gentle cadence — like a sweet toddler puppy talking!
 */
export function speakAnimatedDogVoice(text, onStart, onEnd) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

  try {
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    // Baby boy puppy voice settings:
    // pitch < 1.0 gives a softer, younger, baby-boy warmth
    // rate slightly slower so it sounds like a cute toddler pup
    utterance.pitch = 0.82;  // Baby boy warmth — not too high, not too low
    utterance.rate  = 0.88;  // Gentle, slightly slower — cute and endearing
    utterance.volume = 1.0;

    // Find best expressive voice — prefer a young/male-sounding en-US voice
    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length > 0) {
      // Priority: Google UK English Male > Daniel > Alex > any en-US/en-GB
      const preferred =
        voices.find(v => v.name === 'Google UK English Male') ||
        voices.find(v => v.name === 'Daniel') ||
        voices.find(v => v.name === 'Alex') ||
        voices.find(v => v.name.includes('Male') && v.lang.startsWith('en')) ||
        voices.find(v => v.name.includes('Google') && v.lang === 'en-US') ||
        voices.find(v => v.lang === 'en-US') ||
        voices.find(v => v.lang.startsWith('en'));
      if (preferred) utterance.voice = preferred;
    }

    if (onStart) utterance.onstart = onStart;
    if (onEnd) {
      utterance.onend  = onEnd;
      utterance.onerror = onEnd;
    }

    window.speechSynthesis.speak(utterance);
  } catch (e) {
    if (onEnd) onEnd();
  }
}
