'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface AdminStatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  colorScheme?: 'neon' | 'cyan' | 'purple' | 'amber' | 'emerald' | 'rose';
  trend?: {
    value: string | number;
    isPositive?: boolean;
    label?: string;
  };
}

export function AdminStatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  colorScheme = 'neon',
  trend,
}: AdminStatCardProps) {
  const schemeStyles = {
    neon: {
      border: 'hover:border-neon-green/40 hover:shadow-[0_0_20px_rgba(0,255,136,0.15)]',
      iconBg: 'bg-emerald-950/40 border-emerald-500/30 text-neon-green',
      glow: 'from-emerald-500/10 to-transparent',
    },
    cyan: {
      border: 'hover:border-cyan-400/40 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)]',
      iconBg: 'bg-cyan-950/40 border-cyan-500/30 text-cyan-400',
      glow: 'from-cyan-500/10 to-transparent',
    },
    purple: {
      border: 'hover:border-purple-500/40 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)]',
      iconBg: 'bg-purple-950/40 border-purple-500/30 text-purple-400',
      glow: 'from-purple-500/10 to-transparent',
    },
    amber: {
      border: 'hover:border-amber-500/40 hover:shadow-[0_0_20px_rgba(245,158,11,0.15)]',
      iconBg: 'bg-amber-950/40 border-amber-500/30 text-amber-400',
      glow: 'from-amber-500/10 to-transparent',
    },
    emerald: {
      border: 'hover:border-emerald-500/40 hover:shadow-[0_0_20px_rgba(16,185,129,0.15)]',
      iconBg: 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400',
      glow: 'from-emerald-500/10 to-transparent',
    },
    rose: {
      border: 'hover:border-rose-500/40 hover:shadow-[0_0_20px_rgba(244,63,94,0.15)]',
      iconBg: 'bg-rose-950/40 border-rose-500/30 text-rose-400',
      glow: 'from-rose-500/10 to-transparent',
    },
  }[colorScheme];

  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 p-5 transition-all duration-300 ${schemeStyles.border}`}
    >
      {/* Ambient gradient */}
      <div
        className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${schemeStyles.glow} rounded-full blur-2xl pointer-events-none`}
      />

      <div className="relative z-10 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">{title}</p>
          <h3 className="text-2xl lg:text-3xl font-black text-white tracking-tight mt-1">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </h3>
          {subtitle && <p className="text-xs text-zinc-500 mt-1 font-medium">{subtitle}</p>}
        </div>

        <div className={`p-3 rounded-xl border ${schemeStyles.iconBg}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {trend && (
        <div className="relative z-10 flex items-center gap-2 mt-4 pt-3 border-t border-zinc-800/80 text-xs">
          <span
            className={`font-bold flex items-center gap-0.5 ${
              trend.isPositive !== false ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {trend.isPositive !== false ? '↑' : '↓'} {trend.value}
          </span>
          {trend.label && <span className="text-zinc-500 font-medium">{trend.label}</span>}
        </div>
      )}
    </div>
  );
}

export default AdminStatCard;

