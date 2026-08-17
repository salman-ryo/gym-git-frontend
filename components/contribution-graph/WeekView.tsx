'use client';

import React from 'react';
import { GymLog, WeeklyPlan, WorkoutType } from '@/lib/types';
import CustomTooltip from '@/components/CustomTooltip';
import { DayTile, DEFAULT_GREEN_THEME, getThemeForWorkout, getDayStyleInfo } from './theme-utils';
import DayTileTooltip from './DayTileTooltip';

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
        const styleInfo = getDayStyleInfo(day, activeFilter, weeklyPlan);
        const dayName = day.dateObj.toLocaleDateString('en-US', { weekday: 'short' });
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
              className={`p-4 rounded-2xl border text-left flex flex-col justify-between h-36 transition-all relative overflow-hidden group 
                ${styleInfo.tileClass} 
                ${isFilteredOut && !day.isFuture ? 'opacity-20' : ''} 
                ${styleInfo.ringClass || ''}
              `}
            >
              <div className="relative z-10 w-full">
                <div className="flex items-center justify-between mb-1 text-[10px] uppercase font-black tracking-widest">
                  <span className={`${day.isToday ? 'text-white' : day.isFuture ? 'text-zinc-700' : 'text-zinc-500'}`}>{dayName}</span>
                  <span className={day.isFuture ? 'text-zinc-700' : 'text-zinc-500'}>{day.dateStr.slice(5)}</span>
                </div>

                <p className={`text-2xl mt-2 font-black tracking-tighter transition-colors ${
                  styleInfo.tooltipType === 'freeze' ? 'text-sky-950' : styleInfo.tooltipType === 'rest' ? 'text-zinc-200' : 'text-white'
                }`}>
                  {day.hours > 0 ? `${day.hours}h` : '0h'}
                </p>
              </div>

              <div className="relative z-10">
                {day.workoutType ? (
                  <div className="mt-2">
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-full inline-block uppercase tracking-wider ${
                      styleInfo.tooltipType === 'freeze' 
                        ? 'bg-sky-950/20 border border-sky-950/30 text-sky-950' 
                        : styleInfo.tooltipType === 'rest' 
                        ? 'bg-slate-700/30 border border-slate-700/40 text-slate-300' 
                        : theme.pillWeek
                    }`}>
                      {day.workoutType}
                    </span>
                  </div>
                ) : (
                  <div className="h-4" />
                )}
              </div>

              {/* Large background decorative icon/badge */}
              {styleInfo.badgeContent && (
                <span className="absolute bottom-2 right-4 text-4xl select-none pointer-events-none opacity-20 group-hover:opacity-40 group-hover:scale-110 transition-all">
                  {styleInfo.badgeContent}
                </span>
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
