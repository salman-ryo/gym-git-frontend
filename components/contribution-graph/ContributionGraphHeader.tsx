'use client';

import React, { memo } from 'react';
import { CalendarRange, Calendar, CalendarDays } from 'lucide-react';
import { TimeframeView } from '@/lib/types';

export interface ContributionGraphHeaderProps {
  timeframe: TimeframeView;
  setTimeframe: (view: TimeframeView) => void;
  yearData: {
    totalWorkouts: number;
    totalHours: number;
  };
  monthData: {
    totalWorkouts: number;
    totalHours: number;
    monthName: string;
    year: number;
  };
  weekData: {
    totalWorkouts: number;
    totalHours: number;
  };
}

function ContributionGraphHeader({
  timeframe,
  setTimeframe,
  yearData,
  monthData,
  weekData,
}: ContributionGraphHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-6 mb-4 sm:mb-8 pb-3 sm:pb-4 border-b border-zinc-800/50">
      <div className="w-full min-w-0">
        <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
          <div className="w-2 h-2 rotate-45 bg-cyan-400 shadow-[0_0_8px_#818cf8] shrink-0" />
          <h2 className="text-xs sm:text-sm font-black text-white uppercase tracking-[0.18em] sm:tracking-[0.2em] drop-shadow-[0_0_8px_rgba(129,140,248,0.5)]">
            Activity Logs
          </h2>
          <div className="h-[1px] flex-1 bg-gradient-to-r from-cyan-500/30 to-transparent ml-2" />
        </div>

        <p className="text-[10px] sm:text-[11px] text-zinc-400 mt-1 sm:mt-2 font-medium tracking-wide">
          {timeframe === 'year' && (
            <>
              <strong className="text-zinc-100 font-bold">{yearData.totalWorkouts} sessions</strong> ({yearData.totalHours} hrs) <span className="hidden xs:inline">logged in </span><span className="text-white font-bold">Past 365 Days</span>
            </>
          )}
          {timeframe === 'month' && (
            <>
              <strong className="text-zinc-100 font-bold">{monthData.totalWorkouts} sessions</strong> ({monthData.totalHours} hrs) <span className="hidden xs:inline">logged in </span><span className="text-white font-bold">{monthData.monthName} {monthData.year}</span>
            </>
          )}
          {timeframe === 'week' && (
            <>
              <strong className="text-zinc-100 font-bold">{weekData.totalWorkouts} sessions</strong> ({weekData.totalHours} hrs) <span className="hidden xs:inline">logged in </span><span className="text-white font-bold">Current Week</span>
            </>
          )}
        </p>
      </div>

      {/* Neon Pill Toggles — Grid on mobile, flex on desktop */}
      <div className="grid grid-cols-3 sm:flex items-center gap-1 sm:gap-1.5 bg-zinc-900/60 border border-zinc-800/80 p-1 sm:p-1.5 rounded-xl sm:rounded-full shrink-0 w-full sm:w-auto">
        <button
          type="button"
          onClick={() => setTimeframe('year')}
          className={`justify-center px-2 sm:px-4 py-1.5 sm:py-1.5 min-h-[32px] sm:min-h-[36px] rounded-lg sm:rounded-full text-[9px] sm:text-[10px] uppercase tracking-wider flex items-center gap-1 sm:gap-1.5 transition-all duration-300 cursor-pointer ${timeframe === 'year'
            ? 'bg-cyan-400 text-zinc-950 font-black shadow-[0_0_12px_rgba(129,140,248,0.4)]'
            : 'text-zinc-400 hover:text-zinc-200 font-bold'
            }`}
        >
          <CalendarRange className="w-3 h-3 shrink-0" />
          <span className="sm:hidden">Year</span>
          <span className="hidden sm:inline">365 Days</span>
        </button>

        <button
          type="button"
          onClick={() => setTimeframe('month')}
          className={`justify-center px-2 sm:px-4 py-1.5 sm:py-1.5 min-h-[32px] sm:min-h-[36px] rounded-lg sm:rounded-full text-[9px] sm:text-[10px] uppercase tracking-wider flex items-center gap-1 sm:gap-1.5 transition-all duration-300 cursor-pointer ${timeframe === 'month'
            ? 'bg-cyan-400 text-zinc-950 font-black shadow-[0_0_12px_rgba(129,140,248,0.4)]'
            : 'text-zinc-400 hover:text-zinc-200 font-bold'
            }`}
        >
          <Calendar className="w-3 h-3 shrink-0" />
          <span>Month</span>
        </button>

        <button
          type="button"
          onClick={() => setTimeframe('week')}
          className={`justify-center px-2 sm:px-4 py-1.5 sm:py-1.5 min-h-[32px] sm:min-h-[36px] rounded-lg sm:rounded-full text-[9px] sm:text-[10px] uppercase tracking-wider flex items-center gap-1 sm:gap-1.5 transition-all duration-300 cursor-pointer ${timeframe === 'week'
            ? 'bg-cyan-400 text-zinc-950 font-black shadow-[0_0_12px_rgba(129,140,248,0.4)]'
            : 'text-zinc-400 hover:text-zinc-200 font-bold'
            }`}
        >
          <CalendarDays className="w-3 h-3 shrink-0" />
          <span>Week</span>
        </button>
      </div>
    </div>
  );
}

export default memo(ContributionGraphHeader);
