'use client';

import React, { memo, useCallback } from 'react';
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

interface WeekDayTileProps {
  day: DayTile;
  index: number;
  activeFilter: WorkoutType | 'All';
  onTileClick: (dateStr: string, log?: GymLog) => void;
  weeklyPlan?: WeeklyPlan;
}

const THEME_BORDER_LEFT: Record<string, string> = {
  cyan: 'border-l-neon-cyan',
  purple: 'border-l-neon-purple',
  sky: 'border-l-sky-400',
  amber: 'border-l-amber-400',
  rose: 'border-l-rose-400',
  emerald: 'border-l-emerald-400',
  fuchsia: 'border-l-fuchsia-400',
  indigo: 'border-l-indigo-400',
  teal: 'border-l-teal-400',
  lime: 'border-l-lime-400',
  green: 'border-l-neon-green',
};

const WeekDayTile = memo(function WeekDayTile({
  day,
  index,
  activeFilter,
  onTileClick,
  weeklyPlan,
}: WeekDayTileProps) {
  const styleInfo = getDayStyleInfo(day, activeFilter, weeklyPlan);
  const dayName = day.dateObj.toLocaleDateString('en-US', { weekday: 'short' });
  const isFreeze = day.workoutType?.toLowerCase() === 'freeze' || day.log?.workoutType?.toLowerCase() === 'freeze';
  const isRest = day.workoutType?.toLowerCase() === 'rest' || day.log?.workoutType?.toLowerCase() === 'rest';
  const isActiveWorkout = day.hours > 0 && !isRest && !isFreeze;
  const isFilteredOut = activeFilter !== 'All' && isActiveWorkout && day.workoutType !== activeFilter;

  const theme = isActiveWorkout && day.workoutType
    ? getThemeForWorkout(day.workoutType, weeklyPlan)
    : DEFAULT_GREEN_THEME;

  // Base cyber styling: sharp edges, dark metallic background with workout-themed accents
  let tileClass = 'bg-[#090a0f] border-zinc-800/80 hover:border-zinc-500 text-zinc-500';
  let borderAccent = 'border-l-zinc-700';
  let neonGlow = '';

  if (day.isFuture) {
    tileClass = 'bg-[#050508] border-zinc-900/50 opacity-40 cursor-not-allowed';
    borderAccent = 'border-l-zinc-900';
  } else if (isFreeze) {
    tileClass = 'bg-zinc-950/90 border-sky-400/50 hover:border-sky-400';
    borderAccent = 'border-l-sky-400';
    neonGlow = 'shadow-[0_0_15px_rgba(56,189,248,0.25)] hover:shadow-[0_0_25px_rgba(56,189,248,0.4)]';
    if (day.isToday) neonGlow += ' ring-1 ring-sky-300';
  } else if (isRest) {
    tileClass = 'bg-zinc-950/80 border-slate-700/60 hover:border-slate-600';
    borderAccent = 'border-l-slate-500';
    if (day.isToday) neonGlow += ' ring-1 ring-slate-400';
  } else if (isActiveWorkout) {
    tileClass = `${theme.cardGlow} cursor-pointer cyber-grid`;
    borderAccent = THEME_BORDER_LEFT[theme.name] || 'border-l-neon-green';
    if (day.isToday) neonGlow += ` ${theme.todayRingWeek}`;
  } else if (day.isToday) {
    borderAccent = 'border-l-zinc-400';
    neonGlow = 'ring-1 ring-zinc-500 shadow-[0_0_15px_rgba(255,255,255,0.15)]';
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
        style={{ animationFillMode: 'both', animationDelay: `${index * 75}ms` }}
        className={`group relative p-2.5 sm:p-4 text-left flex flex-col justify-between min-h-[85px] sm:h-40 transition-all duration-300 overflow-hidden 
          border-y border-r border-l-4 rounded-xl sm:rounded-tr-2xl sm:rounded-bl-2xl sm:rounded-tl-sm sm:rounded-br-sm
          animate-in slide-in-from-bottom-4 fade-in
          ${tileClass} 
          ${borderAccent}
          ${neonGlow}
          ${index === 6 ? 'col-span-2 sm:col-span-1' : ''}
          ${isFilteredOut && !day.isFuture ? 'opacity-20 grayscale' : ''} 
        `}
      >
        {/* Cyberpunk Animated Glitch Sweep (Hover) */}
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent group-hover:animate-[scanline_1.5s_ease-in-out_infinite] z-0" />

        <div className="relative z-10 w-full">
          <div className="flex items-center justify-between mb-0.5 sm:mb-1 text-[9px] sm:text-[10px] uppercase font-black tracking-wider sm:tracking-[0.2em]">
            <span className={`flex items-center gap-1 ${day.isToday ? 'text-white' : day.isFuture ? 'text-zinc-700' : 'text-zinc-400 group-hover:text-zinc-100 transition-colors'}`}>
              <span className={isActiveWorkout ? `${theme.text} opacity-80` : isFreeze ? 'text-sky-400 opacity-80' : isRest ? 'text-slate-400 opacity-80' : 'text-zinc-600'}>{'//'}</span> {dayName}
            </span>
            <span className={`font-mono text-[9px] sm:text-[10px] ${day.isFuture ? 'text-zinc-800' : 'text-zinc-500 group-hover:text-white transition-colors'}`}>
              {day.dateStr.slice(5).replace('-', '.')}
            </span>
          </div>

          <p className={`text-xl sm:text-3xl mt-1 sm:mt-3 font-black tracking-tighter italic transition-all duration-300 group-hover:translate-x-1 ${
            isFreeze
              ? 'text-sky-300 drop-shadow-[0_0_8px_rgba(56,189,248,0.8)]'
              : isRest
              ? 'text-slate-400'
              : isActiveWorkout
              ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]'
              : 'text-zinc-700'
          }`}>
            {day.hours > 0 ? (
              <>
                {day.hours}
                <span className="text-sm sm:text-lg text-zinc-500 font-mono ml-0.5 not-italic">H</span>
              </>
            ) : (
              '0.0'
            )}
          </p>
        </div>

        <div className="relative z-10 w-full flex items-end justify-between mt-2 sm:mt-4">
          {day.workoutType ? (
            <div>
              <span className={`text-[9px] sm:text-[10px] font-black px-1.5 sm:px-2 py-0.5 sm:py-1 inline-block uppercase tracking-wider sm:tracking-widest border border-dashed rounded-br-lg rounded-tl-lg transition-colors ${
                isFreeze
                  ? 'bg-sky-500/15 border-sky-400/40 text-sky-400'
                  : isRest
                  ? 'bg-slate-700/30 border-slate-700/40 text-slate-300'
                  : theme.pillWeek
              }`}>
                {day.workoutType}
              </span>
            </div>
          ) : (
            <div className="h-4 sm:h-6" />
          )}

          {/* Digital status indicator in bottom right */}
          <div className={`flex gap-1 ${isActiveWorkout ? theme.text : isFreeze ? 'text-sky-400' : isRest ? 'text-slate-400' : 'text-zinc-700'}`}>
            <div className={`w-1 h-2.5 sm:h-3 rounded-sm ${isActiveWorkout || isFreeze ? 'bg-current opacity-80' : 'bg-zinc-800'}`} />
            <div className={`w-1 h-2.5 sm:h-3 rounded-sm ${isActiveWorkout ? 'bg-current opacity-80' : 'bg-zinc-800'}`} />
            <div className={`w-1 h-2.5 sm:h-3 rounded-sm ${isActiveWorkout && day.hours >= 1.5 ? 'bg-current opacity-80' : 'bg-zinc-800'}`} />
          </div>
        </div>

        {/* Large background decorative icon/badge */}
        {styleInfo.badgeContent && (
          <span className="absolute -bottom-2 -right-2 text-4xl sm:text-6xl select-none pointer-events-none opacity-10 group-hover:opacity-20 group-hover:-translate-y-2 group-hover:-translate-x-2 transition-all duration-500 font-black">
            {styleInfo.badgeContent}
          </span>
        )}

        {/* Blinking Neon Dot for Today */}
        {day.isToday && !styleInfo.badgeContent && (
          <div
            className={`absolute top-2.5 sm:top-3 right-2.5 sm:right-3 w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-none rotate-45 ${
              isActiveWorkout ? theme.todayDot : 'bg-zinc-400 shadow-[0_0_10px_#ffffff]'
            }`}
            style={{ animation: 'pulse-neon 2s infinite' }}
          />
        )}

        {/* Bottom colored accent bar */}
        {isActiveWorkout && day.hours > 0 && (
          <div className={`absolute bottom-0 left-0 right-0 h-[2px] transition-all ${theme.bar}`} />
        )}
        {isFreeze && (
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-sky-400 shadow-[0_0_8px_#38bdf8]" />
        )}

        {/* Techy corner brackets overlay */}
        <div className="absolute top-0 right-0 w-2 sm:w-3 h-2 sm:h-3 border-t-2 border-r-2 border-zinc-700/50 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute bottom-0 right-0 w-2 sm:w-3 h-2 sm:h-3 border-b-2 border-r-2 border-zinc-700/50 opacity-0 group-hover:opacity-100 transition-opacity" />
      </button>
    </CustomTooltip>
  );
});

function WeekView({
  days,
  activeFilter,
  onTileClick,
  weeklyPlan,
}: WeekViewProps) {
  return (
    <>
      {/* Custom Cyberpunk Keyframes */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        @keyframes pulse-neon {
          0%, 100% { opacity: 1; filter: drop-shadow(0 0 5px currentColor); }
          50% { opacity: 0.7; filter: drop-shadow(0 0 2px currentColor); }
        }
        .cyber-grid {
          background-size: 20px 20px;
          background-image: 
            linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
        }
      `}} />

      <div className="grid grid-cols-2 sm:grid-cols-7 gap-2.5 sm:gap-4 animate-in fade-in duration-500">
        {days.map((day, index) => (
          <WeekDayTile
            key={day.dateStr}
            day={day}
            index={index}
            activeFilter={activeFilter}
            onTileClick={onTileClick}
            weeklyPlan={weeklyPlan}
          />
        ))}
      </div>
    </>
  );
}

export default memo(WeekView);