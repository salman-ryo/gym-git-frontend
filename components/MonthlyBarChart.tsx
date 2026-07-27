'use client';

import { GymLog, MonthlyStat } from '@/lib/types';
import { formatDateKey } from '@/lib/scientific-streak';
import { animePowerLevels } from '@/assets/anime';
import { calculateScientificPowerScore, PowerScoreBreakdown } from '@/lib/scientific-power';
import React, { useMemo, useState } from 'react';
import { Swords, CalendarDays, Calendar, Zap, HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
  const [viewType, setViewType] = useState<'monthly' | 'weekly'>('monthly');
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

  // Compute Scientific Power Scores for Monthly data
  const monthlyPowerStats = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const currentMonthIndex = new Date().getMonth();

    return monthlyData.map((m) => {
      const daysInMonth = new Date(currentYear, m.monthIndex + 1, 0).getDate();

      const monthLogs: GymLog[] = [];
      logsMap.forEach((log) => {
        const [y, monthNum] = log.date.split('-').map(Number);
        if (y === currentYear && monthNum === m.monthIndex + 1) {
          monthLogs.push(log);
        }
      });

      const scoreData = calculateScientificPowerScore(monthLogs, daysInMonth, 4);

      return {
        ...m,
        isCurrentMonth: m.monthIndex === currentMonthIndex,
        scoreData,
      } as MonthlyPowerStat;
    });
  }, [monthlyData, logsMap]);

  // Compute Scientific Power Scores for Weekly data (Last 12 weeks)
  const weeklyPowerStats = useMemo(() => {
    if (!logs) return [];

    const result: WeeklyPowerStat[] = [];
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sun
    const distanceToMon = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const currentMonday = new Date(today);
    currentMonday.setDate(today.getDate() + distanceToMon);

    for (let i = 11; i >= 0; i--) {
      const mon = new Date(currentMonday);
      mon.setDate(currentMonday.getDate() - i * 7);

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

      const scoreData = calculateScientificPowerScore(weekLogs, 7, 4);

      result.push({
        weekLabel,
        count,
        totalHours: Number(totalHours.toFixed(1)),
        isCurrentWeek: i === 0,
        scoreData,
      });
    }

    return result;
  }, [logs, logsMap]);

  return (
    <TooltipProvider delayDuration={50}>
      <div className="bg-zinc-900/80 border border-zinc-800 backdrop-blur-xl p-6 rounded-2xl shadow-xl space-y-6">
        {/* Header with Switcher Toggle & Formula Info */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800/80">
          <div>
            <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
              <Swords className="w-5 h-5 text-emerald-400" />
              <span>Power Levels ({new Date().getFullYear()})</span>
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Power scores (0-100) computed scientifically from consistency, duration quality &amp; split balance
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 self-start sm:self-center">
            {/* Toggle Formula Breakdown Guide */}
            <button
              type="button"
              onClick={() => setShowFormulaGuide(!showFormulaGuide)}
              className="p-2 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-emerald-400 rounded-xl text-xs flex items-center gap-1.5 transition-all"
              title="How Power Score is calculated"
            >
              <HelpCircle className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline font-semibold">Scoring Formula</span>
            </button>

            {/* View Switcher Toggle */}
            <div className="flex items-center gap-1 bg-zinc-950 border border-zinc-800 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setViewType('monthly')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${viewType === 'monthly'
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
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${viewType === 'weekly'
                  ? 'bg-emerald-500 text-zinc-950 font-bold shadow-md shadow-emerald-500/20'
                  : 'text-zinc-400 hover:text-zinc-200'
                  }`}
              >
                <CalendarDays className="w-3.5 h-3.5" />
                <span>Weekly</span>
              </button>
            </div>
          </div>
        </div>

        {/* Expandable Scientific Formula Guide Card */}
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
                  Rewards training 3+ distinct workout types (Push, Pull, Legs, Core, etc.).
                </p>
              </div>

              <div className="bg-zinc-900/60 p-2.5 rounded-xl border border-zinc-800">
                <p className="font-bold text-rose-400 mb-0.5">🔥 Momentum (10%)</p>
                <p className="text-[10px] text-zinc-400 leading-snug">
                  Active habit sequences &amp; steady weekly attendance.
                </p>
              </div>
            </div>

            {/* Anime Power Tier Ranks */}
            <div className="pt-1 flex flex-wrap items-center justify-between gap-1 text-[10px] text-zinc-400 border-t border-zinc-800/80">
              <span className="font-bold text-zinc-300">Character Ranks:</span>
              <span className="text-zinc-500">Aqua (5) → Mumen Rider (25) → Tanjiro (55) → Deku (72) → Gojo (88) → Naruto (94) → Luffy (97) → Goku (100)</span>
            </div>
          </div>
        )}

        {/* Bar Chart Container */}
        <div className="h-64 flex items-end justify-between gap-2 sm:gap-4 pt-12 px-2">
          {viewType === 'monthly'
            ? monthlyPowerStats.map((m) => {
              const score = m.scoreData.totalScore;
              const heightPercent = Math.max(6, score);
              const char = m.scoreData.character;

              return (
                <div
                  key={m.month}
                  className="flex-1 flex flex-col items-center h-full justify-end group relative"
                >
                  <Tooltip key={m.month}>
                    <TooltipTrigger asChild>
                      <div className="w-full flex flex-col items-center cursor-pointer">
                        {/* Anime Character Avatar seated dynamically above bar height */}
                        {char && (
                          <div
                            style={{ bottom: `calc(${heightPercent}% * 0.76 + 16px)` }}
                            className="absolute w-8 h-8 sm:w-12 sm:h-12 flex items-center justify-center p-0.5 overflow-hidden transition-all duration-300 z-10 group-hover:scale-125 group-hover:border-amber-400"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={char.image}
                              alt={char.name}
                              className="w-full h-full object-contain rounded-full"
                            />
                          </div>
                        )}

                        {/* Score Pill Label Above Bar */}
                        <span className="text-[10px] font-black text-zinc-400 mb-1 group-hover:text-emerald-400 transition-colors">
                          {score} pts
                        </span>

                        {/* Vertical Bar (Height maps to Scientific Power Score 0-100) */}
                        <div className="w-full max-w-[36px] bg-zinc-800/60 rounded-t-lg overflow-hidden flex flex-col justify-end h-36 p-0.5 border border-zinc-800/60 group-hover:border-emerald-500/50 transition-colors relative">
                          <div
                            style={{ height: `${heightPercent}%` }}
                            className={`w-full rounded-t transition-all duration-500 ${m.isCurrentMonth
                              ? 'bg-gradient-to-t from-emerald-600 via-teal-400 to-emerald-300 shadow-lg shadow-emerald-500/30'
                              : score > 35
                                ? 'bg-gradient-to-t from-emerald-800 to-teal-500 group-hover:from-emerald-600 group-hover:to-emerald-400'
                                : 'bg-zinc-800/60'
                              }`}
                          />
                        </div>

                        {/* Month Label */}
                        <span
                          className={`text-[11px] font-semibold mt-2.5 ${m.isCurrentMonth
                            ? 'text-emerald-400 font-bold underline underline-offset-4 decoration-emerald-500/50'
                            : 'text-zinc-500 group-hover:text-zinc-300'
                            }`}
                        >
                          {m.month}
                        </span>
                      </div>
                    </TooltipTrigger>

                    <TooltipContent side="top" className="p-3 max-w-xs space-y-2">
                      <div className="flex items-center justify-between border-b border-zinc-800 pb-1.5">
                        <span className="font-bold text-zinc-100 text-xs">{m.month} {m.year}</span>
                        <span className="font-black text-emerald-400 text-xs">{score}/100 Pts</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={char.image} alt={char.name} className="w-8 h-8 rounded-full border border-emerald-400 bg-zinc-900" />
                        <div>
                          <p className="text-xs font-bold text-amber-400">{char.name} Tier</p>
                          <p className="text-[10px] text-zinc-400">{m.count} Gym Days • {m.totalHours}h Total</p>
                        </div>
                      </div>

                      {/* Factor Score breakdown */}
                      <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[10px] pt-1 border-t border-zinc-800/80 text-zinc-300">
                        <div>🎯 Consistency: <strong className="text-emerald-400">{m.scoreData.consistencyScore}/45</strong></div>
                        <div>⏱️ Duration: <strong className="text-sky-400">{m.scoreData.durationQualityScore}/25</strong></div>
                        <div>🧩 Variety: <strong className="text-amber-400">{m.scoreData.varietyScore}/20</strong></div>
                        <div>🔥 Momentum: <strong className="text-rose-400">{m.scoreData.momentumScore}/10</strong></div>
                      </div>

                      <p className="text-[10px] italic text-zinc-400 pt-1 border-t border-zinc-800/60 leading-snug">
                        {m.scoreData.evaluationText}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              );
            })
            : weeklyPowerStats.map((w, idx) => {
              const score = w.scoreData.totalScore;
              const heightPercent = Math.max(6, score);
              const char = w.scoreData.character;

              return (
                <div
                  key={`${w.weekLabel}-${idx}`}
                  className="flex-1 flex flex-col items-center h-full justify-end group relative"
                >
                  <Tooltip key={`${w.weekLabel}-${idx}`}>
                    <TooltipTrigger asChild>
                      <div className="w-full flex flex-col items-center cursor-pointer">
                        {/* Character Avatar */}
                        {char && (
                          <div
                            style={{ bottom: `calc(${heightPercent}% * 0.76 + 28px)` }}
                            className="absolute w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-emerald-400 bg-zinc-950 shadow-lg shadow-emerald-500/20 flex items-center justify-center p-0.5 overflow-hidden transition-all duration-300 z-10 group-hover:scale-125 group-hover:border-amber-400"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={char.image}
                              alt={char.name}
                              className="w-full h-full object-contain rounded-full"
                            />
                          </div>
                        )}

                        <span className="text-[10px] font-black text-zinc-400 mb-1 group-hover:text-emerald-400 transition-colors">
                          {score} pts
                        </span>

                        <div className="w-full max-w-[36px] bg-zinc-800/60 rounded-t-lg overflow-hidden flex flex-col justify-end h-36 p-0.5 border border-zinc-800/60 group-hover:border-emerald-500/50 transition-colors relative">
                          <div
                            style={{ height: `${heightPercent}%` }}
                            className={`w-full rounded-t transition-all duration-500 ${w.isCurrentWeek
                              ? 'bg-gradient-to-t from-emerald-600 via-teal-400 to-emerald-300 shadow-lg shadow-emerald-500/30'
                              : score > 35
                                ? 'bg-gradient-to-t from-emerald-800 to-teal-500 group-hover:from-emerald-600 group-hover:to-emerald-400'
                                : 'bg-zinc-800/60'
                              }`}
                          />
                        </div>

                        <span
                          className={`text-[10px] font-semibold mt-2.5 truncate max-w-full ${w.isCurrentWeek
                            ? 'text-emerald-400 font-bold underline underline-offset-4 decoration-emerald-500/50'
                            : 'text-zinc-500 group-hover:text-zinc-300'
                            }`}
                        >
                          {w.weekLabel}
                        </span>
                      </div>
                    </TooltipTrigger>

                    <TooltipContent side="top" className="p-3 max-w-xs space-y-2">
                      <div className="flex items-center justify-between border-b border-zinc-800 pb-1.5">
                        <span className="font-bold text-zinc-100 text-xs">Week of {w.weekLabel}</span>
                        <span className="font-black text-emerald-400 text-xs">{score}/100 Pts</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={char.image} alt={char.name} className="w-8 h-8 rounded-full border border-emerald-400 bg-zinc-900" />
                        <div>
                          <p className="text-xs font-bold text-amber-400">{char.name} Tier</p>
                          <p className="text-[10px] text-zinc-400">{w.count} Gym Days • {w.totalHours}h Total</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[10px] pt-1 border-t border-zinc-800/80 text-zinc-300">
                        <div>🎯 Consistency: <strong className="text-emerald-400">{w.scoreData.consistencyScore}/45</strong></div>
                        <div>⏱️ Duration: <strong className="text-sky-400">{w.scoreData.durationQualityScore}/25</strong></div>
                        <div>🧩 Variety: <strong className="text-amber-400">{w.scoreData.varietyScore}/20</strong></div>
                        <div>🔥 Momentum: <strong className="text-rose-400">{w.scoreData.momentumScore}/10</strong></div>
                      </div>

                      <p className="text-[10px] italic text-zinc-400 pt-1 border-t border-zinc-800/60 leading-snug">
                        {w.scoreData.evaluationText}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              );
            })}
        </div>
      </div>
    </TooltipProvider>
  );
}
