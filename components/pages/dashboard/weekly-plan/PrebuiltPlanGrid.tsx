'use client';

import React from 'react';
import { Check } from 'lucide-react';
import { WeeklyPlan, PREBUILT_PLANS } from '@/lib/types';
import { getThemeForWorkout } from '@/components/contribution-graph/theme-utils';

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
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
      {PREBUILT_PLANS.map((plan) => {
        const isSelected = selectedPlanId === plan.id;
        return (
          <button
            key={plan.id}
            type="button"
            onClick={() => handleSelectPlan(plan)}
            className={`p-4 rounded-2xl text-left border transition-all duration-200 relative cursor-pointer group ${
              isSelected
                ? 'bg-zinc-950/95 border-neon-green text-zinc-100 shadow-[0_0_20px_rgba(0,255,136,0.22)] ring-1 ring-neon-green/40'
                : 'bg-zinc-950/80 border-zinc-800/80 text-zinc-400 hover:border-zinc-700 hover:text-zinc-300'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-xs font-black text-zinc-100 group-hover:text-neon-green transition-colors">{plan.name}</p>
              {isSelected && (
                <div className="w-5 h-5 rounded-full bg-neon-green/20 border border-neon-green flex items-center justify-center text-[#060a0e]">
                  <Check className="w-3.5 h-3.5 text-neon-green" />
                </div>
              )}
            </div>
            <p className="text-[10px] text-zinc-400 leading-relaxed mb-3">{plan.description}</p>
            <div className="flex flex-wrap gap-1.5">
              {plan.categories.slice(0, 5).map((cat) => {
                const catTheme = getThemeForWorkout(cat, plan);
                return (
                  <span
                    key={cat}
                    className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border ${catTheme.pillWeek}`}
                  >
                    {cat}
                  </span>
                );
              })}
              {plan.categories.length > 5 && (
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700">
                  +{plan.categories.length - 5}
                </span>
              )}
            </div>
          </button>
        );
      })}

      {/* Custom/Create Your Own Option Card */}
      {(() => {
        const isSelected = selectedPlanId === 'custom-plan';
        const customPlanObj: WeeklyPlan = {
          id: 'custom-plan',
          name: 'Custom',
          categories: customCategories,
        };

        return (
          <button
            type="button"
            onClick={() => setSelectedPlanId('custom-plan')}
            className={`p-4 rounded-2xl text-left border transition-all duration-200 relative cursor-pointer group ${
              isSelected
                ? 'bg-zinc-950/95 border-neon-cyan text-zinc-100 shadow-[0_0_20px_rgba(34,211,238,0.22)] ring-1 ring-neon-cyan/40'
                : 'bg-zinc-950/80 border-zinc-800/80 text-zinc-400 hover:border-zinc-700 hover:text-zinc-300'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-xs font-black text-zinc-100 group-hover:text-neon-cyan transition-colors">Create Your Own Plan</p>
              {isSelected && (
                <div className="w-5 h-5 rounded-full bg-neon-cyan/20 border border-neon-cyan flex items-center justify-center text-[#060a0e]">
                  <Check className="w-3.5 h-3.5 text-neon-cyan" />
                </div>
              )}
            </div>
            <p className="text-[10px] text-zinc-400 leading-relaxed mb-3">
              Build a fully custom split with your own categories, name, and description.
            </p>
            <div className="flex flex-wrap gap-1.5">
              {customCategories.slice(0, 5).map((cat) => {
                const catTheme = getThemeForWorkout(cat, customPlanObj);
                return (
                  <span
                    key={cat}
                    className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border ${catTheme.pillWeek}`}
                  >
                    {cat}
                  </span>
                );
              })}
            </div>
          </button>
        );
      })()}
    </div>
  );
}
