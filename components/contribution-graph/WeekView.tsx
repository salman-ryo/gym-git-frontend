'use client';

import React from 'react';
import { GymLog, WorkoutType } from '@/lib/types';
import CustomTooltip from '@/components/CustomTooltip';
import { DayTile, getThemeForWorkout } from './theme-utils';

interface WeekViewProps {
  days: DayTile[];
  activeFilter: WorkoutType | 'All';
  onTileClick: (dateStr: string, log?: GymLog) => void;
}

export default function WeekView({
  days,
  activeFilter,
  onTileClick,
}: WeekViewProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-7 gap-3 animate-in fade-in duration-300">
      {days.map((day) => {
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
  );
}
