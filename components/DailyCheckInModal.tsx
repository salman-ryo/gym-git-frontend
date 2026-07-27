'use client';

import { WorkoutType } from '@/lib/types';
import React, { useState } from 'react';
import { Dumbbell, Check, X, Sparkles, Clock, Calendar, ArrowRight, Plus } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        {!answeredYes ? (
          /* Step 1: Did you hit the gym today? */
          <div className="text-center py-4">
            <div className="w-14 h-14 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-2xl mx-auto flex items-center justify-center text-zinc-950 shadow-lg shadow-emerald-500/20 mb-4 animate-bounce">
              <Dumbbell className="w-7 h-7 stroke-[2.5]" />
            </div>

            <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-400 font-semibold mb-1">
              <Calendar className="w-3.5 h-3.5" />
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
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold py-3.5 px-4 rounded-2xl text-base flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20 group"
              >
                <Check className="w-5 h-5 stroke-[3]" />
                <span>Yes!</span>
              </button>

              <button
                type="button"
                onClick={onCheckInNo}
                className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold py-3.5 px-4 rounded-2xl text-base flex items-center justify-center gap-2 transition-all border border-zinc-700/60"
              >
                <X className="w-5 h-5 text-zinc-400" />
                <span>Rest Day</span>
              </button>
            </div>
          </div>
        ) : (
          /* Step 2: Details Panel with Custom Time Support */
          <div className="space-y-5 animate-in slide-in-from-bottom-4 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-zinc-100">Workout Details</h3>
                  <p className="text-xs text-zinc-400">{formattedDate}</p>
                </div>
              </div>
            </div>

            {/* Hours Selection + Custom Time Input */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" /> Time Spent (Hours)
                </label>
                <span className="text-emerald-400 font-bold text-sm">
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
                    className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all border ${
                      !isCustomHours && hours === h
                        ? 'bg-emerald-500 text-zinc-950 border-emerald-400 shadow-md shadow-emerald-500/20'
                        : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    {h}h
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setIsCustomHours(true)}
                  className={`py-2 px-2.5 text-xs font-bold rounded-xl transition-all border flex items-center gap-1 ${
                    isCustomHours
                      ? 'bg-emerald-500 text-zinc-950 border-emerald-400'
                      : 'bg-zinc-950 text-amber-400 border-amber-500/40 hover:border-amber-400'
                  }`}
                >
                  <Plus className="w-3 h-3" />
                  <span>Custom</span>
                </button>
              </div>

              {/* Custom Hours Numeric Field */}
              {isCustomHours && (
                <div className="flex items-center gap-2 p-2.5 bg-zinc-950 border border-emerald-500/50 rounded-xl animate-in fade-in">
                  <span className="text-xs font-semibold text-zinc-400">Custom Duration:</span>
                  <input
                    type="number"
                    min="0.1"
                    max="12"
                    step="0.25"
                    value={customHoursInput}
                    onChange={(e) => setCustomHoursInput(e.target.value)}
                    placeholder="e.g. 3.5"
                    className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1 text-xs text-emerald-400 font-bold outline-none focus:border-emerald-400"
                  />
                  <span className="text-xs font-bold text-zinc-400">hours</span>
                </div>
              )}
            </div>

            {/* Workout Type Selector */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-2">
                Workout Type
              </label>
              <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto pr-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setWorkoutType(cat)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border flex items-center justify-between ${
                      workoutType === cat
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <span className="truncate">{cat}</span>
                    {workoutType === cat && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Session Notes (Optional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. 3.5h intense leg & core marathon!"
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-emerald-500 rounded-xl py-2 px-3 text-xs text-zinc-100 placeholder-zinc-600 outline-none"
              />
            </div>

            {/* Submit */}
            <button
              type="button"
              onClick={handleSaveDetails}
              disabled={saving}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-zinc-950 font-extrabold py-3 px-4 rounded-2xl text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50"
            >
              {saving ? (
                <div className="w-5 h-5 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Save Workout Log</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
