'use client';

import React, { useEffect, useState, useCallback, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  User as UserIcon,
  Flame,
  Package,
  Trophy,
  Dumbbell,
  ArrowLeft,
  RefreshCw,
  Clock,
  Key,
} from 'lucide-react';
import { adminService } from '@/lib/admin-service';
import { AdminUserDetail } from '@/lib/admin-types';
import AdminStatusBadge from '@/components/admin/ui/AdminStatusBadge';
import CyberpunkLoader from '@/components/CyberpunkLoader';

import { ProfileTab } from './tabs/ProfileTab';
import { StreakTab } from './tabs/StreakTab';
import { InventoryTab } from './tabs/InventoryTab';
import { RewardsTab } from './tabs/RewardsTab';
import { LogsTab } from './tabs/LogsTab';

type UserTab = 'profile' | 'streak' | 'inventory' | 'rewards' | 'logs';

export default function AdminUser360Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const unwrappedParams = use(params);
  const userId = unwrappedParams.id;
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<UserTab>('profile');
  const [userDetail, setUserDetail] = useState<AdminUserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserDetail = useCallback(
    async (isManual = false) => {
      if (isManual) setRefreshing(true);
      setError(null);

      try {
        const data = await adminService.getUserDetail(userId);
        setUserDetail(data);
      } catch (err) {
        console.error('[User360] Failed to load composite user detail:', err);
        setError('Athlete not found or failed to load profile data.');
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [userId]
  );

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const data = await adminService.getUserDetail(userId);
        if (isMounted) setUserDetail(data);
      } catch (err) {
        console.error('[User360] Failed to load composite user detail:', err);
        if (isMounted) setError('Athlete not found or failed to load profile data.');
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, [userId]);

  if (loading) {
    return (
      <div className="py-20">
        <CyberpunkLoader text="Compiling Athlete 360 Profile" />
      </div>
    );
  }

  if (error || !userDetail) {
    return (
      <div className="p-8 rounded-2xl bg-zinc-900/60 border border-zinc-800 text-center max-w-lg mx-auto mt-12">
        <h3 className="text-base font-bold text-white mb-2">Athlete Inspection Failed</h3>
        <p className="text-xs text-zinc-400 mb-6">{error || 'Unable to locate user records.'}</p>
        <button
          onClick={() => router.push('/admin/users')}
          className="px-4 py-2 rounded-xl bg-zinc-800 text-white hover:bg-zinc-700 transition-all text-xs font-bold uppercase tracking-wider"
        >
          Return to Directory
        </button>
      </div>
    );
  }

  const { user } = userDetail;

  const TABS = [
    { key: 'profile' as UserTab, label: 'Profile & Account', icon: UserIcon },
    { key: 'streak' as UserTab, label: 'Streak & Ice Pause', icon: Flame },
    { key: 'inventory' as UserTab, label: 'Inventory & Buffs', icon: Package },
    { key: 'rewards' as UserTab, label: 'Roadmap Claims', icon: Trophy },
    { key: 'logs' as UserTab, label: 'Workout History', icon: Dumbbell },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Navigation Breadcrumb Back link */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/users"
          className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Athletes Directory</span>
        </Link>

        <button
          onClick={() => fetchUserDetail(true)}
          disabled={refreshing}
          className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white text-xs flex items-center gap-1.5"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-neon-cyan' : ''}`} />
          <span>Sync Profile</span>
        </button>
      </div>

      {/* Composite Athlete Header Banner */}
      <div className="rounded-2xl bg-zinc-900/90 backdrop-blur-xl border border-zinc-800 p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-neon-green to-neon-cyan flex items-center justify-center text-zinc-950 font-black text-2xl shadow-[0_0_20px_rgba(0,255,136,0.3)] shrink-0">
              {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-xl font-black text-white tracking-tight">
                  {user.name || 'Unnamed Athlete'}
                </h1>
                <AdminStatusBadge role={user.role} variant="role" size="sm" />
                <AdminStatusBadge status={user.status} variant="status" size="sm" />
              </div>

              <p className="text-xs text-zinc-400 font-mono mt-1 select-all">{user.email}</p>

              <div className="flex flex-wrap items-center gap-3 mt-2 text-[11px] text-zinc-500 font-mono">
                <span className="flex items-center gap-1">
                  <Key className="w-3 h-3 text-zinc-600" />
                  ID: <span className="text-zinc-400">{user.id}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-zinc-600" />
                  TZ: <span className="text-neon-cyan font-bold">{user.timezone || 'UTC'}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation Strip */}
        <div className="flex items-center gap-2 overflow-x-auto pt-6 mt-6 border-t border-zinc-800/80 scrollbar-none">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shrink-0 ${
                  isActive
                    ? 'bg-zinc-800 text-white border border-neon-cyan/50 shadow-[0_0_15px_rgba(34,211,238,0.15)]'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-950/60'
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? 'text-neon-cyan' : 'text-zinc-500'
                  }`}
                />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Viewport */}
      <div>
        {activeTab === 'profile' && (
          <ProfileTab userDetail={userDetail} onRefresh={() => fetchUserDetail(true)} />
        )}
        {activeTab === 'streak' && (
          <StreakTab userDetail={userDetail} onRefresh={() => fetchUserDetail(true)} />
        )}
        {activeTab === 'inventory' && (
          <InventoryTab userDetail={userDetail} onRefresh={() => fetchUserDetail(true)} />
        )}
        {activeTab === 'rewards' && (
          <RewardsTab userDetail={userDetail} onRefresh={() => fetchUserDetail(true)} />
        )}
        {activeTab === 'logs' && (
          <LogsTab userDetail={userDetail} onRefresh={() => fetchUserDetail(true)} />
        )}
      </div>
    </div>
  );
}
