'use client';

import { useAuth } from '@/lib/auth-context';
import { Dumbbell, Flame, LogOut, RefreshCw, User as UserIcon } from 'lucide-react';
import React, { useState } from 'react';

interface HeaderProps {
  currentStreak?: number;
  onResetData?: () => void;
}

export default function Header({ currentStreak = 0, onResetData }: HeaderProps) {
  const { user, logout } = useAuth();
  const [resetting, setResetting] = useState(false);

  const handleReset = async () => {
    if (!onResetData) return;
    if (confirm('Are you sure you want to reset demo data back to default?')) {
      setResetting(true);
      try {
        await onResetData();
      } finally {
        setResetting(false);
      }
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/80 px-4 lg:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-xl text-zinc-950 shadow-md shadow-emerald-500/20">
            <Dumbbell className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tight bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200 bg-clip-text text-transparent">
                Gym-Git
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                v1.0
              </span>
            </div>
            <p className="text-xs text-zinc-400 hidden sm:block">GitHub-style Fitness Tracker</p>
          </div>
        </div>

        {/* Center Pill - Streak Badge */}
        <div className="hidden md:flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-full px-4 py-1.5 shadow-inner">
          <Flame className="w-4 h-4 text-amber-400 animate-bounce" />
          <span className="text-xs font-semibold text-zinc-300">
            Streak: <span className="text-amber-400 font-bold">{currentStreak} Days</span>
          </span>
        </div>

        {/* User Navigation & Actions */}
        <div className="flex items-center gap-3">
          {/* Reset Demo Data Button */}
          {onResetData && (
            <button
              type="button"
              onClick={handleReset}
              disabled={resetting}
              title="Reset Demo Data"
              className="p-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all"
            >
              <RefreshCw className={`w-4 h-4 ${resetting ? 'animate-spin text-emerald-400' : ''}`} />
              <span className="hidden sm:inline">Reset Data</span>
            </button>
          )}

          {/* User Profile Info */}
          {user && (
            <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-xl p-1.5 pl-3">
              {user.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-7 h-7 rounded-lg object-cover bg-zinc-800"
                />
              ) : (
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                  {user.name ? user.name[0] : <UserIcon className="w-4 h-4" />}
                </div>
              )}
              <div className="hidden lg:block text-left pr-2">
                <p className="text-xs font-bold text-zinc-200 leading-tight">{user.name}</p>
                <p className="text-[10px] text-zinc-400 leading-tight">{user.email}</p>
              </div>
            </div>
          )}

          {/* Logout Button */}
          <button
            type="button"
            onClick={() => logout()}
            title="Sign Out"
            className="p-2 bg-zinc-900 hover:bg-red-500/10 text-zinc-400 hover:text-red-400 border border-zinc-800 hover:border-red-500/30 rounded-xl text-xs transition-all"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
