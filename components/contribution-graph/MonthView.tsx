'use client';

import React from 'react';
import { GymLog, WeeklyPlan, WorkoutType } from '@/lib/types';
import CustomTooltip from '@/components/CustomTooltip';
import { DayTile, DEFAULT_GREEN_THEME, getThemeForWorkout, getDayStyleInfo } from './theme-utils';
import DayTileTooltip from './DayTileTooltip';

interface MonthViewProps {
  startPadding: number;
  days: DayTile[];
  activeFilter: WorkoutType | 'All';
  onTileClick: (dateStr: string, log?: GymLog) => void;
  weeklyPlan?: WeeklyPlan;
}

export default function MonthView({
  startPadding,
  days,
  activeFilter,
  onTileClick,
  weeklyPlan,
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
          const styleInfo = getDayStyleInfo(day, activeFilter, weeklyPlan);
          const isRestOrNoSession = day.hours <= 0 || day.workoutType?.toLowerCase() === 'rest';
          const isFilteredOut = activeFilter !== 'All' && !isRestOrNoSession && day.workoutType !== activeFilter;

          const theme = !isRestOrNoSession && day.workoutType
            ? getThemeForWorkout(day.workoutType, weeklyPlan)
            : DEFAULT_GREEN_THEME;

            return (
              <CustomTooltip
                key={day.dateStr}
                content={<DayTileTooltip day={day} styleInfo={styleInfo} />}
              >
              <button
                type="button"
                disabled={day.isFuture}
                onClick={() => !day.isFuture && onTileClick(day.dateStr, day.log)}
                className={`h-16 rounded-xl p-2 flex flex-col justify-between text-left transition-all border relative overflow-hidden group 
                  ${styleInfo.tileClass} 
                  ${isFilteredOut && !day.isFuture ? 'opacity-20' : ''} 
                  ${styleInfo.ringClass || ''}
                `}
              >
                <div className="flex items-center justify-between w-full relative z-10">
                  <span className={`text-xs font-black transition-colors ${day.isToday ? 'text-white' : day.isFuture ? 'text-zinc-700' : 'text-zinc-400'}`}>
                    {day.dayOfMonth}
                  </span>
                  {!isRestOrNoSession && day.hours > 0 && (
                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${theme.pillMonth}`}>
                      {day.hours}h
                    </span>
                  )}
                </div>

                <div className="relative z-10 w-full">
                  {day.workoutType && (
                    <span className={`text-[9px] font-black truncate block uppercase tracking-wide transition-colors ${
                      styleInfo.tooltipType === 'freeze' ? 'text-sky-950' : styleInfo.tooltipType === 'rest' ? 'text-slate-400' : theme.text
                    }`}>
                      {day.workoutType}
                    </span>
                  )}
                </div>

                {/* Badge Overlay for special states */}
                {styleInfo.badgeContent && (
                  <span className="absolute bottom-1.5 right-1.5 text-base select-none pointer-events-none opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all">
                    {styleInfo.badgeContent}
                  </span>
                )}

                {/* Neon dot indicator for Today */}
                {day.isToday && !styleInfo.badgeContent && (
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
