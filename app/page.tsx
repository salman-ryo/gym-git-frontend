'use client';

import AuthGuard from '@/components/AuthGuard';
import ContributionGraph from '@/components/ContributionGraph';
import DailyCheckInModal from '@/components/DailyCheckInModal';
import EditLogModal from '@/components/EditLogModal';
import FilterBar from '@/components/FilterBar';
import Header from '@/components/Header';
import MonthlyBarChart from '@/components/MonthlyBarChart';
import StatsOverview from '@/components/StatsOverview';
import WeeklyPlanModal from '@/components/WeeklyPlanModal';
import { useAuth } from '@/lib/auth-context';
import {
  formatDateKey,
  mockDeleteLog,
  mockGetLogs,
  mockGetStats,
  mockResetData,
  mockSaveLog,
} from '@/lib/api-mock';
import { GymLog, Stats, WeeklyPlan, WorkoutType } from '@/lib/types';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

export default function DashboardPage() {
  const { user, updateUserPlan } = useAuth();

  const [logs, setLogs] = useState<GymLog[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Filter state
  const [activeFilter, setActiveFilter] = useState<WorkoutType | 'All'>('All');

  // Modals state
  const [showDailyCheckIn, setShowDailyCheckIn] = useState<boolean>(false);
  const [showPlanModal, setShowPlanModal] = useState<boolean>(false);
  const [todayDateStr, setTodayDateStr] = useState<string>('');

  // Historical Tile Edit Modal state
  const [editTileDate, setEditTileDate] = useState<string | null>(null);
  const [editTileLog, setEditTileLog] = useState<GymLog | undefined>(undefined);

  // Extract all workout types present across historical logs to preserve data queryability
  const availableHistoricalTypes = useMemo(() => {
    const types = new Set<string>();
    logs.forEach((l) => {
      if (l.workoutType) types.add(l.workoutType);
    });
    return Array.from(types);
  }, [logs]);

  // Fetch all logs & stats
  const refreshData = useCallback(async () => {
    try {
      const fetchedLogs = await mockGetLogs();
      const fetchedStats = await mockGetStats(user?.weeklyPlan);
      setLogs(fetchedLogs);
      setStats(fetchedStats);
      return fetchedLogs;
    } catch (err) {
      console.error('Failed to load dashboard data', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, [user?.weeklyPlan]);

  useEffect(() => {
    async function initDashboard() {
      const currentLogs = await refreshData();
      const todayStr = formatDateKey(new Date());
      setTodayDateStr(todayStr);

      const hasTodayLog = currentLogs.some((l) => l.date === todayStr);
      const dismissedToday = sessionStorage.getItem(`gym_git_dismissed_${todayStr}`);

      if (!hasTodayLog && !dismissedToday) {
        setShowDailyCheckIn(true);
      }
    }
    initDashboard();
  }, [refreshData]);

  // Handle Daily Check-in Yes
  const handleDailyCheckInYes = async (
    hours: number,
    workoutType: WorkoutType,
    notes?: string
  ) => {
    await mockSaveLog(todayDateStr, hours, workoutType, notes);
    setShowDailyCheckIn(false);
    sessionStorage.setItem(`gym_git_dismissed_${todayDateStr}`, 'true');
    await refreshData();
  };

  // Handle Daily Check-in No (Rest day)
  const handleDailyCheckInNo = () => {
    setShowDailyCheckIn(false);
    sessionStorage.setItem(`gym_git_dismissed_${todayDateStr}`, 'true');
  };

  // Tile Click from Contribution Graph
  const handleTileClick = (dateStr: string, log?: GymLog) => {
    setEditTileDate(dateStr);
    setEditTileLog(log);
  };

  // Save Tile Edit
  const handleSaveEdit = async (
    dateStr: string,
    hours: number,
    workoutType: WorkoutType,
    notes?: string
  ) => {
    await mockSaveLog(dateStr, hours, workoutType, notes);
    await refreshData();
  };

  // Delete Tile Entry
  const handleDeleteEdit = async (dateStr: string) => {
    await mockDeleteLog(dateStr);
    await refreshData();
  };

  // Reset Demo Data
  const handleResetData = async () => {
    await mockResetData();
    await refreshData();
  };

  // Save Weekly Plan
  const handleSavePlan = async (plan: WeeklyPlan) => {
    await updateUserPlan(plan);
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
        {/* Navigation Header */}
        <Header
          currentStreak={stats?.currentStreak || 0}
          onResetData={handleResetData}
        />

        {/* Dashboard Main Content */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
          {loading ? (
            <div className="flex items-center justify-center py-20 text-zinc-500 animate-pulse text-sm">
              Syncing gym logs from localStorage...
            </div>
          ) : (
            <>
              {/* Analytics & Streaks Overview */}
              <StatsOverview stats={stats} />

              {/* Dynamic Workout Filter Controls */}
              <FilterBar
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
                weeklyPlan={user?.weeklyPlan}
                onOpenPlanModal={() => setShowPlanModal(true)}
                availableTypes={availableHistoricalTypes}
              />

              {/* Flexible Contribution Graph (Year / Month / Week views) */}
              <ContributionGraph
                logs={logs}
                activeFilter={activeFilter}
                onTileClick={handleTileClick}
              />

              {/* Monthly Attendance Bar Chart */}
              {stats?.monthlyData && (
                <MonthlyBarChart monthlyData={stats.monthlyData} logs={logs} />
              )}
            </>
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-zinc-900 py-6 text-center text-xs text-zinc-600">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>Gym-Git &copy; {new Date().getFullYear()} — Dynamic Workout Planning</span>
            <span className="text-zinc-500">Built with Next.js, Tailwind CSS &amp; TypeScript</span>
          </div>
        </footer>

        {/* Modals */}
        <DailyCheckInModal
          dateStr={todayDateStr}
          isOpen={showDailyCheckIn}
          onCheckInYes={handleDailyCheckInYes}
          onCheckInNo={handleDailyCheckInNo}
          availableWorkoutTypes={user?.weeklyPlan?.categories}
        />

        <EditLogModal
          dateStr={editTileDate}
          existingLog={editTileLog}
          isOpen={!!editTileDate}
          onClose={() => setEditTileDate(null)}
          onSave={handleSaveEdit}
          onDelete={handleDeleteEdit}
          availableWorkoutTypes={user?.weeklyPlan?.categories}
        />

        <WeeklyPlanModal
          currentPlan={user?.weeklyPlan}
          isOpen={showPlanModal}
          onClose={() => setShowPlanModal(false)}
          onSavePlan={handleSavePlan}
        />
      </div>
    </AuthGuard>
  );
}
