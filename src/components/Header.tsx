import React from 'react';
import { Sparkles, Heart, Feather, BookOpen, Code2 } from 'lucide-react';

interface HeaderProps {
  creditsRemaining: number | null;
  maxCredits?: number;
}

export const Header: React.FC<HeaderProps> = ({
  creditsRemaining,
  maxCredits = 25,
}) => {
  const maxLimit = maxCredits || 25;
  const credits = creditsRemaining !== null ? creditsRemaining : maxLimit;
  const progressPercent = Math.min(100, Math.max(0, (credits / maxLimit) * 100));

  return (
    <header className="sticky top-0 z-40 flex flex-wrap items-center justify-between px-4 sm:px-8 py-3.5 border-b border-amber-500/20 bg-[#12080e]/90 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <div className="relative w-10 h-10 rounded-full ring-2 ring-amber-400/40 overflow-hidden shadow-lg shadow-amber-900/30 shrink-0 bg-neutral-900">
          <img
            src="/assets/ada-lovelace.jpg"
            alt="Ada Lovelace"
            className="w-full h-full object-cover object-top"
          />
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-1 ring-black" />
        </div>
        <div>
          <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2 font-serif">
            Ada Loves Code
            <span className="text-amber-300 text-[10px] font-mono font-semibold tracking-wider border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 rounded-full not-italic">
              POETICAL SCIENCE
            </span>
          </h1>
          <p className="text-[10px] text-amber-200/60 uppercase tracking-widest font-mono hidden xs:block">
            Open Source Codebase &amp; Repository Compliment Generator
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-5">
        {/* Daily Quota Counter */}
        <div className="bg-[#1b0d16] px-3.5 py-1.5 rounded-full border border-amber-500/20 flex items-center gap-2.5 shadow-inner">
          <span className="text-[10px] text-amber-200/70 font-bold uppercase hidden sm:inline font-mono">
            Daily Tributes:
          </span>
          <div className="flex items-center gap-2">
            <div className="w-16 sm:w-24 h-2 bg-neutral-800 rounded-full overflow-hidden">
              <div
                className="h-full transition-all duration-300 bg-gradient-to-r from-amber-400 via-rose-400 to-amber-200"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span
              className={`text-xs font-mono font-bold ${
                creditsRemaining === 0 ? 'text-red-400' : 'text-amber-300'
              }`}
            >
              {creditsRemaining !== null ? `${creditsRemaining}/${maxLimit}` : `--/${maxLimit}`}
            </span>
          </div>
        </div>

        {/* 1843 Visionary Badge */}
        <div className="hidden xs:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-[10px] font-mono text-amber-300">
          <Feather className="w-3 h-3 text-amber-400" />
          <span>Note G • 1843</span>
        </div>
      </div>
    </header>
  );
};


