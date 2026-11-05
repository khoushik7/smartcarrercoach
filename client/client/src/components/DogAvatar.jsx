import React, { useState, useEffect } from 'react';

/**
 * DogAvatar: An adorable, interactive SVG small dog face (Noah the AI Career Pup 🐶)
 * Features blinking eyes, twitching floppy ears, warm puppy expression, and bone collar!
 */
export default function DogAvatar({ 
  size = 48, 
  mood = 'happy', // 'happy' | 'excited' | 'thinking' | 'talking' 
  animated = true,
  className = ''
}) {
  const [blink, setBlink] = useState(false);
  const [earWiggle, setEarWiggle] = useState(false);

  useEffect(() => {
    if (!animated) return;

    // Periodic natural blink
    const blinkInterval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 180);
    }, 3800 + Math.random() * 2000);

    // Periodic cute ear wiggle
    const earInterval = setInterval(() => {
      setEarWiggle(true);
      setTimeout(() => setEarWiggle(false), 500);
    }, 6000 + Math.random() * 3000);

    return () => {
      clearInterval(blinkInterval);
      clearInterval(earInterval);
    };
  }, [animated]);

  const isExcited = mood === 'excited';
  const isThinking = mood === 'thinking';
  const isTalking = mood === 'talking';

  return (
    <div 
      className={`inline-block relative select-none transition-transform duration-300 ${className}`}
      style={{ width: size, height: size }}
      title="Noah - Your AI Career Pup"
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md"
      >
        <defs>
          <linearGradient id="furGradient" x1="50" y1="15" x2="50" y2="90" gradientUnits="userSpaceOnUse">
            <stop stopColor="#F59E0B" /> {/* Amber 500 */}
            <stop offset="0.6" stopColor="#D97706" /> {/* Amber 600 */}
            <stop offset="1" stopColor="#B45309" /> {/* Amber 700 */}
          </linearGradient>

          <linearGradient id="snoutGradient" x1="50" y1="45" x2="50" y2="78" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FEF3C7" /> {/* Warm Cream Amber 100 */}
            <stop offset="1" stopColor="#FDE68A" /> {/* Amber 200 */}
          </linearGradient>

          <linearGradient id="earGradientLeft" x1="20" y1="10" x2="20" y2="55" gradientUnits="userSpaceOnUse">
            <stop stopColor="#92400E" /> {/* Warm Dark Amber 800 */}
            <stop offset="1" stopColor="#78350F" /> {/* Amber 900 */}
          </linearGradient>

          <linearGradient id="earGradientRight" x1="80" y1="10" x2="80" y2="55" gradientUnits="userSpaceOnUse">
            <stop stopColor="#92400E" />
            <stop offset="1" stopColor="#78350F" />
          </linearGradient>

          <linearGradient id="collarGradient" x1="25" y1="82" x2="75" y2="82" gradientUnits="userSpaceOnUse">
            <stop stopColor="#3B82F6" /> {/* Blue 500 */}
            <stop offset="1" stopColor="#2563EB" /> {/* Blue 600 */}
          </linearGradient>

          <linearGradient id="boneGradient" x1="42" y1="88" x2="58" y2="88" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFFBEB" />
            <stop offset="1" stopColor="#FEF08A" />
          </linearGradient>
        </defs>

        {/* --- LEFT FLOPPY EAR --- */}
        <g 
          className={`transition-transform duration-300 origin-top-left ${
            earWiggle || isThinking ? '-rotate-12 translate-y-[-2px]' : ''
          }`}
        >
          <path
            d="M 24 25 C 10 20, 4 45, 12 62 C 16 70, 26 66, 28 50 C 30 38, 30 28, 24 25 Z"
            fill="url(#earGradientLeft)"
          />
          {/* Inner ear soft pink accent */}
          <path
            d="M 16 34 C 11 44, 15 56, 20 58 C 22 52, 22 42, 18 36 Z"
            fill="#F472B6"
            opacity="0.6"
          />
        </g>

        {/* --- RIGHT FLOPPY EAR --- */}
        <g 
          className={`transition-transform duration-300 origin-top-right ${
            earWiggle || isExcited ? 'rotate-12 translate-y-[-2px]' : ''
          }`}
        >
          <path
            d="M 76 25 C 90 20, 96 45, 88 62 C 84 70, 74 66, 72 50 C 70 38, 70 28, 76 25 Z"
            fill="url(#earGradientRight)"
          />
          {/* Inner ear soft pink accent */}
          <path
            d="M 84 34 C 89 44, 85 56, 80 58 C 78 52, 78 42, 82 36 Z"
            fill="#F472B6"
            opacity="0.6"
          />
        </g>

        {/* --- HEAD & FACE --- */}
        <circle cx="50" cy="50" r="33" fill="url(#furGradient)" />

        {/* Forehead cute blaze highlight */}
        <path
          d="M 46 20 C 47 30, 47 36, 50 40 C 53 36, 53 30, 54 20 Z"
          fill="#FEF3C7"
          opacity="0.85"
        />

        {/* --- SNOUT (Warm Cream) --- */}
        <ellipse cx="50" cy="62" rx="20" ry="16" fill="url(#snoutGradient)" />

        {/* --- NOSE --- */}
        <path
          d="M 44 54 C 44 52, 47 50, 50 50 C 53 50, 56 52, 56 54 C 56 57, 52 61, 50 61 C 48 61, 44 57, 44 54 Z"
          fill="#1E1B4B"
        />
        {/* Nose shine highlight */}
        <circle cx="48.5" cy="53" r="1.5" fill="#FFFFFF" opacity="0.9" />

        {/* --- MOUTH & TONGUE --- */}
        {/* Philtrum line from nose to mouth */}
        <line x1="50" y1="61" x2="50" y2="66" stroke="#1E1B4B" strokeWidth="2" strokeLinecap="round" />

        {/* Whiskers dots */}
        <circle cx="40" cy="63" r="1" fill="#78350F" opacity="0.4" />
        <circle cx="37" cy="65" r="1" fill="#78350F" opacity="0.4" />
        <circle cx="60" cy="63" r="1" fill="#78350F" opacity="0.4" />
        <circle cx="63" cy="65" r="1" fill="#78350F" opacity="0.4" />

        {/* Open happy mouth & little panting tongue */}
        <path
          d="M 43 66 Q 50 72 57 66"
          fill="none"
          stroke="#1E1B4B"
          strokeWidth="2.2"
          strokeLinecap="round"
        />

        {(isExcited || isTalking || mood === 'happy') && (
          <path
            d="M 47 68 C 47 75, 53 75, 53 68 Z"
            fill="#F43F5E"
            className={isTalking ? 'animate-pulse' : ''}
          />
        )}

        {/* --- EYES --- */}
        {blink ? (
          // Blinking eyes (closed joyful curves)
          <>
            <path d="M 33 44 Q 38 48 43 44" fill="none" stroke="#1E1B4B" strokeWidth="3" strokeLinecap="round" />
            <path d="M 57 44 Q 62 48 67 44" fill="none" stroke="#1E1B4B" strokeWidth="3" strokeLinecap="round" />
          </>
        ) : isExcited ? (
          // Star / excited sparkling eyes
          <>
            <circle cx="38" cy="43" r="6" fill="#1E1B4B" />
            <circle cx="36" cy="41" r="2.4" fill="#FFFFFF" />
            <circle cx="40" cy="45" r="1.2" fill="#FFFFFF" />

            <circle cx="62" cy="43" r="6" fill="#1E1B4B" />
            <circle cx="60" cy="41" r="2.4" fill="#FFFFFF" />
            <circle cx="64" cy="45" r="1.2" fill="#FFFFFF" />
          </>
        ) : (
          // Normal friendly big puppy eyes
          <>
            <circle cx="38" cy="44" r="5.5" fill="#1E1B4B" />
            <circle cx="36.5" cy="42" r="2.2" fill="#FFFFFF" />
            <circle cx="40" cy="45.5" r="1" fill="#FFFFFF" />

            <circle cx="62" cy="44" r="5.5" fill="#1E1B4B" />
            <circle cx="60.5" cy="42" r="2.2" fill="#FFFFFF" />
            <circle cx="64" cy="45.5" r="1" fill="#FFFFFF" />
          </>
        )}

        {/* Cute puppy eyebrows */}
        <path
          d={isThinking ? "M 33 34 Q 38 31 43 35" : "M 34 35 Q 38 33 42 35"}
          fill="none"
          stroke="#78350F"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d={isThinking ? "M 57 32 Q 62 30 67 33" : "M 58 35 Q 62 33 66 35"}
          fill="none"
          stroke="#78350F"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Blush cheeks */}
        <circle cx="28" cy="52" r="4.5" fill="#FB7185" opacity="0.4" />
        <circle cx="72" cy="52" r="4.5" fill="#FB7185" opacity="0.4" />

        {/* --- COLLAR --- */}
        <path
          d="M 30 78 Q 50 86 70 78"
          fill="none"
          stroke="url(#collarGradient)"
          strokeWidth="6"
          strokeLinecap="round"
        />

        {/* Collar Bone Charm 🦴 */}
        <g transform="translate(43, 80)">
          {/* Bone middle */}
          <rect x="3" y="3" width="8" height="3" rx="1.5" fill="url(#boneGradient)" stroke="#D97706" strokeWidth="0.5" />
          {/* Bone left bumps */}
          <circle cx="3" cy="3" r="2" fill="url(#boneGradient)" stroke="#D97706" strokeWidth="0.5" />
          <circle cx="3" cy="6" r="2" fill="url(#boneGradient)" stroke="#D97706" strokeWidth="0.5" />
          {/* Bone right bumps */}
          <circle cx="11" cy="3" r="2" fill="url(#boneGradient)" stroke="#D97706" strokeWidth="0.5" />
          <circle cx="11" cy="6" r="2" fill="url(#boneGradient)" stroke="#D97706" strokeWidth="0.5" />
        </g>
      </svg>
    </div>
  );
}
