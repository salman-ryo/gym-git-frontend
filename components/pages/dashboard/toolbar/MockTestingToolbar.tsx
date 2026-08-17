'use client';

import React from 'react';
import { Stats } from '@/lib/types';
import {
  Sparkles,
  Database,
  RotateCcw,
  Loader2,
  Snowflake,
  AlertTriangle,
  ShieldAlert,
} from 'lucide-react';
import Image from 'next/image';

export interface MockTestingToolbarProps {
  isMockActive: boolean;
  onActivateMock: () => void;
  onResetRealData: () => void;
  stats: Stats | null;
  onToggleFreezeMock: () => void;
  onToggleStreakWarning: () => void;
  onToggleStreakBroken: () => void;
  onSeedToBackend: () => void | Promise<void>;
  isSeeding: boolean;
  seedProgress?: string;
}

/**
 * 365-Day Mock Data Testing Suite & Interactive Simulator Toolbar
 */
export function MockTestingToolbar({
  isMockActive,
  onActivateMock,
  onResetRealData,
  stats,
  onToggleFreezeMock,
  onToggleStreakWarning,
  onToggleStreakBroken,
  onSeedToBackend,
  isSeeding,
  seedProgress = '',
}: MockTestingToolbarProps) {
  return (
    <div className="bg-zinc-900/60 border border-zinc-700/60 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-neon-green/10 border border-neon-green/30 flex items-center justify-center">
          <Image
            src="/images/icons/git.png"
            alt="Mock Engine"
            width={100}
            height={100}
            unoptimized
            className="size-6"
          />
        </div>
        <div>
          <p className="text-xs font-bold text-zinc-200 flex items-center gap-2 m-0">
            <span>365-Day Mock Data Testing Suite</span>
            {isMockActive && (
              <span className="px-2 py-0.5 rounded-full bg-neon-green/10 border border-neon-green/30 text-[10px] font-extrabold text-neon-green">
                ACTIVE PREVIEW
              </span>
            )}
          </p>
          <p className="text-[11px] text-zinc-400 m-0">
            {isMockActive
              ? 'Populated ~300 workout sessions (all < 2 hours) across 365 days'
              : 'Toggle 365-day colored preview for screenshots or seed to database'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2.5 flex-wrap">
        {!isMockActive ? (
          <button
            type="button"
            onClick={onActivateMock}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-neon-green to-[#00e077] text-[#060a0e] text-xs font-extrabold shadow-[0_0_20px_rgba(0,255,136,0.35)] hover:scale-[1.02] active:scale-100 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Fill 365-Day Graph (&lt;2h)</span>
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={onResetRealData}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold border border-zinc-700 transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-zinc-400" />
              <span>Reset Real Data</span>
            </button>
            <button
              type="button"
              onClick={onToggleFreezeMock}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-cyan-400 text-xs font-semibold border border-zinc-700 transition-all cursor-pointer"
            >
              <Snowflake className="w-3.5 h-3.5 shrink-0" />
              <span>{stats?.isFrozen ? 'Unfreeze Mock' : 'Freeze Mock'}</span>
            </button>
            <button
              type="button"
              onClick={onToggleStreakWarning}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-amber-400 text-xs font-semibold border border-zinc-700 transition-all cursor-pointer"
            >
              <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-400" />
              <span>{stats?.streakWarningEvent ? 'Clear Warning' : 'Trigger Warning'}</span>
            </button>
            <button
              type="button"
              onClick={onToggleStreakBroken}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-red-400 text-xs font-semibold border border-zinc-700 transition-all cursor-pointer"
            >
              <ShieldAlert className="w-3.5 h-3.5 shrink-0 text-red-400" />
              <span>{stats?.streakBrokenEvent ? 'Clear Broken' : 'Trigger Broken'}</span>
            </button>
          </>
        )}

        <button
          type="button"
          onClick={onSeedToBackend}
          disabled={isSeeding}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-300 hover:text-white text-xs font-semibold border border-zinc-700/80 transition-all cursor-pointer disabled:opacity-50"
        >
          {isSeeding ? (
            <>
              <Loader2 className="w-3.5 h-3.5 text-neon-green animate-spin" />
              <span>{seedProgress || 'Seeding...'}</span>
            </>
          ) : (
            <>
              <Database className="w-3.5 h-3.5 text-neon-cyan" />
              <span>Save to Backend DB</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default MockTestingToolbar;
