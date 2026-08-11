'use client';

import React, { useState } from 'react';
import { Lock, Gift, Check, Loader2 } from 'lucide-react';
import { RoadmapMilestone } from '@/lib/types';
import ItemIcon from '@/components/inventory/ItemIcon';

interface RoadmapMilestoneNodeProps {
  milestone: RoadmapMilestone;
  onClaim: (milestone: RoadmapMilestone) => Promise<void>;
  claimLoadingId: string | null;
}

export default function RoadmapMilestoneNode({
  milestone,
  onClaim,
  claimLoadingId,
}: RoadmapMilestoneNodeProps) {
  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  const isClaiming = claimLoadingId === milestone.milestone_id;

  const { status, streak_target, item_id, item_name, quantity, title, description, rarity } =
    milestone;

  const getRarityStyles = (rarityName: string, activeStatus: string) => {
    const isLocked = activeStatus === 'LOCKED';
    const isClaimable = activeStatus === 'CLAIMABLE';

    if (isLocked) {
      return {
        border: 'border-zinc-800/80 bg-zinc-950/20 text-zinc-550',
        glow: '',
        title: 'text-zinc-500',
        badge: 'bg-zinc-900 border-zinc-850 text-zinc-500',
      };
    }

    switch (rarityName.toLowerCase()) {
      case 'common':
        return {
          border: 'border-zinc-700 bg-zinc-950/60 hover:border-zinc-500',
          glow: '',
          title: 'text-zinc-200',
          badge: 'bg-zinc-900 border-zinc-800 text-zinc-400',
        };
      case 'rare':
        return {
          border: `border-neon-cyan/30 bg-zinc-950/80 hover:border-neon-cyan ${
            isClaimable ? 'animate-[pulse_2.5s_infinite]' : ''
          }`,
          glow: 'shadow-[0_0_15px_rgba(34,211,238,0.12)]',
          title: 'text-neon-cyan font-bold',
          badge: 'bg-neon-cyan/5 border-neon-cyan/20 text-neon-cyan',
        };
      case 'epic':
        return {
          border: `border-neon-purple/30 bg-zinc-950/90 hover:border-neon-purple ${
            isClaimable ? 'animate-[pulse_2.5s_infinite]' : ''
          }`,
          glow: 'shadow-[0_0_18px_rgba(168,85,247,0.15)]',
          title: 'text-neon-purple font-black',
          badge: 'bg-neon-purple/5 border-neon-purple/20 text-neon-purple',
        };
      case 'legendary':
        return {
          border: `border-amber-400/40 bg-zinc-950/95 hover:border-amber-400 ${
            isClaimable ? 'animate-[pulse_2.5s_infinite]' : ''
          }`,
          glow: 'shadow-[0_0_22px_rgba(251,191,36,0.2)]',
          title: 'text-amber-400 font-black',
          badge: 'bg-amber-400/5 border-amber-400/20 text-amber-400',
        };
      default:
        return {
          border: 'border-zinc-850 bg-zinc-950/20',
          glow: '',
          title: 'text-zinc-300',
          badge: 'bg-zinc-900 border-zinc-800 text-zinc-400',
        };
    }
  };

  const styles = getRarityStyles(rarity, status);

  return (
    <div
      className="flex-shrink-0 w-[200px] relative flex flex-col items-center select-none"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* Node Connector Anchor Dot */}
      <div className="absolute top-[39px] w-6 h-6 flex items-center justify-center z-20">
        <div
          className={`w-3.5 h-3.5 rounded-full border-2 transition-all duration-300 ${
            status === 'CLAIMED'
              ? 'bg-neon-green border-neon-green shadow-[0_0_8px_#00ff88]'
              : status === 'CLAIMABLE'
              ? 'bg-neon-cyan border-white shadow-[0_0_10px_#22d3ee] animate-ping'
              : 'bg-[#080c10] border-zinc-800'
          }`}
        />
        {status === 'CLAIMABLE' && (
          <div className="absolute w-3.5 h-3.5 rounded-full bg-neon-cyan border-2 border-white shadow-[0_0_8px_#22d3ee] z-10" />
        )}
      </div>

      {/* Target Days Indicator */}
      <div className="text-[10px] font-black uppercase tracking-wider text-zinc-500 mb-9 text-center h-4 flex items-center">
        {status === 'CLAIMED' ? (
          <span className="text-neon-green font-bold">✓ Day {streak_target}</span>
        ) : status === 'CLAIMABLE' ? (
          <span className="text-neon-cyan font-extrabold animate-pulse">Claim Day {streak_target}</span>
        ) : (
          <span>Day {streak_target}</span>
        )}
      </div>

      {/* Milestone Card */}
      <div
        className={`w-full p-4 rounded-2xl border flex flex-col justify-between items-center text-center gap-3 transition-all duration-300 min-h-[165px] ${
          styles.border} ${styles.glow} ${status === 'LOCKED' ? 'opacity-55' : 'hover:scale-102 hover:shadow-[0_0_20px_rgba(0,0,0,0.4)]'}`}
      >
        {/* Item Icon Frame */}
        <div className="relative">
          <div className={`w-11 h-11 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shadow-[inset_0_0_10px_rgba(0,0,0,0.6)] ${status === 'LOCKED' ? 'opacity-40' : ''}`}>
            <ItemIcon itemId={item_id} size={24} />
          </div>
          {status === 'LOCKED' && (
            <div className="absolute -top-1 -right-1 w-5 h-5 rounded-md bg-zinc-950 border border-zinc-800 flex items-center justify-center shadow-md">
              <Lock className="w-2.5 h-2.5 text-zinc-500" />
            </div>
          )}
        </div>

        {/* Title */}
        <div className="space-y-0.5">
          <h4 className={`text-[11px] font-black uppercase tracking-wide truncate max-w-[160px] ${styles.title}`}>
            {title}
          </h4>
          <span className={`inline-block px-1.5 py-0.5 rounded text-[8px] font-black uppercase border ${styles.badge}`}>
            {quantity}x {item_name}
          </span>
        </div>

        {/* Claim / locked actions */}
        <div className="w-full pt-2 border-t border-zinc-900">
          {status === 'CLAIMED' ? (
            <div className="flex items-center justify-center gap-1 text-[9.5px] font-bold text-neon-green">
              <Check className="w-3.5 h-3.5" />
              <span>Claimed</span>
            </div>
          ) : status === 'CLAIMABLE' ? (
            <button
              type="button"
              onClick={() => onClaim(milestone)}
              disabled={isClaiming}
              className="w-full py-1.5 rounded-lg bg-gradient-to-r from-neon-cyan to-[#00f3ff] hover:shadow-[0_0_15px_rgba(34,211,238,0.35)] text-zinc-950 text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1"
            >
              {isClaiming ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <>
                  <Gift className="w-3 h-3" />
                  <span>Claim</span>
                </>
              )}
            </button>
          ) : (
            <div className="flex items-center justify-center gap-1 text-[9.5px] font-semibold text-zinc-500">
              <Lock className="w-3 h-3 shrink-0" />
              <span>Locked</span>
            </div>
          )}
        </div>
      </div>

      {/* Rarity Tooltip Popover */}
      {showTooltip && description && (
        <div className="absolute top-[80px] z-50 w-[180px] p-3 rounded-xl border border-zinc-800 bg-zinc-950/95 backdrop-blur-md shadow-lg pointer-events-none text-left space-y-1 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-zinc-900 pb-1">
            <span className="text-[9px] font-black text-white uppercase tracking-wider">{item_name}</span>
            <span className="text-[7.5px] uppercase font-bold text-neon-cyan">{rarity}</span>
          </div>
          <p className="text-[9px] text-zinc-400 leading-normal">{description}</p>
        </div>
      )}
    </div>
  );
}
