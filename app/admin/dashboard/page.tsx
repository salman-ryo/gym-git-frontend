'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  Users,
  Dumbbell,
  Trophy,
  Flame,
  Activity,
  ArrowRight,
  RefreshCw,
  Package,
  ScrollText,
  Sparkles,
} from 'lucide-react';
import { adminService } from '@/lib/admin-service';
import { AdminDashboardAnalytics } from '@/lib/admin-types';
import AdminStatCard from '@/components/admin/ui/AdminStatCard';
import CyberpunkLoader from '@/components/CyberpunkLoader';

export default function AdminDashboardPage() {
  const [analytics, setAnalytics] = useState<AdminDashboardAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async (isManual = false) => {
    if (isManual) setRefreshing(true);
    setError(null);

    try {
      const data = await adminService.getDashboardAnalytics();
      setAnalytics(data);
    } catch (err) {
      console.error('[AdminDashboard] Failed to fetch analytics:', err);
      setError('Unable to load platform analytics. Please check backend connection.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const data = await adminService.getDashboardAnalytics();
        if (isMounted) setAnalytics(data);
      } catch (err) {
        console.error('[AdminDashboard] Failed to fetch analytics:', err);
        if (isMounted) setError('Unable to load platform analytics. Please check backend connection.');
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="py-20">
        <CyberpunkLoader text="Compiling Platform Analytics" />
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="p-8 rounded-2xl bg-zinc-900/60 border border-zinc-800 text-center max-w-lg mx-auto mt-12">
        <div className="w-12 h-12 rounded-xl bg-rose-950/60 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto mb-4">
          <Activity className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-white mb-2">Analytics Stream Disconnected</h3>
        <p className="text-xs text-zinc-400 mb-6">{error || 'No telemetry data received.'}</p>
        <button
          onClick={() => fetchAnalytics(true)}
          className="px-4 py-2 rounded-xl bg-neon-cyan/20 border border-neon-cyan/40 text-neon-cyan hover:bg-neon-cyan/30 transition-all text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Retry Connection
        </button>
      </div>
    );
  }

  // Calculate streak distribution totals and maximums for chart scaling
  const streakEntries = Object.entries(analytics.streak_distribution || {});
  const totalStreakUsers = streakEntries.reduce((acc, [, val]) => acc + (val || 0), 0) || 1;
  const maxStreakValue = Math.max(...streakEntries.map(([, val]) => val || 0), 1);

  // Active user ratio
  const activeRate7d = analytics.total_users > 0
    ? Math.round((analytics.active_users_7d / analytics.total_users) * 100)
    : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Header & Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-black text-white tracking-tight uppercase">
            Platform Command Center
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Real-time platform telemetry, user engagement metrics & gamification economics
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchAnalytics(true)}
            disabled={refreshing}
            className="px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white transition-all text-xs font-semibold flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-neon-cyan' : ''}`} />
            <span>{refreshing ? 'Syncing...' : 'Refresh Telemetry'}</span>
          </button>
        </div>
      </div>

      {/* 4-Card Hero Metric Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AdminStatCard
          title="Total Athletes"
          value={analytics.total_users}
          subtitle={`${analytics.active_users_30d} active past 30 days`}
          icon={Users}
          colorScheme="cyan"
          trend={{
            value: `${analytics.active_users_7d} active (7d)`,
            isPositive: true,
            label: 'active this week',
          }}
        />

        <AdminStatCard
          title="Workouts Logged"
          value={analytics.total_workouts_logged}
          subtitle="Platform-wide volume"
          icon={Dumbbell}
          colorScheme="neon"
        />

        <AdminStatCard
          title="Milestones Claimed"
          value={analytics.total_rewards_claimed}
          subtitle="Roadmap progression rewards"
          icon={Trophy}
          colorScheme="purple"
        />

        <AdminStatCard
          title="7-Day Active Rate"
          value={`${activeRate7d}%`}
          subtitle={`${analytics.active_users_7d} of ${analytics.total_users} athletes`}
          icon={Activity}
          colorScheme="emerald"
        />
      </div>

      {/* Analytics Section: Streak Bracket Histogram & Popular Splits */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Streak Distribution Bracket (Takes 2 Columns on LG) */}
        <div className="lg:col-span-2 rounded-2xl bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-amber-950/40 border border-amber-500/30 text-amber-400">
                  <Flame className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-white tracking-tight uppercase">
                  Streak Cohort Distribution
                </h3>
              </div>
              <span className="text-[11px] font-mono text-zinc-500">
                {totalStreakUsers.toLocaleString()} active streaks
              </span>
            </div>
            <p className="text-xs text-zinc-400 mb-6">
              Athletes grouped by consecutive consistency brackets
            </p>
          </div>

          <div className="space-y-3.5">
            {streakEntries.map(([bracket, count]) => {
              const val = count || 0;
              const percentage = Math.round((val / totalStreakUsers) * 100);
              const barWidth = Math.max(Math.round((val / maxStreakValue) * 100), 2);

              return (
                <div key={bracket} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-zinc-300 font-semibold">
                      {bracket === '0' ? '0 Days (Cold)' : `${bracket} Days`}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-zinc-500 font-mono text-[11px]">{val.toLocaleString()} athletes</span>
                      <span className="font-bold text-white font-mono w-9 text-right">{percentage}%</span>
                    </div>
                  </div>

                  <div className="h-2.5 w-full bg-zinc-950 rounded-full overflow-hidden border border-zinc-800/80">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 via-neon-cyan to-neon-green rounded-full transition-all duration-500"
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-500">
            <span>High-retention threshold begins at 14+ Days</span>
            <Link
              href="/admin/users?sort_by=current_streak&sort_dir=desc"
              className="text-neon-cyan hover:underline flex items-center gap-1 font-semibold"
            >
              Inspect Top Streak Athletes <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Quick Action Navigation Strip */}
        <div className="space-y-6">
          <div className="rounded-2xl bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 p-6">
            <h3 className="text-sm font-bold text-white tracking-tight uppercase mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-neon-green" />
              Quick Command Hub
            </h3>

            <div className="space-y-2.5">
              <Link
                href="/admin/users"
                className="flex items-center justify-between p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-800/40 transition-all text-xs font-semibold text-zinc-300 hover:text-white group"
              >
                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                  <span>Athletes Directory</span>
                </div>
                <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
              </Link>

              <Link
                href="/admin/catalog/items"
                className="flex items-center justify-between p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-800/40 transition-all text-xs font-semibold text-zinc-300 hover:text-white group"
              >
                <div className="flex items-center gap-2.5">
                  <Package className="w-4 h-4 text-neon-green group-hover:scale-110 transition-transform" />
                  <span>Master Item Catalog</span>
                </div>
                <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-neon-green group-hover:translate-x-0.5 transition-all" />
              </Link>

              <Link
                href="/admin/catalog/rewards"
                className="flex items-center justify-between p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-800/40 transition-all text-xs font-semibold text-zinc-300 hover:text-white group"
              >
                <div className="flex items-center gap-2.5">
                  <Trophy className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
                  <span>Roadmap Milestones</span>
                </div>
                <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-purple-400 group-hover:translate-x-0.5 transition-all" />
              </Link>

              <Link
                href="/admin/audit-logs"
                className="flex items-center justify-between p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-800/40 transition-all text-xs font-semibold text-zinc-300 hover:text-white group"
              >
                <div className="flex items-center gap-2.5">
                  <ScrollText className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                  <span>Audit Trail Logs</span>
                </div>
                <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
              </Link>
            </div>
          </div>

          {/* Top Used Consumable Items */}
          <div className="rounded-2xl bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 p-6">
            <h3 className="text-sm font-bold text-white tracking-tight uppercase mb-4 flex items-center gap-2">
              <Package className="w-4 h-4 text-neon-cyan" />
              Top Used Items
            </h3>

            {analytics.top_used_items && analytics.top_used_items.length > 0 ? (
              <div className="space-y-3">
                {analytics.top_used_items.map((item, idx) => (
                  <div
                    key={item.item_id || idx}
                    className="flex items-center justify-between text-xs p-2 rounded-lg bg-zinc-950/40 border border-zinc-800/60"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center font-bold text-[10px] text-zinc-400 font-mono">
                        #{idx + 1}
                      </span>
                      <span className="font-semibold text-zinc-200">{item.item_name || item.item_id}</span>
                    </div>
                    <span className="font-mono font-bold text-neon-cyan">
                      {item.count.toLocaleString()} uses
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-zinc-500 italic">No consumable item usage logged yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Popular Workout Splits Breakdown */}
      {analytics.popular_workout_types && analytics.popular_workout_types.length > 0 && (
        <div className="rounded-2xl bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 p-6">
          <h3 className="text-sm font-bold text-white tracking-tight uppercase mb-4 flex items-center gap-2">
            <Dumbbell className="w-4 h-4 text-neon-green" />
            Popular Workout Types & Splits
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {analytics.popular_workout_types.map((split) => (
              <div
                key={split.workout_type}
                className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800 flex flex-col justify-between"
              >
                <span className="text-xs font-bold text-white tracking-tight truncate">
                  {split.workout_type}
                </span>
                <span className="text-lg font-black text-neon-green font-mono mt-2">
                  {split.count.toLocaleString()}
                </span>
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider">sessions logged</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
