'use client';

import React, { memo } from 'react';
import { CyberpunkShimmerBlock } from '@/components/ui/CyberpunkSkeletonBase';

export function ContributionGraphSkeleton() {
  return (
    <div className="bg-zinc-950/80 border border-zinc-800 p-3.5 sm:p-6 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.6)] relative overflow-hidden space-y-4 sm:space-y-6">
      {/* Top subtle ambient glow */}
      <div className="absolute top-0 inset-x-1/4 h-[1px] bg-gradient-to-r from-transparent via-neon-green/20 to-transparent blur-[2px]" />

      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 sm:pb-4 border-b border-zinc-800/80">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rotate-45 bg-neon-green/60 shadow-[0_0_6px_#00ff88] animate-pulse" />
            <span className="text-xs font-black tracking-widest text-zinc-300 uppercase">
              Consistency Heatmap <span className="text-neon-green/60 font-mono text-[9.5px]">[MATRIX_SYNC]</span>
            </span>
          </div>
          <CyberpunkShimmerBlock className="h-3 w-48 sm:w-64 bg-zinc-800/70" />
        </div>

        {/* Controls / Switcher Skeleton */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <div className="flex items-center bg-zinc-900/90 border border-zinc-800/80 p-1 rounded-xl gap-1">
            <div className="h-7 w-14 sm:w-16 rounded-lg bg-zinc-800/80 animate-pulse" />
            <div className="h-7 w-14 sm:w-16 rounded-lg bg-zinc-800/40" />
            <div className="h-7 w-14 sm:w-16 rounded-lg bg-zinc-800/40" />
          </div>

          <CyberpunkShimmerBlock className="h-8 w-28 sm:w-36 rounded-xl bg-zinc-900 border border-zinc-800" />
        </div>
      </div>

      {/* Year Heatmap Grid Placeholder (52-week horizontal scroll on mobile) */}
      <div className="w-full overflow-x-auto no-scrollbar py-2">
        <div className="min-w-[700px] flex flex-col gap-1.5">
          {/* Month labels placeholder */}
          <div className="flex justify-between px-6 mb-1 text-[10px] text-zinc-600 font-mono">
            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((m) => (
              <span key={m} className="opacity-40">{m}</span>
            ))}
          </div>

          {/* 7 rows of 50 day cells */}
          <div className="grid grid-flow-col grid-rows-7 gap-1 sm:gap-1.5 justify-start">
            {Array.from({ length: 350 }).map((_, idx) => {
              const isRandomGlow = idx % 9 === 0;
              return (
                <div
                  key={idx}
                  className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-xs border transition-all ${
                    isRandomGlow
                      ? 'bg-neon-green/20 border-neon-green/30 animate-pulse'
                      : 'bg-zinc-900/80 border-zinc-800/60'
                  }`}
                  style={{ animationDelay: `${(idx % 15) * 80}ms` }}
                />
              );
            })}
          </div>

          {/* Legend skeleton */}
          <div className="flex items-center justify-end gap-2 pt-3 text-[10px] text-zinc-500 font-mono">
            <span>Less</span>
            <div className="flex gap-1">
              <div className="w-2.5 h-2.5 rounded-xs bg-zinc-900 border border-zinc-800" />
              <div className="w-2.5 h-2.5 rounded-xs bg-emerald-950/60 border border-emerald-900/40" />
              <div className="w-2.5 h-2.5 rounded-xs bg-emerald-800/40 border border-emerald-700/40" />
              <div className="w-2.5 h-2.5 rounded-xs bg-neon-green/30 border border-neon-green/50 animate-pulse" />
            </div>
            <span>More</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(ContributionGraphSkeleton);

