'use client';

import React from 'react';
import { UserAccountStatus, AdminRole } from '@/lib/admin-types';

interface AdminStatusBadgeProps {
  status?: UserAccountStatus | string;
  role?: AdminRole | string;
  variant?: 'status' | 'role';
  size?: 'sm' | 'md';
}

export function AdminStatusBadge({
  status,
  role,
  variant = 'status',
  size = 'md',
}: AdminStatusBadgeProps) {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  if (variant === 'role' && role) {
    switch (role) {
      case 'superadmin':
        return (
          <span
            className={`inline-flex items-center gap-1.5 font-bold tracking-wider uppercase rounded-md bg-purple-950/60 border border-purple-500/40 text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.25)] ${sizeClasses}`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
            SUPERADMIN
          </span>
        );
      case 'admin':
        return (
          <span
            className={`inline-flex items-center gap-1.5 font-bold tracking-wider uppercase rounded-md bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.2)] ${sizeClasses}`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            ADMIN
          </span>
        );
      default:
        return (
          <span
            className={`inline-flex items-center gap-1.5 font-medium tracking-wider uppercase rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 ${sizeClasses}`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
            USER
          </span>
        );
    }
  }

  // Status variant
  switch (status) {
    case 'active':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-semibold tracking-wider uppercase rounded-md bg-emerald-950/50 border border-emerald-500/30 text-emerald-400 ${sizeClasses}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
          ACTIVE
        </span>
      );
    case 'suspended':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-semibold tracking-wider uppercase rounded-md bg-amber-950/50 border border-amber-500/30 text-amber-400 ${sizeClasses}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          SUSPENDED
        </span>
      );
    case 'banned':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-semibold tracking-wider uppercase rounded-md bg-rose-950/60 border border-rose-500/40 text-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.2)] ${sizeClasses}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
          BANNED
        </span>
      );
    default:
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-medium tracking-wider uppercase rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 ${sizeClasses}`}
        >
          {status || 'UNKNOWN'}
        </span>
      );
  }
}

export default AdminStatusBadge;

