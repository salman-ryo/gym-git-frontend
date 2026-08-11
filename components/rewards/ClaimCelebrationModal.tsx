'use client';

import React from 'react';
import { Trophy, Check } from 'lucide-react';
import ItemIcon from '@/components/inventory/ItemIcon';

interface ClaimCelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  rewardDetails: {
    itemName: string;
    itemId: string;
    quantity: number;
    rarity: string;
  } | null;
}

export default function ClaimCelebrationModal({
  isOpen,
  onClose,
  rewardDetails,
}: ClaimCelebrationModalProps) {
  if (!isOpen || !rewardDetails) return null;

  const { itemName, itemId, quantity, rarity } = rewardDetails;

  const getRarityGlow = (rarityName: string) => {
    switch (rarityName.toLowerCase()) {
      case 'common':
        return 'from-zinc-500/20 via-zinc-500/10 to-transparent text-zinc-400 border-zinc-700';
      case 'rare':
        return 'from-cyan-500/30 via-cyan-500/10 to-transparent text-neon-cyan border-neon-cyan/40 shadow-[0_0_30px_rgba(34,211,238,0.2)]';
      case 'epic':
        return 'from-purple-500/35 via-purple-500/15 to-transparent text-neon-purple border-neon-purple/40 shadow-[0_0_35px_rgba(168,85,247,0.25)]';
      case 'legendary':
        return 'from-amber-400/40 via-amber-400/20 to-transparent text-amber-400 border-amber-400/50 shadow-[0_0_40px_rgba(251,191,36,0.3)]';
      default:
        return 'from-zinc-700/20 via-zinc-700/10 to-transparent text-zinc-400 border-zinc-700';
    }
  };

  const getRarityTextClass = (rarityName: string) => {
    switch (rarityName.toLowerCase()) {
      case 'common':
        return 'text-zinc-400';
      case 'rare':
        return 'text-neon-cyan font-bold';
      case 'epic':
        return 'text-neon-purple font-extrabold';
      case 'legendary':
        return 'text-amber-400 font-black animate-pulse';
      default:
        return 'text-zinc-400';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/90 backdrop-blur-2xl animate-in fade-in duration-300">
      {/* Dynamic Ambient Background Sparkles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[20%] left-[25%] w-72 h-72 bg-neon-cyan/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-[20%] right-[25%] w-72 h-72 bg-neon-purple/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Main Celebration Panel */}
      <div className="relative w-full max-w-sm bg-[#080c10]/95 border border-zinc-800 rounded-3xl p-6 sm:p-8 text-center shadow-[0_0_60px_rgba(0,0,0,0.85)] flex flex-col items-center justify-between overflow-hidden animate-in scale-in-95 duration-350">
        
        {/* Top Celebration Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-neon-green via-neon-cyan to-neon-purple" />

        <div className="space-y-6 w-full flex flex-col items-center">
          {/* Trophy Header */}
          <div className="relative flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500/25 to-yellow-400/5 flex items-center justify-center border border-amber-500/30 animate-bounce">
              <Trophy className="w-8 h-8 text-amber-400" />
            </div>
            <div className="absolute -top-1 -right-1 text-neon-green text-lg animate-ping">✦</div>
            <div className="absolute -bottom-1 -left-2 text-neon-cyan text-lg animate-pulse">⚡</div>
          </div>

          <div>
            <h3 className="text-xl font-black uppercase tracking-widest bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
              Reward Claimed!
            </h3>
            <p className="text-[10px] text-zinc-500 font-extrabold uppercase tracking-widest mt-1">
              Milestone Unlocked Successfully
            </p>
          </div>

          {/* Award Card Item */}
          <div className={`relative w-full max-w-[240px] p-6 rounded-2xl border bg-gradient-to-b ${getRarityGlow(rarity)} flex flex-col items-center gap-4 transition-transform duration-300 hover:scale-105`}>
            
            {/* Quantity Badge */}
            <div className="absolute -top-2.5 right-4 z-10 px-2 py-0.5 bg-zinc-950 border border-zinc-800 rounded-full font-black text-[10px] text-neon-cyan shadow-md">
              +{quantity} Awarded
            </div>

            {/* Large Item Icon Frame */}
            <div className="w-18 h-18 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 flex items-center justify-center shadow-inner relative group">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-white/5 to-transparent pointer-events-none" />
              <ItemIcon itemId={itemId} size={42} />
            </div>

            {/* Rarity Tag */}
            <div className="space-y-1">
              <span className={`text-[9px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded bg-zinc-950/80 border border-zinc-850 ${getRarityTextClass(rarity)}`}>
                {rarity}
              </span>
              <h4 className="text-sm font-black text-white leading-tight mt-1.5">
                {itemName}
              </h4>
            </div>

          </div>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={onClose}
          className="w-full mt-8 bg-gradient-to-r from-neon-green via-neon-cyan to-neon-purple hover:shadow-[0_0_25px_rgba(34,211,238,0.4)] text-zinc-950 font-black py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all duration-200 hover:scale-[1.03] active:scale-100 uppercase tracking-wider cursor-pointer"
        >
          <Check className="w-4 h-4 stroke-[3]" />
          <span>Add to Inventory</span>
        </button>

      </div>
    </div>
  );
}
