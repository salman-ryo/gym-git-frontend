'use client';

import React from 'react';
import { Check } from 'lucide-react';
import { WeeklyPlan, PREBUILT_PLANS } from '@/lib/types';

interface PrebuiltPlanGridProps {
  selectedPlanId: string;
  setSelectedPlanId: (id: string) => void;
  handleSelectPlan: (plan: WeeklyPlan) => void;
  customCategories: string[];
}

export default function PrebuiltPlanGrid({
  selectedPlanId,
  setSelectedPlanId,
  handleSelectPlan,
  customCategories,
}: PrebuiltPlanGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {PREBUILT_PLANS.map((plan) => {
        const isSelected = selectedPlanId === plan.id;
        return (
          <button
            key={plan.id}
            type="button"
            onClick={() => handleSelectPlan(plan)}
            className={`p-3.5 rounded-2xl text-left border transition-all relative ${
              isSelected
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
            className={`p-3.5 rounded-2xl text-left border transition-all relative ${
              isSelected
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
  );
}
