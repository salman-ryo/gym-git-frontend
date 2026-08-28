'use client';

import React from 'react';
import { LucideIcon, Inbox } from 'lucide-react';

interface AdminEmptyStateProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  actionLabel?: string;
  onAction?: () => void;
}

export function AdminEmptyState({
  title,
  description,
  icon: Icon = Inbox,
  actionLabel,
  onAction,
}: AdminEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/40">
      <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 mb-4 shadow-inner">
        <Icon className="w-6 h-6" />
      </div>

      <h4 className="text-base font-bold text-white mb-1 tracking-tight">{title}</h4>
      {description && (
        <p className="text-xs text-zinc-500 max-w-sm mb-6 leading-relaxed">{description}</p>
      )}

      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 rounded-xl bg-neon-green/10 border border-neon-green/30 text-neon-green hover:bg-neon-green/20 hover:border-neon-green/50 transition-all text-xs font-bold uppercase tracking-wider"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export default AdminEmptyState;

