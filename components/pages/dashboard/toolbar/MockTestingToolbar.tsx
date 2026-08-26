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
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);

  return (
    <div className="bg-zinc-900/60 border border-zinc-700/60 p-3 sm:p-4 rounded-2xl backdrop-blur-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-neon-green/10 border border-neon-green/30 flex items-center justify-center shrink-0">
              <Image
                src="/images/icons/git.png"
                alt="Mock Engine"
                width={100}
                height={100}
                unoptimized
                className="size-5 sm:size-6"
              />
            </div>
            <div>
              <p className="text-xs font-bold text-zinc-200 flex items-center gap-1.5 sm:gap-2 m-0">
                <span>Mock Data Testing Suite</span>
                {isMockActive && (
                  <span className="px-1.5 sm:px-2 py-0.5 rounded-full bg-neon-green/10 border border-neon-green/30 text-[9px] sm:text-[10px] font-extrabold text-neon-green">
                    PREVIEW
                  </span>
                )}
              </p>
              <p className="text-[10px] sm:text-[11px] text-zinc-400 m-0 hidden sm:block">
                {isMockActive
                  ? 'Populated ~300 workout sessions (all < 2 hours) across 365 days'
                  : 'Toggle 365-day colored preview for screenshots or seed to database'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsMobileOpen((prev) => !prev)}
            className="sm:hidden text-xs font-bold text-neon-cyan px-3 py-1.5 rounded-xl bg-neon-cyan/10 border border-neon-cyan/20 cursor-pointer min-h-[36px] flex items-center justify-center transition-colors hover:bg-neon-cyan/20"
          >
            {isMobileOpen ? 'Hide' : 'Actions'}
          </button>
        </div>

        <div className={`${isMobileOpen ? 'grid grid-cols-2 sm:flex' : 'hidden sm:flex'} items-center gap-2 sm:gap-2.5 flex-wrap pt-2.5 sm:pt-0 border-t sm:border-t-0 border-zinc-800`}>
          {!isMockActive ? (
            <button
              type="button"
              onClick={onActivateMock}
              className="col-span-2 sm:col-span-1 inline-flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-neon-green to-[#00e077] text-[#060a0e] text-[11px] sm:text-xs font-extrabold shadow-[0_0_20px_rgba(0,255,136,0.35)] hover:scale-[1.02] active:scale-100 transition-all cursor-pointer min-h-[38px]"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Fill 365-Day Graph (&lt;2h)</span>
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={onResetRealData}
                className="inline-flex items-center justify-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[11px] sm:text-xs font-semibold border border-zinc-700 transition-all cursor-pointer min-h-[36px] sm:min-h-[38px]"
              >
                <RotateCcw className="w-3 h-3 text-zinc-400" />
                <span>Reset Real Data</span>
              </button>
              <button
                type="button"
                onClick={onToggleFreezeMock}
                className="inline-flex items-center justify-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-cyan-400 text-[11px] sm:text-xs font-semibold border border-zinc-700 transition-all cursor-pointer min-h-[36px] sm:min-h-[38px]"
              >
                <Snowflake className="w-3 h-3 shrink-0" />
                <span>{stats?.isFrozen ? 'Unfreeze' : 'Freeze'}</span>
              </button>
              <button
                type="button"
                onClick={onToggleStreakWarning}
                className="inline-flex items-center justify-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-amber-400 text-[11px] sm:text-xs font-semibold border border-zinc-700 transition-all cursor-pointer min-h-[36px] sm:min-h-[38px]"
              >
                <AlertTriangle className="w-3 h-3 shrink-0 text-amber-400" />
                <span>{stats?.streakWarningEvent ? 'Clear Risk' : 'Risk'}</span>
              </button>
              <button
                type="button"
                onClick={onToggleStreakBroken}
                className="inline-flex items-center justify-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-red-400 text-[11px] sm:text-xs font-semibold border border-zinc-700 transition-all cursor-pointer min-h-[36px] sm:min-h-[38px]"
              >
                <ShieldAlert className="w-3 h-3 shrink-0 text-red-400" />
                <span>{stats?.streakBrokenEvent ? 'Clear Broken' : 'Broken'}</span>
              </button>
            </>
          )}

          <button
            type="button"
            onClick={onSeedToBackend}
            disabled={isSeeding}
            className="col-span-2 sm:col-span-1 inline-flex items-center justify-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-300 hover:text-white text-[11px] sm:text-xs font-semibold border border-zinc-700/80 transition-all cursor-pointer disabled:opacity-50 min-h-[36px] sm:min-h-[38px]"
          >
            {isSeeding ? (
              <>
                <Loader2 className="w-3 h-3 text-neon-green animate-spin" />
                <span>{seedProgress || 'Seeding...'}</span>
              </>
            ) : (
              <>
                <Database className="w-3 h-3 text-neon-cyan" />
                <span>Save to Backend DB</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default MockTestingToolbar;
