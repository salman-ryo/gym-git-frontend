import { GymLog, WeeklyPlan, WorkoutType } from '@/lib/types';

export interface DayTile {
  dateStr: string;
  dateObj: Date;
  log?: GymLog;
  hours: number;
  workoutType?: WorkoutType;
  dayOfMonth?: number;
  isToday: boolean;
  isFuture: boolean;
}

export interface WeekColumn {
  weekIndex: number;
  days: DayTile[];
}

export interface WorkoutTheme {
  name: string;
  tile: string;
  ring: string;
  cardGlow: string;
  text: string;
  pillMonth: string;
  pillWeek: string;
  bar: string;
  todayRingMonth: string;
  todayRingWeek: string;
  todayDot: string;
  filterActive: string;
  filterInactive: string;
}

export const DEFAULT_GREEN_THEME: WorkoutTheme = {
  name: 'green',
  tile: 'bg-neon-green border-neon-green text-[#060a0e]',
  ring: 'ring ring-neon-green ring-offset-1 ring-offset-zinc-950 scale-110 shadow-[0_0_8px_rgba(0,255,136,0.5)]',
  cardGlow: 'bg-zinc-950/80 border-neon-green/30 hover:border-neon-green/60 hover:shadow-[0_0_15px_rgba(0,255,136,0.25)]',
  text: 'text-neon-green drop-shadow-[0_0_5px_rgba(0,255,136,0.8)]',
  pillMonth: 'bg-gradient-to-r from-neon-green to-[#00e077] text-[#060a0e] font-extrabold shadow-[0_0_8px_rgba(0,255,136,0.6)]',
  pillWeek: 'bg-neon-green/10 border-neon-green/40 text-neon-green',
  bar: 'bg-gradient-to-r from-neon-green to-teal-400 shadow-[0_0_12px_rgba(0,255,136,0.8)]',
  todayRingMonth: 'ring-1 ring-neon-green border-neon-green shadow-[0_0_15px_rgba(0,255,136,0.5),inset_0_0_15px_rgba(0,255,136,0.15)] scale-[1.03] z-10',
  todayRingWeek: 'ring ring-neon-green border-neon-green shadow-[0_0_20px_rgba(0,255,136,0.4),inset_0_0_20px_rgba(0,255,136,0.1)] scale-[1.02] z-10',
  todayDot: 'bg-neon-green shadow-[0_0_8px_#00ff88]',
  filterActive: 'bg-gradient-to-r from-neon-green to-[#00e077] text-[#060a0e] font-extrabold border border-neon-green shadow-[0_0_18px_rgba(0,255,136,0.35)]',
  filterInactive: 'bg-[#05080c] border border-zinc-800/90 text-zinc-400 hover:text-neon-green hover:border-neon-green/50 hover:bg-neon-green/10 hover:shadow-[0_0_12px_rgba(0,255,136,0.18)]'
};

