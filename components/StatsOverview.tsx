'use client';

import { Stats } from '@/lib/types';
import React from 'react';
import { Flame, Trophy, CalendarCheck, Clock, Award } from 'lucide-react';

interface StatsOverviewProps {
  stats: Stats | null;
}

export default function StatsOverview({ stats }: StatsOverviewProps) {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Current Streak */}
      <div className="bg-zinc-900/80 border border-zinc-800 p-5 rounded-2xl relative overflow-hidden group hover:border-amber-500/50 transition-all">
        <div className="absolute top-0 right-0 p-4 text-amber-500/10 group-hover:text-amber-500/20 transition-colors">
          <Flame className="w-16 h-16 stroke-1" />
        </div>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
            <Flame className="w-5 h-5 animate-pulse" />
          </div>
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            Current Streak
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-zinc-100">
            {stats.currentStreak}
          </span>
          <span className="text-sm font-medium text-amber-400">Days</span>
        </div>
        <p className="text-[11px] text-zinc-500 mt-1">Keep the flame alive today!</p>
      </div>

      {/* Longest Streak */}
      <div className="bg-zinc-900/80 border border-zinc-800 p-5 rounded-2xl relative overflow-hidden group hover:border-emerald-500/50 transition-all">
        <div className="absolute top-0 right-0 p-4 text-emerald-500/10 group-hover:text-emerald-500/20 transition-colors">
          <Trophy className="w-16 h-16 stroke-1" />
        </div>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
            <Trophy className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            Longest Streak
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-zinc-100">
            {stats.longestStreak}
          </span>
          <span className="text-sm font-medium text-emerald-400">Days Record</span>
        </div>
        <p className="text-[11px] text-zinc-500 mt-1">Personal best sequence</p>
      </div>

      {/* Total Gym Days */}
      <div className="bg-zinc-900/80 border border-zinc-800 p-5 rounded-2xl relative overflow-hidden group hover:border-teal-500/50 transition-all">
        <div className="absolute top-0 right-0 p-4 text-teal-500/10 group-hover:text-teal-500/20 transition-colors">
          <CalendarCheck className="w-16 h-16 stroke-1" />
        </div>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 bg-teal-500/10 border border-teal-500/30 rounded-xl text-teal-400">
            <CalendarCheck className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            Total Sessions
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-zinc-100">
            {stats.totalDays}
          </span>
          <span className="text-sm font-medium text-teal-400">Workouts</span>
        </div>
        <p className="text-[11px] text-zinc-500 mt-1">Active gym days logged</p>
      </div>

      {/* Total & Avg Hours */}
      <div className="bg-zinc-900/80 border border-zinc-800 p-5 rounded-2xl relative overflow-hidden group hover:border-sky-500/50 transition-all">
        <div className="absolute top-0 right-0 p-4 text-sky-500/10 group-hover:text-sky-500/20 transition-colors">
          <Clock className="w-16 h-16 stroke-1" />
        </div>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 bg-sky-500/10 border border-sky-500/30 rounded-xl text-sky-400">
            <Clock className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            Hours Invested
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-zinc-100">
            {stats.totalHours}
          </span>
          <span className="text-sm font-medium text-sky-400">hrs</span>
        </div>
        <p className="text-[11px] text-zinc-500 mt-1">
          ~{stats.averageHoursPerSession}h avg per workout
        </p>
      </div>
    </div>
  );
}
