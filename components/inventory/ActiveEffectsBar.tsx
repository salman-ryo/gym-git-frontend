'use client';

import React, { useEffect, useState } from 'react';
import { ActiveItemEffect } from '@/lib/types';
import { formatTimeRemaining } from '@/lib/date-utils';
import ItemIcon from './ItemIcon';
import { Shield } from 'lucide-react';

export interface ActiveEffectsBarProps {
  activeEffects: ActiveItemEffect[];
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

export default function ActiveEffectsBar({ activeEffects }: ActiveEffectsBarProps) {
  const [effects, setEffects] = useState<ActiveItemEffect[]>(() => activeEffects);

  // Live ticking timer
  useEffect(() => {
    if (effects.length === 0) return;

    const timer = setInterval(() => {
      setEffects((prev) =>
        prev
          .map((eff) => ({
            ...eff,
            remaining_seconds: Math.max(0, eff.remaining_seconds - 1),
          }))
          .filter((eff) => eff.remaining_seconds > 0)
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [effects.length]);

  if (effects.length === 0) return null;

  return (
    <div className="w-full flex flex-wrap gap-3 bg-zinc-950/60 border border-zinc-800/80 backdrop-blur-2xl rounded-2xl p-3.5 shadow-sm">
      <div className="flex items-center gap-2 text-[10px] font-black uppercase text-zinc-400 tracking-wider pr-2 border-r border-zinc-800">
        <Shield className="w-3.5 h-3.5 text-neon-cyan animate-pulse" />
        <span>Active Buffs</span>
      </div>

      <div className="flex flex-wrap gap-2.5 items-center">
        {effects.map((effect) => (
          <div
            key={effect.item_id}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 shadow-[0_0_12px_rgba(0,0,0,0.4)]"
          >
            <ItemIcon itemId={effect.item_id} size={15} />
            <span className="text-[10px] font-black text-zinc-300 uppercase tracking-wider">
              {getEffectLabel(effect.item_id)}:
            </span>
            <span className="text-[10px] font-extrabold text-neon-cyan font-mono animate-pulse">
              {formatTimeRemaining(effect.remaining_seconds)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
