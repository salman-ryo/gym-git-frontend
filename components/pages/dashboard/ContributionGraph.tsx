'use client';

import { GymLog, TimeframeView, WeeklyPlan, WorkoutType } from '@/lib/types';
import { formatDateKey } from '@/lib/scientific-streak';
import React, { useMemo, useState } from 'react';
import ContributionGraphHeader from '@/components/contribution-graph/ContributionGraphHeader';
import YearView from '@/components/contribution-graph/YearView';
import MonthView from '@/components/contribution-graph/MonthView';
import WeekView from '@/components/contribution-graph/WeekView';
import { DayTile, WeekColumn } from '@/components/contribution-graph/theme-utils';

interface ContributionGraphProps {
  logs: GymLog[];
  activeFilter: WorkoutType | 'All';
  onTileClick: (dateStr: string, log?: GymLog) => void;
  weeklyPlan?: WeeklyPlan;
}

export default function ContributionGraph({
  logs,
  activeFilter,
  onTileClick,
  weeklyPlan,
}: ContributionGraphProps) {
  const [timeframe, setTimeframe] = useState<TimeframeView>('year');

  const logMap = useMemo(() => {
    const map = new Map<string, GymLog>();
    logs.forEach((log) => {
      map.set(log.date, log);
    });
    return map;
  }, [logs]);

  // 1. YEAR VIEW DATA
  const yearData = useMemo(() => {
    const todayObj = new Date();
    todayObj.setHours(0, 0, 0, 0);
    const todayStr = formatDateKey(todayObj);

    const resultWeeks: WeekColumn[] = [];
    const months: { name: string; weekIndex: number }[] = [];

    const todayDayOfWeek = todayObj.getDay();
    const endDate = new Date(todayObj); // Starts at midnight today
    const startDate = new Date(todayObj);
    startDate.setDate(startDate.getDate() - 364 - todayDayOfWeek);
    startDate.setHours(0, 0, 0, 0); // Ensure midnight boundary

    const currentDate = new Date(startDate);
    let currentWeekIndex = 0;
    let currentWeekDays: DayTile[] = [];
    let lastMonth = -1;

    let yearWorkouts = 0;
    let yearHours = 0;

    while (currentDate <= endDate) {
      const dateStr = formatDateKey(currentDate);
      const log = logMap.get(dateStr);
      const hours = log ? log.hours : 0;

      if (hours > 0) {
        yearWorkouts++;
        yearHours += hours;
      }

      const dayTile: DayTile = {
        dateStr,
        dateObj: new Date(currentDate),
        log,
        hours,
        workoutType: log?.workoutType,
        isToday: dateStr === todayStr,
        isFuture: currentDate > todayObj,
      };

      currentWeekDays.push(dayTile);

      const m = currentDate.getMonth();
      if (m !== lastMonth) {
        months.push({
          name: currentDate.toLocaleDateString('en-US', { month: 'short' }),
          weekIndex: currentWeekIndex,
        });
        lastMonth = m;
      }

      if (currentWeekDays.length === 7) {
        resultWeeks.push({
          weekIndex: currentWeekIndex,
          days: currentWeekDays,
        });
        currentWeekDays = [];
        currentWeekIndex++;
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    if (currentWeekDays.length > 0) {
      resultWeeks.push({
        weekIndex: currentWeekIndex,
        days: currentWeekDays,
      });
    }

    return {
      weeks: resultWeeks,
      monthLabels: months,
      totalWorkouts: yearWorkouts,
      totalHours: Number(yearHours.toFixed(1)),
    };
  }, [logMap]);

  // 2. MONTH VIEW DATA (Strictly Current Real Calendar Month)
  const monthData = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = formatDateKey(today);

    const year = today.getFullYear();
    const month = today.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const startPadding = firstDayOfMonth.getDay();

    const lastDayOfMonth = new Date(year, month + 1, 0);
    const totalDays = lastDayOfMonth.getDate();

    const days: DayTile[] = [];
    let mWorkouts = 0;
    let mHours = 0;

    for (let d = 1; d <= totalDays; d++) {
      const dateObj = new Date(year, month, d);
      const dateStr = formatDateKey(dateObj);
      const log = logMap.get(dateStr);
      const hours = log ? log.hours : 0;

      if (hours > 0) {
        mWorkouts++;
        mHours += hours;
      }

      days.push({
        dateStr,
        dateObj,
        log,
        hours,
        workoutType: log?.workoutType,
        dayOfMonth: d,
        isToday: dateStr === todayStr,
        isFuture: dateObj > today,
      });
    }

    return {
      startPadding,
      days,
      totalWorkouts: mWorkouts,
      totalHours: Number(mHours.toFixed(1)),
      monthName: today.toLocaleDateString('en-US', { month: 'long' }),
      year,
    };
  }, [logMap]);

  // 3. WEEK VIEW DATA (Strictly Current Real Calendar Week: Sun to Sat)
  const weekData = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = formatDateKey(today);

    const dayOfWeek = today.getDay();
    const sunday = new Date(today);
    sunday.setDate(today.getDate() - dayOfWeek);

    const days: DayTile[] = [];
    let wWorkouts = 0;
    let wHours = 0;

    for (let i = 0; i < 7; i++) {
      const dateObj = new Date(sunday);
      dateObj.setDate(sunday.getDate() + i);
      const dateStr = formatDateKey(dateObj);
      const log = logMap.get(dateStr);
      const hours = log ? log.hours : 0;

      if (hours > 0) {
        wWorkouts++;
        wHours += hours;
      }

      days.push({
        dateStr,
        dateObj: dateObj,
        log,
        hours,
        workoutType: log?.workoutType,
        isToday: dateStr === todayStr,
        isFuture: dateObj > today,
      });
    }

    return {
      days: days,
      totalWorkouts: wWorkouts,
      totalHours: Number(wHours.toFixed(1)),
    };
  }, [logMap]);

  return (
    <div className="bg-zinc-950/80 border border-zinc-800 p-6 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.6)] relative overflow-hidden">
      <ContributionGraphHeader
        timeframe={timeframe}
        setTimeframe={setTimeframe}
        yearData={yearData}
        monthData={monthData}
        weekData={weekData}
      />

      {timeframe === 'year' && (
        <YearView
          weeks={yearData.weeks}
          monthLabels={yearData.monthLabels}
          activeFilter={activeFilter}
          onTileClick={onTileClick}
        />
      )}

      {timeframe === 'month' && (
        <MonthView
          startPadding={monthData.startPadding}
          days={monthData.days}
          activeFilter={activeFilter}
          onTileClick={onTileClick}
          weeklyPlan={weeklyPlan}
        />
      )}

      {timeframe === 'week' && (
        <WeekView
          days={weekData.days}
          activeFilter={activeFilter}
          onTileClick={onTileClick}
          weeklyPlan={weeklyPlan}
        />
      )}
    </div>
  );
}