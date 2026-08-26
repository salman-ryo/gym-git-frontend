'use client';

import React, { useState } from 'react';
import { Flame, ShieldAlert, Gift, RefreshCw, AlertTriangle, Check, ShieldCheck, Zap } from 'lucide-react';
import { StreakBrokenEvent } from '@/lib/types';
import { restoreStreak } from '@/lib/streak-service';
import { formatFullDate } from '@/lib/date-utils';
import ModalShell from '@/components/ui/modal-shell';

import { useInventory } from '@/lib/inventory-context';

export interface StreakBrokenModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: StreakBrokenEvent | null;
  onRestoreSuccess: () => Promise<void>;
  onOpenRoadmap: () => void;
}

export default function StreakBrokenModal({
  isOpen,
  onClose,
  event,
  onRestoreSuccess,
  onOpenRoadmap,
}: StreakBrokenModalProps) {
  const { consumeItem } = useInventory();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen || !event) return null;

  const {
    previous_streak,
    last_streak_date,
    broken_on,
    missed_days_count = 1,
    required_shields = 1,
    restore_shield_available,
    restore_shields_count,
    missed_dates = [broken_on],
  } = event;

  const displayDate = last_streak_date || broken_on;
  const isRecoverable = restore_shield_available && restore_shields_count >= required_shields && required_shields <= 9;

  const handleRestore = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const targetPayload = missed_dates && missed_dates.length > 0 ? missed_dates : [broken_on];
      const res = await restoreStreak(targetPayload);
      if (res.success) {
        consumeItem('RESTORE_SHIELD', required_shields);
        setSuccess(true);
        setTimeout(async () => {
          await onRestoreSuccess();
          onClose();
        }, 2200);
      } else {
        setErrorMsg(res.message || 'Failed to restore streak');
      }
    } catch (err: unknown) {
      console.error('Streak restoration error:', err);
      setErrorMsg(err instanceof Error ? err.message : 'An error occurred during restoration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="md"
      accentGradient={
        isRecoverable
          ? 'bg-gradient-to-r from-amber-500 via-neon-cyan to-teal-400'
          : 'bg-gradient-to-r from-red-600 via-rose-500 to-red-600'
      }
      errorMsg={errorMsg}
      showCloseButton={false}
      className={isRecoverable ? 'border-neon-cyan/30 text-center' : 'border-red-500/30 text-center'}
    >
      {/* Animated Cyber Ambient Particles */}
      <div
        className={`absolute top-4 left-6 w-2.5 h-2.5 rounded-full blur-sm animate-ping pointer-events-none ${
          isRecoverable ? 'bg-neon-cyan/30' : 'bg-red-500/20'
        }`}
      />
      <div
        className={`absolute bottom-6 right-8 w-3 h-3 rounded-full blur-sm animate-pulse pointer-events-none ${
          isRecoverable ? 'bg-teal-400/20' : 'bg-amber-500/10'
        }`}
      />

      {success ? (
        /* SUCCESS REVIVAL PANEL */
        <div className="space-y-6 py-6 animate-in zoom-in-95 duration-300">
          <div className="relative flex justify-center">
            <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.3)] animate-pulse">
              <Check className="w-10 h-10 text-emerald-400 stroke-[3]" />
            </div>
            <span className="absolute -top-1 right-12 text-neon-green text-lg animate-ping">✦</span>
            <span className="absolute bottom-0 left-12 text-emerald-400 text-lg animate-bounce">⚡</span>
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-black uppercase tracking-wider text-emerald-400 drop-shadow-[0_0_12px_rgba(16,185,129,0.4)]">
              Streak Revived!
            </h3>
            <p className="text-xs text-zinc-300 max-w-xs mx-auto">
              {required_shields} Restore {required_shields === 1 ? 'Shield' : 'Shields'} successfully consumed. Your {previous_streak}-day record streak is fully protected and active.
            </p>
          </div>
        </div>
      ) : isRecoverable ? (
        /* =========================================================
           STATE A: STREAK RECOVERABLE (User has enough shields)
           ========================================================= */
        <div className="space-y-5">
          {/* Header Badge & Icon */}
          <div className="relative flex justify-center">
            <div className="relative w-20 h-20 rounded-2xl bg-zinc-950 border border-neon-cyan/40 flex items-center justify-center shadow-[0_0_25px_rgba(34,211,238,0.25)]">
              <ShieldCheck className="w-10 h-10 text-neon-cyan animate-pulse" />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 rounded-md bg-zinc-950 border border-neon-cyan/50 flex items-center justify-center animate-bounce">
              <Zap className="w-3.5 h-3.5 text-neon-cyan" />
            </div>
          </div>

          <div className="space-y-1.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-neon-cyan/10 border border-neon-cyan/40 text-[9.5px] font-black text-neon-cyan uppercase tracking-widest">
              ⚡ Streak Recoverable
            </span>
            <h2 className="text-2xl font-black text-white tracking-tight uppercase">
              Rescue Your Streak
            </h2>
            <p className="text-xs text-zinc-300 font-medium leading-relaxed max-w-xs mx-auto">
              Your previous streak was <strong className="text-neon-cyan font-black">{previous_streak} days</strong> on <span className="text-zinc-100 font-semibold">{formatFullDate(displayDate)}</span>.
            </p>
          </div>

          {/* Diagnosis & Breakdown Card */}
          <div className="bg-zinc-950/70 border border-zinc-800 rounded-2xl p-4 space-y-3 text-left">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-zinc-850">
              <span className="text-zinc-400 font-semibold">Missed Period:</span>
              <span className="font-bold text-zinc-200">
                {missed_days_count} {missed_days_count === 1 ? 'Day' : 'Days'} Gap
              </span>
            </div>

            <div className="flex items-center justify-between text-xs pb-2 border-b border-zinc-850">
              <span className="text-zinc-400 font-semibold">Shields Required:</span>
              <span className="font-black text-amber-400">{required_shields}x Restore Shields</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400 font-semibold">Your Inventory:</span>
              <span className="font-black text-emerald-400 flex items-center gap-1">
                <span>{restore_shields_count}x Available</span>
                <span className="text-[10px] text-emerald-500 font-mono">(✓ Sufficient)</span>
              </span>
            </div>

            <p className="text-[11px] text-zinc-400 leading-relaxed pt-2 border-t border-zinc-850">
              Redeeming <strong>{required_shields} Restore {required_shields === 1 ? 'Shield' : 'Shields'}</strong> will create protected historical sessions for all {missed_days_count} missed days and restore your full {previous_streak}-day record.
            </p>
          </div>

          {/* Action Button */}
          <div className="space-y-2 pt-1">
            <button
              type="button"
              onClick={handleRestore}
              disabled={loading}
              className="w-full bg-gradient-to-r from-neon-cyan via-[#00f3ff] to-emerald-400 hover:shadow-[0_0_25px_rgba(34,211,238,0.4)] text-zinc-950 font-black py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all duration-200 uppercase tracking-wider cursor-pointer"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin text-zinc-950" />
              ) : (
                <ShieldAlert className="w-4 h-4 text-zinc-950" />
              )}
              <span>Consume {required_shields}x Restore {required_shields === 1 ? 'Shield' : 'Shields'} (Revive Streak)</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2 text-[10.5px] font-black uppercase text-zinc-500 hover:text-zinc-300 tracking-widest cursor-pointer transition-colors"
            >
              Start New Streak (Acknowledge & Dismiss)
            </button>
          </div>
        </div>
      ) : (
        /* =========================================================
           STATE B: STREAK UNRECOVERABLE (Insufficient shields / >9 days)
           ========================================================= */
        <div className="space-y-5">
          {/* Shattered Flame Header */}
          <div className="relative flex justify-center">
            <div className="relative w-20 h-20 rounded-full bg-red-950/20 border border-red-500/25 flex items-center justify-center shadow-inner">
              <Flame className="w-10 h-10 text-red-500/80 filter grayscale-[20%]" />
              <div className="absolute inset-0 border-t-2 border-red-500/30 rotate-[35deg] top-1/2 -translate-y-1/2 w-full scale-x-110 pointer-events-none" />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 rounded-md bg-red-950/80 border border-red-500/40 flex items-center justify-center animate-bounce">
              <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
            </div>
          </div>

          <div className="space-y-1.5">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-950/60 border border-red-500/35 text-[9px] font-black text-red-400 uppercase tracking-widest">
              ⚠️ Decay Detected • Unrecoverable
            </span>
            <h2 className="text-2xl font-black text-white tracking-tight uppercase">
              Streak Broken
            </h2>
            <p className="text-xs text-zinc-400 font-medium leading-relaxed max-w-xs mx-auto">
              Your previous streak was <span className="text-red-400 font-extrabold">{previous_streak} days</span> on <span className="text-zinc-200 font-semibold">{formatFullDate(displayDate)}</span> ({missed_days_count} {missed_days_count === 1 ? 'day' : 'days'} ago).
            </p>
          </div>

          {/* Insufficient Shields / Unrecoverable Card */}
          <div className="bg-zinc-950/70 border border-zinc-800 rounded-2xl p-4 space-y-3 text-left">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-zinc-850">
              <span className="text-zinc-400 font-semibold">Missed Period:</span>
              <span className="font-bold text-zinc-300">
                {missed_days_count} {missed_days_count === 1 ? 'Day' : 'Days'} Inactive
              </span>
            </div>

            <div className="flex items-center justify-between text-xs pb-2 border-b border-zinc-850">
              <span className="text-zinc-400 font-semibold">Shields Required:</span>
              <span className="font-black text-red-400">{required_shields}x Restore Shields</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400 font-semibold">Your Inventory:</span>
              <span className="font-black text-zinc-400 flex items-center gap-1">
                <span>{restore_shields_count}x Available</span>
                <span className="text-[10px] text-red-400 font-mono">(✗ Insufficient)</span>
              </span>
            </div>

            <p className="text-[11px] text-zinc-400 leading-relaxed pt-2 border-t border-zinc-850">
              {required_shields > 9 ? (
                <>You have missed {missed_days_count} days, which exceeds the maximum 9-day shield capacity. This streak cannot be restored.</>
              ) : (
                <>You missed {missed_days_count} days, which requires <strong>{required_shields} Restore Shields</strong> to bridge. Because you have only <strong>{restore_shields_count}x</strong> in your inventory, this streak cannot be restored (partial restore is not supported).</>
              )}
            </p>
          </div>

          {/* Unrecoverable Actions */}
          <div className="space-y-2.5 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="w-full bg-zinc-100 hover:bg-white text-zinc-950 font-black py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all duration-200 uppercase tracking-wider cursor-pointer shadow-sm"
            >
              <Zap className="w-4 h-4 text-zinc-950" />
              <span>Start New Streak (Acknowledge)</span>
            </button>

            <button
              type="button"
              onClick={onOpenRoadmap}
              className="w-full bg-zinc-950 hover:bg-zinc-900 hover:text-white text-zinc-300 border border-zinc-800 font-black py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all duration-200 uppercase tracking-wider cursor-pointer shadow-sm"
            >
              <Gift className="w-4 h-4 text-neon-cyan" />
              <span>View Reward Roadmap (Earn Shields)</span>
            </button>
          </div>
        </div>
      )}
    </ModalShell>
  );
}
