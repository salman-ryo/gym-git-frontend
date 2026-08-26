'use client';

import React, { useState, useEffect } from 'react';
import { Snowflake, Play, AlertCircle } from 'lucide-react';
import { ActiveItemEffect } from '@/lib/types';
import { unfreezeStreak } from '@/lib/streak-service';

interface FrozenStateBannerProps {
  isFrozen: boolean;
  activeEffects: ActiveItemEffect[];
  onUnfreezeSuccess: () => Promise<void>;
}

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h}h ${m.toString().padStart(2, '0')}m ${s.toString().padStart(2, '0')}s`;
}

export default function FrozenStateBanner({
  isFrozen,
  activeEffects,
  onUnfreezeSuccess,
}: FrozenStateBannerProps) {
  const freezeEffect = activeEffects.find((e) => e.item_id === 'STREAK_FREEZE_TOKEN');
  const [remainingSeconds, setRemainingSeconds] = useState<number>(() => freezeEffect ? freezeEffect.remaining_seconds : 0);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [isResuming, setIsResuming] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Timer ticking
  useEffect(() => {
    if (!isFrozen) return;

    const interval = setInterval(() => {
      setRemainingSeconds((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [isFrozen]);

  if (!isFrozen) return null;

  const handleUnfreeze = async () => {
    setIsResuming(true);
    setErrorMsg(null);
    try {
      await unfreezeStreak();
      await onUnfreezeSuccess();
      setShowConfirm(false);
    } catch (err: unknown) {
      console.error('Failed to manually unfreeze:', err);
      setErrorMsg(err instanceof Error ? err.message : 'Failed to resume streak. Please try again.');
    } finally {
      setIsResuming(false);
    }
  };

  return (
    <aside aria-label="Streak frozen warning" className="w-full relative overflow-hidden rounded-2xl border border-cyan-500/40 bg-gradient-to-r from-cyan-950/80 via-blue-950/60 to-cyan-950/80 backdrop-blur-xl p-4 sm:p-5 md:p-6 shadow-[0_0_40px_rgba(6,182,212,0.25)]">
      {/* Background Frost Glow */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Left Side: Status & Description */}
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="relative p-2.5 sm:p-3 rounded-xl bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.3)] shrink-0 animate-pulse">
            <Snowflake className="w-5 h-5 sm:w-7 sm:h-7" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 flex-wrap">
              <span className="text-[10px] sm:text-xs font-black tracking-widest px-2 sm:px-2.5 py-0.5 rounded-full bg-cyan-400/20 border border-cyan-400/40 text-cyan-300 uppercase">
                ICE PAUSE ACTIVE
              </span>
              <span className="text-[10px] sm:text-xs font-mono font-bold text-cyan-200">
                {formatTime(remainingSeconds)} REMAINING
              </span>
            </div>

            <h3 className="text-sm sm:text-base font-black text-cyan-100 tracking-wide">
              Your Streak is Protected by Sickness Freeze Vault
            </h3>
            <p className="text-xs sm:text-sm text-cyan-200/80 max-w-2xl mt-0.5 leading-relaxed">
              Streak decay and penalty resets are currently paused while you recover. Log a workout anytime to automatically resume, or resume manually below.
            </p>

            {errorMsg && (
              <div className="flex items-center gap-1.5 text-xs text-rose-400 font-semibold mt-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Action Button */}
        <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center gap-2.5 sm:gap-3 self-stretch sm:self-center shrink-0">
          {!showConfirm ? (
            <button
              onClick={() => setShowConfirm(true)}
              className="w-full sm:w-auto min-h-[40px] sm:min-h-[44px] px-4 sm:px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 hover:border-cyan-300 text-cyan-100 hover:text-white transition-all shadow-[0_0_20px_rgba(6,182,212,0.2)] hover:shadow-[0_0_25px_rgba(6,182,212,0.4)] flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Resume Streak</span>
            </button>
          ) : (
            <div className="w-full sm:w-auto flex items-center gap-2 bg-cyan-950/90 border border-cyan-400/50 p-1.5 rounded-xl shadow-lg">
              <button
                disabled={isResuming}
                onClick={handleUnfreeze}
                className="flex-1 sm:flex-initial min-h-[36px] sm:min-h-[40px] px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-zinc-950 transition-all shadow-md disabled:opacity-50 cursor-pointer"
              >
                {isResuming ? 'Resuming...' : 'Confirm Resume'}
              </button>
              <button
                disabled={isResuming}
                onClick={() => setShowConfirm(false)}
                className="min-h-[36px] sm:min-h-[40px] px-3 py-2 rounded-lg text-xs font-bold text-cyan-300 hover:text-white hover:bg-cyan-900/50 transition-all cursor-pointer"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Subtle Bottom Accent Indicator */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-50" />
    </aside>
  );
}
