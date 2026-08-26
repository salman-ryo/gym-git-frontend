'use client';

import React, { useState, useMemo, memo, useCallback } from 'react';
import { Gift, Award } from 'lucide-react';
import { RoadmapMilestone } from '@/lib/types';
import { claimReward } from '@/lib/rewards-service';
import RoadmapMilestoneNode from './RoadmapMilestoneNode';

import { useInView } from '../power-level/power-chart-utils';

interface RewardRoadmapProps {
  milestones: RoadmapMilestone[];
  longestStreak: number;
  onClaimSuccess: (details: {
    itemName: string;
    itemId: string;
    quantity: number;
    rarity: string;
  }) => Promise<void>;
  planId?: string;
}

function RewardRoadmap({
  milestones = [],
  longestStreak,
  onClaimSuccess,
  planId = 'ppl-standard',
}: RewardRoadmapProps) {
  const [claimLoadingId, setClaimLoadingId] = useState<string | null>(null);
  const { ref: containerRef, inView } = useInView(0.15);

  // Sort milestones by target days so they display in progression order
  const sortedMilestones = useMemo(() => {
    return [...milestones].sort((a, b) => a.streak_target - b.streak_target);
  }, [milestones]);

  // Compute fill percentage based on longest streak relative to highest target day
  const progressPercent = useMemo(() => {
    if (sortedMilestones.length === 0) return 0;
    const maxTarget = Math.max(...sortedMilestones.map((m) => m.streak_target));
    if (maxTarget <= 0) return 0;
    return Math.min(100, (longestStreak / maxTarget) * 100);
  }, [sortedMilestones, longestStreak]);

  const handleClaim = useCallback(async (milestone: RoadmapMilestone) => {
    setClaimLoadingId(milestone.milestone_id);
    try {
      const result = await claimReward(milestone.plan_id || planId, milestone.streak_target, milestone.item_id);
      if (result.success) {
        await onClaimSuccess({
          itemName: milestone.item_name,
          itemId: milestone.item_id,
          quantity: milestone.quantity,
          rarity: milestone.rarity,
        });
      }
    } catch (err) {
      console.error('Failed to claim reward:', err);
    } finally {
      setClaimLoadingId(null);
    }
  }, [planId, onClaimSuccess]);

  if (sortedMilestones.length === 0) return null;

  return (
    <div ref={containerRef} id="reward-roadmap" className="w-full bg-zinc-950/80 border border-zinc-800 hover:border-zinc-700/50 rounded-2xl p-4 sm:p-6 shadow-sm group transition-all duration-500 relative overflow-hidden">

      {/* Subtle Top Ambient Glow (Replacing harsh neon lines) */}
      <div className="absolute top-0 inset-x-1/4 h-[1px] bg-gradient-to-r from-transparent via-neon-cyan/20 to-transparent blur-[2px]" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6 border-b border-zinc-800/60 pb-3 sm:pb-4">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
            <Gift className="w-4 h-4 sm:w-5 sm:h-5 text-neon-cyan" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-zinc-100 tracking-wide">
              Streak Reward Roadmap
            </h3>
            <p className="text-[10px] sm:text-xs text-zinc-500 font-medium mt-0.5">
              Unlock RPG power items as your streak grows
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-zinc-900/60 border border-zinc-800/80 font-medium text-[11px] sm:text-xs text-zinc-400 self-start sm:self-auto shrink-0">
          <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 shrink-0" />
          <span>Longest Streak: </span>
          <span className="font-bold text-zinc-200">{longestStreak}d</span>
        </div>
      </div>

      {/* Interactive Horizontal Scroll Timeline Track Container */}
      <div className="w-full overflow-x-auto no-scrollbar sm:custom-scrollbar pb-3 sm:pb-4 relative -webkit-overflow-scrolling-touch">
        <div className="min-w-[900px] sm:min-w-[1050px] relative px-4 sm:px-8 pt-8 sm:pt-10 pb-3 sm:pb-4 flex justify-between gap-6 sm:gap-10">

          {/* Main Progression Line Background */}
          <div className="absolute top-[48px] left-[100px] right-[100px] h-1.5 bg-zinc-800/50 rounded-full overflow-hidden">
            {/* Highlights Completed Progress Segment */}
            <div
              className="h-full bg-neon-cyan rounded-full shadow-[0_0_10px_rgba(34,211,238,0.3)] transition-all duration-1000 ease-out"
              style={{ width: inView ? `${progressPercent}%` : '0%' }}
            />
          </div>

          {/* Milestone Nodes */}
          {sortedMilestones.map((milestone) => (
            <RoadmapMilestoneNode
              key={milestone.milestone_id}
              milestone={milestone}
              onClaim={handleClaim}
              claimLoadingId={claimLoadingId}
            />
          ))}

        </div>
      </div>
    </div>
  );
}

export default memo(RewardRoadmap);