'use client';

import React from 'react';
import { GymLog, WorkoutType } from '@/lib/types';
import CustomTooltip from '@/components/CustomTooltip';
import { DayTile, WeekColumn, getThemeForWorkout, getTileBgColor } from './theme-utils';

interface YearViewProps {
  weeks: WeekColumn[];
  monthLabels: { name: string; weekIndex: number }[];
  activeFilter: WorkoutType | 'All';
  onTileClick: (dateStr: string, log?: GymLog) => void;
}

export default function YearView({
  weeks,
  monthLabels,
  activeFilter,
  onTileClick,
}: YearViewProps) {
  return (
    <div className="animate-in fade-in duration-300">
      <div className="overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
        <div className="min-w-[760px] w-full">
          <div className="relative h-4 text-[9px] uppercase tracking-widest font-bold text-zinc-500 mb-2 ml-8">
            {monthLabels.map((m, idx) => (
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
              {weeks.map((week) => (
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
  );
}
