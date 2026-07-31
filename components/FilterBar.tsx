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
    name: 'sky',
    active: 'bg-sky-400 border border-sky-400 text-zinc-950 shadow-[0_0_12px_rgba(56,189,248,0.5)]',
    inactive: 'bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-sky-400 hover:border-sky-400/60 hover:bg-sky-500/10 hover:shadow-[0_0_12px_rgba(56,189,248,0.25)]',
    extra: 'bg-sky-500/5 border border-sky-500/20 text-sky-400 hover:bg-sky-500/15 hover:border-sky-400/60 hover:shadow-[0_0_12px_rgba(56,189,248,0.25)]'
  },
  {
    name: 'purple',
    active: 'bg-purple-400 border border-purple-400 text-zinc-950 shadow-[0_0_12px_rgba(192,132,252,0.5)]',
    inactive: 'bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-purple-400 hover:border-purple-400/60 hover:bg-purple-500/10 hover:shadow-[0_0_12px_rgba(192,132,252,0.25)]',
    extra: 'bg-purple-500/5 border border-purple-500/20 text-purple-400 hover:bg-purple-500/15 hover:border-purple-400/60 hover:shadow-[0_0_12px_rgba(192,132,252,0.25)]'
  },
  {
    name: 'rose',
    active: 'bg-rose-400 border border-rose-400 text-zinc-950 shadow-[0_0_12px_rgba(251,113,133,0.5)]',
    inactive: 'bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-rose-400 hover:border-rose-400/60 hover:bg-rose-500/10 hover:shadow-[0_0_12px_rgba(251,113,133,0.25)]',
    extra: 'bg-rose-500/5 border border-rose-500/20 text-rose-400 hover:bg-rose-500/15 hover:border-rose-400/60 hover:shadow-[0_0_12px_rgba(251,113,133,0.25)]'
  },
  {
    name: 'amber',
    active: 'bg-amber-400 border border-amber-400 text-zinc-950 shadow-[0_0_12px_rgba(251,191,36,0.5)]',
    inactive: 'bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-amber-400 hover:border-amber-400/60 hover:bg-amber-500/10 hover:shadow-[0_0_12px_rgba(251,191,36,0.25)]',
    extra: 'bg-amber-500/5 border border-amber-500/20 text-amber-400 hover:bg-amber-500/15 hover:border-amber-400/60 hover:shadow-[0_0_12px_rgba(251,191,36,0.25)]'
  },
  {
    name: 'cyan',
    active: 'bg-cyan-400 border border-cyan-400 text-zinc-950 shadow-[0_0_12px_rgba(34,211,238,0.5)]',
    inactive: 'bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-cyan-400 hover:border-cyan-400/60 hover:bg-cyan-500/10 hover:shadow-[0_0_12px_rgba(34,211,238,0.25)]',
    extra: 'bg-cyan-500/5 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/15 hover:border-cyan-400/60 hover:shadow-[0_0_12px_rgba(34,211,238,0.25)]'
  }
];

const getThemeForWorkout = (type: string) => {
  // Swapped Emerald to a deep neon Indigo for the base theme
  const defaultTheme = {
    active: 'bg-indigo-400 border border-indigo-400 text-zinc-950 shadow-[0_0_12px_rgba(129,140,248,0.5)]',
    inactive: 'bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-indigo-400 hover:border-indigo-400/60 hover:bg-indigo-500/10 hover:shadow-[0_0_12px_rgba(129,140,248,0.25)]',
    extra: 'bg-indigo-500/5 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/15 hover:border-indigo-400/60 hover:shadow-[0_0_12px_rgba(129,140,248,0.25)]'
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
  availableTypes = [],
}: FilterBarProps) {

  const planCategories = weeklyPlan?.categories || ['Push', 'Pull', 'Legs', 'Cardio', 'Custom'];
  const extraHistoricalTypes = availableTypes.filter(
    (t) => !planCategories.includes(t) && t !== 'All'
  );

  const uniqueLabels = new Set<string>();
  const displayFilterItems: { label: WorkoutType | 'All'; isExtra?: boolean }[] = [];

  displayFilterItems.push({ label: 'All' });
  uniqueLabels.add('All');

  planCategories.forEach((cat) => {
    if (!uniqueLabels.has(cat)) {
      displayFilterItems.push({ label: cat });
      uniqueLabels.add(cat);
    }
  });

  extraHistoricalTypes.forEach((cat) => {
    if (!uniqueLabels.has(cat)) {
      displayFilterItems.push({ label: cat, isExtra: true });
      uniqueLabels.add(cat);
    }
  });

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-b border-t border-zinc-800 mb-4">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-indigo-400">
          <SlidersHorizontal className="w-4 h-4" />
          <span className="text-[11px] font-black uppercase tracking-widest text-zinc-300">
            Filter Activity:
          </span>
        </div>

        {weeklyPlan && (
          <span className="hidden sm:inline-flex items-center gap-1.5 text-[10px] font-bold text-indigo-400 border border-indigo-500/30 rounded-full px-3 py-1 bg-indigo-500/10">
            <Sparkles className="w-3 h-3" /> {weeklyPlan.name}
          </span>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {displayFilterItems.map((item) => {
          const isActive = activeFilter === item.label;
          const theme = getThemeForWorkout(item.label);

          return (
            <button
              key={item.label}
              type="button"
              onClick={() => onFilterChange(item.label)}
              className={`px-4 py-1.5 rounded-full text-[11px] font-bold transition-all duration-300 ${isActive ? theme.active : item.isExtra ? theme.extra : theme.inactive
                }`}
            >
              <span>{item.label}</span>
              {item.isExtra && (
                <span className="ml-1.5 text-[8px] px-1 rounded bg-zinc-950/50 mix-blend-overlay">Past</span>
              )}
            </button>
          );
        })}

        {onOpenPlanModal && (
          <button
            type="button"
            onClick={onOpenPlanModal}
            title="Edit Weekly Plan & Categories"
            className="p-1.5 px-3 ml-2 text-zinc-400 hover:text-indigo-400 border border-zinc-800 hover:border-indigo-500/50 hover:bg-indigo-500/10 hover:shadow-[0_0_10px_rgba(129,140,248,0.2)] rounded-full text-[11px] font-bold flex items-center gap-1.5 transition-all duration-300"
          >
            <Settings2 className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden md:inline">Plan</span>
          </button>
        )}
      </div>
    </div>
  );
}