'use client';

import React from 'react';
import { ActiveItemEffect } from '@/lib/types';
import { formatTimeRemaining } from '@/lib/date-utils';
import { useInventory } from '@/lib/inventory-context';
import ItemIcon from './ItemIcon';
import { Shield } from 'lucide-react';

export interface ActiveEffectsBarProps {
  activeEffects?: ActiveItemEffect[];
}

function getEffectLabel(itemId: string): string {
  switch (itemId) {
    case 'RESTORE_SHIELD':
      return 'Restore Shield Buff';
    case 'STREAK_FREEZE_TOKEN':
      return 'Ice Pause Active';
    case 'XP_BOOST':
      return 'XP Boost Enabled';
    case 'ACCURACY_CHARM':
      return 'Accuracy Charm Buff';
    default:
      return 'Active Effect';
  }
}

export default function ActiveEffectsBar({ activeEffects: propEffects }: ActiveEffectsBarProps) {
  const { activeEffects: contextEffects } = useInventory();
  const effects = propEffects && propEffects.length > 0 ? propEffects : contextEffects;

  if (effects.length === 0) return null;

  return (
    <div className="w-full flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 bg-zinc-950/60 border border-zinc-800/80 backdrop-blur-2xl rounded-2xl p-2.5 sm:p-3.5 shadow-sm">
      <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] font-black uppercase text-zinc-400 tracking-wider sm:pr-3 sm:border-r border-zinc-800 shrink-0">
        <Shield className="w-3.5 h-3.5 text-neon-cyan animate-pulse shrink-0" />
        <span>Active Buffs</span>
      </div>

      <div className="flex flex-wrap gap-1.5 sm:gap-2.5 items-center">
        {effects.map((effect) => (
          <div
            key={effect.item_id}
            className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 shadow-[0_0_12px_rgba(0,0,0,0.4)] max-w-full min-w-0"
          >
            <div className="shrink-0">
              <ItemIcon itemId={effect.item_id} size={15} />
            </div>
            <span className="text-[9px] sm:text-[10px] font-black text-zinc-300 uppercase tracking-wider truncate">
              {getEffectLabel(effect.item_id)}:
            </span>
            <span className="text-[9px] sm:text-[10px] font-extrabold text-neon-cyan font-mono shrink-0 animate-pulse">
              {formatTimeRemaining(effect.remaining_seconds)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
