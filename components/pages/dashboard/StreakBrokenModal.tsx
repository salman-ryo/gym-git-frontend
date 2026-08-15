'use client';

import React, { useState } from 'react';
import { Flame, ShieldAlert, Gift, RefreshCw, AlertTriangle, Check } from 'lucide-react';
import { StreakBrokenEvent } from '@/lib/types';
import { restoreStreak } from '@/lib/streak-service';
import ItemIcon from '@/components/inventory/ItemIcon';

function formatHumanDate(dateStr: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr + 'T00:00:00');
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

interface StreakBrokenModalProps {
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
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen || !event) return null;

  const { previous_streak, broken_on, restore_shields_count } = event;

  const handleRestore = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await restoreStreak(broken_on);
      if (res.success) {
        setSuccess(true);
        // Wait 2 seconds for animation, then refresh and close
        setTimeout(async () => {
          await onRestoreSuccess();
          onClose();
        }, 2200);
      } else {
        setErrorMsg(res.message || 'Failed to restore streak');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'An error occurred during restoration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/85 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="relative w-full max-w-md bg-zinc-950/95 border border-red-500/20 rounded-3xl p-6 sm:p-8 text-center shadow-[0_0_50px_rgba(239,68,68,0.12)] overflow-hidden animate-in scale-in-95 duration-200">
        
        {/* Decorative Top Alert Bar */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-red-600 via-amber-500 to-red-600" />
        
        {/* Animated Cyber Particles */}
        <div className="absolute top-4 left-6 w-2 h-2 rounded-full bg-red-500/20 blur-sm animate-ping" />
        <div className="absolute bottom-6 right-8 w-3 h-3 rounded-full bg-amber-500/10 blur-sm animate-pulse" />

        {success ? (
          /* SUCCESS REVIVAL PANEL */
          <div className="space-y-6 py-6 animate-in zoom-in-95 duration-300">
            <div className="relative flex justify-center">
              <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.2)] animate-pulse">
                <Check className="w-10 h-10 text-emerald-400 stroke-[3]" />
              </div>
              <span className="absolute -top-1 right-12 text-neon-green text-lg animate-ping">✦</span>
              <span className="absolute bottom-0 left-12 text-emerald-400 text-lg animate-bounce">⚡</span>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-2xl font-black uppercase tracking-wider text-emerald-400 drop-shadow-[0_0_12px_rgba(16,185,129,0.4)]">
                Streak Revived!
              </h3>
              <p className="text-xs text-zinc-400 max-w-xs mx-auto">
                Restore Shield successfully consumed. Your {previous_streak}-day record streak is protected and active.
              </p>
            </div>
          </div>
        ) : (
          /* MAIN BROKEN / RECOVERY INTERFACE */
          <div className="space-y-6">
            
            {/* Shattered Flame Header */}
            <div className="relative flex justify-center">
              <div className="relative w-20 h-20 rounded-full bg-red-950/20 border border-red-500/25 flex items-center justify-center shadow-inner">
                <Flame className="w-10 h-10 text-red-500/80 filter grayscale-[20%]" />
                {/* Diagonal crack overlay */}
                <div className="absolute inset-0 border-t-2 border-red-500/30 rotate-[35deg] top-1/2 -translate-y-1/2 w-full scale-x-110 pointer-events-none" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 rounded-md bg-red-950/80 border border-red-500/40 flex items-center justify-center animate-bounce">
                <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
              </div>
            </div>

            <div className="space-y-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-950/60 border border-red-500/35 text-[9px] font-black text-red-400 uppercase tracking-widest animate-pulse">
                ⚠️ Decay Detected
              </span>
              <h2 className="text-2xl font-black text-white tracking-tight uppercase mt-1">
                Streak Broken
              </h2>
              <p className="text-sm text-zinc-400 font-medium leading-relaxed max-w-xs mx-auto">
                Your last streak was <span className="text-red-400 font-extrabold">{previous_streak} days</span> on <span className="text-zinc-200 font-semibold">{formatHumanDate(broken_on)}</span>.
              </p>
            </div>

            {/* Error Message if restore failed */}
            {errorMsg && (
              <div className="p-3 bg-red-950/40 border border-red-500/30 rounded-xl text-red-400 text-xs font-semibold">
                {errorMsg}
              </div>
            )}

            {/* Status / Recovery Actions Container */}
            <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-5 space-y-4">
              
              <div className="flex items-center gap-4 justify-between">
                <div className="flex items-center gap-3 text-left">
                  <div className="w-10 h-10 rounded-xl bg-zinc-950 border border-zinc-850 flex items-center justify-center">
                    <ItemIcon itemId="RESTORE_SHIELD" size={24} />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase text-zinc-300">
                      Restore Shield
                    </h4>
                    <p className="text-[10px] text-zinc-500 font-semibold">
                      Inventory Balance: {restore_shields_count}x
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`px-2 py-0.5 rounded-full border text-[9px] font-black uppercase tracking-wider ${
                    restore_shields_count > 0 
                      ? 'bg-emerald-950/60 border-emerald-500/30 text-emerald-400'
                      : 'bg-red-950/60 border-red-500/30 text-red-400'
                  }`}>
                    {restore_shields_count > 0 ? 'Available' : 'Unavailable'}
                  </span>
                </div>
              </div>

              {restore_shields_count > 0 ? (
                /* OPTION A: REDEEM SHIELD */
                <div className="space-y-3">
                  <p className="text-[10.5px] text-zinc-400 leading-normal">
                    Redeem one Restore Shield to rescue your streak. This will revert the decay and count your active split as protected.
                  </p>
                  <button
                    type="button"
                    onClick={handleRestore}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-red-600 via-amber-500 to-red-600 hover:shadow-[0_0_20px_rgba(239,68,68,0.3)] text-zinc-950 font-black py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 uppercase tracking-wider cursor-pointer"
                  >
                    {loading ? (
                      <RefreshCw className="w-4 h-4 animate-spin text-zinc-950" />
                    ) : (
                      <ShieldAlert className="w-4 h-4 text-zinc-950" />
                    )}
                    <span>Consume Restore Shield</span>
                  </button>
                </div>
              ) : (
                /* OPTION B: ROADMAP LINK */
                <div className="space-y-3 pt-1">
                  <p className="text-[10.5px] text-zinc-400 leading-normal">
                    You have no Restore Shields left. Access the Streak Reward Roadmap to unlock shields at upcoming milestones.
                  </p>
                  <button
                    type="button"
                    onClick={onOpenRoadmap}
                    className="w-full bg-zinc-950 hover:bg-zinc-900 hover:text-white text-zinc-300 border border-zinc-800 font-black py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all duration-200 uppercase tracking-wider cursor-pointer shadow-sm"
                  >
                    <Gift className="w-4 h-4 text-neon-cyan" />
                    <span>Open Reward Roadmap</span>
                  </button>
                </div>
              )}

            </div>

            {/* Standard Dismiss Button */}
            <button
              type="button"
              onClick={onClose}
              className="text-[11px] font-black uppercase text-zinc-500 hover:text-zinc-300 tracking-widest cursor-pointer transition-colors pt-2"
            >
              Start New Streak (Acknowledge)
            </button>

          </div>
        )}

      </div>
    </div>
  );
}
