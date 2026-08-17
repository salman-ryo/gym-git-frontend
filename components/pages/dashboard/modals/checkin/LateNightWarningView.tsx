'use client';

import React from 'react';
import { AlertTriangle, Check, Moon, Clock } from 'lucide-react';
import { getMinutesUntilMidnight } from '@/lib/checkin-snooze';

export interface LateNightWarningViewProps {
  onLogWorkoutNow: () => void;
  onLogRestDay: () => void;
  onPostponeAnyway: () => void;
}

/**
 * Warning view shown when user attempts to postpone check-in after 11:30 PM,
 * alerting that the reminder will arrive after midnight and break streak.
 */
export function LateNightWarningView({
  onLogWorkoutNow,
  onLogRestDay,
  onPostponeAnyway,
}: LateNightWarningViewProps) {
  const minutesLeft = getMinutesUntilMidnight();

  return (
    <div className="text-center py-4 relative z-10 animate-in fade-in zoom-in-95 duration-200">
      {/* Warning Icon with Pulse */}
      <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shadow-[0_0_25px_rgba(245,158,11,0.25)] animate-pulse">
        <AlertTriangle className="w-7 h-7 text-amber-400" />
      </div>

      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-black uppercase tracking-widest mb-2">
        <span>Midnight Streak Risk</span>
      </div>

      <h2 className="text-xl font-black text-zinc-100 tracking-tight mb-2">
        Streak May Decay at Midnight!
      </h2>

      <p className="text-zinc-350 text-xs font-medium leading-relaxed mb-6 max-w-sm mx-auto">
        It is past <span className="text-amber-400 font-bold">11:30 PM</span> ({minutesLeft} minutes until midnight). If you postpone now, your next reminder will arrive <span className="text-rose-400 font-bold">after midnight</span>, causing you to miss today&apos;s check-in and potentially break your streak!
      </p>

      {/* Actions */}
      <div className="flex flex-col gap-2.5">
        <button
          type="button"
          onClick={onLogWorkoutNow}
          className="w-full bg-gradient-to-r from-neon-green via-[#00e077] to-teal-400 text-[#060a0e] font-extrabold py-2.5 px-4 rounded-2xl text-sm flex items-center justify-center gap-2 transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.02] active:scale-95 shadow-lg shadow-emerald-500/15 cursor-pointer"
        >
          <Check className="w-4 h-4 stroke-[3.5]" />
          <span>Log Workout Now</span>
        </button>

        <button
          type="button"
          onClick={onLogRestDay}
          className="w-full bg-zinc-900/80 hover:bg-sky-500/15 hover:text-sky-300 text-zinc-300 font-bold py-2.5 px-4 rounded-2xl text-xs flex items-center justify-center gap-2 transition-all duration-200 border border-zinc-800 hover:border-sky-500/40 cursor-pointer"
        >
          <Moon className="w-3.5 h-3.5 text-sky-400" />
          <span>Log Rest Day (Protect Streak)</span>
        </button>

        <button
          type="button"
          onClick={onPostponeAnyway}
          className="w-full py-2 text-zinc-500 hover:text-zinc-400 text-[11px] font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer mt-1"
        >
          <Clock className="w-3 h-3" />
          <span>Postpone Anyway (Snooze 30m)</span>
        </button>
      </div>
    </div>
  );
}

export default LateNightWarningView;
