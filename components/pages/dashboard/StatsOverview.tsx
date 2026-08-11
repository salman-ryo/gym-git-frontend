'use client';

import { Stats } from '@/lib/types';
import React from 'react';
import { ShieldCheck, CheckCircle2, Flame, Trophy, CheckSquare, Clock } from 'lucide-react';
import { TooltipProvider } from '@/components/ui/tooltip';
import Image from 'next/image';
import { useAuth } from '@/lib/auth-context';
import CycleProgressCard from './CycleProgressCard';

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
  accentBar: string;
  glowOrb: string;
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

// Reusable Cyberpunk Stat Card Component
function StatCard({
  title,
  value,
  unit,
  subtext,
  imageSrc,
  imageAlt,
  contentWidth = 'w-[70%]',
  theme,
}: StatCardProps) {
  return (
    <div
      className={`relative flex flex-col justify-center min-h-[135px] bg-zinc-950/80 border backdrop-blur-2xl rounded-2xl overflow-hidden group transition-all duration-300 ${theme.border} ${theme.shadow} ${theme.hoverShadow}`}
    >
      {/* Top Ambient Glow Line */}
      <div className={`absolute top-0 left-0 right-0 h-[2px] ${theme.accentBar}`} />

      {/* Ambient Corner Orb */}
      <div className={`absolute -top-12 -left-12 w-28 h-28 rounded-full blur-2xl pointer-events-none ${theme.glowOrb}`} />

      {/* Futuristic Corner Diamonds */}
      <div
        className={`absolute -top-1.5 -left-1.5 w-3 h-3 rotate-45 z-20 rounded-sm ${theme.diamondBg} ${theme.diamondShadow}`}
      />
      <div
        className={`absolute -bottom-1.5 -right-1.5 w-3 h-3 rotate-45 z-20 rounded-sm ${theme.diamondBg} ${theme.diamondShadow}`}
      />

      <div className={`relative z-10 p-5 ${contentWidth}`}>
        <div className="text-[10.5px] font-black text-zinc-400 uppercase tracking-widest mb-1">
          {title}
        </div>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-4xl font-black text-white tracking-tight">{value}</span>
          <span className={`text-sm font-extrabold ${theme.textUnit}`}>{unit}</span>
        </div>
        <div
          className={`mt-2.5 flex items-center gap-1.5 text-[11px] font-semibold leading-tight ${theme.textSub}`}
        >
          {subtext}
        </div>
      </div>

      {/* Icon / Image with Cyber Glow */}
      <div
        className={`absolute bottom-0 right-3 w-[45%] h-full pointer-events-none flex items-center justify-end group-hover:scale-108 transition-transform duration-300 ${theme.imgShadow}`}
      >
        <Image
          src={imageSrc}
          alt={imageAlt}
          width={82}
          height={82}
          unoptimized
          className="object-contain"
        />
      </div>
    </div>
  );
}

