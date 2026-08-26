'use client';

import { Stats } from '@/lib/types';
import React, { memo, useMemo } from 'react';
import { ShieldCheck, CheckCircle2, Trophy, Clock, Snowflake } from 'lucide-react';
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
  imageFilter?: string;
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

const THEME_STREAK_FROZEN: StatTheme = {
  border: 'border-neon-cyan/25 hover:border-neon-cyan/60',
  shadow: 'shadow-[0_4px_20px_rgba(0,0,0,0.6)]',
  hoverShadow: 'hover:shadow-[0_0_30px_rgba(34,211,238,0.22)]',
  diamondBg: 'bg-neon-cyan/70 group-hover:bg-neon-cyan',
  diamondShadow: 'shadow-[0_0_4px_rgba(34,211,238,0.4)] group-hover:shadow-[0_0_10px_#22d3ee]',
  textUnit: 'text-neon-cyan',
  textSub: 'text-zinc-400 group-hover:text-zinc-300',
  accentBar:
    'bg-gradient-to-r from-neon-cyan/25 via-neon-cyan/10 to-transparent group-hover:from-neon-cyan/60 group-hover:via-neon-cyan/30',
  glowOrb: 'bg-neon-cyan/[0.03] group-hover:bg-neon-cyan/10',
  imgShadow:
    'drop-shadow-[0_0_8px_rgba(34,211,238,0.12)] group-hover:drop-shadow-[0_0_22px_rgba(34,211,238,0.4)]',
  imageFilter: 'hue-rotate(140deg) brightness(1.2) drop-shadow(0 0 10px rgba(34,211,238,0.5))',
};

const THEME_STREAK_ACTIVE: StatTheme = {
  border: 'border-neon-green/15 hover:border-neon-green/60',
  shadow: 'shadow-[0_4px_20px_rgba(0,0,0,0.6)]',
  hoverShadow: 'hover:shadow-[0_0_30px_rgba(0,255,136,0.22)]',
  diamondBg: 'bg-neon-green/70 group-hover:bg-neon-green',
  diamondShadow: 'shadow-[0_0_4px_rgba(0,255,136,0.4)] group-hover:shadow-[0_0_10px_#00ff88]',
  textUnit: 'text-neon-green',
  textSub: 'text-zinc-400 group-hover:text-zinc-300',
  accentBar:
    'bg-gradient-to-r from-neon-green/25 via-neon-green/10 to-transparent group-hover:from-neon-green/60 group-hover:via-neon-green/30',
  glowOrb: 'bg-neon-green/[0.03] group-hover:bg-neon-green/10',
  imgShadow:
    'drop-shadow-[0_0_8px_rgba(0,255,136,0.12)] group-hover:drop-shadow-[0_0_22px_rgba(0,255,136,0.4)]',
};

const THEME_LONGEST_STREAK: StatTheme = {
  border: 'border-neon-cyan/15 hover:border-neon-cyan/60',
  shadow: 'shadow-[0_4px_20px_rgba(0,0,0,0.6)]',
  hoverShadow: 'hover:shadow-[0_0_30px_rgba(34,211,238,0.22)]',
  diamondBg: 'bg-neon-cyan/70 group-hover:bg-neon-cyan',
  diamondShadow: 'shadow-[0_0_4px_rgba(34,211,238,0.4)] group-hover:shadow-[0_0_10px_#22d3ee]',
  textUnit: 'text-neon-cyan',
  textSub: 'text-zinc-400 group-hover:text-zinc-300',
  accentBar:
    'bg-gradient-to-r from-neon-cyan/25 via-neon-cyan/10 to-transparent group-hover:from-neon-cyan/60 group-hover:via-neon-cyan/30',
  glowOrb: 'bg-neon-cyan/[0.03] group-hover:bg-neon-cyan/10',
  imgShadow: 'drop-shadow-[0_0_8px_rgba(34,211,238,0.12)] group-hover:drop-shadow-[0_0_22px_rgba(34,211,238,0.4)]',
};