export const THEMES: WorkoutTheme[] = [
  {
    name: 'cyan',
    tile: 'bg-neon-cyan border-neon-cyan text-[#060a0e]',
    ring: 'ring ring-neon-cyan ring-offset-1 ring-offset-zinc-950 scale-110 shadow-[0_0_8px_rgba(34,211,238,0.5)]',
    cardGlow: 'bg-zinc-950/80 border-neon-cyan/30 hover:border-neon-cyan/60 hover:shadow-[0_0_15px_rgba(34,211,238,0.25)]',
    text: 'text-neon-cyan drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]',
    pillMonth: 'bg-gradient-to-r from-neon-cyan to-[#00b8d4] text-[#060a0e] font-extrabold shadow-[0_0_8px_rgba(34,211,238,0.6)]',
    pillWeek: 'bg-neon-cyan/10 border-neon-cyan/40 text-neon-cyan',
    bar: 'bg-gradient-to-r from-neon-cyan to-teal-400 shadow-[0_0_12px_rgba(34,211,238,0.8)]',
    todayRingMonth: 'ring-1 ring-neon-cyan border-neon-cyan shadow-[0_0_15px_rgba(34,211,238,0.5),inset_0_0_15px_rgba(34,211,238,0.15)] scale-[1.03] z-10',
    todayRingWeek: 'ring ring-neon-cyan border-neon-cyan shadow-[0_0_20px_rgba(34,211,238,0.4),inset_0_0_20px_rgba(34,211,238,0.1)] scale-[1.02] z-10',
    todayDot: 'bg-neon-cyan shadow-[0_0_8px_#22d3ee]',
    filterActive: 'bg-gradient-to-r from-neon-cyan to-[#00b8d4] text-[#060a0e] font-extrabold border border-neon-cyan shadow-[0_0_18px_rgba(34,211,238,0.35)]',
    filterInactive: 'bg-[#05080c] border border-zinc-800/90 text-zinc-400 hover:text-neon-cyan hover:border-neon-cyan/50 hover:bg-neon-cyan/10 hover:shadow-[0_0_12px_rgba(34,211,238,0.18)]'
  },
  {
    name: 'purple',
    tile: 'bg-neon-purple border-neon-purple text-white',
    ring: 'ring ring-neon-purple ring-offset-1 ring-offset-zinc-950 scale-110 shadow-[0_0_8px_rgba(168,85,247,0.5)]',
    cardGlow: 'bg-zinc-950/80 border-neon-purple/30 hover:border-neon-purple/60 hover:shadow-[0_0_15px_rgba(168,85,247,0.25)]',
    text: 'text-neon-purple drop-shadow-[0_0_5px_rgba(168,85,247,0.8)]',
    pillMonth: 'bg-gradient-to-r from-neon-purple to-[#9333ea] text-white font-extrabold shadow-[0_0_8px_rgba(168,85,247,0.6)]',
    pillWeek: 'bg-neon-purple/10 border-neon-purple/40 text-neon-purple',
    bar: 'bg-gradient-to-r from-neon-purple to-fuchsia-400 shadow-[0_0_12px_rgba(168,85,247,0.8)]',
    todayRingMonth: 'ring-1 ring-neon-purple border-neon-purple shadow-[0_0_15px_rgba(168,85,247,0.5),inset_0_0_15px_rgba(168,85,247,0.15)] scale-[1.03] z-10',
    todayRingWeek: 'ring ring-neon-purple border-neon-purple shadow-[0_0_20px_rgba(168,85,247,0.4),inset_0_0_20px_rgba(168,85,247,0.1)] scale-[1.02] z-10',
    todayDot: 'bg-neon-purple shadow-[0_0_8px_#c084fc]',
    filterActive: 'bg-gradient-to-r from-neon-purple to-[#9333ea] text-white font-extrabold border border-neon-purple shadow-[0_0_18px_rgba(168,85,247,0.35)]',
    filterInactive: 'bg-[#05080c] border border-zinc-800/90 text-zinc-400 hover:text-neon-purple hover:border-neon-purple/50 hover:bg-neon-purple/10 hover:shadow-[0_0_12px_rgba(168,85,247,0.18)]'
  },
  {
    name: 'sky',
    tile: 'bg-sky-400 border-sky-400 text-[#060a0e]',
    ring: 'ring ring-sky-400 ring-offset-1 ring-offset-zinc-950 scale-110 shadow-[0_0_8px_rgba(56,189,248,0.5)]',
    cardGlow: 'bg-zinc-950/80 border-sky-400/30 hover:border-sky-400/60 hover:shadow-[0_0_15px_rgba(56,189,248,0.25)]',
    text: 'text-sky-400 drop-shadow-[0_0_5px_rgba(56,189,248,0.8)]',
    pillMonth: 'bg-gradient-to-r from-sky-400 to-sky-500 text-[#060a0e] font-extrabold shadow-[0_0_8px_rgba(56,189,248,0.6)]',
    pillWeek: 'bg-sky-500/10 border-sky-500/40 text-sky-400',
    bar: 'bg-gradient-to-r from-sky-400 to-blue-500 shadow-[0_0_12px_rgba(56,189,248,0.8)]',
    todayRingMonth: 'ring-1 ring-sky-400 border-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.5),inset_0_0_15px_rgba(56,189,248,0.15)] scale-[1.03] z-10',
    todayRingWeek: 'ring ring-sky-400 border-sky-400 shadow-[0_0_20px_rgba(56,189,248,0.4),inset_0_0_20px_rgba(56,189,248,0.1)] scale-[1.02] z-10',
    todayDot: 'bg-sky-400 shadow-[0_0_8px_#38bdf8]',
    filterActive: 'bg-gradient-to-r from-sky-400 to-sky-500 text-[#060a0e] font-extrabold border border-sky-400 shadow-[0_0_18px_rgba(56,189,248,0.35)]',
    filterInactive: 'bg-[#05080c] border border-zinc-800/90 text-zinc-400 hover:text-sky-400 hover:border-sky-400/50 hover:bg-sky-500/10 hover:shadow-[0_0_12px_rgba(56,189,248,0.18)]'
  },
  {
    name: 'amber',
    tile: 'bg-amber-400 border-amber-400 text-[#060a0e]',
    ring: 'ring ring-amber-400 ring-offset-1 ring-offset-zinc-950 scale-110 shadow-[0_0_8px_rgba(251,191,36,0.5)]',
    cardGlow: 'bg-zinc-950/80 border-amber-400/30 hover:border-amber-400/60 hover:shadow-[0_0_15px_rgba(251,191,36,0.25)]',
    text: 'text-amber-400 drop-shadow-[0_0_5px_rgba(251,191,36,0.8)]',
    pillMonth: 'bg-gradient-to-r from-amber-400 to-amber-500 text-[#060a0e] font-extrabold shadow-[0_0_8px_rgba(251,191,36,0.6)]',
    pillWeek: 'bg-amber-500/10 border-amber-500/40 text-amber-400',
    bar: 'bg-gradient-to-r from-amber-400 to-orange-500 shadow-[0_0_12px_rgba(251,191,36,0.8)]',
    todayRingMonth: 'ring-1 ring-amber-400 border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.5),inset_0_0_15px_rgba(251,191,36,0.15)] scale-[1.03] z-10',
    todayRingWeek: 'ring ring-amber-400 border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.4),inset_0_0_20px_rgba(251,191,36,0.1)] scale-[1.02] z-10',
    todayDot: 'bg-amber-400 shadow-[0_0_8px_#fbbf24]',
    filterActive: 'bg-gradient-to-r from-amber-400 to-amber-500 text-[#060a0e] font-extrabold border border-amber-400 shadow-[0_0_18px_rgba(251,191,36,0.35)]',
    filterInactive: 'bg-[#05080c] border border-zinc-800/90 text-zinc-400 hover:text-amber-400 hover:border-amber-400/50 hover:bg-amber-500/10 hover:shadow-[0_0_12px_rgba(251,191,36,0.18)]'
  },
  {
    name: 'rose',
    tile: 'bg-rose-400 border-rose-400 text-white',
    ring: 'ring ring-rose-400 ring-offset-1 ring-offset-zinc-950 scale-110 shadow-[0_0_8px_rgba(251,113,133,0.5)]',
    cardGlow: 'bg-zinc-950/80 border-rose-400/30 hover:border-rose-400/60 hover:shadow-[0_0_15px_rgba(251,113,133,0.25)]',
    text: 'text-rose-400 drop-shadow-[0_0_5px_rgba(251,113,133,0.8)]',
    pillMonth: 'bg-gradient-to-r from-rose-400 to-rose-500 text-white font-extrabold shadow-[0_0_8px_rgba(251,113,133,0.6)]',
    pillWeek: 'bg-rose-500/10 border-rose-500/40 text-rose-400',
    bar: 'bg-gradient-to-r from-rose-400 to-pink-500 shadow-[0_0_12px_rgba(251,113,133,0.8)]',
    todayRingMonth: 'ring-1 ring-rose-400 border-rose-400 shadow-[0_0_15px_rgba(251,113,133,0.5),inset_0_0_15px_rgba(251,113,133,0.15)] scale-[1.03] z-10',
    todayRingWeek: 'ring ring-rose-400 border-rose-400 shadow-[0_0_20px_rgba(251,113,133,0.4),inset_0_0_20px_rgba(251,113,133,0.1)] scale-[1.02] z-10',
    todayDot: 'bg-rose-400 shadow-[0_0_8px_#fb7185]',
    filterActive: 'bg-gradient-to-r from-rose-400 to-rose-500 text-white font-extrabold border border-rose-400 shadow-[0_0_18px_rgba(251,113,133,0.35)]',
    filterInactive: 'bg-[#05080c] border border-zinc-800/90 text-zinc-400 hover:text-rose-400 hover:border-rose-400/50 hover:bg-rose-500/10 hover:shadow-[0_0_12px_rgba(251,113,133,0.18)]'
  },
  {
    name: 'emerald',
    tile: 'bg-emerald-400 border-emerald-400 text-[#060a0e]',
    ring: 'ring ring-emerald-400 ring-offset-1 ring-offset-zinc-950 scale-110 shadow-[0_0_8px_rgba(52,211,153,0.5)]',
    cardGlow: 'bg-zinc-950/80 border-emerald-400/30 hover:border-emerald-400/60 hover:shadow-[0_0_15px_rgba(52,211,153,0.25)]',
    text: 'text-emerald-400 drop-shadow-[0_0_5px_rgba(52,211,153,0.8)]',
    pillMonth: 'bg-gradient-to-r from-emerald-400 to-emerald-500 text-[#060a0e] font-extrabold shadow-[0_0_8px_rgba(52,211,153,0.6)]',
    pillWeek: 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400',
    bar: 'bg-gradient-to-r from-emerald-400 to-teal-500 shadow-[0_0_12px_rgba(52,211,153,0.8)]',
    todayRingMonth: 'ring-1 ring-emerald-400 border-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.5),inset_0_0_15px_rgba(52,211,153,0.15)] scale-[1.03] z-10',
    todayRingWeek: 'ring ring-emerald-400 border-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.4),inset_0_0_20px_rgba(52,211,153,0.1)] scale-[1.02] z-10',
    todayDot: 'bg-emerald-400 shadow-[0_0_8px_#34d399]',
    filterActive: 'bg-gradient-to-r from-emerald-400 to-emerald-500 text-[#060a0e] font-extrabold border border-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.35)]',
    filterInactive: 'bg-[#05080c] border border-zinc-800/90 text-zinc-400 hover:text-emerald-400 hover:border-emerald-400/50 hover:bg-emerald-500/10 hover:shadow-[0_0_12px_rgba(52,211,153,0.18)]'
  },
  {
    name: 'fuchsia',
    tile: 'bg-fuchsia-400 border-fuchsia-400 text-white',
    ring: 'ring ring-fuchsia-400 ring-offset-1 ring-offset-zinc-950 scale-110 shadow-[0_0_8px_rgba(232,121,249,0.5)]',
    cardGlow: 'bg-zinc-950/80 border-fuchsia-400/30 hover:border-fuchsia-400/60 hover:shadow-[0_0_15px_rgba(232,121,249,0.25)]',
    text: 'text-fuchsia-400 drop-shadow-[0_0_5px_rgba(232,121,249,0.8)]',
    pillMonth: 'bg-gradient-to-r from-fuchsia-400 to-fuchsia-500 text-white font-extrabold shadow-[0_0_8px_rgba(232,121,249,0.6)]',
    pillWeek: 'bg-fuchsia-500/10 border-fuchsia-500/40 text-fuchsia-400',
    bar: 'bg-gradient-to-r from-fuchsia-400 to-pink-500 shadow-[0_0_12px_rgba(232,121,249,0.8)]',
    todayRingMonth: 'ring-1 ring-fuchsia-400 border-fuchsia-400 shadow-[0_0_15px_rgba(232,121,249,0.5),inset_0_0_15px_rgba(232,121,249,0.15)] scale-[1.03] z-10',
    todayRingWeek: 'ring ring-fuchsia-400 border-fuchsia-400 shadow-[0_0_20px_rgba(232,121,249,0.4),inset_0_0_20px_rgba(232,121,249,0.1)] scale-[1.02] z-10',
    todayDot: 'bg-fuchsia-400 shadow-[0_0_8px_#e879f9]',
    filterActive: 'bg-gradient-to-r from-fuchsia-400 to-fuchsia-500 text-white font-extrabold border border-fuchsia-400 shadow-[0_0_18px_rgba(232,121,249,0.35)]',
    filterInactive: 'bg-[#05080c] border border-zinc-800/90 text-zinc-400 hover:text-fuchsia-400 hover:border-fuchsia-400/50 hover:bg-fuchsia-500/10 hover:shadow-[0_0_12px_rgba(232,121,249,0.18)]'
  },
  {
    name: 'indigo',
    tile: 'bg-indigo-400 border-indigo-400 text-white',
    ring: 'ring ring-indigo-400 ring-offset-1 ring-offset-zinc-950 scale-110 shadow-[0_0_8px_rgba(129,140,248,0.5)]',
    cardGlow: 'bg-zinc-950/80 border-indigo-400/30 hover:border-indigo-400/60 hover:shadow-[0_0_15px_rgba(129,140,248,0.25)]',
    text: 'text-indigo-400 drop-shadow-[0_0_5px_rgba(129,140,248,0.8)]',
    pillMonth: 'bg-gradient-to-r from-indigo-400 to-indigo-500 text-white font-extrabold shadow-[0_0_8px_rgba(129,140,248,0.6)]',
    pillWeek: 'bg-indigo-500/10 border-indigo-500/40 text-indigo-400',
    bar: 'bg-gradient-to-r from-indigo-400 to-violet-500 shadow-[0_0_12px_rgba(129,140,248,0.8)]',
    todayRingMonth: 'ring-1 ring-indigo-400 border-indigo-400 shadow-[0_0_15px_rgba(129,140,248,0.5),inset_0_0_15px_rgba(129,140,248,0.15)] scale-[1.03] z-10',
    todayRingWeek: 'ring ring-indigo-400 border-indigo-400 shadow-[0_0_20px_rgba(129,140,248,0.4),inset_0_0_20px_rgba(129,140,248,0.1)] scale-[1.02] z-10',
    todayDot: 'bg-indigo-400 shadow-[0_0_8px_#818cf8]',
    filterActive: 'bg-gradient-to-r from-indigo-400 to-indigo-500 text-white font-extrabold border border-indigo-400 shadow-[0_0_18px_rgba(129,140,248,0.35)]',
    filterInactive: 'bg-[#05080c] border border-zinc-800/90 text-zinc-400 hover:text-indigo-400 hover:border-indigo-400/50 hover:bg-indigo-500/10 hover:shadow-[0_0_12px_rgba(129,140,248,0.18)]'
  },
  {
    name: 'teal',
    tile: 'bg-teal-400 border-teal-400 text-[#060a0e]',
    ring: 'ring ring-teal-400 ring-offset-1 ring-offset-zinc-950 scale-110 shadow-[0_0_8px_rgba(45,212,191,0.5)]',
    cardGlow: 'bg-zinc-950/80 border-teal-400/30 hover:border-teal-400/60 hover:shadow-[0_0_15px_rgba(45,212,191,0.25)]',
    text: 'text-teal-400 drop-shadow-[0_0_5px_rgba(45,212,191,0.8)]',
    pillMonth: 'bg-gradient-to-r from-teal-400 to-teal-500 text-[#060a0e] font-extrabold shadow-[0_0_8px_rgba(45,212,191,0.6)]',
    pillWeek: 'bg-teal-500/10 border-teal-500/40 text-teal-400',
    bar: 'bg-gradient-to-r from-teal-400 to-cyan-500 shadow-[0_0_12px_rgba(45,212,191,0.8)]',
    todayRingMonth: 'ring-1 ring-teal-400 border-teal-400 shadow-[0_0_15px_rgba(45,212,191,0.5),inset_0_0_15px_rgba(45,212,191,0.15)] scale-[1.03] z-10',
    todayRingWeek: 'ring ring-teal-400 border-teal-400 shadow-[0_0_20px_rgba(45,212,191,0.4),inset_0_0_20px_rgba(45,212,191,0.1)] scale-[1.02] z-10',
    todayDot: 'bg-teal-400 shadow-[0_0_8px_#2dd4bf]',
    filterActive: 'bg-gradient-to-r from-teal-400 to-teal-500 text-[#060a0e] font-extrabold border border-teal-400 shadow-[0_0_18px_rgba(45,212,191,0.35)]',
    filterInactive: 'bg-[#05080c] border border-zinc-800/90 text-zinc-400 hover:text-teal-400 hover:border-teal-400/50 hover:bg-teal-500/10 hover:shadow-[0_0_12px_rgba(45,212,191,0.18)]'
  },
  {
    name: 'lime',
    tile: 'bg-lime-400 border-lime-400 text-[#060a0e]',
    ring: 'ring ring-lime-400 ring-offset-1 ring-offset-zinc-950 scale-110 shadow-[0_0_8px_rgba(163,230,53,0.5)]',
    cardGlow: 'bg-zinc-950/80 border-lime-400/30 hover:border-lime-400/60 hover:shadow-[0_0_15px_rgba(163,230,53,0.25)]',
    text: 'text-lime-400 drop-shadow-[0_0_5px_rgba(163,230,53,0.8)]',
    pillMonth: 'bg-gradient-to-r from-lime-400 to-lime-500 text-[#060a0e] font-extrabold shadow-[0_0_8px_rgba(163,230,53,0.6)]',
    pillWeek: 'bg-lime-500/10 border-lime-500/40 text-lime-400',
    bar: 'bg-gradient-to-r from-lime-400 to-green-500 shadow-[0_0_12px_rgba(163,230,53,0.8)]',
    todayRingMonth: 'ring-1 ring-lime-400 border-lime-400 shadow-[0_0_15px_rgba(163,230,53,0.5),inset_0_0_15px_rgba(163,230,53,0.15)] scale-[1.03] z-10',
    todayRingWeek: 'ring ring-lime-400 border-lime-400 shadow-[0_0_20px_rgba(163,230,53,0.4),inset_0_0_20px_rgba(163,230,53,0.1)] scale-[1.02] z-10',
    todayDot: 'bg-lime-400 shadow-[0_0_8px_#a3e635]',
    filterActive: 'bg-gradient-to-r from-lime-400 to-lime-500 text-[#060a0e] font-extrabold border border-lime-400 shadow-[0_0_18px_rgba(163,230,53,0.35)]',
    filterInactive: 'bg-[#05080c] border border-zinc-800/90 text-zinc-400 hover:text-lime-400 hover:border-lime-400/50 hover:bg-lime-500/10 hover:shadow-[0_0_12px_rgba(163,230,53,0.18)]'
  }
];

