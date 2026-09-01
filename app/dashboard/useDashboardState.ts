'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useInventory } from '@/lib/inventory-context';
import { formatDateKey } from '@/lib/date-utils';
import {
  deleteGymLog,
  fetchDashboardStats,
  fetchGymLogs,
  saveGymLog,
  fetchDashboardStateAPI,
  updateUserPlanAPI,
} from '@/lib/gym-service';
import {
  generate365MockLogs,
  generateMockStats,
  seedMockLogsToBackend,
} from '@/lib/mock-data-generator';
import { enable_mock_data, auto_load_mock_on_startup } from '@/lib/flags';
import {
  GymLog,
  Stats,
  WeeklyPlan,
  WorkoutType,
  UserInventoryItem,
  ActiveItemEffect,
  RoadmapMilestone,
  SectionQueryState,
} from '@/lib/types';
import { fetchRewardRoadmap } from '@/lib/rewards-service';
import { restoreStreak } from '@/lib/streak-service';
import { calculateScientificPowerScore, PowerScoreBreakdown } from '@/lib/scientific-power';
import {
  snoozeCheckIn,
  clearCheckInSnooze,
  SNOOZE_DURATION_MS,
} from '@/lib/checkin-snooze';

export function useDashboardState() {
  const { user } = useAuth();
  const [dashboardState, setDashboardState] = useState<import('@/lib/types').DashboardState | null>(null);
  const [isDashboardStateLoading, setIsDashboardStateLoading] = useState<boolean>(true);

  const {
    inventoryItems,
    activeEffects,
    isInventoryOpen,
    setIsInventoryOpen,
    availableFreezeTokens,
    availableRestoreShields,
    inventoryCount,
    isLoading: isInventoryLoading,
    error: inventoryError,
    fetchInventory,
    executeUseItem,
    consumeItem,
    setInventoryState,
  } = useInventory();

  // Stable user ref for stable fetch callbacks
  const userPlanRef = useRef(dashboardState?.plan);
  useEffect(() => {
    userPlanRef.current = dashboardState?.plan;
  }, [dashboardState?.plan]);

  // 1. Stats Query State
  const [stats, setStats] = useState<Stats | null>(null);
  const [isStatsLoading, setIsStatsLoading] = useState<boolean>(true);
  const [statsError, setStatsError] = useState<string | null>(null);

  // 2. Logs Query State
  const [logs, setLogs] = useState<GymLog[]>([]);
  const [isLogsLoading, setIsLogsLoading] = useState<boolean>(true);
  const [logsError, setLogsError] = useState<string | null>(null);

  // 3. Rewards Roadmap Query State
  const [roadmapMilestones, setRoadmapMilestones] = useState<RoadmapMilestone[]>([]);
  const [isRoadmapLoading, setIsRoadmapLoading] = useState<boolean>(true);
  const [roadmapError, setRoadmapError] = useState<string | null>(null);

  // Mock Toolbar & Seeding State
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

  // Celebration state
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

  // Streak Lifecycle state
  const [hasSeenBrokenModal, setHasSeenBrokenModal] = useState<boolean>(false);

  // Extract all workout types present across historical logs
  const availableHistoricalTypes = useMemo(() => {
    const types = new Set<string>();
    logs.forEach((l) => {
      if (l.workoutType) types.add(l.workoutType);
    });
    return Array.from(types);
  }, [logs]);

  // Calculate Current Week Power Score for celebration animation
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

  // --- Independent Fetch Controllers (Stable) ---

  const fetchDashboardStateOnly = useCallback(async () => {
    setIsDashboardStateLoading(true);
    try {
      const state = await fetchDashboardStateAPI();
      setDashboardState(state);
      return state;
    } finally {
      setIsDashboardStateLoading(false);
    }
  }, []);

  const fetchStatsOnly = useCallback(async (targetPlan?: WeeklyPlan) => {
    setIsStatsLoading(true);
    setStatsError(null);
    try {
      const plan = targetPlan ?? userPlanRef.current;
      const res = await fetchDashboardStats(plan);
      setStats(res);
      return res;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to synchronize grind statistics.';
      setStatsError(msg);
      return null;
    } finally {
      setIsStatsLoading(false);
    }
  }, []);

  const fetchLogsOnly = useCallback(async () => {
    setIsLogsLoading(true);
    setLogsError(null);
    try {
      const res = await fetchGymLogs();
      const logsData = Array.isArray(res) ? res : [];
      setLogs(logsData);
      return logsData;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to retrieve consistency heatmap logs.';
      setLogsError(msg);
      return [];
    } finally {
      setIsLogsLoading(false);
    }
  }, []);

  const fetchRoadmapOnly = useCallback(async (targetPlanId?: string) => {
    setIsRoadmapLoading(true);
    setRoadmapError(null);
    try {
      const planId = targetPlanId ?? userPlanRef.current?.id;
      const roadmap = await fetchRewardRoadmap(planId);
      const items = Array.isArray(roadmap) ? roadmap : [];
      setRoadmapMilestones(items);
      return items;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to synchronize streak reward roadmap.';
      setRoadmapError(msg);
      return [];
    } finally {
      setIsRoadmapLoading(false);
    }
  }, []);

  // Combined Refresh (dispatches all in parallel via Promise.allSettled)
  const refreshData = useCallback(async () => {
    await Promise.allSettled([
      fetchDashboardStateOnly(),
      fetchStatsOnly(),
      fetchLogsOnly(),
      fetchInventory(),
      fetchRoadmapOnly(),
    ]);
  }, [fetchDashboardStateOnly, fetchStatsOnly, fetchLogsOnly, fetchInventory, fetchRoadmapOnly]);

  const handleUseInventoryItem = useCallback(async (itemId: string, payload?: Record<string, unknown>) => {
    try {
      await executeUseItem(itemId, payload);
      // Targeted refetch of stats
      await fetchStatsOnly();
    } catch (err) {
      console.error('Failed to use inventory item:', err);
    }
  }, [executeUseItem, fetchStatsOnly]);

  const activateMockData = useCallback(() => {
    const mockLogs = generate365MockLogs(365);
    const mockStats = generateMockStats(mockLogs, userPlanRef.current) as Stats & {
      mockMilestones?: RoadmapMilestone[];
      mockInventory?: UserInventoryItem[];
      mockActiveEffects?: ActiveItemEffect[];
    };
    setLogs(mockLogs);
    setStats(mockStats);
    setRoadmapMilestones(mockStats.mockMilestones || []);
    setInventoryState(mockStats.mockInventory || [], mockStats.mockActiveEffects || []);

    setIsLogsLoading(false);
    setIsStatsLoading(false);
    setIsRoadmapLoading(false);

    setLogsError(null);
    setStatsError(null);
    setRoadmapError(null);

    setIsMockActive(true);
  }, [setInventoryState]);

  const resetToRealData = useCallback(async () => {
    setIsMockActive(false);
    await refreshData();
  }, [refreshData]);

  const handleSeedToBackend = useCallback(async () => {
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
  }, [refreshData]);

  // Snooze timer management
  const snoozeTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (snoozeTimerRef.current) clearTimeout(snoozeTimerRef.current);
    };
  }, []);

  const scheduleSnoozeReminder = useCallback((delayMs: number, dateKey: string) => {
    if (snoozeTimerRef.current) clearTimeout(snoozeTimerRef.current);
    snoozeTimerRef.current = setTimeout(async () => {
      const today = formatDateKey(new Date());
      if (today === dateKey) {
        const fetchedLogs = await fetchGymLogs();
        const hasLog = fetchedLogs.some((l) => l.date === today);
        const fetchedStats = await fetchDashboardStats(userPlanRef.current);
        const isFrozen = fetchedStats?.isFrozen;

        if (!hasLog && !isFrozen) {
          setShowDailyCheckIn(true);
        }
        await clearCheckInSnooze();
      }
    }, delayMs);
  }, []);

  const needsPlanSelection = !!(user && !isDashboardStateLoading && !dashboardState?.plan);
  const userEmail = user?.email;
  const isUserAuthenticated = !!user;

  // Concurrent Initial Mounting (fires only on initial mount or auth change)
  useEffect(() => {
    let isMounted = true;

    async function initDashboard() {
      if (enable_mock_data && auto_load_mock_on_startup) {
        activateMockData();
        return;
      }

      const todayStr = formatDateKey(new Date());
      if (isMounted) {
        setTodayDateStr(todayStr);
      }

      if (!isUserAuthenticated) return;

      // Dispatch all independent initial queries concurrently in parallel
      const statePromise = fetchDashboardStateOnly();
      const statsPromise = fetchStatsOnly();
      const logsPromise = fetchLogsOnly();
      const inventoryPromise = fetchInventory();

      const state = await statePromise;
      if (!isMounted) return;

      if (!state?.plan) {
        setShowPlanModal(true);
        setShowDailyCheckIn(false);
        return;
      }

      // Trigger roadmap immediately upon plan resolution
      fetchRoadmapOnly(state.plan.id);

      const currentLogs = await logsPromise;
      if (!isMounted) return;

      const hasTodayLog = currentLogs.some((l) => l.date === todayStr);
      const snoozeStatus = state.checkinSnooze;
      const isSnoozed = !!(
        snoozeStatus?.is_snoozed &&
        snoozeStatus.date === todayStr &&
        snoozeStatus.remaining_seconds > 0
      );

      if (!hasTodayLog && !isSnoozed) {
        setShowDailyCheckIn(true);
      } else if (isSnoozed) {
        const remainingMs = (snoozeStatus?.remaining_seconds ?? 0) * 1000;
        if (remainingMs > 0) {
          scheduleSnoozeReminder(remainingMs, todayStr);
        }
      }

      // Ensure stats and inventory promises complete
      await Promise.allSettled([statsPromise, inventoryPromise]);
    }

    initDashboard();

    return () => {
      isMounted = false;
    };
  }, [
    userEmail,
    isUserAuthenticated,
    activateMockData,
    fetchDashboardStateOnly,
    fetchStatsOnly,
    fetchLogsOnly,
    fetchInventory,
    fetchRoadmapOnly,
    scheduleSnoozeReminder,
  ]);

  const handleDailyCheckInYes = useCallback(async (
    hours: number,
    workoutType: WorkoutType,
    notes?: string
  ) => {
    await clearCheckInSnooze();
    if (snoozeTimerRef.current) clearTimeout(snoozeTimerRef.current);
    await saveGymLog(todayDateStr, hours, workoutType, notes);
    setShowDailyCheckIn(false);

    // Targeted parallel refetch of logs and stats
    const [logsRes] = await Promise.all([
      fetchLogsOnly(),
      fetchStatsOnly(),
    ]);

    if (hours > 0 && Array.isArray(logsRes)) {
      const weekScoreData = calculateCurrentWeekScore(logsRes);
      setPowerCelebrationData({
        targetScore: weekScoreData.totalScore,
        scoreData: weekScoreData,
      });
    }
  }, [calculateCurrentWeekScore, fetchLogsOnly, fetchStatsOnly, todayDateStr]);

  const handleDailyCheckInNo = useCallback(async () => {
    await clearCheckInSnooze();
    if (snoozeTimerRef.current) clearTimeout(snoozeTimerRef.current);
    await saveGymLog(todayDateStr, 0, 'Rest');
    setShowDailyCheckIn(false);
    await Promise.all([fetchLogsOnly(), fetchStatsOnly()]);
  }, [fetchLogsOnly, fetchStatsOnly, todayDateStr]);

  const handleDailyCheckInLater = useCallback(async () => {
    setShowDailyCheckIn(false);
    try {
      await snoozeCheckIn(todayDateStr);
    } catch (err) {
      console.error('Failed to save checkin snooze to backend', err);
    }
    scheduleSnoozeReminder(SNOOZE_DURATION_MS, todayDateStr);
  }, [scheduleSnoozeReminder, todayDateStr]);

  const handleTileClick = useCallback((dateStr: string, log?: GymLog) => {
    setEditTileDate(dateStr);
    setEditTileLog(log);
  }, []);

  const handleSaveEdit = useCallback(async (
    dateStr: string,
    hours: number,
    workoutType: WorkoutType,
    notes?: string
  ) => {
    const todayStr = formatDateKey(new Date());

    if (dateStr < todayStr) {
      const targetDate = new Date(dateStr + 'T00:00:00');
      const todayDate = new Date(todayStr + 'T00:00:00');
      const diffTime = todayDate.getTime() - targetDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays >= 1 && diffDays <= 3) {
        await restoreStreak(dateStr, workoutType, hours);
        consumeItem('RESTORE_SHIELD', 1);
        await Promise.all([fetchLogsOnly(), fetchStatsOnly()]);
        return;
      }
    }

    await saveGymLog(dateStr, hours, workoutType, notes);
    const [updatedLogs] = await Promise.all([fetchLogsOnly(), fetchStatsOnly()]);

    if (dateStr === todayStr && hours > 0 && Array.isArray(updatedLogs)) {
      const weekScoreData = calculateCurrentWeekScore(updatedLogs);
      setPowerCelebrationData({
        targetScore: weekScoreData.totalScore,
        scoreData: weekScoreData,
      });
    }
  }, [calculateCurrentWeekScore, fetchLogsOnly, fetchStatsOnly, consumeItem]);

  const handleDeleteEdit = useCallback(async (dateStr: string) => {
    await deleteGymLog(dateStr);
    await Promise.all([fetchLogsOnly(), fetchStatsOnly()]);
  }, [fetchLogsOnly, fetchStatsOnly]);

  const handleSavePlan = useCallback(async (plan: WeeklyPlan) => {
    await updateUserPlanAPI(plan);
    setDashboardState(prev => prev ? { ...prev, plan } : { plan });
    setShowPlanModal(false);
    await Promise.all([fetchStatsOnly(plan), fetchRoadmapOnly(plan.id)]);
  }, [fetchStatsOnly, fetchRoadmapOnly]);

  // Construct Section Query States
  const statsQuery: SectionQueryState<Stats | null> = useMemo(() => ({
    data: stats,
    isLoading: isStatsLoading,
    error: statsError,
    refetch: async () => {
      await fetchStatsOnly();
    },
  }), [stats, isStatsLoading, statsError, fetchStatsOnly]);

  const logsQuery: SectionQueryState<GymLog[]> = useMemo(() => ({
    data: logs,
    isLoading: isLogsLoading,
    error: logsError,
    refetch: async () => {
      await fetchLogsOnly();
    },
  }), [logs, isLogsLoading, logsError, fetchLogsOnly]);

  const inventoryQuery: SectionQueryState<{
    inventory: UserInventoryItem[];
    activeEffects: ActiveItemEffect[];
  }> = useMemo(() => ({
    data: {
      inventory: inventoryItems,
      activeEffects: activeEffects,
    },
    isLoading: isInventoryLoading,
    error: inventoryError,
    refetch: async () => {
      await fetchInventory();
    },
  }), [inventoryItems, activeEffects, isInventoryLoading, inventoryError, fetchInventory]);

  const roadmapQuery: SectionQueryState<RoadmapMilestone[]> = useMemo(() => ({
    data: roadmapMilestones,
    isLoading: isRoadmapLoading,
    error: roadmapError,
    refetch: async () => {
      await fetchRoadmapOnly();
    },
  }), [roadmapMilestones, isRoadmapLoading, roadmapError, fetchRoadmapOnly]);

  return useMemo(() => ({
    user,
    dashboardState,
    isDashboardStateLoading,
    // Direct states
    stats,
    setStats,
    logs,
    inventoryItems,
    activeEffects,
    isInventoryOpen,
    setIsInventoryOpen,
    availableFreezeTokens,
    availableRestoreShields,
    inventoryCount,
    roadmapMilestones,
    // Granular Query Objects
    statsQuery,
    logsQuery,
    inventoryQuery,
    roadmapQuery,
    // Mock / Seeding state
    isMockActive,
    isSeeding,
    seedProgress,
    // Modals & Filters
    activeFilter,
    setActiveFilter,
    showDailyCheckIn,
    setShowDailyCheckIn,
    showPlanModal,
    setShowPlanModal,
    isFreezeModalOpen,
    setIsFreezeModalOpen,
    todayDateStr,
    editTileDate,
    setEditTileDate,
    editTileLog,
    celebrationDetails,
    setCelebrationDetails,
    powerCelebrationData,
    setPowerCelebrationData,
    hasSeenBrokenModal,
    setHasSeenBrokenModal,
    availableHistoricalTypes,
    needsPlanSelection,
    // Actions & Refetchers
    refreshData,
    fetchStatsOnly,
    fetchLogsOnly,
    fetchInventoryOnly: fetchInventory,
    fetchRoadmapOnly,
    handleUseInventoryItem,
    activateMockData,
    resetToRealData,
    handleSeedToBackend,
    handleDailyCheckInYes,
    handleDailyCheckInNo,
    handleDailyCheckInLater,
    handleTileClick,
    handleSaveEdit,
    handleDeleteEdit,
    handleSavePlan,
  }), [
    user,
    dashboardState,
    isDashboardStateLoading,
    stats,
    logs,
    inventoryItems,
    activeEffects,
    isInventoryOpen,
    setIsInventoryOpen,
    availableFreezeTokens,
    availableRestoreShields,
    inventoryCount,
    fetchInventory,
    roadmapMilestones,
    statsQuery,
    logsQuery,
    inventoryQuery,
    roadmapQuery,
    isMockActive,
    isSeeding,
    seedProgress,
    activeFilter,
    showDailyCheckIn,
    showPlanModal,
    isFreezeModalOpen,
    todayDateStr,
    editTileDate,
    editTileLog,
    celebrationDetails,
    powerCelebrationData,
    hasSeenBrokenModal,
    availableHistoricalTypes,
    needsPlanSelection,
    refreshData,
    fetchStatsOnly,
    fetchLogsOnly,
    fetchRoadmapOnly,
    handleUseInventoryItem,
    activateMockData,
    resetToRealData,
    handleSeedToBackend,
    handleDailyCheckInYes,
    handleDailyCheckInNo,
    handleDailyCheckInLater,
    handleTileClick,
    handleSaveEdit,
    handleDeleteEdit,
    handleSavePlan,
  ]);
}

export default useDashboardState;