const THEME_ADHERENCE: StatTheme = {
  border: 'border-neon-purple/15 hover:border-neon-purple/60',
  shadow: 'shadow-[0_4px_20px_rgba(0,0,0,0.6)]',
  hoverShadow: 'hover:shadow-[0_0_30px_rgba(168,85,247,0.22)]',
  diamondBg: 'bg-neon-purple/70 group-hover:bg-neon-purple',
  diamondShadow: 'shadow-[0_0_4px_rgba(168,85,247,0.4)] group-hover:shadow-[0_0_10px_#a855f7]',
  textUnit: 'text-neon-purple',
  textSub: 'text-zinc-400 group-hover:text-zinc-300',
  accentBar:
    'bg-gradient-to-r from-neon-purple/25 via-neon-purple/10 to-transparent group-hover:from-neon-purple/60 group-hover:via-neon-purple/30',
  glowOrb: 'bg-neon-purple/[0.03] group-hover:bg-neon-purple/10',
  imgShadow: 'drop-shadow-[0_0_8px_rgba(168,85,247,0.12)] group-hover:drop-shadow-[0_0_22px_rgba(168,85,247,0.4)]',
};

const THEME_HOURS: StatTheme = {
  border: 'border-teal-400/15 hover:border-teal-400/60',
  shadow: 'shadow-[0_4px_20px_rgba(0,0,0,0.6)]',
  hoverShadow: 'hover:shadow-[0_0_30px_rgba(34,211,238,0.22)]',
  diamondBg: 'bg-teal-400/70 group-hover:bg-teal-400',
  diamondShadow: 'shadow-[0_0_4px_rgba(34,211,238,0.4)] group-hover:shadow-[0_0_10px_#22d3ee]',
  textUnit: 'text-teal-400',
  textSub: 'text-zinc-400 group-hover:text-zinc-300',
  accentBar:
    'bg-gradient-to-r from-teal-400/25 via-teal-400/10 to-transparent group-hover:from-teal-400/60 group-hover:via-teal-400/30',
  glowOrb: 'bg-teal-400/[0.03] group-hover:bg-teal-400/10',
  imgShadow: 'drop-shadow-[0_0_8px_rgba(251,191,36,0.12)] group-hover:drop-shadow-[0_0_22px_rgba(251,191,36,0.4)]',
};

// Reusable Cyberpunk Stat Card Component
const StatCard = memo(function StatCard({
  title,
  value,
  unit,
  subtext,
  imageSrc,
  imageAlt,
  theme,
}: StatCardProps) {
  return (
    <div
      className={`relative flex flex-col justify-center min-h-[110px] sm:min-h-[135px] bg-zinc-950/80 border backdrop-blur-2xl rounded-2xl overflow-hidden group transition-all duration-300 ${theme.border} ${theme.shadow} ${theme.hoverShadow}`}
    >
      {/* Top Ambient Glow Line */}
      <div className={`absolute top-0 left-0 right-0 h-[2px] ${theme.accentBar}`} />

      {/* Ambient Corner Orb */}
      <div className={`absolute -top-12 -left-12 w-28 h-28 rounded-full blur-2xl pointer-events-none ${theme.glowOrb}`} />

      {/* Futuristic Corner Diamonds */}
      <div
        className={`absolute -top-1.5 -left-1.5 w-2.5 h-2.5 sm:w-3 sm:h-3 rotate-45 z-20 rounded-sm ${theme.diamondBg} ${theme.diamondShadow}`}
      />
      <div
        className={`absolute -bottom-1.5 -right-1.5 w-2.5 h-2.5 sm:w-3 sm:h-3 rotate-45 z-20 rounded-sm ${theme.diamondBg} ${theme.diamondShadow}`}
      />

      <div className="relative z-10 p-3 sm:p-5 w-full sm:w-[75%] min-w-0">
        <div className="text-[9px] sm:text-[10.5px] font-black text-zinc-400 uppercase tracking-widest mb-0.5 sm:mb-1 truncate">
          {title}
        </div>
        <div className="flex items-baseline gap-1 sm:gap-2 mt-0.5 sm:mt-1 flex-wrap sm:flex-nowrap">
          <span className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-none">{value}</span>
          <span className={`text-[11px] sm:text-sm font-extrabold truncate ${theme.textUnit}`}>{unit}</span>
        </div>
        <div
          className={`mt-1.5 sm:mt-2.5 flex items-center gap-1 sm:gap-1.5 text-[9px] sm:text-[11px] font-semibold leading-tight ${theme.textSub} truncate`}
        >
          {subtext}
        </div>
      </div>

      {/* Icon / Image with Cyber Glow */}
      <div
        className={`absolute bottom-0 right-1 sm:right-3 w-[40%] sm:w-[45%] h-full pointer-events-none flex items-center justify-end opacity-20 sm:opacity-100 group-hover:scale-108 transition-all duration-300 ${theme.imgShadow}`}
      >
        <Image
          src={imageSrc}
          alt={imageAlt}
          width={82}
          height={82}
          unoptimized
          className="object-contain w-12 h-12 sm:w-20 sm:h-20"
          style={theme.imageFilter ? { filter: theme.imageFilter } : undefined}
        />
      </div>
    </div>
  );
});

