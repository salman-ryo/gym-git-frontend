'use client';

import { PREBUILT_PLANS, WeeklyPlan } from '@/lib/types';
import React, { useState } from 'react';
import { Settings2, X, Dumbbell } from 'lucide-react';
import PrebuiltPlanGrid from './weekly-plan/PrebuiltPlanGrid';
import CustomPlanEditor from './weekly-plan/CustomPlanEditor';

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
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/85 backdrop-blur-xl animate-in fade-in duration-200"
        onClick={() => {
          if (!preventClose) onClose();
        }}
      >
        {/* OUTER CONTAINER: Handles the cyberpunk shape, borders, and glow */}
        <div
          className="relative w-full max-w-xl bg-[#080c10]/95 border border-[rgba(0,255,136,0.2)] rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.9)] flex flex-col max-h-[90vh] overflow-hidden animate-in scale-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* FIXED CLOSE BUTTON: Stays at the top right while content scrolls */}
          {!preventClose && (
            <button
              type="button"
              onClick={onClose}
              className="absolute top-5 right-5 z-20 text-zinc-400 hover:text-red-400 p-2 rounded-xl bg-zinc-950/80 border border-zinc-800 hover:border-red-500/40 backdrop-blur-sm transition-all cursor-pointer group"
            >
              <X className="w-4 h-4 transition-transform duration-200 group-hover:rotate-90" />
            </button>
          )}

          {/* INNER CONTAINER: Handles the padding and the actual scrolling */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-8 custom-scrollbar">

            {/* Modal Header */}
            <div className="flex items-center gap-3.5 mb-6 pb-4 border-b border-zinc-800/80">
              <div className="p-3 bg-zinc-950 border border-neon-green/30 rounded-2xl text-neon-green shadow-[0_0_15px_rgba(0,255,136,0.15)]">
                <Settings2 className="w-5 h-5 text-neon-green animate-spin-slow" />
              </div>
              <div className="pr-8">
                <h3 className="text-base font-black tracking-wide bg-gradient-to-r from-neon-green via-[#00e077] to-neon-cyan bg-clip-text text-transparent">
                  {preventClose ? 'Setup Your Workout Plan' : 'Weekly Workout Plan & Filters'}
                </h3>
                <p className="text-xs text-zinc-400 font-medium mt-0.5">
                  {preventClose
                    ? 'To get started, choose an existing split or create your own custom workout categories.'
                    : 'Customize your split. Past workout data remains safe & intact!'}
                </p>
              </div>
            </div>

            {/* Workout Plan Split Options */}
            <div className="space-y-3 mb-6">
              <label className="block text-[11px] font-black text-zinc-300 uppercase tracking-widest">
                Choose a Workout Split:
              </label>

              <PrebuiltPlanGrid
                selectedPlanId={selectedPlanId}
                setSelectedPlanId={setSelectedPlanId}
                handleSelectPlan={handleSelectPlan}
                customCategories={customCategories}
              />
            </div>

            <CustomPlanEditor
              selectedPlanId={selectedPlanId}
              customName={customName}
              setCustomName={setCustomName}
              customDesc={customDesc}
              setCustomDesc={setCustomDesc}
              customCategories={customCategories}
              handleRemoveCategory={handleRemoveCategory}
              newCatInput={newCatInput}
              setNewCatInput={setNewCatInput}
              handleAddCategory={handleAddCategory}
            />

            {/* Modal Save Action */}
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || (selectedPlanId === 'custom-plan' && !customName.trim())}
              className="w-full bg-gradient-to-r from-neon-green via-[#00e077] to-neon-cyan hover:shadow-[0_0_25px_rgba(0,255,136,0.4)] text-[#060a0e] font-black py-3.5 px-4 rounded-2xl text-sm flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 cursor-pointer"
            >
              {saving ? (
                <div className="w-5 h-5 border-2 border-[#060a0e] border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Dumbbell className="w-4 h-4 text-[#060a0e]" />
                  <span className="tracking-wide uppercase text-xs font-black">Apply Weekly Plan</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}