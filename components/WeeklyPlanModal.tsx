'use client';

import { PREBUILT_PLANS, WeeklyPlan } from '@/lib/types';
import React, { useState } from 'react';
import { Settings2, Check, Plus, X, Sparkles, Dumbbell } from 'lucide-react';

interface WeeklyPlanModalProps {
  currentPlan?: WeeklyPlan;
  isOpen: boolean;
  onClose: () => void;
  onSavePlan: (plan: WeeklyPlan) => Promise<void>;
  preventClose?: boolean;
}

export default function WeeklyPlanModal({
  currentPlan,
  isOpen,
  onClose,
  onSavePlan,
  preventClose = false,
}: WeeklyPlanModalProps) {
  const isCustomActive = currentPlan?.id ? !PREBUILT_PLANS.some((p) => p.id === currentPlan.id) : false;
  const [selectedPlanId, setSelectedPlanId] = useState<string>(
    currentPlan?.id ? (isCustomActive ? 'custom-plan' : currentPlan.id) : PREBUILT_PLANS[0].id
  );
  const [customCategories, setCustomCategories] = useState<string[]>(
    currentPlan?.categories || ['Push', 'Pull', 'Legs', 'Cardio', 'Core']
  );
  const [customName, setCustomName] = useState<string>(
    isCustomActive ? (currentPlan?.name || 'My Custom Plan') : 'My Custom Plan'
  );
  const [customDesc, setCustomDesc] = useState<string>(
    isCustomActive ? (currentPlan?.description || '') : 'Personalized workout categories.'
  );
  const [newCatInput, setNewCatInput] = useState<string>('');
  const [saving, setSaving] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSelectPlan = (plan: WeeklyPlan) => {
    setSelectedPlanId(plan.id);
    if (plan.id !== 'custom-plan') {
      setCustomCategories(plan.categories);
    }
  };

  const handleAddCategory = () => {
    if (!newCatInput.trim()) return;
    const cleanName = newCatInput.trim();
    if (!customCategories.includes(cleanName)) {
      setCustomCategories([...customCategories, cleanName]);
    }
    setNewCatInput('');
    setSelectedPlanId('custom-plan');
  };

  const handleRemoveCategory = (cat: string) => {
    setCustomCategories(customCategories.filter((c) => c !== cat));
    setSelectedPlanId('custom-plan');
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      let finalPlan: WeeklyPlan;
      if (selectedPlanId === 'custom-plan') {
        finalPlan = {
          id: 'custom-plan',
          name: customName.trim() || 'My Custom Weekly Plan',
          description: customDesc.trim() || 'Personalized workout categories.',
          categories: customCategories.length > 0 ? customCategories : ['Push', 'Pull', 'Legs', 'Custom'],
        };
      } else {
        const found = PREBUILT_PLANS.find((p) => p.id === selectedPlanId);
        finalPlan = found || PREBUILT_PLANS[0];
      }
      await onSavePlan(finalPlan);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {/* Custom Scrollbar Styles to make it look professional on Webkit browsers */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #3f3f46; /* zinc-700 */
          border-radius: 20px;
          border: 2px solid #18181b; /* zinc-900 background match for visual padding */
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #52525b; /* zinc-600 */
        }
      `}</style>

      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md animate-in fade-in duration-150"
        onClick={() => {
          if (!preventClose) onClose();
        }}
      >
        {/* OUTER CONTAINER: Handles the shape, borders, and clipping */}
        <div
          className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in scale-in-95 duration-150"
          onClick={(e) => e.stopPropagation()}
        >
          {/* FIXED CLOSE BUTTON: Stays at the top right while content scrolls */}
          {!preventClose && (
            <button
              type="button"
              onClick={onClose}
              className="absolute top-5 right-5 z-20 text-zinc-400 hover:text-zinc-100 p-1.5 rounded-xl bg-zinc-800/80 backdrop-blur-sm hover:bg-zinc-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* INNER CONTAINER: Handles the padding and the actual scrolling */}
          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">

            {/* Modal Header */}
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-zinc-800">
              <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-400">
                <Settings2 className="w-5 h-5" />
              </div>
              <div className="pr-8">
                <h3 className="text-base font-bold text-zinc-100">
                  {preventClose ? 'Setup Your Workout Plan' : 'Weekly Workout Plan & Filters'}
                </h3>
                <p className="text-xs text-zinc-400">
                  {preventClose
                    ? 'To get started, choose an existing split or create your own custom workout categories.'
                    : 'Customize your split. Past workout data remains safe & intact!'}
                </p>
              </div>
            </div>

            {/* Workout Plan Split Options */}
            <div className="space-y-4 mb-6">
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                Choose a Workout Split:
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PREBUILT_PLANS.map((plan) => {
                  const isSelected = selectedPlanId === plan.id;
                  return (
                    <button
                      key={plan.id}
                      type="button"
                      onClick={() => handleSelectPlan(plan)}
                      className={`p-3.5 rounded-2xl text-left border transition-all relative ${isSelected
                          ? 'bg-emerald-500/10 border-emerald-500 text-zinc-100 ring-2 ring-emerald-500/30'
                          : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                        }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-xs font-bold text-zinc-200">{plan.name}</p>
                        {isSelected && <Check className="w-4 h-4 text-emerald-400" />}
                      </div>
                      <p className="text-[10px] text-zinc-400 leading-snug mb-2">{plan.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {plan.categories.slice(0, 4).map((cat) => (
                          <span
                            key={cat}
                            className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300"
                          >
                            {cat}
                          </span>
                        ))}
                        {plan.categories.length > 4 && (
                          <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">
                            +{plan.categories.length - 4}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}

                {/* Custom/Create Your Own Option Card */}
                {(() => {
                  const isSelected = selectedPlanId === 'custom-plan';
                  return (
                    <button
                      type="button"
                      onClick={() => setSelectedPlanId('custom-plan')}
                      className={`p-3.5 rounded-2xl text-left border transition-all relative ${isSelected
                          ? 'bg-emerald-500/10 border-emerald-500 text-zinc-100 ring-2 ring-emerald-500/30'
                          : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                        }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-xs font-bold text-zinc-200">Create Your Own Plan</p>
                        {isSelected && <Check className="w-4 h-4 text-emerald-400" />}
                      </div>
                      <p className="text-[10px] text-zinc-400 leading-snug mb-2">
                        Build a custom split with your own categories, name, and description.
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {customCategories.slice(0, 4).map((cat) => (
                          <span
                            key={cat}
                            className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300"
                          >
                            {cat}
                          </span>
                        ))}
                      </div>
                    </button>
                  );
                })()}
              </div>
            </div>

            {/* Custom Plan Fields (only shown when custom-plan is active) */}
            {selectedPlanId === 'custom-plan' && (
              <div className="bg-zinc-950/80 border border-zinc-800 rounded-2xl p-4 mb-6 space-y-3">
                <span className="text-xs font-bold text-zinc-200 flex items-center gap-1.5 border-b border-zinc-800 pb-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Plan Profile Details:
                </span>
                <div className="space-y-2">
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                      Plan Name:
                    </label>
                    <input
                      type="text"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      placeholder="e.g. My Hypertrophy Split"
                      className="w-full bg-zinc-900 border border-zinc-800 focus:border-emerald-500 rounded-xl px-3 py-1.5 text-xs text-zinc-100 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                      Plan Description:
                    </label>
                    <input
                      type="text"
                      value={customDesc}
                      onChange={(e) => setCustomDesc(e.target.value)}
                      placeholder="e.g. 5-day training program targeting weaknesses"
                      className="w-full bg-zinc-900 border border-zinc-800 focus:border-emerald-500 rounded-xl px-3 py-1.5 text-xs text-zinc-100 outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Customize Categories Section */}
            <div className="bg-zinc-950/80 border border-zinc-800 rounded-2xl p-4 space-y-3 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Workout Categories:
                </span>
                <span className="text-[10px] text-zinc-400">Add or remove tags</span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {customCategories.map((cat) => (
                  <span
                    key={cat}
                    className="text-xs font-bold px-2.5 py-1 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-200 flex items-center gap-1.5"
                  >
                    <span>{cat}</span>
                    {customCategories.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveCategory(cat)}
                        className="text-zinc-500 hover:text-red-400 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </span>
                ))}
              </div>

              {/* Add custom tag input */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="text"
                  value={newCatInput}
                  onChange={(e) => setNewCatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddCategory();
                    }
                  }}
                  placeholder="e.g. Mobility, Core, Calisthenics..."
                  className="flex-1 bg-zinc-900 border border-zinc-800 focus:border-emerald-500 rounded-xl px-3 py-1.5 text-xs text-zinc-100 outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddCategory}
                  className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-xl text-xs font-bold text-zinc-200 flex items-center gap-1 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5 text-emerald-400" /> Add Tag
                </button>
              </div>
            </div>

            {/* Modal Save Action */}
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || (selectedPlanId === 'custom-plan' && !customName.trim())}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-zinc-950 font-extrabold py-3 px-4 rounded-2xl text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50"
            >
              {saving ? (
                <div className="w-5 h-5 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Dumbbell className="w-4 h-4" />
                  <span>Apply Weekly Plan</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}