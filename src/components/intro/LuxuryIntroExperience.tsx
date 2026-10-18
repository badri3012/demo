import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

interface LuxuryIntroExperienceProps {
  onComplete: () => void;
  minDurationMs?: number;
}

export const LuxuryIntroExperience: React.FC<LuxuryIntroExperienceProps> = ({
  onComplete,
  minDurationMs = 2600,
}) => {
  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(15);

  useEffect(() => {
    // Smooth progress bar advancement
    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(progressTimer);
          return 100;
        }
        return prev + 18;
      });
    }, 280);

    // Fade out sequence
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
      setTimeout(onComplete, 650);
    }, minDurationMs);

    return () => {
      clearInterval(progressTimer);
      clearTimeout(fadeTimer);
    };
  }, [minDurationMs, onComplete]);

  const handleSkip = () => {
    setIsFadingOut(true);
    setTimeout(onComplete, 250);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-[#F7F5F0] transition-opacity duration-700 select-none ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{
        background: 'radial-gradient(circle at 50% 48%, #FFFEFC 0%, #F5F1E9 55%, #ECE6DA 100%)',
      }}
    >
      {/* Background Architectural Geometry Lines (Subtle & Restrained) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[720px] rounded-full border border-[#DDD8CF]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[980px] h-[980px] rounded-full border border-[#DDD8CF]/50" />
        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[1px] bg-gradient-to-b from-transparent via-[#A58A63]/30 to-transparent" />
      </div>

      {/* Main Centered Composition */}
      <div className="relative z-10 max-w-xl mx-auto px-6 text-center space-y-6">
        {/* Monogram / Brand Shield */}
        <div className="w-16 h-16 mx-auto rounded-2xl bg-[#252522] border border-[#A58A63]/50 shadow-2xl flex items-center justify-center transform transition-transform hover:scale-105">
          <span className="font-serif text-3xl font-bold text-[#FFFEFC] tracking-wider">
            F
          </span>
        </div>

        {/* Client Brand Typography */}
        <div className="space-y-1.5">
          <h1 className="font-serif text-5xl sm:text-6xl font-bold tracking-tight text-[#252522]">
            FLEXISPACE
          </h1>
          <p className="text-xs sm:text-sm tracking-[0.3em] uppercase text-[#6F513A] font-semibold">
            An Interactive Furniture Experience
          </p>
        </div>

        {/* Animated Bronze Divider */}
        <div className="flex items-center justify-center space-x-3 py-1">
          <div className="h-[1.5px] w-64 sm:w-80 bg-gradient-to-r from-transparent via-[#A58A63] to-transparent" />
        </div>

        {/* Presentation Credit with Mandatory Text */}
        <div className="space-y-2">
          {/* Mandatory Exact Branding String */}
          <div className="inline-flex items-center space-x-2.5 px-6 py-2.5 rounded-full bg-[#FFFEFC] border border-[#DDD8CF] shadow-md">
            <Sparkles className="w-4 h-4 text-[#A58A63]" />
            <span className="text-sm sm:text-base font-bold tracking-wide text-[#252522]">
              Demo provided by BlazeByte Studio
            </span>
          </div>

          <p className="text-[11px] sm:text-xs text-[#252522]/65 tracking-widest uppercase font-semibold">
            Bengaluru • Coimbatore • Digital Commerce Architecture
          </p>
        </div>

        {/* Polished Architectural Progress Micro-Bar */}
        <div className="pt-4 max-w-xs mx-auto space-y-1.5">
          <div className="h-[2.5px] w-full bg-[#DDD8CF]/70 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#A58A63] rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-[10px] text-[#252522]/50 tracking-wider uppercase font-medium block">
            Initializing Showroom Viewport
          </span>
        </div>
      </div>

      {/* Subtle Skip Action Button */}
      <div className="absolute bottom-8 right-8 z-20">
        <button
          onClick={handleSkip}
          className="text-xs font-semibold text-[#252522]/70 hover:text-[#252522] px-3.5 py-1.5 rounded-lg border border-[#DDD8CF] bg-white/80 backdrop-blur-sm transition flex items-center space-x-1.5 shadow-sm"
        >
          <span>Enter Experience</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
