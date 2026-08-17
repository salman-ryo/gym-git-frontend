'use client';

import React from 'react';
import Image from 'next/image';
import { Check, Sparkles, Moon, Clock, AlertTriangle } from 'lucide-react';
import { QuestionAnimeMascot } from '@/assets/anime';

export interface CheckInPromptStepProps {
  formattedDate: string;
  questionMascot: QuestionAnimeMascot;
  isLateNightRisk: boolean;
  onTriggerYes: () => void;
  onTriggerNo: () => void;
  onTriggerLater: () => void;
}

/**
 * Step 1 Greeting & Interaction:
 * Displays anime mascot with glowing aura, formatted date, and Yes/Rest/Snooze choices.
 */
export function CheckInPromptStep({
  formattedDate,
  questionMascot,
  isLateNightRisk,
  onTriggerYes,
  onTriggerNo,
  onTriggerLater,
}: CheckInPromptStepProps) {
  return (
    <div className="text-center py-4 relative z-10">
      {/* Mascot Asking with anime bounce and interactive aura */}
      <div className="relative w-24 h-24 mx-auto mb-3 group">
        <div
          className="absolute inset-0 rounded-full blur-xl transition-all duration-300 group-hover:scale-125 opacity-70"
          style={{ background: questionMascot.glowColor }}
        />
        <Image
          src={questionMascot.image}
          alt={questionMascot.name}
          width={96}
          height={96}
          unoptimized
          className="w-full h-full object-contain relative z-10 transition-transform duration-300 group-hover:scale-110 drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]"
        />
        <span className="absolute -top-1 -right-1 text-2xl font-black text-neon-green drop-shadow-[0_0_8px_rgba(0,255,136,0.6)] animate-bounce select-none z-20">
          ?
        </span>
      </div>

      <div className="flex items-center justify-center gap-1.5 text-base text-emerald-400 font-semibold mb-2">
        <Image
          src="/images/icons/today.png"
          alt="Today"
          width={100}
          height={100}
          unoptimized
          className="size-5"
        />
        <span>{formattedDate}</span>
      </div>

      <h2 className="text-2xl font-black text-zinc-100 tracking-tight mb-1.5">
        Did you hit the gym today?
      </h2>
      <p className="text-zinc-400 text-xs italic mb-4 max-w-xs mx-auto">
        &ldquo;{questionMascot.questionQuote}&rdquo;
      </p>

      {/* Late Night Impending Midnight Banner */}
      {isLateNightRisk && (
        <div className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-400 text-[11px] font-bold mb-3.5 animate-pulse max-w-xs mx-auto">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          <span>Past 11:30 PM — Midnight deadline approaching!</span>
        </div>
      )}

      {/* Action Buttons with Anime Hype Triggers */}
      <div className="grid grid-cols-2 gap-3.5">
        <button
          type="button"
          onClick={onTriggerYes}
          className="w-full bg-gradient-to-r from-neon-green via-[#00e077] to-teal-400 text-[#060a0e] font-extrabold py-2.5 px-4 rounded-2xl text-base flex items-center justify-center gap-2 transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.03] active:scale-95 shadow-lg shadow-emerald-500/10 hover:shadow-[0_0_25px_rgba(0,255,136,0.55)] cursor-pointer group relative overflow-hidden"
        >
          {/* Highlight shimmer */}
          <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          <Check className="w-5 h-5 stroke-[3.5] transition-transform duration-200 group-hover:scale-125 group-hover:rotate-6" />
          <span className="tracking-wide">Yes!</span>
          <Sparkles className="w-4 h-4 text-[#060a0e] opacity-80 animate-pulse" />
        </button>

        <button
          type="button"
          onClick={onTriggerNo}
          className="w-full bg-zinc-950/50 hover:bg-sky-500/10 hover:text-sky-300 text-zinc-450 font-bold py-2.5 px-4 rounded-2xl text-base flex items-center justify-center gap-2 transition-all duration-200 border border-zinc-850 hover:border-sky-500/40 hover:-translate-y-0.5 hover:scale-[1.03] active:scale-95 hover:shadow-[0_0_20px_rgba(56,189,248,0.25)] cursor-pointer group"
        >
          <Moon className="w-4 h-4 text-zinc-450 transition-transform duration-200 group-hover:scale-110 group-hover:-rotate-12 group-hover:text-sky-300" />
          <span>Rest Day</span>
        </button>
      </div>

      {/* Remind Me Later Snooze Button */}
      <button
        type="button"
        onClick={onTriggerLater}
        className="w-full mt-3 py-2.5 px-4 rounded-2xl bg-zinc-900/70 hover:bg-zinc-800/90 text-zinc-400 hover:text-zinc-200 text-xs font-bold transition-all duration-200 border border-zinc-800/80 hover:border-zinc-700 flex items-center justify-center gap-2 cursor-pointer shadow-sm group"
      >
        <Clock className="w-3.5 h-3.5 text-zinc-400 group-hover:text-amber-400 transition-colors" />
        <span>Remind Me Later (30m)</span>
      </button>
    </div>
  );
}

export default CheckInPromptStep;
