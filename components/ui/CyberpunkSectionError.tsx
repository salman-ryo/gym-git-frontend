'use client';

import React, { useState } from 'react';
import { AlertTriangle, RotateCw } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CyberpunkSectionErrorProps {
  title?: string;
  message?: string | null;
  onRetry?: () => void | Promise<void>;
  className?: string;
}

export default function CyberpunkSectionError({
  title = 'Data Link Offline',
  message = 'Failed to synchronize telemetry matrix with backend mainframe.',
  onRetry,
  className,
}: CyberpunkSectionErrorProps) {
  const [retrying, setRetrying] = useState(false);

  const handleRetryClick = async () => {
    if (!onRetry || retrying) return;
    setRetrying(true);
    try {
      await onRetry();
    } finally {
      setRetrying(false);
    }
  };

  return (
    <div
      className={cn(
        'relative bg-zinc-950/80 border border-red-500/30 backdrop-blur-xl rounded-2xl p-4 sm:p-6 overflow-hidden shadow-[0_4px_30px_rgba(239,68,68,0.15)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group transition-all',
        className
      )}
    >
      {/* Top red glow accent line */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-red-500/40 to-transparent" />

      {/* Futuristic Corner Diamonds */}
      <div className="absolute -top-1 -left-1 w-2 h-2 rotate-45 z-20 rounded-[1px] bg-red-500/70 shadow-[0_0_8px_#ef4444]" />
      <div className="absolute -bottom-1 -right-1 w-2 h-2 rotate-45 z-20 rounded-[1px] bg-red-500/70 shadow-[0_0_8px_#ef4444]" />

      {/* Left content with alert icon */}
      <div className="flex items-start gap-3 sm:gap-4 min-w-0">
        <div className="p-2 sm:p-2.5 rounded-xl bg-red-950/50 border border-red-500/40 text-red-400 shrink-0 shadow-[0_0_12px_rgba(239,68,68,0.2)]">
          <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse" />
        </div>

        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs sm:text-sm font-black text-red-400 uppercase tracking-wider">
              {title}
            </span>
            <span className="text-[9px] font-mono font-bold text-red-500/80 px-1.5 py-0.5 rounded bg-red-950/60 border border-red-500/30 uppercase tracking-widest">
              [ERR_LINK_SEVERED]
            </span>
          </div>

          <p className="text-[11px] sm:text-xs text-zinc-400 font-medium leading-relaxed break-words">
            {message || 'Unable to retrieve live statistics. Other sections continue to function independently.'}
          </p>
        </div>
      </div>

      {/* Action Button: Retry */}
      {onRetry && (
        <button
          type="button"
          onClick={handleRetryClick}
          disabled={retrying}
          className="self-end sm:self-center shrink-0 flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl bg-zinc-900/90 border border-red-500/40 hover:border-neon-cyan/80 hover:bg-neon-cyan/10 text-zinc-200 hover:text-neon-cyan text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-[0_0_15px_rgba(0,0,0,0.4)] hover:shadow-[0_0_15px_rgba(34,211,238,0.25)] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RotateCw
            className={cn('w-3.5 h-3.5', retrying && 'animate-spin text-neon-cyan')}
          />
          <span>{retrying ? 'Re-linking...' : 'Retry Sync'}</span>
        </button>
      )}
    </div>
  );
}

