'use client';

import { WorkoutType } from '@/lib/types';
import React, { useState } from 'react';
import { Check, X, Sparkles, Clock, Calendar, Plus } from 'lucide-react';
import Image from 'next/image';
import { getThemeForWorkout } from '../../contribution-graph/theme-utils';

interface DailyCheckInModalProps {
  dateStr: string;
  isOpen: boolean;
  onCheckInYes: (hours: number, workoutType: WorkoutType, notes?: string) => Promise<void>;
  onCheckInNo: () => void;
  availableWorkoutTypes?: string[];
}

const DEFAULT_WORKOUT_TYPES: string[] = ['Push', 'Pull', 'Legs', 'Cardio', 'Core', 'Custom'];

export default function DailyCheckInModal({
  dateStr,
  isOpen,
  onCheckInYes,
  onCheckInNo,
  availableWorkoutTypes = DEFAULT_WORKOUT_TYPES,
}: DailyCheckInModalProps) {
  const [answeredYes, setAnsweredYes] = useState(false);
  const [hours, setHours] = useState<number>(1.0);
  const [isCustomHours, setIsCustomHours] = useState<boolean>(false);
  const [customHoursInput, setCustomHoursInput] = useState<string>('3.0');
  const [workoutType, setWorkoutType] = useState<WorkoutType>('Push');
  const [notes, setNotes] = useState<string>('');
  const [saving, setSaving] = useState(false);

  const rawCategories = availableWorkoutTypes.length > 0 ? availableWorkoutTypes : DEFAULT_WORKOUT_TYPES;
  const categories = Array.from(new Set(rawCategories));

  React.useEffect(() => {
    if (categories.length > 0 && !categories.includes(workoutType)) {
      setWorkoutType(categories[0]);
    }
  }, [categories, workoutType]);

  if (!isOpen) return null;

  const handleSaveDetails = async () => {
    setSaving(true);
    try {
      const finalHours = isCustomHours ? Math.max(0.25, parseFloat(customHoursInput) || 1.0) : hours;
      await onCheckInYes(finalHours, workoutType, notes);
    } finally {
      setSaving(false);
    }
  };

  const formattedDate = new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#080c10]/95 border border-[rgba(0,255,136,0.2)] rounded-3xl p-6 sm:p-7 shadow-[0_0_50px_rgba(0,0,0,0.9)] relative overflow-hidden animate-in scale-in-95 duration-200">
        <div className="absolute -top-[10%] -right-[10%] w-32 h-32 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-[10%] -left-[10%] w-32 h-32 bg-[#a855f7]/10 rounded-full blur-2xl pointer-events-none" />

        {!answeredYes ? (
          /* Step 1: Did you hit the gym today? */
          <div className="text-center py-4 relative z-10">
            <div className="relative w-24 h-24 mx-auto mb-4">
              <Image
                src="/images/anime/question/zoroq.png"
                alt="Zoro Mascot Asking"
                width={96}
                height={96}
                unoptimized
                className="w-full h-full object-contain"
              />
              <span className="absolute -top-1 -right-1 text-2xl font-black text-neon-green drop-shadow-[0_0_8px_rgba(0,255,136,0.6)] animate-bounce select-none">
                ?
              </span>
            </div>

            <div className="flex items-center justify-center gap-1.5 text-base text-emerald-400 font-semibold mb-2">
              <Image src={"/images/icons/today.png"} alt='Today' width={100} height={100} unoptimized className="size-5" />
              <span>{formattedDate}</span>
            </div>

            <h2 className="text-2xl font-black text-zinc-100 tracking-tight mb-2">
              Did you hit the gym today?
            </h2>
            <p className="text-zinc-400 text-sm mb-8">
              Log your session to keep your commit streak growing!
            </p>

            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setAnsweredYes(true)}
                className="w-full bg-gradient-to-r from-neon-green to-teal-400 text-[#060a0e] font-extrabold py-2.5 px-4 rounded-2xl text-base flex items-center justify-center gap-2 transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.03] active:scale-95 shadow-lg shadow-emerald-500/10 hover:shadow-[0_0_20px_rgba(0,255,136,0.45)] cursor-pointer group"
              >
                <Check className="w-5 h-5 stroke-[3.5] transition-transform duration-200 group-hover:scale-125 group-hover:rotate-6" />
                <span>Yes!</span>
              </button>

              <button
                type="button"
                onClick={onCheckInNo}
                className="w-full bg-zinc-950/50 hover:bg-red-500/10 hover:text-red-400 text-zinc-450 font-bold py-2.5 px-4 rounded-2xl text-base flex items-center justify-center gap-2 transition-all duration-200 border border-zinc-850 hover:border-red-500/40 hover:-translate-y-0.5 hover:scale-[1.03] active:scale-95 hover:shadow-[0_0_20px_rgba(239,68,68,0.2)] cursor-pointer group"
              >
                <X className="w-5 h-5 text-zinc-450 transition-transform duration-200 group-hover:scale-110 group-hover:rotate-90 group-hover:text-red-400" />
                <span>Rest Day</span>
              </button>
            </div>
          </div>
        ) : (
          /* Step 2: Details Panel with Custom Time Support */
          <div className="space-y-5 animate-in slide-in-from-bottom-4 duration-200 relative z-10">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
              <div className="flex items-center gap-3">
                <Image src="/images/icons/note.png" alt="Log workout details" width={100} height={100} unoptimized className="size-10" />
                <div>
                  <h3 className="text-base font-black bg-gradient-to-r from-neon-green via-[#00e077] to-neon-cyan bg-clip-text text-transparent uppercase tracking-wider">
                    Workout Details
                  </h3>
                  <p className="text-xs text-zinc-400 font-medium">{formattedDate}</p>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[11px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-neon-green" /> Time Spent (Hours)
                </label>
                <span className="text-neon-green font-black text-sm drop-shadow-[0_0_8px_rgba(0,255,136,0.5)]">
                  {isCustomHours ? `${customHoursInput || '0'} hrs` : `${hours} hrs`}
                </span>
              </div>

              {/* Preset Buttons */}
              <div className="flex items-center gap-1.5 mb-2">
                {[0.5, 1.0, 1.5, 2.0, 2.5].map((h) => (
                  <button
                    key={h}
                    type="button"
                    onClick={() => {
                      setHours(h);
                      setIsCustomHours(false);
                    }}
                    className={`flex-1 py-2 text-xs font-black rounded-xl transition-all border cursor-pointer ${!isCustomHours && hours === h
                      ? 'bg-gradient-to-r from-neon-green to-[#00e077] text-[#060a0e] border-neon-green shadow-[0_0_15px_rgba(0,255,136,0.35)]'
                      : 'bg-[#05080c] text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-zinc-200'
                      }`}
                  >
                    {h}h
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setIsCustomHours(true)}
                  className={`py-2 px-2.5 text-xs font-black rounded-xl transition-all border flex items-center gap-1 cursor-pointer ${isCustomHours
                    ? 'bg-gradient-to-r from-neon-green to-[#00e077] text-[#060a0e] border-neon-green shadow-[0_0_15px_rgba(0,255,136,0.35)]'
                    : 'bg-[#05080c] text-neon-cyan border-neon-cyan/40 hover:border-neon-cyan'
                    }`}
                >
                  <Plus className="w-3 h-3" />
                  <span>Custom</span>
                </button>
              </div>

              {/* Custom Hours Numeric Field */}
              {isCustomHours && (
                <div className="flex items-center gap-2.5 p-2 bg-[#05080c] border border-neon-green/30 focus-within:border-neon-green/60 rounded-xl transition-all duration-200 animate-in fade-in">
                  <span className="text-xs font-bold text-zinc-400 pl-1.5">Custom Duration:</span>
                  <input
                    type="number"
                    min="0.1"
                    max="12"
                    step="0.25"
                    value={customHoursInput}
                    onChange={(e) => setCustomHoursInput(e.target.value)}
                    placeholder="e.g. 3.5"
                    className="flex-1 bg-zinc-950 border border-zinc-800 focus:border-neon-green focus:shadow-[0_0_8px_rgba(0,255,136,0.2)] rounded-lg px-2 py-1 text-xs text-neon-green font-black outline-none transition-all duration-200"
                  />
                  <span className="text-xs font-bold text-zinc-400 pr-1.5">hours</span>
                </div>
              )}
            </div>

            {/* Workout Type Selector */}
            <div>
              <label className="block text-[11px] font-black text-zinc-400 uppercase tracking-widest mb-2">
                Select Workout Type:
              </label>
              <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto pr-1">
                {categories.map((cat) => {
                  const isSelected = workoutType === cat;
                  const catTheme = getThemeForWorkout(cat);

                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setWorkoutType(cat)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border flex items-center justify-between cursor-pointer ${isSelected
                        ? catTheme.filterActive
                        : 'bg-[#05080c] border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                        }`}
                    >
                      <span className="truncate">{cat}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1.5">
                Session Notes? (Optional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="How did it go? e.g. New bench press PR!"
                className="w-full bg-[#05080c] border border-zinc-800 focus:border-neon-green focus:shadow-[0_0_10px_rgba(0,255,136,0.25)] hover:border-zinc-700 rounded-xl py-2 px-3.5 text-xs text-zinc-100 placeholder-zinc-600 outline-none transition-all duration-200"
              />
            </div>

            {/* Submit */}
            <button
              type="button"
              onClick={handleSaveDetails}
              disabled={saving}
              className="w-full bg-gradient-to-r from-neon-green via-[#00e077] to-neon-cyan hover:shadow-[0_0_25px_rgba(0,255,136,0.45)] hover:scale-[1.01] active:scale-100 text-[#060a0e] font-black py-3 px-4 rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer disabled:opacity-50"
            >
              {saving ? (
                <div className="w-5 h-5 border-2 border-[#060a0e] border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Check className="w-4 h-4 text-[#060a0e]" />
                  <span>Log This Session</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
