'use client';

import { GymLog, WorkoutType } from '@/lib/types';
import { formatDateKey } from '@/lib/api-mock';
import React, { useMemo, useState } from 'react';

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
  const [hoveredTile, setHoveredTile] = useState<{
    dateStr: string;
    hours: number;
    workoutType?: string;
    x: number;
    y: number;
  } | null>(null);

  // Map dates to log objects
  const logMap = useMemo(() => {
    const map = new Map<string, GymLog>();
    logs.forEach((log) => {
      map.set(log.date, log);
    });
    return map;
  }, [logs]);

  // Generate 52 weeks x 7 days grid leading up to today
  const { weeks, monthLabels, totalYearWorkouts, totalYearHours } = useMemo(() => {
    const today = new Date();
    const resultWeeks: WeekColumn[] = [];
    const months: { name: string; weekIndex: number }[] = [];

    // Calculate start date: 52 full weeks ago starting on Sunday
    const todayDayOfWeek = today.getDay(); // 0 = Sun
    const endDate = new Date(today);
    
    // We want ~365 days, ending today
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

      // Check month boundary for month labels
      const monthIndex = currentDate.getMonth();
      if (monthIndex !== lastMonth) {
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        months.push({ name: monthNames[monthIndex], weekIndex: currentWeekIndex });
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
      totalYearWorkouts: yearWorkouts,
      totalYearHours: Number(yearHours.toFixed(1)),
    };
  }, [logMap]);

  // Color Intensity Logic based on exact user specification:
  // 0 hours = bg-zinc-800/bg-gray-100
  // >0 to 0.9 hours = bg-green-300
  // 1.0 to 1.9 hours = bg-green-500
  // 2.0+ hours = bg-green-700
  const getTileBgColor = (hours: number) => {
    if (hours <= 0) return 'bg-zinc-800/70 border-zinc-800/40 hover:border-zinc-500';
    if (hours < 1.0) return 'bg-green-300 border-green-400 text-zinc-950';
    if (hours < 2.0) return 'bg-green-500 border-green-400 text-zinc-950';
    return 'bg-green-700 border-green-600 text-zinc-100';
  };

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-zinc-900/80 border border-zinc-800 backdrop-blur-xl p-6 rounded-2xl shadow-xl relative">
      {/* Top Header Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 pb-4 border-b border-zinc-800/80">
        <div>
          <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
            <span>Gym Contribution Graph</span>
            <span className="text-xs font-normal text-zinc-400">
              (Past 365 Days)
            </span>
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            <strong className="text-emerald-400 font-semibold">{totalYearWorkouts} gym sessions</strong> ({totalYearHours} hours logged) in the last year
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2 text-xs text-zinc-400 self-start sm:self-center">
          <span>Less</span>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-sm bg-zinc-800/70 border border-zinc-700/50" title="0 hrs" />
            <div className="w-3 h-3 rounded-sm bg-green-300 border border-green-400" title="< 1.0 hr" />
            <div className="w-3 h-3 rounded-sm bg-green-500 border border-green-400" title="1.0 - 1.9 hrs" />
            <div className="w-3 h-3 rounded-sm bg-green-700 border border-green-600" title="2.0+ hrs" />
          </div>
          <span>More</span>
        </div>
      </div>

      {/* Contribution Grid Container (Scrollable on small screens) */}
      <div className="overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
        <div className="min-w-[760px]">
          {/* Month Labels Header */}
          <div className="flex text-[11px] font-medium text-zinc-400 mb-2 pl-8">
            {monthLabels.map((m, idx) => (
              <span
                key={`${m.name}-${idx}`}
                style={{
                  marginLeft: idx === 0 ? `${m.weekIndex * 14}px` : `${(m.weekIndex - (monthLabels[idx - 1]?.weekIndex || 0)) * 14 - 18}px`,
                }}
                className="inline-block"
              >
                {m.name}
              </span>
            ))}
          </div>

          {/* Grid Layout: Days Axis + 52 Weeks */}
          <div className="flex gap-1.5">
            {/* Day of Week Labels (Left Axis) */}
            <div className="flex flex-col justify-between text-[10px] font-medium text-zinc-500 pr-2 py-0.5 select-none">
              <span>Mon</span>
              <span>Wed</span>
              <span>Fri</span>
            </div>

            {/* Weeks Columns */}
            <div className="flex gap-1">
              {weeks.map((week) => (
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
                      <button
                        key={day.dateStr}
                        type="button"
                        onClick={() => onTileClick(day.dateStr, day.log)}
                        onMouseEnter={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          setHoveredTile({
                            dateStr: formattedDate,
                            hours: day.hours,
                            workoutType: day.workoutType,
                            x: rect.left + rect.width / 2,
                            y: rect.top - 10,
                          });
                        }}
                        onMouseLeave={() => setHoveredTile(null)}
                        className={`w-3 h-3 rounded-sm transition-all duration-150 border transform hover:scale-125 hover:z-20 cursor-pointer ${getTileBgColor(
                          day.hours
                        )} ${isFilteredOut ? 'opacity-20 hover:opacity-100' : 'opacity-100'} ${
                          isMatchFilter ? 'ring-2 ring-emerald-400 ring-offset-1 ring-offset-zinc-950 scale-110' : ''
                        }`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Hover Tooltip */}
      {hoveredTile && (
        <div
          style={{
            left: `${hoveredTile.x}px`,
            top: `${hoveredTile.y}px`,
          }}
          className="fixed -translate-x-1/2 -translate-y-full z-50 pointer-events-none bg-zinc-950 text-zinc-100 border border-zinc-700/80 rounded-lg px-3 py-1.5 shadow-2xl text-xs whitespace-nowrap animate-in fade-in zoom-in-95 duration-100"
        >
          <div className="font-semibold text-emerald-400">
            {hoveredTile.hours > 0
              ? `${hoveredTile.hours} hrs spent`
              : 'No gym session'}
          </div>
          <div className="text-[11px] text-zinc-300">
            {hoveredTile.dateStr}
            {hoveredTile.workoutType && (
              <span className="ml-1.5 font-bold text-amber-400">
                • {hoveredTile.workoutType}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
