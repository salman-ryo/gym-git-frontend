'use client';

import React from 'react';
import { Sparkles, X, Plus } from 'lucide-react';

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
  return (
    <>
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
    </>
  );
}
