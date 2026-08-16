'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  ArrowLeft,
  Dumbbell,
  Shield,
  Plus,
  X,
  Check,
  Calendar,
  Layers,
  ChevronDown,
} from 'lucide-react';
import { WeeklyPlan } from '@/lib/types';
import { getThemeForWorkout } from '@/components/contribution-graph/theme-utils';

interface DayScheduleStepProps {
  schedule: string[]; // 7 items (Mon..Sun)
  setSchedule: (newSchedule: string[]) => void;
  categories: string[];
  setCategories: (cats: string[]) => void;
  planName: string;
  setPlanName: (name: string) => void;
  planDesc: string;
  setPlanDesc: (desc: string) => void;
  onBack: () => void;
  onSave: () => Promise<void>;
  saving: boolean;
}

const DAYS_CONFIG = [
  { name: 'Monday', short: 'Mon', index: 0 },
  { name: 'Tuesday', short: 'Tue', index: 1 },
  { name: 'Wednesday', short: 'Wed', index: 2 },
  { name: 'Thursday', short: 'Thu', index: 3 },
  { name: 'Friday', short: 'Fri', index: 4 },
  { name: 'Saturday', short: 'Sat', index: 5 },
  { name: 'Sunday', short: 'Sun', index: 6 },
];

export default function DayScheduleStep({
  schedule,
  setSchedule,
  categories,
  setCategories,
  planName,
  setPlanName,
  planDesc,
  setPlanDesc,
  onBack,
  onSave,
  saving,
}: DayScheduleStepProps) {
  const [newCatInput, setNewCatInput] = useState('');
  const [openDaySelector, setOpenDaySelector] = useState<number | null>(null);

  // Calculate active workout days vs rest days
  const activeWorkoutDays = schedule.filter((c) => c.toLowerCase() !== 'rest').length;
  const restTokens = Math.max(1, 7 - activeWorkoutDays);

  const handleDayChange = (dayIndex: number, newCategory: string) => {
    const updated = [...schedule];
    updated[dayIndex] = newCategory;
    setSchedule(updated);

    // If newCategory is not 'Rest' and not in categories, add it
    if (newCategory.toLowerCase() !== 'rest' && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
    }
    setOpenDaySelector(null);
  };

  const handleToggleRestDay = (dayIndex: number) => {
    const current = schedule[dayIndex];
    if (current.toLowerCase() === 'rest') {
      // Switch to first available workout category
      const defaultCategory = categories.find((c) => c.toLowerCase() !== 'rest') || 'Push';
      handleDayChange(dayIndex, defaultCategory);
    } else {
      // Switch to Rest
      handleDayChange(dayIndex, 'Rest');
    }
  };

  const handleAddCustomCategory = () => {
    if (!newCatInput.trim()) return;
    const cleanName = newCatInput.trim();
    if (!categories.includes(cleanName)) {
      setCategories([...categories, cleanName]);
    }
    setNewCatInput('');
  };

  const handleRemoveCustomCategory = (cat: string) => {
    const updatedCats = categories.filter((c) => c !== cat);
    setCategories(updatedCats);

    // Replace any days with this category to Rest or first available
    const fallback = updatedCats.find((c) => c.toLowerCase() !== 'rest') || 'Rest';
    const updatedSchedule = schedule.map((dayCat) => (dayCat === cat ? fallback : dayCat));
    setSchedule(updatedSchedule);
  };

  const dummyPlanObj: WeeklyPlan = {
    id: 'temp-preview',
    name: planName,
    categories: categories,
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* ── Top Bar: Back Action & Live Cycle Stats ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-zinc-800/80">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-400 hover:text-neon-cyan transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Change Plan Type / Template</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-black text-neon-green bg-neon-green/10 border border-neon-green/30 px-2.5 py-1 rounded-xl">
            ⚡ {activeWorkoutDays} Workout {activeWorkoutDays === 1 ? 'Day' : 'Days'}
          </span>
          <span className="inline-flex items-center gap-1.5 text-[10px] font-black text-slate-300 bg-slate-800/80 border border-slate-700 px-2.5 py-1 rounded-xl">
            <Shield className="w-3 h-3 text-slate-400" /> {restTokens} Rest {restTokens === 1 ? 'Token' : 'Tokens'}
          </span>
        </div>
      </div>

      {/* ── Plan Profile Inputs ── */}
      <div className="bg-zinc-950/80 border border-zinc-800/90 rounded-2xl p-4 space-y-3.5 shadow-inner">
        <span className="text-xs font-black text-zinc-200 flex items-center gap-2 border-b border-zinc-800/80 pb-2.5">
          <Sparkles className="w-3.5 h-3.5 text-neon-green animate-pulse" />
          <span className="tracking-wide">Plan Profile &amp; Title</span>
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1.5">
              Plan Name:
            </label>
            <input
              type="text"
              value={planName}
              onChange={(e) => setPlanName(e.target.value)}
              placeholder="e.g. Push / Pull / Legs (PPL)"
              className="w-full bg-[#05080c] border border-zinc-800 focus:border-neon-green focus:shadow-[0_0_15px_rgba(0,255,136,0.2)] rounded-xl px-3.5 py-2 text-xs text-zinc-100 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1.5">
              Plan Description:
            </label>
            <input
              type="text"
              value={planDesc}
              onChange={(e) => setPlanDesc(e.target.value)}
              placeholder="e.g. 4-day split focusing on progressive overload"
              className="w-full bg-[#05080c] border border-zinc-800 focus:border-neon-green focus:shadow-[0_0_15px_rgba(0,255,136,0.2)] rounded-xl px-3.5 py-2 text-xs text-zinc-100 outline-none transition-all"
            />
          </div>
        </div>
      </div>

      {/* ── 7-Day Day-by-Day Schedule Matrix ── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="block text-[11px] font-black text-zinc-300 uppercase tracking-widest flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-neon-green" /> 7-Day Split Assignment:
          </label>
          <span className="text-[10px] text-zinc-500 font-semibold">
            Click any day to change workout or set as rest
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-2.5">
          {DAYS_CONFIG.map((day) => {
            const currentCat = schedule[day.index] || 'Rest';
            const isRest = currentCat.toLowerCase() === 'rest';
            const theme = getThemeForWorkout(currentCat, dummyPlanObj);
            const isDropdownOpen = openDaySelector === day.index;

            return (
              <div
                key={day.name}
                className={`relative rounded-2xl border transition-all duration-200 p-3.5 flex flex-col justify-between ${
                  isRest
                    ? 'bg-zinc-950/70 border-zinc-800/80 hover:border-zinc-700'
                    : 'bg-zinc-950/90 border-zinc-800 hover:border-zinc-700 shadow-sm'
                }`}
              >
                {/* Day Header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-black text-zinc-200">{day.short}</span>
                    <span className="text-[9px] font-bold text-zinc-500">Day {day.index + 1}</span>
                  </div>

                  {/* Rest vs Workout Toggle Button */}
                  <button
                    type="button"
                    onClick={() => handleToggleRestDay(day.index)}
                    title={isRest ? 'Switch to Workout Day' : 'Switch to Rest Day'}
                    className={`text-[9px] font-black px-1.5 py-0.5 rounded-md border transition-all cursor-pointer ${
                      isRest
                        ? 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700'
                        : 'bg-neon-green/10 border-neon-green/30 text-neon-green hover:bg-neon-green/20'
                    }`}
                  >
                    {isRest ? '🛡️ Rest' : '⚡ Gym'}
                  </button>
                </div>

                {/* Day Assignment Badge / Picker Button */}
                <div className="relative mt-1">
                  <button
                    type="button"
                    onClick={() => setOpenDaySelector(isDropdownOpen ? null : day.index)}
                    className={`w-full py-2 px-2.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                      isRest
                        ? 'bg-[#05080c] border-zinc-800 text-zinc-400 hover:border-zinc-700'
                        : `${theme.pillWeek} shadow-sm font-black`
                    }`}
                  >
                    <span className="text-xs font-bold truncate">{currentCat}</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 shrink-0 opacity-60 transition-transform duration-200 ${
                        isDropdownOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {/* Category Dropdown Picker */}
                  {isDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 z-30 bg-zinc-950 border border-zinc-700 rounded-xl p-1.5 shadow-[0_10px_30px_rgba(0,0,0,0.8)] max-h-48 overflow-y-auto space-y-1 animate-in fade-in zoom-in-95">
                      {/* Rest Option */}
                      <button
                        type="button"
                        onClick={() => handleDayChange(day.index, 'Rest')}
                        className={`w-full px-2.5 py-1.5 rounded-lg text-left text-xs font-bold flex items-center justify-between cursor-pointer transition-colors ${
                          isRest
                            ? 'bg-slate-800 text-slate-200'
                            : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
                        }`}
                      >
                        <span className="flex items-center gap-1.5">
                          <Shield className="w-3 h-3 text-slate-400" /> Rest Day
                        </span>
                        {isRest && <Check className="w-3.5 h-3.5 text-slate-300" />}
                      </button>

                      {/* Workout Categories */}
                      {categories
                        .filter((c) => c.toLowerCase() !== 'rest')
                        .map((cat) => {
                          const isCatSelected = currentCat === cat;
                          const catTheme = getThemeForWorkout(cat, dummyPlanObj);

                          return (
                            <button
                              key={cat}
                              type="button"
                              onClick={() => handleDayChange(day.index, cat)}
                              className={`w-full px-2.5 py-1.5 rounded-lg text-left text-xs font-bold flex items-center justify-between cursor-pointer transition-colors ${
                                isCatSelected
                                  ? `${catTheme.pillWeek} font-black`
                                  : 'text-zinc-300 hover:bg-zinc-900 hover:text-white'
                              }`}
                            >
                              <span className="truncate">{cat}</span>
                              {isCatSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                            </button>
                          );
                        })}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Category Tags Manager & Custom Category Creator ── */}
      <div className="bg-zinc-950/80 border border-zinc-800/90 rounded-2xl p-4 space-y-3 shadow-inner">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-zinc-200 flex items-center gap-2">
            <Layers className="w-3.5 h-3.5 text-neon-cyan animate-pulse" />
            <span className="tracking-wide">Available Workout Categories &amp; Tags</span>
          </span>
          <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
            {categories.filter((c) => c.toLowerCase() !== 'rest').length} Categories
          </span>
        </div>

        {/* Categories Chips */}
        <div className="flex flex-wrap gap-2 pt-1">
          {categories
            .filter((c) => c.toLowerCase() !== 'rest')
            .map((cat) => {
              const catTheme = getThemeForWorkout(cat, dummyPlanObj);
              const isUsedInSchedule = schedule.includes(cat);

              return (
                <span
                  key={cat}
                  className={`text-xs font-extrabold px-3 py-1.5 rounded-xl border flex items-center gap-2 transition-all ${catTheme.pillWeek} shadow-sm`}
                >
                  <span>{cat}</span>
                  {categories.length > 2 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveCustomCategory(cat)}
                      title={isUsedInSchedule ? 'Remove category and clear from days' : `Remove ${cat}`}
                      className="text-zinc-400 hover:text-red-400 hover:scale-110 transition-all cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </span>
              );
            })}
        </div>

        {/* Add custom tag input */}
        <div className="flex items-center gap-2 pt-2">
          <input
            type="text"
            value={newCatInput}
            onChange={(e) => setNewCatInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddCustomCategory();
              }
            }}
            placeholder="Add new category tag (e.g. Chest & Triceps, Swimming, Boxing, Yoga)..."
            className="flex-1 bg-[#05080c] border border-zinc-800 focus:border-neon-cyan focus:shadow-[0_0_15px_rgba(34,211,238,0.2)] rounded-xl px-3.5 py-2 text-xs text-zinc-100 outline-none transition-all"
          />
          <button
            type="button"
            onClick={handleAddCustomCategory}
            className="px-4 py-2 bg-neon-cyan/10 hover:bg-neon-cyan/20 border border-neon-cyan/30 hover:border-neon-cyan text-neon-cyan rounded-xl text-xs font-black flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(34,211,238,0.15)] cursor-pointer shrink-0"
          >
            <Plus className="w-3.5 h-3.5" /> <span>Add Category</span>
          </button>
        </div>
      </div>

      {/* ── Final Save Plan Button ── */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onSave}
          disabled={saving || !planName.trim() || activeWorkoutDays === 0}
          className="w-full bg-gradient-to-r from-neon-green via-[#00e077] to-neon-cyan hover:shadow-[0_0_25px_rgba(0,255,136,0.4)] text-[#060a0e] font-black py-3.5 px-5 rounded-2xl text-sm flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 cursor-pointer"
        >
          {saving ? (
            <div className="w-5 h-5 border-2 border-[#060a0e] border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Dumbbell className="w-4 h-4 text-[#060a0e]" />
              <span className="tracking-wide uppercase text-xs font-black">
                Apply &amp; Save Weekly Plan
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
