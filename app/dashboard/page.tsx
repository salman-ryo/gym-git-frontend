'use client';

import AuthGuard from '@/components/AuthGuard';
import ContributionGraph from '@/components/pages/dashboard/ContributionGraph';
import CyberpunkLoader from '@/components/CyberpunkLoader';
import {
  DailyCheckInModal,
  EditLogModal,
  FreezeModal,
  StreakBrokenModal,
  WeeklyPlanModal,
} from '@/components/pages/dashboard/modals';
import {
  FrozenStateBanner,
  StreakRiskWarningBanner,
} from '@/components/pages/dashboard/banners';
import { MockTestingToolbar } from '@/components/pages/dashboard/toolbar';
import FilterBar from '@/components/pages/dashboard/FilterBar';
import Header from '@/components/pages/dashboard/Header';
import StatsOverview from '@/components/pages/dashboard/StatsOverview';
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
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import PowerLevelChart from '@/components/pages/dashboard/PowerLevelChart';
import Footer from '@/components/layout/Footer';
import { LandingBackground } from '@/components/pages/landing';
import RewardRoadmap from '@/components/pages/dashboard/rewards/RewardRoadmap';
import ClaimCelebrationModal from '@/components/pages/dashboard/rewards/ClaimCelebrationModal';
import { fetchRewardRoadmap } from '@/lib/rewards-service';
import { restoreStreak } from '@/lib/streak-service';
import PowerLevelCelebrationModal from '@/components/pages/dashboard/power-level/PowerLevelCelebrationModal';
import { calculateScientificPowerScore, PowerScoreBreakdown } from '@/lib/scientific-power';
import {
  snoozeCheckIn,
  clearCheckInSnooze,
  SNOOZE_DURATION_MS,
} from '@/lib/checkin-snooze';

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

  // Power Level Animation state
  const [powerCelebrationData, setPowerCelebrationData] = useState<{
    targetScore: number;
    scoreData?: PowerScoreBreakdown;
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

  // Calculate Current Week Power Score for animation
  const calculateCurrentWeekScore = useCallback((allLogs: GymLog[]) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const currentDay = today.getDay();
    const diffToMonday = today.getDate() - (currentDay === 0 ? 6 : currentDay - 1);
    const monday = new Date(today);
    monday.setDate(diffToMonday);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    const monStr = formatDateKey(monday);
    const sunStr = formatDateKey(sunday);

    const weekLogs = allLogs.filter(
      (l) => l.date >= monStr && l.date <= sunStr && l.hours > 0
    );
    return calculateScientificPowerScore(weekLogs, 7, 4);
  }, []);

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

  // Check-in Snooze Timer Ref
  const snoozeTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Clean up snooze timer on unmount
  useEffect(() => {
    return () => {
      if (snoozeTimerRef.current) clearTimeout(snoozeTimerRef.current);
    };
  }, []);

  // Schedule a client-side reminder to re-prompt daily check-in after snooze duration
  const scheduleSnoozeReminder = useCallback((delayMs: number, dateKey: string) => {
    if (snoozeTimerRef.current) clearTimeout(snoozeTimerRef.current);
    snoozeTimerRef.current = setTimeout(async () => {
      const today = formatDateKey(new Date());
      if (today === dateKey) {
        // Re-verify that user has not logged today's session in the interim
        const fetchedLogs = await fetchGymLogs();
        const hasLog = fetchedLogs.some((l) => l.date === today);
        const fetchedStats = await fetchDashboardStats(user?.weeklyPlan);
        const isFrozen = fetchedStats?.isFrozen;

        if (!hasLog && !isFrozen) {
          setShowDailyCheckIn(true);
        }
        await clearCheckInSnooze();
      }
    }, delayMs);
  }, [user?.weeklyPlan]);

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
        const snoozeStatus = user?.checkinSnooze;
        const isSnoozed = !!(
          snoozeStatus?.is_snoozed &&
          snoozeStatus.date === todayStr &&
          snoozeStatus.remaining_seconds > 0
        );

        if (!hasTodayLog && !isFrozenToday) {
          if (!isSnoozed) {
            setShowDailyCheckIn(true);
          } else {
            // Already snoozed dynamically on backend: schedule remaining timer
            const remainingMs = (snoozeStatus?.remaining_seconds ?? 0) * 1000;
            if (remainingMs > 0) {
              scheduleSnoozeReminder(remainingMs, todayStr);
            }
          }
        }
      }
    }
    if (user) {
      initDashboard();
    }
  }, [refreshData, user, needsPlanSelection, activateMockData, scheduleSnoozeReminder]);

  // Handle Daily Check-in Yes
  const handleDailyCheckInYes = async (
    hours: number,
    workoutType: WorkoutType,
    notes?: string
  ) => {
    await clearCheckInSnooze();
    if (snoozeTimerRef.current) clearTimeout(snoozeTimerRef.current);
    await saveGymLog(todayDateStr, hours, workoutType, notes);
    setShowDailyCheckIn(false);
    const updatedLogs = await refreshData();

    if (hours > 0 && Array.isArray(updatedLogs)) {
      const weekScoreData = calculateCurrentWeekScore(updatedLogs);
      setPowerCelebrationData({
        targetScore: weekScoreData.totalScore,
        scoreData: weekScoreData,
      });
    }
  };

  // Handle Daily Check-in No (Rest day)
  const handleDailyCheckInNo = async () => {
    await clearCheckInSnooze();
    if (snoozeTimerRef.current) clearTimeout(snoozeTimerRef.current);
    await saveGymLog(todayDateStr, 0, 'Rest');
    setShowDailyCheckIn(false);
    await refreshData();
  };

  // Handle Daily Check-in Later (Snooze 30 minutes dynamically via backend)
  const handleDailyCheckInLater = async () => {
    setShowDailyCheckIn(false);
    try {
      await snoozeCheckIn(todayDateStr);
    } catch (err) {
      console.error('Failed to save checkin snooze to backend', err);
    }
    scheduleSnoozeReminder(SNOOZE_DURATION_MS, todayDateStr);
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
    const today = new Date();
    const todayStr = formatDateKey(today);

    if (dateStr < todayStr) {
      const targetDate = new Date(dateStr + 'T00:00:00');
      const todayDate = new Date(todayStr + 'T00:00:00');
      const diffTime = todayDate.getTime() - targetDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      // If it's a past date within the 3-day lookback window
      if (diffDays >= 1 && diffDays <= 3) {
        await restoreStreak(dateStr, workoutType, hours);
        await refreshData();
        return;
      }
    }

    await saveGymLog(dateStr, hours, workoutType, notes);
    const updatedLogs = await refreshData();

    if (dateStr === todayStr && hours > 0 && Array.isArray(updatedLogs)) {
      const weekScoreData = calculateCurrentWeekScore(updatedLogs);
      setPowerCelebrationData({
        targetScore: weekScoreData.totalScore,
        scoreData: weekScoreData,
      });
    }
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
              <MockTestingToolbar
                isMockActive={isMockActive}
                onActivateMock={activateMockData}
                onResetRealData={resetToRealData}
                stats={stats}
                onToggleFreezeMock={() => {
                  if (stats) {
                    setStats({
                      ...stats,
                      isFrozen: !stats.isFrozen,
                    });
                  }
                }}
                onToggleStreakWarning={() => {
                  if (stats) {
                    setStats({
                      ...stats,
                      streakWarningEvent: stats.streakWarningEvent
                        ? null
                        : {
                            is_at_risk: true,
                            hours_remaining: 5,
                            rest_tokens_left: 0,
                            message: 'Streak decay imminent! Log a workout before midnight.',
                          },
                    });
                  }
                }}
                onToggleStreakBroken={() => {
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
                            can_restore_until: new Date().toISOString().split('T')[0],
                          },
                    });
                  }
                }}
                onSeedToBackend={handleSeedToBackend}
                isSeeding={isSeeding}
                seedProgress={seedProgress}
              />
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
                {stats?.streakWarningEvent?.is_at_risk && (stats?.currentStreak ?? 0) > 0 && (
                  <StreakRiskWarningBanner
                    event={stats.streakWarningEvent}
                    currentStreak={stats.currentStreak}
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
            onCheckInLater={handleDailyCheckInLater}
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

          {/* Today's Log Power Level Calibration Animation */}
          {powerCelebrationData && (
            <PowerLevelCelebrationModal
              isOpen={!!powerCelebrationData}
              targetScore={powerCelebrationData.targetScore}
              scoreData={powerCelebrationData.scoreData}
              onClose={() => setPowerCelebrationData(null)}
            />
          )}
        </div>
      </div>
    </AuthGuard>
  );
}
