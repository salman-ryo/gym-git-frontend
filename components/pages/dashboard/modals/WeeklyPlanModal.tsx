'use client';

import React, { useState } from 'react';
import { Layers, Calendar } from 'lucide-react';
import Image from 'next/image';
import { PREBUILT_PLANS, WeeklyPlan } from '@/lib/types';
import ModalShell from '@/components/ui/modal-shell';
import PlanFrequencyStep from '@/components/pages/dashboard/weekly-plan/PlanFrequencyStep';
import DayScheduleStep from '@/components/pages/dashboard/weekly-plan/DayScheduleStep';

export interface WeeklyPlanModalProps {
  currentPlan?: WeeklyPlan;
  isOpen: boolean;
  onClose: () => void;
  onSavePlan: (plan: WeeklyPlan) => Promise<void>;
  preventClose?: boolean;
}

const getDefaultScheduleForDays = (days: number): string[] => {
  switch (days) {
    case 3:
      return ['Full Body', 'Rest', 'Cardio', 'Rest', 'Mobility', 'Rest', 'Rest'];
    case 5:
      return ['Push', 'Pull', 'Legs', 'Core', 'Cardio', 'Rest', 'Rest'];
    case 6:
      return ['Push', 'Pull', 'Legs', 'Push', 'Pull', 'Legs', 'Rest'];
    case 4:
    default:
      return ['Push', 'Pull', 'Legs', 'Rest', 'Cardio', 'Rest', 'Rest'];
  }
};

