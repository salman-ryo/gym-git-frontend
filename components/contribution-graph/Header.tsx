'use client';

import React from 'react';
import { CalendarRange, Calendar, CalendarDays } from 'lucide-react';
import { TimeframeView } from '@/lib/types';

interface HeaderProps {
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

export default function Header({
  timeframe,
  setTimeframe,
  yearData,
  monthData,
  weekData,
}: HeaderProps) {
  return (
    <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 mb-8 pb-4 border-b border-zinc-800/50">
      <div className="w-full">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-2 h-2 rotate-45 bg-cyan-400 shadow-[0_0_8px_#818cf8]" />
          <h2 className="text-sm font-black text-white uppercase tracking-[0.2em] drop-shadow-[0_0_8px_rgba(129,140,248,0.5)]">
            Activity Logs
          </h2>
          <div className="h-[1px] flex-1 bg-gradient-to-r from-cyan-500/30 to-transparent ml-2" />
        </div>

        <p className="text-[11px] text-zinc-400 mt-2 font-medium tracking-wide">
          {timeframe === 'year' && (
            <>
              <strong className="text-zinc-100 font-bold">{yearData.totalWorkouts} sessions</strong> ({yearData.totalHours} hrs logged) in the <span className="text-white font-bold">Past 365 Days</span>
            </>
          )}
          {timeframe === 'month' && (
            <>
              <strong className="text-zinc-100 font-bold">{monthData.totalWorkouts} sessions</strong> ({monthData.totalHours} hrs logged) in <span className="text-white font-bold">{monthData.monthName} {monthData.year}</span>
            </>
          )}
          {timeframe === 'week' && (
            <>
              <strong className="text-zinc-100 font-bold">{weekData.totalWorkouts} sessions</strong> ({weekData.totalHours} hrs logged) in the <span className="text-white font-bold">Current Week</span>
            </>
          )}
        </p>
      </div>

      {/* Neon Pill Toggles */}
      <div className="flex items-center gap-1.5 bg-zinc-900/60 border border-zinc-800/80 p-1.5 rounded-full shrink-0">
        <button
          type="button"
          onClick={() => setTimeframe('year')}
          className={`px-4 py-1.5 rounded-full text-[10px] uppercase tracking-wider flex items-center gap-1.5 transition-all duration-300 ${timeframe === 'year'
            ? 'bg-cyan-400 text-zinc-950 font-black shadow-[0_0_12px_rgba(129,140,248,0.4)]'
            : 'text-zinc-400 hover:text-zinc-200 font-bold'
            }`}
        >
          <CalendarRange className="w-3 h-3" />
          <span>365 Days</span>
        </button>

        <button
          type="button"
          onClick={() => setTimeframe('month')}
          className={`px-4 py-1.5 rounded-full text-[10px] uppercase tracking-wider flex items-center gap-1.5 transition-all duration-300 ${timeframe === 'month'
            ? 'bg-cyan-400 text-zinc-950 font-black shadow-[0_0_12px_rgba(129,140,248,0.4)]'
            : 'text-zinc-400 hover:text-zinc-200 font-bold'
            }`}
        >
          <Calendar className="w-3 h-3" />
          <span>Month</span>
        </button>

        <button
          type="button"
          onClick={() => setTimeframe('week')}
          className={`px-4 py-1.5 rounded-full text-[10px] uppercase tracking-wider flex items-center gap-1.5 transition-all duration-300 ${timeframe === 'week'
            ? 'bg-cyan-400 text-zinc-950 font-black shadow-[0_0_12px_rgba(129,140,248,0.4)]'
            : 'text-zinc-400 hover:text-zinc-200 font-bold'
            }`}
        >
          <CalendarDays className="w-3 h-3" />
          <span>Week</span>
        </button>
      </div>
    </div>
  );
}
