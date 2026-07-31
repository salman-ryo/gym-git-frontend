'use client';

import { Stats } from '@/lib/types';
import React from 'react';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';
import { TooltipProvider } from '@/components/ui/tooltip';
import Image from 'next/image';

interface StatsOverviewProps {
  stats: Stats | null;
}

type StatTheme = {
  border: string;
  shadow: string;
  hoverShadow: string;
  diamondBg: string;
  diamondShadow: string;
  textUnit: string;
  textSub: string;
  imgShadow: string;
};

interface StatCardProps {
  title: string;
  value: React.ReactNode;
  unit: string;
  subtext: React.ReactNode;
  imageSrc: string;
  imageAlt: string;
  contentWidth?: string;
  theme: StatTheme;
}

// Reusable Sub-component to keep the main file DRY
function StatCard({
  title,
  value,
  unit,
  subtext,
  imageSrc,
  imageAlt,
  contentWidth = 'w-[65%]',
  theme,
}: StatCardProps) {
  return (
    <div
      className={`relative flex flex-col justify-center min-h-[130px] bg-zinc-950 border-2 rounded-xl overflow-visible group transition-all ${theme.border} ${theme.shadow} ${theme.hoverShadow}`}
    >
      {/* Diamonds */}
      <div
        className={`absolute -top-1.5 -left-1.5 w-3 h-3 rotate-45 z-20 rounded-sm ${theme.diamondBg} ${theme.diamondShadow}`}
      />
      <div
        className={`absolute -bottom-1.5 -right-1.5 w-3 h-3 rotate-45 z-20 rounded-sm ${theme.diamondBg} ${theme.diamondShadow}`}
      />

      <div className={`relative z-10 p-5 ${contentWidth}`}>
        <div className="text-[10px] font-black text-zinc-300 uppercase tracking-widest mb-1">
          {title}
        </div>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-4xl font-black text-white">{value}</span>
          <span className={`text-sm font-bold ${theme.textUnit}`}>{unit}</span>
        </div>
        <div
          className={`mt-2 flex items-start gap-1.5 text-[10px] font-semibold leading-tight ${theme.textSub}`}
        >
          {subtext}
        </div>
      </div>

      {/* Icon/Image */}
      <div
        className={`absolute bottom-0 right-3 w-[45%] h-full pointer-events-none flex items-center justify-end group-hover:scale-105 transition-transform ${theme.imgShadow}`}
      >
        <Image
          src={imageSrc}
          alt={imageAlt}
          width={80}
          height={80}
          unoptimized
          className="object-contain"
        />
      </div>
    </div>
  );
}

export default function StatsOverview({ stats }: StatsOverviewProps) {
  if (!stats) return null;

  const streak = stats.scientificStreak;

  // Data mapping for the cards
  const statCardsData: StatCardProps[] = [
    {
      title: 'Current Streak',
      value: stats.currentStreak,
      unit: 'Days',
      subtext: (
        <>
          <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
          <span>Rest days protected by plan</span>
        </>
      ),
      imageSrc: '/images/icons/fire.svg',
      imageAlt: 'Streak',
      theme: {
        border: 'border-amber-500',
        shadow: 'shadow-[0_0_15px_rgba(245,158,11,0.15)]',
        hoverShadow: 'hover:shadow-[0_0_25px_rgba(245,158,11,0.3)]',
        diamondBg: 'bg-amber-500',
        diamondShadow: 'shadow-[0_0_10px_#f59e0b]',
        textUnit: 'text-amber-500',
        textSub: 'text-amber-500/80',
        imgShadow: 'drop-shadow-[0_0_15px_rgba(245,158,11,0.4)]',
      },
    },
    {
      title: 'Longest Streak',
      value: stats.longestStreak,
      unit: 'Days Record',
      subtext: <span>Best plan-compliant sequence</span>,
      imageSrc: '/images/icons/trophy.svg',
      imageAlt: 'Longest Streak',
      theme: {
        border: 'border-emerald-500',
        shadow: 'shadow-[0_0_15px_rgba(16,185,129,0.15)]',
        hoverShadow: 'hover:shadow-[0_0_25px_rgba(16,185,129,0.3)]',
        diamondBg: 'bg-emerald-400',
        diamondShadow: 'shadow-[0_0_10px_#34d399]',
        textUnit: 'text-emerald-400',
        textSub: 'text-emerald-400/80',
        imgShadow: 'drop-shadow-[0_0_15px_rgba(16,185,129,0.4)]',
      },
    },
    {
      title: 'Plan Adherence',
      value: `${streak?.complianceRate || 92}%`,
      unit: 'Compliance',
      subtext: (
        <>
          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
          <span>
            This Week: {streak?.currentWeekDone || 3}/
            {streak?.currentWeekTarget || 4} ({streak?.currentWeekStatus || 'On Track'})
          </span>
        </>
      ),
      imageSrc: '/images/icons/check.svg',
      imageAlt: 'Plan Adherence',
      contentWidth: 'w-[70%]',
      theme: {
        border: 'border-purple-500',
        shadow: 'shadow-[0_0_15px_rgba(168,85,247,0.15)]',
        hoverShadow: 'hover:shadow-[0_0_25px_rgba(168,85,247,0.3)]',
        diamondBg: 'bg-purple-400',
        diamondShadow: 'shadow-[0_0_10px_#c084fc]',
        textUnit: 'text-purple-400',
        textSub: 'text-purple-400/80',
        imgShadow: 'drop-shadow-[0_0_15px_rgba(168,85,247,0.4)]',
      },
    },
    {
      title: 'Hours Invested',
      value: stats.totalHours,
      unit: 'hrs',
      subtext: (
        <span>
          {stats.totalDays} sessions (~{stats.averageHoursPerSession}h avg)
        </span>
      ),
      imageSrc: '/images/icons/clock.svg',
      imageAlt: 'Hours Invested',
      theme: {
        border: 'border-blue-500',
        shadow: 'shadow-[0_0_15px_rgba(59,130,246,0.15)]',
        hoverShadow: 'hover:shadow-[0_0_25px_rgba(59,130,246,0.3)]',
        diamondBg: 'bg-blue-400',
        diamondShadow: 'shadow-[0_0_10px_#60a5fa]',
        textUnit: 'text-blue-400',
        textSub: 'text-blue-400/80',
        imgShadow: 'drop-shadow-[0_0_15px_rgba(59,130,246,0.4)]',
      },
    },
  ];

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
          {statCardsData.map((card, index) => (
            <StatCard key={index} {...card} />
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
}