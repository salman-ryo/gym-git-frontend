'use client';

import React from 'react';
import { ShieldAlert, Check, Loader2 } from 'lucide-react';
import ItemIcon from '@/components/inventory/ItemIcon';
import { formatDisplayDate } from '@/lib/date-utils';
import ModalShell from '@/components/ui/modal-shell';

export interface RestoreConfirmModalProps {
  isOpen: boolean;
  dateStr: string | null;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function RestoreConfirmModal({
  isOpen,
  dateStr,
  onConfirm,
  onCancel,
  loading = false,
}: RestoreConfirmModalProps) {
  if (!isOpen || !dateStr) return null;

  const formattedDate = formatDisplayDate(dateStr, { showToday: true, includeYear: true });

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onCancel}
      maxWidth="sm"
      className="text-center flex flex-col items-center"
      closeOnEscape={!loading}
      closeOnBackdropClick={!loading}
    >
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
    </ModalShell>
  );
}
