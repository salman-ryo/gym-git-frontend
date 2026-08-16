'use client';

import React, { useState, useEffect } from 'react';
import { AlertTriangle, Clock, Play, Bell, ChevronDown, ChevronUp } from 'lucide-react';
import { StreakWarningEvent } from '@/lib/types';

interface StreakRiskWarningBannerProps {
  event: StreakWarningEvent | null;
  currentStreak?: number;
  onLogWorkoutClick: () => void;
}

export default function StreakRiskWarningBanner({
  event,
  currentStreak,
  onLogWorkoutClick,
}: StreakRiskWarningBannerProps) {
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  useEffect(() => {
    if (!event) return;

    const calculateTimeLeft = () => {
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
    };

    // Initial set
    setTimeLeft(calculateTimeLeft());

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
          type="button"
          onClick={() => setIsCollapsed(false)}
          aria-label="Expand Streak Warning Banner"
          title="Click to expand warning banner"
          className="group inline-flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-amber-500/10 hover:bg-amber-500/15 border border-amber-500/30 hover:border-amber-500/50 text-amber-400 backdrop-blur-md shadow-[0_0_20px_rgba(245,158,11,0.08)] hover:shadow-[0_0_25px_rgba(245,158,11,0.18)] transition-all duration-200 cursor-pointer"
        >
          <div className="relative flex items-center justify-center">
            <Bell className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform duration-200" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-amber-400 ring-2 ring-zinc-950 animate-ping" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-amber-400 ring-2 ring-zinc-950" />
          </div>

          <div className="flex items-center gap-1.5 text-xs font-bold">
            <span className="text-zinc-300">Streak At Risk:</span>
            <span className="font-mono text-amber-400 font-extrabold">{timeLeft}</span>
          </div>

          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
            <span>Expand</span>
            <ChevronDown className="w-3 h-3 text-amber-400 group-hover:translate-y-0.5 transition-transform" />
          </span>
        </button>
      </div>
    );
  }

  // Expanded banner view
  return (
    <div className="relative w-full bg-amber-500/10 border border-amber-500/25 rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-[0_0_20px_rgba(245,158,11,0.06)] overflow-hidden group transition-all duration-300 hover:border-amber-500/40 hover:shadow-[0_0_25px_rgba(245,158,11,0.12)] flex flex-col sm:flex-row items-center justify-between gap-4">
      {/* Background cyber orb */}
      <div className="absolute -top-12 -left-12 w-28 h-28 bg-amber-500/[0.04] rounded-full blur-2xl pointer-events-none" />
      
      {/* Highlight Top Alert Line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-amber-500/30 via-amber-400/10 to-transparent" />

      {/* Warning details */}
      <div className="flex items-start gap-3.5 text-center sm:text-left flex-col sm:flex-row pr-2 sm:pr-0">
        <div className="mx-auto sm:mx-0 w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center shrink-0">
          <AlertTriangle className="w-5 h-5 text-amber-400" />
        </div>
        <div>
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-amber-400">
              Streak Decay Imminent
            </h4>
            <span className="px-1.5 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-[8px] font-black text-amber-400 uppercase">
              At Risk
            </span>
          </div>
          <p className="text-xs text-zinc-350 font-medium mt-1 leading-normal max-w-md">
            Rest tokens are fully exhausted (0 remaining). You must log a workout before local midnight to maintain your current daily streak.
          </p>
        </div>
      </div>

      {/* Countdown, CTA Button, and Collapse Button */}
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto border-t sm:border-t-0 border-amber-500/10 pt-3 sm:pt-0 shrink-0">
        {/* Real-time Ticking Countdown */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-950/60 border border-zinc-850 font-semibold text-xs text-zinc-300">
          <Clock className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="font-mono text-amber-400 font-extrabold">{timeLeft}</span>
        </div>

        <button
          type="button"
          onClick={onLogWorkoutClick}
          className="w-full sm:w-auto bg-amber-400 hover:bg-amber-300 text-zinc-950 font-black py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 uppercase tracking-wider cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.2)] hover:shadow-[0_0_20px_rgba(245,158,11,0.4)]"
        >
          <span>Log Workout</span>
          <Play className="w-3.5 h-3.5 fill-zinc-950 stroke-none shrink-0" />
        </button>

        {/* Collapse Button */}
        <button
          type="button"
          onClick={() => setIsCollapsed(true)}
          title="Collapse to notification icon"
          aria-label="Collapse banner"
          className="w-full sm:w-auto p-2.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-amber-300 transition-all duration-150 flex items-center justify-center gap-1.5 text-xs font-semibold cursor-pointer"
        >
          <ChevronUp className="w-4 h-4" />
          <span className="sm:hidden">Collapse Banner</span>
        </button>
      </div>
    </div>
  );
}

