'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { formatDateKey } from '@/lib/date-utils';
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
import {
  GymLog,
  Stats,
  WeeklyPlan,
  WorkoutType,
  UserInventoryItem,
  ActiveItemEffect,
  RoadmapMilestone,
} from '@/lib/types';
import { fetchUserInventory, consumeInventoryItem } from '@/lib/inventory-service';
import { fetchRewardRoadmap } from '@/lib/rewards-service';
import { restoreStreak } from '@/lib/streak-service';
import { calculateScientificPowerScore, PowerScoreBreakdown } from '@/lib/scientific-power';
import {
  snoozeCheckIn,
  clearCheckInSnooze,
  SNOOZE_DURATION_MS,
} from '@/lib/checkin-snooze';

export function useDashboardState() {
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

  // Rewards & Celebration state
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

  // Fetch all logs & stats from backend API
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
      return { logs: fetchedLogs, stats: fetchedStats };
    } catch (err) {
      console.error('Failed to load dashboard data', err);
      return { logs: [], stats: null };
    } finally {
      setLoading(false);
    }
  }, [user]);

  const handleUseInventoryItem = useCallback(async (itemId: string, payload?: Record<string, unknown>) => {
    try {
      const invData = await consumeInventoryItem(itemId, 1, payload);
      setInventoryItems(invData.inventory || []);
      setActiveEffects(invData.active_effects || []);
      await refreshData();
    } catch (err) {
      console.error('Failed to use inventory item:', err);
    }
  }, [refreshData]);

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

  const resetToRealData = useCallback(async () => {
    setIsMockActive(false);
    setLoading(true);
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
        const fetchedStats = await fetchDashboardStats(user?.weeklyPlan);
        const isFrozen = fetchedStats?.isFrozen;

        if (!hasLog && !isFrozen) {
          setShowDailyCheckIn(true);
        }
        await clearCheckInSnooze();
      }
    }, delayMs);
  }, [user?.weeklyPlan]);

  const needsPlanSelection = !!(user && !user.weeklyPlan);

  useEffect(() => {
    async function initDashboard() {
      if (enable_mock_data && auto_load_mock_on_startup) {
        activateMockData();
        return;
      }

      const { logs: currentLogs, stats: currentStats } = await refreshData();
      const todayStr = formatDateKey(new Date());
      setTodayDateStr(todayStr);

      if (needsPlanSelection) {
        setShowPlanModal(true);
        setShowDailyCheckIn(false);
      } else {
        const isFrozenToday = currentStats?.isFrozen;

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

  const handleDailyCheckInYes = useCallback(async (
    hours: number,
    workoutType: WorkoutType,
    notes?: string
  ) => {
    await clearCheckInSnooze();
    if (snoozeTimerRef.current) clearTimeout(snoozeTimerRef.current);
    await saveGymLog(todayDateStr, hours, workoutType, notes);
    setShowDailyCheckIn(false);
    const { logs: updatedLogs } = await refreshData();

    if (hours > 0 && Array.isArray(updatedLogs)) {
      const weekScoreData = calculateCurrentWeekScore(updatedLogs);
      setPowerCelebrationData({
        targetScore: weekScoreData.totalScore,
        scoreData: weekScoreData,
      });
    }
  }, [calculateCurrentWeekScore, refreshData, todayDateStr]);

  const handleDailyCheckInNo = useCallback(async () => {
    await clearCheckInSnooze();
    if (snoozeTimerRef.current) clearTimeout(snoozeTimerRef.current);
    await saveGymLog(todayDateStr, 0, 'Rest');
    setShowDailyCheckIn(false);
    await refreshData();
  }, [refreshData, todayDateStr]);

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
        await refreshData();
        return;
      }
    }

    await saveGymLog(dateStr, hours, workoutType, notes);
    const { logs: updatedLogs } = await refreshData();

    if (dateStr === todayStr && hours > 0 && Array.isArray(updatedLogs)) {
      const weekScoreData = calculateCurrentWeekScore(updatedLogs);
      setPowerCelebrationData({
        targetScore: weekScoreData.totalScore,
        scoreData: weekScoreData,
      });
    }
  }, [calculateCurrentWeekScore, refreshData]);

  const handleDeleteEdit = useCallback(async (dateStr: string) => {
    await deleteGymLog(dateStr);
    await refreshData();
  }, [refreshData]);

  const handleSavePlan = useCallback(async (plan: WeeklyPlan) => {
    await updateUserPlan(plan);
    setShowPlanModal(false);
  }, [updateUserPlan]);

  return useMemo(() => ({
    user,
    inventoryItems,
    activeEffects,
    isInventoryOpen,
    setIsInventoryOpen,
    availableFreezeTokens,
    logs,
    stats,
    setStats,
    loading,
    isMockActive,
    isSeeding,
    seedProgress,
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
    roadmapMilestones,
    celebrationDetails,
    setCelebrationDetails,
    powerCelebrationData,
    setPowerCelebrationData,
    hasSeenBrokenModal,
    setHasSeenBrokenModal,
    availableHistoricalTypes,
    needsPlanSelection,
    refreshData,
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
    inventoryItems,
    activeEffects,
    isInventoryOpen,
    availableFreezeTokens,
    logs,
    stats,
    loading,
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
    roadmapMilestones,
    celebrationDetails,
    powerCelebrationData,
    hasSeenBrokenModal,
    availableHistoricalTypes,
    needsPlanSelection,
    refreshData,
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
