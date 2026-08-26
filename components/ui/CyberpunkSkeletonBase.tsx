'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface CyberpunkSkeletonBaseProps extends React.HTMLAttributes<HTMLDivElement> {
  cornerDiamonds?: boolean;
  accentColor?: 'cyan' | 'green' | 'purple' | 'amber' | 'zinc';
  hasScanline?: boolean;
}

export function CyberpunkSkeletonBase({
  className,
  children,
  cornerDiamonds = true,
  accentColor = 'cyan',
  hasScanline = true,
  ...props
}: CyberpunkSkeletonBaseProps) {
  const accentBorder = {
    cyan: 'border-neon-cyan/20',
    green: 'border-neon-green/20',
    purple: 'border-neon-purple/20',
    amber: 'border-amber-400/20',
    zinc: 'border-zinc-800',
  }[accentColor];

  const accentDiamond = {
    cyan: 'bg-neon-cyan/60 shadow-[0_0_8px_rgba(34,211,238,0.4)]',
    green: 'bg-neon-green/60 shadow-[0_0_8px_rgba(0,255,136,0.4)]',
    purple: 'bg-neon-purple/60 shadow-[0_0_8px_rgba(168,85,247,0.4)]',
    amber: 'bg-amber-400/60 shadow-[0_0_8px_rgba(251,191,36,0.4)]',
    zinc: 'bg-zinc-700 shadow-none',
  }[accentColor];

  const accentTopBar = {
    cyan: 'bg-gradient-to-r from-transparent via-neon-cyan/25 to-transparent',
    green: 'bg-gradient-to-r from-transparent via-neon-green/25 to-transparent',
    purple: 'bg-gradient-to-r from-transparent via-neon-purple/25 to-transparent',
    amber: 'bg-gradient-to-r from-transparent via-amber-400/25 to-transparent',
    zinc: 'bg-gradient-to-r from-transparent via-zinc-700 to-transparent',
  }[accentColor];

  return (
    <div
      className={cn(
        'relative bg-zinc-950/80 border backdrop-blur-xl rounded-2xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.6)]',
        accentBorder,
        className
      )}
      {...props}
    >
      {/* Top subtle ambient glow line */}
      <div className={cn('absolute top-0 inset-x-0 h-[1px]', accentTopBar)} />

      {/* Cyber Corner Diamonds */}
      {cornerDiamonds && (
        <>
          <div
            className={cn(
              'absolute -top-1 -left-1 w-2 h-2 rotate-45 z-20 rounded-[1px]',
              accentDiamond
            )}
          />
          <div
            className={cn(
              'absolute -bottom-1 -right-1 w-2 h-2 rotate-45 z-20 rounded-[1px]',
              accentDiamond
            )}
          />
        </>
      )}

      {/* Shimmer / Scanline Overlay */}
      {hasScanline && (
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-zinc-700/10 to-transparent"
        />
      )}

      {children}
    </div>
  );
}

export interface CyberpunkShimmerBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  glow?: boolean;
}

export function CyberpunkShimmerBlock({
  className,
  glow = false,
  ...props
}: CyberpunkShimmerBlockProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-lg bg-zinc-900/80 border border-zinc-800/60',
        glow && 'shadow-[0_0_12px_rgba(34,211,238,0.1)]',
        className
      )}
      {...props}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-zinc-700/20 to-transparent"
      />
    </div>
  );
}

