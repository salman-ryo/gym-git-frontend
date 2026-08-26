'use client';

import React, { useState, memo } from 'react';
import { Lock, Gift, Check, Loader2 } from 'lucide-react';
import { RoadmapMilestone } from '@/lib/types';
import { getRarityStyles } from '@/lib/rarity-theme';
import ItemIcon from '@/components/inventory/ItemIcon';

export interface RoadmapMilestoneNodeProps {
  milestone: RoadmapMilestone;
  onClaim: (milestone: RoadmapMilestone) => Promise<void>;
  claimLoadingId: string | null;
}

function RoadmapMilestoneNode({
  milestone,
  onClaim,
  claimLoadingId,
}: RoadmapMilestoneNodeProps) {
  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  const isClaiming = claimLoadingId === milestone.milestone_id;

  const { status, streak_target, item_id, item_name, quantity, title, description, rarity } =
    milestone;

  const isLocked = status === 'LOCKED';
  const styles = getRarityStyles(rarity, isLocked);

  return (
    <div
      className="flex-shrink-0 w-[160px] sm:w-[200px] relative flex flex-col items-center select-none group opacity-100"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* Node Connector Anchor Dot */}
      <div className="absolute top-[39px] w-6 h-6 flex items-center justify-center z-20">
        <div
          className={`rounded-full transition-all duration-300 ${status === 'CLAIMED'
            ? 'w-3.5 h-3.5 bg-emerald-400 border-2 border-emerald-400/30 shadow-[0_0_10px_rgba(52,211,153,0.4)]'
            : status === 'CLAIMABLE'
              ? 'w-4 h-4 bg-neon-cyan border-[3px] border-neon-cyan/30 shadow-[0_0_15px_rgba(34,211,238,0.5)] animate-pulse'
              : 'w-3.5 h-3.5 bg-[#05080c] border-2 border-zinc-700'
            }`}
        />
      </div>

      {/* Target Days Indicator */}
      <div className="text-[10px] sm:text-[11px] font-bold tracking-wide mb-9 text-center h-4 flex items-center justify-center w-full">
        {status === 'CLAIMED' ? (
          <span className="text-emerald-400">✓ Day {streak_target}</span>
        ) : status === 'CLAIMABLE' ? (
          <span className="text-neon-cyan">Day {streak_target}</span>
        ) : (
          <span className="text-zinc-500">Day {streak_target}</span>
        )}
      </div>

      {/* Milestone Card */}
      <div
        className={`w-full p-3 sm:p-4 rounded-2xl border flex flex-col justify-between items-center text-center gap-2.5 sm:gap-3 transition-all duration-300 min-h-[150px] sm:min-h-[165px] ${styles.border
          } ${styles.glow} ${status === 'LOCKED' ? 'opacity-85' : 'hover:-translate-y-1'
          }`}
      >
        {/* Item Icon Frame */}
        <div className="relative">
          <div
            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl border flex items-center justify-center shadow-inner ${styles.iconBg} ${status === 'LOCKED' ? 'opacity-60' : ''
              }`}
          >
            <ItemIcon itemId={item_id} size={20} />
          </div>
          {status === 'LOCKED' && (
            <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center shadow-md">
              <Lock className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-zinc-500" />
            </div>
          )}
        </div>

        {/* Title */}
        <div className="space-y-1 w-full">
          <h4
            className={`text-xs font-bold tracking-wide truncate px-1 w-full ${styles.title}`}
          >
            {title}
          </h4>
          <span
            className={`inline-block px-2 py-0.5 rounded-md text-[9px] font-semibold uppercase border ${styles.badge}`}
          >
            {quantity}x {item_name}
          </span>
        </div>

        {/* Claim / Locked Actions */}
        <div className={`w-full pt-3 border-t ${status === 'LOCKED' ? 'border-zinc-800/30' : 'border-zinc-800/50'}`}>
          {status === 'CLAIMED' ? (
            <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-emerald-400 min-h-[38px]">
              <Check className="w-4 h-4" />
              <span>Claimed</span>
            </div>
          ) : status === 'CLAIMABLE' ? (
            <button
              type="button"
              onClick={() => onClaim(milestone)}
              disabled={isClaiming}
              className="w-full py-2 min-h-[38px] rounded-xl bg-neon-cyan hover:bg-neon-cyan/90 text-[#05080c] text-[11px] font-bold uppercase tracking-wide transition-all shadow-[0_0_10px_rgba(34,211,238,0.2)] hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] cursor-pointer flex items-center justify-center gap-1.5"
            >
              {isClaiming ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <>
                  <Gift className="w-3.5 h-3.5" />
                  <span>Claim Reward</span>
                </>
              )}
            </button>
          ) : (
            <div className={`flex items-center justify-center gap-1.5 text-[11px] font-medium min-h-[38px] ${styles.lockedText}`}>
              <Lock className="w-3 h-3 shrink-0" />
              <span>Locked</span>
            </div>
          )}
        </div>
      </div>

      {/* Rarity Tooltip Popover */}
      {showTooltip && description && (
        <div className="absolute top-[80px] z-50 w-[180px] sm:w-[200px] max-w-[calc(100vw-32px)] p-3 rounded-xl border border-zinc-800/80 bg-zinc-900/95 shadow-xl pointer-events-none text-left space-y-1.5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-zinc-800/60 pb-1.5">
            <span className="text-[10px] font-bold text-zinc-100 uppercase tracking-wide truncate">
              {item_name}
            </span>
            <span className={`text-[9px] uppercase font-bold shrink-0 ml-1.5 ${styles.title}`}>
              {rarity}
            </span>
          </div>
          <p className="text-[10px] text-zinc-400 leading-relaxed">{description}</p>
        </div>
      )}
    </div>
  );
}

export default memo(RoadmapMilestoneNode);