export default function StatsOverview({ stats }: StatsOverviewProps) {
  const { user } = useAuth();

  if (!stats) return null;

  const streak = stats.scientificStreak;

  // Data mapping for the cards matching the Landing & Cyberpunk palette
  const statCardsData: StatCardProps[] = [
    {
      title: 'Current Streak',
      value: stats.currentStreak,
      unit: 'Days',
      subtext: (
        <>
          <ShieldCheck className="w-3.5 h-3.5 shrink-0 text-neon-green" />
          <span>Rest days protected</span>
        </>
      ),
      imageSrc: '/images/icons/fire.svg',
      imageAlt: 'Streak',
      theme: {
        border: 'border-neon-green/15 hover:border-neon-green/60',
        shadow: 'shadow-[0_4px_20px_rgba(0,0,0,0.6)]',
        hoverShadow: 'hover:shadow-[0_0_30px_rgba(0,255,136,0.22)]',
        diamondBg: 'bg-neon-green/70 group-hover:bg-neon-green',
        diamondShadow: 'shadow-[0_0_4px_rgba(0,255,136,0.4)] group-hover:shadow-[0_0_10px_#00ff88]',
        textUnit: 'text-neon-green',
        textSub: 'text-zinc-400 group-hover:text-zinc-300',
        accentBar: 'bg-gradient-to-r from-neon-green/25 via-neon-green/10 to-transparent group-hover:from-neon-green/60 group-hover:via-neon-green/30',
        glowOrb: 'bg-neon-green/[0.03] group-hover:bg-neon-green/10',
        imgShadow: 'drop-shadow-[0_0_8px_rgba(0,255,136,0.12)] group-hover:drop-shadow-[0_0_22px_rgba(0,255,136,0.4)]',
      },
    },
    {
      title: 'Longest Streak',
      value: stats.longestStreak,
      unit: 'Days Record',
      subtext: (
        <>
          <Trophy className="w-3.5 h-3.5 shrink-0 text-neon-cyan" />
          <span>Best sequence record</span>
        </>
      ),
      imageSrc: '/images/icons/trophy.svg',
      imageAlt: 'Longest Streak',
      theme: {
        border: 'border-neon-cyan/15 hover:border-neon-cyan/60',
        shadow: 'shadow-[0_4px_20px_rgba(0,0,0,0.6)]',
        hoverShadow: 'hover:shadow-[0_0_30px_rgba(34,211,238,0.22)]',
        diamondBg: 'bg-neon-cyan/70 group-hover:bg-neon-cyan',
        diamondShadow: 'shadow-[0_0_4px_rgba(34,211,238,0.4)] group-hover:shadow-[0_0_10px_#22d3ee]',
        textUnit: 'text-neon-cyan',
        textSub: 'text-zinc-400 group-hover:text-zinc-300',
        accentBar: 'bg-gradient-to-r from-neon-cyan/25 via-neon-cyan/10 to-transparent group-hover:from-neon-cyan/60 group-hover:via-neon-cyan/30',
        glowOrb: 'bg-neon-cyan/[0.03] group-hover:bg-neon-cyan/10',
        imgShadow: 'drop-shadow-[0_0_8px_rgba(34,211,238,0.12)] group-hover:drop-shadow-[0_0_22px_rgba(34,211,238,0.4)]',
      },
    },
    {
      title: 'Plan Adherence',
      value: `${streak?.complianceRate || 92}%`,
      unit: 'Compliance',
      subtext: (
        <>
          <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-neon-purple" />
          <span>
            Wk: {streak?.currentWeekDone || 3}/{streak?.currentWeekTarget || 4} ({streak?.currentWeekStatus || 'On Track'})
          </span>
        </>
      ),
      imageSrc: '/images/icons/check.svg',
      imageAlt: 'Plan Adherence',
      contentWidth: 'w-[72%]',
      theme: {
        border: 'border-neon-purple/15 hover:border-neon-purple/60',
        shadow: 'shadow-[0_4px_20px_rgba(0,0,0,0.6)]',
        hoverShadow: 'hover:shadow-[0_0_30px_rgba(168,85,247,0.22)]',
        diamondBg: 'bg-neon-purple/70 group-hover:bg-neon-purple',
        diamondShadow: 'shadow-[0_0_4px_rgba(168,85,247,0.4)] group-hover:shadow-[0_0_10px_#a855f7]',
        textUnit: 'text-neon-purple',
        textSub: 'text-zinc-400 group-hover:text-zinc-300',
        accentBar: 'bg-gradient-to-r from-neon-purple/25 via-neon-purple/10 to-transparent group-hover:from-neon-purple/60 group-hover:via-neon-purple/30',
        glowOrb: 'bg-neon-purple/[0.03] group-hover:bg-neon-purple/10',
        imgShadow: 'drop-shadow-[0_0_8px_rgba(168,85,247,0.12)] group-hover:drop-shadow-[0_0_22px_rgba(168,85,247,0.4)]',
      },
    },
    {
      title: 'Hours Invested',
      value: stats.totalHours,
      unit: 'hrs',
      subtext: (
        <>
          <Clock className="w-3.5 h-3.5 shrink-0 text-amber-400" />
          <span>
            {stats.totalDays} sessions (~{stats.averageHoursPerSession}h avg)
          </span>
        </>
      ),
      imageSrc: '/images/icons/clock.svg',
      imageAlt: 'Hours Invested',
      theme: {
        border: 'border-amber-400/15 hover:border-amber-400/60',
        shadow: 'shadow-[0_4px_20px_rgba(0,0,0,0.6)]',
        hoverShadow: 'hover:shadow-[0_0_30px_rgba(251,191,36,0.22)]',
        diamondBg: 'bg-amber-400/70 group-hover:bg-amber-400',
        diamondShadow: 'shadow-[0_0_4px_rgba(251,191,36,0.4)] group-hover:shadow-[0_0_10px_#fbbf24]',
        textUnit: 'text-amber-400',
        textSub: 'text-zinc-400 group-hover:text-zinc-300',
        accentBar: 'bg-gradient-to-r from-amber-400/25 via-amber-400/10 to-transparent group-hover:from-amber-400/60 group-hover:via-amber-400/30',
        glowOrb: 'bg-amber-400/[0.03] group-hover:bg-amber-400/10',
        imgShadow: 'drop-shadow-[0_0_8px_rgba(251,191,36,0.12)] group-hover:drop-shadow-[0_0_22px_rgba(251,191,36,0.4)]',
      },
    },
  ];

  return (
    <TooltipProvider delayDuration={50}>
      <div className="w-full mt-6 mb-10">
        {/* GRIND STATS Cyberpunk Header */}
        <div className="flex justify-center items-center mb-8 relative">
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-neon-green/30 to-neon-cyan/60" />
          <div className="px-7 py-2 mx-4 bg-zinc-950/80 border border-neon-green/30 backdrop-blur-xl rounded-full shadow-[0_0_20px_rgba(0,255,136,0.15)] flex items-center gap-3 relative z-10">
            <div className="w-2 h-2 rotate-45 bg-neon-green shadow-[0_0_8px_#00ff88] animate-[badge-pulse_2s_ease-in-out_infinite]" />
            <span className="text-xs font-black tracking-[0.25em] bg-gradient-to-r from-neon-green via-[#00e077] to-neon-cyan bg-clip-text text-transparent uppercase drop-shadow-[0_0_10px_rgba(0,255,136,0.4)]">
              Grind Stats
            </span>
            <div className="w-2 h-2 rotate-45 bg-neon-cyan shadow-[0_0_8px_#22d3ee] animate-[badge-pulse_2s_ease-in-out_infinite]" />
          </div>
          <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-neon-green/30 to-neon-cyan/60" />
        </div>

        {/* Main Stats Layout: Left is CycleProgressCard, Right is 2x2 grid of StatCards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          <div className="lg:col-span-1">
            {user && <CycleProgressCard stats={stats} user={user} />}
          </div>

          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {statCardsData.map((card, index) => (
              <StatCard key={index} {...card} />
            ))}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}