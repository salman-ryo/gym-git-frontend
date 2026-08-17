'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { WorkoutType } from '@/lib/types';
import { formatDisplayDate } from '@/lib/date-utils';
import { isLateNightStreakRisk } from '@/lib/checkin-snooze';
import {
  getWeightedQuestionMascot,
  yesAnimeRoster,
  noAnimeRoster,
  QuestionAnimeMascot,
} from '@/assets/anime';
import ModalShell from '@/components/ui/modal-shell';
import WorkoutLogForm from '../WorkoutLogForm';
import AnimeCheckInCutscene from './AnimeCheckInCutscene';
import LateNightWarningView from './LateNightWarningView';
import CheckInPromptStep from './CheckInPromptStep';
import '../anime-checkin.css';

export interface DailyCheckInModalProps {
  dateStr: string;
  isOpen: boolean;
  onCheckInYes: (hours: number, workoutType: WorkoutType, notes?: string) => Promise<void>;
  onCheckInNo: () => void;
  onCheckInLater?: () => void;
  availableWorkoutTypes?: string[];
}

const DEFAULT_WORKOUT_TYPES: string[] = ['Push', 'Pull', 'Legs', 'Cardio', 'Core', 'Custom'];

export function DailyCheckInModal({
  dateStr,
  isOpen,
  onCheckInYes,
  onCheckInNo,
  onCheckInLater,
  availableWorkoutTypes = DEFAULT_WORKOUT_TYPES,
}: DailyCheckInModalProps) {
  const [questionMascot, setQuestionMascot] = useState<QuestionAnimeMascot>(() =>
    getWeightedQuestionMascot()
  );

  const [animState, setAnimState] = useState<'idle' | 'yes_anim' | 'no_anim'>('idle');
  const [yesCharIndex, setYesCharIndex] = useState<number>(0);
  const [noCharIndex, setNoCharIndex] = useState<number>(0);

  const [answeredYes, setAnsweredYes] = useState(false);
  const [showLateNightWarning, setShowLateNightWarning] = useState(false);
  const [hours, setHours] = useState<number>(1.0);
  const [isCustomHours, setIsCustomHours] = useState<boolean>(false);
  const [customHoursInput, setCustomHoursInput] = useState<string>('3.0');
  const [workoutType, setWorkoutType] = useState<WorkoutType>('Push');
  const [notes, setNotes] = useState<string>('');
  const [saving, setSaving] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const rawCategories =
    availableWorkoutTypes.length > 0 ? availableWorkoutTypes : DEFAULT_WORKOUT_TYPES;
  const categories = Array.from(new Set(rawCategories));

  const [prevOpen, setPrevOpen] = useState(isOpen);
  if (isOpen !== prevOpen) {
    setPrevOpen(isOpen);
    if (isOpen) {
      setQuestionMascot(getWeightedQuestionMascot());
      setAnsweredYes(false);
      setShowLateNightWarning(false);
      setAnimState('idle');
      if (categories.length > 0 && !categories.includes(workoutType)) {
        setWorkoutType(categories[0]);
      }
    }
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleTriggerYes = () => {
    setShowLateNightWarning(false);
    const nextIdx = Math.floor(Math.random() * yesAnimeRoster.length);
    setYesCharIndex(nextIdx);
    setAnimState('yes_anim');

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setAnimState('idle');
      setAnsweredYes(true);
    }, 2800);
  };

  const handleSkipYes = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setAnimState('idle');
    setAnsweredYes(true);
  };

  const handleTriggerNo = () => {
    setShowLateNightWarning(false);
    const nextIdx = Math.floor(Math.random() * noAnimeRoster.length);
    setNoCharIndex(nextIdx);
    setAnimState('no_anim');

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setAnimState('idle');
      onCheckInNo();
    }, 2500);
  };

  const handleSkipNo = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setAnimState('idle');
    onCheckInNo();
  };

  const handleTriggerLater = () => {
    if (isLateNightStreakRisk()) {
      setShowLateNightWarning(true);
      return;
    }
    if (onCheckInLater) onCheckInLater();
  };

  const handleConfirmPostponeAnyway = () => {
    setShowLateNightWarning(false);
    if (onCheckInLater) onCheckInLater();
  };

  const handleSaveDetails = async () => {
    setSaving(true);
    try {
      const finalHours = isCustomHours
        ? Math.max(0.25, parseFloat(customHoursInput) || 1.0)
        : hours;
      await onCheckInYes(finalHours, workoutType, notes);
    } finally {
      setSaving(false);
    }
  };

  const formattedDate = dateStr ? formatDisplayDate(dateStr, { showToday: true, includeYear: true }) : '';
  const activeYesHero = yesAnimeRoster[yesCharIndex] || yesAnimeRoster[0];
  const activeNoHero = noAnimeRoster[noCharIndex] || noAnimeRoster[0];

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={handleTriggerLater}
      maxWidth="md"
      showCloseButton={animState === 'idle' && !showLateNightWarning}
    >
      {/* Anime Cutscenes */}
      {animState !== 'idle' && (
        <AnimeCheckInCutscene
          animState={animState}
          activeYesHero={activeYesHero}
          activeNoHero={activeNoHero}
          onSkipYes={handleSkipYes}
          onSkipNo={handleSkipNo}
        />
      )}

      {/* Main Steps */}
      {showLateNightWarning ? (
        <LateNightWarningView
          onLogWorkoutNow={handleTriggerYes}
          onLogRestDay={handleTriggerNo}
          onPostponeAnyway={handleConfirmPostponeAnyway}
        />
      ) : !answeredYes ? (
        <CheckInPromptStep
          formattedDate={formattedDate}
          questionMascot={questionMascot}
          isLateNightRisk={isLateNightStreakRisk()}
          onTriggerYes={handleTriggerYes}
          onTriggerNo={handleTriggerNo}
          onTriggerLater={handleTriggerLater}
        />
      ) : (
        /* Step 2: Workout Details Panel */
        <div className="space-y-5 animate-in slide-in-from-bottom-4 duration-200 relative z-10">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
            <div className="flex items-center gap-3">
              <Image
                src="/images/icons/note.png"
                alt="Log workout details"
                width={100}
                height={100}
                unoptimized
                className="size-10"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-base font-black bg-gradient-to-r from-neon-green via-[#00e077] to-neon-cyan bg-clip-text text-transparent uppercase tracking-wider">
                    Workout Details
                  </h3>
                  <span className="px-1.5 py-0.5 rounded-md bg-neon-green/10 border border-neon-green/30 text-[9px] font-black text-neon-green uppercase">
                    ⚡ Gainz
                  </span>
                </div>
                <p className="text-xs text-zinc-400 font-medium">{formattedDate}</p>
              </div>
            </div>
          </div>

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
            onSubmit={handleSaveDetails}
            saving={saving}
            submitButtonText="Log This Session"
          />
        </div>
      )}
    </ModalShell>
  );
}

export default DailyCheckInModal;
