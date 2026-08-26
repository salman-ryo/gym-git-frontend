'use client';

import { GymLog, MonthlyStat } from '@/lib/types';
import { formatDateKey } from '@/lib/scientific-streak';
import { calculateScientificPowerScore } from '@/lib/scientific-power';
import React, { useMemo, memo } from 'react';
import { Swords } from 'lucide-react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { PowerScoreGuideModal } from '@/components/pages/dashboard/modals';
import WeeklyProgress from './power-level/WeeklyProgress';
import MonthlyProgress from './power-level/MonthlyProgress';
import { MonthlyPowerStat, WeeklyPowerStat } from './power-level/power-chart-utils';

interface PowerLevelChartProps {
  monthlyData: MonthlyStat[];
  logs: GymLog[];
}

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function PowerLevelChart({ monthlyData, logs }: PowerLevelChartProps) {
  void monthlyData;

  // Pre-bucket logs by "YYYY-M" key in a single pass O(N)
  const logsByYearMonth = useMemo(() => {
    const map = new Map<string, GymLog[]>();
    logs.forEach((log) => {
      if (log.hours > 0 && log.date) {
        const [y, m] = log.date.split('-').map(Number);
        const key = `${y}-${m}`;
        const existing = map.get(key);
        if (existing) {
          existing.push(log);
        } else {
          map.set(key, [log]);
        }
      }
    });
    return map;
  }, [logs]);

  const monthlyPowerStats = useMemo(() => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonthIndex = today.getMonth();

    const result: MonthlyPowerStat[] = [];

    for (let i = 11; i >= 0; i--) {
      const targetDate = new Date(currentYear, currentMonthIndex - i, 1);
      const targetYear = targetDate.getFullYear();
      const targetMonthIndex = targetDate.getMonth();
      const daysInMonth = new Date(targetYear, targetMonthIndex + 1, 0).getDate();

      const key = `${targetYear}-${targetMonthIndex + 1}`;
      const monthLogs = logsByYearMonth.get(key) || [];

      let count = 0;
      let totalHours = 0;
      monthLogs.forEach((log) => {
        count++;
        totalHours += log.hours;
      });

      const scoreData = calculateScientificPowerScore(monthLogs, daysInMonth, 4);

      result.push({
        month: MONTH_NAMES[targetMonthIndex],
        monthIndex: targetMonthIndex,
        year: targetYear,
        count,
        totalHours: Number(totalHours.toFixed(1)),
        isCurrentMonth: i === 0,
        scoreData,
      });
    }

    return result;
  }, [logsByYearMonth]);

  const weeklyPowerStats = useMemo(() => {
    if (!logs || logs.length === 0) return [];

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

    // Filter relevant logs only (current & adjacent months) instead of full history
    const candidateLogs = [
      ...(logsByYearMonth.get(`${currentYear}-${currentMonth}`) || []),
      ...(logsByYearMonth.get(`${currentYear}-${currentMonth + 1}`) || []),
      ...(logsByYearMonth.get(`${currentYear}-${currentMonth + 2}`) || []),
    ];

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

      candidateLogs.forEach((log) => {
        if (log.date >= monStr && log.date <= sunStr) {
          weekLogs.push(log);
          count++;
          totalHours += log.hours;
        }
      });

      const weekLabel = `${MONTH_NAMES[mon.getMonth()]} ${mon.getDate()}`;
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
  }, [logs, logsByYearMonth]);

  return (
    <TooltipProvider delayDuration={50}>
      <div className="bg-zinc-950/80 border border-zinc-800 p-3.5 sm:p-6 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.6)] space-y-4 sm:space-y-6 relative overflow-hidden">

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-6 pb-3 sm:pb-4 border-b border-zinc-800">
          <div className="w-full">
            <div className="flex items-center gap-2.5 sm:gap-3 mb-1 sm:mb-2">
              <div className="w-2 h-2 rotate-45 bg-neon-green shadow-[0_0_8px_#00ff88] animate-[badge-pulse_2s_ease-in-out_infinite]" />
              <h2 className="text-xs font-black bg-gradient-to-r from-neon-green via-[#00e077] to-neon-cyan bg-clip-text text-transparent uppercase tracking-[0.2em] sm:tracking-[0.25em] drop-shadow-[0_0_10px_rgba(0,255,136,0.3)] flex items-center gap-2">
                <Swords className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neon-green" />
                <span>Power Levels</span>
              </h2>
              <div className="h-[1px] flex-1 bg-gradient-to-r from-neon-green/30 to-transparent ml-2" />
            </div>

            <p className="text-[10px] sm:text-[11px] text-zinc-400 mt-1 sm:mt-2 font-medium tracking-wide">
              Sci-scored (0-100) based on consistency, duration quality &amp; split balance. Hover/tap bars to view Anime Tiers.
            </p>
          </div>

          <div className="shrink-0">
            <PowerScoreGuideModal />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 pt-2 sm:pt-4">
          <WeeklyProgress weeklyPowerStats={weeklyPowerStats} />

          <div className="hidden lg:block w-px bg-zinc-800/50" />

          <MonthlyProgress monthlyPowerStats={monthlyPowerStats} />
        </div>
      </div>
    </TooltipProvider>
  );
}

export default memo(PowerLevelChart);