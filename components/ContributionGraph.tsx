'use client';

import { GymLog, TimeframeView, WorkoutType } from '@/lib/types';
import { formatDateKey } from '@/lib/scientific-streak';
import React, { useMemo, useState } from 'react';
import { CalendarRange, Calendar, CalendarDays } from 'lucide-react';
import CustomTooltip from '@/components/CustomTooltip';

interface ContributionGraphProps {
  logs: GymLog[];
  activeFilter: WorkoutType | 'All';
  onTileClick: (dateStr: string, log?: GymLog) => void;
}

interface DayTile {
  dateStr: string;
  dateObj: Date;
  log?: GymLog;
  hours: number;
  workoutType?: WorkoutType;
  dayOfMonth?: number;
  isToday: boolean;
  isFuture: boolean;
}

interface WeekColumn {
  weekIndex: number;
  days: DayTile[];
}

const THEMES = [
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

const getThemeForWorkout = (type: string) => {
  const defaultTheme = {
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
  return THEMES[Math.abs(hash) % THEMES.length];
};

export default function ContributionGraph({
  logs,
  activeFilter,
  onTileClick,
}: ContributionGraphProps) {
  const [timeframe, setTimeframe] = useState<TimeframeView>('year');

  const logMap = useMemo(() => {
    const map = new Map<string, GymLog>();
    logs.forEach((log) => {
      map.set(log.date, log);
    });
    return map;
  }, [logs]);

  const getTileBgColor = (hours: number) => {
    if (hours <= 0) return 'bg-zinc-800/70 border-zinc-800/40 hover:border-zinc-500';
    if (hours < 0.5) return 'bg-green-950 border-green-800 text-zinc-100';
    if (hours < 1.0) return 'bg-green-800 border-green-700 text-zinc-100';
    if (hours < 1.5) return 'bg-green-600 border-green-600 text-zinc-100';
    if (hours < 2.0) return 'bg-green-400 border-green-400 text-zinc-100';
    if (hours < 2.6) return 'bg-purple-400 border-purple-400 text-zinc-100';
    if (hours >= 3.0) return 'bg-amber-400 border-orange-400 text-zinc-100 animate-pulse';
    return 'bg-green-400 border-green-500 text-zinc-950';
  };

  // 1. YEAR VIEW DATA
  const yearData = useMemo(() => {
    const todayObj = new Date();
    const todayStr = formatDateKey(todayObj);
    todayObj.setHours(0, 0, 0, 0);

    const resultWeeks: WeekColumn[] = [];
    const months: { name: string; weekIndex: number }[] = [];

    const todayDayOfWeek = new Date().getDay();
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 364 - todayDayOfWeek);

    let currentDate = new Date(startDate);
    let currentWeekIndex = 0;
    let currentWeekDays: DayTile[] = [];
    let lastMonth = -1;

    let yearWorkouts = 0;
    let yearHours = 0;

    while (currentDate <= endDate) {
      const dateStr = formatDateKey(currentDate);
      const log = logMap.get(dateStr);
      const hours = log ? log.hours : 0;

      if (hours > 0) {
        yearWorkouts++;
        yearHours += hours;
      }

      const monthIndex = currentDate.getMonth();
      if (monthIndex !== lastMonth) {
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        if (months.length > 0) {
          const lastAdded = months[months.length - 1];
          if (currentWeekIndex - lastAdded.weekIndex < 3) {
            if (lastAdded.weekIndex === 0) {
              months.pop();
            }
          }
        }

        if (months.length === 0 || currentWeekIndex - months[months.length - 1].weekIndex >= 3) {
          months.push({ name: monthNames[monthIndex], weekIndex: currentWeekIndex });
        }

        lastMonth = monthIndex;
      }

      const tileTime = new Date(currentDate);
      tileTime.setHours(0, 0, 0, 0);

      currentWeekDays.push({
        dateStr,
        dateObj: new Date(currentDate),
        log,
        hours,
        workoutType: log?.workoutType,
        isToday: dateStr === todayStr,
        isFuture: tileTime.getTime() > todayObj.getTime(),
      });

      if (currentWeekDays.length === 7) {
        resultWeeks.push({
          weekIndex: currentWeekIndex,
          days: currentWeekDays,
        });
        currentWeekIndex++;
        currentWeekDays = [];
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    if (currentWeekDays.length > 0) {
      resultWeeks.push({
        weekIndex: currentWeekIndex,
        days: currentWeekDays,
      });
    }

    return {
      weeks: resultWeeks,
      monthLabels: months,
      totalWorkouts: yearWorkouts,
      totalHours: Number(yearHours.toFixed(1)),
    };
  }, [logMap]);

  // 2. MONTH VIEW DATA
  const monthData = useMemo(() => {
    const todayObj = new Date();
    const todayStr = formatDateKey(todayObj);
    todayObj.setHours(0, 0, 0, 0);

    const year = todayObj.getFullYear();
    const month = todayObj.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const monthDays: DayTile[] = [];
    let monthWorkouts = 0;
    let monthHours = 0;

    const startPadding = firstDay.getDay();

    let d = new Date(firstDay);
    while (d <= lastDay) {
      const dateStr = formatDateKey(d);
      const log = logMap.get(dateStr);
      const hours = log ? log.hours : 0;

      if (hours > 0) {
        monthWorkouts++;
        monthHours += hours;
      }

      const tileTime = new Date(d);
      tileTime.setHours(0, 0, 0, 0);

      monthDays.push({
        dateStr,
        dateObj: new Date(d),
        log,
        hours,
        workoutType: log?.workoutType,
        dayOfMonth: d.getDate(),
        isToday: dateStr === todayStr,
        isFuture: tileTime.getTime() > todayObj.getTime(),
      });
      d.setDate(d.getDate() + 1);
    }

    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    return {
      monthName: monthNames[month],
      year,
      startPadding,
      days: monthDays,
      totalWorkouts: monthWorkouts,
      totalHours: Number(monthHours.toFixed(1)),
    };
  }, [logMap]);

  // 3. WEEK VIEW DATA
  const weekData = useMemo(() => {
    const todayObj = new Date();
    const todayStr = formatDateKey(todayObj);
    todayObj.setHours(0, 0, 0, 0);

    const dayOfWeek = todayObj.getDay();
    const distanceToMon = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(todayObj);
    monday.setDate(todayObj.getDate() + distanceToMon);

    const weekDays: DayTile[] = [];
    let weekWorkouts = 0;
    let weekHours = 0;

    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const dateStr = formatDateKey(d);
      const log = logMap.get(dateStr);
      const hours = log ? log.hours : 0;

      if (hours > 0) {
        weekWorkouts++;
        weekHours += hours;
      }

      const tileTime = new Date(d);
      tileTime.setHours(0, 0, 0, 0);

      weekDays.push({
        dateStr,
        dateObj: d,
        log,
        hours,
        workoutType: log?.workoutType,
        isToday: dateStr === todayStr,
        isFuture: tileTime.getTime() > todayObj.getTime(),
      });
    }

    return {
      days: weekDays,
      totalWorkouts: weekWorkouts,
      totalHours: Number(weekHours.toFixed(1)),
    };
  }, [logMap]);

  return (
    <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.6)] relative overflow-hidden">
      {/* Cyberpunk Header Layout */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 mb-8 pb-4 border-b border-zinc-800/50">
        <div className="w-full">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-2 rotate-45 bg-indigo-400 shadow-[0_0_8px_#818cf8]" />
            <h2 className="text-sm font-black text-indigo-400 uppercase tracking-[0.2em] drop-shadow-[0_0_8px_rgba(129,140,248,0.5)]">
              Activity Logs
            </h2>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-indigo-500/30 to-transparent ml-2" />
          </div>

          <p className="text-[11px] text-zinc-400 mt-2 font-medium tracking-wide">
            {timeframe === 'year' && (
              <>
                <strong className="text-zinc-100 font-bold">{yearData.totalWorkouts} sessions</strong> ({yearData.totalHours} hrs logged) in the <span className="text-indigo-400 font-bold">Past 365 Days</span>
              </>
            )}
            {timeframe === 'month' && (
              <>
                <strong className="text-zinc-100 font-bold">{monthData.totalWorkouts} sessions</strong> ({monthData.totalHours} hrs logged) in <span className="text-indigo-400 font-bold">{monthData.monthName} {monthData.year}</span>
              </>
            )}
            {timeframe === 'week' && (
              <>
                <strong className="text-zinc-100 font-bold">{weekData.totalWorkouts} sessions</strong> ({weekData.totalHours} hrs logged) in the <span className="text-indigo-400 font-bold">Current Week</span>
              </>
            )}
          </p>
        </div>

        {/* Neon Pill Toggles */}
        <div className="flex items-center gap-1.5 bg-zinc-900/60 border border-zinc-800/80 p-1.5 rounded-full shrink-0">
          <button
            type="button"
            onClick={() => setTimeframe('year')}
            className={`px-4 py-1.5 rounded-full text-[10px] uppercase tracking-wider flex items-center gap-1.5 transition-all duration-300 ${timeframe === 'year'
              ? 'bg-indigo-400 text-zinc-950 font-black shadow-[0_0_12px_rgba(129,140,248,0.4)]'
              : 'text-zinc-400 hover:text-zinc-200 font-bold'
              }`}
          >
            <CalendarRange className="w-3 h-3" />
            <span>365 Days</span>
          </button>

          <button
            type="button"
            onClick={() => setTimeframe('month')}
            className={`px-4 py-1.5 rounded-full text-[10px] uppercase tracking-wider flex items-center gap-1.5 transition-all duration-300 ${timeframe === 'month'
              ? 'bg-indigo-400 text-zinc-950 font-black shadow-[0_0_12px_rgba(129,140,248,0.4)]'
              : 'text-zinc-400 hover:text-zinc-200 font-bold'
              }`}
          >
            <Calendar className="w-3 h-3" />
            <span>Month</span>
          </button>

          <button
            type="button"
            onClick={() => setTimeframe('week')}
            className={`px-4 py-1.5 rounded-full text-[10px] uppercase tracking-wider flex items-center gap-1.5 transition-all duration-300 ${timeframe === 'week'
              ? 'bg-indigo-400 text-zinc-950 font-black shadow-[0_0_12px_rgba(129,140,248,0.4)]'
              : 'text-zinc-400 hover:text-zinc-200 font-bold'
              }`}
          >
            <CalendarDays className="w-3 h-3" />
            <span>Week</span>
          </button>
        </div>
      </div>

      {timeframe === 'year' && (
        <div className="animate-in fade-in duration-300">
          <div className="overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
            <div className="min-w-[760px] w-full">
              <div className="relative h-4 text-[9px] uppercase tracking-widest font-bold text-zinc-500 mb-2 ml-8">
                {yearData.monthLabels.map((m, idx) => (
                  <span
                    key={`${m.name}-${idx}`}
                    style={{ left: `${m.weekIndex * 16}px` }}
                    className="absolute"
                  >
                    {m.name}
                  </span>
                ))}
              </div>

              <div className="flex gap-1.5">
                <div className="flex flex-col justify-between text-[9px] uppercase tracking-wider font-bold text-zinc-600 pr-2 py-0.5 select-none">
                  <span>Mon</span>
                  <span>Wed</span>
                  <span>Fri</span>
                </div>

                <div className="flex gap-1">
                  {yearData.weeks.map((week) => (
                    <div key={week.weekIndex} className="flex flex-col gap-1">
                      {week.days.map((day) => {
                        const isFilteredOut = activeFilter !== 'All' && day.hours > 0 && day.workoutType !== activeFilter;
                        const isMatchFilter = activeFilter !== 'All' && day.hours > 0 && day.workoutType === activeFilter;
                        const activeTheme = isMatchFilter ? getThemeForWorkout(activeFilter) : null;

                        let tileColorClass = getTileBgColor(day.hours);
                        if (isMatchFilter && activeTheme) tileColorClass = activeTheme.tile;

                        let ringClass = '';
                        if (day.isToday && !isFilteredOut) {
                          // Force a glowing white ring strictly for "Today" in the 365 view
                          ringClass = 'ring ring-white ring-offset-1 ring-offset-zinc-950 z-10 shadow-[0_0_10px_rgba(255,255,255,0.8)]';
                        } else if (isMatchFilter && activeTheme) {
                          ringClass = activeTheme.ring;
                        }

                        const formattedDate = day.dateObj.toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        });

                        const displayDate = day.isToday ? 'Today' : formattedDate;

                        return (
                          <CustomTooltip
                            key={day.dateStr}
                            content={
                              day.isFuture ? (
                                <div className="text-[11px] text-zinc-500 font-bold uppercase tracking-wider">Future Date Locked</div>
                              ) : (
                                <div className="text-left">
                                  <div className="font-bold text-indigo-400 text-xs">
                                    {day.hours > 0 ? `${day.hours} hrs spent` : 'No gym session'}
                                  </div>
                                  <div className="text-[11px] text-zinc-300 mt-0.5">
                                    {displayDate}
                                    {day.workoutType && (
                                      <span className="ml-1.5 font-bold text-amber-400">
                                        • {day.workoutType}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              )
                            }
                          >
                            <button
                              type="button"
                              disabled={day.isFuture}
                              onClick={() => !day.isFuture && onTileClick(day.dateStr, day.log)}
                              className={`w-3 h-3 rounded-[4px] transition-all duration-150 border transform 
                                ${tileColorClass} 
                                ${day.isFuture ? 'opacity-20 cursor-not-allowed' : 'cursor-pointer hover:scale-125 hover:z-20'} 
                                ${isFilteredOut && !day.isFuture ? 'opacity-20 hover:opacity-100' : ''} 
                                ${ringClass}
                              `}
                            />
                          </CustomTooltip>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 text-[9px] font-bold uppercase tracking-widest text-zinc-500 mt-5 pt-4 border-t border-zinc-800/40">
            <span>Less</span>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-[4px] bg-zinc-800/70 border border-zinc-700/50" title="0 hrs" />
              <div className="w-3 h-3 rounded-[4px] bg-green-700 border border-green-600" title="< 1.0 hr" />
              <div className="w-3 h-3 rounded-[4px] bg-green-500 border border-green-400" title="1.0 - 1.9 hrs" />
              <div className="w-3 h-3 rounded-[4px] bg-green-300 border border-green-400" title="2.0+ hrs" />
            </div>
            <span>More</span>
          </div>
        </div>
      )}

      {timeframe === 'month' && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">
            <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: monthData.startPadding }).map((_, i) => (
              <div key={`pad-${i}`} className="h-16 rounded-xl bg-zinc-900/20 border border-zinc-800/30" />
            ))}

            {monthData.days.map((day) => {
              const isFilteredOut = activeFilter !== 'All' && day.hours > 0 && day.workoutType !== activeFilter;

              const theme = (day.hours > 0 && day.workoutType)
                ? getThemeForWorkout(day.workoutType)
                : getThemeForWorkout('All');

              const formattedDate = day.dateObj.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });

              const displayDate = day.isToday ? 'Today' : formattedDate;

              return (
                <CustomTooltip
                  key={day.dateStr}
                  content={
                    day.isFuture ? (
                      <div className="text-[11px] text-zinc-500 font-bold uppercase tracking-wider">Future Date Locked</div>
                    ) : (
                      <div className="text-left">
                        <div className="font-bold text-indigo-400 text-xs">
                          {day.hours > 0 ? `${day.hours} hrs spent` : 'No gym session'}
                        </div>
                        <div className="text-[11px] text-zinc-300 mt-0.5">
                          {displayDate}
                          {day.workoutType && (
                            <span className="ml-1.5 font-bold text-amber-400">
                              • {day.workoutType}
                            </span>
                          )}
                        </div>
                      </div>
                    )
                  }
                >
                  <button
                    type="button"
                    disabled={day.isFuture}
                    onClick={() => !day.isFuture && onTileClick(day.dateStr, day.log)}
                    className={`h-16 rounded-xl p-2 flex flex-col justify-between text-left transition-all border relative overflow-hidden group 
                      ${day.isFuture
                        ? 'bg-zinc-950/40 border-zinc-800/40 opacity-40 cursor-not-allowed'
                        : 'cursor-pointer ' + (day.hours > 0
                          ? theme.cardGlow
                          : 'bg-zinc-950 border-zinc-800/50 hover:border-zinc-700')
                      } 
                      ${isFilteredOut && !day.isFuture ? 'opacity-20' : ''} 
                      ${day.isToday ? theme.todayRingMonth : ''}
                    `}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className={`text-xs font-black transition-colors ${day.isToday ? theme.text : day.isFuture ? 'text-zinc-700' : 'text-zinc-400'}`}>
                        {day.dayOfMonth}
                      </span>
                      {day.hours > 0 && (
                        <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${theme.pillMonth}`}>
                          {day.hours}h
                        </span>
                      )}
                    </div>

                    {day.workoutType && (
                      <span className={`text-[9px] font-bold truncate w-full uppercase tracking-wide transition-colors ${theme.text}`}>
                        {day.workoutType}
                      </span>
                    )}

                    {/* Neon dot indicator for Today */}
                    {day.isToday && (
                      <div className={`absolute bottom-1.5 right-1.5 w-1.5 h-1.5 rounded-full animate-pulse ${theme.todayDot}`} />
                    )}
                  </button>
                </CustomTooltip>
              );
            })}
          </div>
        </div>
      )}

      {timeframe === 'week' && (
        <div className="grid grid-cols-1 sm:grid-cols-7 gap-3 animate-in fade-in duration-300">
          {weekData.days.map((day) => {
            const dayName = day.dateObj.toLocaleDateString('en-US', { weekday: 'short' });

            const isFilteredOut = activeFilter !== 'All' && day.hours > 0 && day.workoutType !== activeFilter;

            const theme = (day.hours > 0 && day.workoutType)
              ? getThemeForWorkout(day.workoutType)
              : getThemeForWorkout('All');

            const formattedDate = day.dateObj.toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            });

            const displayDate = day.isToday ? 'Today' : formattedDate;

            return (
              <CustomTooltip
                key={day.dateStr}
                content={
                  day.isFuture ? (
                    <div className="text-[11px] text-zinc-500 font-bold uppercase tracking-wider">Future Date Locked</div>
                  ) : (
                    <div className="text-left">
                      <div className="font-bold text-indigo-400 text-xs">
                        {day.hours > 0 ? `${day.hours} hrs spent` : 'No gym session'}
                      </div>
                      <div className="text-[11px] text-zinc-300 mt-0.5">
                        {displayDate}
                        {day.workoutType && (
                          <span className="ml-1.5 font-bold text-amber-400">
                            • {day.workoutType}
                          </span>
                        )}
                      </div>
                    </div>
                  )
                }
              >
                <button
                  type="button"
                  disabled={day.isFuture}
                  onClick={() => !day.isFuture && onTileClick(day.dateStr, day.log)}
                  className={`p-4 rounded-2xl border text-left flex flex-col justify-between h-36 transition-all relative overflow-hidden 
                    ${day.isFuture
                      ? 'bg-zinc-950/40 border-zinc-800/40 opacity-40 cursor-not-allowed'
                      : 'cursor-pointer ' + (day.hours > 0
                        ? theme.cardGlow
                        : 'bg-zinc-950 border-zinc-800/80 hover:border-zinc-700 hover:shadow-[0_0_15px_rgba(255,255,255,0.03)]')
                    } 
                    ${isFilteredOut && !day.isFuture ? 'opacity-20' : ''} 
                    ${day.isToday ? theme.todayRingWeek : ''}
                  `}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1 text-[10px] uppercase font-black tracking-widest">
                      <span className={`${day.isToday ? theme.text : day.isFuture ? 'text-zinc-700' : 'text-zinc-500'}`}>{dayName}</span>
                      <span className={day.isFuture ? 'text-zinc-700' : 'text-zinc-600'}>{day.dateStr.slice(5)}</span>
                    </div>

                    <p className={`text-2xl mt-2 font-black tracking-tighter transition-colors ${day.hours > 0 ? 'text-white' : day.isFuture ? 'text-zinc-800' : 'text-zinc-700'}`}>
                      {day.hours > 0 ? `${day.hours}h` : 'REST'}
                    </p>
                  </div>

                  {day.workoutType ? (
                    <div className="mt-2">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full inline-block uppercase tracking-wider ${theme.pillWeek}`}>
                        {day.workoutType}
                      </span>
                    </div>
                  ) : (
                    <span className={`text-[9px] font-bold uppercase tracking-widest ${day.isFuture ? 'text-zinc-800' : 'text-zinc-600'}`}>None</span>
                  )}

                  {day.hours > 0 && (
                    <div className={`absolute bottom-0 left-0 h-1.5 transition-all ${theme.bar}`} style={{ width: `${Math.min(100, (day.hours / 2.5) * 100)}%` }} />
                  )}
                </button>
              </CustomTooltip>
            );
          })}
        </div>
      )}
    </div>
  );
}