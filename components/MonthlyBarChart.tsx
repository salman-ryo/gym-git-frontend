'use client';

import { MonthlyStat } from '@/lib/types';
import React from 'react';
import { BarChart3 } from 'lucide-react';

interface MonthlyBarChartProps {
  monthlyData: MonthlyStat[];
}

export default function MonthlyBarChart({ monthlyData }: MonthlyBarChartProps) {
  if (!monthlyData || monthlyData.length === 0) return null;

  // Find max count to scale bar heights relative to max
  const maxCount = Math.max(...monthlyData.map((d) => d.count), 1);
  const currentMonthIndex = new Date().getMonth();

  return (
    <div className="bg-zinc-900/80 border border-zinc-800 backdrop-blur-xl p-6 rounded-2xl shadow-xl">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-800/80">
        <div>
          <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-400" />
            <span>Monthly Gym Days ({new Date().getFullYear()})</span>
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Total workouts completed per calendar month
          </p>
        </div>
      </div>

      {/* Bar Chart Container */}
      <div className="h-44 flex items-end justify-between gap-2 sm:gap-4 pt-6 px-2">
        {monthlyData.map((m) => {
          const heightPercent = Math.round((m.count / maxCount) * 100);
          const isCurrentMonth = m.monthIndex === currentMonthIndex;

          return (
            <div
              key={m.month}
              className="flex-1 flex flex-col items-center h-full justify-end group relative"
            >
              {/* Floating Tooltip Callout on Hover */}
              <div className="opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none absolute -top-10 bg-zinc-950 text-zinc-100 border border-zinc-700/80 rounded-lg px-2.5 py-1 text-xs text-center z-20 shadow-xl whitespace-nowrap">
                <p className="font-bold text-emerald-400">{m.count} Gym Days</p>
                <p className="text-[10px] text-zinc-400">{m.totalHours} hrs total</p>
              </div>

              {/* Bar Value label on top */}
              <span className="text-[10px] font-bold text-zinc-400 mb-1 group-hover:text-emerald-400 transition-colors">
                {m.count > 0 ? m.count : ''}
              </span>

              {/* Vertical Bar */}
              <div className="w-full max-w-[36px] bg-zinc-800/60 rounded-t-lg overflow-hidden flex flex-col justify-end h-32 p-0.5 border border-zinc-800/60 group-hover:border-emerald-500/50 transition-colors">
                <div
                  style={{ height: `${heightPercent}%` }}
                  className={`w-full rounded-t transition-all duration-500 ${
                    isCurrentMonth
                      ? 'bg-gradient-to-t from-emerald-600 via-teal-400 to-emerald-300 shadow-lg shadow-emerald-500/30'
                      : m.count > 0
                      ? 'bg-gradient-to-t from-emerald-800 to-teal-500 group-hover:from-emerald-600 group-hover:to-emerald-400'
                      : 'bg-zinc-800/40'
                  }`}
                />
              </div>

              {/* Month Label */}
              <span
                className={`text-[11px] font-semibold mt-2.5 ${
                  isCurrentMonth
                    ? 'text-emerald-400 font-bold underline underline-offset-4 decoration-emerald-500/50'
                    : 'text-zinc-500 group-hover:text-zinc-300'
                }`}
              >
                {m.month}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
