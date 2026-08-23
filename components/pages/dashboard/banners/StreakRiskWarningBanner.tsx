'use client';

import React, { useState, useEffect } from 'react';
import { Activity, Terminal, X, Radio, AlertOctagon } from 'lucide-react';
import { StreakWarningEvent } from '@/lib/types';

interface StreakRiskWarningBannerProps {
  event: StreakWarningEvent | null;
  currentStreak?: number;
  onLogWorkoutClick: () => void;
}

function calculateTimeLeft(): string {
  const now = new Date();
  const midnight = new Date();
  midnight.setHours(23, 59, 59, 999);

  const diffMs = midnight.getTime() - now.getTime();
  if (diffMs <= 0) {
    return '00:00:00';
  }

  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

  const pad = (num: number) => String(num).padStart(2, '0');
  return `${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`;
}

export default function StreakRiskWarningBanner({
  event,
  currentStreak,
  onLogWorkoutClick,
}: StreakRiskWarningBannerProps) {
  const [timeLeft, setTimeLeft] = useState<string>(calculateTimeLeft);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  useEffect(() => {
    if (!event) return;

    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, [event]);

  if (!event || !event.is_at_risk || (currentStreak !== undefined && currentStreak <= 0)) return null;

  // Collapsed State: Minimal Holographic Ping
  if (isCollapsed) {
    return (
      <div className="w-full flex justify-end">
        <button
          onClick={() => setIsCollapsed(false)}
          className="relative group flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#050B14]/80 backdrop-blur-xl border border-cyan-500/50 hover:border-fuchsia-500/80 transition-colors shadow-[0_0_15px_rgba(6,182,212,0.2)]"
        >
          <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span className="font-mono text-[10px] sm:text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-400 uppercase tracking-wider">
            Signal Dropping ({timeLeft})
          </span>
        </button>
      </div>
    );
  }

  return (
    <aside aria-label="Streak warning hologram" className="relative w-full isolate flex flex-col items-center mt-2">

      {/* 1. HOLOGRAPHIC EMITTER BASE (Compressed) */}
      <div className="absolute -bottom-2 w-1/2 max-w-md h-4 bg-fuchsia-600/30 blur-[20px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 w-1/3 max-w-xs h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_10px_#22d3ee] pointer-events-none" />

      {/* 2. MAIN PROJECTION SCREEN (Slim Profile) */}
      <div className="relative w-full bg-[#030712]/70 backdrop-blur-2xl border border-white/10 rounded-xl overflow-hidden shadow-[0_4px_25px_rgba(192,38,211,0.1)] p-3 sm:p-4">

        {/* Hologram Scanlines & Overlays */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.04] bg-[linear-gradient(transparent_50%,#ffffff_50%)] bg-[length:100%_4px]" />
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-cyan-500/5 via-transparent to-fuchsia-500/10" />

        {/* Floating Top-Left Tag & Top-Right Close Button */}
        <div className="absolute top-2 left-3 flex items-center gap-1.5 text-cyan-400/80 font-mono text-[9px] uppercase tracking-[0.2em]">
          <Activity className="w-3 h-3 text-fuchsia-500 animate-pulse" />
          <span>Sys.Override</span>
        </div>
        <button
          onClick={() => setIsCollapsed(true)}
          className="absolute top-2 right-2 text-cyan-600 hover:text-fuchsia-400 transition-colors p-1 z-20 cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        {/* Core Content Layer */}
        <div className="relative z-10 flex flex-col items-center text-center gap-2 pt-3">

          {/* Title & Timer (Inlined to save vertical space) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 mt-1">
            <h2 className="text-sm sm:text-base font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-cyan-200 to-fuchsia-400 uppercase tracking-wide">
              {currentStreak !== undefined && currentStreak > 0
                ? `Neural Link Fading: ${currentStreak} Days`
                : 'Neural Link Fading'}
            </h2>
            <div className="px-3 py-0.5 rounded-full border border-cyan-500/30 bg-[#050B14]/80 text-cyan-300 font-mono text-[10px] sm:text-xs font-bold tracking-widest shadow-[0_0_10px_rgba(6,182,212,0.2)]">
              T-MINUS {timeLeft}
            </div>
          </div>

          {/* Warning Text & Rest Tokens (Inlined) */}
          <div className="text-[10px] sm:text-xs text-cyan-100/60 font-light max-w-2xl mx-auto font-mono leading-tight">
            <span>{event.message || "> NETWORK INTEGRITY COMPROMISED. UPLOAD WORKOUT DATA MODULE."}</span>
            {event.rest_tokens_left === 0 && (
              <span className="inline-flex items-center gap-1 text-fuchsia-400 font-bold ml-0 sm:ml-2 mt-1 sm:mt-0 bg-fuchsia-500/10 px-1.5 py-0.5 rounded border border-fuchsia-500/20">
                <AlertOctagon className="w-3 h-3" /> OVERRIDE DENIED: 0 REST TOKENS
              </span>
            )}
          </div>

          {/* Slim Action Button */}
          <div className="w-full max-w-sm mt-1">
            <button
              onClick={onLogWorkoutClick}
              className="group relative w-full overflow-hidden rounded-lg p-[1px] cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-cyan-400 opacity-60 group-hover:opacity-100 group-hover:animate-[spin_2s_linear_infinite]" style={{ backgroundSize: '200% 100%' }} />

              <div className="relative flex items-center justify-center gap-2 w-full bg-[#030712] hover:bg-gradient-to-r hover:from-cyan-950/40 hover:to-fuchsia-950/40 px-4 py-2 rounded-lg transition-colors duration-300">
                <Terminal className="w-4 h-4 text-cyan-400 group-hover:text-fuchsia-400" />
                <span className="font-mono font-bold text-cyan-400 group-hover:text-white uppercase tracking-[0.15em] text-xs transition-colors">
                  Initialize_Workout.exe
                </span>
              </div>
            </button>
          </div>

        </div>
      </div>
    </aside>
  );
}