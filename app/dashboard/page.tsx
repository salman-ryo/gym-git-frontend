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
import {
  generate365MockLogs,
  generateMockStats,
  seedMockLogsToBackend,
} from '@/lib/mock-data-generator';
import { enable_mock_data, auto_load_mock_on_startup } from '@/lib/flags';
import { GymLog, Stats, WeeklyPlan, WorkoutType } from '@/lib/types';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PowerLevelChart from '@/components/PowerLevelChart';
import Footer from '@/components/layout/Footer';
import { LandingBackground } from '@/components/pages/landing';
import { Sparkles, Database, RotateCcw, Check, Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const { user, updateUserPlan } = useAuth();

  const [logs, setLogs] = useState<GymLog[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isMockActive, setIsMockActive] = useState<boolean>(false);
  const [isSeeding, setIsSeeding] = useState<boolean>(false);
  const [seedProgress, setSeedProgress] = useState<string>('');

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

  // Activate 365-day mock data with workout durations < 2 hours
  const activateMockData = useCallback(() => {
    const mockLogs = generate365MockLogs(365);
    const mockStats = generateMockStats(mockLogs, user?.weeklyPlan);
    setLogs(mockLogs);
    setStats(mockStats);
    setIsMockActive(true);
    setLoading(false);
  }, [user?.weeklyPlan]);

  // Reset back to real live data from backend
  const resetToRealData = useCallback(async () => {
    setIsMockActive(false);
    setLoading(true);
    await refreshData();
  }, [refreshData]);

  // Seed all 365 days of mock logs to backend database
  const handleSeedToBackend = async () => {
    setIsSeeding(true);
    setSeedProgress('0%');
    try {
      await seedMockLogsToBackend((current, total) => {
        const pct = Math.round((current / total) * 100);
        setSeedProgress(`${pct}% (${current}/${total})`);
      });
      setSeedProgress('Saved!');
      setTimeout(() => setSeedProgress(''), 3000);
      await refreshData();
    } catch (err) {
      console.error('Failed to seed mock logs', err);
      setSeedProgress('Error seeding');
    } finally {
      setIsSeeding(false);
    }
  };

  // Check if we need to force plan selection (onboarding)
  const needsPlanSelection = !!(user && !user.weeklyPlan);

  useEffect(() => {
    async function initDashboard() {
      // Solely controlled by lib/flags.ts
      if (enable_mock_data && auto_load_mock_on_startup) {
        activateMockData();
        return;
      }

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
  }, [refreshData, user, needsPlanSelection, activateMockData]);

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
      <div className="min-h-screen bg-[#060a0e] text-[#fafafa] flex flex-col font-sans relative overflow-hidden selection:bg-neon-green/20 selection:text-neon-green">
        {/* ── Animated Cyberpunk Background from Landing Page ── */}
        <LandingBackground />

        <div className="relative z-10 flex flex-col min-h-screen">
          {/* Navigation Header */}
          <Header currentStreak={stats?.currentStreak || 0} />

          {/* Dashboard Main Content */}
          <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
            {/* Floating Testing Toolbar for 365-day screenshot — conditionally rendered when enable_mock_data is true */}
            {enable_mock_data && (
              <div className="bg-zinc-900/90 border border-neon-green/30 backdrop-blur-md rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-[0_0_25px_rgba(0,255,136,0.08)]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-neon-green/10 border border-neon-green/30 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-neon-green" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-zinc-100 flex items-center gap-2 m-0">
                      <span>365-Day Mock Testing Suite</span>
                      {isMockActive && (
                        <span className="px-2 py-0.5 rounded-full bg-neon-green/10 border border-neon-green/30 text-[10px] font-extrabold text-neon-green">
                          ACTIVE PREVIEW
                        </span>
                      )}
                    </p>
                    <p className="text-[11px] text-zinc-400 m-0">
                      {isMockActive
                        ? 'Populated ~300 workout sessions (all < 2 hours) across 365 days'
                        : 'Toggle 365-day colored preview for screenshots or seed to database'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 flex-wrap">
                  {!isMockActive ? (
                    <button
                      type="button"
                      onClick={activateMockData}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-neon-green to-[#00e077] text-[#060a0e] text-xs font-extrabold shadow-[0_0_20px_rgba(0,255,136,0.35)] hover:scale-[1.02] active:scale-100 transition-all cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Fill 365-Day Graph (&lt;2h)</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={resetToRealData}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold border border-zinc-700 transition-all cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Reset Real Data</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleSeedToBackend}
                    disabled={isSeeding}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-300 hover:text-white text-xs font-semibold border border-zinc-700/80 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isSeeding ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 text-neon-green animate-spin" />
                        <span>{seedProgress || 'Seeding...'}</span>
                      </>
                    ) : (
                      <>
                        <Database className="w-3.5 h-3.5 text-neon-cyan" />
                        <span>Save to Backend DB</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

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
                />

                {/* Flexible Contribution Graph (Year / Month / Week views) */}
                <ContributionGraph
                  logs={logs}
                  activeFilter={activeFilter}
                  onTileClick={handleTileClick}
                  weeklyPlan={user?.weeklyPlan}
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
      </div>
    </AuthGuard>
  );
}
