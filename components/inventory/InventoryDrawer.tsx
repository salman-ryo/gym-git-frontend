'use client';

import React, { useState } from 'react';
import { UserInventoryItem } from '@/lib/types';
import { getRarityStyles, normalizeRarity } from '@/lib/rarity-theme';
import ItemIcon from './ItemIcon';
import ModalShell from '@/components/ui/modal-shell';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Package, Sparkles, ShieldAlert, Loader2, Clock, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface InventoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  inventoryItems: UserInventoryItem[];
  onUseItem: (itemId: string, payload?: Record<string, unknown>) => Promise<void>;
  loading?: boolean;
  onRequestFreeze?: (availableTokens: number) => void;
}

function formatItemDuration(seconds?: number, effectType?: string): string {
  if (effectType === 'INSTANT_USE' || !seconds || seconds <= 0) {
    return 'Instant Consumable';
  }
  if (seconds >= 86400) {
    const days = Math.round(seconds / 86400);
    return `${days} ${days === 1 ? 'Day' : 'Days'}`;
  }
  if (seconds >= 3600) {
    const hours = Math.round(seconds / 3600);
    return `${hours} ${hours === 1 ? 'Hour' : 'Hours'}`;
  }
  if (seconds >= 60) {
    const mins = Math.round(seconds / 60);
    return `${mins} ${mins === 1 ? 'Min' : 'Mins'}`;
  }
  return `${seconds}s`;
}

function getItemActionHint(itemId: string): string {
  switch (itemId) {
    case 'STREAK_FREEZE_TOKEN':
      return '❄️ Click to Configure Freeze';
    case 'RESTORE_SHIELD':
      return '🛡️ Click to Restore Streak';
    case 'XP_BOOST':
      return '⚡ Click to Activate 2x XP';
    case 'ACCURACY_CHARM':
      return '🎯 Click to Activate Charm';
    default:
      return '⚡ Click to Activate';
  }
}

function getTooltipGlowClass(rarity?: string | null): string {
  const norm = normalizeRarity(rarity);
  switch (norm) {
    case 'legendary':
      return 'border-amber-400/50 shadow-[0_0_30px_rgba(251,191,36,0.3)]';
    case 'epic':
      return 'border-neon-purple/50 shadow-[0_0_30px_rgba(168,85,247,0.3)]';
    case 'rare':
      return 'border-neon-cyan/50 shadow-[0_0_30px_rgba(34,211,238,0.3)]';
    case 'common':
    default:
      return 'border-zinc-700/80 shadow-[0_0_20px_rgba(0,0,0,0.8)]';
  }
}

