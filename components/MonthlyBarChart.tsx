'use client';

import { GymLog, MonthlyStat } from '@/lib/types';
import { formatDateKey } from '@/lib/api-mock';
import { animePowerLevels, AnimePower } from '@/assets/anime';
import React, { useMemo, useState } from 'react';
import { Swords, CalendarDays, Calendar } from 'lucide-react';

interface MonthlyBarChartProps {
  monthlyData: MonthlyStat[];
  logs: GymLog[];
}

interface WeeklyStat {
  weekLabel: string;
  count: number;
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

  // Find max hours to calculate percentage power level relative to user's highest session duration
  const maxHours = useMemo(() => {
    if (viewType === 'monthly') {
      const max = Math.max(...monthlyData.map((d) => d.totalHours), 1);
      return max;
    } else {
      const max = Math.max(...weeklyData.map((d) => d.totalHours), 1);
      return max;
    }
  }, [viewType, monthlyData, weeklyData]);

  // Helper to determine the corresponding anime power level character
  const getAnimeCharacter = (totalHours: number): AnimePower | null => {
    if (totalHours <= 0) return null;
    const percentage = (totalHours / maxHours) * 100;
    
    // Sort by power descending to find the highest matching tier
    const sorted = [...animePowerLevels].sort((a, b) => b.power - a.power);
    const matched = sorted.find((char) => percentage >= char.power);
    return matched || animePowerLevels[0]; // Fallback to Aqua
  };

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
            <Swords className="w-5 h-5 text-emerald-400" />
            <span>Anime Gym Power Levels ({new Date().getFullYear()})</span>
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            {viewType === 'monthly'
              ? 'Ascend the power tiers based on monthly workout hours'
              : 'Ascend the power tiers based on weekly workout hours'}
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
      <div className="h-60 flex items-end justify-between gap-2 sm:gap-4 pt-12 px-2">
        {viewType === 'monthly'
          ? monthlyData.map((m) => {
              const heightPercent = Math.round((m.count / maxCount) * 100);
              const isCurrentMonth = m.monthIndex === currentMonthIndex;
              const animeChar = getAnimeCharacter(m.totalHours);

              return (
                <div
                  key={m.month}
                  className="flex-1 flex flex-col items-center h-full justify-end group relative"
                >
                  {/* Tooltip on Hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none absolute -top-8 bg-zinc-950 text-zinc-100 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-center z-20 shadow-2xl whitespace-nowrap space-y-1">
                    <p className="font-bold text-emerald-400">{m.count} Gym Days ({m.totalHours}h)</p>
                    {animeChar ? (
                      <div className="flex items-center gap-1.5 justify-center border-t border-zinc-800 pt-1 mt-1 text-[10px]">
                        <span className="text-zinc-400 font-semibold">Tier:</span>
                        <span className="text-amber-400 font-bold">{animeChar.name} (Pwr {animeChar.power})</span>
                      </div>
                    ) : (
                      <p className="text-[10px] text-zinc-500">Rest Tier</p>
                    )}
                  </div>

                  {/* Anime Character Bubble sitting on top of the bar */}
                  {animeChar && (
                    <div
                      style={{ bottom: `calc(${heightPercent}% * 0.72 + 28px)` }}
                      className="absolute w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-emerald-400 bg-zinc-950 shadow-lg shadow-emerald-500/10 flex items-center justify-center p-0.5 overflow-hidden transition-all duration-300 z-10 group-hover:scale-110 group-hover:border-amber-400 animate-in fade-in"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={animeChar.image}
                        alt={animeChar.name}
                        className="w-full h-full object-contain rounded-full"
                      />
                    </div>
                  )}

                  {/* Vertical Bar */}
                  <div className="w-full max-w-[36px] bg-zinc-800/60 rounded-t-lg overflow-hidden flex flex-col justify-end h-32 p-0.5 border border-zinc-800/60 group-hover:border-emerald-500/50 transition-colors relative">
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
            })
          : weeklyData.map((w, idx) => {
              const heightPercent = Math.round((w.count / maxCount) * 100);
              const animeChar = getAnimeCharacter(w.totalHours);

              return (
                <div
                  key={`${w.weekLabel}-${idx}`}
                  className="flex-1 flex flex-col items-center h-full justify-end group relative"
                >
                  {/* Tooltip on Hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none absolute -top-8 bg-zinc-950 text-zinc-100 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-center z-20 shadow-2xl whitespace-nowrap space-y-1">
                    <p className="font-bold text-emerald-400">{w.count} Gym Days ({w.totalHours}h)</p>
                    {animeChar ? (
                      <div className="flex items-center gap-1.5 justify-center border-t border-zinc-800 pt-1 mt-1 text-[10px]">
                        <span className="text-zinc-400 font-semibold">Tier:</span>
                        <span className="text-amber-400 font-bold">{animeChar.name} (Pwr {animeChar.power})</span>
                      </div>
                    ) : (
                      <p className="text-[10px] text-zinc-500">Rest Tier</p>
                    )}
                  </div>

                  {/* Anime Character Bubble sitting on top of the bar */}
                  {animeChar && (
                    <div
                      style={{ bottom: `calc(${heightPercent}% * 0.72 + 28px)` }}
                      className="absolute w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-emerald-400 bg-zinc-950 shadow-lg shadow-emerald-500/10 flex items-center justify-center p-0.5 overflow-hidden transition-all duration-300 z-10 group-hover:scale-110 group-hover:border-amber-400 animate-in fade-in"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={animeChar.image}
                        alt={animeChar.name}
                        className="w-full h-full object-contain rounded-full"
                      />
                    </div>
                  )}

                  {/* Vertical Bar */}
                  <div className="w-full max-w-[36px] bg-zinc-800/60 rounded-t-lg overflow-hidden flex flex-col justify-end h-32 p-0.5 border border-zinc-800/60 group-hover:border-emerald-500/50 transition-colors relative">
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

                  {/* Week Label */}
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
