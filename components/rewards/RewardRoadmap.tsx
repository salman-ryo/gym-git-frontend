'use client';

import React, { useState, useMemo } from 'react';
import { Gift, Award } from 'lucide-react';
import { RoadmapMilestone } from '@/lib/types';
import { claimReward } from '@/lib/rewards-service';
import RoadmapMilestoneNode from './RoadmapMilestoneNode';

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

export default function RewardRoadmap({
  milestones = [],
  longestStreak,
  onClaimSuccess,
  planId = 'ppl-standard',
}: RewardRoadmapProps) {
  const [claimLoadingId, setClaimLoadingId] = useState<string | null>(null);

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

  const handleClaim = async (milestone: RoadmapMilestone) => {
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
  };

  if (sortedMilestones.length === 0) return null;

  return (
    <div id="reward-roadmap" className="w-full bg-zinc-950/80 border border-zinc-800 hover:border-zinc-700/50 rounded-2xl p-5 sm:p-6 shadow-sm group transition-all duration-500 relative overflow-hidden">

      {/* Subtle Top Ambient Glow (Replacing harsh neon lines) */}
      <div className="absolute top-0 inset-x-1/4 h-[1px] bg-gradient-to-r from-transparent via-neon-cyan/20 to-transparent blur-[2px]" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6 border-b border-zinc-800/60 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
            <Gift className="w-5 h-5 text-neon-cyan" />
          </div>
          <div>
            <h3 className="text-base font-bold text-zinc-100 tracking-wide">
              Streak Reward Roadmap
            </h3>
            <p className="text-xs text-zinc-500 font-medium mt-0.5">
              Unlock RPG power items as your streak grows
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/60 border border-zinc-800/80 font-medium text-xs text-zinc-400 self-start sm:self-auto">
          <Award className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Longest Streak: </span>
          <span className="font-bold text-zinc-200">{longestStreak}d</span>
        </div>
      </div>

      {/* Interactive Horizontal Scroll Timeline Track Container */}
      <div className="w-full overflow-x-auto custom-scrollbar pb-4 relative">
        <div className="min-w-[1050px] relative px-8 pt-10 pb-4 flex justify-between gap-10">

          {/* Main Progression Line Background */}
          <div className="absolute top-[48px] left-[100px] right-[100px] h-1.5 bg-zinc-800/50 rounded-full overflow-hidden">
            {/* Highlights Completed Progress Segment */}
            <div
              className="h-full bg-neon-cyan rounded-full shadow-[0_0_10px_rgba(34,211,238,0.3)] transition-all duration-700 ease-out"
              style={{ width: `${progressPercent}%` }}
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

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #27272a;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #3f3f46;
        }
      `}</style>
    </div>
  );
}