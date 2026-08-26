'use client';

import React, { memo } from 'react';
import { CyberpunkShimmerBlock } from '@/components/ui/CyberpunkSkeletonBase';
import { Swords } from 'lucide-react';

export function PowerLevelChartSkeleton() {
  return (
    <div className="bg-zinc-950/80 border border-zinc-800 p-3.5 sm:p-6 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.6)] space-y-4 sm:space-y-6 relative overflow-hidden">
      {/* Top subtle ambient glow */}
      <div className="absolute top-0 inset-x-1/4 h-[1px] bg-gradient-to-r from-transparent via-neon-green/20 to-transparent blur-[2px]" />

      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-3 sm:pb-4 border-b border-zinc-800">
        <div className="w-full space-y-2">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-2 h-2 rotate-45 bg-neon-green/60 shadow-[0_0_6px_#00ff88] animate-pulse" />
            <h2 className="text-xs font-black text-zinc-300 uppercase tracking-[0.2em] flex items-center gap-2">
              <Swords className="w-3.5 h-3.5 text-neon-green/70 animate-pulse" />
              <span>Power Levels</span>
              <span className="text-neon-cyan/70 font-mono text-[9.5px]">[CALIBRATING]</span>
            </h2>
          </div>
          <CyberpunkShimmerBlock className="h-3 w-56 sm:w-80 bg-zinc-800/70" />
        </div>

        <CyberpunkShimmerBlock className="h-8 w-24 sm:w-28 rounded-xl bg-zinc-900 border border-zinc-800 shrink-0" />
      </div>

      {/* Dual Panel Layout */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 pt-2 sm:pt-4">
        {/* Left: Weekly Progress Skeleton */}
        <div className="flex-1 space-y-3">
          <div className="flex justify-between items-center">
            <CyberpunkShimmerBlock className="h-3 w-28 bg-zinc-800" />
            <CyberpunkShimmerBlock className="h-4 w-16 rounded-full bg-zinc-800/60" />
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 sm:gap-3 h-36 sm:h-44 items-end pt-4 pb-2 border-b border-zinc-800/60">
            {[45, 75, 30, 90, 60].map((h, i) => (
              <div key={i} className="flex flex-col items-center gap-2 h-full justify-end">
                <div
                  className="w-full max-w-[42px] rounded-t-lg bg-zinc-900 border border-zinc-800/80 relative overflow-hidden animate-pulse"
                  style={{ height: `${h}%`, animationDelay: `${i * 120}ms` }}
                >
                  <div className="absolute top-0 inset-x-0 h-1 bg-neon-green/40" />
                </div>
                <CyberpunkShimmerBlock className="h-2.5 w-8 bg-zinc-800/70" />
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="hidden lg:block w-px bg-zinc-800/50" />

        {/* Right: Monthly Progress Skeleton */}
        <div className="flex-1 space-y-3">
          <div className="flex justify-between items-center">
            <CyberpunkShimmerBlock className="h-3 w-32 bg-zinc-800" />
            <CyberpunkShimmerBlock className="h-4 w-20 rounded-full bg-zinc-800/60" />
          </div>

          <div className="grid grid-cols-6 sm:grid-cols-12 gap-1.5 sm:gap-2 h-36 sm:h-44 items-end pt-4 pb-2 border-b border-zinc-800/60">
            {[40, 55, 60, 45, 80, 65, 70, 85, 90, 60, 75, 95].map((h, i) => (
              <div key={i} className="flex flex-col items-center gap-2 h-full justify-end">
                <div
                  className="w-full max-w-[28px] rounded-t-md bg-zinc-900 border border-zinc-800/80 relative overflow-hidden animate-pulse"
                  style={{ height: `${h}%`, animationDelay: `${i * 90}ms` }}
                >
                  <div className="absolute top-0 inset-x-0 h-1 bg-neon-cyan/40" />
                </div>
                <CyberpunkShimmerBlock className="h-2 w-5 bg-zinc-800/70" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(PowerLevelChartSkeleton);