export default function InventoryDrawer({
  isOpen,
  onClose,
  inventoryItems,
  onUseItem,
  loading = false,
  onRequestFreeze,
}: InventoryDrawerProps) {
  const [confirmingItem, setConfirmingItem] = useState<UserInventoryItem | null>(null);
  const [isUsingItemId, setIsUsingItemId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Fill up slots to multiples of 4 (minimum 12 slots for RPG grid aesthetic)
  const totalSlots = Math.max(12, Math.ceil(Math.max(inventoryItems.length, 1) / 4) * 4);
  const slots = Array.from({ length: totalSlots }).map((_, idx) => {
    return inventoryItems[idx] || null;
  });

  const totalCount = inventoryItems.reduce((acc, curr) => acc + curr.quantity, 0);

  const handleItemClick = (item: UserInventoryItem) => {
    if (isUsingItemId || loading) return;

    if (item.item_details.item_id === 'STREAK_FREEZE_TOKEN') {
      if (onRequestFreeze) {
        onRequestFreeze(item.quantity);
      }
      return;
    }

    if (item.item_details.item_id === 'RESTORE_SHIELD') {
      setConfirmingItem(item);
      return;
    }

    // Direct use for consumables/buffs
    executeUse(item);
  };

  const executeUse = async (item: UserInventoryItem) => {
    setIsUsingItemId(item.item_details.item_id);
    setErrorMsg(null);
    try {
      await onUseItem(item.item_details.item_id);
      setConfirmingItem(null);
      setSuccessMsg(`Activated ${item.item_details.name}!`);
      setTimeout(() => {
        setSuccessMsg(null);
      }, 3000);
    } catch (err: unknown) {
      console.error('Failed to use item:', err);
      setErrorMsg(err instanceof Error ? err.message : 'Failed to use item. Please try again.');
    } finally {
      setIsUsingItemId(null);
    }
  };

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="lg"
      className="p-5 sm:p-6"
      errorMsg={errorMsg}
      accentGradient="bg-linear-to-r from-neon-cyan via-teal-300 to-neon-purple"
      title={
        <div className="flex items-center gap-2.5">
          <h3 className="text-base font-black tracking-wide bg-linear-to-r from-neon-cyan via-white to-neon-purple bg-clip-text text-transparent">
            Your Inventory
          </h3>
          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan tracking-wider font-mono">
            {inventoryItems.length} {inventoryItems.length === 1 ? 'Slot' : 'Slots'} Active
          </span>
        </div>
      }
      subtitle="Hover over any item to inspect stats and lore. Click an item to use its power."
      icon={
        <img src="/icons/bag.png" alt="Inventory" className="w-5 h-5 text-neon-cyan animate-pulse md:size-8" />
      }
    >
      <div className="space-y-4">
        {/* Success Alert Banner */}
        {successMsg && (
          <div className="p-3 rounded-xl bg-neon-green/10 border border-neon-green/30 text-neon-green text-xs font-bold flex items-center gap-2 animate-in fade-in duration-200 shadow-[0_0_15px_rgba(0,255,136,0.15)]">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* High-Value Item Confirmation Banner */}
        {confirmingItem && (
          <div className="p-3.5 rounded-2xl bg-red-950/40 border border-red-500/40 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(239,68,68,0.25)]">
                <ShieldAlert className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h4 className="text-xs font-black text-red-200 uppercase tracking-wide">
                  Use {confirmingItem.item_details.name}?
                </h4>
                <p className="text-[10px] text-zinc-400">
                  This will consume 1x token from your inventory balance.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => executeUse(confirmingItem)}
                disabled={!!isUsingItemId}
                className="flex-1 sm:flex-initial px-4 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-[11px] uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(239,68,68,0.3)] disabled:opacity-50"
              >
                {isUsingItemId ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Confirm & Use'}
              </button>
              <button
                type="button"
                onClick={() => setConfirmingItem(null)}
                disabled={!!isUsingItemId}
                className="flex-1 sm:flex-initial px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 font-bold text-[11px] uppercase tracking-wider transition-all cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* The Cyberpunk Inventory Grid Box */}
        <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-2xl p-4 sm:p-5 shadow-inner relative overflow-hidden">
          <TooltipProvider delayDuration={50} skipDelayDuration={0}>
            <div className="grid grid-cols-4 gap-3 sm:gap-3.5">
              {slots.map((item, idx) => {
                if (!item) {
                  return (
                    <div
                      key={idx}
                      className="aspect-square relative rounded-2xl border border-zinc-800/80 bg-zinc-900/40 flex items-center justify-center"
                    />
                  );
                }

                const rStyles = getRarityStyles(item.item_details.rarity);
                const isSlotUsing = isUsingItemId === item.item_details.item_id;

                return (
                  <Tooltip key={item.item_details.item_id || idx}>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        onClick={() => handleItemClick(item)}
                        disabled={loading || isSlotUsing}
                        aria-label={`${item.item_details.name} (x${item.quantity})`}
                        className="aspect-square relative rounded-2xl border border-zinc-800/80 bg-zinc-900/40 flex items-center justify-center transition-all duration-200 group/slot cursor-pointer outline-none hover:border-zinc-700 hover:scale-105 active:scale-95 hover:z-10 focus-visible:ring-2 focus-visible:ring-neon-cyan/60"
                      >
                        {/* Item Icon */}
                        <ItemIcon
                          itemId={item.item_details.item_id}
                          size={44}
                          className="relative z-10 transition-transform duration-200 group-hover/slot:scale-110"
                        />

                        {/* Quantity Counter Badge */}
                        <div className={cn(
                          "absolute top-1.5 right-1.5 z-10 px-1.5 py-0.5 rounded-md font-black text-[9px] shadow-sm font-mono tracking-tight pointer-events-none border",
                          item.quantity >= 9
                            ? "bg-amber-950/90 border-amber-500/50 text-amber-400"
                            : "bg-zinc-950/90 border-zinc-800/90 text-neon-cyan"
                        )}>
                          x{item.quantity >= 9 ? '9 MAX' : item.quantity}
                        </div>

                        {/* Loading Spinner during activation */}
                        {isSlotUsing && (
                          <div className="absolute inset-0 z-20 rounded-2xl bg-zinc-950/85 backdrop-blur-[1px] flex items-center justify-center animate-in fade-in duration-150">
                            <Loader2 className="w-5 h-5 text-neon-cyan animate-spin" />
                          </div>
                        )}
                      </button>
                    </TooltipTrigger>

                    <TooltipContent
                      side="top"
                      sideOffset={10}
                      className={cn(
                        'z-50 w-72 p-3.5 rounded-2xl bg-[#060a0f]/95 backdrop-blur-xl border custom-scrollbar space-y-2.5',
                        getTooltipGlowClass(item.item_details.rarity)
                      )}
                    >
                      {/* Tooltip Header */}
                      <div className="flex items-center gap-2.5">
                        <div
                          className={cn(
                            'w-9 h-9 rounded-xl border flex items-center justify-center shrink-0',
                            rStyles.border,
                            rStyles.iconBg
                          )}
                        >
                          <ItemIcon itemId={item.item_details.item_id} size={20} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className={cn('text-xs font-black leading-snug truncate', rStyles.text)}>
                            {item.item_details.name}
                          </h4>
                          <span
                            className={cn(
                              'inline-block mt-0.5 px-2 py-0.2 rounded-full text-[8.5px] font-black uppercase tracking-wider',
                              rStyles.badge
                            )}
                          >
                            {item.item_details.rarity}
                          </span>
                        </div>
                      </div>

                      {/* Divider */}
                      <div className="h-px w-full bg-linear-to-r from-transparent via-zinc-800 to-transparent" />

                      {/* Item Description */}
                      <p className="text-[11px] text-zinc-300 font-medium leading-relaxed">
                        {item.item_details.description}
                      </p>

                      {/* Metadata Pills */}
                      <div className="grid grid-cols-2 gap-2 pt-0.5">
                        <div className="px-2 py-1 rounded-lg bg-zinc-900/90 border border-zinc-800/80 text-[10px] text-zinc-400 flex items-center gap-1.5">
                          <Clock className="w-3 h-3 text-neon-cyan shrink-0" />
                          <span className="truncate">
                            {formatItemDuration(
                              item.item_details.duration_seconds,
                              item.item_details.effect_type
                            )}
                          </span>
                        </div>
                        <div className="px-2 py-1 rounded-lg bg-zinc-900/90 border border-zinc-800/80 text-[10px] text-zinc-400 flex items-center gap-1.5">
                          <Package className="w-3 h-3 text-neon-green shrink-0" />
                          <span className="truncate">
                            In Bag: <strong className={cn("font-black", item.quantity >= 9 ? "text-amber-400" : "text-white")}>{Math.min(9, item.quantity)}/9{item.quantity >= 9 ? ' (MAX)' : ''}</strong>
                          </span>
                        </div>
                      </div>

                      {/* Action Prompt */}
                      <div className="pt-0.5">
                        <div className="w-full py-1.5 px-2 rounded-xl bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan text-[10px] font-black text-center uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-[0_0_10px_rgba(34,211,238,0.15)]">
                          <Sparkles className="w-3 h-3 shrink-0" />
                          <span>{getItemActionHint(item.item_details.item_id)}</span>
                        </div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          </TooltipProvider>
        </div>

        {/* Footer Summary / Quick Tip */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 text-[11px] text-zinc-400">
          <div className="flex items-center gap-1.5 text-zinc-400">
            <Sparkles className="w-3.5 h-3.5 text-neon-cyan shrink-0" />
            <span>Hover item to inspect • Click to activate</span>
          </div>
          <div className="text-zinc-500 font-mono text-[10px] uppercase tracking-wider">
            {totalCount} Total Items Held
          </div>
        </div>
      </div>
    </ModalShell>
  );
}
