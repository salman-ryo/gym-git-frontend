'use client';

import React, { useState } from 'react';
import {
  Flame,
  Shield,
  Snowflake,
  Wrench,
  Calendar,
  Loader2,
  AlertCircle,
  Play,
  Award,
} from 'lucide-react';
import { adminService } from '@/lib/admin-service';
import { AdminUserDetail, AdminUserStreakDetail } from '@/lib/admin-types';
import AdminStatCard from '@/components/admin/ui/AdminStatCard';
import AdminConfirmModal from '@/components/admin/ui/AdminConfirmModal';

interface StreakTabProps {
  userDetail: AdminUserDetail;
  onRefresh: () => Promise<void>;
}

export function StreakTab({ userDetail, onRefresh }: StreakTabProps) {
  const { user } = userDetail;
  const streak: AdminUserStreakDetail = userDetail.streak_state || {
    user_id: user.id,
    timezone: user.timezone || 'UTC',
    current_streak: 0,
    longest_streak: 0,
    is_frozen: false,
    available_freeze_tokens: 0,
    available_restore_shields: 0,
  };

  // Streak Override Modal States
  const [isOverrideModalOpen, setIsOverrideModalOpen] = useState(false);
  const [overrideCurrent, setOverrideCurrent] = useState<number>(streak.current_streak);
  const [overrideLongest, setOverrideLongest] = useState<number>(streak.longest_streak);
  const [overrideReason, setOverrideReason] = useState('');
  const [overrideLoading, setOverrideLoading] = useState(false);
  const [overrideError, setOverrideError] = useState<string | null>(null);

  // Freeze Modal States
  const [isFreezeModalOpen, setIsFreezeModalOpen] = useState(false);
  const [freezeDays, setFreezeDays] = useState<number>(7);
  const [freezeReason, setFreezeReason] = useState('');
  const [freezeLoading, setFreezeLoading] = useState(false);
  const [freezeError, setFreezeError] = useState<string | null>(null);

  // Unfreeze State
  const [isUnfreezeModalOpen, setIsUnfreezeModalOpen] = useState(false);
  const [unfreezeLoading, setUnfreezeLoading] = useState(false);

  const handleOverrideStreak = async (e: React.FormEvent) => {
    e.preventDefault();
    setOverrideError(null);

    if (!overrideReason.trim()) {
      setOverrideError('An audit reason is required for administrative streak overrides.');
      return;
    }

    try {
      setOverrideLoading(true);
      await adminService.overrideUserStreak(user.id, {
        current_streak: Number(overrideCurrent),
        longest_streak: Number(overrideLongest),
        reason: overrideReason.trim(),
      });
      setIsOverrideModalOpen(false);
      setOverrideReason('');
      await onRefresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to override athlete streak.';
      setOverrideError(msg);
    } finally {
      setOverrideLoading(false);
    }
  };

  const handleApplyFreeze = async (e: React.FormEvent) => {
    e.preventDefault();
    setFreezeError(null);

    if (freezeDays <= 0) {
      setFreezeError('Freeze duration must be at least 1 day.');
      return;
    }

    try {
      setFreezeLoading(true);
      await adminService.freezeUserStreak(user.id, {
        duration_days: Number(freezeDays),
        reason: freezeReason.trim() || undefined,
      });
      setIsFreezeModalOpen(false);
      setFreezeReason('');
      await onRefresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to apply freeze hold.';
      setFreezeError(msg);
    } finally {
      setFreezeLoading(false);
    }
  };

  const handleUnfreeze = async () => {
    try {
      setUnfreezeLoading(true);
      await adminService.unfreezeUserStreak(user.id);
      setIsUnfreezeModalOpen(false);
      await onRefresh();
    } catch (err) {
      console.error('[StreakTab] Unfreeze failed:', err);
    } finally {
      setUnfreezeLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 4-Card Streak Metric Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AdminStatCard
          title="Current Streak"
          value={`${streak.current_streak} Days`}
          subtitle={`Calculated in ${streak.timezone || 'UTC'}`}
          icon={Flame}
          colorScheme="amber"
        />

        <AdminStatCard
          title="Longest Streak Record"
          value={`${streak.longest_streak} Days`}
          subtitle="All-time personal best"
          icon={Award}
          colorScheme="purple"
        />

        <AdminStatCard
          title="Freeze Vault Status"
          value={streak.is_frozen ? 'FROZEN (PAUSED)' : 'ACTIVE (UNFROZEN)'}
          subtitle={`${streak.available_freeze_tokens} Freeze Tokens In Inventory`}
          icon={Snowflake}
          colorScheme={streak.is_frozen ? 'cyan' : 'emerald'}
        />

        <AdminStatCard
          title="Restore Shields"
          value={`${streak.available_restore_shields} Shields`}
          subtitle="Emergency 3-day recovery"
          icon={Shield}
          colorScheme="neon"
        />
      </div>

      {/* Override Actions & Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Streak Repair & Override Box */}
        <div className="rounded-2xl bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-400">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight uppercase">
                Manual Streak Count Repair
              </h3>
              <p className="text-xs text-zinc-400">
                Correct broken streak counts due to technical issues or verified customer support tickets.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-zinc-400 font-semibold">Last Workout Date:</span>
              <span className="font-mono text-white font-bold">
                {streak.last_logged_date || <span className="italic text-zinc-600">No logs yet</span>}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-400 font-semibold">Active Timezone:</span>
              <span className="font-mono text-neon-cyan font-bold">{streak.timezone}</span>
            </div>
          </div>

          <button
            onClick={() => {
              setOverrideCurrent(streak.current_streak);
              setOverrideLongest(streak.longest_streak);
              setOverrideReason('');
              setOverrideError(null);
              setIsOverrideModalOpen(true);
            }}
            className="w-full px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 transition-all text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(245,158,11,0.25)]"
          >
            <Wrench className="w-3.5 h-3.5" />
            Override Streak Counts
          </button>
        </div>

        {/* Ice Pause / Streak Freeze Vault Controls */}
        <div className="rounded-2xl bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-cyan-400">
              <Snowflake className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight uppercase">
                Ice Pause (Sickness / Injury Hold)
              </h3>
              <p className="text-xs text-zinc-400">
                Administratively freeze or unfreeze this athlete’s streak to prevent decay during documented illness.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800 flex items-center justify-between text-xs">
            <span className="text-zinc-400 font-semibold">Ice Pause State:</span>
            {streak.is_frozen ? (
              <span className="font-mono font-bold text-cyan-400 uppercase flex items-center gap-1">
                <Snowflake className="w-3.5 h-3.5 animate-spin" /> FROZEN HOLD ACTIVE
              </span>
            ) : (
              <span className="font-mono font-bold text-emerald-400 uppercase">RUNNING (UNFROZEN)</span>
            )}
          </div>

          <div className="space-y-2">
            {streak.is_frozen ? (
              <button
                onClick={() => setIsUnfreezeModalOpen(true)}
                className="w-full px-4 py-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/50 transition-all text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <Play className="w-3.5 h-3.5" />
                Unfreeze Athlete Streak Immediately
              </button>
            ) : (
              <button
                onClick={() => {
                  setFreezeDays(7);
                  setFreezeReason('');
                  setFreezeError(null);
                  setIsFreezeModalOpen(true);
                }}
                className="w-full px-4 py-2.5 rounded-xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-900/50 transition-all text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(34,211,238,0.15)]"
              >
                <Snowflake className="w-3.5 h-3.5" />
                Apply Administrative Freeze Hold
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Manual Override Modal */}
      {isOverrideModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-2xl bg-zinc-950 border border-zinc-800 p-6 shadow-2xl">
            <h3 className="text-lg font-black text-white tracking-tight mb-1">
              Manual Streak Count Repair
            </h3>
            <p className="text-xs text-zinc-400 mb-4">
              Enter updated streak parameters for <strong className="text-white">{user.email}</strong>.
            </p>

            {overrideError && (
              <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-500/30 text-rose-300 text-xs mb-4 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{overrideError}</span>
              </div>
            )}

            <form onSubmit={handleOverrideStreak} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold uppercase text-zinc-400 mb-1">Current Streak</label>
                  <input
                    type="number"
                    value={overrideCurrent}
                    onChange={(e) => setOverrideCurrent(Number(e.target.value))}
                    min={0}
                    className="w-full bg-zinc-900 border border-zinc-800 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-white font-mono focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold uppercase text-zinc-400 mb-1">Longest Record</label>
                  <input
                    type="number"
                    value={overrideLongest}
                    onChange={(e) => setOverrideLongest(Number(e.target.value))}
                    min={0}
                    className="w-full bg-zinc-900 border border-zinc-800 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-white font-mono focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold uppercase text-zinc-400 mb-1">
                  Audit Reason <span className="text-amber-400">*</span>
                </label>
                <textarea
                  value={overrideReason}
                  onChange={(e) => setOverrideReason(e.target.value)}
                  rows={3}
                  placeholder="e.g. Support ticket #892: Timezone shift glitch on 2026-08-20..."
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-amber-400 rounded-xl p-3 text-white focus:outline-none"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsOverrideModalOpen(false)}
                  disabled={overrideLoading}
                  className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={overrideLoading}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs uppercase flex items-center gap-2"
                >
                  {overrideLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Save Streak Repair
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Administrative Freeze Hold Modal */}
      {isFreezeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-2xl bg-zinc-950 border border-zinc-800 p-6 shadow-2xl">
            <h3 className="text-lg font-black text-white tracking-tight mb-1">
              Apply Administrative Freeze Hold
            </h3>
            <p className="text-xs text-zinc-400 mb-4">
              Freeze streak decay for <strong className="text-white">{user.email}</strong> without consuming user tokens.
            </p>

            {freezeError && (
              <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-500/30 text-rose-300 text-xs mb-4 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{freezeError}</span>
              </div>
            )}

            <form onSubmit={handleApplyFreeze} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold uppercase text-zinc-400 mb-1">
                  Freeze Duration (Days) <span className="text-neon-cyan">*</span>
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="number"
                    value={freezeDays}
                    onChange={(e) => setFreezeDays(Number(e.target.value))}
                    min={1}
                    max={90}
                    className="w-full bg-zinc-900 border border-zinc-800 focus:border-neon-cyan rounded-xl pl-9 pr-3.5 py-2.5 text-white font-mono focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold uppercase text-zinc-400 mb-1">Reason / Notes</label>
                <textarea
                  value={freezeReason}
                  onChange={(e) => setFreezeReason(e.target.value)}
                  rows={2}
                  placeholder="e.g. Medical surgery leave documented by athlete..."
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-neon-cyan rounded-xl p-3 text-white focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsFreezeModalOpen(false)}
                  disabled={freezeLoading}
                  className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={freezeLoading}
                  className="px-4 py-2 rounded-xl bg-neon-cyan hover:bg-cyan-300 text-zinc-950 font-black text-xs uppercase flex items-center gap-2"
                >
                  {freezeLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Apply Freeze Hold
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Unfreeze Confirmation Modal */}
      <AdminConfirmModal
        isOpen={isUnfreezeModalOpen}
        onClose={() => setIsUnfreezeModalOpen(false)}
        onConfirm={handleUnfreeze}
        loading={unfreezeLoading}
        title="Resume Athlete Streak"
        description="Are you sure you want to end the active freeze hold? The athlete's streak counter will resume standard daily tracking."
        variant="info"
        confirmText="End Freeze Hold"
      />
    </div>
  );
}

