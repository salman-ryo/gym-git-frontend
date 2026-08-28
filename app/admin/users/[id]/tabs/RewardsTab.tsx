'use client';

import React, { useEffect, useState, useCallback } from 'react';
import {
  Trophy,
  Plus,
  Trash2,
  Package,
  Calendar,
  Flame,
  X,
  Loader2,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { adminService } from '@/lib/admin-service';
import {
  AdminUserDetail,
  AdminUserClaimedReward,
  AdminRewardPlan,
  AdminItem,
} from '@/lib/admin-types';
import AdminDataTable, { AdminColumn } from '@/components/admin/ui/AdminDataTable';
import AdminConfirmModal from '@/components/admin/ui/AdminConfirmModal';

interface RewardsTabProps {
  userDetail: AdminUserDetail;
  onRefresh: () => Promise<void>;
}

export function RewardsTab({ userDetail, onRefresh }: RewardsTabProps) {
  const { user } = userDetail;
  const [claims, setClaims] = useState<AdminUserClaimedReward[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Available Roadmap Plans & Items for force-grant
  const [plans, setPlans] = useState<AdminRewardPlan[]>([]);
  const [catalogItems, setCatalogItems] = useState<AdminItem[]>([]);

  // Grant Modal States
  const [isGrantOpen, setIsGrantOpen] = useState(false);
  const [grantPlanId, setGrantPlanId] = useState('');
  const [grantStreakTarget, setGrantStreakTarget] = useState<number>(30);
  const [grantItemId, setGrantItemId] = useState('');
  const [grantLoading, setGrantLoading] = useState(false);
  const [grantError, setGrantError] = useState<string | null>(null);

  // Revoke Modal States
  const [revokeTarget, setRevokeTarget] = useState<AdminUserClaimedReward | null>(null);
  const [revokeLoading, setRevokeLoading] = useState(false);

  const fetchClaimsData = useCallback(async (isManual = false) => {
    if (isManual) setRefreshing(true);

    try {
      const [fetchedClaims, fetchedPlans, fetchedItems] = await Promise.all([
        adminService.getUserRewardClaims(user.id),
        adminService.getRewardPlans(),
        adminService.getItems(),
      ]);

      setClaims(fetchedClaims);
      setPlans(fetchedPlans);
      setCatalogItems(fetchedItems);

      if (fetchedPlans.length > 0) {
        setGrantPlanId(fetchedPlans[0].id);
      }
      if (fetchedItems.length > 0) {
        setGrantItemId(fetchedItems[0].id);
      }
    } catch (err) {
      console.error('[RewardsTab] Failed to load claimed rewards:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user.id]);

  useEffect(() => {
    let isMounted = true;
    async function loadInitial() {
      try {
        const [fetchedClaims, fetchedPlans, fetchedItems] = await Promise.all([
          adminService.getUserRewardClaims(user.id),
          adminService.getRewardPlans(),
          adminService.getItems(),
        ]);
        if (isMounted) {
          setClaims(fetchedClaims);
          setPlans(fetchedPlans);
          setCatalogItems(fetchedItems);
          if (fetchedPlans.length > 0) {
            setGrantPlanId(fetchedPlans[0].id);
          }
          if (fetchedItems.length > 0) {
            setGrantItemId(fetchedItems[0].id);
          }
        }
      } catch (err) {
        console.error('[RewardsTab] Failed to load claimed rewards:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadInitial();
    return () => {
      isMounted = false;
    };
  }, [user.id]);

  const handleForceGrantClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    setGrantError(null);

    if (!grantPlanId || !grantItemId || grantStreakTarget <= 0) {
      setGrantError('Please fill out all milestone parameters correctly.');
      return;
    }

    try {
      setGrantLoading(true);
      await adminService.grantUserMilestoneClaim(user.id, {
        plan_id: grantPlanId,
        streak_target: Number(grantStreakTarget),
        item_id: grantItemId,
      });
      setIsGrantOpen(false);
      await fetchClaimsData(true);
      await onRefresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to force-grant milestone.';
      setGrantError(msg);
    } finally {
      setGrantLoading(false);
    }
  };

  const handleRevokeClaim = async () => {
    if (!revokeTarget) return;
    try {
      setRevokeLoading(true);
      const claimId = revokeTarget.claim_id || revokeTarget.id;
      await adminService.revokeUserMilestoneClaim(user.id, claimId);
      setRevokeTarget(null);
      await fetchClaimsData(true);
      await onRefresh();
    } catch (err) {
      console.error('[RewardsTab] Revoke claim failed:', err);
    } finally {
      setRevokeLoading(false);
    }
  };

  const columns: AdminColumn<AdminUserClaimedReward>[] = [
    {
      key: 'streak_target',
      header: 'Streak Target',
      width: '160px',
      render: (item) => (
        <div className="flex items-center gap-2 font-mono">
          <Flame className="w-4 h-4 text-amber-400" />
          <span className="font-black text-white text-xs">Day {item.streak_target}</span>
        </div>
      ),
    },
    {
      key: 'item_reward',
      header: 'Item Granted',
      render: (item) => (
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4 text-neon-green" />
          <span className="font-bold text-white text-xs">{item.quantity}x {item.item_name || item.item_id}</span>
        </div>
      ),
    },
    {
      key: 'plan_id',
      header: 'Roadmap Plan',
      render: (item) => (
        <span className="font-mono text-zinc-400 text-[11px] px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800">
          {item.plan_id}
        </span>
      ),
    },
    {
      key: 'claimed_at',
      header: 'Claimed Timestamp',
      render: (item) => (
        <div className="flex items-center gap-1.5 text-zinc-400 text-[11px] font-mono">
          <Calendar className="w-3.5 h-3.5 text-zinc-500" />
          <span>{item.claimed_at ? new Date(item.claimed_at).toLocaleString() : '—'}</span>
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Revoke',
      width: '90px',
      render: (item) => (
        <button
          onClick={() => setRevokeTarget(item)}
          className="p-1.5 rounded-lg border border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-rose-400 hover:border-rose-500/40 transition-colors"
          title="Revoke Milestone Claim"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="rounded-2xl bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-white tracking-tight uppercase flex items-center gap-2">
            <Trophy className="w-4 h-4 text-purple-400" />
            Claimed Roadmap Milestones ({claims.length})
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Audit milestones unlocked and claimed by this athlete across progression cycles
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchClaimsData(true)}
            disabled={refreshing}
            className="px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white transition-all text-xs font-semibold flex items-center gap-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-neon-cyan' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={() => {
              setGrantStreakTarget(30);
              setGrantError(null);
              setIsGrantOpen(true);
            }}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white transition-all text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-[0_0_15px_rgba(168,85,247,0.3)]"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Force-Grant Milestone</span>
          </button>
        </div>
      </div>

      {/* Claims Data Table */}
      <AdminDataTable
        data={claims}
        columns={columns}
        loading={loading}
        keyExtractor={(item) => item.claim_id || item.id}
        emptyTitle="No Milestones Claimed"
        emptyDescription="This athlete has not claimed any roadmap progression milestones yet."
      />

      {/* Force Grant Modal */}
      {isGrantOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-2xl bg-zinc-950 border border-purple-500/40 p-6 shadow-2xl">
            <button
              onClick={() => setIsGrantOpen(false)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-300 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-black text-white tracking-tight mb-1">
              Force-Grant Milestone Claim
            </h3>
            <p className="text-xs text-zinc-400 mb-4">
              Manually mark a roadmap milestone as claimed and deposit rewards to <strong className="text-white">{user.email}</strong>.
            </p>

            {grantError && (
              <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-500/30 text-rose-300 text-xs mb-4 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{grantError}</span>
              </div>
            )}

            <form onSubmit={handleForceGrantClaim} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold uppercase text-zinc-400 mb-1">Select Roadmap Plan</label>
                <select
                  value={grantPlanId}
                  onChange={(e) => setGrantPlanId(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-purple-500 rounded-xl px-3.5 py-2.5 text-white focus:outline-none"
                  required
                >
                  {plans.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.id})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold uppercase text-zinc-400 mb-1">Streak Target (Days)</label>
                <input
                  type="number"
                  value={grantStreakTarget}
                  onChange={(e) => setGrantStreakTarget(Number(e.target.value))}
                  min={1}
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-purple-500 rounded-xl px-3.5 py-2.5 text-white font-mono focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold uppercase text-zinc-400 mb-1">Reward Item</label>
                <select
                  value={grantItemId}
                  onChange={(e) => setGrantItemId(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-purple-500 rounded-xl px-3.5 py-2.5 text-white focus:outline-none"
                  required
                >
                  {catalogItems.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.name} ({i.id})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsGrantOpen(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={grantLoading}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs uppercase flex items-center gap-2"
                >
                  {grantLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Force Claim Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Revoke Confirmation Modal */}
      <AdminConfirmModal
        isOpen={!!revokeTarget}
        onClose={() => setRevokeTarget(null)}
        onConfirm={handleRevokeClaim}
        loading={revokeLoading}
        title="Revoke Milestone Claim"
        description={`Are you sure you want to revoke the Day ${revokeTarget?.streak_target} milestone claim? The athlete will be permitted to re-claim this reward if eligible.`}
        variant="warning"
        confirmText="Revoke Claim"
      />
    </div>
  );
}
