'use client';

import React, { useState, useEffect } from 'react';
import { Flame, Clock, Dumbbell, AlertTriangle, ShieldCheck } from 'lucide-react';
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

    // Tick every second
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, [event]);

  // When streak is already 0, do not display warning banner
  if (!event || !event.is_at_risk || (currentStreak !== undefined && currentStreak <= 0)) return null;

  // Collapsed notification pill view
  if (isCollapsed) {
    return (
      <div className="w-full flex items-center justify-end">
        <button
          onClick={() => setIsCollapsed(false)}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-bold transition-all shadow-[0_0_15px_rgba(245,158,11,0.2)] cursor-pointer"
        >
          <AlertTriangle className="w-3.5 h-3.5 animate-pulse text-amber-400" />
          <span>Streak Decay Warning ({timeLeft})</span>
        </button>
      </div>
    );
  }

  return (
    <aside aria-label="Streak warning" className="w-full relative overflow-hidden rounded-2xl border border-amber-500/40 bg-gradient-to-r from-amber-950/80 via-orange-950/60 to-amber-950/80 backdrop-blur-xl p-5 md:p-6 shadow-[0_0_35px_rgba(245,158,11,0.2)]">
      {/* Background Amber Glow */}
      <div className="absolute -top-20 -left-20 w-40 h-40 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-orange-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Left Side: Status & Warning Message */}
        <div className="flex items-start gap-4">
          <div className="relative p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.3)] flex-shrink-0 animate-bounce">
            <Flame className="w-7 h-7 fill-amber-500/30" />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-xs font-black tracking-widest px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 uppercase animate-pulse">
                STREAK AT RISK
              </span>
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-200 bg-amber-950/80 px-2.5 py-0.5 rounded-md border border-amber-800/60">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>{timeLeft} UNTIL MIDNIGHT</span>
              </div>
            </div>

            <h3 className="text-base sm:text-lg font-black text-amber-100 tracking-wide">
              {currentStreak !== undefined && currentStreak > 0
                ? `Your ${currentStreak}-Day Streak Decays at Midnight!`
                : 'Your Streak is at Risk of Decaying!'}
            </h3>
            <p className="text-xs sm:text-sm text-amber-200/80 max-w-2xl mt-0.5">
              {event.message ||
                'No workout logged yet today and 0 Rest Tokens remaining. Log a session before midnight to keep your fire burning!'}
            </p>

            {event.rest_tokens_left === 0 && (
              <div className="flex items-center gap-1.5 text-[11px] text-amber-300/90 font-medium mt-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Rest Tokens: 0 left &bull; Workout required tonight</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Action Buttons */}
        <div className="w-full md:w-auto flex flex-row items-center gap-3 self-stretch md:self-center">
          <button
            onClick={onLogWorkoutClick}
            className="flex-1 md:flex-initial px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 hover:from-amber-300 hover:to-orange-400 text-zinc-950 transition-all shadow-[0_0_25px_rgba(245,158,11,0.4)] hover:shadow-[0_0_35px_rgba(245,158,11,0.6)] flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-100"
          >
            <Dumbbell className="w-4 h-4" />
            <span>Log Workout Now</span>
          </button>
          <button
            onClick={() => setIsCollapsed(true)}
            className="px-3 py-2.5 rounded-xl text-xs font-bold text-amber-400/80 hover:text-amber-200 hover:bg-amber-900/30 transition-all cursor-pointer"
            title="Dismiss warning"
          >
            Dismiss
          </button>
        </div>
      </div>

      {/* Subtle Bottom Accent Indicator */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-60" />
    </aside>
  );
}
