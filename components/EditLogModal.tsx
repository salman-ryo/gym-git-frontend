'use client';

import { GymLog, WorkoutType } from '@/lib/types';
import React, { useEffect, useState } from 'react';
import { Calendar, Clock, Trash2, X, Check, Save } from 'lucide-react';

interface EditLogModalProps {
  dateStr: string | null;
  existingLog?: GymLog;
  isOpen: boolean;
  onClose: () => void;
  onSave: (dateStr: string, hours: number, workoutType: WorkoutType, notes?: string) => Promise<void>;
  onDelete: (dateStr: string) => Promise<void>;
}

const WORKOUT_TYPES: WorkoutType[] = ['Push', 'Pull', 'Legs', 'Cardio', 'Custom'];

export default function EditLogModal({
  dateStr,
  existingLog,
  isOpen,
  onClose,
  onSave,
  onDelete,
}: EditLogModalProps) {
  const [hours, setHours] = useState<number>(1.0);
  const [workoutType, setWorkoutType] = useState<WorkoutType>('Push');
  const [notes, setNotes] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (existingLog) {
      setHours(existingLog.hours);
      setWorkoutType(existingLog.workoutType);
      setNotes(existingLog.notes || '');
    } else {
      setHours(1.0);
      setWorkoutType('Push');
      setNotes('');
    }
  }, [existingLog, dateStr]);

  if (!isOpen || !dateStr) return null;

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(dateStr, hours, workoutType, notes);
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl relative">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-zinc-400 hover:text-zinc-100 p-1.5 rounded-xl bg-zinc-800/50 hover:bg-zinc-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-zinc-800">
          <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-400">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-zinc-100">
              {existingLog ? 'Edit Workout Entry' : 'Log Workout'}
            </h3>
            <p className="text-xs text-zinc-400">{formattedDate}</p>
          </div>
        </div>

        {/* Form Controls */}
        <div className="space-y-5">
          {/* Hours Input */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-400" /> Duration (Hours)
              </label>
              <span className="text-emerald-400 font-bold text-sm">{hours} hrs</span>
            </div>

            <div className="flex items-center gap-2 mb-2">
              {[0, 0.5, 1.0, 1.5, 2.0, 2.5].map((h) => (
                <button
                  key={h}
                  type="button"
                  onClick={() => setHours(h)}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-xl border transition-all ${
                    hours === h
                      ? 'bg-emerald-500 text-zinc-950 border-emerald-400'
                      : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  {h === 0 ? 'Off' : `${h}h`}
                </button>
              ))}
            </div>

            <input
              type="range"
              min="0"
              max="4"
              step="0.25"
              value={hours}
              onChange={(e) => setHours(parseFloat(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>

          {/* Workout Type Selector */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-2">
              Workout Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              {WORKOUT_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setWorkoutType(type)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border flex items-center justify-between ${
                    workoutType === type
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <span>{type}</span>
                  {workoutType === type && <Check className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Notes
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Session notes..."
              className="w-full bg-zinc-950 border border-zinc-800 focus:border-emerald-500 rounded-xl py-2 px-3 text-xs text-zinc-100 placeholder-zinc-600 outline-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            {existingLog && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting || saving}
                className="p-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-2xl text-red-400 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                title="Clear record"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}

            <button
              type="button"
              onClick={handleSave}
              disabled={saving || deleting}
              className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-zinc-950 font-bold py-3 px-4 rounded-2xl text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50"
            >
              {saving ? (
                <div className="w-5 h-5 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Save className="w-4 h-4" />
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
