'use client';

import React, { memo } from 'react';
import { Gift, Award } from 'lucide-react';
import { CyberpunkShimmerBlock } from '@/components/ui/CyberpunkSkeletonBase';

function MilestoneNodeSkeleton({ delay = 0 }: { delay?: number }) {
  return (
    <div
      className="flex flex-col items-center gap-3 w-28 sm:w-36 shrink-0 animate-pulse"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Node Badge */}
      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center relative shadow-md">
        <div className="w-6 h-6 rounded-lg bg-zinc-800" />
      </div>

      {/* Target Days */}
      <CyberpunkShimmerBlock className="h-3 w-16 bg-zinc-800/80" />

      {/* Item Box */}
      <div className="w-full bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-2 sm:p-2.5 flex flex-col items-center gap-1.5">
        <div className="w-8 h-8 rounded-lg bg-zinc-800/80" />
        <CyberpunkShimmerBlock className="h-2.5 w-16 bg-zinc-800" />
        <CyberpunkShimmerBlock className="h-2 w-10 bg-zinc-800/60" />
      </div>
    </div>
  );
}

export function RewardRoadmapSkeleton() {
  return (
    <div className="w-full bg-zinc-950/80 border border-zinc-800 rounded-2xl p-4 sm:p-6 shadow-sm relative overflow-hidden space-y-4">
      {/* Top subtle ambient glow */}
      <div className="absolute top-0 inset-x-1/4 h-[1px] bg-gradient-to-r from-transparent via-neon-cyan/20 to-transparent blur-[2px]" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 sm:gap-4 pb-3 sm:pb-4 border-b border-zinc-800/60">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
            <Gift className="w-4 h-4 sm:w-5 sm:h-5 text-neon-cyan/60 animate-pulse" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm sm:text-base font-bold text-zinc-300 tracking-wide flex items-center gap-2">
              <span>Streak Reward Roadmap</span>
              <span className="text-neon-cyan/70 font-mono text-[9.5px]">[FETCHING_NODES]</span>
            </h3>
            <CyberpunkShimmerBlock className="h-2.5 w-44 sm:w-56 bg-zinc-800/60" />
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-zinc-900/60 border border-zinc-800/80 self-start sm:self-auto shrink-0">
          <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400/60 shrink-0" />
          <CyberpunkShimmerBlock className="h-3 w-20 bg-zinc-800" />
        </div>
      </div>

      {/* Horizontal Timeline Track */}
      <div className="w-full overflow-x-auto no-scrollbar pb-3 sm:pb-4 relative">
        <div className="min-w-[900px] sm:min-w-[1050px] relative px-4 sm:px-8 pt-8 sm:pt-10 pb-3 sm:pb-4 flex justify-between gap-6 sm:gap-10">
          {/* Progression Line Background */}
          <div className="absolute top-[48px] left-[100px] right-[100px] h-1.5 bg-zinc-800/40 rounded-full overflow-hidden">
            <div className="h-full w-1/4 bg-neon-cyan/30 rounded-full animate-pulse" />
          </div>

          {[0, 150, 300, 450, 600].map((delay, idx) => (
            <MilestoneNodeSkeleton key={idx} delay={delay} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default memo(RewardRoadmapSkeleton);

