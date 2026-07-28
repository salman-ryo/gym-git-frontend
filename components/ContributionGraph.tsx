'use client';

import { GymLog, TimeframeView, WorkoutType } from '@/lib/types';
import { formatDateKey } from '@/lib/scientific-streak';
import React, { useMemo, useState } from 'react';
import { CalendarRange, Calendar, CalendarDays } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
}

interface WeekColumn {
  weekIndex: number;
  days: DayTile[];
}

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
    if (hours < 1.0) return 'bg-green-300 border-green-400 text-zinc-950';
    if (hours < 2.0) return 'bg-green-500 border-green-400 text-zinc-950';
    return 'bg-green-700 border-green-600 text-zinc-100';
  };

  // 1. YEAR VIEW DATA (365 days, 52 weeks)
  const yearData = useMemo(() => {
    const today = new Date();
    const resultWeeks: WeekColumn[] = [];
    const months: { name: string; weekIndex: number }[] = [];

    const todayDayOfWeek = today.getDay();
    const endDate = new Date(today);
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 364 - todayDayOfWeek);

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

        // OVERLAP PREVENTION LOGIC:
        // Ensure at least 3 weeks of space between month labels.
        if (months.length > 0) {
          const lastAdded = months[months.length - 1];
          if (currentWeekIndex - lastAdded.weekIndex < 3) {
            // If the previous label was placed right at the beginning, 
            // remove it to favor the first full month (fixes Jul/Aug overlap at start).
            if (lastAdded.weekIndex === 0) {
              months.pop();
            }
          }
        }

        // Only push if there's enough space from the last label or if it's the first one
        if (months.length === 0 || currentWeekIndex - months[months.length - 1].weekIndex >= 3) {
          months.push({ name: monthNames[monthIndex], weekIndex: currentWeekIndex });
        }

        lastMonth = monthIndex;
      }

      currentWeekDays.push({
        dateStr,
        dateObj: new Date(currentDate),
        log,
        hours,
        workoutType: log?.workoutType,
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

  // 2. MONTH VIEW DATA (Current month days)
  const monthData = useMemo(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
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

      monthDays.push({
        dateStr,
        dateObj: new Date(d),
        log,
        hours,
        workoutType: log?.workoutType,
        dayOfMonth: d.getDate(),
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

  // 3. WEEK VIEW DATA (Current week Mon-Sun)
  const weekData = useMemo(() => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const distanceToMon = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(today);
    monday.setDate(today.getDate() + distanceToMon);

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

      weekDays.push({
        dateStr,
        dateObj: d,
        log,
        hours,
        workoutType: log?.workoutType,
      });
    }

    return {
      days: weekDays,
      totalWorkouts: weekWorkouts,
      totalHours: Number(weekHours.toFixed(1)),
    };
  }, [logMap]);

  return (
    <TooltipProvider delayDuration={50}>
      <div className="bg-zinc-900/80 border border-zinc-800 backdrop-blur-xl p-6 rounded-2xl shadow-xl relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-zinc-800/80">
          <div>
            <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
              <span>Gym Activity View</span>
              <span className="text-xs font-normal text-zinc-400">
                ({timeframe === 'year' ? 'Past 365 Days' : timeframe === 'month' ? `${monthData.monthName} ${monthData.year}` : 'Current Week'})
              </span>
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              {timeframe === 'year' && (
                <>
                  <strong className="text-emerald-400 font-semibold">{yearData.totalWorkouts} sessions</strong> ({yearData.totalHours} hrs logged) in the last year
                </>
              )}
              {timeframe === 'month' && (
                <>
                  <strong className="text-emerald-400 font-semibold">{monthData.totalWorkouts} sessions</strong> ({monthData.totalHours} hrs logged) this month
                </>
              )}
              {timeframe === 'week' && (
                <>
                  <strong className="text-emerald-400 font-semibold">{weekData.totalWorkouts} sessions</strong> ({weekData.totalHours} hrs logged) this week
                </>
              )}
            </p>
          </div>

          <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setTimeframe('year')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${timeframe === 'year'
                ? 'bg-emerald-500 text-zinc-950 font-bold shadow-md shadow-emerald-500/20'
                : 'text-zinc-400 hover:text-zinc-200'
                }`}
            >
              <CalendarRange className="w-3.5 h-3.5" />
              <span>365 Days</span>
            </button>

            <button
              type="button"
              onClick={() => setTimeframe('month')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${timeframe === 'month'
                ? 'bg-emerald-500 text-zinc-950 font-bold shadow-md shadow-emerald-500/20'
                : 'text-zinc-400 hover:text-zinc-200'
                }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>This Month</span>
            </button>

            <button
              type="button"
              onClick={() => setTimeframe('week')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${timeframe === 'week'
                ? 'bg-emerald-500 text-zinc-950 font-bold shadow-md shadow-emerald-500/20'
                : 'text-zinc-400 hover:text-zinc-200'
                }`}
            >
              <CalendarDays className="w-3.5 h-3.5" />
              <span>This Week</span>
            </button>
          </div>
        </div>

        {timeframe === 'year' && (
          <>
            <div className="overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
              <div className="min-w-[760px] w-full">
                <div className="relative h-4 text-[11px] font-medium text-zinc-400 mb-2 ml-8">
                  {yearData.monthLabels.map((m, idx) => (
                    <span
                      key={`${m.name}-${idx}`}
                      style={{
                        left: `${m.weekIndex * 16}px`,
                      }}
                      className="absolute"
                    >
                      {m.name}
                    </span>
                  ))}
                </div>

                <div className="flex gap-1.5">
                  <div className="flex flex-col justify-between text-[10px] font-medium text-zinc-500 pr-2 py-0.5 select-none">
                    <span>Mon</span>
                    <span>Wed</span>
                    <span>Fri</span>
                  </div>

                  <div className="flex gap-1">
                    {yearData.weeks.map((week) => (
                      <div key={week.weekIndex} className="flex flex-col gap-1">
                        {week.days.map((day) => {
                          const isFilteredOut =
                            activeFilter !== 'All' &&
                            day.hours > 0 &&
                            day.workoutType !== activeFilter;

                          const isMatchFilter =
                            activeFilter !== 'All' &&
                            day.hours > 0 &&
                            day.workoutType === activeFilter;

                          const formattedDate = day.dateObj.toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          });

                          return (
                            <Tooltip key={day.dateStr}>
                              <TooltipTrigger asChild>
                                <button
                                  type="button"
                                  onClick={() => onTileClick(day.dateStr, day.log)}
                                  className={`w-3 h-3 rounded-sm transition-all duration-150 border transform hover:scale-125 hover:z-20 cursor-pointer ${getTileBgColor(
                                    day.hours
                                  )} ${isFilteredOut ? 'opacity-20 hover:opacity-100' : 'opacity-100'} ${isMatchFilter ? 'ring-2 ring-emerald-400 ring-offset-1 ring-offset-zinc-950 scale-110' : ''
                                    }`}
                                />
                              </TooltipTrigger>
                              <TooltipContent side="top">
                                <div className="text-left">
                                  <div className="font-bold text-emerald-400 text-xs">
                                    {day.hours > 0
                                      ? `${day.hours} hrs spent`
                                      : 'No gym session'}
                                  </div>
                                  <div className="text-[11px] text-zinc-300 mt-0.5">
                                    {formattedDate}
                                    {day.workoutType && (
                                      <span className="ml-1.5 font-bold text-amber-400">
                                        • {day.workoutType}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 text-xs text-zinc-400 mt-4 pt-3 border-t border-zinc-800/60">
              <span>Less</span>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-sm bg-zinc-800/70 border border-zinc-700/50" title="0 hrs" />
                <div className="w-3 h-3 rounded-sm bg-green-300 border border-green-400" title="< 1.0 hr" />
                <div className="w-3 h-3 rounded-sm bg-green-500 border border-green-400" title="1.0 - 1.9 hrs" />
                <div className="w-3 h-3 rounded-sm bg-green-700 border border-green-600" title="2.0+ hrs" />
              </div>
              <span>More</span>
            </div>
          </>
        )}

        {timeframe === 'month' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-zinc-400 mb-2">
              <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
            </div>

            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: monthData.startPadding }).map((_, i) => (
                <div key={`pad-${i}`} className="h-14 rounded-xl bg-zinc-950/40 border border-zinc-800/40" />
              ))}

              {monthData.days.map((day) => {
                const isFilteredOut =
                  activeFilter !== 'All' &&
                  day.hours > 0 &&
                  day.workoutType !== activeFilter;

                const isToday = formatDateKey(new Date()) === day.dateStr;

                const formattedDate = day.dateObj.toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                });

                return (
                  <Tooltip key={day.dateStr}>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        onClick={() => onTileClick(day.dateStr, day.log)}
                        className={`h-16 rounded-2xl p-2 flex flex-col justify-between text-left transition-all border relative overflow-hidden group cursor-pointer ${day.hours > 0
                          ? 'bg-zinc-800/90 border-emerald-500/40 hover:border-emerald-400 shadow-md'
                          : 'bg-zinc-950 border-zinc-800/80 hover:border-zinc-700'
                          } ${isFilteredOut ? 'opacity-20' : 'opacity-100'} ${isToday ? 'ring-2 ring-emerald-400' : ''
                          }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className={`text-xs font-bold ${isToday ? 'text-emerald-400' : 'text-zinc-300'}`}>
                            {day.dayOfMonth}
                          </span>
                          {day.hours > 0 && (
                            <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-full bg-emerald-500 text-zinc-950">
                              {day.hours}h
                            </span>
                          )}
                        </div>

                        {day.workoutType && (
                          <span className="text-[10px] font-semibold text-emerald-300 truncate w-full">
                            {day.workoutType}
                          </span>
                        )}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <div className="text-left">
                        <div className="font-bold text-emerald-400 text-xs">
                          {day.hours > 0
                            ? `${day.hours} hrs spent`
                            : 'No gym session'}
                        </div>
                        <div className="text-[11px] text-zinc-300 mt-0.5">
                          {formattedDate}
                          {day.workoutType && (
                            <span className="ml-1.5 font-bold text-amber-400">
                              • {day.workoutType}
                            </span>
                          )}
                        </div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          </div>
        )}

        {timeframe === 'week' && (
          <div className="grid grid-cols-1 sm:grid-cols-7 gap-3 animate-in fade-in duration-200">
            {weekData.days.map((day) => {
              const dayName = day.dateObj.toLocaleDateString('en-US', { weekday: 'short' });
              const isToday = formatDateKey(new Date()) === day.dateStr;
              const isFilteredOut =
                activeFilter !== 'All' &&
                day.hours > 0 &&
                day.workoutType !== activeFilter;

              const formattedDate = day.dateObj.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });

              return (
                <Tooltip key={day.dateStr}>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={() => onTileClick(day.dateStr, day.log)}
                      className={`p-4 rounded-2xl border text-left flex flex-col justify-between h-36 transition-all relative overflow-hidden cursor-pointer ${day.hours > 0
                        ? 'bg-zinc-900 border-emerald-500/50 hover:border-emerald-400 shadow-lg'
                        : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'
                        } ${isFilteredOut ? 'opacity-20' : 'opacity-100'} ${isToday ? 'ring-2 ring-emerald-400' : ''
                        }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-zinc-400">{dayName}</span>
                          <span className="text-[10px] text-zinc-500">{day.dateStr.slice(5)}</span>
                        </div>

                        <p className="text-lg font-black text-zinc-100">
                          {day.hours > 0 ? `${day.hours} hrs` : 'Rest'}
                        </p>
                      </div>

                      {day.workoutType ? (
                        <div className="mt-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 inline-block">
                            {day.workoutType}
                          </span>
                        </div>
                      ) : (
                        <span className="text-[10px] text-zinc-600">No workout</span>
                      )}

                      {day.hours > 0 && (
                        <div
                          style={{ width: `${Math.min(100, (day.hours / 2.5) * 100)}%` }}
                          className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-400"
                        />
                      )}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <div className="text-left">
                      <div className="font-bold text-emerald-400 text-xs">
                        {day.hours > 0
                          ? `${day.hours} hrs spent`
                          : 'No gym session'}
                      </div>
                      <div className="text-[11px] text-zinc-300 mt-0.5">
                        {formattedDate}
                        {day.workoutType && (
                          <span className="ml-1.5 font-bold text-amber-400">
                            • {day.workoutType}
                          </span>
                        )}
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}