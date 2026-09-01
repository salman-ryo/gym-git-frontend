'use client';

import React, { memo, useMemo } from 'react';
import { Stats, User } from '@/lib/types';
import { AlertTriangle, Zap, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useInView, AnimatedScoreCounter } from './power-level/power-chart-utils';

interface CycleProgressCardProps {
  stats: Stats;
  user: User;
  queuedWeeklyPlanId?: string | null;
  className?: string;
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const monthIdx = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  return `${monthNames[monthIdx]} ${day}`;
}

function CycleProgressCard({ stats, user, queuedWeeklyPlanId, className }: CycleProgressCardProps) {
  const { ref: containerRef, inView } = useInView(0.15);
  const cycle = stats.cycleInfo;

  const completed = typeof cycle?.workouts_completed_in_cycle === 'number' && !isNaN(cycle.workouts_completed_in_cycle)
    ? cycle.workouts_completed_in_cycle
    : 0;
  const target = typeof cycle?.workouts_target_in_cycle === 'number' && !isNaN(cycle.workouts_target_in_cycle)
    ? cycle.workouts_target_in_cycle
    : 0;
  const accuracy = typeof stats.accuracyScore === 'number' && !isNaN(stats.accuracyScore)
    ? stats.accuracyScore
    : 0;
  const restTokensTotal = typeof cycle?.rest_tokens_total === 'number' && !isNaN(cycle.rest_tokens_total)
    ? cycle.rest_tokens_total
    : 0;
  const restTokensRemaining = typeof cycle?.rest_tokens_remaining === 'number' && !isNaN(cycle.rest_tokens_remaining)
    ? cycle.rest_tokens_remaining
    : 0;

  const workoutSegments = useMemo(
    () => Array.from({ length: Math.max(1, target) }),
    [target]
  );

  const restTokenSegments = useMemo(
    () => Array.from({ length: restTokensTotal }),
    [restTokensTotal]
  );

  if (!cycle) return null;

  const radius = 34;
  const strokeWidth = 6;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = inView
    ? circumference - (accuracy / 100) * circumference
    : circumference;

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>

      {/* Subtle Top Ambient Glow */}
      <div className="absolute top-0 inset-x-1/4 h-[1px] bg-gradient-to-r from-transparent via-neon-cyan/30 to-transparent blur-[2px]" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 sm:gap-3 relative z-10">

        {/* LEFT COLUMN: 8 Spans - Contains Cycle Info, Workouts, and Rest */}
        <div className="lg:col-span-8 flex flex-col gap-2 sm:gap-3">

          {/* PANEL 1: Cycle Readout */}
          <div className="bg-zinc-950/80 border border-zinc-800 p-2.5 sm:p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-teal-400/80" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 pl-1.5 sm:pl-2 w-full">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <div className="p-1.5 bg-zinc-900 rounded-lg shrink-0">
                  <Activity className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-teal-300" />
                </div>
                <div className="min-w-0">
                  <span className="text-[9px] sm:text-[10px] text-zinc-500 font-bold uppercase tracking-widest block mb-0.5">
                    Cycle Range
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-zinc-200 tracking-wider truncate block">
                    {formatDate(cycle.cycle_start_date)} — {formatDate(cycle.cycle_end_date)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2 bg-teal-400/10 border border-neon-cyan/20 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg self-start sm:self-auto shrink-0">
                <div className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-pulse" />
                <span className="text-[9.5px] sm:text-[11px] font-bold text-neon-cyan uppercase tracking-widest">
                  {cycle.days_remaining_in_cycle} {cycle.days_remaining_in_cycle === 1 ? 'Day' : 'Days'} Left
                </span>
              </div>
            </div>
          </div>

          {/* INNER GRID: Workouts and Tokens side-by-side on tablet+ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 flex-1">

            {/* PANEL 2: Workout Progress */}
            <div className="bg-zinc-950/80 border border-zinc-800 p-2.5 sm:p-4 rounded-xl flex flex-col justify-center">
              <div className="flex justify-between items-end mb-2 sm:mb-3">
                <span className="text-[9.5px] sm:text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                  Workout Progress
                </span>
                <span className="text-xs font-medium text-zinc-400">
                  <span className="text-neon-cyan font-bold text-sm">
                    <AnimatedScoreCounter value={completed} inView={inView} duration={800} />
                  </span> / {target}
                </span>
              </div>

              {/* Clean Segmented Progress Bar */}
              <div className="flex items-center gap-1 sm:gap-1.5 w-full h-4 sm:h-5">
                {workoutSegments.map((_, idx) => {
                  const isActive = inView && idx < completed;
                  return (
                    <div
                      key={idx}
                      style={{
                        transitionDelay: `${idx * 70}ms`,
                      }}
                      className={`flex-1 h-full rounded-md transition-all duration-500 ${isActive
                        ? 'bg-gradient-to-b from-green-600 to-teal-400 shadow-[0_0_12px_rgba(34,211,238,0.3)] opacity-100 scale-100'
                        : 'bg-zinc-800/50 opacity-60'
                        }`}
                    />
                  );
                })}
              </div>
            </div>

            {/* PANEL 3: Rest Tokens */}
            <div className="bg-zinc-950/80 border border-zinc-800 p-2.5 sm:p-4 rounded-xl flex flex-col justify-center">
              <div className="flex justify-between items-end mb-2 sm:mb-3">
                <span className="text-[9.5px] sm:text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                  Rest Tokens
                </span>
                <span className="text-[10px] sm:text-[11px] font-medium text-zinc-400">
                  <AnimatedScoreCounter value={restTokensRemaining} inView={inView} duration={800} /> Available
                </span>
              </div>

              {/* Rounded Hardware Battery Pods */}
              <div className="flex items-center gap-1.5 sm:gap-2.5 h-5 sm:h-6">
                {restTokenSegments.map((_, idx) => {
                  const isActive = inView && idx < restTokensRemaining;
                  return (
                    <div
                      key={idx}
                      style={{
                        transitionDelay: `${idx * 70}ms`,
                      }}
                      className={`relative flex-1 h-full rounded-md border transition-all duration-500 flex items-center justify-center overflow-hidden ${isActive
                        ? 'border-neon-cyan bg-teal-400/10 shadow-[0_0_10px_rgba(34,211,238,0.15)]'
                        : 'border-zinc-800 bg-zinc-900/40 opacity-50'
                        }`}
                    >
                      {isActive ? (
                        <Zap className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-neon-cyan drop-shadow-[0_0_5px_#22d3ee]" />
                      ) : (
                        <Zap className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-zinc-600" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: 4 Spans - Diagnostics Accuracy Radar */}
        <div className="lg:col-span-4 bg-zinc-950/80 border border-zinc-800 min-h-[120px] sm:min-h-[140px] rounded-xl relative flex flex-col items-center justify-center p-3 sm:p-4">

          <span className="absolute top-2.5 sm:top-4 inset-x-0 text-center text-[9.5px] sm:text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
            Diagnostics
          </span>

          <div className="relative flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 mt-4 sm:mt-4">
            <svg className="w-full h-full rotate-[-90deg]" viewBox="0 0 96 96">
              {/* Outer faint dashed ring */}
              <circle
                cx="48"
                cy="48"
                r={radius + 6}
                className="stroke-zinc-800/80 fill-none"
                strokeWidth="1"
                strokeDasharray="4 4"
              />

              {/* Thick Background Track */}
              <circle
                cx="48"
                cy="48"
                r={radius}
                className="stroke-zinc-900 fill-none"
                strokeWidth={strokeWidth}
              />

              {/* Active Cyan Neon Track */}
              <circle
                cx="48"
                cy="48"
                r={radius}
                className="stroke-neon-cyan fill-none transition-all duration-1000 ease-out"
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                style={{
                  filter: 'drop-shadow(0 0 4px rgba(34,211,238,0.4))',
                }}
              />
            </svg>

            {/* Center Readout */}
            <div className="absolute flex flex-col items-center justify-center bg-[#05080c] w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-zinc-800 shadow-inner">
              <span className="text-base sm:text-lg font-black text-white tracking-tighter leading-none mt-0.5 sm:mt-1">
                <AnimatedScoreCounter value={accuracy} inView={inView} duration={1000} />
                <span className="text-[10px] sm:text-xs text-neon-cyan font-semibold ml-0.5">%</span>
              </span>
              <span className="text-[7px] sm:text-[8px] font-bold text-zinc-500 uppercase tracking-wider mt-0.5 sm:mt-1">
                Accuracy
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Queued Weekly Plan Banner */}
      {queuedWeeklyPlanId && (
        <div className="mt-2 sm:mt-3 bg-neon-purple/10 border border-neon-purple/20 p-2.5 sm:p-3 rounded-xl flex items-start sm:items-center gap-2.5 sm:gap-3 relative overflow-hidden">
          <div className="p-1.5 bg-neon-purple/20 rounded-lg shrink-0 relative z-10">
            <AlertTriangle className="w-4 h-4 text-neon-purple" />
          </div>
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 w-full min-w-0">
            <span className="text-[10px] font-bold text-neon-purple uppercase tracking-widest shrink-0">
              Update:
            </span>
            <span className="text-[11px] text-zinc-300 font-medium tracking-wide break-words min-w-0">
              Your new plan: [ <span className="text-white font-bold">{queuedWeeklyPlanId}</span> ] will start from next week.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(CycleProgressCard);