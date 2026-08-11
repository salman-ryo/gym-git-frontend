'use client';

import React, { useEffect, useState } from 'react';
import { Snowflake, Play, AlertTriangle, Loader2 } from 'lucide-react';
import { ActiveItemEffect } from '@/lib/types';
import { unfreezeStreak } from '@/lib/streak-service';

interface FrozenStateBannerProps {
  isFrozen: boolean;
  activeEffects: ActiveItemEffect[];
  onUnfreezeSuccess: () => Promise<void>;
}

function formatDuration(totalSeconds: number): string {
  if (totalSeconds <= 0) return 'Expired';
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0 || days > 0) parts.push(`${hours}h`);
  if (minutes > 0 || hours > 0 || days > 0) parts.push(`${minutes}m`);
  parts.push(`${seconds}s`);

  return parts.join(' ');
}

export default function FrozenStateBanner({
  isFrozen,
  activeEffects,
  onUnfreezeSuccess,
}: FrozenStateBannerProps) {
  const freezeEffect = activeEffects.find((e) => e.item_id === 'STREAK_FREEZE_TOKEN');
  const [remainingSeconds, setRemainingSeconds] = useState<number>(
    freezeEffect ? freezeEffect.remaining_seconds : 0
  );
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [isResuming, setIsResuming] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sync remaining seconds if parent changes it
  useEffect(() => {
    if (freezeEffect) {
      setRemainingSeconds(freezeEffect.remaining_seconds);
    }
  }, [freezeEffect]);

  // Timer ticking
  useEffect(() => {
    if (!isFrozen || remainingSeconds <= 0) return;

    const interval = setInterval(() => {
      setRemainingSeconds((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [isFrozen, remainingSeconds]);

  if (!isFrozen) return null;

  const handleUnfreeze = async () => {
    setIsResuming(true);
    setErrorMsg(null);
    try {
      await unfreezeStreak();
      await onUnfreezeSuccess();
      setShowConfirm(false);
    } catch (err: any) {
      console.error('Failed to manually unfreeze:', err);
      setErrorMsg(err.message || 'Failed to resume streak. Please try again.');
    } finally {
      setIsResuming(false);
    }
  };

  return (
    <div className="w-full relative rounded-2xl overflow-hidden border border-neon-cyan/30 bg-gradient-to-r from-cyan-950/40 via-zinc-950/70 to-cyan-950/40 backdrop-blur-2xl shadow-[0_0_30px_rgba(34,211,238,0.12)] p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4 animate-in fade-in duration-300">
      
      {/* Visual background freeze highlights */}
      <div className="absolute top-0 bottom-0 left-0 w-1 bg-neon-cyan shadow-[0_0_10px_#22d3ee]" />
      
      {/* Icon + Title/Sub */}
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-neon-cyan/15 border border-neon-cyan/40 flex items-center justify-center text-neon-cyan shrink-0 animate-pulse">
          <Snowflake className="w-5 h-5" />
        </div>
        <div className="space-y-1 text-left">
          <h4 className="text-xs font-black uppercase tracking-wider text-neon-cyan flex items-center gap-2">
            <span>Ice Pause Active</span>
            {remainingSeconds > 0 && (
              <span className="px-2 py-0.5 rounded-md bg-neon-cyan/10 border border-neon-cyan/30 text-[10px] font-mono text-neon-cyan font-bold">
                {formatDuration(remainingSeconds)} left
              </span>
            )}
          </h4>
          <p className="text-[11px] text-zinc-300 font-medium leading-relaxed max-w-xl">
            Streak decay is temporarily paused. Your current streak is safe. Dashboard workout requirements are suspended.
          </p>
        </div>
      </div>

      {/* Manual Unfreeze actions */}
      <div className="w-full md:w-auto shrink-0 z-10">
        {showConfirm ? (
          <div className="flex flex-col sm:flex-row items-center gap-2.5 bg-zinc-950/80 border border-neon-cyan/20 p-2.5 rounded-xl animate-in slide-in-from-right-3 duration-250">
            <div className="flex items-center gap-1.5 text-[10.5px] font-bold text-cyan-200">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Resume workout track?</span>
            </div>
            <div className="flex gap-2 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={handleUnfreeze}
                disabled={isResuming}
                className="px-3 py-1.5 rounded-lg bg-neon-cyan hover:bg-[#00f3ff] text-zinc-950 text-[10.5px] font-black uppercase transition-all flex items-center gap-1 cursor-pointer"
              >
                {isResuming ? <Loader2 className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}
                <span>Yes, Resume</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowConfirm(false);
                  setErrorMsg(null);
                }}
                disabled={isResuming}
                className="px-3 py-1.5 rounded-lg bg-zinc-850 hover:bg-zinc-800 text-zinc-300 text-[10.5px] font-extrabold uppercase transition-all cursor-pointer"
              >
                Cancel
              </button>
            </div>
            {errorMsg && (
              <span className="text-[9px] text-red-400 block mt-1">{errorMsg}</span>
            )}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowConfirm(true)}
            className="w-full md:w-auto px-5 py-2.5 rounded-xl border border-neon-cyan/40 hover:border-neon-cyan bg-neon-cyan/10 hover:bg-neon-cyan text-neon-cyan hover:text-zinc-950 text-xs font-black uppercase tracking-wider transition-all duration-300 hover:scale-[1.03] active:scale-100 flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(34,211,238,0.15)]"
          >
            <Play className="w-3.5 h-3.5 shrink-0" />
            <span>Resume Streak</span>
          </button>
        )}
      </div>

    </div>
  );
}
