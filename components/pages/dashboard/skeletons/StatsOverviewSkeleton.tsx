'use client';

import React, { memo } from 'react';
import { CyberpunkShimmerBlock } from '@/components/ui/CyberpunkSkeletonBase';

function StatCardSkeleton({ accent = 'green' }: { accent?: 'green' | 'cyan' | 'purple' | 'amber' }) {
  const diamondBg = {
    green: 'bg-neon-green/40 shadow-[0_0_6px_#00ff88]',
    cyan: 'bg-neon-cyan/40 shadow-[0_0_6px_#22d3ee]',
    purple: 'bg-neon-purple/40 shadow-[0_0_6px_#a855f7]',
    amber: 'bg-amber-400/40 shadow-[0_0_6px_#f59e0b]',
  }[accent];

  const borderAccent = {
    green: 'border-neon-green/20',
    cyan: 'border-neon-cyan/20',
    purple: 'border-neon-purple/20',
    amber: 'border-amber-400/20',
  }[accent];

  return (
    <div
      className={`relative flex flex-col justify-center min-h-[110px] sm:min-h-[135px] bg-zinc-950/80 border ${borderAccent} backdrop-blur-2xl rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.6)] p-3 sm:p-5`}
    >
      {/* Corner Diamonds */}
      <div className={`absolute -top-1.5 -left-1.5 w-2.5 h-2.5 sm:w-3 sm:h-3 rotate-45 z-20 rounded-sm ${diamondBg}`} />
      <div className={`absolute -bottom-1.5 -right-1.5 w-2.5 h-2.5 sm:w-3 sm:h-3 rotate-45 z-20 rounded-sm ${diamondBg}`} />

      {/* Shimmer Scanline */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-zinc-700/10 to-transparent"
      />

      <div className="relative z-10 w-full sm:w-[75%] space-y-2 sm:space-y-3">
        <CyberpunkShimmerBlock className="h-2.5 sm:h-3 w-16 sm:w-24 bg-zinc-800/80" />
        <div className="flex items-baseline gap-2">
          <CyberpunkShimmerBlock className="h-6 sm:h-8 w-20 sm:w-28 bg-zinc-800/90" glow />
          <CyberpunkShimmerBlock className="h-3 w-8 bg-zinc-800/60" />
        </div>
        <CyberpunkShimmerBlock className="h-2 sm:h-2.5 w-24 sm:w-32 bg-zinc-800/70" />
      </div>

      {/* Right Icon Silhouette Placeholder */}
      <div className="absolute bottom-2 right-2 sm:right-4 w-10 h-10 sm:w-16 sm:h-16 rounded-full bg-zinc-900/60 border border-zinc-800/60 opacity-30 flex items-center justify-center pointer-events-none">
        <div className="w-5 h-5 sm:w-8 sm:h-8 rounded-full bg-zinc-800/80" />
      </div>
    </div>
  );
}

function CycleProgressCardSkeleton() {
  return (
    <div className="relative w-full mt-5 sm:mt-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 sm:gap-3 relative z-10">
        {/* Left 8 Columns */}
        <div className="lg:col-span-8 flex flex-col gap-2 sm:gap-3">
          {/* Panel 1: Cycle Readout */}
          <div className="bg-zinc-950/80 border border-zinc-800/80 p-2.5 sm:p-4 rounded-xl flex items-center justify-between gap-3 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-teal-400/50" />
            <div className="flex items-center gap-2 sm:gap-3 pl-1.5 sm:pl-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
                <div className="w-3.5 h-3.5 rounded bg-teal-400/40 animate-pulse" />
              </div>
              <div className="space-y-1.5">
                <CyberpunkShimmerBlock className="h-2.5 w-20 bg-zinc-800/80" />
                <CyberpunkShimmerBlock className="h-3.5 w-36 bg-zinc-800" />
              </div>
            </div>
            <CyberpunkShimmerBlock className="h-6 sm:h-7 w-24 sm:w-28 rounded-lg bg-teal-400/10 border border-teal-400/20" />
          </div>

          {/* Inner Grid: Workouts and Tokens */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 flex-1">
            {/* Workout Progress */}
            <div className="bg-zinc-950/80 border border-zinc-800/80 p-2.5 sm:p-4 rounded-xl flex flex-col justify-center space-y-3">
              <div className="flex justify-between items-center">
                <CyberpunkShimmerBlock className="h-2.5 w-24 bg-zinc-800" />
                <CyberpunkShimmerBlock className="h-3 w-12 bg-zinc-800" />
              </div>
              <div className="flex items-center gap-1.5 h-4 sm:h-5">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex-1 h-full rounded-md bg-zinc-800/60 animate-pulse"
                    style={{ animationDelay: `${i * 150}ms` }}
                  />
                ))}
              </div>
            </div>

            {/* Rest Tokens */}
            <div className="bg-zinc-950/80 border border-zinc-800/80 p-2.5 sm:p-4 rounded-xl flex flex-col justify-center space-y-3">
              <div className="flex justify-between items-center">
                <CyberpunkShimmerBlock className="h-2.5 w-20 bg-zinc-800" />
                <CyberpunkShimmerBlock className="h-3 w-16 bg-zinc-800" />
              </div>
              <div className="flex items-center gap-2 h-5 sm:h-6">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="flex-1 h-full rounded-md border border-zinc-800 bg-zinc-900/60 flex items-center justify-center animate-pulse"
                    style={{ animationDelay: `${i * 200}ms` }}
                  >
                    <div className="w-2.5 h-2.5 rounded-full bg-zinc-700/60" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right 4 Columns: Diagnostics Accuracy Radar */}
        <div className="lg:col-span-4 bg-zinc-950/80 border border-zinc-800/80 min-h-[120px] sm:min-h-[140px] rounded-xl relative flex flex-col items-center justify-center p-3 sm:p-4">
          <CyberpunkShimmerBlock className="h-2.5 w-20 bg-zinc-800 absolute top-3 inset-x-0 mx-auto" />
          <div className="relative flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 mt-4">
            <div className="w-full h-full rounded-full border-2 border-zinc-800/80 border-t-neon-cyan/50 animate-[spin_3s_linear_infinite]" />
            <div className="absolute flex flex-col items-center justify-center bg-[#05080c] w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-zinc-800">
              <div className="w-6 h-3 rounded bg-neon-cyan/40 animate-pulse mb-1" />
              <div className="w-8 h-1.5 rounded bg-zinc-700/60" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function StatsOverviewSkeleton() {
  return (
    <div className="w-full space-y-4 sm:space-y-6">
      {/* GRIND STATS Cyberpunk Header Skeleton */}
      <div className="flex justify-center items-center relative">
        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-neon-green/20 to-neon-cyan/40" />
        <div className="px-3 sm:px-7 py-1.5 sm:py-2 mx-1.5 sm:mx-4 bg-zinc-950/80 border border-neon-green/20 backdrop-blur-xl rounded-full flex items-center gap-1.5 sm:gap-3 relative z-10 shrink-0">
          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rotate-45 bg-neon-green/60 shadow-[0_0_6px_#00ff88] animate-pulse" />
          <span className="text-[9.5px] sm:text-xs font-black tracking-[0.18em] sm:tracking-[0.25em] text-zinc-400 uppercase">
            Grind Stats <span className="text-neon-cyan/70 font-mono text-[9px]">[SYNCING]</span>
          </span>
          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rotate-45 bg-neon-cyan/60 shadow-[0_0_6px_#22d3ee] animate-pulse" />
        </div>
        <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-neon-green/20 to-neon-cyan/40" />
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-6">
        <StatCardSkeleton accent="green" />
        <StatCardSkeleton accent="cyan" />
        <StatCardSkeleton accent="purple" />
        <StatCardSkeleton accent="amber" />
      </div>

      {/* Cycle Progress Card Skeleton */}
      <CycleProgressCardSkeleton />
    </div>
  );
}

export default memo(StatsOverviewSkeleton);

