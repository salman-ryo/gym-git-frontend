'use client';

import { GymLog, MonthlyStat } from '@/lib/types';
import { formatDateKey } from '@/lib/scientific-streak';
import { calculateScientificPowerScore, PowerScoreBreakdown } from '@/lib/scientific-power';
import React, { useMemo } from 'react';
import { Swords } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import AnimeTierCard from './AnimeTierCard';
import PowerScoreGuideModal from './PowerScoreGuideModal'; // <-- Ensure path is correct

interface PowerLevelChartProps {
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

// Dynamic gradient generator based on Power Score
const getPowerColorTheme = (score: number, isCurrent: boolean) => {
  if (score === 0) {
    return {
      bar: 'bg-transparent',
      container: 'border-zinc-800/80 group-hover:border-zinc-700',
      text: 'text-zinc-600 group-hover:text-zinc-500 font-bold',
      scoreText: 'text-zinc-600 group-hover:text-zinc-500 mb-1 transition-all',
    };
  }

  if (score < 35) {
    return {
      bar: isCurrent ? 'bg-gradient-to-t from-cyan-600 via-sky-400 to-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.6)]' : 'bg-gradient-to-t from-cyan-900/80 to-sky-700/80 group-hover:from-cyan-600 group-hover:to-sky-400',
      container: isCurrent ? 'border-cyan-400/80 shadow-[0_0_15px_rgba(34,211,238,0.5)] z-10' : 'border-zinc-800/80 group-hover:border-cyan-500/50 group-hover:shadow-[0_0_10px_rgba(34,211,238,0.2)]',
      text: isCurrent ? 'text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.8)] font-bold underline underline-offset-4 decoration-cyan-500/50' : 'text-zinc-500 group-hover:text-cyan-400 font-bold transition-colors',
      scoreText: 'text-[10px] font-black text-zinc-500 mb-1 group-hover:text-cyan-400 group-hover:drop-shadow-[0_0_5px_rgba(34,211,238,0.8)] transition-all'
    };
  }
  if (score < 55) {
    return {
      bar: isCurrent ? 'bg-gradient-to-t from-emerald-600 via-teal-400 to-emerald-300 shadow-[0_0_15px_rgba(52,211,153,0.6)]' : 'bg-gradient-to-t from-emerald-900/80 to-teal-700/80 group-hover:from-emerald-600 group-hover:to-teal-400',
      container: isCurrent ? 'border-emerald-400/80 shadow-[0_0_15px_rgba(52,211,153,0.5)] z-10' : 'border-zinc-800/80 group-hover:border-emerald-500/50 group-hover:shadow-[0_0_10px_rgba(52,211,153,0.2)]',
      text: isCurrent ? 'text-emerald-400 drop-shadow-[0_0_5px_rgba(52,211,153,0.8)] font-bold underline underline-offset-4 decoration-emerald-500/50' : 'text-zinc-500 group-hover:text-emerald-400 font-bold transition-colors',
      scoreText: 'text-[10px] font-black text-zinc-500 mb-1 group-hover:text-emerald-400 group-hover:drop-shadow-[0_0_5px_rgba(52,211,153,0.8)] transition-all'
    };
  }
  if (score < 72) {
    return {
      bar: isCurrent ? 'bg-gradient-to-t from-indigo-600 via-violet-400 to-indigo-300 shadow-[0_0_15px_rgba(129,140,248,0.6)]' : 'bg-gradient-to-t from-indigo-900/80 to-violet-700/80 group-hover:from-indigo-600 group-hover:to-violet-400',
      container: isCurrent ? 'border-indigo-400/80 shadow-[0_0_15px_rgba(129,140,248,0.5)] z-10' : 'border-zinc-800/80 group-hover:border-indigo-500/50 group-hover:shadow-[0_0_10px_rgba(129,140,248,0.2)]',
      text: isCurrent ? 'text-indigo-400 drop-shadow-[0_0_5px_rgba(129,140,248,0.8)] font-bold underline underline-offset-4 decoration-indigo-500/50' : 'text-zinc-500 group-hover:text-indigo-400 font-bold transition-colors',
      scoreText: 'text-[10px] font-black text-zinc-500 mb-1 group-hover:text-indigo-400 group-hover:drop-shadow-[0_0_5px_rgba(129,140,248,0.8)] transition-all'
    };
  }
  if (score < 88) {
    return {
      bar: isCurrent ? 'bg-gradient-to-t from-purple-600 via-fuchsia-400 to-purple-300 shadow-[0_0_15px_rgba(192,132,252,0.6)]' : 'bg-gradient-to-t from-purple-900/80 to-fuchsia-700/80 group-hover:from-purple-600 group-hover:to-fuchsia-400',
      container: isCurrent ? 'border-purple-400/80 shadow-[0_0_15px_rgba(192,132,252,0.5)] z-10' : 'border-zinc-800/80 group-hover:border-purple-500/50 group-hover:shadow-[0_0_10px_rgba(192,132,252,0.2)]',
      text: isCurrent ? 'text-purple-400 drop-shadow-[0_0_5px_rgba(192,132,252,0.8)] font-bold underline underline-offset-4 decoration-purple-500/50' : 'text-zinc-500 group-hover:text-purple-400 font-bold transition-colors',
      scoreText: 'text-[10px] font-black text-zinc-500 mb-1 group-hover:text-purple-400 group-hover:drop-shadow-[0_0_5px_rgba(192,132,252,0.8)] transition-all'
    };
  }
  if (score < 97) {
    return {
      bar: isCurrent ? 'bg-gradient-to-t from-rose-600 via-pink-400 to-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.6)]' : 'bg-gradient-to-t from-rose-900/80 to-pink-700/80 group-hover:from-rose-600 group-hover:to-pink-400',
      container: isCurrent ? 'border-rose-400/80 shadow-[0_0_15px_rgba(244,63,94,0.5)] z-10' : 'border-zinc-800/80 group-hover:border-rose-500/50 group-hover:shadow-[0_0_10px_rgba(244,63,94,0.2)]',
      text: isCurrent ? 'text-rose-400 drop-shadow-[0_0_5px_rgba(244,63,94,0.8)] font-bold underline underline-offset-4 decoration-rose-500/50' : 'text-zinc-500 group-hover:text-rose-400 font-bold transition-colors',
      scoreText: 'text-[10px] font-black text-zinc-500 mb-1 group-hover:text-rose-400 group-hover:drop-shadow-[0_0_5px_rgba(244,63,94,0.8)] transition-all'
    };
  }
  return {
    bar: isCurrent ? 'bg-gradient-to-t from-amber-600 via-orange-400 to-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.6)]' : 'bg-gradient-to-t from-amber-900/80 to-orange-700/80 group-hover:from-amber-600 group-hover:to-orange-400',
    container: isCurrent ? 'border-amber-400/80 shadow-[0_0_15px_rgba(245,158,11,0.5)] z-10' : 'border-zinc-800/80 group-hover:border-amber-500/50 group-hover:shadow-[0_0_10px_rgba(245,158,11,0.2)]',
    text: isCurrent ? 'text-amber-400 drop-shadow-[0_0_5px_rgba(245,158,11,0.8)] font-bold underline underline-offset-4 decoration-amber-500/50' : 'text-zinc-500 group-hover:text-amber-400 font-bold transition-colors',
    scoreText: 'text-[10px] font-black text-zinc-500 mb-1 group-hover:text-amber-400 group-hover:drop-shadow-[0_0_5px_rgba(245,158,11,0.8)] transition-all'
  };
};

export default function PowerLevelChart({ monthlyData, logs }: PowerLevelChartProps) {
  const logsMap = useMemo(() => {
    const map = new Map<string, GymLog>();
    logs.forEach((log) => {
      if (log.hours > 0) {
        map.set(log.date, log);
      }
    });
    return map;
  }, [logs]);

  const monthlyPowerStats = useMemo(() => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonthIndex = today.getMonth();
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const result: MonthlyPowerStat[] = [];

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
        isCurrentMonth: i === 0,
        scoreData,
      });
    }

    return result;
  }, [logsMap]);

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
      <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.6)] space-y-6 relative overflow-hidden">

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-4 border-b border-zinc-800">
          <div className="w-full">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-2 rotate-45 bg-indigo-400 shadow-[0_0_8px_#818cf8]" />
              <h2 className="text-sm font-black text-indigo-400 uppercase tracking-[0.2em] drop-shadow-[0_0_8px_rgba(129,140,248,0.5)] flex items-center gap-2">
                <Swords className="w-4 h-4 text-indigo-400" />
                <span>Power Levels</span>
              </h2>
              <div className="h-[1px] flex-1 bg-gradient-to-r from-indigo-500/30 to-transparent ml-2" />
            </div>

            <p className="text-[11px] text-zinc-400 mt-2 font-medium tracking-wide">
              Sci-scored (0-100) based on consistency, duration quality &amp; split balance. Hover over bars to view Anime Tiers.
            </p>
          </div>

          {/* Cleanly imported component replacing all the previous dialog logic */}
          <PowerScoreGuideModal />
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 pt-4">

          <div className="w-full lg:w-1/3 flex flex-col gap-6">
            <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest text-center border-b border-zinc-800 pb-3">
              Weekly Progress
            </h4>

            <div className="h-64 flex items-end justify-between gap-2 px-2">
              {weeklyPowerStats.map((w, idx) => {
                const score = w.scoreData.totalScore;
                const heightPercent = Math.max(6, score);
                const char = w.scoreData.character;
                const theme = getPowerColorTheme(score, w.isCurrentWeek);

                return (
                  <div key={`${w.weekLabel}-${idx}`} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                    <Tooltip key={`${w.weekLabel}-${idx}`}>
                      <TooltipTrigger asChild>
                        <div className="w-full flex flex-col items-center cursor-pointer relative z-10">
                          {char && (
                            <div
                              style={{ bottom: `calc(${heightPercent}% * 0.76 + 16px)` }}
                              className="absolute w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center overflow-hidden transition-all duration-300 z-20 group-hover:scale-125"
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={char.image} alt={char.name} className="w-full h-full object-contain group-hover:border-white/50 transition-colors" />
                            </div>
                          )}
                          <span className={theme.scoreText}>
                            {score}
                          </span>

                          <div
                            className={`w-full max-w-[36px] bg-zinc-900/60 rounded-t-lg overflow-hidden flex flex-col justify-end h-36 p-0.5 border transition-all duration-300 relative ${theme.container}`}
                          >
                            <div
                              style={{ height: `${heightPercent}%` }}
                              className={`w-full rounded-t transition-all duration-500 ${theme.bar}`}
                            />
                          </div>
                          <span className={`text-[9px] uppercase tracking-wider mt-2.5 truncate max-w-[40px] text-center ${theme.text}`}>
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

          <div className="hidden lg:block w-px bg-zinc-800/50" />

          <div className="w-full lg:w-2/3 flex flex-col gap-6">
            <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest text-center border-b border-zinc-800 pb-3">
              Last 12 Months
            </h4>

            <div className="h-64 flex items-end justify-between gap-1.5 px-2">
              {monthlyPowerStats.map((m, idx) => {
                const score = m.scoreData.totalScore;
                const heightPercent = Math.max(6, score);
                const char = m.scoreData.character;
                const compositeKey = `${m.year}-${m.monthIndex}-${idx}`;
                const theme = getPowerColorTheme(score, m.isCurrentMonth);

                return (
                  <div key={compositeKey} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                    <Tooltip key={compositeKey}>
                      <TooltipTrigger asChild>
                        <div className="w-full flex flex-col items-center cursor-pointer relative z-10">
                          {char && (
                            <div
                              style={{ bottom: `calc(${heightPercent}% * 0.76 + 16px)` }}
                              className="absolute w-7 h-7 sm:w-10 sm:h-10 flex items-center justify-center overflow-hidden transition-all duration-300 z-20 group-hover:scale-125"
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={char.image} alt={char.name} className="w-full h-full object-contain" />
                            </div>
                          )}
                          <span className={theme.scoreText}>
                            {score}
                          </span>

                          <div
                            className={`w-full max-w-[36px] bg-zinc-900/60 rounded-t-lg overflow-hidden flex flex-col justify-end h-36 p-0.5 border transition-all duration-300 relative ${theme.container}`}
                          >
                            <div
                              style={{ height: `${heightPercent}%` }}
                              className={`w-full rounded-t transition-all duration-500 ${theme.bar}`}
                            />
                          </div>
                          <span className={`text-[9px] uppercase tracking-widest mt-2.5 ${theme.text}`}>
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