'use client';

import { WorkoutType, WeeklyPlan } from '@/lib/types';
import React from 'react';
import { SlidersHorizontal, Settings2, Sparkles, Check, Calendar } from 'lucide-react';
import { getThemeForWorkout } from '@/components/contribution-graph/theme-utils';

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
}: FilterBarProps) {
  // Display ONLY the categories defined in the user's active weekly plan
  const planCategories = weeklyPlan?.categories || ['Push', 'Pull', 'Legs', 'Cardio', 'Custom'];

  const displayFilterItems: (WorkoutType | 'All')[] = ['All'];
  const uniqueLabels = new Set<string>(['All']);

  planCategories.forEach((cat) => {
    if (cat.toLowerCase() !== 'rest' && !uniqueLabels.has(cat)) {
      displayFilterItems.push(cat);
      uniqueLabels.add(cat);
    }
  });

  return (
    <div className="bg-zinc-950/80 border border-[rgba(0,255,136,0.15)] backdrop-blur-xl rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 shadow-[0_4px_25px_rgba(0,0,0,0.6)] mb-6 transition-all duration-300">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-neon-green">
          <SlidersHorizontal className="w-4 h-4" />
          <span className="text-[11.5px] font-black uppercase tracking-widest text-zinc-300">
            Filter Activity:
          </span>
        </div>

        {weeklyPlan && (
          <span className="hidden sm:inline-flex items-center gap-1.5 text-[10.5px] font-extrabold text-cyan-400 border border-cyan-400/30 rounded-full px-3 py-1 bg-black shadow-[0_0_12px_rgba(34,211,238,0.25)]" title='Your Current Weekly Plan'>
            <Calendar className="w-3 h-3 text-purple-400" /> {weeklyPlan.name}
          </span>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {displayFilterItems.map((category) => {
          const isActive = activeFilter === category;
          const theme = getThemeForWorkout(category, weeklyPlan);

          return (
            <button
              key={category}
              type="button"
              onClick={() => onFilterChange(category)}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${isActive ? theme.filterActive : theme.filterInactive
                }`}
            >
              <span>{category}</span>
            </button>
          );
        })}

        {onOpenPlanModal && (
          <button
            type="button"
            onClick={onOpenPlanModal}
            title="Edit Weekly Plan & Categories"
            className="p-1.5 px-3.5 ml-1 text-zinc-300 hover:text-neon-cyan bg-[#05080c] border border-neon-cyan/20 hover:border-neon-cyan/60 hover:bg-neon-cyan/10 hover:shadow-[0_0_14px_rgba(34,211,238,0.25)] rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all duration-200 cursor-pointer"
          >
            <Settings2 className="w-3.5 h-3.5 text-neon-cyan" />
            <span className="hidden md:inline">Plan</span>
          </button>
        )}
      </div>
    </div>
  );
}