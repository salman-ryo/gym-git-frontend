'use client';

import React from 'react';
import { DayTile, DayStyleInfo } from './theme-utils';
import { formatDisplayDate } from '@/lib/date-utils';

export interface DayTileTooltipProps {
  day: DayTile;
  styleInfo: DayStyleInfo;
  displayDate?: string;
}

/**
 * Reusable Day Tile Tooltip Content for Contribution Graph Views (Year, Month, Week).
 * 
 * Encapsulates the rich tooltip rendering for active workouts, rest days,
 * ice pause frozen states, future locked dates, and user log notes.
 */
export function DayTileTooltip({ day, styleInfo, displayDate }: DayTileTooltipProps) {
  if (day.isFuture) {
    return (
      <div className="text-[11px] text-zinc-500 font-bold uppercase tracking-wider">
        Future Date Locked
      </div>
    );
  }

  const formattedDateString =
    displayDate ??
    (day.isToday
      ? 'Today'
      : formatDisplayDate(day.dateObj, { showToday: true, includeYear: true }));

  return (
    <div className="text-left space-y-1">
      <div className="font-bold text-xs">
        {styleInfo.tooltipType === 'freeze' ? (
          <span className="text-sky-400">❄️ Ice Pause Active</span>
        ) : styleInfo.tooltipType === 'rest' ? (
          <span className="text-slate-300">🛡️ Rest Token Applied</span>
        ) : day.hours > 0 ? (
          <span className="text-emerald-400">{day.hours} hrs spent</span>
        ) : (
          <span className="text-zinc-400">No workout logged</span>
        )}
      </div>

      <div className="text-[11px] text-zinc-400 mt-0.5">
        {formattedDateString}
        {day.workoutType && (
          <span className="ml-1.5 font-bold text-zinc-300">
            • {day.workoutType}
          </span>
        )}
      </div>

      {day.log?.notes && (
        <div className="text-[10px] text-zinc-500 border-t border-zinc-900 pt-1 mt-1 max-w-[200px] italic">
          &ldquo;{day.log.notes}&rdquo;
        </div>
      )}
    </div>
  );
}

export default DayTileTooltip;
