'use client';

import { GymLog, WorkoutType } from '@/lib/types';
import React, { useEffect, useState } from 'react';
import { Calendar, Clock, Trash2, X, Check, Save, Plus } from 'lucide-react';
import { getThemeForWorkout } from '../../contribution-graph/theme-utils';

interface EditLogModalProps {
  dateStr: string | null;
  existingLog?: GymLog;
  isOpen: boolean;
  onClose: () => void;
  onSave: (dateStr: string, hours: number, workoutType: WorkoutType, notes?: string) => Promise<void>;
  onDelete: (dateStr: string) => Promise<void>;
  availableWorkoutTypes?: string[];
}

const DEFAULT_WORKOUT_TYPES: string[] = ['Push', 'Pull', 'Legs', 'Cardio', 'Core', 'Custom'];

export default function EditLogModal({
  dateStr,
  existingLog,
  isOpen,
  onClose,
  onSave,
  onDelete,
  availableWorkoutTypes = DEFAULT_WORKOUT_TYPES,
}: EditLogModalProps) {
  const [hours, setHours] = useState<number>(1.0);
  const [isCustomHours, setIsCustomHours] = useState<boolean>(false);
  const [customHoursInput, setCustomHoursInput] = useState<string>('3.0');
  const [workoutType, setWorkoutType] = useState<WorkoutType>('Push');
  const [notes, setNotes] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (existingLog) {
      const h = existingLog.hours;
      setHours(h);
      if (h > 2.5) {
        setIsCustomHours(true);
        setCustomHoursInput(h.toString());
      } else {
        setIsCustomHours(false);
      }
      setWorkoutType(existingLog.workoutType);
      setNotes(existingLog.notes || '');
    } else {
      setHours(1.0);
      setIsCustomHours(false);
      setWorkoutType('Push');
      setNotes('');
    }
  }, [existingLog, dateStr]);

  if (!isOpen || !dateStr) return null;

  const handleSave = async () => {
    setSaving(true);
    try {
      const finalHours = isCustomHours ? Math.max(0, parseFloat(customHoursInput) || 0) : hours;
      await onSave(dateStr, finalHours, workoutType, notes);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (confirm(`Clear gym record for ${dateStr}?`)) {
      setDeleting(true);
      try {
        await onDelete(dateStr);
        onClose();
      } finally {
        setDeleting(false);
      }
    }
  };

  const formattedDate = new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const rawCategories = availableWorkoutTypes.length > 0 ? availableWorkoutTypes : DEFAULT_WORKOUT_TYPES;
  const categories = Array.from(new Set(rawCategories));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#080c10]/95 border border-[rgba(0,255,136,0.2)] rounded-3xl p-6 sm:p-7 shadow-[0_0_50px_rgba(0,0,0,0.9)] relative animate-in scale-in-95 duration-200">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-zinc-400 hover:text-red-400 p-2 rounded-xl bg-zinc-950/80 border border-zinc-800 hover:border-red-500/40 backdrop-blur-sm transition-all cursor-pointer group"
        >
          <X className="w-4 h-4 transition-transform duration-200 group-hover:rotate-90" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3.5 mb-6 pb-4 border-b border-zinc-800/80">
          <div className="p-3 bg-zinc-950 border border-neon-green/30 rounded-2xl text-neon-green shadow-[0_0_15px_rgba(0,255,136,0.15)]">
            <Calendar className="w-5 h-5 text-neon-green" />
          </div>
          <div>
            <h3 className="text-base font-black tracking-wide bg-gradient-to-r from-neon-green via-[#00e077] to-neon-cyan bg-clip-text text-transparent">
              {existingLog ? 'Edit Workout Entry' : 'Log Workout'}
            </h3>
            <p className="text-xs text-zinc-400 font-medium mt-0.5">{formattedDate}</p>
          </div>
        </div>

        {/* Form Controls */}
        <div className="space-y-5">
          {/* Hours Input + Custom Support */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-black text-zinc-300 flex items-center gap-1.5 uppercase tracking-wider">
                <Clock className="w-3.5 h-3.5 text-neon-green" /> Duration (Hours)
              </label>
              <span className="text-neon-green font-black text-sm drop-shadow-[0_0_8px_rgba(0,255,136,0.5)]">
                {isCustomHours ? `${customHoursInput || '0'} hrs` : `${hours} hrs`}
              </span>
            </div>

            <div className="flex items-center gap-1.5 mb-2">
              {[0, 0.5, 1.0, 1.5, 2.0, 2.5].map((h) => (
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
                  {h === 0 ? 'Off' : `${h}h`}
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

            {isCustomHours ? (
              <div className="flex items-center gap-2 p-2.5 bg-[#05080c] border border-neon-green/50 rounded-xl animate-in fade-in">
                <span className="text-xs font-bold text-zinc-400">Custom Duration:</span>
                <input
                  type="number"
                  min="0"
                  max="12"
                  step="0.25"
                  value={customHoursInput}
                  onChange={(e) => setCustomHoursInput(e.target.value)}
                  placeholder="e.g. 3.5"
                  className="flex-1 bg-zinc-900 border border-zinc-800 focus:border-neon-green rounded-lg px-2.5 py-1 text-xs text-neon-green font-black outline-none"
                />
                <span className="text-xs font-bold text-zinc-400">hours</span>
              </div>
            ) : (
              <input
                type="range"
                min="0"
                max="6"
                step="0.25"
                value={hours}
                onChange={(e) => setHours(parseFloat(e.target.value))}
                className="w-full accent-neon-green cursor-pointer"
              />
            )}
          </div>

          {/* Workout Type Selector */}
          <div>
            <label className="block text-xs font-black text-zinc-300 uppercase tracking-widest mb-2">
              Workout Category:
            </label>
            <div className="grid grid-cols-3 gap-2 max-h-36 overflow-y-auto pr-1">
              {categories.map((type) => {
                const isSelected = workoutType === type;
                const typeTheme = getThemeForWorkout(type);

                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setWorkoutType(type)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border flex items-center justify-between cursor-pointer ${isSelected
                        ? typeTheme.filterActive
                        : 'bg-[#05080c] border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                      }`}
                  >
                    <span className="truncate">{type}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1.5">
              Session Notes:
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. 5x5 Heavy Squats, PR Bench, Felt great..."
              className="w-full bg-[#05080c] border border-zinc-800 focus:border-neon-green focus:shadow-[0_0_15px_rgba(0,255,136,0.2)] rounded-xl py-2 px-3 text-xs text-zinc-100 placeholder-zinc-600 outline-none transition-all"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            {existingLog && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting || saving}
                className="p-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500/60 rounded-2xl text-red-400 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                title="Clear record"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}

            <button
              type="button"
              onClick={handleSave}
              disabled={saving || deleting}
              className="flex-1 bg-gradient-to-r from-neon-green via-[#00e077] to-neon-cyan hover:shadow-[0_0_25px_rgba(0,255,136,0.4)] text-[#060a0e] font-black py-3 px-4 rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {saving ? (
                <div className="w-5 h-5 border-2 border-[#060a0e] border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Save className="w-4 h-4 text-[#060a0e]" />
                  <span>Save Log</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
