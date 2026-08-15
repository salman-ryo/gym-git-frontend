'use client';

import AuthGuard from '@/components/AuthGuard';
import ContributionGraph from '@/components/pages/dashboard/ContributionGraph';
import CyberpunkLoader from '@/components/CyberpunkLoader';
import DailyCheckInModal from '@/components/pages/dashboard/DailyCheckInModal';
import EditLogModal from '@/components/pages/dashboard/EditLogModal';
import FilterBar from '@/components/pages/dashboard/FilterBar';
import Header from '@/components/pages/dashboard/Header';
import StatsOverview from '@/components/pages/dashboard/StatsOverview';
import WeeklyPlanModal from '@/components/pages/dashboard/WeeklyPlanModal';
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
import { GymLog, Stats, WeeklyPlan, WorkoutType, UserInventoryItem, ActiveItemEffect, RoadmapMilestone } from '@/lib/types';
import { fetchUserInventory, consumeInventoryItem } from '@/lib/inventory-service';
import InventoryDrawer from '@/components/inventory/InventoryDrawer';
import ActiveEffectsBar from '@/components/inventory/ActiveEffectsBar';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PowerLevelChart from '@/components/pages/dashboard/PowerLevelChart';
import Footer from '@/components/layout/Footer';
import { LandingBackground } from '@/components/pages/landing';
import { Sparkles, Database, RotateCcw, Check, Loader2, Snowflake, AlertTriangle, ShieldAlert } from 'lucide-react';
import FreezeModal from '@/components/pages/dashboard/FreezeModal';
import FrozenStateBanner from '@/components/pages/dashboard/FrozenStateBanner';
import RewardRoadmap from '@/components/rewards/RewardRoadmap';
import ClaimCelebrationModal from '@/components/rewards/ClaimCelebrationModal';
import { fetchRewardRoadmap } from '@/lib/rewards-service';
import StreakBrokenModal from '@/components/pages/dashboard/StreakBrokenModal';
import StreakRiskWarningBanner from '@/components/pages/dashboard/StreakRiskWarningBanner';

