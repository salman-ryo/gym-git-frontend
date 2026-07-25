'use client';

import { WorkoutType } from '@/lib/types';
import React from 'react';
import { Activity, Dumbbell, Flame, HeartPulse, Sparkles, SlidersHorizontal } from 'lucide-react';

interface FilterBarProps {
  activeFilter: WorkoutType | 'All';
  onFilterChange: (filter: WorkoutType | 'All') => void;
}

const FILTER_ITEMS: { label: WorkoutType | 'All'; icon: React.ElementType; color: string }[] = [
  { label: 'All', icon: SlidersHorizontal, color: 'text-zinc-400' },
  { label: 'Push', icon: Dumbbell, color: 'text-sky-400' },
  { label: 'Pull', icon: Flame, color: 'text-amber-400' },
  { label: 'Legs', icon: Activity, color: 'text-emerald-400' },
  { label: 'Cardio', icon: HeartPulse, color: 'text-rose-400' },
  { label: 'Custom', icon: Sparkles, color: 'text-purple-400' },
];

export default function FilterBar({ activeFilter, onFilterChange }: FilterBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 bg-zinc-900/60 border border-zinc-800/80 p-3 rounded-2xl">
      <div className="flex items-center gap-2">
        <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
        <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Filter Activity:</span>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        {FILTER_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeFilter === item.label;
          return (
            <button
              key={item.label}
              type="button"
              onClick={() => onFilterChange(item.label)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 ${
                isActive
                  ? 'bg-emerald-500 text-zinc-950 shadow-md shadow-emerald-500/20 font-bold scale-[1.02]'
                  : 'bg-zinc-950 text-zinc-400 hover:text-zinc-200 border border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-zinc-950' : item.color}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
