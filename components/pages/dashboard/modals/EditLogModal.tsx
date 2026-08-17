'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { GymLog, WorkoutType } from '@/lib/types';
import { formatDisplayDate, formatDateKey } from '@/lib/date-utils';
import ModalShell from '@/components/ui/modal-shell';
import WorkoutLogForm from './WorkoutLogForm';
import RestoreConfirmModal from './RestoreConfirmModal';

export interface EditLogModalProps {
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
    const todayStr = formatDateKey(new Date());

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

  const formattedDate = formatDisplayDate(dateStr, { showToday: true, includeYear: true });
  const rawCategories = availableWorkoutTypes.length > 0 ? availableWorkoutTypes : DEFAULT_WORKOUT_TYPES;
  const categories = Array.from(new Set(rawCategories));

  return (
    <>
      <ModalShell
        isOpen={isOpen}
        onClose={onClose}
        maxWidth="md"
        errorMsg={errorMsg}
        title={existingLog ? 'Edit Workout Entry' : 'Log Workout'}
        subtitle={formattedDate}
        icon={
          <Image
            src="/images/icons/write.png"
            alt="Log workout"
            width={100}
            height={100}
            unoptimized
            className="size-10"
          />
        }
      >
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
      </ModalShell>

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