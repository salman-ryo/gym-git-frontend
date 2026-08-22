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
      <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-black uppercase tracking-widest text-white mb-2">
        <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: startPadding }).map((_, i) => (
          <div key={`pad-${i}`} className="h-16 rounded-xl bg-zinc-900/20 border border-zinc-800/30" />
        ))}

        {days.map((day) => {
          const styleInfo = getDayStyleInfo(day, activeFilter, weeklyPlan);
          const isFreeze = day.workoutType?.toLowerCase() === 'freeze' || day.log?.workoutType?.toLowerCase() === 'freeze';
          const isRest = day.workoutType?.toLowerCase() === 'rest' || day.log?.workoutType?.toLowerCase() === 'rest';
          const isActiveWorkout = day.hours > 0 && !isRest && !isFreeze;
          const isFilteredOut = activeFilter !== 'All' && isActiveWorkout && day.workoutType !== activeFilter;

          const theme = isActiveWorkout && day.workoutType
            ? getThemeForWorkout(day.workoutType, weeklyPlan)
            : DEFAULT_GREEN_THEME;

          // Determine month tile styling: Dark background with workout-colored borders and accents
          let tileClass = 'bg-[#0d1117]/80 border-zinc-900/80 hover:border-zinc-700 text-zinc-500';
          let ringClass = '';

          if (day.isFuture) {
            tileClass = 'bg-zinc-950/40 border-zinc-800/30 opacity-40 cursor-not-allowed';
          } else if (isFreeze) {
            tileClass = 'bg-zinc-950/90 border-sky-400/50 hover:border-sky-400 shadow-[0_0_12px_rgba(56,189,248,0.2)]';
            if (day.isToday) {
              ringClass = 'ring-1 ring-sky-300 shadow-[0_0_15px_#38bdf8] z-10';
            }
          } else if (isRest) {
            tileClass = 'bg-zinc-950/80 border-slate-700/60 hover:border-slate-600 shadow-sm';
            if (day.isToday) {
              ringClass = 'ring-1 ring-slate-400 z-10';
            }
          } else if (isActiveWorkout) {
            tileClass = `${theme.cardGlow} shadow-sm hover:scale-[1.02]`;
            if (day.isToday) {
              ringClass = theme.todayRingMonth;
            }
          } else if (day.isToday) {
            ringClass = 'ring-1 ring-zinc-500 z-10';
          }

          return (
            <CustomTooltip
              key={day.dateStr}
              content={<DayTileTooltip day={day} styleInfo={styleInfo} />}
            >
              <button
                type="button"
                disabled={day.isFuture}
                onClick={() => !day.isFuture && onTileClick(day.dateStr, day.log)}
                className={`h-16 rounded-xl p-2 flex flex-col justify-between text-left transition-all border relative overflow-hidden group cursor-pointer 
                  ${tileClass} 
                  ${isFilteredOut && !day.isFuture ? 'opacity-20' : ''} 
                  ${ringClass}
                `}
              >
                <div className="flex items-center justify-between w-full relative z-10">
                  <span
                    className={`text-xs font-black transition-colors ${
                      day.isFuture
                        ? 'text-zinc-700'
                        : isFreeze
                        ? 'text-sky-300'
                        : isRest
                        ? 'text-slate-400'
                        : day.isToday
                        ? 'text-white'
                        : 'text-zinc-400 group-hover:text-zinc-200'
                    }`}
                  >
                    {day.dayOfMonth}
                  </span>
                  {isActiveWorkout && day.hours > 0 && (
                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full border shadow-sm ${theme.pillWeek}`}>
                      {day.hours}h
                    </span>
                  )}
                  {isFreeze && day.hours > 0 && (
                    <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-sky-500/15 border border-sky-400/40 text-sky-400">
                      {day.hours}h
                    </span>
                  )}
                </div>

                <div className="relative z-10 w-full">
                  {day.workoutType && (
                    <span
                      className={`text-[9px] font-black truncate block uppercase tracking-wide transition-colors ${
                        isFreeze
                          ? 'text-sky-400 drop-shadow-[0_0_5px_rgba(56,189,248,0.8)]'
                          : isRest
                          ? 'text-slate-400'
                          : theme.text
                      }`}
                    >
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
                  <div
                    className={`absolute bottom-1.5 right-1.5 w-1.5 h-1.5 rounded-full animate-pulse ${
                      isActiveWorkout ? theme.todayDot : 'bg-zinc-400 shadow-[0_0_8px_#ffffff]'
                    }`}
                  />
                )}

                {/* Bottom colored accent bar for active workouts */}
                {isActiveWorkout && day.hours > 0 && (
                  <div className={`absolute bottom-0 left-0 right-0 h-[2px] transition-all ${theme.bar}`} />
                )}
                {isFreeze && (
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-sky-400 shadow-[0_0_8px_#38bdf8]" />
                )}
              </button>
            </CustomTooltip>
          );
        })}
      </div>
    </div>
  );
}


