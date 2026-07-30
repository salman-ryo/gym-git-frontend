'use client';

import { GymLog, MonthlyStat } from '@/lib/types';
import { formatDateKey } from '@/lib/scientific-streak';
import { calculateScientificPowerScore, PowerScoreBreakdown } from '@/lib/scientific-power';
import React, { useMemo, useState } from 'react';
import { Swords, Zap, HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import AnimeTierCard from './AnimeTierCard';

interface MonthlyBarChartProps {
  monthlyData: MonthlyStat[];
  logs: GymLog[];
}

interface MonthlyPowerStat {
  month: string;
  monthIndex: number;
  year: number;
  count: number;
  totalHours: number;
  isCurrentMonth: boolean;
  scoreData: PowerScoreBreakdown;
}

interface WeeklyPowerStat {
  weekLabel: string;
  count: number;
  totalHours: number;
  isCurrentWeek: boolean;
  scoreData: PowerScoreBreakdown;
}

export default function MonthlyBarChart({ monthlyData, logs }: MonthlyBarChartProps) {
  const [showFormulaGuide, setShowFormulaGuide] = useState<boolean>(false);

  // Map dates to log objects for fast lookup
  const logsMap = useMemo(() => {
    const map = new Map<string, GymLog>();
    logs.forEach((log) => {
      if (log.hours > 0) {
        map.set(log.date, log);
      }
    });
    return map;
  }, [logs]);

  // Compute Monthly Stats: Strict Rolling Window of the Last 12 Months
  const monthlyPowerStats = useMemo(() => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonthIndex = today.getMonth();
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const result: MonthlyPowerStat[] = [];

    // Loop backwards from 11 down to 0 to generate exactly 12 continuous months
    for (let i = 11; i >= 0; i--) {
      const targetDate = new Date(currentYear, currentMonthIndex - i, 1);
      const targetYear = targetDate.getFullYear();
      const targetMonthIndex = targetDate.getMonth();

      const daysInMonth = new Date(targetYear, targetMonthIndex + 1, 0).getDate();

      const monthLogs: GymLog[] = [];
      let count = 0;
      let totalHours = 0;

      logsMap.forEach((log) => {
        const [logY, logM] = log.date.split('-').map(Number);
        if (logY === targetYear && logM === targetMonthIndex + 1) {
          monthLogs.push(log);
          count++;
          totalHours += log.hours;
        }
      });

      const scoreData = calculateScientificPowerScore(monthLogs, daysInMonth, 4);

      result.push({
        month: monthNames[targetMonthIndex],
        monthIndex: targetMonthIndex,
        year: targetYear,
        count,
        totalHours: Number(totalHours.toFixed(1)),
        isCurrentMonth: i === 0, // i === 0 is the current month in this loop
        scoreData,
      });
    }

    return result;
  }, [logsMap]);

  // Compute Weekly Stats: Strictly all weeks that fall in the current calendar month
  const weeklyPowerStats = useMemo(() => {
    if (!logs) return [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();

    const startOfMonth = new Date(currentYear, currentMonth, 1);
    const endOfMonth = new Date(currentYear, currentMonth + 1, 0);

    const firstDayOfWeek = startOfMonth.getDay();
    const diffToMonday = startOfMonth.getDate() - firstDayOfWeek + (firstDayOfWeek === 0 ? -6 : 1);
    const currentWeekStart = new Date(startOfMonth);
    currentWeekStart.setDate(diffToMonday);

    const result: WeeklyPowerStat[] = [];

    while (currentWeekStart <= endOfMonth) {
      const mon = new Date(currentWeekStart);
      const sun = new Date(mon);
      sun.setDate(mon.getDate() + 6);

      const monStr = formatDateKey(mon);
      const sunStr = formatDateKey(sun);

      const weekLogs: GymLog[] = [];
      let count = 0;
      let totalHours = 0;

      logsMap.forEach((log) => {
        if (log.date >= monStr && log.date <= sunStr) {
          weekLogs.push(log);
          count++;
          totalHours += log.hours;
        }
      });

      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const weekLabel = `${monthNames[mon.getMonth()]} ${mon.getDate()}`;

      const isCurrentWeek = today >= mon && today <= sun;

      const scoreData = calculateScientificPowerScore(weekLogs, 7, 4);

      result.push({
        weekLabel,
        count,
        totalHours: Number(totalHours.toFixed(1)),
        isCurrentWeek,
        scoreData,
      });

      currentWeekStart.setDate(currentWeekStart.getDate() + 7);
    }

    return result;
  }, [logs, logsMap]);

  return (
    <TooltipProvider delayDuration={50}>
      <div className="bg-zinc-900/80 border border-zinc-800 backdrop-blur-xl p-6 rounded-2xl shadow-xl space-y-6">
        {/* Header with Formula Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800/80">
          <div>
            <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
              <Swords className="w-5 h-5 text-emerald-400" />
              <span>Power Levels</span>
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Sci-scored (0-100) based on consistency, duration quality &amp; split balance. Hover over bars to view Anime Tiers.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowFormulaGuide(!showFormulaGuide)}
            className="p-2 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-emerald-400 rounded-xl text-xs flex items-center gap-1.5 transition-all self-start sm:self-center shrink-0"
            title="How Power Score is calculated"
          >
            <HelpCircle className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold">Scoring Formula</span>
          </button>
        </div>

        {/* Expandable Formula Guide */}
        {showFormulaGuide && (
          <div className="bg-zinc-950/90 border border-emerald-500/30 rounded-2xl p-4 text-xs space-y-3 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <span className="font-bold text-emerald-400 flex items-center gap-1.5 text-sm">
                <Zap className="w-4 h-4 text-amber-400" /> Scientific Gym Power Scoring (100 Pts Max)
              </span>
              <span className="text-[10px] text-zinc-500">Quality &gt; Junk Volume</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-zinc-300">
              <div className="bg-zinc-900/60 p-2.5 rounded-xl border border-zinc-800">
                <p className="font-bold text-emerald-400 mb-0.5">🎯 Consistency (45%)</p>
                <p className="text-[10px] text-zinc-400 leading-snug">
                  Days hit vs target frequency. 5 days @ 45m beats 1 day @ 4h.
                </p>
              </div>
              <div className="bg-zinc-900/60 p-2.5 rounded-xl border border-zinc-800">
                <p className="font-bold text-sky-400 mb-0.5">⏱️ Optimal Length (25%)</p>
                <p className="text-[10px] text-zinc-400 leading-snug">
                  45m – 90m sweet spot gets 100%. Overlong binge days (&gt;3h) diminish returns.
                </p>
              </div>
              <div className="bg-zinc-900/60 p-2.5 rounded-xl border border-zinc-800">
                <p className="font-bold text-amber-400 mb-0.5">🧩 Split Variety (20%)</p>
                <p className="text-[10px] text-zinc-400 leading-snug">
                  Rewards training 3+ distinct workout types (Push, Pull, Legs, etc.).
                </p>
              </div>
              <div className="bg-zinc-900/60 p-2.5 rounded-xl border border-zinc-800">
                <p className="font-bold text-rose-400 mb-0.5">🔥 Momentum (10%)</p>
                <p className="text-[10px] text-zinc-400 leading-snug">
                  Active habit sequences &amp; steady weekly attendance.
                </p>
              </div>
            </div>

            <div className="pt-1 flex flex-wrap items-center justify-between gap-1 text-[10px] text-zinc-400 border-t border-zinc-800/80">
              <span className="font-bold text-zinc-300">Character Ranks:</span>
              <span className="text-zinc-500">Aqua (5) → Mumen Rider (25) → Tanjiro (55) → Deku (72) → Gojo (88) → Naruto (94) → Luffy (97) → Goku (100)</span>
            </div>
          </div>
        )}

        {/* Side-by-Side Charts Layout */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 pt-4">

          {/* Left Column: Weekly view (Current Month Only) */}
          <div className="w-full lg:w-1/3 flex flex-col gap-6">
            <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest text-center border-b border-zinc-800/50 pb-2">
              Weekly Progress
            </h4>

            <div className="h-64 flex items-end justify-between gap-2 px-2">
              {weeklyPowerStats.map((w, idx) => {
                const score = w.scoreData.totalScore;
                const heightPercent = Math.max(6, score);
                const char = w.scoreData.character;

                return (
                  <div key={`${w.weekLabel}-${idx}`} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                    <Tooltip key={`${w.weekLabel}-${idx}`}>
                      <TooltipTrigger asChild>
                        <div className="w-full flex flex-col items-center cursor-pointer relative z-10">
                          {char && (
                            <div
                              style={{ bottom: `calc(${heightPercent}% * 0.76 + 16px)` }}
                              className="absolute w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center p-0.5 overflow-hidden transition-all duration-300 z-20 group-hover:scale-125 group-hover:border-amber-400"
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={char.image} alt={char.name} className="w-full h-full object-contain rounded-full" />
                            </div>
                          )}
                          <span className="text-[10px] font-black text-zinc-400 mb-1 group-hover:text-emerald-400 transition-colors">
                            {score}
                          </span>

                          <div
                            className={`w-full max-w-[36px] bg-zinc-800/60 rounded-t-lg overflow-hidden flex flex-col justify-end h-36 p-0.5 border transition-all duration-300 relative ${w.isCurrentWeek
                              ? 'border-emerald-400/80 shadow-[0_0_15px_rgba(52,211,153,0.5)] z-10'
                              : 'border-zinc-800/60 group-hover:border-emerald-500/50'
                              }`}
                          >
                            <div
                              style={{ height: `${heightPercent}%` }}
                              className={`w-full rounded-t transition-all duration-500 ${w.isCurrentWeek
                                ? 'bg-gradient-to-t from-emerald-600 via-teal-400 to-emerald-300 shadow-lg shadow-emerald-500/30'
                                : score > 35
                                  ? 'bg-gradient-to-t from-emerald-800 to-teal-500 group-hover:from-emerald-600 group-hover:to-emerald-400'
                                  : score > 0
                                    ? 'bg-gradient-to-t from-zinc-700 to-zinc-500 group-hover:from-zinc-600 group-hover:to-zinc-400' // FIXED BUG: Distinct color for low scores
                                    : 'bg-transparent'
                                }`}
                            />
                          </div>
                          <span className={`text-[9px] font-semibold mt-2.5 truncate max-w-[40px] text-center ${w.isCurrentWeek ? 'text-emerald-400 font-bold underline underline-offset-4 decoration-emerald-500/50' : 'text-zinc-500 group-hover:text-zinc-300'}`}>
                            {w.weekLabel}
                          </span>
                        </div>
                      </TooltipTrigger>

                      <TooltipContent side="top" className="p-0 border-none bg-transparent shadow-none" sideOffset={12}>
                        <AnimeTierCard
                          title={`WEEK OF ${w.weekLabel}`}
                          score={score}
                          character={char!}
                          gymDays={w.count}
                          totalHours={w.totalHours}
                          scoreData={w.scoreData}
                        />
                      </TooltipContent>
                    </Tooltip>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Vertical Divider for Desktop */}
          <div className="hidden lg:block w-px bg-zinc-800/80" />

          {/* Right Column: Monthly view (Last 12 Months) */}
          <div className="w-full lg:w-2/3 flex flex-col gap-6">
            <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest text-center border-b border-zinc-800/50 pb-2">
              Last 12 Months
            </h4>

            <div className="h-64 flex items-end justify-between gap-1.5 px-2">
              {monthlyPowerStats.map((m, idx) => {
                const score = m.scoreData.totalScore;
                const heightPercent = Math.max(6, score);
                const char = m.scoreData.character;
                const compositeKey = `${m.year}-${m.monthIndex}-${idx}`;

                return (
                  <div key={compositeKey} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                    <Tooltip key={compositeKey}>
                      <TooltipTrigger asChild>
                        <div className="w-full flex flex-col items-center cursor-pointer relative z-10">
                          {char && (
                            <div
                              style={{ bottom: `calc(${heightPercent}% * 0.76 + 16px)` }}
                              className="absolute w-7 h-7 sm:w-10 sm:h-10 flex items-center justify-center p-0.5 overflow-hidden transition-all duration-300 z-20 group-hover:scale-125 group-hover:border-amber-400"
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={char.image} alt={char.name} className="w-full h-full object-contain rounded-full" />
                            </div>
                          )}
                          <span className="text-[9px] sm:text-[10px] font-black text-zinc-400 mb-1 group-hover:text-emerald-400 transition-colors">
                            {score}
                          </span>

                          <div
                            className={`w-full max-w-[36px] bg-zinc-800/60 rounded-t-lg overflow-hidden flex flex-col justify-end h-36 p-0.5 border transition-all duration-300 relative ${m.isCurrentMonth
                              ? 'border-emerald-400/80 shadow-[0_0_15px_rgba(52,211,153,0.5)] z-10'
                              : 'border-zinc-800/60 group-hover:border-emerald-500/50'
                              }`}
                          >
                            <div
                              style={{ height: `${heightPercent}%` }}
                              className={`w-full rounded-t transition-all duration-500 ${m.isCurrentMonth
                                ? 'bg-gradient-to-t from-emerald-600 via-teal-400 to-emerald-300 shadow-lg shadow-emerald-500/30'
                                : score > 35
                                  ? 'bg-gradient-to-t from-emerald-800 to-teal-500 group-hover:from-emerald-600 group-hover:to-emerald-400'
                                  : score > 0
                                    ? 'bg-gradient-to-t from-emerald-800 to-emerald-600 group-hover:from-emerald-600 group-emerald:to-zinc-400' // FIXED BUG: Distinct color for low scores
                                    : 'bg-transparent'
                                }`}
                            />
                          </div>
                          <span className={`text-[9px] font-semibold mt-2.5 ${m.isCurrentMonth ? 'text-emerald-400 font-bold underline underline-offset-4 decoration-emerald-500/50' : 'text-zinc-500 group-hover:text-zinc-300'}`}>
                            {m.month.slice(0, 3)}
                          </span>
                        </div>
                      </TooltipTrigger>

                      <TooltipContent side="top" className="p-0 border-none bg-transparent shadow-none" sideOffset={12}>
                        <AnimeTierCard
                          title={`${m.month} ${m.year}`}
                          score={score}
                          character={char!}
                          gymDays={m.count}
                          totalHours={m.totalHours}
                          scoreData={m.scoreData}
                        />
                      </TooltipContent>
                    </Tooltip>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </TooltipProvider>
  );
}