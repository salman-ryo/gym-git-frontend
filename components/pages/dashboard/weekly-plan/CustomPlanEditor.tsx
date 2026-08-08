'use client';

import React from 'react';
import { Sparkles, X, Plus } from 'lucide-react';
import { getThemeForWorkout } from '@/components/contribution-graph/theme-utils';
import { WeeklyPlan } from '@/lib/types';

interface CustomPlanEditorProps {
  selectedPlanId: string;
  customName: string;
  setCustomName: (name: string) => void;
  customDesc: string;
  setCustomDesc: (desc: string) => void;
  customCategories: string[];
  handleRemoveCategory: (cat: string) => void;
  newCatInput: string;
  setNewCatInput: (val: string) => void;
  handleAddCategory: () => void;
}

export default function CustomPlanEditor({
  selectedPlanId,
  customName,
  setCustomName,
  customDesc,
  setCustomDesc,
  customCategories,
  handleRemoveCategory,
  newCatInput,
  setNewCatInput,
  handleAddCategory,
}: CustomPlanEditorProps) {
  const customPlanObj: WeeklyPlan = {
    id: 'custom-plan',
    name: customName || 'Custom Plan',
    categories: customCategories,
  };

  return (
    <>
      {/* Custom Plan Fields (only shown when custom-plan is active) */}
      {selectedPlanId === 'custom-plan' && (
        <div className="bg-zinc-950/80 border border-zinc-800/90 rounded-2xl p-4 mb-6 space-y-3.5 shadow-inner">
          <span className="text-xs font-black text-zinc-200 flex items-center gap-2 border-b border-zinc-800 pb-2.5">
            <Sparkles className="w-3.5 h-3.5 text-neon-green animate-pulse" />
            <span className="tracking-wide">Plan Profile Details</span>
          </span>
          <div className="space-y-3">
            <div>
              <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1.5">
                Plan Name:
              </label>
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="e.g. My Cyberpunk Hypertrophy Split"
                className="w-full bg-[#05080c] border border-zinc-800 focus:border-neon-green focus:shadow-[0_0_15px_rgba(0,255,136,0.2)] rounded-xl px-3.5 py-2 text-xs text-zinc-100 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1.5">
                Plan Description:
              </label>
              <input
                type="text"
                value={customDesc}
                onChange={(e) => setCustomDesc(e.target.value)}
                placeholder="e.g. 5-day training program targeting weaknesses"
                className="w-full bg-[#05080c] border border-zinc-800 focus:border-neon-green focus:shadow-[0_0_15px_rgba(0,255,136,0.2)] rounded-xl px-3.5 py-2 text-xs text-zinc-100 outline-none transition-all"
              />
            </div>
          </div>
        </div>
      )}

      {/* Customize Categories Section */}
      <div className="bg-zinc-950/80 border border-zinc-800/90 rounded-2xl p-4 space-y-3 mb-6 shadow-inner">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-zinc-200 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-neon-cyan animate-pulse" />
            <span className="tracking-wide">Workout Categories &amp; Color Sync</span>
          </span>
          <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
            {customCategories.length} Categories
          </span>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {customCategories.map((cat) => {
            const catTheme = getThemeForWorkout(cat, customPlanObj);
            return (
              <span
                key={cat}
                className={`text-xs font-extrabold px-3 py-1.5 rounded-xl border flex items-center gap-2 transition-all ${catTheme.pillWeek} shadow-sm`}
              >
                <span>{cat}</span>
                {customCategories.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveCategory(cat)}
                    aria-label={`Remove ${cat}`}
                    className="text-zinc-400 hover:text-red-400 hover:scale-110 transition-all cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </span>
            );
          })}
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
            placeholder="e.g. Mobility, Core, Cardio, Calisthenics..."
            className="flex-1 bg-[#05080c] border border-zinc-800 focus:border-neon-cyan focus:shadow-[0_0_15px_rgba(34,211,238,0.2)] rounded-xl px-3.5 py-2 text-xs text-zinc-100 outline-none transition-all"
          />
          <button
            type="button"
            onClick={handleAddCategory}
            className="px-4 py-2 bg-neon-cyan/10 hover:bg-neon-cyan/20 border border-neon-cyan/30 hover:border-neon-cyan text-neon-cyan rounded-xl text-xs font-black flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(34,211,238,0.15)] cursor-pointer shrink-0"
          >
            <Plus className="w-3.5 h-3.5" /> <span>Add Tag</span>
          </button>
        </div>
      </div>
    </>
  );
}