export const getThemeForWorkout = (type?: string, weeklyPlan?: WeeklyPlan): WorkoutTheme => {
  if (!type || type === 'All' || type.toLowerCase() === 'rest') {
    return DEFAULT_GREEN_THEME;
  }

  // If weekly plan is provided, match by plan categories index
  if (weeklyPlan?.categories && weeklyPlan.categories.length > 0) {
    const categoryIndex = weeklyPlan.categories.indexOf(type);
    if (categoryIndex !== -1) {
      return THEMES[categoryIndex % THEMES.length];
    }
    // If not matching any category in the active plan, show default green theme
    return DEFAULT_GREEN_THEME;
  }

  // Fallback deterministic hashing
  let hash = 0;
  for (let i = 0; i < type.length; i++) {
    hash = type.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % THEMES.length;
  return THEMES[index];
};

export const getTileBgColor = (hours: number): string => {
  if (hours <= 0) return 'bg-[#0d1117] border-zinc-900/60 hover:border-zinc-700';
  return 'bg-gradient-to-br from-[#166534] to-[#22c55e] border-emerald-500/50 text-white';
};

export interface DayStyleInfo {
  tileClass: string;
  glowClass?: string;
  ringClass?: string;
  badgeContent?: string;
  tooltipType: 'active' | 'rest' | 'freeze' | 'missed' | 'future';
}

export const getDayStyleInfo = (
  day: DayTile,
  activeFilter: string = 'All',
  weeklyPlan?: WeeklyPlan
): DayStyleInfo => {
  void weeklyPlan;
  if (day.isFuture) {
    return {
      tileClass: 'bg-zinc-950/40 border-zinc-800/40 opacity-40 cursor-not-allowed',
      tooltipType: 'future',
    };
  }

  const isRest = day.workoutType?.toLowerCase() === 'rest' || day.log?.workoutType?.toLowerCase() === 'rest';
  const isFreeze = day.workoutType?.toLowerCase() === 'freeze' || day.log?.workoutType?.toLowerCase() === 'freeze';
  const isActiveWorkout = day.hours > 0 && !isRest && !isFreeze;

  if (isActiveWorkout) {
    const isFilteredOut = activeFilter !== 'All' && day.workoutType !== activeFilter;
    
    // Active Workout Day: Dark to vibrant green gradient (#166534 to #22c55e)
    const baseTile = 'bg-gradient-to-br from-[#166534] to-[#22c55e] border-emerald-500/30 text-white';
    
    return {
      tileClass: isFilteredOut ? 'opacity-20 ' + baseTile : baseTile,
      glowClass: 'shadow-[0_0_12px_rgba(34,197,94,0.3)]',
      ringClass: day.isToday 
        ? 'ring-2 ring-emerald-400 ring-offset-1 ring-offset-zinc-950 shadow-[0_0_15px_#22c55e]'
        : '',
      tooltipType: 'active',
    };
  }

  if (isFreeze) {
    // Frozen Day ("Ice Pause"): Distinct icy blue frost tile (#38bdf8 with subtle snowflake overlay / frost glow)
    const baseTile = 'bg-[#38bdf8] border-[#38bdf8]/60 text-zinc-950 font-bold';
    return {
      tileClass: baseTile,
      glowClass: 'shadow-[0_0_15px_rgba(56,189,248,0.35)]',
      ringClass: day.isToday 
        ? 'ring-2 ring-sky-300 ring-offset-1 ring-offset-zinc-950 shadow-[0_0_15px_#38bdf8]'
        : '',
      badgeContent: '❄️',
      tooltipType: 'freeze',
    };
  }

  if (isRest) {
    // Rest Token Day: Neutral slate indicator (#334155)
    return {
      tileClass: 'bg-[#334155] border-slate-500/50 text-slate-200',
      ringClass: day.isToday 
        ? 'ring-2 ring-slate-400 ring-offset-1 ring-offset-zinc-950'
        : '',
      badgeContent: '🛡️',
      tooltipType: 'rest',
    };
  }

  // Missed Day: Default dark tile (#0d1117)
  return {
    tileClass: 'bg-[#0d1117] border-zinc-900/60 hover:border-zinc-700 text-zinc-550',
    ringClass: day.isToday 
      ? 'ring-2 ring-zinc-500 ring-offset-1 ring-offset-zinc-950'
      : '',
    tooltipType: 'missed',
  };
};

