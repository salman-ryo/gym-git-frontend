'use client';

import { GymLog, TimeframeView, WorkoutType } from '@/lib/types';
import { formatDateKey } from '@/lib/scientific-streak';
import React, { useMemo, useState } from 'react';
import Header from './contribution-graph/Header';
import YearView from './contribution-graph/YearView';
import MonthView from './contribution-graph/MonthView';
import WeekView from './contribution-graph/WeekView';
import { DayTile, WeekColumn } from './contribution-graph/theme-utils';

interface ContributionGraphProps {
  logs: GymLog[];
  activeFilter: WorkoutType | 'All';
  onTileClick: (dateStr: string, log?: GymLog) => void;
}

export default function ContributionGraph({
  logs,
  activeFilter,
  onTileClick,
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
    const todayStr = formatDateKey(todayObj);
    todayObj.setHours(0, 0, 0, 0);

    const resultWeeks: WeekColumn[] = [];
    const months: { name: string; weekIndex: number }[] = [];

    const todayDayOfWeek = new Date().getDay();
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 364 - todayDayOfWeek);

    let currentDate = new Date(startDate);
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

      const monthIndex = currentDate.getMonth();
      if (monthIndex !== lastMonth) {
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        if (months.length > 0) {
          const lastAdded = months[months.length - 1];
          if (currentWeekIndex - lastAdded.weekIndex < 3) {
            if (lastAdded.weekIndex === 0) {
              months.pop();
            }
          }
        }

        if (months.length === 0 || currentWeekIndex - months[months.length - 1].weekIndex >= 3) {
          months.push({ name: monthNames[monthIndex], weekIndex: currentWeekIndex });
        }

        lastMonth = monthIndex;
      }

      const tileTime = new Date(currentDate);
      tileTime.setHours(0, 0, 0, 0);

      currentWeekDays.push({
        dateStr,
        dateObj: new Date(currentDate),
        log,
        hours,
        workoutType: log?.workoutType,
        isToday: dateStr === todayStr,
        isFuture: tileTime.getTime() > todayObj.getTime(),
      });

      if (currentWeekDays.length === 7) {
        resultWeeks.push({
          weekIndex: currentWeekIndex,
          days: currentWeekDays,
        });
        currentWeekIndex++;
        currentWeekDays = [];
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

  // 2. MONTH VIEW DATA
  const monthData = useMemo(() => {
    const todayObj = new Date();
    const todayStr = formatDateKey(todayObj);
    todayObj.setHours(0, 0, 0, 0);

    const year = todayObj.getFullYear();
    const month = todayObj.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const monthDays: DayTile[] = [];
    let monthWorkouts = 0;
    let monthHours = 0;

    const startPadding = firstDay.getDay();

    let d = new Date(firstDay);
    while (d <= lastDay) {
      const dateStr = formatDateKey(d);
      const log = logMap.get(dateStr);
      const hours = log ? log.hours : 0;

      if (hours > 0) {
        monthWorkouts++;
        monthHours += hours;
      }

      const tileTime = new Date(d);
      tileTime.setHours(0, 0, 0, 0);

      monthDays.push({
        dateStr,
        dateObj: new Date(d),
        log,
        hours,
        workoutType: log?.workoutType,
        dayOfMonth: d.getDate(),
        isToday: dateStr === todayStr,
        isFuture: tileTime.getTime() > todayObj.getTime(),
      });
      d.setDate(d.getDate() + 1);
    }

    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    return {
      monthName: monthNames[month],
      year,
      startPadding,
      days: monthDays,
      totalWorkouts: monthWorkouts,
      totalHours: Number(monthHours.toFixed(1)),
    };
  }, [logMap]);

  // 3. WEEK VIEW DATA
  const weekData = useMemo(() => {
    const todayObj = new Date();
    const todayStr = formatDateKey(todayObj);
    todayObj.setHours(0, 0, 0, 0);

    const dayOfWeek = todayObj.getDay();
    const distanceToMon = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(todayObj);
    monday.setDate(todayObj.getDate() + distanceToMon);

    const weekDays: DayTile[] = [];
    let weekWorkouts = 0;
    let weekHours = 0;

    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const dateStr = formatDateKey(d);
      const log = logMap.get(dateStr);
      const hours = log ? log.hours : 0;

      if (hours > 0) {
        weekWorkouts++;
        weekHours += hours;
      }

      const tileTime = new Date(d);
      tileTime.setHours(0, 0, 0, 0);

      weekDays.push({
        dateStr,
        dateObj: d,
        log,
        hours,
        workoutType: log?.workoutType,
        isToday: dateStr === todayStr,
        isFuture: tileTime.getTime() > todayObj.getTime(),
      });
    }

    return {
      days: weekDays,
      totalWorkouts: weekWorkouts,
      totalHours: Number(weekHours.toFixed(1)),
    };
  }, [logMap]);

  return (
    <div className="bg-zinc-950/80 border border-zinc-800 p-6 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.6)] relative overflow-hidden">
      <Header
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
        />
      )}

      {timeframe === 'week' && (
        <WeekView
          days={weekData.days}
          activeFilter={activeFilter}
          onTileClick={onTileClick}
        />
      )}
    </div>
  );
}