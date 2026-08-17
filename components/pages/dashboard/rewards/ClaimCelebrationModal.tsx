'use client';

import React from 'react';
import { Trophy, Check } from 'lucide-react';
import ItemIcon from '@/components/inventory/ItemIcon';
import { getRarityStyles, getRarityGradientGlow } from '@/lib/rarity-theme';
import ModalShell from '@/components/ui/modal-shell';

export interface ClaimCelebrationModalProps {
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
  const rarityStyles = getRarityStyles(rarity);
  const rarityGradient = getRarityGradientGlow(rarity);

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="sm"
      className="text-center flex flex-col items-center justify-between"
      accentGradient="bg-gradient-to-r from-neon-green via-neon-cyan to-neon-purple"
    >
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
        <div className={`relative w-full max-w-[240px] p-6 rounded-2xl border bg-gradient-to-b ${rarityGradient} flex flex-col items-center gap-4 transition-transform duration-300 hover:scale-105`}>
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
            <span className={`text-[9px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded bg-zinc-950/80 border border-zinc-850 ${rarityStyles.text}`}>
              {rarity}
            </span>
            <h4 className="text-sm font-black text-white leading-tight mt-1.5">
              {itemName}
            </h4>
            <p className="text-[10px] text-neon-green font-bold uppercase mt-2">
              Added directly to inventory
            </p>
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
        <span>Awesome!</span>
      </button>
    </ModalShell>
  );
}
