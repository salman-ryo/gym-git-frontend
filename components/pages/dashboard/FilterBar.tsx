'use client';

import { WorkoutType, WeeklyPlan } from '@/lib/types';
import React, { memo, useMemo } from 'react';
import { SlidersHorizontal, Settings2, Calendar } from 'lucide-react';
import { getThemeForWorkout } from '@/components/contribution-graph/theme-utils';

interface FilterBarProps {
  activeFilter: WorkoutType | 'All';
  onFilterChange: (filter: WorkoutType | 'All') => void;
  weeklyPlan?: WeeklyPlan;
  onOpenPlanModal?: () => void;
  availableTypes?: string[];
}

function FilterBar({
  activeFilter,
  onFilterChange,
  weeklyPlan,
  onOpenPlanModal,
}: FilterBarProps) {
  // Display ONLY the categories defined in the user's active weekly plan
  const displayFilterItems = useMemo(() => {
    const planCategories = weeklyPlan?.categories || ['Push', 'Pull', 'Legs', 'Cardio', 'Custom'];
    const items: (WorkoutType | 'All')[] = ['All'];
    const uniqueLabels = new Set<string>(['All']);

    planCategories.forEach((cat) => {
      if (cat.toLowerCase() !== 'rest' && !uniqueLabels.has(cat)) {
        items.push(cat);
        uniqueLabels.add(cat);
      }
    });

    return items;
  }, [weeklyPlan?.categories]);

  return (
    <div className="bg-zinc-950/80 border border-[rgba(0,255,136,0.15)] backdrop-blur-xl rounded-2xl p-3 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4 shadow-[0_4px_25px_rgba(0,0,0,0.6)] mb-4 sm:mb-6 transition-all duration-300">
      <div className="flex items-center justify-between w-full sm:w-auto gap-2 min-w-0">
        <div className="flex items-center gap-1.5 sm:gap-2 text-neon-green shrink-0">
          <SlidersHorizontal className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
          <span className="text-[10px] sm:text-[11.5px] font-black uppercase tracking-widest text-zinc-300">
            Filter Activity:
          </span>
        </div>

        {weeklyPlan && (
          <span className="inline-flex items-center gap-1 sm:gap-1.5 text-[9px] sm:text-[10.5px] font-extrabold text-cyan-400 border border-cyan-400/30 rounded-full px-2 sm:px-3 py-0.5 sm:py-1 bg-black shadow-[0_0_12px_rgba(34,211,238,0.25)] truncate max-w-[140px] sm:max-w-none shrink-0" title={`Plan: ${weeklyPlan.name}`}>
            <Calendar className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-purple-400 shrink-0" /> <span className="truncate">{weeklyPlan.name}</span>
          </span>
        )}
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-0.5 sm:py-0 w-full sm:w-auto sm:flex-wrap">
        {displayFilterItems.map((category) => {
          const isActive = activeFilter === category;
          const theme = getThemeForWorkout(category, weeklyPlan);

          return (
            <button
              key={category}
              type="button"
              onClick={() => onFilterChange(category)}
              className={`px-2.5 sm:px-4 py-1 sm:py-1.5 min-h-[32px] sm:min-h-[36px] rounded-xl text-[11px] sm:text-xs font-bold transition-all duration-200 cursor-pointer shrink-0 flex items-center justify-center ${isActive ? theme.filterActive : theme.filterInactive
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
            className="p-1 sm:p-1.5 px-2.5 sm:px-3.5 min-h-[32px] sm:min-h-[36px] ml-auto sm:ml-1 text-zinc-300 hover:text-neon-cyan bg-[#05080c] border border-neon-cyan/20 hover:border-neon-cyan/60 hover:bg-neon-cyan/10 hover:shadow-[0_0_14px_rgba(34,211,238,0.25)] rounded-xl text-[11px] sm:text-xs font-extrabold flex items-center gap-1.5 transition-all duration-200 cursor-pointer shrink-0"
          >
            <Settings2 className="w-3.5 h-3.5 text-neon-cyan shrink-0" />
            <span>Plan</span>
          </button>
        )}
      </div>
    </div>
  );
}

export default memo(FilterBar);