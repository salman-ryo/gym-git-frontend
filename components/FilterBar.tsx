'use client';

import { WorkoutType, WeeklyPlan } from '@/lib/types';
import React from 'react';
import { SlidersHorizontal, Settings2, Sparkles, Dumbbell } from 'lucide-react';

interface FilterBarProps {
  activeFilter: WorkoutType | 'All';
  onFilterChange: (filter: WorkoutType | 'All') => void;
  weeklyPlan?: WeeklyPlan;
  onOpenPlanModal?: () => void;
  availableTypes?: string[];
}

export default function FilterBar({
  activeFilter,
  onFilterChange,
  weeklyPlan,
  onOpenPlanModal,
  availableTypes = [],
}: FilterBarProps) {
  // Plan categories or default fallbacks
  const planCategories = weeklyPlan?.categories || ['Push', 'Pull', 'Legs', 'Cardio', 'Custom'];

  // Identify any historical types not in the active plan
  const extraHistoricalTypes = availableTypes.filter(
    (t) => !planCategories.includes(t) && t !== 'All'
  );

  const uniqueLabels = new Set<string>();
  const displayFilterItems: { label: WorkoutType | 'All'; isExtra?: boolean }[] = [];

  // Add 'All'
  displayFilterItems.push({ label: 'All' });
  uniqueLabels.add('All');

  // Add plan categories
  planCategories.forEach((cat) => {
    if (!uniqueLabels.has(cat)) {
      displayFilterItems.push({ label: cat });
      uniqueLabels.add(cat);
    }
  });

  // Add extra historical types
  extraHistoricalTypes.forEach((cat) => {
    if (!uniqueLabels.has(cat)) {
      displayFilterItems.push({ label: cat, isExtra: true });
      uniqueLabels.add(cat);
    }
  });

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 bg-zinc-900/60 border border-zinc-800/80 p-3 rounded-2xl">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
            Filter Activity:
          </span>
        </div>

        {weeklyPlan && (
          <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 rounded-full px-2.5 py-0.5">
            <Sparkles className="w-3 h-3" /> {weeklyPlan.name}
          </span>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        {displayFilterItems.map((item) => {
          const isActive = activeFilter === item.label;
          return (
            <button
              key={item.label}
              type="button"
              onClick={() => onFilterChange(item.label)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 ${
                isActive
                  ? 'bg-emerald-500 text-zinc-950 shadow-md shadow-emerald-500/20 font-bold scale-[1.02]'
                  : item.isExtra
                  ? 'bg-zinc-950 text-amber-400 border border-amber-500/30 hover:border-amber-500/60'
                  : 'bg-zinc-950 text-zinc-400 hover:text-zinc-200 border border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <span>{item.label}</span>
              {item.isExtra && (
                <span className="text-[9px] font-bold px-1 rounded bg-amber-500/20 text-amber-300">
                  Past
                </span>
              )}
            </button>
          );
        })}

        {/* Plan Configuration Button */}
        {onOpenPlanModal && (
          <button
            type="button"
            onClick={onOpenPlanModal}
            title="Edit Weekly Plan & Categories"
            className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 rounded-xl text-xs flex items-center gap-1 transition-colors ml-1"
          >
            <Settings2 className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden md:inline font-bold">Plan</span>
          </button>
        )}
      </div>
    </div>
  );
}