export default function WeeklyPlanModal({
  currentPlan,
  isOpen,
  onClose,
  onSavePlan,
  preventClose = false,
}: WeeklyPlanModalProps) {
  const [step, setStep] = useState<1 | 2>(1);

  const isCustomActive = currentPlan?.id
    ? !PREBUILT_PLANS.some((p) => p.id === currentPlan.id)
    : false;

  const [selectedPlanId, setSelectedPlanId] = useState<string>(
    currentPlan?.id ? (isCustomActive ? 'custom-plan' : currentPlan.id) : PREBUILT_PLANS[0].id
  );

  const [categories, setCategories] = useState<string[]>(
    currentPlan?.categories || PREBUILT_PLANS[0].categories
  );

  const [planName, setPlanName] = useState<string>(
    currentPlan?.name || PREBUILT_PLANS[0].name
  );

  const [planDesc, setPlanDesc] = useState<string>(
    currentPlan?.description || PREBUILT_PLANS[0].description || ''
  );

  const [schedule, setSchedule] = useState<string[]>(() => {
    if (currentPlan?.schedule && currentPlan.schedule.length === 7) {
      return currentPlan.schedule;
    }
    const found = PREBUILT_PLANS.find((p) => p.id === currentPlan?.id);
    if (found?.schedule) {
      return found.schedule;
    }
    if (currentPlan?.categories && currentPlan.categories.length > 0) {
      const active = currentPlan.categories.filter((c) => c.toLowerCase() !== 'rest');
      const baseSchedule = ['Rest', 'Rest', 'Rest', 'Rest', 'Rest', 'Rest', 'Rest'];
      active.slice(0, 6).forEach((cat, idx) => {
        baseSchedule[idx] = cat;
      });
      return baseSchedule;
    }
    return PREBUILT_PLANS[0].schedule || getDefaultScheduleForDays(4);
  });

  const [saving, setSaving] = useState<boolean>(false);
  const [prevOpen, setPrevOpen] = useState(isOpen);
  if (isOpen !== prevOpen) {
    setPrevOpen(isOpen);
    if (isOpen && currentPlan) {
      const isCustom = !PREBUILT_PLANS.some((p) => p.id === currentPlan.id);
      setSelectedPlanId(isCustom ? 'custom-plan' : currentPlan.id);
      setPlanName(currentPlan.name || 'My Weekly Split');
      setPlanDesc(currentPlan.description || '');
      setCategories(currentPlan.categories || PREBUILT_PLANS[0].categories);

      if (currentPlan.schedule && currentPlan.schedule.length === 7) {
        setSchedule(currentPlan.schedule);
      } else {
        const found = PREBUILT_PLANS.find((p) => p.id === currentPlan.id);
        setSchedule(found?.schedule || getDefaultScheduleForDays(4));
      }
    }
  }

  if (!isOpen) return null;

  const handleSelectPlan = (plan: WeeklyPlan) => {
    setSelectedPlanId(plan.id);
    setPlanName(plan.name);
    setPlanDesc(plan.description || '');
    setCategories(plan.categories);
    if (plan.schedule && plan.schedule.length === 7) {
      setSchedule(plan.schedule);
    } else {
      setSchedule(getDefaultScheduleForDays(plan.daysPerWeek || 4));
    }
  };

  const handleSelectCustom = (daysCount: number) => {
    setSelectedPlanId('custom-plan');
    setPlanName(`My Custom ${daysCount}-Day Split`);
    setPlanDesc(`Personalized ${daysCount}-day training split.`);
    const newSched = getDefaultScheduleForDays(daysCount);
    setSchedule(newSched);

    const initialCats = Array.from(
      new Set([...newSched.filter((c) => c.toLowerCase() !== 'rest'), 'Upper Body', 'Lower Body', 'Core', 'Cardio', 'Custom'])
    );
    setCategories(initialCats);
    setStep(2);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const activeDays = schedule.filter((c) => c.toLowerCase() !== 'rest');
      const activeCategories = Array.from(
        new Set([
          ...activeDays,
          ...categories.filter((c) => c.toLowerCase() !== 'rest'),
        ])
      );

      const originalPreset = PREBUILT_PLANS.find((p) => p.id === selectedPlanId);
      const isModified =
        !originalPreset ||
        originalPreset.name !== planName ||
        JSON.stringify(originalPreset.schedule) !== JSON.stringify(schedule);

      const finalPlan: WeeklyPlan = {
        id: isModified ? 'custom-plan' : selectedPlanId,
        name: planName.trim() || 'My Weekly Workout Plan',
        description: planDesc.trim() || 'Personalized workout categories.',
        categories: activeCategories.length > 0 ? activeCategories : ['Push', 'Pull', 'Legs', 'Cardio'],
        schedule: schedule,
        daysPerWeek: activeDays.length,
      };

      await onSavePlan(finalPlan);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="3xl"
      showCloseButton={!preventClose}
      closeOnEscape={!preventClose}
      closeOnBackdropClick={!preventClose}
      title={preventClose ? 'Setup Your Weekly Workout Split' : 'Weekly Plan & Day Configuration'}
      subtitle={
        preventClose
          ? 'Select your workout frequency, choose a split template, and assign your 7-day schedule.'
          : 'Customize your workout split & assign days. Past workout history remains safe & intact!'
      }
      icon={
        <Image
          src="/images/icons/week.png"
          alt="Plan workout"
          width={100}
          height={100}
          unoptimized
          className="size-12"
        />
      }
    >
      <div className="max-h-[72vh] overflow-y-auto pr-1 custom-scrollbar">
        {/* Step Progress Tracker */}
        <div className="grid grid-cols-2 gap-1.5 sm:gap-2 mb-4 sm:mb-6">
          <button
            type="button"
            onClick={() => setStep(1)}
            className={`py-1.5 sm:py-2 px-2 sm:px-3 rounded-xl border text-[11px] sm:text-xs font-black flex items-center justify-center gap-1.5 sm:gap-2 transition-all cursor-pointer ${
              step === 1
                ? 'bg-neon-green/10 border-neon-green/40 text-neon-green shadow-[0_0_12px_rgba(0,255,136,0.15)]'
                : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">1. Choose Split</span>
          </button>

          <button
            type="button"
            onClick={() => setStep(2)}
            className={`py-1.5 sm:py-2 px-2 sm:px-3 rounded-xl border text-[11px] sm:text-xs font-black flex items-center justify-center gap-1.5 sm:gap-2 transition-all cursor-pointer ${
              step === 2
                ? 'bg-neon-cyan/10 border-neon-cyan/40 text-neon-cyan shadow-[0_0_12px_rgba(34,211,238,0.15)]'
                : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">2. Customize Days</span>
          </button>
        </div>

        {/* Step 1: Frequency & Template Selector */}
        {step === 1 && (
          <PlanFrequencyStep
            selectedPlanId={selectedPlanId}
            onSelectPlan={handleSelectPlan}
            onSelectCustom={handleSelectCustom}
            onNext={() => setStep(2)}
          />
        )}

        {/* Step 2: Day Assignment & Schedule Builder */}
        {step === 2 && (
          <DayScheduleStep
            schedule={schedule}
            setSchedule={setSchedule}
            categories={categories}
            setCategories={setCategories}
            planName={planName}
            setPlanName={setPlanName}
            planDesc={planDesc}
            setPlanDesc={setPlanDesc}
            onBack={() => setStep(1)}
            onSave={handleSave}
            saving={saving}
          />
        )}
      </div>
    </ModalShell>
  );
}