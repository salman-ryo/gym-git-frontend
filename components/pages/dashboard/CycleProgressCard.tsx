'use client';

import React from 'react';
import { Stats, User } from '@/lib/types';
import { AlertTriangle, Zap, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useInView, AnimatedScoreCounter } from './power-level/power-chart-utils';

interface CycleProgressCardProps {
  stats: Stats;
  user: User;
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

export default function CycleProgressCard({ stats, user, className }: CycleProgressCardProps) {
  const { ref: containerRef, inView } = useInView(0.15);
  const cycle = stats.cycleInfo;

  if (!cycle) return null;

  const completed = cycle.workouts_completed_in_cycle;
  const target = cycle.workouts_target_in_cycle;
  const accuracy = stats.accuracyScore ?? 0;

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
          <div className="bg-zinc-950/80 border border-zinc-800 p-3 sm:p-4 rounded-xl flex flex-wrap items-center justify-between gap-3 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-teal-400/80" />

            <div className="flex flex-wrap items-center justify-between gap-3 pl-2 w-full">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-zinc-900 rounded-lg">
                  <Activity className="w-4 h-4 text-teal-300" />
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest block mb-0.5">
                    Cycle Range
                  </span>
                  <span className="text-sm font-bold text-zinc-200 tracking-wider">
                    {formatDate(cycle.cycle_start_date)} — {formatDate(cycle.cycle_end_date)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-teal-400/10 border border-neon-cyan/20 px-3 py-1.5 rounded-lg">
                <div className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-pulse" />
                <span className="text-[11px] font-bold text-neon-cyan uppercase tracking-widest">
                  {cycle.days_remaining_in_cycle} {cycle.days_remaining_in_cycle === 1 ? 'Day' : 'Days'} Remaining
                </span>
              </div>
            </div>
          </div>

          {/* INNER GRID: Workouts and Tokens side-by-side on tablet+ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 flex-1">

            {/* PANEL 2: Workout Progress */}
            <div className="bg-zinc-950/80 border border-zinc-800 p-3 sm:p-4 rounded-xl flex flex-col justify-center">
              <div className="flex justify-between items-end mb-3">
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                  Workout Progress
                </span>
                <span className="text-xs font-medium text-zinc-400">
                  <span className="text-neon-cyan font-bold text-sm">
                    <AnimatedScoreCounter value={completed} inView={inView} duration={800} />
                  </span> / {target}
                </span>
              </div>

              {/* Clean Segmented Progress Bar */}
              <div className="flex items-center gap-1.5 w-full h-5">
                {Array.from({ length: Math.max(1, target) }).map((_, idx) => {
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
            <div className="bg-zinc-950/80 border border-zinc-800 p-3 sm:p-4 rounded-xl flex flex-col justify-center">
              <div className="flex justify-between items-end mb-3">
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                  Rest Tokens
                </span>
                <span className="text-[11px] font-medium text-zinc-400">
                  <AnimatedScoreCounter value={cycle.rest_tokens_remaining} inView={inView} duration={800} /> Available
                </span>
              </div>

              {/* Rounded Hardware Battery Pods */}
              <div className="flex items-center gap-2.5 h-6">
                {Array.from({ length: cycle.rest_tokens_total }).map((_, idx) => {
                  const isActive = inView && idx < cycle.rest_tokens_remaining;
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
                        <Zap className="w-3.5 h-3.5 text-neon-cyan drop-shadow-[0_0_5px_#22d3ee]" />
                      ) : (
                        <Zap className="w-3 h-3 text-zinc-600" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: 4 Spans - Diagnostics Accuracy Radar */}
        <div className="lg:col-span-4 bg-zinc-950/80 border border-zinc-800 min-h-[140px] rounded-xl relative flex flex-col items-center justify-center p-4">

          <span className="absolute top-4 inset-x-0 text-center text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
            Diagnostics
          </span>

          <div className="relative flex items-center justify-center w-24 h-24 mt-4">
            <svg className="w-full h-full rotate-[-90deg]">
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
            <div className="absolute flex flex-col items-center justify-center bg-[#05080c] w-14 h-14 rounded-full border border-zinc-800 shadow-inner">
              <span className="text-lg font-black text-white tracking-tighter leading-none mt-1">
                <AnimatedScoreCounter value={accuracy} inView={inView} duration={1000} />
                <span className="text-xs text-neon-cyan font-semibold ml-0.5">%</span>
              </span>
              <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-wider mt-1">
                Accuracy
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Queued Weekly Plan Banner */}
      {user.queuedWeeklyPlanId && (
        <div className="mt-2 sm:mt-3 bg-neon-purple/10 border border-neon-purple/20 p-3 rounded-xl flex items-start sm:items-center gap-3 relative overflow-hidden">
          <div className="p-1.5 bg-neon-purple/20 rounded-lg shrink-0 relative z-10">
            <AlertTriangle className="w-4 h-4 text-neon-purple" />
          </div>
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 w-full">
            <span className="text-[10px] font-bold text-neon-purple uppercase tracking-widest">
              Update:
            </span>
            <span className="text-[11px] text-zinc-300 font-medium tracking-wide">
              Your new plan: [ <span className="text-white font-bold">{user.queuedWeeklyPlanId}</span> ] will start from next week.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}