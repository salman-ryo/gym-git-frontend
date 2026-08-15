'use client';

import { GymLog, WorkoutType } from '@/lib/types';
import React, { useState } from 'react';
import { X } from 'lucide-react';
import Image from 'next/image';
import WorkoutLogForm from './WorkoutLogForm';
import { formatDateKey } from '@/lib/scientific-streak';
import RestoreConfirmModal from './RestoreConfirmModal';

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
  const [hours, setHours] = useState<number>(() => existingLog ? existingLog.hours : 1.0);
  const [isCustomHours, setIsCustomHours] = useState<boolean>(() => existingLog ? existingLog.hours > 6.0 : false);
  const [customHoursInput, setCustomHoursInput] = useState<string>(() => existingLog ? existingLog.hours.toString() : '3.0');
  const [workoutType, setWorkoutType] = useState<WorkoutType>(() => existingLog ? existingLog.workoutType : 'Push');
  const [notes, setNotes] = useState<string>(() => existingLog ? existingLog.notes || '' : '');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showRestoreConfirm, setShowRestoreConfirm] = useState<boolean>(false);

  if (!isOpen || !dateStr) return null;

  const executeSave = async () => {
    setSaving(true);
    setErrorMsg(null);
    try {
      const finalHours = isCustomHours ? Math.max(0, parseFloat(customHoursInput) || 0) : hours;
      await onSave(dateStr, finalHours, workoutType, notes);
      onClose();
    } catch (err: unknown) {
      console.error(err);
      setErrorMsg(err instanceof Error ? err.message : 'Failed to save workout log');
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async () => {
    const today = new Date();
    const todayStr = formatDateKey(today);

    if (dateStr && dateStr < todayStr) {
      const targetDate = new Date(dateStr + 'T00:00:00');
      const todayDate = new Date(todayStr + 'T00:00:00');
      const diffTime = todayDate.getTime() - targetDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays >= 1 && diffDays <= 3) {
        setShowRestoreConfirm(true);
        return;
      }
    }

    await executeSave();
  };

  const handleDelete = async () => {
    if (confirm(`Clear gym record for ${dateStr}?`)) {
      setDeleting(true);
      setErrorMsg(null);
      try {
        await onDelete(dateStr);
        onClose();
      } catch (err: unknown) {
        console.error(err);
        setErrorMsg(err instanceof Error ? err.message : 'Failed to delete workout log');
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
    <>
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
            <div>
              <Image src={"/images/icons/write.png"} alt='Log workout' width={100} height={100} unoptimized className="size-10" />
            </div>
            <div>
              <h3 className="text-base font-black tracking-wide bg-gradient-to-r from-neon-green via-[#00e077] to-neon-cyan bg-clip-text text-transparent">
                {existingLog ? 'Edit Workout Entry' : 'Log Workout'}
              </h3>
              <p className="text-xs text-zinc-400 font-medium mt-0.5">{formattedDate}</p>
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="mb-5 p-3.5 bg-red-950/20 border border-red-500/30 rounded-2xl text-red-400 text-xs font-bold text-left flex gap-2.5 items-start animate-in fade-in duration-200">
              <span className="mt-0.5 text-base leading-none">⚠️</span>
              <span className="leading-relaxed">{errorMsg}</span>
            </div>
          )}

          {/* Form Controls */}
          <WorkoutLogForm
            hours={hours}
            setHours={setHours}
            isCustomHours={isCustomHours}
            setIsCustomHours={setIsCustomHours}
            customHoursInput={customHoursInput}
            setCustomHoursInput={setCustomHoursInput}
            workoutType={workoutType}
            setWorkoutType={setWorkoutType}
            notes={notes}
            setNotes={setNotes}
            categories={categories}
            onSubmit={handleSave}
            saving={saving}
            submitButtonText="Upload Log"
            onDelete={existingLog ? handleDelete : undefined}
            deleting={deleting}
          />
        </div>
      </div>

      <RestoreConfirmModal
        isOpen={showRestoreConfirm}
        dateStr={dateStr}
        loading={saving}
        onConfirm={async () => {
          setShowRestoreConfirm(false);
          await executeSave();
        }}
        onCancel={() => setShowRestoreConfirm(false)}
      />
    </>
  );
}