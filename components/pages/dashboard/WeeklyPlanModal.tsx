'use client';

import { PREBUILT_PLANS, WeeklyPlan } from '@/lib/types';
import React, { useState, useEffect } from 'react';
import { X, Layers, Calendar, Sparkles } from 'lucide-react';
import Image from 'next/image';
import PlanFrequencyStep from './weekly-plan/PlanFrequencyStep';
import DayScheduleStep from './weekly-plan/DayScheduleStep';

interface WeeklyPlanModalProps {
  currentPlan?: WeeklyPlan;
  isOpen: boolean;
  onClose: () => void;
  onSavePlan: (plan: WeeklyPlan) => Promise<void>;
  preventClose?: boolean;
}

// Generate default 7-day schedule for a given frequency
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

  // Sync state whenever currentPlan changes or modal opens
  useEffect(() => {
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
        if (found?.schedule) {
          setSchedule(found.schedule);
        } else {
          setSchedule(getDefaultScheduleForDays(4));
        }
      }
    }
  }, [isOpen, currentPlan]);

  if (!isOpen) return null;

  // Handle Preset Split Selection in Step 1
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

  // Handle Custom Split Creation in Step 1
  const handleSelectCustom = (daysCount: number) => {
    setSelectedPlanId('custom-plan');
    setPlanName(`My Custom ${daysCount}-Day Split`);
    setPlanDesc(`Personalized ${daysCount}-day training split.`);
    const newSched = getDefaultScheduleForDays(daysCount);
    setSchedule(newSched);

    // Initial categories: unique active days from schedule + standard categories
    const initialCats = Array.from(
      new Set([...newSched.filter((c) => c.toLowerCase() !== 'rest'), 'Upper Body', 'Lower Body', 'Core', 'Cardio', 'Custom'])
    );
    setCategories(initialCats);
    setStep(2);
  };

  // Handle Saving the Final Plan
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

      // Check if user changed anything from the original prebuilt plan
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
    <>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #3f3f46;
          border-radius: 20px;
          border: 2px solid #18181b;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #52525b;
        }
      `}</style>

      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-zinc-950/85 backdrop-blur-xl animate-in fade-in duration-200"
        onClick={() => {
          if (!preventClose) onClose();
        }}
      >
        <div
          className="relative w-full max-w-3xl bg-[#080c10]/95 border border-[rgba(0,255,136,0.2)] rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.9)] flex flex-col max-h-[90vh] overflow-hidden animate-in scale-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          {!preventClose && (
            <button
              type="button"
              onClick={onClose}
              className="absolute top-5 right-5 z-20 text-zinc-400 hover:text-red-400 p-2 rounded-xl bg-zinc-950/80 border border-zinc-800 hover:border-red-500/40 backdrop-blur-sm transition-all cursor-pointer group"
            >
              <X className="w-4 h-4 transition-transform duration-200 group-hover:rotate-90" />
            </button>
          )}

          <div className="flex-1 overflow-y-auto p-5 sm:p-8 custom-scrollbar">
            {/* Modal Header */}
            <div className="flex items-center gap-3.5 mb-6 pb-4 border-b border-zinc-800/80">
              <Image
                src="/images/icons/week.png"
                alt="Plan workout"
                width={100}
                height={100}
                unoptimized
                className="size-12"
              />
              <div className="pr-8">
                <h3 className="text-base font-black tracking-wide bg-gradient-to-r from-neon-green via-[#00e077] to-neon-cyan bg-clip-text text-transparent">
                  {preventClose ? 'Setup Your Weekly Workout Split' : 'Weekly Plan & Day Configuration'}
                </h3>
                <p className="text-xs text-zinc-400 font-medium mt-0.5">
                  {preventClose
                    ? 'Select your workout frequency, choose a split template, and assign your 7-day schedule.'
                    : 'Customize your workout split & assign days. Past workout history remains safe & intact!'}
                </p>
              </div>
            </div>

            {/* Step Progress Tracker */}
            <div className="grid grid-cols-2 gap-2 mb-6">
              <button
                type="button"
                onClick={() => setStep(1)}
                className={`py-2 px-3 rounded-xl border text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  step === 1
                    ? 'bg-neon-green/10 border-neon-green/40 text-neon-green shadow-[0_0_12px_rgba(0,255,136,0.15)]'
                    : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>1. Choose Split &amp; Frequency</span>
              </button>

              <button
                type="button"
                onClick={() => setStep(2)}
                className={`py-2 px-3 rounded-xl border text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  step === 2
                    ? 'bg-neon-cyan/10 border-neon-cyan/40 text-neon-cyan shadow-[0_0_12px_rgba(34,211,238,0.15)]'
                    : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>2. Assign &amp; Customize Days</span>
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
        </div>
      </div>
    </>
  );
}