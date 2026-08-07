'use client';

import React from 'react';
import { GymLog, WorkoutType } from '@/lib/types';
import CustomTooltip from '@/components/CustomTooltip';
import { DayTile, getThemeForWorkout } from './theme-utils';

interface MonthViewProps {
  startPadding: number;
  days: DayTile[];
  activeFilter: WorkoutType | 'All';
  onTileClick: (dateStr: string, log?: GymLog) => void;
}

export default function MonthView({
  startPadding,
  days,
  activeFilter,
  onTileClick,
}: MonthViewProps) {
  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-black uppercase tracking-widest text-cyan-400 mb-2">
        <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: startPadding }).map((_, i) => (
          <div key={`pad-${i}`} className="h-16 rounded-xl bg-zinc-900/20 border border-zinc-800/30" />
        ))}

        {days.map((day) => {
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
                    <div className="font-bold text-white text-xs">
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
  );
}
