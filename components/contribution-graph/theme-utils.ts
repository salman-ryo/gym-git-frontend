import { GymLog, WorkoutType } from '@/lib/types';

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
}

export const THEMES: { name: string; [key: string]: string }[] = [
  {
    name: 'sky',
    tile: 'bg-sky-400 border-sky-500 text-zinc-950',
    ring: 'ring ring-sky-400 ring-offset-1 ring-offset-zinc-950 scale-110 shadow-[0_0_8px_rgba(56,189,248,0.5)]',
    cardGlow: 'bg-zinc-900/80 border-sky-500/30 hover:border-sky-400 hover:shadow-[0_0_15px_rgba(56,189,248,0.2)]',
    text: 'text-sky-400 drop-shadow-[0_0_5px_rgba(56,189,248,0.8)]',
    pillMonth: 'bg-sky-500 text-zinc-950 shadow-[0_0_8px_rgba(56,189,248,0.6)]',
    pillWeek: 'bg-sky-500/10 border-sky-500/40 text-sky-400',
    bar: 'bg-gradient-to-r from-sky-500 to-blue-400 shadow-[0_0_12px_rgba(56,189,248,0.8)]',
    todayRingMonth: 'ring-1 ring-sky-400 border-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.5),inset_0_0_15px_rgba(56,189,248,0.15)] scale-[1.03] z-10 ',
    todayRingWeek: 'ring ring-sky-400 border-sky-400 shadow-[0_0_20px_rgba(56,189,248,0.4),inset_0_0_20px_rgba(56,189,248,0.1)] scale-[1.02] z-10 ',
    todayDot: 'bg-sky-400 shadow-[0_0_8px_#38bdf8]'
  },
  {
    name: 'purple',
    tile: 'bg-purple-400 border-purple-500 text-zinc-950',
    ring: 'ring ring-purple-400 ring-offset-1 ring-offset-zinc-950 scale-110 shadow-[0_0_8px_rgba(192,132,252,0.5)]',
    cardGlow: 'bg-zinc-900/80 border-purple-500/30 hover:border-purple-400 hover:shadow-[0_0_15px_rgba(192,132,252,0.2)]',
    text: 'text-purple-400 drop-shadow-[0_0_5px_rgba(192,132,252,0.8)]',
    pillMonth: 'bg-purple-500 text-zinc-950 shadow-[0_0_8px_rgba(192,132,252,0.6)]',
    pillWeek: 'bg-purple-500/10 border-purple-500/40 text-purple-400',
    bar: 'bg-gradient-to-r from-purple-500 to-fuchsia-400 shadow-[0_0_12px_rgba(192,132,252,0.8)]',
    todayRingMonth: 'ring-1 ring-purple-400 border-purple-400 shadow-[0_0_15px_rgba(192,132,252,0.5),inset_0_0_15px_rgba(192,132,252,0.15)] scale-[1.03] z-10 ',
    todayRingWeek: 'ring ring-purple-400 border-purple-400 shadow-[0_0_20px_rgba(192,132,252,0.4),inset_0_0_20px_rgba(192,132,252,0.1)] scale-[1.02] z-10 ',
    todayDot: 'bg-purple-400 shadow-[0_0_8px_#c084fc]'
  },
  {
    name: 'rose',
    tile: 'bg-rose-400 border-rose-500 text-zinc-950',
    ring: 'ring ring-rose-400 ring-offset-1 ring-offset-zinc-950 scale-110 shadow-[0_0_8px_rgba(251,113,133,0.5)]',
    cardGlow: 'bg-zinc-900/80 border-rose-500/30 hover:border-rose-400 hover:shadow-[0_0_15px_rgba(251,113,133,0.2)]',
    text: 'text-rose-400 drop-shadow-[0_0_5px_rgba(251,113,133,0.8)]',
    pillMonth: 'bg-rose-500 text-zinc-950 shadow-[0_0_8px_rgba(251,113,133,0.6)]',
    pillWeek: 'bg-rose-500/10 border-rose-500/40 text-rose-400',
    bar: 'bg-gradient-to-r from-rose-500 to-pink-400 shadow-[0_0_12px_rgba(251,113,133,0.8)]',
    todayRingMonth: 'ring-1 ring-rose-400 border-rose-400 shadow-[0_0_15px_rgba(251,113,133,0.5),inset_0_0_15px_rgba(251,113,133,0.15)] scale-[1.03] z-10 ',
    todayRingWeek: 'ring ring-rose-400 border-rose-400 shadow-[0_0_20px_rgba(251,113,133,0.4),inset_0_0_20px_rgba(251,113,133,0.1)] scale-[1.02] z-10 ',
    todayDot: 'bg-rose-400 shadow-[0_0_8px_#fb7185]'
  },
  {
    name: 'amber',
    tile: 'bg-amber-400 border-amber-500 text-zinc-950',
    ring: 'ring ring-amber-400 ring-offset-1 ring-offset-zinc-950 scale-110 shadow-[0_0_8px_rgba(251,191,36,0.5)]',
    cardGlow: 'bg-zinc-900/80 border-amber-500/30 hover:border-amber-400 hover:shadow-[0_0_15px_rgba(251,191,36,0.2)]',
    text: 'text-amber-400 drop-shadow-[0_0_5px_rgba(251,191,36,0.8)]',
    pillMonth: 'bg-amber-500 text-zinc-950 shadow-[0_0_8px_rgba(251,191,36,0.6)]',
    pillWeek: 'bg-amber-500/10 border-amber-500/40 text-amber-400',
    bar: 'bg-gradient-to-r from-amber-500 to-orange-400 shadow-[0_0_12px_rgba(251,191,36,0.8)]',
    todayRingMonth: 'ring-1 ring-amber-400 border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.5),inset_0_0_15px_rgba(251,191,36,0.15)] scale-[1.03] z-10 ',
    todayRingWeek: 'ring ring-amber-400 border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.4),inset_0_0_20px_rgba(251,191,36,0.1)] scale-[1.02] z-10 ',
    todayDot: 'bg-amber-400 shadow-[0_0_8px_#fbbf24]'
  },
  {
    name: 'cyan',
    tile: 'bg-cyan-400 border-cyan-500 text-zinc-950',
    ring: 'ring ring-cyan-400 ring-offset-1 ring-offset-zinc-950 scale-110 shadow-[0_0_8px_rgba(34,211,238,0.5)]',
    cardGlow: 'bg-zinc-900/80 border-cyan-500/30 hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(34,211,238,0.2)]',
    text: 'text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]',
    pillMonth: 'bg-cyan-500 text-zinc-950 shadow-[0_0_8px_rgba(34,211,238,0.6)]',
    pillWeek: 'bg-cyan-500/10 border-cyan-500/40 text-cyan-400',
    bar: 'bg-gradient-to-r from-cyan-500 to-teal-400 shadow-[0_0_12px_rgba(34,211,238,0.8)]',
    todayRingMonth: 'ring-1 ring-cyan-400 border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.5),inset_0_0_15px_rgba(34,211,238,0.15)] scale-[1.03] z-10 ',
    todayRingWeek: 'ring ring-cyan-400 border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.4),inset_0_0_20px_rgba(34,211,238,0.1)] scale-[1.02] z-10 ',
    todayDot: 'bg-cyan-400 shadow-[0_0_8px_#22d3ee]'
  }
];

