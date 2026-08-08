'use client';

import React from 'react';
import { GymLog, WeeklyPlan, WorkoutType } from '@/lib/types';
import CustomTooltip from '@/components/CustomTooltip';
import { DayTile, DEFAULT_GREEN_THEME, getThemeForWorkout } from './theme-utils';

interface WeekViewProps {
  days: DayTile[];
  activeFilter: WorkoutType | 'All';
  onTileClick: (dateStr: string, log?: GymLog) => void;
  weeklyPlan?: WeeklyPlan;
}

export default function WeekView({
  days,
  activeFilter,
  onTileClick,
  weeklyPlan,
}: WeekViewProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-7 gap-3 animate-in fade-in duration-300">
      {days.map((day) => {
        const dayName = day.dateObj.toLocaleDateString('en-US', { weekday: 'short' });
        const isRestOrNoSession = day.hours <= 0 || day.workoutType?.toLowerCase() === 'rest';
        const isFilteredOut = activeFilter !== 'All' && !isRestOrNoSession && day.workoutType !== activeFilter;

        const theme = !isRestOrNoSession && day.workoutType
          ? getThemeForWorkout(day.workoutType, weeklyPlan)
          : DEFAULT_GREEN_THEME;

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
                  <div className={`font-bold text-xs ${!isRestOrNoSession ? theme.text : 'text-zinc-200'}`}>
                    {!isRestOrNoSession ? `${day.hours} hrs spent` : 'No gym session'}
                  </div>
                  <div className="text-[11px] text-zinc-300 mt-0.5">
                    {displayDate}
                    {!isRestOrNoSession && day.workoutType && (
                      <span className={`ml-1.5 font-bold ${theme.text}`}>
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
                  : 'cursor-pointer ' + (!isRestOrNoSession
                    ? theme.cardGlow
                    : 'bg-zinc-950/80 border-zinc-800/80 hover:border-zinc-700 hover:shadow-[0_0_15px_rgba(255,255,255,0.03)]')
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

                <p className={`text-2xl mt-2 font-black tracking-tighter transition-colors ${!isRestOrNoSession ? 'text-white' : 'text-transparent select-none'}`}>
                  {!isRestOrNoSession ? `${day.hours}h` : '0h'}
                </p>
              </div>

              {!isRestOrNoSession && day.workoutType ? (
                <div className="mt-2">
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full inline-block uppercase tracking-wider ${theme.pillWeek}`}>
                    {day.workoutType}
                  </span>
                </div>
              ) : (
                <div className="h-4" />
              )}

              {!isRestOrNoSession && day.hours > 0 && (
                <div className={`absolute bottom-0 left-0 h-1.5 transition-all ${theme.bar}`} style={{ width: `${Math.min(100, (day.hours / 2.5) * 100)}%` }} />
              )}
            </button>
          </CustomTooltip>
        );
      })}
    </div>
  );
}
