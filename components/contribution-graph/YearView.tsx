'use client';

import React, { memo, useCallback } from 'react';
import { GymLog, WorkoutType } from '@/lib/types';
import CustomTooltip from '@/components/CustomTooltip';
import { DayTile, WeekColumn, getDayStyleInfo } from './theme-utils';
import DayTileTooltip from './DayTileTooltip';

interface YearViewProps {
  weeks: WeekColumn[];
  monthLabels: { name: string; weekIndex: number }[];
  activeFilter: WorkoutType | 'All';
  onTileClick: (dateStr: string, log?: GymLog) => void;
}

interface YearDayTileProps {
  day: DayTile;
  activeFilter: WorkoutType | 'All';
  onTileClick: (dateStr: string, log?: GymLog) => void;
}

const YearDayTile = memo(function YearDayTile({
  day,
  activeFilter,
  onTileClick,
}: YearDayTileProps) {
  const styleInfo = getDayStyleInfo(day, activeFilter);
  const isFilteredOut = activeFilter !== 'All' && day.hours > 0 && day.workoutType !== activeFilter;

  const tileColorClass = styleInfo.tileClass;
  let ringClass = styleInfo.ringClass || '';

  if (day.isToday && !isFilteredOut) {
    ringClass = 'ring ring-white ring-offset-1 ring-offset-zinc-950 z-10 shadow-[0_0_10px_rgba(255,255,255,0.8)]';
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
        className={`w-3 h-3 rounded-[4px] transition-all duration-150 border transform relative overflow-hidden
          ${tileColorClass} 
          ${!isFilteredOut && styleInfo.glowClass ? styleInfo.glowClass : ''}
          ${day.isFuture ? 'opacity-20 cursor-not-allowed' : 'cursor-pointer hover:scale-125 hover:z-20'} 
          ${ringClass}
        `}
      >
        {styleInfo.badgeContent && (
          <span className="absolute inset-0 flex items-center justify-center text-[6px] select-none pointer-events-none">
            {styleInfo.badgeContent}
          </span>
        )}
      </button>
    </CustomTooltip>
  );
});

function YearView({
  weeks,
  monthLabels,
  activeFilter,
  onTileClick,
}: YearViewProps) {
  return (
    <div className="animate-in fade-in duration-300 relative">
      {/* Scrollable Graph Container */}
      <div className="overflow-x-auto no-scrollbar sm:scrollbar-thin sm:scrollbar-thumb-zinc-800 sm:scrollbar-track-transparent pb-2 -webkit-overflow-scrolling-touch">
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
                  {week.days.map((day) => (
                    <YearDayTile
                      key={day.dateStr}
                      day={day}
                      activeFilter={activeFilter}
                      onTileClick={onTileClick}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between sm:justify-end gap-2 text-[9px] font-bold uppercase tracking-widest text-zinc-500 mt-4 sm:mt-5 pt-3 sm:pt-4 border-t border-zinc-800/40">
        <span className="sm:hidden text-zinc-600">Intensity:</span>
        <div className="flex items-center gap-2">
          <span>Less</span>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-[4px] bg-[#0d1117] border border-zinc-800/80" title="0 hrs (No workout)" />
            <div className="w-3 h-3 rounded-[4px] bg-[#0e4429] border border-[#006d32]/80 shadow-[0_0_4px_rgba(14,68,41,0.4)]" title="Light session (< 1.0 hr)" />
            <div className="w-3 h-3 rounded-[4px] bg-[#006d32] border border-[#26a641]/80 shadow-[0_0_8px_rgba(0,109,50,0.5)]" title="Moderate session (1.0 - 1.4 hrs)" />
            <div className="w-3 h-3 rounded-[4px] bg-[#26a641] border border-[#39d353] shadow-[0_0_12px_rgba(38,166,65,0.6)]" title="Solid session (1.5 - 1.9 hrs)" />
            <div className="w-3 h-3 rounded-[4px] bg-[#39d353] border border-[#00ff88] shadow-[0_0_16px_rgba(57,211,83,0.75)]" title="Beast Mode (2.0+ hrs)" />
          </div>
          <span>More</span>
        </div>
      </div>
    </div>
  );
}

export default memo(YearView);
