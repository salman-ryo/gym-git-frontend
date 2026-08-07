'use client';

import { useAuth } from '@/lib/auth-context';
import { Dumbbell, Flame, LogOut, User as UserIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface HeaderProps {
  currentStreak?: number;
}

export default function Header({ currentStreak = 0 }: HeaderProps) {
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
          {/* User Profile Info */}
          {user && (
            <div className="flex items-center gap-2 bg-[#080c10] border border-zinc-800 rounded-xl p-1.5 pl-3">
              {user.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-7 h-7 rounded-full object-cover bg-zinc-800"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
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
            className="p-2 bg-[#080c10] hover:bg-red-500/10 text-zinc-400 hover:text-red-400 border border-zinc-800 hover:border-red-500/30 rounded-xl text-xs transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
