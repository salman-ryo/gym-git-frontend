'use client';

import { Stats } from '@/lib/types';
import React from 'react';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';
import { TooltipProvider } from '@/components/ui/tooltip';
import Image from 'next/image';

interface StatsOverviewProps {
  stats: Stats | null;
}

export default function StatsOverview({ stats }: StatsOverviewProps) {
  if (!stats) return null;

  const streak = stats.scientificStreak;

  return (
    <TooltipProvider delayDuration={50}>
      <div className="w-full mt-6 mb-10">

        {/* GRIND STATS Header */}
        <div className="flex justify-center items-center mb-8 relative">
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-indigo-900/50 to-indigo-500/80" />
          <div className="px-8 py-2 mx-4 bg-zinc-950 border border-indigo-500/50 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.3)] flex items-center gap-3 relative z-10">
            <div className="w-2 h-2 rotate-45 bg-indigo-400 shadow-[0_0_8px_#818cf8]" />
            <span className="text-sm font-black tracking-[0.25em] text-indigo-100 uppercase drop-shadow-[0_0_8px_rgba(129,140,248,0.8)]">
              Grind Stats
            </span>
            <div className="w-2 h-2 rotate-45 bg-indigo-400 shadow-[0_0_8px_#818cf8]" />
          </div>
          <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-indigo-900/50 to-indigo-500/80" />
        </div>

        {/* Stats Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

          {/* 1. CURRENT STREAK (Orange/Amber) */}
          <div className="relative flex flex-col justify-center min-h-[130px] bg-zinc-950 border-2 border-amber-500 rounded-xl overflow-visible shadow-[0_0_15px_rgba(245,158,11,0.15)] group transition-all hover:shadow-[0_0_25px_rgba(245,158,11,0.3)]">
            {/* Diamonds */}
            <div className="absolute -top-1.5 -left-1.5 w-3 h-3 rotate-45 bg-amber-500 shadow-[0_0_10px_#f59e0b] z-20 rounded-sm" />
            <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 rotate-45 bg-amber-500 shadow-[0_0_10px_#f59e0b] z-20 rounded-sm" />

            <div className="relative z-10 p-5 w-[65%]">
              <div className="text-[10px] font-black text-zinc-300 uppercase tracking-widest mb-1">
                Current Streak
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-4xl font-black text-white">
                  {stats.currentStreak}
                </span>
                <span className="text-sm font-bold text-amber-500">
                  Days
                </span>
              </div>
              <div className="mt-2 flex items-start gap-1.5 text-[10px] text-amber-500/80 font-semibold leading-tight">
                <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                <span>Rest days protected by plan</span>
              </div>
            </div>
            {/* Icon */}
            <div className="absolute bottom-0 right-3 w-[45%] h-full pointer-events-none flex items-center justify-end drop-shadow-[0_0_15px_rgba(245,158,11,0.4)] group-hover:scale-110 transition-transform">
              <Image src={"/images/icons/fire.svg"} alt='Streak' width={80} height={80} unoptimized className="object-contain" />
            </div>
          </div>

          {/* 2. LONGEST STREAK (Emerald) */}
          <div className="relative flex flex-col justify-center min-h-[130px] bg-zinc-950 border-2 border-emerald-500 rounded-xl overflow-visible shadow-[0_0_15px_rgba(16,185,129,0.15)] group transition-all hover:shadow-[0_0_25px_rgba(16,185,129,0.3)]">
            <div className="absolute -top-1.5 -left-1.5 w-3 h-3 rotate-45 bg-emerald-400 shadow-[0_0_10px_#34d399] z-20 rounded-sm" />
            <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 rotate-45 bg-emerald-400 shadow-[0_0_10px_#34d399] z-20 rounded-sm" />

            <div className="relative z-10 p-5 w-[65%]">
              <div className="text-[10px] font-black text-zinc-300 uppercase tracking-widest mb-1">
                Longest Streak
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-4xl font-black text-white">
                  {stats.longestStreak}
                </span>
                <span className="text-sm font-bold text-emerald-400">
                  Days Record
                </span>
              </div>
              <div className="mt-2 text-[10px] text-emerald-400/80 font-semibold leading-tight">
                Best plan-compliant sequence
              </div>
            </div>
            <div className="absolute bottom-0 right-3 w-[45%] h-full pointer-events-none flex items-center justify-end drop-shadow-[0_0_15px_rgba(16,185,129,0.4)] group-hover:scale-110 transition-transform">
              <Image src={"/images/icons/trophy.svg"} alt='Longest Streak' width={80} height={80} unoptimized className="object-contain" />
            </div>
          </div>

          {/* 3. PLAN ADHERENCE (Purple) */}
          <div className="relative flex flex-col justify-center min-h-[130px] bg-zinc-950 border-2 border-purple-500 rounded-xl overflow-visible shadow-[0_0_15px_rgba(168,85,247,0.15)] group transition-all hover:shadow-[0_0_25px_rgba(168,85,247,0.3)]">
            <div className="absolute -top-1.5 -left-1.5 w-3 h-3 rotate-45 bg-purple-400 shadow-[0_0_10px_#c084fc] z-20 rounded-sm" />
            <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 rotate-45 bg-purple-400 shadow-[0_0_10px_#c084fc] z-20 rounded-sm" />

            <div className="relative z-10 p-5 w-[70%]">
              <div className="text-[10px] font-black text-zinc-300 uppercase tracking-widest mb-1">
                Plan Adherence
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-4xl font-black text-white">
                  {streak?.complianceRate || 92}%
                </span>
                <span className="text-sm font-bold text-purple-400">
                  Compliance
                </span>
              </div>
              <div className="mt-2 flex items-start gap-1.5 text-[10px] text-purple-400/80 font-semibold leading-tight">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>This Week: {streak?.currentWeekDone || 3}/{streak?.currentWeekTarget || 4} ({streak?.currentWeekStatus || 'On Track'})</span>
              </div>
            </div>
            <div className="absolute bottom-0 right-3 w-[45%] h-full pointer-events-none flex items-center justify-end drop-shadow-[0_0_15px_rgba(168,85,247,0.4)] group-hover:scale-110 transition-transform">
              <Image src={"/images/icons/check.svg"} alt='Plan Adherence' width={80} height={80} unoptimized className="object-contain" />
            </div>
          </div>

          {/* 4. HOURS INVESTED (Blue) */}
          <div className="relative flex flex-col justify-center min-h-[130px] bg-zinc-950 border-2 border-blue-500 rounded-xl overflow-visible shadow-[0_0_15px_rgba(59,130,246,0.15)] group transition-all hover:shadow-[0_0_25px_rgba(59,130,246,0.3)]">
            <div className="absolute -top-1.5 -left-1.5 w-3 h-3 rotate-45 bg-blue-400 shadow-[0_0_10px_#60a5fa] z-20 rounded-sm" />
            <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 rotate-45 bg-blue-400 shadow-[0_0_10px_#60a5fa] z-20 rounded-sm" />

            <div className="relative z-10 p-5 w-[65%]">
              <div className="text-[10px] font-black text-zinc-300 uppercase tracking-widest mb-1">
                Hours Invested
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-4xl font-black text-white">
                  {stats.totalHours}
                </span>
                <span className="text-sm font-bold text-blue-400">
                  hrs
                </span>
              </div>
              <div className="mt-2 text-[10px] text-blue-400/80 font-semibold leading-tight">
                {stats.totalDays} sessions (~{stats.averageHoursPerSession}h avg)
              </div>
            </div>
            <div className="absolute bottom-0 right-3 w-[45%] h-full pointer-events-none flex items-center justify-end drop-shadow-[0_0_15px_rgba(59,130,246,0.4)] group-hover:scale-110 transition-transform">
              <Image src={"/images/icons/clock.svg"} alt='Hours Invested' width={80} height={80} unoptimized className="object-contain" />
            </div>
          </div>

        </div>
      </div>
    </TooltipProvider>
  );
}