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

const THEMES = [
  {
    name: 'cyan',
    active: 'bg-gradient-to-r from-neon-cyan to-[#00b8d4] text-[#060a0e] font-extrabold border border-neon-cyan shadow-[0_0_18px_rgba(34,211,238,0.35)]',
    inactive: 'bg-[#05080c] border border-zinc-800/90 text-zinc-400 hover:text-neon-cyan hover:border-neon-cyan/50 hover:bg-neon-cyan/10 hover:shadow-[0_0_12px_rgba(34,211,238,0.18)]',
    extra: 'bg-neon-cyan/5 border border-neon-cyan/20 text-neon-cyan hover:bg-neon-cyan/15 hover:border-neon-cyan/60 hover:shadow-[0_0_12px_rgba(34,211,238,0.2)]'
  },
  {
    name: 'purple',
    active: 'bg-gradient-to-r from-neon-purple to-[#9333ea] text-white font-extrabold border border-neon-purple shadow-[0_0_18px_rgba(168,85,247,0.35)]',
    inactive: 'bg-[#05080c] border border-zinc-800/90 text-zinc-400 hover:text-neon-purple hover:border-neon-purple/50 hover:bg-neon-purple/10 hover:shadow-[0_0_12px_rgba(168,85,247,0.18)]',
    extra: 'bg-neon-purple/5 border border-neon-purple/20 text-neon-purple hover:bg-neon-purple/15 hover:border-neon-purple/60 hover:shadow-[0_0_12px_rgba(168,85,247,0.2)]'
  },
  {
    name: 'sky',
    active: 'bg-gradient-to-r from-sky-400 to-sky-500 text-[#060a0e] font-extrabold border border-sky-400 shadow-[0_0_18px_rgba(56,189,248,0.35)]',
    inactive: 'bg-[#05080c] border border-zinc-800/90 text-zinc-400 hover:text-sky-400 hover:border-sky-400/50 hover:bg-sky-500/10 hover:shadow-[0_0_12px_rgba(56,189,248,0.18)]',
    extra: 'bg-sky-500/5 border border-sky-500/20 text-sky-400 hover:bg-sky-500/15 hover:border-sky-400/60 hover:shadow-[0_0_12px_rgba(56,189,248,0.2)]'
  },
  {
    name: 'amber',
    active: 'bg-gradient-to-r from-amber-400 to-amber-500 text-[#060a0e] font-extrabold border border-amber-400 shadow-[0_0_18px_rgba(251,191,36,0.35)]',
    inactive: 'bg-[#05080c] border border-zinc-800/90 text-zinc-400 hover:text-amber-400 hover:border-amber-400/50 hover:bg-amber-500/10 hover:shadow-[0_0_12px_rgba(251,191,36,0.18)]',
    extra: 'bg-amber-500/5 border border-amber-500/20 text-amber-400 hover:bg-amber-500/15 hover:border-amber-400/60 hover:shadow-[0_0_12px_rgba(251,191,36,0.2)]'
  },
  {
    name: 'rose',
    active: 'bg-gradient-to-r from-rose-400 to-rose-500 text-white font-extrabold border border-rose-400 shadow-[0_0_18px_rgba(251,113,133,0.35)]',
    inactive: 'bg-[#05080c] border border-zinc-800/90 text-zinc-400 hover:text-rose-400 hover:border-rose-400/50 hover:bg-rose-500/10 hover:shadow-[0_0_12px_rgba(251,113,133,0.18)]',
    extra: 'bg-rose-500/5 border border-rose-500/20 text-rose-400 hover:bg-rose-500/15 hover:border-rose-400/60 hover:shadow-[0_0_12px_rgba(251,113,133,0.2)]'
  }
];

const getThemeForWorkout = (type: string) => {
  const defaultTheme = {
    active: 'bg-gradient-to-r from-neon-green to-[#00e077] text-[#060a0e] font-extrabold border border-neon-green shadow-[0_0_18px_rgba(0,255,136,0.35)]',
    inactive: 'bg-[#05080c] border border-zinc-800/90 text-zinc-400 hover:text-neon-green hover:border-neon-green/50 hover:bg-neon-green/10 hover:shadow-[0_0_12px_rgba(0,255,136,0.18)]',
    extra: 'bg-neon-green/5 border border-neon-green/20 text-neon-green hover:bg-neon-green/15 hover:border-neon-green/60 hover:shadow-[0_0_12px_rgba(0,255,136,0.2)]'
  };

  if (!type || type === 'All') return defaultTheme;

  let hash = 0;
  for (let i = 0; i < type.length; i++) {
    hash = type.charCodeAt(i) + ((hash << 5) - hash);
  }
  return THEMES[Math.abs(hash) % THEMES.length];
};

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
    if (!uniqueLabels.has(cat)) {
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
          <span className="hidden sm:inline-flex items-center gap-1.5 text-[10.5px] font-extrabold text-neon-green border border-neon-green/30 rounded-full px-3 py-1 bg-neon-green/10 shadow-[0_0_12px_rgba(0,255,136,0.12)]">
            <Sparkles className="w-3 h-3 text-neon-green" /> {weeklyPlan.name}
          </span>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {displayFilterItems.map((category) => {
          const isActive = activeFilter === category;
          const theme = getThemeForWorkout(category);

          return (
            <button
              key={category}
              type="button"
              onClick={() => onFilterChange(category)}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${isActive ? theme.active : theme.inactive
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