'use client';

import React, { useState } from 'react';
import { Check, Sparkles, Flame, Shield, ArrowRight, Layers, Plus } from 'lucide-react';
import { WeeklyPlan, PREBUILT_PLANS } from '@/lib/types';
import { getThemeForWorkout } from '@/components/contribution-graph/theme-utils';

interface PlanFrequencyStepProps {
  selectedPlanId: string;
  onSelectPlan: (plan: WeeklyPlan) => void;
  onSelectCustom: (daysCount: number) => void;
  onNext: () => void;
}

const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function PlanFrequencyStep({
  selectedPlanId,
  onSelectPlan,
  onSelectCustom,
  onNext,
}: PlanFrequencyStepProps) {
  const [frequencyFilter, setFrequencyFilter] = useState<number | 'all'>('all');

  const filteredPlans = frequencyFilter === 'all'
    ? PREBUILT_PLANS
    : PREBUILT_PLANS.filter((p) => (p.daysPerWeek || 4) === frequencyFilter);

  const frequencyCounts = [
    { label: 'All Splits', value: 'all' as const, count: PREBUILT_PLANS.length },
    { label: '3 Days', value: 3 as const, count: PREBUILT_PLANS.filter((p) => p.daysPerWeek === 3).length },
    { label: '4 Days', value: 4 as const, count: PREBUILT_PLANS.filter((p) => p.daysPerWeek === 4).length },
    { label: '5 Days', value: 5 as const, count: PREBUILT_PLANS.filter((p) => p.daysPerWeek === 5).length },
    { label: '6 Days', value: 6 as const, count: PREBUILT_PLANS.filter((p) => p.daysPerWeek === 6).length },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* ── Frequency Filter Pills ── */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <label className="block text-[11px] font-black text-zinc-300 uppercase tracking-widest flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-neon-green" /> 1. Select Workout Days Per Week:
          </label>
          <span className="text-[10px] font-bold text-zinc-500">
            Cycle = 7 Days
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {frequencyCounts.map((freq) => {
            const isFilterActive = frequencyFilter === freq.value;
            return (
              <button
                key={freq.label}
                type="button"
                onClick={() => setFrequencyFilter(freq.value)}
                className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all duration-200 cursor-pointer flex items-center gap-1.5 border ${
                  isFilterActive
                    ? 'bg-gradient-to-r from-neon-green/20 to-neon-cyan/20 border-neon-green text-neon-green shadow-[0_0_15px_rgba(0,255,136,0.25)]'
                    : 'bg-zinc-950/70 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                }`}
              >
                <span>{freq.label}</span>
                <span
                  className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                    isFilterActive
                      ? 'bg-neon-green/30 text-neon-green border border-neon-green/40'
                      : 'bg-zinc-800 text-zinc-500'
                  }`}
                >
                  {freq.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Split Options Grid ── */}
      <div className="space-y-3">
        <label className="block text-[11px] font-black text-zinc-300 uppercase tracking-widest flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-neon-cyan" /> 2. Choose a Plan Template or Custom Canvas:
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {filteredPlans.map((plan) => {
            const isSelected = selectedPlanId === plan.id;
            const workoutDays = plan.daysPerWeek || 4;
            const restDays = 7 - workoutDays;
            const schedule = plan.schedule || ['Push', 'Pull', 'Legs', 'Rest', 'Cardio', 'Rest', 'Rest'];

            return (
              <button
                key={plan.id}
                type="button"
                onClick={() => {
                  onSelectPlan(plan);
                }}
                className={`p-4 rounded-2xl text-left border transition-all duration-200 relative cursor-pointer group flex flex-col justify-between ${
                  isSelected
                    ? 'bg-zinc-950/95 border-neon-green text-zinc-100 shadow-[0_0_22px_rgba(0,255,136,0.25)] ring-1 ring-neon-green/50'
                    : 'bg-zinc-950/80 border-zinc-800/80 text-zinc-400 hover:border-zinc-700 hover:text-zinc-300'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div>
                      <p className="text-xs font-black text-zinc-100 group-hover:text-neon-green transition-colors">
                        {plan.name}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider text-neon-green bg-neon-green/10 border border-neon-green/30 px-2 py-0.5 rounded-md">
                          ⚡ {workoutDays} Days / Week
                        </span>
                        <span className="inline-flex items-center gap-1 text-[9px] font-bold text-slate-300 bg-slate-800/60 border border-slate-700/60 px-1.5 py-0.5 rounded-md">
                          <Shield className="w-2.5 h-2.5 text-slate-400" /> {restDays} Rest {restDays === 1 ? 'Token' : 'Tokens'}
                        </span>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-neon-green/20 border border-neon-green flex items-center justify-center text-[#060a0e] shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5 text-neon-green" />
                      </div>
                    )}
                  </div>

                  <p className="text-[10px] text-zinc-400 leading-relaxed mb-3 mt-1.5">
                    {plan.description}
                  </p>

                  {/* 7-Day Mini Dots Schedule Preview */}
                  <div className="bg-[#05080c] border border-zinc-800/80 rounded-xl p-2 mb-3">
                    <div className="grid grid-cols-7 gap-1 text-center">
                      {schedule.map((cat, idx) => {
                        const isRest = cat.toLowerCase() === 'rest';
                        const theme = getThemeForWorkout(cat, plan);
                        return (
                          <div key={idx} className="flex flex-col items-center">
                            <span className="text-[8px] font-bold text-zinc-500 mb-0.5">
                              {DAY_NAMES[idx]}
                            </span>
                            <span
                              className={`w-full py-0.5 rounded text-[8px] font-extrabold truncate border ${
                                isRest
                                  ? 'bg-zinc-900 border-zinc-800 text-zinc-500'
                                  : `${theme.pillWeek} border-opacity-60`
                              }`}
                              title={`${DAY_NAMES[idx]}: ${cat}`}
                            >
                              {isRest ? 'Rest' : cat.slice(0, 3)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Categories Pill list */}
                <div className="flex flex-wrap gap-1.5 pt-1 border-t border-zinc-900">
                  {plan.categories.filter((c) => c.toLowerCase() !== 'rest').slice(0, 4).map((cat) => {
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
                  {plan.categories.filter((c) => c.toLowerCase() !== 'rest').length > 4 && (
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700">
                      +{plan.categories.filter((c) => c.toLowerCase() !== 'rest').length - 4}
                    </span>
                  )}
                </div>
              </button>
            );
          })}

          {/* ── Custom Blank Split Card ── */}
          {(() => {
            const isSelected = selectedPlanId === 'custom-plan';
            const targetDays = typeof frequencyFilter === 'number' ? frequencyFilter : 4;

            return (
              <button
                type="button"
                onClick={() => onSelectCustom(targetDays)}
                className={`p-4 rounded-2xl text-left border transition-all duration-200 relative cursor-pointer group flex flex-col justify-between ${
                  isSelected
                    ? 'bg-zinc-950/95 border-neon-cyan text-zinc-100 shadow-[0_0_22px_rgba(34,211,238,0.25)] ring-1 ring-neon-cyan/50'
                    : 'bg-zinc-950/80 border-zinc-800/80 text-zinc-400 hover:border-zinc-700 hover:text-zinc-300'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div>
                      <p className="text-xs font-black text-zinc-100 group-hover:text-neon-cyan transition-colors flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-neon-cyan" />
                        <span>Build Custom Split</span>
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider text-neon-cyan bg-neon-cyan/10 border border-neon-cyan/30 px-2 py-0.5 rounded-md">
                          ⚡ {targetDays} Workout Days
                        </span>
                        <span className="inline-flex items-center gap-1 text-[9px] font-bold text-slate-300 bg-slate-800/60 border border-slate-700/60 px-1.5 py-0.5 rounded-md">
                          <Shield className="w-2.5 h-2.5 text-slate-400" /> {7 - targetDays} Rest Tokens
                        </span>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-neon-cyan/20 border border-neon-cyan flex items-center justify-center text-[#060a0e] shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5 text-neon-cyan" />
                      </div>
                    )}
                  </div>

                  <p className="text-[10px] text-zinc-400 leading-relaxed mb-3 mt-1.5">
                    Design a unique schedule from scratch with your preferred workout categories, custom split tags, and rest cadence.
                  </p>

                  <div className="bg-[#05080c] border border-cyan-500/20 rounded-xl p-2.5 text-center flex items-center justify-center gap-2 text-cyan-400 text-xs font-bold">
                    <Plus className="w-3.5 h-3.5" />
                    <span>Configure your custom 7-day schedule</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-zinc-900 flex items-center justify-between text-[9px] text-zinc-400">
                  <span>Customizable Categories</span>
                  <span className="text-neon-cyan font-bold">Full Flexibility</span>
                </div>
              </button>
            );
          })()}
        </div>
      </div>

      {/* ── Continue Action Button ── */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onNext}
          className="w-full bg-gradient-to-r from-neon-green via-[#00e077] to-neon-cyan hover:shadow-[0_0_25px_rgba(0,255,136,0.4)] text-[#060a0e] font-black py-3.5 px-5 rounded-2xl text-sm flex items-center justify-center gap-2.5 transition-all duration-200 cursor-pointer group"
        >
          <span className="tracking-wider uppercase text-xs font-black">
            Continue to Schedule &amp; Day Assignment
          </span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
}
