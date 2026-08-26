'use client';

import React, { memo } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useInventory } from '@/lib/inventory-context';
import { LogOut, User as UserIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface HeaderProps {
  currentStreak?: number;
  onOpenInventory?: () => void;
  inventoryCount?: number;
}

function Header({ currentStreak = 0, onOpenInventory, inventoryCount: propInventoryCount }: HeaderProps) {
  void currentStreak;
  const { user, logout } = useAuth();
  const { inventoryCount: contextCount, setIsInventoryOpen } = useInventory();

  const inventoryCount = propInventoryCount !== undefined ? propInventoryCount : contextCount;
  const handleOpen = onOpenInventory || (() => setIsInventoryOpen(true));

  return (
    <header className="sticky top-0 z-30 bg-[#060a0e]/80 backdrop-blur-xl border-b border-zinc-800/80 px-3 sm:px-4 lg:px-8 py-2.5 sm:py-3 transition-all">
      <div className="max-w-8xl mx-auto flex items-center justify-between">
        {/* Brand & Logo */}
        <Link href="/" className="flex items-center gap-2 sm:gap-3 no-underline group cursor-pointer">
          <div className="rounded-xl shrink-0">
            <Image
              src="/web-app-manifest-512x512.png"
              alt="Gym-Git Logo"
              width={300}
              height={300}
              className="size-10 sm:size-12 lg:size-16 transition-transform duration-200 group-hover:scale-105"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg lg:text-xl font-black tracking-tight bg-linear-to-r from-neon-green via-teal-300 to-emerald-200 bg-clip-text text-transparent">
                Gym-Git
              </span>
            </div>
            <p className="text-[10px] sm:text-xs text-zinc-400 hidden sm:block">GitHub-style Fitness Tracker</p>
          </div>
        </Link>

        {/* User Navigation & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Inventory Access Button */}
          {user && (
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={handleOpen}
                    aria-label="Open Inventory"
                    className="relative p-1.5 sm:p-2 rounded-xl hover:bg-zinc-900/50 transition-all flex items-center justify-center min-w-[36px] min-h-[36px] sm:min-w-[40px] sm:min-h-[40px] cursor-pointer"
                  >
                    <Image src="/icons/bag.png" alt="Inventory" width={32} height={32} unoptimized className="size-5 sm:size-6 md:size-8 transition-transform duration-200 group-hover/inv:scale-110 hover:scale-110" />
                    {inventoryCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-neon-cyan px-1 text-[9px] font-black text-zinc-950 shadow-[0_0_8px_rgba(34,211,238,0.6)] animate-pulse">
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
            <div className="flex items-center gap-2 sm:gap-2.5 bg-zinc-950/80 border border-zinc-800/90 hover:border-neon-green/40 hover:shadow-[0_0_15px_rgba(0,255,136,0.12)] rounded-xl p-1 sm:p-1.5 pl-2 sm:pl-3 transition-all duration-200 group/user">
              {user.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-6 h-6 sm:w-7 sm:h-7 rounded-full object-cover bg-zinc-800 border border-neon-green/30 group-hover/user:border-neon-green group-hover/user:shadow-[0_0_8px_#00ff88] transition-all shrink-0"
                />
              ) : (
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-linear-to-br from-neon-green/20 to-neon-cyan/20 border border-neon-green/30 text-neon-green flex items-center justify-center font-black text-xs group-hover/user:border-neon-green group-hover/user:shadow-[0_0_8px_#00ff88] transition-all shrink-0">
                  {user.name ? user.name[0].toUpperCase() : <UserIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
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
                  className="w-8 h-8 sm:w-9 sm:h-9 p-0 bg-zinc-950/80 hover:bg-red-500/15 text-zinc-400 hover:text-red-400 border border-zinc-800 hover:border-red-500/40 rounded-xl transition-all duration-200 shadow-sm hover:shadow-[0_0_15px_rgba(239,68,68,0.25)] cursor-pointer flex items-center justify-center group/logout shrink-0"
                >
                  <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-200 group-hover/logout:translate-x-0.5" />
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

export default memo(Header);
