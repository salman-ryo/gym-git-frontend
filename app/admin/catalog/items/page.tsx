'use client';

import React, { useEffect, useState, useCallback } from 'react';
import {
  Package,
  Plus,
  Edit2,
  Trash2,
  RefreshCw,
  Clock,
  Zap,
  CheckCircle2,
  XCircle,
  X,
  Loader2,
} from 'lucide-react';
import { adminService } from '@/lib/admin-service';
import { AdminItem, CreateItemRequest, ItemEffectType } from '@/lib/admin-types';
import AdminDataTable, { AdminColumn } from '@/components/admin/ui/AdminDataTable';
import AdminConfirmModal from '@/components/admin/ui/AdminConfirmModal';
import CyberpunkLoader from '@/components/CyberpunkLoader';

export default function AdminItemsCatalogPage() {
  const [items, setItems] = useState<AdminItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AdminItem | null>(null);
  const [deleteTargetItem, setDeleteTargetItem] = useState<AdminItem | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  // Form inputs
  const [formId, setFormId] = useState('');
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formEffectType, setFormEffectType] = useState<ItemEffectType>('instant_use');
  const [formDuration, setFormDuration] = useState<number>(0);
  const [formIconUrl, setFormIconUrl] = useState('');
  const [formIsActive, setFormIsActive] = useState(true);
  const [formMetadataStr, setFormMetadataStr] = useState('{}');
  const [formError, setFormError] = useState<string | null>(null);

  const fetchItems = useCallback(async (isManual = false) => {
    if (isManual) setRefreshing(true);

    try {
      const data = await adminService.getItems();
      setItems(data);
    } catch (err) {
      console.error('[ItemsCatalog] Failed to load catalog:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const data = await adminService.getItems();
        if (isMounted) setItems(data);
      } catch (err) {
        console.error('[ItemsCatalog] Failed to load catalog:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const openCreateModal = () => {
    setEditingItem(null);
    setFormId('');
    setFormName('');
    setFormDescription('');
    setFormEffectType('instant_use');
    setFormDuration(0);
    setFormIconUrl('');
    setFormIsActive(true);
    setFormMetadataStr('{}');
    setFormError(null);
    setIsFormOpen(true);
  };

  const openEditModal = (item: AdminItem) => {
    setEditingItem(item);
    setFormId(item.id);
    setFormName(item.name);
    setFormDescription(item.description || '');
    setFormEffectType(item.effect_type || 'instant_use');
    setFormDuration(item.duration_seconds || 0);
    setFormIconUrl(item.icon_url || '');
    setFormIsActive(item.is_active ?? true);
    setFormMetadataStr(JSON.stringify(item.metadata || {}, null, 2));
    setFormError(null);
    setIsFormOpen(true);
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formName.trim()) {
      setFormError('Item Name is required');
      return;
    }

    if (!editingItem && !formId.trim()) {
      setFormError('Unique Item ID slug is required');
      return;
    }

    let parsedMetadata: Record<string, unknown> = {};
    if (formMetadataStr.trim()) {
      try {
        parsedMetadata = JSON.parse(formMetadataStr);
      } catch {
        setFormError('Metadata must be valid JSON');
        return;
      }
    }

    try {
      setFormLoading(true);
      if (editingItem) {
        await adminService.updateItem(editingItem.id, {
          name: formName.trim(),
          description: formDescription.trim(),
          effect_type: formEffectType,
          duration_seconds: formEffectType === 'time_based' ? Number(formDuration) : 0,
          icon_url: formIconUrl.trim() || undefined,
          is_active: formIsActive,
          metadata: parsedMetadata,
        });
      } else {
        const payload: CreateItemRequest = {
          id: formId.trim().toUpperCase().replace(/\s+/g, '_'),
          name: formName.trim(),
          description: formDescription.trim(),
          effect_type: formEffectType,
          duration_seconds: formEffectType === 'time_based' ? Number(formDuration) : 0,
          icon_url: formIconUrl.trim() || undefined,
          is_active: formIsActive,
          metadata: parsedMetadata,
        };
        await adminService.createItem(payload);
      }

      setIsFormOpen(false);
      await fetchItems(true);
    } catch (err: unknown) {
      console.error('[ItemsCatalog] Save failed:', err);
      const errMsg = err instanceof Error ? err.message : 'Failed to save item definition.';
      setFormError(errMsg);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteItem = async () => {
    if (!deleteTargetItem) return;
    try {
      await adminService.deleteItem(deleteTargetItem.id);
      setDeleteTargetItem(null);
      await fetchItems(true);
    } catch (err) {
      console.error('[ItemsCatalog] Delete failed:', err);
    }
  };

  const formatDuration = (seconds: number) => {
    if (!seconds || seconds <= 0) return 'Instant';
    if (seconds >= 86400) {
      const days = Math.round(seconds / 86400);
      return `${days} ${days === 1 ? 'Day' : 'Days'}`;
    }
    if (seconds >= 3600) {
      const hours = Math.round(seconds / 3600);
      return `${hours} ${hours === 1 ? 'Hour' : 'Hours'}`;
    }
    return `${Math.round(seconds / 60)} Mins`;
  };

  const columns: AdminColumn<AdminItem>[] = [
    {
      key: 'item',
      header: 'Item Definition',
      width: '280px',
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-neon-cyan shrink-0 font-black text-xs shadow-inner">
            {item.icon_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={item.icon_url} alt={item.name} className="w-6 h-6 object-contain" />
            ) : (
              <Package className="w-4 h-4 text-neon-cyan" />
            )}
          </div>
          <div className="overflow-hidden">
            <p className="font-bold text-white tracking-tight truncate">{item.name}</p>
            <p className="font-mono text-[10px] text-zinc-500 truncate">{item.id}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'description',
      header: 'Description',
      render: (item) => (
        <p className="text-zinc-400 text-xs line-clamp-2 max-w-md">
          {item.description || <span className="italic text-zinc-600">No description</span>}
        </p>
      ),
    },
    {
      key: 'effect_type',
      header: 'Effect Type',
      width: '160px',
      render: (item) => (
        <div className="flex items-center gap-2">
          {item.effect_type === 'time_based' ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-purple-950/50 border border-purple-500/30 text-purple-300 text-[11px] font-semibold">
              <Clock className="w-3 h-3 text-purple-400" />
              Timed Buff ({formatDuration(item.duration_seconds)})
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-cyan-950/50 border border-cyan-500/30 text-cyan-300 text-[11px] font-semibold">
              <Zap className="w-3 h-3 text-cyan-400" />
              Instant Use
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      width: '110px',
      render: (item) => (
        item.is_active ? (
          <span className="inline-flex items-center gap-1 text-emerald-400 text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Active
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-zinc-500 text-xs font-medium">
            <XCircle className="w-3.5 h-3.5" />
            Inactive
          </span>
        )
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      width: '100px',
      render: (item) => (
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => openEditModal(item)}
            title="Edit Item"
            className="p-1.5 rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-neon-cyan hover:border-neon-cyan/40 transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setDeleteTargetItem(item)}
            title="Delete / Deactivate"
            className="p-1.5 rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-rose-400 hover:border-rose-500/40 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight uppercase">
            Gamification Item Catalog
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Manage global inventory consumables, power-ups, shields, and timed active buffs
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchItems(true)}
            disabled={refreshing}
            className="px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white transition-all text-xs font-semibold flex items-center gap-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-neon-cyan' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={openCreateModal}
            className="px-4 py-2 rounded-xl bg-neon-green text-zinc-950 hover:bg-emerald-400 transition-all text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-[0_0_15px_rgba(0,255,136,0.3)]"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Create Item</span>
          </button>
        </div>
      </div>

      {/* Item Table */}
      {loading ? (
        <div className="py-20">
          <CyberpunkLoader text="Loading Gamification Catalog" />
        </div>
      ) : (
        <AdminDataTable
          data={items}
          columns={columns}
          keyExtractor={(item) => item.id}
          emptyTitle="Catalog Empty"
          emptyDescription="No master game items registered. Click Create Item above."
        />
      )}

      {/* Create / Edit Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-2xl bg-zinc-950 border border-zinc-800 p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setIsFormOpen(false)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-300 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="p-2.5 rounded-xl bg-neon-green/10 border border-neon-green/30 text-neon-green">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white tracking-tight">
                  {editingItem ? `Edit Item: ${editingItem.name}` : 'Create Catalog Item'}
                </h3>
                <p className="text-xs text-zinc-400">Configure item parameters, buff duration and effects</p>
              </div>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-500/30 text-rose-300 text-xs mb-4">
                {formError}
              </div>
            )}

            <form onSubmit={handleSaveItem} className="space-y-4 text-xs">
              {/* Item ID */}
              <div>
                <label className="block font-semibold uppercase text-zinc-400 mb-1">
                  Item ID Slug {!editingItem && <span className="text-neon-cyan">*</span>}
                </label>
                <input
                  type="text"
                  value={formId}
                  onChange={(e) => setFormId(e.target.value)}
                  disabled={!!editingItem}
                  placeholder="e.g. DOUBLE_XP_POTION"
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-neon-cyan rounded-xl px-3.5 py-2.5 text-white font-mono uppercase focus:outline-none disabled:opacity-50"
                  required
                />
                <p className="text-[10px] text-zinc-500 mt-1">Unique uppercase identifier (immutable after creation).</p>
              </div>

              {/* Item Name */}
              <div>
                <label className="block font-semibold uppercase text-zinc-400 mb-1">
                  Item Name <span className="text-neon-cyan">*</span>
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. 24h Double XP Potion"
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-neon-cyan rounded-xl px-3.5 py-2.5 text-white focus:outline-none"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block font-semibold uppercase text-zinc-400 mb-1">Description</label>
                <textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  rows={2}
                  placeholder="Detailed description of benefits and gameplay effects..."
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-neon-cyan rounded-xl px-3.5 py-2.5 text-white focus:outline-none"
                />
              </div>

              {/* Effect Type & Duration */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold uppercase text-zinc-400 mb-1">Effect Type</label>
                  <select
                    value={formEffectType}
                    onChange={(e) => setFormEffectType(e.target.value as ItemEffectType)}
                    className="w-full bg-zinc-900 border border-zinc-800 focus:border-neon-cyan rounded-xl px-3.5 py-2.5 text-white focus:outline-none"
                  >
                    <option value="instant_use">Instant Use (Consumable)</option>
                    <option value="time_based">Time-Based Active Buff</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold uppercase text-zinc-400 mb-1">Duration (Seconds)</label>
                  <input
                    type="number"
                    value={formDuration}
                    onChange={(e) => setFormDuration(Number(e.target.value))}
                    disabled={formEffectType === 'instant_use'}
                    placeholder="0"
                    className="w-full bg-zinc-900 border border-zinc-800 focus:border-neon-cyan rounded-xl px-3.5 py-2.5 text-white font-mono focus:outline-none disabled:opacity-40"
                  />
                </div>
              </div>

              {/* Duration Quick Presets */}
              {formEffectType === 'time_based' && (
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[10px] text-zinc-500 uppercase font-semibold">Presets:</span>
                  <button
                    type="button"
                    onClick={() => setFormDuration(3600)}
                    className="px-2 py-1 rounded bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-[10px] text-zinc-300 font-mono"
                  >
                    1 Hour
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormDuration(86400)}
                    className="px-2 py-1 rounded bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-[10px] text-zinc-300 font-mono"
                  >
                    24 Hours
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormDuration(604800)}
                    className="px-2 py-1 rounded bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-[10px] text-zinc-300 font-mono"
                  >
                    7 Days
                  </button>
                </div>
              )}

              {/* Icon URL */}
              <div>
                <label className="block font-semibold uppercase text-zinc-400 mb-1">Icon URL (Optional)</label>
                <input
                  type="text"
                  value={formIconUrl}
                  onChange={(e) => setFormIconUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-neon-cyan rounded-xl px-3.5 py-2.5 text-white focus:outline-none"
                />
              </div>

              {/* Status Toggle */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
                <div>
                  <span className="font-bold text-white block">Active in Global Game Catalog</span>
                  <span className="text-[10px] text-zinc-500">
                    If disabled, athletes cannot view or claim this item.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={formIsActive}
                  onChange={(e) => setFormIsActive(e.target.checked)}
                  aria-label="Active in Global Game Catalog"
                  className="w-4 h-4 rounded bg-zinc-950 border-zinc-800 text-neon-green focus:ring-0 cursor-pointer"
                />
              </div>

              {/* Metadata JSON */}
              <div>
                <label className="block font-semibold uppercase text-zinc-400 mb-1">Metadata (JSON)</label>
                <textarea
                  value={formMetadataStr}
                  onChange={(e) => setFormMetadataStr(e.target.value)}
                  rows={3}
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-neon-cyan rounded-xl p-3 text-zinc-300 font-mono text-[11px] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  disabled={formLoading}
                  className="px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-all text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="px-5 py-2.5 rounded-xl bg-neon-green text-zinc-950 hover:bg-emerald-400 transition-all text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-[0_0_15px_rgba(0,255,136,0.3)]"
                >
                  {formLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {editingItem ? 'Save Modifications' : 'Create Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <AdminConfirmModal
        isOpen={!!deleteTargetItem}
        onClose={() => setDeleteTargetItem(null)}
        onConfirm={handleDeleteItem}
        title={`Delete Item: ${deleteTargetItem?.name}`}
        description={`Are you sure you want to remove item "${deleteTargetItem?.id}" from the master catalog? Active inventories holding this item will retain their records.`}
        variant="danger"
        confirmText="Delete Item"
      />
    </div>
  );
}
