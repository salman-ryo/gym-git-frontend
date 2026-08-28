'use client';

import React, { useEffect, useState, useCallback } from 'react';
import {
  Dumbbell,
  Plus,
  Edit2,
  Trash2,
  RefreshCw,
  X,
  Loader2,
  Tag,
  Check,
} from 'lucide-react';
import { adminService } from '@/lib/admin-service';
import {
  AdminPresetPlan,
  CreatePresetPlanRequest,
  UpdatePresetPlanRequest,
} from '@/lib/admin-types';
import AdminConfirmModal from '@/components/admin/ui/AdminConfirmModal';
import CyberpunkLoader from '@/components/CyberpunkLoader';

const SUGGESTED_TAGS = [
  'Push',
  'Pull',
  'Legs',
  'Upper Body',
  'Lower Body',
  'Chest',
  'Back',
  'Shoulders',
  'Arms',
  'Full Body',
  'Core',
  'Cardio',
  'Rest',
  'Mobility',
];

export default function AdminPresetSplitsCatalogPage() {
  const [presets, setPresets] = useState<AdminPresetPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Form Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPreset, setEditingPreset] = useState<AdminPresetPlan | null>(null);
  const [formId, setFormId] = useState('');
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formCategories, setFormCategories] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState<AdminPresetPlan | null>(null);

  const fetchPresets = useCallback(async (isManual = false) => {
    if (isManual) setRefreshing(true);

    try {
      const data = await adminService.getPresetPlans();
      setPresets(data);
    } catch (err) {
      console.error('[PresetCatalog] Failed to load presets:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const data = await adminService.getPresetPlans();
        if (isMounted) setPresets(data);
      } catch (err) {
        console.error('[PresetCatalog] Failed to load presets:', err);
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
    setEditingPreset(null);
    setFormId('');
    setFormName('');
    setFormDescription('');
    setFormCategories(['Push', 'Pull', 'Legs', 'Rest']);
    setTagInput('');
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (preset: AdminPresetPlan) => {
    setEditingPreset(preset);
    setFormId(preset.id);
    setFormName(preset.name);
    setFormDescription(preset.description || '');
    setFormCategories(preset.categories || []);
    setTagInput('');
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleAddTag = (tagToAdd?: string) => {
    const rawTag = tagToAdd || tagInput;
    const tag = rawTag.trim();
    if (!tag) return;
    if (!formCategories.includes(tag)) {
      setFormCategories([...formCategories, tag]);
    }
    if (!tagToAdd) setTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormCategories(formCategories.filter((t) => t !== tagToRemove));
  };

  const handleSavePreset = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formName.trim()) {
      setFormError('Preset Name is required');
      return;
    }

    if (!editingPreset && !formId.trim()) {
      setFormError('Unique Preset ID slug is required');
      return;
    }

    if (formCategories.length === 0) {
      setFormError('At least one workout category tag is required');
      return;
    }

    try {
      setFormLoading(true);
      if (editingPreset) {
        const payload: UpdatePresetPlanRequest = {
          name: formName.trim(),
          description: formDescription.trim(),
          categories: formCategories,
        };
        await adminService.updatePresetPlan(editingPreset.id, payload);
      } else {
        const payload: CreatePresetPlanRequest = {
          id: formId.trim().toLowerCase().replace(/\s+/g, '-'),
          name: formName.trim(),
          description: formDescription.trim(),
          categories: formCategories,
        };
        await adminService.createPresetPlan(payload);
      }

      setIsModalOpen(false);
      await fetchPresets(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save preset split.';
      setFormError(msg);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeletePreset = async () => {
    if (!deleteTarget) return;
    try {
      await adminService.deletePresetPlan(deleteTarget.id);
      setDeleteTarget(null);
      await fetchPresets(true);
    } catch (err) {
      console.error('[PresetCatalog] Delete preset failed:', err);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight uppercase">
            Preset Workout Split Templates
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Author and maintain prebuilt workout splits (e.g. PPL, Upper/Lower, Arnold Split) available to athletes
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchPresets(true)}
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
            <span>New Split Preset</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-20">
          <CyberpunkLoader text="Loading Preset Split Templates" />
        </div>
      ) : presets.length === 0 ? (
        <div className="py-16 text-center rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/40 p-8">
          <Dumbbell className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white mb-1">No Presets Configured</h3>
          <p className="text-xs text-zinc-500 mb-5">
            Create preset split templates for athletes to choose during onboarding or cycle rollover.
          </p>
          <button
            onClick={openCreateModal}
            className="px-4 py-2 rounded-xl bg-neon-green text-zinc-950 font-bold text-xs uppercase"
          >
            + Create First Preset
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {presets.map((preset) => (
            <div
              key={preset.id}
              className="rounded-2xl bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 p-5 flex flex-col justify-between hover:border-zinc-700 transition-all group"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <h3 className="text-sm font-bold text-white tracking-tight">{preset.name}</h3>
                    <p className="font-mono text-[10px] text-neon-cyan">{preset.id}</p>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(preset)}
                      className="p-1.5 rounded-lg border border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-white transition-colors"
                      title="Edit Preset"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(preset)}
                      className="p-1.5 rounded-lg border border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-rose-400 transition-colors"
                      title="Delete Preset"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                  {preset.description || <span className="italic text-zinc-600">No description provided</span>}
                </p>
              </div>

              <div>
                <div className="pt-3 border-t border-zinc-800/80">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block mb-2">
                    Split Categories ({preset.categories?.length || 0})
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {preset.categories?.map((cat) => (
                      <span
                        key={cat}
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${
                          cat.toLowerCase() === 'rest'
                            ? 'bg-zinc-950 border-zinc-800 text-zinc-400'
                            : 'bg-emerald-950/40 border-emerald-500/30 text-neon-green'
                        }`}
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Preset Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-2xl bg-zinc-950 border border-zinc-800 p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-300 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-black text-white tracking-tight mb-1">
              {editingPreset ? `Edit Split: ${editingPreset.name}` : 'Create Preset Split Template'}
            </h3>
            <p className="text-xs text-zinc-400 mb-5">Define split taxonomy and target workout categories</p>

            {formError && (
              <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-500/30 text-rose-300 text-xs mb-4">
                {formError}
              </div>
            )}

            <form onSubmit={handleSavePreset} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold uppercase text-zinc-400 mb-1">
                  Preset ID Slug {!editingPreset && <span className="text-neon-green">*</span>}
                </label>
                <input
                  type="text"
                  value={formId}
                  onChange={(e) => setFormId(e.target.value)}
                  disabled={!!editingPreset}
                  placeholder="e.g. arnold-split"
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-neon-green rounded-xl px-3.5 py-2.5 text-white font-mono focus:outline-none disabled:opacity-50"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold uppercase text-zinc-400 mb-1">
                  Split Name <span className="text-neon-green">*</span>
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Arnold Classic Antagonist Split"
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-neon-green rounded-xl px-3.5 py-2.5 text-white focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold uppercase text-zinc-400 mb-1">Description</label>
                <textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  rows={2}
                  placeholder="Hypertrophy structure, training frequency & targeted movements..."
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-neon-green rounded-xl px-3.5 py-2.5 text-white focus:outline-none"
                />
              </div>

              {/* Dynamic Categories Builder */}
              <div>
                <label className="block font-semibold uppercase text-zinc-400 mb-1.5 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-neon-green" />
                  <span>Workout Categories ({formCategories.length})</span>
                </label>

                {/* Active category tags */}
                <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 mb-3 min-h-[48px] flex flex-wrap items-center gap-1.5">
                  {formCategories.length === 0 ? (
                    <span className="text-zinc-600 text-xs italic">No categories added yet. Add tags below.</span>
                  ) : (
                    formCategories.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-neon-green font-semibold text-xs"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="hover:text-rose-400 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))
                  )}
                </div>

                {/* Add Custom Tag Input */}
                <div className="flex items-center gap-2 mb-3">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    placeholder="Type category (e.g. Chest & Back) and press Add..."
                    className="flex-1 bg-zinc-900 border border-zinc-800 focus:border-neon-green rounded-xl px-3.5 py-2 text-white focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddTag()}
                    className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs transition-colors"
                  >
                    Add Tag
                  </button>
                </div>

                {/* Suggested Quick Tags */}
                <div>
                  <span className="text-[10px] text-zinc-500 font-semibold uppercase block mb-1.5">
                    Suggested Quick Tags:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {SUGGESTED_TAGS.map((sTag) => {
                      const isAdded = formCategories.includes(sTag);
                      return (
                        <button
                          key={sTag}
                          type="button"
                          onClick={() => (isAdded ? handleRemoveTag(sTag) : handleAddTag(sTag))}
                          className={`text-[11px] px-2 py-0.5 rounded-md border transition-all flex items-center gap-1 ${
                            isAdded
                              ? 'bg-emerald-950 border-emerald-500 text-neon-green font-bold'
                              : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                          }`}
                        >
                          {isAdded && <Check className="w-2.5 h-2.5" />}
                          {sTag}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="px-5 py-2.5 rounded-xl bg-neon-green text-zinc-950 text-xs font-black uppercase tracking-wider flex items-center gap-2 hover:bg-emerald-400 transition-all shadow-[0_0_15px_rgba(0,255,136,0.3)]"
                >
                  {formLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {editingPreset ? 'Save Preset' : 'Create Preset'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <AdminConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeletePreset}
        title={`Delete Preset: ${deleteTarget?.name}`}
        description={`Are you sure you want to delete preset "${deleteTarget?.id}"? Existing athletes assigned to this split will preserve their active category schedules.`}
        variant="danger"
        confirmText="Delete Preset"
      />
    </div>
  );
}
