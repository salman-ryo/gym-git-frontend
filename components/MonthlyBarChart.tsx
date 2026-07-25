'use client';

import { GymLog, MonthlyStat } from '@/lib/types';
import { formatDateKey } from '@/lib/api-mock';
import React, { useMemo, useState } from 'react';
import { BarChart3, CalendarDays, Calendar } from 'lucide-react';

interface MonthlyBarChartProps {
  monthlyData: MonthlyStat[];
  logs: GymLog[];
}

interface WeeklyStat {
  weekLabel: string; // e.g. "Jul 20"
  count: number; // 0..7
  totalHours: number;
  isCurrentWeek: boolean;
}

export default function MonthlyBarChart({ monthlyData, logs }: MonthlyBarChartProps) {
  const [viewType, setViewType] = useState<'monthly' | 'weekly'>('monthly');

  // Compute last 12 weeks data from gym logs
  const weeklyData = useMemo(() => {
    if (!logs || logs.length === 0) return [];

    const activeLogMap = new Map<string, GymLog>();
    logs.forEach((log) => {
      if (log.hours > 0) {
        activeLogMap.set(log.date, log);
      }
    });

    const result: WeeklyStat[] = [];
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sun
    const distanceToMon = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const currentMonday = new Date(today);
    currentMonday.setDate(today.getDate() + distanceToMon);

    // Build last 12 weeks (ending with current week)
    for (let i = 11; i >= 0; i--) {
      const mon = new Date(currentMonday);
      mon.setDate(currentMonday.getDate() - i * 7);
      
      const sun = new Date(mon);
      sun.setDate(mon.getDate() + 6);

      const monStr = formatDateKey(mon);
      const sunStr = formatDateKey(sun);

      let count = 0;
      let totalHours = 0;

      activeLogMap.forEach((log) => {
        if (log.date >= monStr && log.date <= sunStr) {
          count++;
          totalHours += log.hours;
        }
      });

      // Format date label (e.g. "Jul 20")
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const weekLabel = `${monthNames[mon.getMonth()]} ${mon.getDate()}`;

      result.push({
        weekLabel,
        count,
        totalHours: Number(totalHours.toFixed(1)),
        isCurrentWeek: i === 0,
      });
    }

    return result;
  }, [logs]);

  if (!monthlyData || monthlyData.length === 0) return null;

  // Values based on active view type
  const maxCount = viewType === 'monthly'
    ? Math.max(...monthlyData.map((d) => d.count), 1)
    : Math.max(...weeklyData.map((d) => d.count), 1);

  const currentMonthIndex = new Date().getMonth();

  return (
    <div className="bg-zinc-900/80 border border-zinc-800 backdrop-blur-xl p-6 rounded-2xl shadow-xl">
      {/* Header with Switcher Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-zinc-800/80">
        <div>
          <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-400" />
            <span>Gym Attendance Chart ({new Date().getFullYear()})</span>
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            {viewType === 'monthly'
              ? 'Workouts completed per calendar month'
              : 'Workouts completed per week (last 12 weeks)'}
          </p>
        </div>

        {/* View Switcher Toggle */}
        <div className="flex items-center gap-1.5 bg-zinc-950 border border-zinc-800 p-1 rounded-xl self-start sm:self-center">
          <button
            type="button"
            onClick={() => setViewType('monthly')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              viewType === 'monthly'
                ? 'bg-emerald-500 text-zinc-950 font-bold shadow-md shadow-emerald-500/20'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Monthly</span>
          </button>

          <button
            type="button"
            onClick={() => setViewType('weekly')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              viewType === 'weekly'
                ? 'bg-emerald-500 text-zinc-950 font-bold shadow-md shadow-emerald-500/20'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <CalendarDays className="w-3.5 h-3.5" />
            <span>Weekly</span>
          </button>
        </div>
      </div>

      {/* Bar Chart Container */}
      <div className="h-44 flex items-end justify-between gap-2 sm:gap-4 pt-6 px-2">
        {viewType === 'monthly'
          ? monthlyData.map((m) => {
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

                  {/* Label */}
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
            })
          : weeklyData.map((w, idx) => {
              const heightPercent = Math.round((w.count / maxCount) * 100);

              return (
                <div
                  key={`${w.weekLabel}-${idx}`}
                  className="flex-1 flex flex-col items-center h-full justify-end group relative"
                >
                  {/* Floating Tooltip Callout on Hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none absolute -top-10 bg-zinc-950 text-zinc-100 border border-zinc-700/80 rounded-lg px-2.5 py-1 text-xs text-center z-20 shadow-xl whitespace-nowrap">
                    <p className="font-bold text-emerald-400">{w.count} Gym Days</p>
                    <p className="text-[10px] text-zinc-400">{w.totalHours} hrs total</p>
                  </div>

                  {/* Bar Value label on top */}
                  <span className="text-[10px] font-bold text-zinc-400 mb-1 group-hover:text-emerald-400 transition-colors">
                    {w.count > 0 ? w.count : ''}
                  </span>

                  {/* Vertical Bar */}
                  <div className="w-full max-w-[36px] bg-zinc-800/60 rounded-t-lg overflow-hidden flex flex-col justify-end h-32 p-0.5 border border-zinc-800/60 group-hover:border-emerald-500/50 transition-colors">
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className={`w-full rounded-t transition-all duration-500 ${
                        w.isCurrentWeek
                          ? 'bg-gradient-to-t from-emerald-600 via-teal-400 to-emerald-300 shadow-lg shadow-emerald-500/30'
                          : w.count > 0
                          ? 'bg-gradient-to-t from-emerald-800 to-teal-500 group-hover:from-emerald-600 group-hover:to-emerald-400'
                          : 'bg-zinc-800/40'
                      }`}
                    />
                  </div>

                  {/* Label */}
                  <span
                    className={`text-[10px] font-semibold mt-2.5 truncate max-w-full ${
                      w.isCurrentWeek
                        ? 'text-emerald-400 font-bold underline underline-offset-4 decoration-emerald-500/50'
                        : 'text-zinc-500 group-hover:text-zinc-300'
                    }`}
                  >
                    {w.weekLabel}
                  </span>
                </div>
              );
            })}
      </div>
    </div>
  );
}
