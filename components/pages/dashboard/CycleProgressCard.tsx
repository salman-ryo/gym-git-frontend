'use client';

import React from 'react';
import { Stats, User } from '@/lib/types';
import { AlertTriangle, Cpu, Zap, Activity } from 'lucide-react';

interface CycleProgressCardProps {
  stats: Stats;
  user: User;
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

export default function CycleProgressCard({ stats, user }: CycleProgressCardProps) {
  const cycle = stats.cycleInfo;

  if (!cycle) return null;

  const completed = cycle.workouts_completed_in_cycle;
  const target = cycle.workouts_target_in_cycle;
  const accuracy = stats.accuracyScore ?? 0;

  const radius = 34;
  const strokeWidth = 6;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (accuracy / 100) * circumference;

  return (
    <div className="relative w-full bg-[#05080c] border border-zinc-800 p-2 sm:p-3 rounded-xl font-mono transition-all hover:border-neon-cyan/40 hover:shadow-[0_0_30px_rgba(34,211,238,0.05)] overflow-hidden group">

      {/* CRT Scanline Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,1)_1px,transparent_1px)] bg-[size:100%_3px] z-50" />

      {/* Top Ambient Glow */}
      <div className="absolute top-0 inset-x-1/4 h-[1px] bg-gradient-to-r from-transparent via-neon-cyan/50 to-transparent blur-[2px]" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 sm:gap-3 relative z-10">

        {/* LEFT COLUMN: 8 Spans - Contains Cycle Info, Workouts, and Rest */}
        <div className="lg:col-span-8 flex flex-col gap-2 sm:gap-3">

          {/* PANEL 1: Cycle Terminal Readout */}
          <div className="bg-[#0a0f16] border border-zinc-800 p-3 sm:p-4 relative" style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)' }}>
            <div className="absolute top-0 left-0 w-1 h-full bg-neon-cyan/80" />

            <div className="flex flex-wrap items-center justify-between gap-3 pl-2">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-neon-cyan" />
                <div>
                  <span className="text-[9px] text-zinc-500 uppercase tracking-widest block mb-0.5">
                    SYS.CYCLE_RANGE
                  </span>
                  <span className="text-sm font-bold text-zinc-200 tracking-wider">
                    [ {formatDate(cycle.cycle_start_date)} — {formatDate(cycle.cycle_end_date)} ]
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-neon-cyan/10 border border-neon-cyan/30 px-3 py-1.5 rounded-sm">
                <div className="w-1.5 h-1.5 bg-neon-cyan rounded-full animate-pulse" />
                <span className="text-[10px] font-bold text-neon-cyan uppercase tracking-widest">
                  {cycle.days_remaining_in_cycle} {cycle.days_remaining_in_cycle === 1 ? 'DAY' : 'DAYS'} REMAINING
                </span>
              </div>
            </div>
          </div>

          {/* INNER GRID: Workouts and Tokens side-by-side on tablet+ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 flex-1">

            {/* PANEL 2: Workout Power Cells */}
            <div className="bg-[#0a0f16] border border-zinc-800 p-3 sm:p-4 flex flex-col justify-center relative">
              {/* Corner crosshairs */}
              <div className="absolute top-1 left-1 w-1.5 h-1.5 border-t border-l border-zinc-600" />
              <div className="absolute bottom-1 right-1 w-1.5 h-1.5 border-b border-r border-zinc-600" />

              <div className="flex justify-between items-end mb-3">
                <span className="text-[9px] text-zinc-500 uppercase tracking-widest">
                  PROTOCOL_STATUS
                </span>
                <span className="text-xs text-zinc-300">
                  <span className="text-neon-cyan font-bold text-sm">{completed}</span> / {target}
                </span>
              </div>

              {/* Heavy Segmented Matrix */}
              <div className="flex items-center gap-1 w-full h-6">
                {Array.from({ length: Math.max(1, target) }).map((_, idx) => {
                  const isActive = idx < completed;
                  return (
                    <div
                      key={idx}
                      className={`flex-1 h-full skew-x-[-15deg] transition-all duration-300 border-y-2 border-r-2 first:border-l-2 ${isActive
                          ? 'bg-gradient-to-b from-[#00f3ff] to-[#00a3b3] border-neon-cyan shadow-[0_0_12px_rgba(34,211,238,0.4)]'
                          : 'bg-zinc-900/30 border-zinc-800/80 shadow-inner'
                        }`}
                    />
                  );
                })}
              </div>
            </div>

            {/* PANEL 3: Hardware Rest Overrides */}
            <div className="bg-[#0a0f16] border border-zinc-800 p-3 sm:p-4 flex flex-col justify-center relative">
              {/* Corner crosshairs */}
              <div className="absolute top-1 right-1 w-1.5 h-1.5 border-t border-r border-zinc-600" />
              <div className="absolute bottom-1 left-1 w-1.5 h-1.5 border-b border-l border-zinc-600" />

              <div className="flex justify-between items-end mb-3">
                <span className="text-[9px] text-zinc-500 uppercase tracking-widest">
                  SYSTEM_OVERRIDES
                </span>
                <span className="text-[10px] text-zinc-400">
                  {cycle.rest_tokens_remaining} AVAIL
                </span>
              </div>

              {/* Hardware Battery Pods */}
              <div className="flex items-center gap-2.5 h-6">
                {Array.from({ length: cycle.rest_tokens_total }).map((_, idx) => {
                  const isActive = idx < cycle.rest_tokens_remaining;
                  return (
                    <div
                      key={idx}
                      className={`relative flex-1 h-full border-2 transition-all duration-300 flex items-center justify-center overflow-hidden ${isActive
                          ? 'border-neon-cyan bg-neon-cyan/10 shadow-[0_0_10px_rgba(34,211,238,0.2)]'
                          : 'border-zinc-800 bg-zinc-950/50 opacity-40'
                        }`}
                      style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 8px 100%, 0 calc(100% - 8px))' }}
                    >
                      {isActive ? (
                        <Zap className="w-3 h-3 text-neon-cyan drop-shadow-[0_0_5px_#22d3ee]" />
                      ) : (
                        <Cpu className="w-3 h-3 text-zinc-600" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: 4 Spans - Diagnostics & Accuracy Radar */}
        <div className="lg:col-span-4 bg-[#0a0f16] border border-zinc-800 min-h-[140px] relative flex flex-col items-center justify-center p-4">

          {/* Diagnostic Grid Background */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.05)_1px,transparent_1px)] bg-[size:12px_12px]" />

          {/* Tactical Crosshairs */}
          <div className="absolute top-3 left-3 text-zinc-700 text-[10px] leading-none">+</div>
          <div className="absolute top-3 right-3 text-zinc-700 text-[10px] leading-none">+</div>
          <div className="absolute bottom-3 left-3 text-zinc-700 text-[10px] leading-none">+</div>
          <div className="absolute bottom-3 right-3 text-zinc-700 text-[10px] leading-none">+</div>

          <span className="absolute top-3 inset-x-0 text-center text-[8px] text-zinc-600 uppercase tracking-[0.3em]">
            DIAGNOSTICS
          </span>

          <div className="relative flex items-center justify-center w-24 h-24 mt-3">
            <svg className="w-full h-full rotate-[-90deg]">
              {/* Outer faint dashed ring */}
              <circle
                cx="48"
                cy="48"
                r={radius + 6}
                className="stroke-zinc-800 fill-none"
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
                className="stroke-neon-cyan fill-none transition-all duration-700 ease-out"
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="butt"
                style={{
                  filter: 'drop-shadow(0 0 6px rgba(34,211,238,0.6))',
                }}
              />
            </svg>

            {/* Center Readout */}
            <div className="absolute flex flex-col items-center justify-center bg-[#05080c] w-14 h-14 rounded-full border border-zinc-800 shadow-inner">
              <span className="text-lg font-black text-white tracking-tighter leading-none mt-1 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
                {accuracy}<span className="text-[10px] text-neon-cyan ml-0.5">%</span>
              </span>
              <span className="text-[7px] font-bold text-zinc-500 uppercase tracking-widest mt-1">
                ACCURACY
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Queued Weekly Plan Terminal Banner */}
      {user.queuedWeeklyPlanId && (
        <div className="mt-2 sm:mt-3 bg-neon-purple/5 border border-neon-purple/30 p-2.5 flex items-start sm:items-center gap-3 relative overflow-hidden">
          {/* Animated hazard stripes */}
          <div className="absolute inset-0 opacity-10 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#a855f7_10px,#a855f7_20px)]" />

          <AlertTriangle className="w-4 h-4 text-neon-purple shrink-0 animate-pulse relative z-10" />
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 w-full">
            <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">
              STATUS_UPDATE:
            </span>
            <span className="text-[10px] text-zinc-300 uppercase tracking-wider">
              NEW PLAN QUEUED [ <span className="text-neon-purple font-black shadow-neon-purple/50">{user.queuedWeeklyPlanId}</span> ] EXECUTING NEXT CYCLE.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}