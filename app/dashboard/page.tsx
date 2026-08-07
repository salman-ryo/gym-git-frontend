'use client';

import AuthGuard from '@/components/AuthGuard';
import ContributionGraph from '@/components/ContributionGraph';
import CyberpunkLoader from '@/components/CyberpunkLoader';
import DailyCheckInModal from '@/components/DailyCheckInModal';
import EditLogModal from '@/components/EditLogModal';
import FilterBar from '@/components/FilterBar';
import Header from '@/components/Header';
import StatsOverview from '@/components/StatsOverview';
import WeeklyPlanModal from '@/components/WeeklyPlanModal';
import { useAuth } from '@/lib/auth-context';
import { formatDateKey } from '@/lib/scientific-streak';
import {
  deleteGymLog,
  fetchDashboardStats,
  fetchGymLogs,
  saveGymLog,
} from '@/lib/gym-service';
import { GymLog, Stats, WeeklyPlan, WorkoutType } from '@/lib/types';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PowerLevelChart from '@/components/PowerLevelChart';
import Footer from '@/components/Footer';

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

  // Fetch all logs & stats from Go backend API
  const refreshData = useCallback(async () => {
    try {
      const fetchedLogs = await fetchGymLogs();
      const fetchedStats = await fetchDashboardStats(user?.weeklyPlan);
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

  // Check if we need to force plan selection (onboarding)
  const needsPlanSelection = !!(user && !user.weeklyPlan);

  useEffect(() => {
    async function initDashboard() {
      const currentLogs = await refreshData();
      const todayStr = formatDateKey(new Date());
      setTodayDateStr(todayStr);

      if (needsPlanSelection) {
        setShowPlanModal(true);
        setShowDailyCheckIn(false);
      } else {
        const hasTodayLog = currentLogs.some((l) => l.date === todayStr);

        if (!hasTodayLog) {
          setShowDailyCheckIn(true);
        }
      }
    }
    if (user) {
      initDashboard();
    }
  }, [refreshData, user, needsPlanSelection]);

  // Handle Daily Check-in Yes
  const handleDailyCheckInYes = async (
    hours: number,
    workoutType: WorkoutType,
    notes?: string
  ) => {
    await saveGymLog(todayDateStr, hours, workoutType, notes);
    setShowDailyCheckIn(false);
    await refreshData();
  };

  // Handle Daily Check-in No (Rest day)
  const handleDailyCheckInNo = async () => {
    await saveGymLog(todayDateStr, 0, 'Rest');
    setShowDailyCheckIn(false);
    await refreshData();
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
    await saveGymLog(dateStr, hours, workoutType, notes);
    await refreshData();
  };

  // Delete Tile Entry
  const handleDeleteEdit = async (dateStr: string) => {
    await deleteGymLog(dateStr);
    await refreshData();
  };

  // Save Weekly Plan
  const handleSavePlan = async (plan: WeeklyPlan) => {
    await updateUserPlan(plan);
    setShowPlanModal(false);
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
        {/* Navigation Header */}
        <Header currentStreak={stats?.currentStreak || 0} />

        {/* Dashboard Main Content */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
          {loading ? (
            // Reusable Component inside the main container
            <CyberpunkLoader text="Summoning your stats" />
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
                <PowerLevelChart monthlyData={stats.monthlyData} logs={logs} />
              )}
            </>
          )}
        </main>

        <Footer />

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
          isOpen={showPlanModal || needsPlanSelection}
          onClose={() => setShowPlanModal(false)}
          onSavePlan={handleSavePlan}
          preventClose={needsPlanSelection}
        />
      </div>
    </AuthGuard>
  );
}
