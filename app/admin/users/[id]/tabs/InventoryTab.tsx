'use client';

import React, { useEffect, useState } from 'react';
import {
  Package,
  Plus,
  Minus,
  Sparkles,
  Clock,
  Trash2,
  Loader2,
  X,
  AlertCircle,
  Zap,
} from 'lucide-react';
import { adminService } from '@/lib/admin-service';
import {
  AdminUserDetail,
  AdminUserInventoryItem,
  AdminUserActiveEffectDTO,
  AdminItem,
} from '@/lib/admin-types';
import AdminConfirmModal from '@/components/admin/ui/AdminConfirmModal';

interface InventoryTabProps {
  userDetail: AdminUserDetail;
  onRefresh: () => Promise<void>;
}

export function InventoryTab({ userDetail, onRefresh }: InventoryTabProps) {
  const { user } = userDetail;
  const inventory: AdminUserInventoryItem[] = userDetail.inventory || [];
  const activeEffects: AdminUserActiveEffectDTO[] = userDetail.active_effects || [];

  const [catalogItems, setCatalogItems] = useState<AdminItem[]>([]);

  // Grant Item Modal
  const [isGrantOpen, setIsGrantOpen] = useState(false);
  const [grantItemId, setGrantItemId] = useState('');
  const [grantQty, setGrantQty] = useState<number>(1);
  const [grantReason, setGrantReason] = useState('');
  const [grantLoading, setGrantLoading] = useState(false);
  const [grantError, setGrantError] = useState<string | null>(null);

  // Deduct Item Modal
  const [isDeductOpen, setIsDeductOpen] = useState(false);
  const [deductItemId, setDeductItemId] = useState('');
  const [deductQty, setDeductQty] = useState<number>(1);
  const [deductReason, setDeductReason] = useState('');
  const [deductLoading, setDeductLoading] = useState(false);
  const [deductError, setDeductError] = useState<string | null>(null);

  // Grant Timed Buff Modal
  const [isGrantBuffOpen, setIsGrantBuffOpen] = useState(false);
  const [buffItemId, setBuffItemId] = useState('');
  const [buffDuration, setBuffDuration] = useState<number>(86400); // 24h default
  const [buffReason, setBuffReason] = useState('');
  const [buffLoading, setBuffLoading] = useState(false);
  const [buffError, setBuffError] = useState<string | null>(null);

  // Revoke Buff Confirmation
  const [revokeTargetBuff, setRevokeTargetBuff] = useState<AdminUserActiveEffectDTO | null>(null);
  const [revokeLoading, setRevokeLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadCatalog() {
      try {
        const items = await adminService.getItems();
        if (isMounted) {
          setCatalogItems(items);
          if (items.length > 0) {
            setGrantItemId(items[0].id);
            const timedItems = items.filter((i) => i.effect_type === 'time_based');
            if (timedItems.length > 0) {
              setBuffItemId(timedItems[0].id);
            }
          }
        }
      } catch (err) {
        console.error('[InventoryTab] Failed to load catalog items:', err);
      }
    }
    loadCatalog();
    return () => {
      isMounted = false;
    };
  }, []);

  // Format countdown remaining
  const formatRemainingTime = (seconds: number) => {
    if (seconds <= 0) return 'Expired';
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}d ${hours % 24}h remaining`;
    }
    return `${hours}h ${mins}m ${secs}s remaining`;
  };

  const handleGrantInventory = async (e: React.FormEvent) => {
    e.preventDefault();
    setGrantError(null);

    if (!grantItemId) {
      setGrantError('Please select an item to grant.');
      return;
    }

    if (grantQty <= 0) {
      setGrantError('Quantity must be greater than 0.');
      return;
    }

    try {
      setGrantLoading(true);
      await adminService.grantUserInventory(user.id, {
        item_id: grantItemId,
        quantity: Number(grantQty),
        reason: grantReason.trim() || undefined,
      });
      setIsGrantOpen(false);
      setGrantReason('');
      await onRefresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to grant item.';
      setGrantError(msg);
    } finally {
      setGrantLoading(false);
    }
  };

  const handleDeductInventory = async (e: React.FormEvent) => {
    e.preventDefault();
    setDeductError(null);

    if (!deductItemId) {
      setDeductError('Please select an item to deduct.');
      return;
    }

    if (deductQty <= 0) {
      setDeductError('Quantity must be greater than 0.');
      return;
    }

    try {
      setDeductLoading(true);
      await adminService.deductUserInventory(user.id, {
        item_id: deductItemId,
        quantity: Number(deductQty),
        reason: deductReason.trim() || undefined,
      });
      setIsDeductOpen(false);
      setDeductReason('');
      await onRefresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to deduct item.';
      setDeductError(msg);
    } finally {
      setDeductLoading(false);
    }
  };

  const handleGrantBuff = async (e: React.FormEvent) => {
    e.preventDefault();
    setBuffError(null);

    if (!buffItemId) {
      setBuffError('Please select a buff item to grant.');
      return;
    }

    if (buffDuration <= 0) {
      setBuffError('Duration must be greater than 0 seconds.');
      return;
    }

    try {
      setBuffLoading(true);
      await adminService.grantUserEffect(user.id, {
        item_id: buffItemId,
        duration_seconds: Number(buffDuration),
        reason: buffReason.trim() || undefined,
      });
      setIsGrantBuffOpen(false);
      setBuffReason('');
      await onRefresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to grant buff.';
      setBuffError(msg);
    } finally {
      setBuffLoading(false);
    }
  };

  const handleRevokeBuff = async () => {
    if (!revokeTargetBuff) return;
    try {
      setRevokeLoading(true);
      await adminService.revokeUserEffect(user.id, revokeTargetBuff.id);
      setRevokeTargetBuff(null);
      await onRefresh();
    } catch (err) {
      console.error('[InventoryTab] Revoke buff failed:', err);
    } finally {
      setRevokeLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Item Balances Grid */}
      <div className="rounded-2xl bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight uppercase flex items-center gap-2">
              <Package className="w-4 h-4 text-neon-green" />
              Consumable Item Inventory
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Current athlete inventory balances, restoration shields, and consumable tokens
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                if (inventory.length > 0) setDeductItemId(inventory[0].item_id);
                setDeductQty(1);
                setDeductReason('');
                setDeductError(null);
                setIsDeductOpen(true);
              }}
              disabled={inventory.length === 0}
              className="px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 transition-all text-xs font-semibold flex items-center gap-1.5 disabled:opacity-40"
            >
              <Minus className="w-3.5 h-3.5" />
              <span>Deduct</span>
            </button>

            <button
              onClick={() => {
                setGrantQty(1);
                setGrantReason('');
                setGrantError(null);
                setIsGrantOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-neon-green text-zinc-950 hover:bg-emerald-400 transition-all text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,255,136,0.3)]"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Grant Items</span>
            </button>
          </div>
        </div>

        {inventory.length === 0 ? (
          <div className="py-10 text-center rounded-xl border border-dashed border-zinc-800 bg-zinc-950/40 p-6">
            <Package className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
            <p className="text-xs font-bold text-white mb-1">Athlete Inventory Empty</p>
            <p className="text-[11px] text-zinc-500">
              This athlete does not hold any consumable tokens or shields.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {inventory.map((inv) => (
              <div
                key={inv.item_id}
                className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 flex items-center justify-between gap-3 group hover:border-zinc-700 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 text-neon-green flex items-center justify-center font-black text-xs shrink-0 shadow-inner">
                    <Package className="w-5 h-5 text-neon-green" />
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="text-xs font-bold text-white tracking-tight truncate">
                      {inv.item_name || inv.item_details?.name || inv.item_id}
                    </h4>
                    <p className="font-mono text-[10px] text-zinc-500 truncate">{inv.item_id}</p>
                  </div>
                </div>

                <div className="px-3 py-1 rounded-lg bg-neon-green/10 border border-neon-green/30 text-neon-green font-mono font-black text-sm">
                  x{inv.quantity}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. Active Timed Buffs */}
      <div className="rounded-2xl bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight uppercase flex items-center gap-2">
              <Zap className="w-4 h-4 text-purple-400" />
              Active Timed Buffs & Multipliers
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Live timed status effects, XP boosts, and score enhancements active on this athlete
            </p>
          </div>

          <button
            onClick={() => {
              setBuffDuration(86400);
              setBuffReason('');
              setBuffError(null);
              setIsGrantBuffOpen(true);
            }}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white transition-all text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_15px_rgba(168,85,247,0.3)] self-start sm:self-auto"
          >
            <Sparkles className="w-4 h-4" />
            <span>Apply Timed Buff</span>
          </button>
        </div>

        {activeEffects.length === 0 ? (
          <div className="py-8 text-center rounded-xl border border-dashed border-zinc-800 bg-zinc-950/40 p-6">
            <Clock className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
            <p className="text-xs font-bold text-white mb-1">No Active Timed Buffs</p>
            <p className="text-[11px] text-zinc-500">
              There are currently no active timed power-ups running on this athlete.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {activeEffects.map((effect) => (
              <div
                key={effect.id}
                className="p-4 rounded-xl bg-zinc-950/80 border border-purple-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-950/60 border border-purple-500/40 text-purple-400 flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white tracking-tight">
                      {effect.item_name || effect.item_id}
                    </h4>
                    <div className="flex items-center gap-3 text-[11px] text-zinc-400 font-mono mt-0.5">
                      <span>Expires: {new Date(effect.expires_at).toLocaleString()}</span>
                      <span className="text-purple-300 font-bold">
                        {formatRemainingTime(effect.remaining_seconds)}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setRevokeTargetBuff(effect)}
                  className="px-3 py-1.5 rounded-lg bg-rose-950/40 border border-rose-500/30 text-rose-300 hover:bg-rose-900/40 transition-all text-xs font-semibold flex items-center gap-1.5 self-end sm:self-auto"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Cancel Buff</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Grant Items Modal */}
      {isGrantOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-2xl bg-zinc-950 border border-zinc-800 p-6 shadow-2xl">
            <button
              onClick={() => setIsGrantOpen(false)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-300 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-black text-white tracking-tight mb-1">
              Grant Consumable Items
            </h3>
            <p className="text-xs text-zinc-400 mb-4">
              Add tokens, shields or items to <strong className="text-white">{user.email}</strong>.
            </p>

            {grantError && (
              <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-500/30 text-rose-300 text-xs mb-4 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{grantError}</span>
              </div>
            )}

            <form onSubmit={handleGrantInventory} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold uppercase text-zinc-400 mb-1">Select Catalog Item</label>
                <select
                  value={grantItemId}
                  onChange={(e) => setGrantItemId(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-neon-green rounded-xl px-3.5 py-2.5 text-white focus:outline-none"
                  required
                >
                  {catalogItems.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.name} ({i.id})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold uppercase text-zinc-400 mb-1">Quantity to Grant</label>
                <input
                  type="number"
                  value={grantQty}
                  onChange={(e) => setGrantQty(Number(e.target.value))}
                  min={1}
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-neon-green rounded-xl px-3.5 py-2.5 text-white font-mono focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold uppercase text-zinc-400 mb-1">Audit Reason / Support Ticket</label>
                <textarea
                  value={grantReason}
                  onChange={(e) => setGrantReason(e.target.value)}
                  rows={2}
                  placeholder="e.g. Support ticket #419: Compensation for sync delay..."
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-neon-green rounded-xl p-3 text-white focus:outline-none"
                />
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
                  className="px-4 py-2 rounded-xl bg-neon-green text-zinc-950 font-black text-xs uppercase flex items-center gap-2 hover:bg-emerald-400"
                >
                  {grantLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Confirm Grant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Deduct Items Modal */}
      {isDeductOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-2xl bg-zinc-950 border border-zinc-800 p-6 shadow-2xl">
            <button
              onClick={() => setIsDeductOpen(false)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-300 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-black text-white tracking-tight mb-1">
              Deduct Consumable Items
            </h3>
            <p className="text-xs text-zinc-400 mb-4">
              Remove tokens or shields from <strong className="text-white">{user.email}</strong>.
            </p>

            {deductError && (
              <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-500/30 text-rose-300 text-xs mb-4 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{deductError}</span>
              </div>
            )}

            <form onSubmit={handleDeductInventory} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold uppercase text-zinc-400 mb-1">Select Held Item</label>
                <select
                  value={deductItemId}
                  onChange={(e) => setDeductItemId(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-neon-cyan rounded-xl px-3.5 py-2.5 text-white focus:outline-none"
                  required
                >
                  {inventory.map((inv) => (
                    <option key={inv.item_id} value={inv.item_id}>
                      {inv.item_name || inv.item_id} (Balance: {inv.quantity})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold uppercase text-zinc-400 mb-1">Quantity to Deduct</label>
                <input
                  type="number"
                  value={deductQty}
                  onChange={(e) => setDeductQty(Number(e.target.value))}
                  min={1}
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-neon-cyan rounded-xl px-3.5 py-2.5 text-white font-mono focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold uppercase text-zinc-400 mb-1">Reason</label>
                <textarea
                  value={deductReason}
                  onChange={(e) => setDeductReason(e.target.value)}
                  rows={2}
                  placeholder="e.g. Accidental double claim repair..."
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-neon-cyan rounded-xl p-3 text-white focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsDeductOpen(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={deductLoading}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs uppercase flex items-center gap-2"
                >
                  {deductLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Confirm Deduction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Grant Timed Buff Modal */}
      {isGrantBuffOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-2xl bg-zinc-950 border border-purple-500/40 p-6 shadow-2xl">
            <button
              onClick={() => setIsGrantBuffOpen(false)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-300 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-black text-white tracking-tight mb-1">
              Apply Timed Buff Multiplier
            </h3>
            <p className="text-xs text-zinc-400 mb-4">
              Directly activate a timed power-up on <strong className="text-white">{user.email}</strong>.
            </p>

            {buffError && (
              <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-500/30 text-rose-300 text-xs mb-4 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{buffError}</span>
              </div>
            )}

            <form onSubmit={handleGrantBuff} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold uppercase text-zinc-400 mb-1">Select Buff Item</label>
                <select
                  value={buffItemId}
                  onChange={(e) => setBuffItemId(e.target.value)}
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

              <div>
                <label className="block font-semibold uppercase text-zinc-400 mb-1">Duration (Seconds)</label>
                <input
                  type="number"
                  value={buffDuration}
                  onChange={(e) => setBuffDuration(Number(e.target.value))}
                  min={60}
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-purple-500 rounded-xl px-3.5 py-2.5 text-white font-mono focus:outline-none"
                  required
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setBuffDuration(3600)}
                  className="px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-300 font-mono"
                >
                  1 Hour
                </button>
                <button
                  type="button"
                  onClick={() => setBuffDuration(86400)}
                  className="px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-300 font-mono"
                >
                  24 Hours
                </button>
                <button
                  type="button"
                  onClick={() => setBuffDuration(604800)}
                  className="px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-300 font-mono"
                >
                  7 Days
                </button>
              </div>

              <div>
                <label className="block font-semibold uppercase text-zinc-400 mb-1">Reason / Notes</label>
                <textarea
                  value={buffReason}
                  onChange={(e) => setBuffReason(e.target.value)}
                  rows={2}
                  placeholder="e.g. Promotional event reward..."
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-purple-500 rounded-xl p-3 text-white focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsGrantBuffOpen(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={buffLoading}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs uppercase flex items-center gap-2"
                >
                  {buffLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Apply Buff
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Revoke Buff Confirmation Modal */}
      <AdminConfirmModal
        isOpen={!!revokeTargetBuff}
        onClose={() => setRevokeTargetBuff(null)}
        onConfirm={handleRevokeBuff}
        loading={revokeLoading}
        title="Cancel Active Timed Buff"
        description={`Are you sure you want to cancel active buff "${revokeTargetBuff?.item_name || revokeTargetBuff?.item_id}" immediately?`}
        variant="warning"
        confirmText="Cancel Buff Now"
      />
    </div>
  );
}
