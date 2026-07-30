'use client';

import { WorkoutType, WeeklyPlan } from '@/lib/types';
import React from 'react';
import { SlidersHorizontal, Settings2, Sparkles } from 'lucide-react';

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

  const planCategories = weeklyPlan?.categories || ['Push', 'Pull', 'Legs', 'Cardio', 'Custom']; //[cite: 2]
  const extraHistoricalTypes = availableTypes.filter( //[cite: 2]
    (t) => !planCategories.includes(t) && t !== 'All'
  );

  const uniqueLabels = new Set<string>(); //[cite: 2]
  const displayFilterItems: { label: WorkoutType | 'All'; isExtra?: boolean }[] = []; //[cite: 2]

  displayFilterItems.push({ label: 'All' }); //[cite: 2]
  uniqueLabels.add('All');

  planCategories.forEach((cat) => { //[cite: 2]
    if (!uniqueLabels.has(cat)) {
      displayFilterItems.push({ label: cat });
      uniqueLabels.add(cat);
    }
  });

  extraHistoricalTypes.forEach((cat) => { //[cite: 2]
    if (!uniqueLabels.has(cat)) {
      displayFilterItems.push({ label: cat, isExtra: true });
      uniqueLabels.add(cat);
    }
  });

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-b border-zinc-800/50 mb-4">
      {/* Left Side: Label & Plan Name */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-emerald-400">
          <SlidersHorizontal className="w-4 h-4" />
          <span className="text-[11px] font-black uppercase tracking-widest text-zinc-300">
            Filter Activity:
          </span>
        </div>

        {weeklyPlan && (
          <span className="hidden sm:inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30 rounded-full px-3 py-1 bg-emerald-500/5">
            <Sparkles className="w-3 h-3" /> {weeklyPlan.name}
          </span>
        )}
      </div>

      {/* Right Side: Filters & Plan Button */}
      <div className="flex flex-wrap items-center gap-2">
        {displayFilterItems.map((item) => {
          const isActive = activeFilter === item.label; //[cite: 2]
          return (
            <button
              key={item.label} //[cite: 2]
              type="button"
              onClick={() => onFilterChange(item.label)} //[cite: 2]
              className={`px-4 py-1.5 rounded-full text-[11px] font-bold transition-all duration-200 ${isActive
                  ? 'bg-emerald-400 text-zinc-950 shadow-[0_0_10px_rgba(52,211,153,0.3)]'
                  : item.isExtra //[cite: 2]
                    ? 'text-amber-400 hover:text-amber-300 border border-amber-500/20 bg-amber-500/5'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50'
                }`}
            >
              {item.label}
              {item.isExtra && ( //[cite: 2]
                <span className="ml-1.5 text-[8px] px-1 rounded bg-amber-500/20 text-amber-300">Past</span>
              )}
            </button>
          );
        })}

        {/* Plan Configuration Button */}
        {onOpenPlanModal && ( //[cite: 2]
          <button
            type="button"
            onClick={onOpenPlanModal} //[cite: 2]
            title="Edit Weekly Plan & Categories"
            className="p-1.5 px-3 ml-2 text-zinc-300 hover:text-emerald-400 border border-zinc-700 hover:border-emerald-500/50 rounded-full text-[11px] font-bold flex items-center gap-1.5 transition-colors"
          >
            <Settings2 className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden md:inline">Plan</span>
          </button>
        )}
      </div>
    </div>
  );
}