export const getThemeForWorkout = (type: string): WorkoutTheme => {
  const defaultTheme: WorkoutTheme = {
    tile: 'bg-indigo-400 border-indigo-500 text-zinc-950',
    ring: 'ring ring-indigo-400 ring-offset-1 ring-offset-zinc-950 scale-110 shadow-[0_0_8px_rgba(129,140,248,0.5)]',
    cardGlow: 'bg-zinc-900/80 border-indigo-500/30 hover:border-indigo-400 hover:shadow-[0_0_15px_rgba(129,140,248,0.2)]',
    text: 'text-indigo-400 drop-shadow-[0_0_5px_rgba(129,140,248,0.8)]',
    pillMonth: 'bg-indigo-500 text-zinc-950 shadow-[0_0_8px_rgba(129,140,248,0.6)]',
    pillWeek: 'bg-indigo-500/10 border-indigo-500/40 text-indigo-400',
    bar: 'bg-gradient-to-r from-indigo-500 to-violet-400 shadow-[0_0_12px_rgba(129,140,248,0.8)]',
    todayRingMonth: 'ring-1 ring-indigo-400 border-indigo-400 shadow-[0_0_15px_rgba(129,140,248,0.5),inset_0_0_15px_rgba(129,140,248,0.15)] scale-[1.03] z-10 ',
    todayRingWeek: 'ring ring-indigo-400 border-indigo-400 shadow-[0_0_20px_rgba(129,140,248,0.4),inset_0_0_20px_rgba(129,140,248,0.1)] scale-[1.02] z-10 ',
    todayDot: 'bg-indigo-400 shadow-[0_0_8px_#818cf8]'
  };

  if (!type || type === 'All') return defaultTheme;

  let hash = 0;
  for (let i = 0; i < type.length; i++) {
    hash = type.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % THEMES.length;
  const theme = THEMES[index];
  return {
    tile: theme.tile,
    ring: theme.ring,
    cardGlow: theme.cardGlow,
    text: theme.text,
    pillMonth: theme.pillMonth,
    pillWeek: theme.pillWeek,
    bar: theme.bar,
    todayRingMonth: theme.todayRingMonth,
    todayRingWeek: theme.todayRingWeek,
    todayDot: theme.todayDot
  };
};

export const getTileBgColor = (hours: number): string => {
  if (hours <= 0) return 'bg-zinc-800/70 border-zinc-800/40 hover:border-zinc-500';
  if (hours < 0.5) return 'bg-green-950 border-green-800 text-zinc-100';
  if (hours < 1.0) return 'bg-green-800 border-green-700 text-zinc-100';
  if (hours < 1.5) return 'bg-green-600 border-green-600 text-zinc-100';
  if (hours < 2.0) return 'bg-green-400 border-green-400 text-zinc-100';
  if (hours < 2.6) return 'bg-purple-400 border-purple-400 text-zinc-100';
  if (hours >= 3.0) return 'bg-amber-400 border-orange-400 text-zinc-100 animate-pulse';
  return 'bg-green-400 border-green-500 text-zinc-950';
};
