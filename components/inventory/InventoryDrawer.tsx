'use client';

import React, { useState } from 'react';
import { UserInventoryItem } from '@/lib/types';
import ItemIcon from './ItemIcon';
import { X, ShieldAlert, Sparkles, Loader2 } from 'lucide-react';

interface InventoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  inventoryItems: UserInventoryItem[];
  onUseItem: (itemId: string, payload?: Record<string, unknown>) => Promise<void>;
  loading?: boolean;
}

export default function InventoryDrawer({
  isOpen,
  onClose,
  inventoryItems,
  onUseItem,
  loading = false,
}: InventoryDrawerProps) {
  const [selectedItem, setSelectedItem] = useState<UserInventoryItem | null>(null);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [isUsing, setIsUsing] = useState<boolean>(false);

  // Fill up slots up to 8 for that classic RPG empty slot look
  const totalSlots = Math.max(8, Math.ceil((inventoryItems.length || 1) / 4) * 4);
  const slots = Array.from({ length: totalSlots }).map((_, idx) => {
    return inventoryItems[idx] || null;
  });

  if (!isOpen) return null;

  const handleSelect = (item: UserInventoryItem | null) => {
    if (isUsing) return;
    setSelectedItem(item);
    setShowConfirm(false);
  };

  const handleUseRequest = () => {
    if (!selectedItem) return;
    // Streak freeze and restore shield trigger confirmation due to high value
    if (
      selectedItem.item_details.item_id === 'STREAK_FREEZE_TOKEN' ||
      selectedItem.item_details.item_id === 'RESTORE_SHIELD'
    ) {
      setShowConfirm(true);
    } else {
      executeUse();
    }
  };

  const executeUse = async () => {
    if (!selectedItem) return;
    setIsUsing(true);
    try {
      await onUseItem(selectedItem.item_details.item_id);
      // Refresh selected item balance
      const updated = inventoryItems.find(
        (i) => i.item_details.item_id === selectedItem.item_details.item_id
      );
      if (updated && updated.quantity > 1) {
        setSelectedItem({
          ...selectedItem,
          quantity: updated.quantity - 1,
        });
      } else {
        setSelectedItem(null);
      }
      setShowConfirm(false);
    } catch (err) {
      console.error('Failed to use item:', err);
    } finally {
      setIsUsing(false);
    }
  };

  // Helper to determine border colors for rarities
  const getRarityStyles = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return {
          border: 'border-zinc-700/60 hover:border-zinc-500 bg-zinc-950/40',
          text: 'text-zinc-400',
          glow: '',
          bgGradient: 'from-zinc-500/5 to-transparent',
        };
      case 'rare':
        return {
          border: 'border-neon-cyan/40 hover:border-neon-cyan bg-zinc-950/60 shadow-[0_0_10px_rgba(34,211,238,0.15)]',
          text: 'text-neon-cyan',
          glow: 'shadow-[0_0_20px_rgba(34,211,238,0.35)]',
          bgGradient: 'from-neon-cyan/10 to-transparent',
        };
      case 'epic':
        return {
          border: 'border-neon-purple/40 hover:border-neon-purple bg-zinc-950/60 shadow-[0_0_12px_rgba(168,85,247,0.18)]',
          text: 'text-neon-purple font-black',
          glow: 'shadow-[0_0_25px_rgba(168,85,247,0.4)]',
          bgGradient: 'from-neon-purple/10 to-transparent',
        };
      case 'legendary':
        return {
          border: 'border-amber-400/50 hover:border-amber-400 bg-zinc-950/80 shadow-[0_0_15px_rgba(251,191,36,0.22)]',
          text: 'text-amber-400 font-black animate-pulse',
          glow: 'shadow-[0_0_30px_rgba(251,191,36,0.55)]',
          bgGradient: 'from-amber-400/10 to-transparent',
        };
      default:
        return {
          border: 'border-zinc-800 bg-zinc-950/20',
          text: 'text-zinc-400',
          glow: '',
          bgGradient: '',
        };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fade-in">
      {/* Background Click dismisser */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Drawer Container Panel */}
      <div className="relative z-10 w-full max-w-lg md:max-w-xl h-full bg-[#060a0e]/95 border-l border-zinc-800/80 shadow-[0_0_50px_rgba(0,0,0,0.85)] flex flex-col justify-between overflow-hidden animate-slide-in-right">
        
        {/* Futuristic Top Header Bar */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-zinc-800/80 bg-zinc-950/40 relative">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-neon-cyan/40 to-transparent" />
          
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-neon-cyan animate-pulse" />
            <h2 className="text-sm font-black uppercase tracking-[0.2em] bg-gradient-to-r from-neon-cyan via-white to-neon-purple bg-clip-text text-transparent">
              Hero Inventory
            </h2>
          </div>
          
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-zinc-900/60 border border-zinc-800 hover:border-neon-cyan/40 text-zinc-400 hover:text-neon-cyan flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Section: Slot Grid & Detail Panel */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* Left Column: RPG Slot Grid (Scrollable) */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            <div className="text-[10px] font-black uppercase text-zinc-500 tracking-wider">
              Item Slots ({inventoryItems.length} active)
            </div>
            
            <div className="grid grid-cols-4 gap-4">
              {slots.map((item, idx) => {
                const isSelected = selectedItem && item && selectedItem.item_details.item_id === item.item_details.item_id;
                const rStyles = item ? getRarityStyles(item.item_details.rarity) : null;
                
                return (
                  <div
                    key={idx}
                    onClick={() => item && handleSelect(item)}
                    className={`aspect-square relative rounded-xl border flex items-center justify-center transition-all duration-300 ${
                      item
                        ? `${rStyles?.border} cursor-pointer group/slot`
                        : 'border-zinc-850 bg-zinc-950/20 cursor-default'
                    } ${isSelected ? 'scale-105 border-white ring-2 ring-neon-cyan/30' : ''}`}
                  >
                    {item ? (
                      <>
                        {/* Glowing rarity background accent */}
                        <div className={`absolute inset-0 rounded-xl bg-gradient-to-t ${rStyles?.bgGradient} pointer-events-none opacity-40 group-hover/slot:opacity-80 transition-opacity`} />
                        
                        {/* Item Icon */}
                        <ItemIcon itemId={item.item_details.item_id} size={30} className="relative z-10 transition-transform duration-200 group-hover/slot:scale-110" />
                        
                        {/* Quantity Counter Badge */}
                        <div className="absolute top-1.5 right-1.5 z-10 px-1 bg-zinc-900 border border-zinc-800 rounded font-black text-[9px] text-neon-cyan shadow-sm">
                          x{item.quantity}
                        </div>
                      </>
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-zinc-900/60" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column / Bottom row: Selected Item Inspector */}
          <div className="w-full md:w-[220px] bg-zinc-950/50 border-t md:border-t-0 md:border-l border-zinc-850 p-6 flex flex-col justify-between overflow-y-auto">
            {selectedItem ? (
              <div className="space-y-6 h-full flex flex-col justify-between">
                
                {/* Details */}
                <div className="space-y-4">
                  {/* Rarity Tag */}
                  <span className={`inline-block px-2.5 py-0.5 rounded-full bg-zinc-900 border text-[9px] uppercase tracking-wider font-extrabold ${getRarityStyles(selectedItem.item_details.rarity).text}`}>
                    {selectedItem.item_details.rarity}
                  </span>
                  
                  {/* Item Icon & Title */}
                  <div className="space-y-2">
                    <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center ${getRarityStyles(selectedItem.item_details.rarity).border} ${getRarityStyles(selectedItem.item_details.rarity).glow}`}>
                      <ItemIcon itemId={selectedItem.item_details.item_id} size={34} />
                    </div>
                    <h3 className="text-sm font-black text-white leading-snug">
                      {selectedItem.item_details.name}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-[11px] text-zinc-400 font-medium leading-relaxed">
                    {selectedItem.item_details.description}
                  </p>

                  {/* Quantity Held */}
                  <div className="text-[10px] text-zinc-400">
                    Quantity Held: <span className="font-extrabold text-neon-cyan">{selectedItem.quantity}</span>
                  </div>
                </div>

                {/* Confirm Overlay / Actions Container */}
                <div className="space-y-3 pt-4 border-t border-zinc-850 mt-auto">
                  {showConfirm ? (
                    <div className="space-y-3 p-3 rounded-xl bg-red-950/20 border border-red-500/20 animate-pulse">
                      <div className="flex gap-1.5 items-start">
                        <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                        <span className="text-[9.5px] font-bold text-red-200">
                          Confirm using this high-value token?
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={executeUse}
                          disabled={isUsing}
                          className="flex-1 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-black text-[10px] uppercase transition-all flex items-center justify-center gap-1 cursor-pointer"
                        >
                          {isUsing ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Yes, Use'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowConfirm(false)}
                          disabled={isUsing}
                          className="flex-1 py-1.5 rounded-lg bg-zinc-850 hover:bg-zinc-850 text-zinc-300 font-black text-[10px] uppercase transition-all cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handleUseRequest}
                      disabled={loading || isUsing}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-neon-cyan to-[#00f3ff] text-zinc-950 font-black text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(34,211,238,0.2)] hover:scale-[1.03] active:scale-100 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <span>Activate Buff</span>
                    </button>
                  )}
                </div>

              </div>
            ) : (
              <div className="h-full flex flex-col justify-center items-center text-center text-zinc-500 space-y-2">
                <div className="w-10 h-10 rounded-full border border-zinc-800 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-zinc-650" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider">Select an Item</p>
                  <p className="text-[9.5px] leading-snug">Click an item slot to view details and use it.</p>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
