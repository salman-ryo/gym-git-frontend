'use client';

import { useAuth } from '@/lib/auth-context';
import { LogOut, User as UserIcon, Package } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface HeaderProps {
  currentStreak?: number;
  onOpenInventory?: () => void;
  inventoryCount?: number;
}

export default function Header({ currentStreak = 0, onOpenInventory, inventoryCount = 0 }: HeaderProps) {
  void currentStreak;
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 bg-[#060a0e]/80 backdrop-blur-xl border-b border-zinc-800/80 px-4 lg:px-8 py-3 transition-all">
      <div className="max-w-8xl mx-auto flex items-center justify-between">
        {/* Brand & Logo */}
        <Link href="/" className="flex items-center gap-3 no-underline group cursor-pointer">
          <div className="rounded-xl">
            <Image
              src="/web-app-manifest-512x512.png"
              alt="Gym-Git Logo"
              width={300}
              height={300}
              className="size-16 transition-transform duration-200 group-hover:scale-105"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tight bg-gradient-to-r from-neon-green via-teal-300 to-emerald-200 bg-clip-text text-transparent">
                Gym-Git
              </span>
            </div>
            <p className="text-xs text-zinc-400 hidden sm:block">GitHub-style Fitness Tracker</p>
          </div>
        </Link>

        {/* User Navigation & Actions */}
        <div className="flex items-center gap-3">
          {/* Inventory Access Button */}
          {user && onOpenInventory && (
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={onOpenInventory}
                    aria-label="Open Inventory"
                    className="relative w-9 h-9 p-0 bg-zinc-950/80 hover:bg-neon-cyan/15 text-zinc-400 hover:text-neon-cyan border border-zinc-800 hover:border-neon-cyan/40 rounded-xl transition-all duration-200 shadow-sm hover:shadow-[0_0_15px_rgba(34,211,238,0.25)] cursor-pointer flex items-center justify-center group/inv"
                  >
                    <Package className="w-4 h-4 transition-transform duration-200 group-hover/inv:scale-110" />
                    {inventoryCount > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-neon-cyan px-1 text-[9px] font-black text-zinc-950 shadow-[0_0_8px_rgba(34,211,238,0.6)] animate-pulse">
                        {inventoryCount}
                      </span>
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="bg-[#05080c] border border-neon-cyan/30 text-neon-cyan text-[11px] font-bold shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                  Open Inventory
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          {/* User Profile Info */}
          {user && (
            <div className="flex items-center gap-2.5 bg-zinc-950/80 border border-zinc-800/90 hover:border-neon-green/40 hover:shadow-[0_0_15px_rgba(0,255,136,0.12)] rounded-xl p-1.5 pl-3 transition-all duration-200 group/user">
              {user.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-7 h-7 rounded-full object-cover bg-zinc-800 border border-neon-green/30 group-hover/user:border-neon-green group-hover/user:shadow-[0_0_8px_#00ff88] transition-all"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-neon-green/20 to-neon-cyan/20 border border-neon-green/30 text-neon-green flex items-center justify-center font-black text-xs group-hover/user:border-neon-green group-hover/user:shadow-[0_0_8px_#00ff88] transition-all">
                  {user.name ? user.name[0].toUpperCase() : <UserIcon className="w-4 h-4" />}
                </div>
              )}
              <div className="hidden lg:block text-left pr-2">
                <p className="text-xs font-extrabold text-zinc-200 group-hover/user:text-white leading-tight flex items-center gap-1.5">
                  <span>{user.name}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-neon-green shadow-[0_0_6px_#00ff88] animate-[badge-pulse_2s_ease-in-out_infinite]" />
                </p>
                <p className="text-[10px] text-zinc-400 font-medium leading-tight">{user.email}</p>
              </div>
            </div>
          )}

          {/* Compact Door Sign Out Button with Tooltip */}
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => logout()}
                  aria-label="Sign Out"
                  className="w-9 h-9 p-0 bg-zinc-950/80 hover:bg-red-500/15 text-zinc-400 hover:text-red-400 border border-zinc-800 hover:border-red-500/40 rounded-xl transition-all duration-200 shadow-sm hover:shadow-[0_0_15px_rgba(239,68,68,0.25)] cursor-pointer flex items-center justify-center group/logout"
                >
                  <LogOut className="w-4 h-4 transition-transform duration-200 group-hover/logout:translate-x-0.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="bg-[#05080c] border border-red-500/30 text-red-400 text-[11px] font-bold shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                Sign Out
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </header>
  );
}