export default function DashboardPage() {
  const { user, updateUserPlan } = useAuth();

  // Inventory states
  const [inventoryItems, setInventoryItems] = useState<UserInventoryItem[]>([]);
  const [activeEffects, setActiveEffects] = useState<ActiveItemEffect[]>([]);
  const [isInventoryOpen, setIsInventoryOpen] = useState<boolean>(false);

  const availableFreezeTokens = useMemo(() => {
    const item = inventoryItems.find((i) => i.item_details.item_id === 'STREAK_FREEZE_TOKEN');
    return item ? item.quantity : 0;
  }, [inventoryItems]);

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
  const [isFreezeModalOpen, setIsFreezeModalOpen] = useState<boolean>(false);
  const [todayDateStr, setTodayDateStr] = useState<string>('');

  // Historical Tile Edit Modal state
  const [editTileDate, setEditTileDate] = useState<string | null>(null);
  const [editTileLog, setEditTileLog] = useState<GymLog | undefined>(undefined);

  // Phase 5 — Reward Roadmap state
  const [roadmapMilestones, setRoadmapMilestones] = useState<RoadmapMilestone[]>([]);
  const [celebrationDetails, setCelebrationDetails] = useState<{
    itemName: string;
    itemId: string;
    quantity: number;
    rarity: string;
  } | null>(null);

  // Phase 6 — Streak Lifecycle state
  const [hasSeenBrokenModal, setHasSeenBrokenModal] = useState<boolean>(false);

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

      if (user) {
        try {
          const invData = await fetchUserInventory();
          setInventoryItems(invData.inventory || []);
          setActiveEffects(invData.active_effects || []);
        } catch (invErr) {
          console.warn('Failed to load inventory:', invErr);
        }

        try {
          const planId = user.weeklyPlan?.id;
          const roadmap = await fetchRewardRoadmap(planId);
          setRoadmapMilestones(Array.isArray(roadmap) ? roadmap : []);
        } catch (roadmapErr) {
          console.warn('Failed to load reward roadmap:', roadmapErr);
        }
      }
      return fetchedLogs;
    } catch (err) {
      console.error('Failed to load dashboard data', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, [user]);

  const handleUseInventoryItem = async (itemId: string, payload?: Record<string, unknown>) => {
    try {
      const invData = await consumeInventoryItem(itemId, 1, payload);
      setInventoryItems(invData.inventory || []);
      setActiveEffects(invData.active_effects || []);
      await refreshData();
    } catch (err) {
      console.error('Failed to use inventory item:', err);
    }
  };

  const activateMockData = useCallback(() => {
    const mockLogs = generate365MockLogs(365);
    const mockStats = generateMockStats(mockLogs, user?.weeklyPlan) as Stats & {
      mockMilestones?: RoadmapMilestone[];
      mockInventory?: UserInventoryItem[];
      mockActiveEffects?: ActiveItemEffect[];
    };
    setLogs(mockLogs);
    setStats(mockStats);
    setRoadmapMilestones(mockStats.mockMilestones || []);
    setInventoryItems(mockStats.mockInventory || []);
    setActiveEffects(mockStats.mockActiveEffects || []);
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
        // Only prompt daily check-in if streak is NOT currently frozen
        const fetchedStats = await fetchDashboardStats(user?.weeklyPlan);
        const isFrozenToday = fetchedStats?.isFrozen;

        const hasTodayLog = currentLogs.some((l) => l.date === todayStr);

        if (!hasTodayLog && !isFrozenToday) {
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
        <LandingBackground isFrozen={stats?.isFrozen} />

        <div className="relative z-10 flex flex-col min-h-screen">
          {/* Navigation Header */}
          <Header
            currentStreak={stats?.currentStreak || 0}
            onOpenInventory={() => setIsInventoryOpen(true)}
            inventoryCount={inventoryItems.reduce((acc, curr) => acc + curr.quantity, 0)}
          />

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
                    <>
                      <button
                        type="button"
                        onClick={resetToRealData}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold border border-zinc-700 transition-all cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-zinc-400" />
                        <span>Reset Real Data</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (stats) {
                            setStats({
                              ...stats,
                              isFrozen: !stats.isFrozen,
                            });
                          }
                        }}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-cyan-400 text-xs font-semibold border border-zinc-700 transition-all cursor-pointer"
                      >
                        <Snowflake className="w-3.5 h-3.5 shrink-0" />
                        <span>{stats?.isFrozen ? 'Unfreeze Mock' : 'Freeze Mock'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (stats) {
                            setStats({
                              ...stats,
                              streakWarningEvent: stats.streakWarningEvent
                                ? null
                                : {
                                  is_at_risk: true,
                                  hours_remaining: 5,
                                  rest_tokens_left: 0,
                                  message: 'Streak decay imminent! Log a workout before midnight.'
                                }
                            });
                          }
                        }}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-amber-400 text-xs font-semibold border border-zinc-700 transition-all cursor-pointer"
                      >
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                        <span>{stats?.streakWarningEvent ? 'Clear Warning' : 'Trigger Warning'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (stats) {
                            if (!stats.streakBrokenEvent) {
                              setHasSeenBrokenModal(false);
                            }
                            setStats({
                              ...stats,
                              streakBrokenEvent: stats.streakBrokenEvent
                                ? null
                                : {
                                  previous_streak: 15,
                                  broken_on: new Date(Date.now() - 86400 * 1000).toISOString().split('T')[0],
                                  restore_shield_available: true,
                                  restore_shields_count: 2,
                                  can_restore_until: new Date().toISOString().split('T')[0]
                                }
                            });
                          }
                        }}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-red-400 text-xs font-semibold border border-zinc-700 transition-all cursor-pointer"
                      >
                        <ShieldAlert className="w-3.5 h-3.5 shrink-0 text-red-400" />
                        <span>{stats?.streakBrokenEvent ? 'Clear Broken' : 'Trigger Broken'}</span>
                      </button>
                    </>
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
                {/* Frozen State Banner */}
                {stats?.isFrozen && (
                  <FrozenStateBanner
                    isFrozen={stats.isFrozen}
                    activeEffects={activeEffects}
                    onUnfreezeSuccess={async () => {
                      await refreshData();
                    }}
                  />
                )}

                {/* Streak Decay Imminent Risk Warning Banner */}
                {stats?.streakWarningEvent?.is_at_risk && (
                  <StreakRiskWarningBanner
                    event={stats.streakWarningEvent}
                    onLogWorkoutClick={() => setShowDailyCheckIn(true)}
                  />
                )}

                {/* Active Buffs / Effects HUD Bar */}
                <ActiveEffectsBar
                  key={activeEffects.map((e) => `${e.item_id}-${e.remaining_seconds}`).join(',') || 'empty'}
                  activeEffects={activeEffects}
                />

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

                {/* Phase 5 — Streak Reward Roadmap */}
                {roadmapMilestones.length > 0 && (
                  <RewardRoadmap
                    milestones={roadmapMilestones}
                    longestStreak={stats?.longestStreak ?? 0}
                    planId={user?.weeklyPlan?.id}
                    onClaimSuccess={async (details) => {
                      setCelebrationDetails(details);
                      // Refresh inventory and roadmap to reflect the newly claimed item
                      await refreshData();
                    }}
                  />
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

          {editTileDate && (
            <EditLogModal
              dateStr={editTileDate}
              existingLog={editTileLog}
              isOpen={!!editTileDate}
              onClose={() => setEditTileDate(null)}
              onSave={handleSaveEdit}
              onDelete={handleDeleteEdit}
              availableWorkoutTypes={user?.weeklyPlan?.categories}
            />
          )}

          <WeeklyPlanModal
            currentPlan={user?.weeklyPlan}
            isOpen={showPlanModal || needsPlanSelection}
            onClose={() => setShowPlanModal(false)}
            onSavePlan={handleSavePlan}
            preventClose={needsPlanSelection}
          />

          <InventoryDrawer
            isOpen={isInventoryOpen}
            onClose={() => setIsInventoryOpen(false)}
            inventoryItems={inventoryItems}
            onUseItem={handleUseInventoryItem}
            onRequestFreeze={(availableTokens) => {
              setIsInventoryOpen(false);
              setIsFreezeModalOpen(true);
            }}
          />

          <FreezeModal
            isOpen={isFreezeModalOpen}
            onClose={() => setIsFreezeModalOpen(false)}
            availableTokens={availableFreezeTokens}
            onSuccess={async () => {
              await refreshData();
            }}
          />

          {/* Phase 5 — Claim Celebration Modal */}
          <ClaimCelebrationModal
            isOpen={!!celebrationDetails}
            rewardDetails={celebrationDetails}
            onClose={() => setCelebrationDetails(null)}
          />

          {/* Phase 6 — Streak Broken Recovery Modal */}
          <StreakBrokenModal
            isOpen={!!stats?.streakBrokenEvent && !hasSeenBrokenModal}
            event={stats?.streakBrokenEvent || null}
            onClose={() => setHasSeenBrokenModal(true)}
            onRestoreSuccess={async () => {
              await refreshData();
            }}
            onOpenRoadmap={() => {
              setHasSeenBrokenModal(true);
              const roadmapEl = document.getElementById('reward-roadmap');
              if (roadmapEl) {
                roadmapEl.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          />
        </div>
      </div>
    </AuthGuard>
  );
}
