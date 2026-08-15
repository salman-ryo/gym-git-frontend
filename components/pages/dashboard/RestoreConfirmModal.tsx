'use client';

import React from 'react';
import { X, ShieldAlert, Check, Loader2 } from 'lucide-react';
import ItemIcon from '@/components/inventory/ItemIcon';

interface RestoreConfirmModalProps {
  isOpen: boolean;
  dateStr: string | null;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '';
  const date = new Date(dateStr + 'T00:00:00');
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function RestoreConfirmModal({
  isOpen,
  dateStr,
  onConfirm,
  onCancel,
  loading = false,
}: RestoreConfirmModalProps) {
  if (!isOpen || !dateStr) return null;

  const formattedDate = formatDate(dateStr);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm bg-[#080c10]/95 border border-neon-cyan/30 rounded-3xl p-6 sm:p-7 text-center shadow-[0_0_50px_rgba(34,211,238,0.18)] flex flex-col items-center overflow-hidden animate-in scale-in-95 duration-200">
        
        {/* Top Gradient Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-neon-green via-neon-cyan to-neon-purple" />

        {/* Ambient Glow Effects */}
        <div className="absolute top-[-20%] left-[20%] w-48 h-48 bg-neon-cyan/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white p-2 rounded-xl bg-zinc-950/80 border border-zinc-800 hover:border-zinc-700 transition-all cursor-pointer disabled:opacity-50"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Icon Frame */}
        <div className="relative mb-4 flex items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-neon-cyan/40 shadow-[0_0_20px_rgba(34,211,238,0.2)] flex items-center justify-center">
            <ItemIcon itemId="RESTORE_SHIELD" size={36} />
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 rounded-lg bg-zinc-950 border border-neon-cyan/40 flex items-center justify-center shadow-md">
            <ShieldAlert className="w-3.5 h-3.5 text-neon-cyan" />
          </div>
        </div>

        {/* Title */}
        <div className="space-y-1 mb-5">
          <h3 className="text-lg font-black uppercase tracking-wider bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
            Use Restore Shield?
          </h3>
          <p className="text-xs text-zinc-400 font-medium">
            Streak Restoration Confirmation
          </p>
        </div>

        {/* Details Summary Card */}
        <div className="w-full bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 space-y-2.5 text-left mb-6">
          <div className="flex justify-between items-center text-xs">
            <span className="text-zinc-400 font-medium">Target Date:</span>
            <span className="font-bold text-zinc-100">{formattedDate}</span>
          </div>
          <div className="flex justify-between items-center text-xs border-t border-zinc-800/80 pt-2">
            <span className="text-zinc-400 font-medium">Cost:</span>
            <span className="font-bold text-neon-cyan flex items-center gap-1">
              <span>1x Restore Shield</span>
            </span>
          </div>
          <p className="text-[10.5px] text-zinc-400 leading-relaxed border-t border-zinc-800/80 pt-2">
            1 Restore Shield will be consumed from your inventory to revive your streak record for this day.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="flex-1 py-3 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-300 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-neon-cyan via-[#00f3ff] to-neon-green text-zinc-950 font-black text-xs uppercase tracking-wider transition-all hover:shadow-[0_0_25px_rgba(34,211,238,0.4)] hover:scale-[1.02] active:scale-100 cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Confirm</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
