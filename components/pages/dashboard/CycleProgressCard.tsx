'use client';

import React from 'react';
import { Stats, User } from '@/lib/types';
import { Calendar, Shield, Target, AlertTriangle } from 'lucide-react';

interface CycleProgressCardProps {
  stats: Stats;
  user: User;
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthIdx = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  return `${monthNames[monthIdx]} ${day}`;
}

export default function CycleProgressCard({ stats, user }: CycleProgressCardProps) {
  console.log("🚀 ~ CycleProgressCard ~ user:", user)
  console.log("🚀 ~ CycleProgressCard ~ stats:", stats)
  const cycle = stats.cycleInfo;

  // Render nothing if cycle info is missing (fallback to preserve dashboard integrity)
  if (!cycle) return null;

  const completed = cycle.workouts_completed_in_cycle;
  const target = cycle.workouts_target_in_cycle;
  const progressPct = target > 0 ? Math.min(100, Math.round((completed / target) * 100)) : 0;

  const accuracy = stats.accuracyScore ?? 0;

  // SVG Circle parameters for the accuracy gauge
  const radius = 28;
  const strokeWidth = 5;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (accuracy / 100) * circumference;

  return (
    <div className="relative flex flex-col justify-between min-h-[220px] bg-zinc-950/80 border border-zinc-800/80 backdrop-blur-2xl rounded-2xl overflow-hidden group transition-all duration-300 hover:border-zinc-700/60 hover:shadow-[0_0_35px_rgba(34,211,238,0.12)]">
      {/* Cyan top ambient bar */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-neon-cyan/50 via-neon-cyan/25 to-transparent group-hover:from-neon-cyan/80 group-hover:via-neon-cyan/40" />

      {/* Cyber Corner Diamonds */}
      <div className="absolute -top-1.5 -left-1.5 w-3 h-3 rotate-45 z-20 rounded-sm bg-neon-cyan/60 shadow-[0_0_4px_rgba(34,211,238,0.4)]" />
      <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 rotate-45 z-20 rounded-sm bg-neon-cyan/60 shadow-[0_0_4px_rgba(34,211,238,0.4)]" />

      <div className="p-6 space-y-5">
        {/* Header: Cycle Range & Time Left */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-neon-cyan/10 border border-neon-cyan/25 flex items-center justify-center">
              <Calendar className="w-4 h-4 text-neon-cyan" />
            </div>
            <div>
              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block">
                Current Cycle
              </span>
              <span className="text-xs font-bold text-zinc-200">
                {formatDate(cycle.cycle_start_date)} - {formatDate(cycle.cycle_end_date)}
              </span>
            </div>
          </div>
          <div className="px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] font-black text-neon-cyan tracking-wider uppercase shadow-[0_0_10px_rgba(34,211,238,0.05)]">
            {cycle.days_remaining_in_cycle} {cycle.days_remaining_in_cycle === 1 ? 'day' : 'days'} left
          </div>
        </div>

        {/* Grid: Left column (Workout & Rest Tokens), Right column (Accuracy Gauge) */}
        <div className="grid grid-cols-3 gap-4 items-center">

          {/* Workouts & Rest Tokens (Spans 2 columns) */}
          <div className="col-span-2 space-y-4">
            {/* Workouts Completed */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-baseline">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                  Workouts Completed
                </span>
                <span className="text-sm font-black text-zinc-100">
                  {completed} <span className="text-zinc-500 font-bold text-xs">/ {target}</span>
                </span>
              </div>
              <div className="w-full bg-zinc-900/60 border border-zinc-800/80 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-neon-cyan to-[#00f3ff] h-full rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(34,211,238,0.25)]"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>

            {/* Rest Token Pods */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                Rest Tokens
              </span>
              <div className="flex items-center gap-2">
                {Array.from({ length: cycle.rest_tokens_total }).map((_, idx) => {
                  const isActive = idx < cycle.rest_tokens_remaining;
                  return (
                    <div
                      key={idx}
                      className={`relative flex items-center justify-center w-8 h-8 rounded-lg border transition-all duration-300 ${isActive
                        ? 'bg-neon-cyan/10 border-neon-cyan/40 shadow-[0_0_8px_rgba(34,211,238,0.15)] text-neon-cyan'
                        : 'bg-zinc-900/40 border-zinc-800/80 text-zinc-600'
                        }`}
                    >
                      <Shield className={`w-4 h-4 ${isActive ? 'fill-neon-cyan/10' : ''}`} />
                      {!isActive && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-5 h-[1.5px] rotate-45 bg-zinc-700/80" />
                        </div>
                      )}
                    </div>
                  );
                })}
                <span className="text-[11px] font-bold text-zinc-400 ml-1">
                  {cycle.rest_tokens_remaining} / {cycle.rest_tokens_total} Left
                </span>
              </div>
            </div>
          </div>

          {/* Split Accuracy Gauge (Spans 1 column) */}
          <div className="flex flex-col items-center justify-center">
            <div className="relative flex items-center justify-center w-20 h-20">
              <svg className="w-full h-full rotate-[-90deg]">
                {/* Background circle */}
                <circle
                  cx="40"
                  cy="40"
                  r={radius}
                  className="stroke-zinc-900 fill-none"
                  strokeWidth={strokeWidth}
                />
                {/* Foreground accuracy circle */}
                <circle
                  cx="40"
                  cy="40"
                  r={radius}
                  className="stroke-neon-cyan fill-none transition-all duration-500"
                  strokeWidth={strokeWidth}
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  style={{
                    filter: 'drop-shadow(0 0 4px rgba(34,211,238,0.4))',
                  }}
                />
              </svg>
              {/* Central Text */}
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-base font-black text-white tracking-tight leading-none">
                  {accuracy}%
                </span>
                <span className="text-[7.5px] font-black text-zinc-500 uppercase tracking-widest mt-0.5 leading-none">
                  Accuracy
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Queued Weekly Plan Banner */}
      {user.queuedWeeklyPlanId && (
        <div className="mt-auto bg-neon-purple/10 border-t border-neon-purple/30 px-5 py-2.5 flex items-center gap-2">
          <AlertTriangle className="w-3.5 h-3.5 text-neon-purple shrink-0 animate-pulse" />
          <span className="text-[10px] font-black text-zinc-300 uppercase tracking-wider text-left">
            New split plan queued:{' '}
            <span className="text-neon-purple font-black">{user.queuedWeeklyPlanId}</span> (activates next reset)
          </span>
        </div>
      )}
    </div>
  );
}
