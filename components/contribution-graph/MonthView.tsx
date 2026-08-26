'use client';

import React, { memo, useCallback } from 'react';
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

interface MonthDayTileProps {
  day: DayTile;
  activeFilter: WorkoutType | 'All';
  onTileClick: (dateStr: string, log?: GymLog) => void;
  weeklyPlan?: WeeklyPlan;
}

const MonthDayTile = memo(function MonthDayTile({
  day,
  activeFilter,
  onTileClick,
  weeklyPlan,
}: MonthDayTileProps) {
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

  const renderTooltip = useCallback(
    () => <DayTileTooltip day={day} styleInfo={styleInfo} />,
    [day, styleInfo]
  );

  const handleClick = useCallback(() => {
    if (!day.isFuture) {
      onTileClick(day.dateStr, day.log);
    }
  }, [day.dateStr, day.isFuture, day.log, onTileClick]);

  return (
    <CustomTooltip content={renderTooltip}>
      <button
        type="button"
        disabled={day.isFuture}
        onClick={handleClick}
        className={`h-13 sm:h-16 rounded-lg sm:rounded-xl p-1 sm:p-2 flex flex-col justify-between text-left transition-all border relative overflow-hidden group cursor-pointer 
          ${tileClass} 
          ${isFilteredOut && !day.isFuture ? 'opacity-20' : ''} 
          ${ringClass}
        `}
      >
        <div className="flex items-center justify-between w-full relative z-10">
          <span
            className={`text-[10px] sm:text-xs font-black transition-colors ${
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
            <span className={`text-[7.5px] sm:text-[9px] font-black px-1 sm:px-1.5 py-0.2 sm:py-0.5 rounded-full border shadow-sm ${theme.pillWeek}`}>
              {day.hours}h
            </span>
          )}
          {isFreeze && day.hours > 0 && (
            <span className="text-[7.5px] sm:text-[9px] font-black px-1 sm:px-1.5 py-0.2 sm:py-0.5 rounded-full bg-sky-500/15 border border-sky-400/40 text-sky-400">
              {day.hours}h
            </span>
          )}
        </div>

        <div className="relative z-10 w-full min-w-0">
          {day.workoutType && (
            <span
              className={`hidden min-[400px]:block text-[8px] sm:text-[9px] font-black truncate uppercase tracking-tight sm:tracking-wide transition-colors ${
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
          <span className="absolute bottom-1 sm:bottom-1.5 right-1 sm:right-1.5 text-xs sm:text-base select-none pointer-events-none opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all">
            {styleInfo.badgeContent}
          </span>
        )}

        {/* Neon dot indicator for Today */}
        {day.isToday && !styleInfo.badgeContent && (
          <div
            className={`absolute bottom-1 sm:bottom-1.5 right-1 sm:right-1.5 w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full animate-pulse ${
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
});

function MonthView({
  startPadding,
  days,
  activeFilter,
  onTileClick,
  weeklyPlan,
}: MonthViewProps) {
  return (
    <div className="space-y-3 sm:space-y-4 animate-in fade-in duration-300">
      <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center text-[9px] sm:text-[10px] font-black uppercase tracking-wider sm:tracking-widest text-zinc-300 mb-1.5 sm:mb-2">
        <span><span className="sm:hidden">S</span><span className="hidden sm:inline">Sun</span></span>
        <span><span className="sm:hidden">M</span><span className="hidden sm:inline">Mon</span></span>
        <span><span className="sm:hidden">T</span><span className="hidden sm:inline">Tue</span></span>
        <span><span className="sm:hidden">W</span><span className="hidden sm:inline">Wed</span></span>
        <span><span className="sm:hidden">T</span><span className="hidden sm:inline">Thu</span></span>
        <span><span className="sm:hidden">F</span><span className="hidden sm:inline">Fri</span></span>
        <span><span className="sm:hidden">S</span><span className="hidden sm:inline">Sat</span></span>
      </div>

      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {Array.from({ length: startPadding }).map((_, i) => (
          <div key={`pad-${i}`} className="h-13 sm:h-16 rounded-lg sm:rounded-xl bg-zinc-900/20 border border-zinc-800/30" />
        ))}

        {days.map((day) => (
          <MonthDayTile
            key={day.dateStr}
            day={day}
            activeFilter={activeFilter}
            onTileClick={onTileClick}
            weeklyPlan={weeklyPlan}
          />
        ))}
      </div>
    </div>
  );
}

export default memo(MonthView);


