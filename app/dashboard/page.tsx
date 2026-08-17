'use client';

import React from 'react';
import AuthGuard from '@/components/AuthGuard';
import CyberpunkLoader from '@/components/CyberpunkLoader';
import Footer from '@/components/layout/Footer';
import { LandingBackground } from '@/components/pages/landing';
import Header from '@/components/pages/dashboard/Header';
import StatsOverview from '@/components/pages/dashboard/StatsOverview';
import FilterBar from '@/components/pages/dashboard/FilterBar';
import ContributionGraph from '@/components/pages/dashboard/ContributionGraph';
import PowerLevelChart from '@/components/pages/dashboard/PowerLevelChart';
import RewardRoadmap from '@/components/pages/dashboard/rewards/RewardRoadmap';
import ClaimCelebrationModal from '@/components/pages/dashboard/rewards/ClaimCelebrationModal';
import PowerLevelCelebrationModal from '@/components/pages/dashboard/power-level/PowerLevelCelebrationModal';
import InventoryDrawer from '@/components/inventory/InventoryDrawer';
import ActiveEffectsBar from '@/components/inventory/ActiveEffectsBar';
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
import { enable_mock_data } from '@/lib/flags';
import { useDashboardState } from './useDashboardState';

export default function DashboardPage() {
  const state = useDashboardState();

  return (
    <AuthGuard>
      <div className="min-h-screen bg-[#060a0e] text-[#fafafa] flex flex-col font-sans relative overflow-hidden selection:bg-neon-green/20 selection:text-neon-green">
        {/* Animated Cyberpunk Background */}
        <LandingBackground isFrozen={state.stats?.isFrozen} />

        <div className="relative z-10 flex flex-col min-h-screen">
          {/* Navigation Header */}
          <Header
            currentStreak={state.stats?.currentStreak || 0}
            onOpenInventory={() => state.setIsInventoryOpen(true)}
            inventoryCount={state.inventoryItems.reduce((acc, curr) => acc + curr.quantity, 0)}
          />

          {/* Dashboard Main Content */}
          <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
            {/* 365-Day Mock Testing Toolbar */}
            {enable_mock_data && (
              <MockTestingToolbar
                isMockActive={state.isMockActive}
                onActivateMock={state.activateMockData}
                onResetRealData={state.resetToRealData}
                stats={state.stats}
                onToggleFreezeMock={() => {
                  if (state.stats) {
                    state.setStats({ ...state.stats, isFrozen: !state.stats.isFrozen });
                  }
                }}
                onToggleStreakWarning={() => {
                  if (state.stats) {
                    state.setStats({
                      ...state.stats,
                      streakWarningEvent: state.stats.streakWarningEvent
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
                  if (state.stats) {
                    if (!state.stats.streakBrokenEvent) {
                      state.setHasSeenBrokenModal(false);
                    }
                    state.setStats({
                      ...state.stats,
                      streakBrokenEvent: state.stats.streakBrokenEvent
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
                onSeedToBackend={state.handleSeedToBackend}
                isSeeding={state.isSeeding}
                seedProgress={state.seedProgress}
              />
            )}

            {state.loading ? (
              <CyberpunkLoader text="Summoning your stats" />
            ) : (
              <>
                {/* Frozen State Banner */}
                {state.stats?.isFrozen && (
                  <FrozenStateBanner
                    isFrozen={state.stats.isFrozen}
                    activeEffects={state.activeEffects}
                    onUnfreezeSuccess={async () => {
                      await state.refreshData();
                    }}
                  />
                )}

                {/* Streak Decay Imminent Risk Warning Banner */}
                {state.stats?.streakWarningEvent?.is_at_risk && (state.stats?.currentStreak ?? 0) > 0 && (
                  <StreakRiskWarningBanner
                    event={state.stats.streakWarningEvent}
                    currentStreak={state.stats.currentStreak}
                    onLogWorkoutClick={() => state.setShowDailyCheckIn(true)}
                  />
                )}

                {/* Active Buffs / Effects HUD Bar */}
                <ActiveEffectsBar
                  key={state.activeEffects.map((e) => `${e.item_id}-${e.remaining_seconds}`).join(',') || 'empty'}
                  activeEffects={state.activeEffects}
                />

                {/* Analytics & Streaks Overview */}
                <StatsOverview stats={state.stats} />

                {/* Dynamic Workout Filter Controls */}
                <FilterBar
                  activeFilter={state.activeFilter}
                  onFilterChange={state.setActiveFilter}
                  weeklyPlan={state.user?.weeklyPlan}
                  onOpenPlanModal={() => state.setShowPlanModal(true)}
                />

                {/* Flexible Contribution Graph (Year / Month / Week views) */}
                <ContributionGraph
                  logs={state.logs}
                  activeFilter={state.activeFilter}
                  onTileClick={state.handleTileClick}
                  weeklyPlan={state.user?.weeklyPlan}
                />

                {/* Monthly Attendance Bar Chart */}
                {state.stats?.monthlyData && (
                  <PowerLevelChart monthlyData={state.stats.monthlyData} logs={state.logs} />
                )}

                {/* Streak Reward Roadmap */}
                {state.roadmapMilestones.length > 0 && (
                  <RewardRoadmap
                    milestones={state.roadmapMilestones}
                    longestStreak={state.stats?.longestStreak ?? 0}
                    planId={state.user?.weeklyPlan?.id}
                    onClaimSuccess={async (details) => {
                      state.setCelebrationDetails(details);
                      await state.refreshData();
                    }}
                  />
                )}
              </>
            )}
          </main>

          <Footer />

          {/* Modals */}
          <DailyCheckInModal
            dateStr={state.todayDateStr}
            isOpen={state.showDailyCheckIn}
            onCheckInYes={state.handleDailyCheckInYes}
            onCheckInNo={state.handleDailyCheckInNo}
            onCheckInLater={state.handleDailyCheckInLater}
            availableWorkoutTypes={state.user?.weeklyPlan?.categories}
          />

          {state.editTileDate && (
            <EditLogModal
              dateStr={state.editTileDate}
              existingLog={state.editTileLog}
              isOpen={!!state.editTileDate}
              onClose={() => state.setEditTileDate(null)}
              onSave={state.handleSaveEdit}
              onDelete={state.handleDeleteEdit}
              availableWorkoutTypes={state.user?.weeklyPlan?.categories}
            />
          )}

          <WeeklyPlanModal
            currentPlan={state.user?.weeklyPlan}
            isOpen={state.showPlanModal || state.needsPlanSelection}
            onClose={() => state.setShowPlanModal(false)}
            onSavePlan={state.handleSavePlan}
            preventClose={state.needsPlanSelection}
          />

          <InventoryDrawer
            isOpen={state.isInventoryOpen}
            onClose={() => state.setIsInventoryOpen(false)}
            inventoryItems={state.inventoryItems}
            onUseItem={state.handleUseInventoryItem}
            onRequestFreeze={(tokens) => {
              state.setIsInventoryOpen(false);
              state.setIsFreezeModalOpen(true);
            }}
          />

          <FreezeModal
            isOpen={state.isFreezeModalOpen}
            onClose={() => state.setIsFreezeModalOpen(false)}
            availableTokens={state.availableFreezeTokens}
            onSuccess={async () => {
              await state.refreshData();
            }}
          />

          <ClaimCelebrationModal
            isOpen={!!state.celebrationDetails}
            rewardDetails={state.celebrationDetails}
            onClose={() => state.setCelebrationDetails(null)}
          />

          <StreakBrokenModal
            isOpen={!!state.stats?.streakBrokenEvent && !state.hasSeenBrokenModal}
            event={state.stats?.streakBrokenEvent || null}
            onClose={() => state.setHasSeenBrokenModal(true)}
            onRestoreSuccess={async () => {
              await state.refreshData();
            }}
            onOpenRoadmap={() => {
              state.setHasSeenBrokenModal(true);
              const roadmapEl = document.getElementById('reward-roadmap');
              if (roadmapEl) {
                roadmapEl.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          />

          {state.powerCelebrationData && (
            <PowerLevelCelebrationModal
              isOpen={!!state.powerCelebrationData}
              targetScore={state.powerCelebrationData.targetScore}
              scoreData={state.powerCelebrationData.scoreData}
              onClose={() => state.setPowerCelebrationData(null)}
            />
          )}
        </div>
      </div>
    </AuthGuard>
  );
}