function StatsOverview({ stats }: StatsOverviewProps) {
  const { user } = useAuth();

  const streak = stats?.scientificStreak;

  const statCardsData: StatCardProps[] = useMemo(() => {
    if (!stats) return [];

    return [
      {
        title: 'Current Streak',
        value: stats.isFrozen ? (
          <span className="flex items-center gap-1">
            {stats.currentStreak}
            <Snowflake className="w-4 h-4 sm:w-5 sm:h-5 text-neon-cyan shrink-0 animate-pulse" />
          </span>
        ) : (
          stats.currentStreak
        ),
        unit: 'Days',
        subtext: stats.isFrozen ? (
          <>
            <Snowflake className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 text-neon-cyan animate-pulse" />
            <span className="text-neon-cyan font-bold truncate">Ice Pause</span>
          </>
        ) : (
          <>
            <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 text-neon-green" />
            <span className="truncate">Rest protected</span>
          </>
        ),
        imageSrc: '/images/icons/fire.svg',
        imageAlt: 'Streak',
        theme: stats.isFrozen ? THEME_STREAK_FROZEN : THEME_STREAK_ACTIVE,
      },
      {
        title: 'Longest Streak',
        value: stats.longestStreak,
        unit: 'Days Record',
        subtext: (
          <>
            <Trophy className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 text-neon-cyan" />
            <span className="truncate">Best sequence</span>
          </>
        ),
        imageSrc: '/images/icons/trophy.svg',
        imageAlt: 'Longest Streak',
        theme: THEME_LONGEST_STREAK,
      },
      {
        title: 'Plan Adherence',
        value: `${streak?.complianceRate || 92}%`,
        unit: 'Rate',
        subtext: (
          <>
            <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 text-neon-purple" />
            <span className="truncate">
              Wk: {streak?.currentWeekDone || 3}/{streak?.currentWeekTarget || 4}
            </span>
          </>
        ),
        imageSrc: '/images/icons/check.svg',
        imageAlt: 'Plan Adherence',
        theme: THEME_ADHERENCE,
      },
      {
        title: 'Hours Invested',
        value: stats.totalHours,
        unit: 'hrs',
        subtext: (
          <>
            <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 text-amber-400" />
            <span className="truncate">
              {stats.totalDays} sess (~{stats.averageHoursPerSession}h)
            </span>
          </>
        ),
        imageSrc: '/images/icons/clock.svg',
        imageAlt: 'Hours Invested',
        theme: THEME_HOURS,
      },
    ];
  }, [stats, streak]);

  if (!stats) return null;

  return (
    <TooltipProvider delayDuration={50}>
      <div className="w-full mt-4 sm:mt-6 mb-6 sm:mb-10 space-y-4 sm:space-y-6">
        {/* GRIND STATS Cyberpunk Header */}
        <div className="flex justify-center items-center relative">
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-neon-green/30 to-neon-cyan/60" />
          <div className="px-3 sm:px-7 py-1.5 sm:py-2 mx-1.5 sm:mx-4 bg-zinc-950/80 border border-neon-green/30 backdrop-blur-xl rounded-full shadow-[0_0_20px_rgba(0,255,136,0.15)] flex items-center gap-1.5 sm:gap-3 relative z-10 shrink-0">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rotate-45 bg-neon-green shadow-[0_0_8px_#00ff88] animate-[badge-pulse_2s_ease-in-out_infinite]" />
            <span className="text-[9.5px] sm:text-xs font-black tracking-[0.18em] sm:tracking-[0.25em] bg-gradient-to-r from-neon-green via-[#00e077] to-neon-cyan bg-clip-text text-transparent uppercase drop-shadow-[0_0_10px_rgba(0,255,136,0.4)]">
              Grind Stats
            </span>
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rotate-45 bg-neon-cyan shadow-[0_0_8px_#22d3ee] animate-[badge-pulse_2s_ease-in-out_infinite]" />
          </div>
          <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-neon-green/30 to-neon-cyan/60" />
        </div>

        {/* Row 1: 4 Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-6">
          {statCardsData.map((card, index) => (
            <StatCard key={index} {...card} />
          ))}
        </div>

        {/* Row 2: Cycle Progress Card — full width */}
        {user && <CycleProgressCard className="mt-6 sm:mt-10" stats={stats} user={user} />}
      </div>
    </TooltipProvider>
  );
}

export default memo(StatsOverview);