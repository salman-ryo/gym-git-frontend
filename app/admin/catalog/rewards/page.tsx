'use client';

import React, { useEffect, useState, useCallback } from 'react';
import {
  Trophy,
  Plus,
  Edit2,
  Trash2,
  RefreshCw,
  Flame,
  Package,
  Layers,
  X,
  Loader2,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { adminService } from '@/lib/admin-service';
import {
  AdminRewardPlan,
  AdminMilestone,
  AdminItem,
  CreateRewardPlanRequest,
  UpsertMilestoneRequest,
} from '@/lib/admin-types';
import AdminConfirmModal from '@/components/admin/ui/AdminConfirmModal';
import CyberpunkLoader from '@/components/CyberpunkLoader';

export default function AdminRewardsCatalogPage() {
  const [plans, setPlans] = useState<AdminRewardPlan[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [currentPlan, setCurrentPlan] = useState<AdminRewardPlan | null>(null);
  const [catalogItems, setCatalogItems] = useState<AdminItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [planLoading, setPlanLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Plan Modal
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<AdminRewardPlan | null>(null);
  const [planFormId, setPlanFormId] = useState('');
  const [planFormName, setPlanFormName] = useState('');
  const [planFormDescription, setPlanFormDescription] = useState('');
  const [planFormIsActive, setPlanFormIsActive] = useState(true);
  const [planFormLoading, setPlanFormLoading] = useState(false);
  const [planFormError, setPlanFormError] = useState<string | null>(null);
  const [deleteTargetPlan, setDeleteTargetPlan] = useState<AdminRewardPlan | null>(null);

  // Milestone Modal
  const [isMilestoneModalOpen, setIsMilestoneModalOpen] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<AdminMilestone | null>(null);
  const [msTargetStreak, setMsTargetStreak] = useState<number>(7);
  const [msItemId, setMsItemId] = useState<string>('');
  const [msQuantity, setMsQuantity] = useState<number>(1);
  const [msMetadataStr, setMsMetadataStr] = useState<string>('{}');
  const [msFormLoading, setMsFormLoading] = useState(false);
  const [msFormError, setMsFormError] = useState<string | null>(null);
  const [deleteTargetMilestone, setDeleteTargetMilestone] = useState<AdminMilestone | null>(null);

  const fetchCatalogData = useCallback(async (isManual = false) => {
    if (isManual) setRefreshing(true);

    try {
      const [fetchedPlans, fetchedItems] = await Promise.all([
        adminService.getRewardPlans(),
        adminService.getItems(),
      ]);

      setPlans(fetchedPlans);
      setCatalogItems(fetchedItems);

      if (fetchedPlans.length > 0) {
        setSelectedPlanId((prev) => {
          if (prev && fetchedPlans.some((p) => p.id === prev)) {
            return prev;
          }
          return fetchedPlans[0].id;
        });
      }
    } catch (err) {
      console.error('[RewardsCatalog] Failed to load rewards catalog:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const loadPlanDetails = useCallback(async (id: string) => {
    try {
      setPlanLoading(true);
      const planDetail = await adminService.getRewardPlan(id);
      setCurrentPlan(planDetail);
    } catch (err) {
      console.error('[RewardsCatalog] Failed to load plan detail:', err);
    } finally {
      setPlanLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    async function loadInitial() {
      try {
        const [fetchedPlans, fetchedItems] = await Promise.all([
          adminService.getRewardPlans(),
          adminService.getItems(),
        ]);
        if (isMounted) {
          setPlans(fetchedPlans);
          setCatalogItems(fetchedItems);
          if (fetchedPlans.length > 0) {
            setSelectedPlanId(fetchedPlans[0].id);
          }
        }
      } catch (err) {
        console.error('[RewardsCatalog] Failed to load rewards catalog:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadInitial();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedPlanId) return;
    const planId: string = selectedPlanId;
    let isMounted = true;
    const fetchPlan = async (id: string) => {
      try {
        const planDetail = await adminService.getRewardPlan(id);
        if (isMounted) setCurrentPlan(planDetail);
      } catch (err) {
        console.error('[RewardsCatalog] Failed to load plan detail:', err);
      } finally {
        if (isMounted) setPlanLoading(false);
      }
    };
    fetchPlan(planId);
    return () => {
      isMounted = false;
    };
  }, [selectedPlanId]);

  // Plan Handlers
  const openCreatePlanModal = () => {
    setEditingPlan(null);
    setPlanFormId('');
    setPlanFormName('');
    setPlanFormDescription('');
    setPlanFormIsActive(true);
    setPlanFormError(null);
    setIsPlanModalOpen(true);
  };

  const openEditPlanModal = (plan: AdminRewardPlan) => {
    setEditingPlan(plan);
    setPlanFormId(plan.id);
    setPlanFormName(plan.name);
    setPlanFormDescription(plan.description || '');
    setPlanFormIsActive(plan.is_active ?? true);
    setPlanFormError(null);
    setIsPlanModalOpen(true);
  };

  const handleSavePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setPlanFormError(null);

    if (!planFormName.trim()) {
      setPlanFormError('Plan Name is required');
      return;
    }

    if (!editingPlan && !planFormId.trim()) {
      setPlanFormError('Plan ID slug is required');
      return;
    }

    try {
      setPlanFormLoading(true);
      if (editingPlan) {
        await adminService.updateRewardPlan(editingPlan.id, {
          name: planFormName.trim(),
          description: planFormDescription.trim(),
          is_active: planFormIsActive,
        });
      } else {
        const payload: CreateRewardPlanRequest = {
          id: planFormId.trim().toLowerCase().replace(/\s+/g, '-'),
          name: planFormName.trim(),
          description: planFormDescription.trim(),
          is_active: planFormIsActive,
        };
        await adminService.createRewardPlan(payload);
        setSelectedPlanId(payload.id);
      }

      setIsPlanModalOpen(false);
      await fetchCatalogData(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save reward plan.';
      setPlanFormError(msg);
    } finally {
      setPlanFormLoading(false);
    }
  };

  const handleDeletePlan = async () => {
    if (!deleteTargetPlan) return;
    try {
      await adminService.deleteRewardPlan(deleteTargetPlan.id);
      setDeleteTargetPlan(null);
      await fetchCatalogData(true);
    } catch (err) {
      console.error('[RewardsCatalog] Delete plan failed:', err);
    }
  };

  // Milestone Handlers
  const openUpsertMilestoneModal = (milestone?: AdminMilestone) => {
    if (milestone) {
      setEditingMilestone(milestone);
      setMsTargetStreak(milestone.streak_target);
      setMsItemId(milestone.item_id);
      setMsQuantity(milestone.quantity || 1);
      setMsMetadataStr(JSON.stringify(milestone.metadata || {}, null, 2));
    } else {
      setEditingMilestone(null);
      setMsTargetStreak(30);
      setMsItemId(catalogItems[0]?.id || 'RESTORE_SHIELD');
      setMsQuantity(1);
      setMsMetadataStr('{}');
    }
    setMsFormError(null);
    setIsMilestoneModalOpen(true);
  };

  const handleSaveMilestone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlanId) return;
    setMsFormError(null);

    if (msTargetStreak <= 0) {
      setMsFormError('Streak target must be at least 1 day');
      return;
    }

    if (!msItemId) {
      setMsFormError('Item reward must be selected');
      return;
    }

    let parsedMetadata: Record<string, unknown> = {};
    if (msMetadataStr.trim()) {
      try {
        parsedMetadata = JSON.parse(msMetadataStr);
      } catch {
        setMsFormError('Metadata must be valid JSON');
        return;
      }
    }

    try {
      setMsFormLoading(true);
      const payload: UpsertMilestoneRequest = {
        streak_target: Number(msTargetStreak),
        item_id: msItemId,
        quantity: Number(msQuantity) || 1,
        metadata: parsedMetadata,
      };

      await adminService.upsertMilestone(selectedPlanId, payload);
      setIsMilestoneModalOpen(false);
      await loadPlanDetails(selectedPlanId);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save streak milestone.';
      setMsFormError(msg);
    } finally {
      setMsFormLoading(false);
    }
  };

  const handleDeleteMilestone = async () => {
    if (!selectedPlanId || !deleteTargetMilestone) return;
    try {
      const targetId =
        deleteTargetMilestone.milestone_id ||
        deleteTargetMilestone.id ||
        String(deleteTargetMilestone.streak_target);
      await adminService.deleteMilestone(selectedPlanId, targetId);
      setDeleteTargetMilestone(null);
      await loadPlanDetails(selectedPlanId);
    } catch (err) {
      console.error('[RewardsCatalog] Delete milestone failed:', err);
    }
  };

  // Sort milestones chronologically
  const sortedMilestones = [...(currentPlan?.milestones || [])].sort(
    (a, b) => a.streak_target - b.streak_target
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight uppercase">
            Reward Roadmaps & Progression Ladders
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Author dynamic streak milestone progression ladders, badge targets, and inventory item rewards
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchCatalogData(true)}
            disabled={refreshing}
            className="px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white transition-all text-xs font-semibold flex items-center gap-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-neon-cyan' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={openCreatePlanModal}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white transition-all text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-[0_0_15px_rgba(168,85,247,0.4)]"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>New Roadmap Plan</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-20">
          <CyberpunkLoader text="Loading Reward Roadmaps" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Column: Roadmap Plans Selector List */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-400" />
              Roadmap Plans ({plans.length})
            </h3>

            <div className="space-y-2">
              {plans.map((plan) => {
                const isSelected = selectedPlanId === plan.id;
                return (
                  <div
                    key={plan.id}
                    onClick={() => setSelectedPlanId(plan.id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-zinc-900 border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                        : 'bg-zinc-950/60 border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-900/40'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h4 className="text-xs font-bold text-white tracking-tight">{plan.name}</h4>
                        <p className="font-mono text-[10px] text-zinc-500">{plan.id}</p>
                      </div>
                      {plan.is_active ? (
                        <span className="text-[10px] font-bold text-emerald-400 uppercase">Active</span>
                      ) : (
                        <span className="text-[10px] font-semibold text-zinc-600 uppercase">Inactive</span>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-zinc-800/60 text-[11px] text-zinc-500">
                      <span>{plan.milestones?.length || 0} Milestones</span>
                      <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => openEditPlanModal(plan)}
                          className="p-1 text-zinc-400 hover:text-white transition-colors"
                          title="Edit Plan"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => setDeleteTargetPlan(plan)}
                          className="p-1 text-zinc-400 hover:text-rose-400 transition-colors"
                          title="Delete Plan"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Milestone Ladder Timeline Editor (3 Cols on LG) */}
          <div className="lg:col-span-3 space-y-4">
            {currentPlan ? (
              <div className="rounded-2xl bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 p-6 space-y-6">
                {/* Plan Header Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-zinc-800">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h2 className="text-lg font-black text-white tracking-tight">{currentPlan.name}</h2>
                      {currentPlan.is_active ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3" /> ACTIVE
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-zinc-400 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded-full">
                          <XCircle className="w-3 h-3" /> INACTIVE
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-400 mt-1">
                      {currentPlan.description || 'No description provided for this roadmap.'}
                    </p>
                  </div>

                  <button
                    onClick={() => openUpsertMilestoneModal()}
                    className="px-4 py-2 rounded-xl bg-neon-cyan/10 border border-neon-cyan/40 text-neon-cyan hover:bg-neon-cyan/20 transition-all text-xs font-bold uppercase tracking-wider flex items-center gap-2 self-start sm:self-auto"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
                    <span>Add Milestone</span>
                  </button>
                </div>

                {/* Milestone Ladder Timeline */}
                {planLoading ? (
                  <div className="py-12 text-center text-xs text-zinc-500">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-neon-cyan mb-2" />
                    Loading milestone ladder...
                  </div>
                ) : sortedMilestones.length === 0 ? (
                  <div className="py-12 text-center rounded-xl border border-dashed border-zinc-800 bg-zinc-950/40 p-6">
                    <Trophy className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
                    <p className="text-sm font-bold text-white mb-1">No Streak Milestones Yet</p>
                    <p className="text-xs text-zinc-500 mb-4">
                      Add milestone nodes (e.g. Day 7, Day 14, Day 30) to create a streak progression path.
                    </p>
                    <button
                      onClick={() => openUpsertMilestoneModal()}
                      className="px-3.5 py-1.5 rounded-lg bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan text-xs font-semibold"
                    >
                      + Add First Milestone
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {sortedMilestones.map((ms, idx) => (
                        <div
                          key={ms.id || ms.milestone_id || idx}
                          className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800/90 hover:border-zinc-700 transition-all flex items-start justify-between gap-4 group"
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-400 flex items-center justify-center font-black text-sm shrink-0 font-mono shadow-inner">
                              <Flame className="w-5 h-5 text-amber-400" />
                            </div>

                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-black text-white text-sm">
                                  Day {ms.streak_target}
                                </span>
                                <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
                                  Milestone #{idx + 1}
                                </span>
                              </div>

                              <div className="flex items-center gap-1.5 text-xs text-neon-green font-semibold mt-1">
                                <Package className="w-3.5 h-3.5 text-neon-green" />
                                <span>
                                  {ms.quantity}x {ms.item_name || ms.item_id}
                                </span>
                              </div>

                              {Boolean(ms.metadata?.badge_slug) && (
                                <span className="inline-block mt-1 font-mono text-[10px] text-purple-400 bg-purple-950/50 border border-purple-500/30 px-1.5 py-0.5 rounded">
                                  Badge: {String(ms.metadata?.badge_slug)}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => openUpsertMilestoneModal(ms)}
                              className="p-1.5 rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-neon-cyan hover:border-neon-cyan/40 transition-colors"
                              title="Edit Milestone"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setDeleteTargetMilestone(ms)}
                              className="p-1.5 rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-rose-400 hover:border-rose-500/40 transition-colors"
                              title="Delete Milestone"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-12 text-center rounded-2xl bg-zinc-900/40 border border-zinc-800 text-zinc-500">
                Select a roadmap plan on the left to inspect its milestone ladder.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Create / Edit Plan Modal */}
      {isPlanModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-2xl bg-zinc-950 border border-zinc-800 p-6 shadow-2xl">
            <button
              onClick={() => setIsPlanModalOpen(false)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-300 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-black text-white tracking-tight mb-1">
              {editingPlan ? `Edit Plan: ${editingPlan.name}` : 'Create Reward Roadmap Plan'}
            </h3>
            <p className="text-xs text-zinc-400 mb-5">Configure roadmap identifier and activation state</p>

            {planFormError && (
              <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-500/30 text-rose-300 text-xs mb-4">
                {planFormError}
              </div>
            )}

            <form onSubmit={handleSavePlan} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold uppercase text-zinc-400 mb-1">
                  Plan ID Slug {!editingPlan && <span className="text-purple-400">*</span>}
                </label>
                <input
                  type="text"
                  value={planFormId}
                  onChange={(e) => setPlanFormId(e.target.value)}
                  disabled={!!editingPlan}
                  placeholder="e.g. veteran-roadmap"
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-purple-500 rounded-xl px-3.5 py-2.5 text-white font-mono focus:outline-none disabled:opacity-50"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold uppercase text-zinc-400 mb-1">
                  Plan Name <span className="text-purple-400">*</span>
                </label>
                <input
                  type="text"
                  value={planFormName}
                  onChange={(e) => setPlanFormName(e.target.value)}
                  placeholder="e.g. 100-Day Titan Progression"
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-purple-500 rounded-xl px-3.5 py-2.5 text-white focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold uppercase text-zinc-400 mb-1">Description</label>
                <textarea
                  value={planFormDescription}
                  onChange={(e) => setPlanFormDescription(e.target.value)}
                  rows={2}
                  placeholder="Summary of roadmap ladder and tier criteria..."
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-purple-500 rounded-xl px-3.5 py-2.5 text-white focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
                <span className="font-bold text-white">Active Plan</span>
                <input
                  type="checkbox"
                  checked={planFormIsActive}
                  onChange={(e) => setPlanFormIsActive(e.target.checked)}
                  aria-label="Active Plan"
                  className="w-4 h-4 rounded bg-zinc-950 border-zinc-800 text-purple-600 focus:ring-0 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsPlanModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={planFormLoading}
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-black uppercase tracking-wider flex items-center gap-2"
                >
                  {planFormLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {editingPlan ? 'Save Plan' : 'Create Plan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Upsert Milestone Modal */}
      {isMilestoneModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-2xl bg-zinc-950 border border-zinc-800 p-6 shadow-2xl">
            <button
              onClick={() => setIsMilestoneModalOpen(false)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-300 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-black text-white tracking-tight mb-1">
              {editingMilestone ? `Edit Day ${editingMilestone.streak_target} Milestone` : 'Add Streak Milestone'}
            </h3>
            <p className="text-xs text-zinc-400 mb-5">Set target streak day and item reward payout</p>

            {msFormError && (
              <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-500/30 text-rose-300 text-xs mb-4">
                {msFormError}
              </div>
            )}

            <form onSubmit={handleSaveMilestone} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold uppercase text-zinc-400 mb-1">
                  Target Streak (Days) <span className="text-neon-cyan">*</span>
                </label>
                <input
                  type="number"
                  value={msTargetStreak}
                  onChange={(e) => setMsTargetStreak(Number(e.target.value))}
                  min={1}
                  placeholder="e.g. 30"
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-neon-cyan rounded-xl px-3.5 py-2.5 text-white font-mono focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold uppercase text-zinc-400 mb-1">
                  Reward Item <span className="text-neon-cyan">*</span>
                </label>
                <select
                  value={msItemId}
                  onChange={(e) => setMsItemId(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-neon-cyan rounded-xl px-3.5 py-2.5 text-white focus:outline-none"
                  required
                >
                  {catalogItems.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name} ({item.id})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold uppercase text-zinc-400 mb-1">Reward Quantity</label>
                <input
                  type="number"
                  value={msQuantity}
                  onChange={(e) => setMsQuantity(Number(e.target.value))}
                  min={1}
                  placeholder="1"
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-neon-cyan rounded-xl px-3.5 py-2.5 text-white font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase text-zinc-400 mb-1">Metadata (JSON)</label>
                <textarea
                  value={msMetadataStr}
                  onChange={(e) => setMsMetadataStr(e.target.value)}
                  rows={2}
                  placeholder='{"badge_slug": "titan_badge"}'
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-neon-cyan rounded-xl p-3 text-zinc-300 font-mono text-[11px] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsMilestoneModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={msFormLoading}
                  className="px-5 py-2.5 rounded-xl bg-neon-cyan text-zinc-950 font-black uppercase tracking-wider text-xs flex items-center gap-2 hover:bg-cyan-300 transition-all"
                >
                  {msFormLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Save Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Plan Confirmation Modal */}
      <AdminConfirmModal
        isOpen={!!deleteTargetPlan}
        onClose={() => setDeleteTargetPlan(null)}
        onConfirm={handleDeletePlan}
        title={`Delete Roadmap: ${deleteTargetPlan?.name}`}
        description={`Are you sure you want to remove roadmap plan "${deleteTargetPlan?.id}" and all of its configured milestone targets?`}
        variant="danger"
        confirmText="Delete Roadmap"
      />

      {/* Delete Milestone Confirmation Modal */}
      <AdminConfirmModal
        isOpen={!!deleteTargetMilestone}
        onClose={() => setDeleteTargetMilestone(null)}
        onConfirm={handleDeleteMilestone}
        title={`Delete Day ${deleteTargetMilestone?.streak_target} Milestone`}
        description={`Are you sure you want to remove the Day ${deleteTargetMilestone?.streak_target} reward from this roadmap?`}
        variant="warning"
        confirmText="Remove Milestone"
      />
    </div>
  );
}
