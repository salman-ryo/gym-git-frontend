'use client';

import { WorkoutType } from '@/lib/types';
import React, { useState, useEffect, useRef } from 'react';
import {
  Check,
  X,
  Sparkles,
  Clock,
  Plus,
  Zap,
  Flame,
  Swords,
  Shield,
  Moon,
  BatteryCharging,
  Trophy,
} from 'lucide-react';
import Image from 'next/image';
import { getThemeForWorkout } from '../../contribution-graph/theme-utils';
import {
  animeImages,
  animeQuestionImages,
  questionAnimeMascots,
  getWeightedQuestionMascot,
  yesAnimeRoster,
  noAnimeRoster,
  QuestionAnimeMascot,
} from '@/assets/anime';
import './anime-checkin.css';

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
  // Random Mascot for Step 1 Greeting (preference for question folder, Aqua excluded)
  const [questionMascot, setQuestionMascot] = useState<QuestionAnimeMascot>(() =>
    getWeightedQuestionMascot()
  );

  // Animation state: 'idle' | 'yes_anim' | 'no_anim'
  const [animState, setAnimState] = useState<'idle' | 'yes_anim' | 'no_anim'>('idle');
  const [yesCharIndex, setYesCharIndex] = useState<number>(0);
  const [noCharIndex, setNoCharIndex] = useState<number>(0);

  const [answeredYes, setAnsweredYes] = useState(false);
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

  // Pick a fresh question mascot (with preference for question folder images) whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setQuestionMascot(getWeightedQuestionMascot());
    }
  }, [isOpen]);

  useEffect(() => {
    if (categories.length > 0 && !categories.includes(workoutType)) {
      setWorkoutType(categories[0]);
    }
  }, [categories, workoutType]);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  if (!isOpen) return null;

  // Trigger Anime "YES" sequence with enhanced duration (2.8 seconds)
  const handleTriggerYes = () => {
    const nextIdx = Math.floor(Math.random() * yesAnimeRoster.length);
    setYesCharIndex(nextIdx);
    setAnimState('yes_anim');

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setAnimState('idle');
      setAnsweredYes(true);
    }, 2800);
  };

  // Immediate skip on click during Yes animation
  const handleSkipYes = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setAnimState('idle');
    setAnsweredYes(true);
  };

  // Trigger Anime "NO / REST DAY" sequence (Aqua & any recovery characters shown)
  const handleTriggerNo = () => {
    const nextIdx = Math.floor(Math.random() * noAnimeRoster.length);
    setNoCharIndex(nextIdx);
    setAnimState('no_anim');

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setAnimState('idle');
      onCheckInNo();
    }, 2500);
  };

  // Immediate skip on click during No animation
  const handleSkipNo = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setAnimState('idle');
    onCheckInNo();
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

  const formattedDate = new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const activeYesHero = yesAnimeRoster[yesCharIndex] || yesAnimeRoster[0];
  const activeNoHero = noAnimeRoster[noCharIndex] || noAnimeRoster[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#080c10]/95 border border-[rgba(0,255,136,0.2)] rounded-3xl p-6 sm:p-7 shadow-[0_0_50px_rgba(0,0,0,0.9)] relative overflow-hidden animate-in scale-in-95 duration-200">
        <div className="absolute -top-[10%] -right-[10%] w-32 h-32 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-[10%] -left-[10%] w-32 h-32 bg-[#a855f7]/10 rounded-full blur-2xl pointer-events-none" />

        {/* ═══════════════════════════════════════════════════════════════
            ANIME "YES!" ANIMATION OVERLAY (Super Saiyan / Ashura Cutscene)
           ═══════════════════════════════════════════════════════════════ */}
        {animState === 'yes_anim' && (
          <div
            onClick={handleSkipYes}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-zinc-950/95 overflow-hidden cursor-pointer select-none"
          >
            {/* 1. Impact Flash */}
            <div className="absolute inset-0 anime-flash-overlay pointer-events-none" />

            {/* 2. Manga Radial Speed Lines */}
            <div className="absolute -inset-20 anime-speed-lines opacity-65 pointer-events-none" />

            {/* 3. Expanding Shockwaves */}
            <div className="absolute w-44 h-44 rounded-full border-4 border-neon-green/80 anime-shockwave pointer-events-none" />
            <div className="absolute w-44 h-44 rounded-full border-4 border-neon-cyan/80 anime-shockwave-delayed pointer-events-none" />

            {/* 4. Katana Slashes / Energy Blades */}
            <div className="absolute inset-x-0 h-4 bg-gradient-to-r from-transparent via-white to-transparent anime-sword-slash shadow-[0_0_25px_#00ff88] pointer-events-none" />
            <div className="absolute inset-x-0 h-3 bg-gradient-to-r from-transparent via-neon-cyan to-transparent anime-sword-slash-2 shadow-[0_0_20px_#22d3ee] pointer-events-none" />

            {/* 5. Main Hero Action Container (With Screen Shake) */}
            <div className="relative z-10 flex flex-col items-center text-center p-4 anime-shake">
              {/* Japanese Manga SFX */}
              <div className="text-4xl sm:text-5xl font-black italic tracking-tighter text-amber-300 anime-sfx-text mb-1">
                {activeYesHero.sfxJa}
              </div>

              {/* English Hype Action Move */}
              <div className="text-xl sm:text-2xl font-black uppercase tracking-widest bg-gradient-to-r from-white via-neon-green to-neon-cyan bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(0,255,136,0.8)] -rotate-3 mb-3">
                ⚡ {activeYesHero.sfxEn} ⚡
              </div>

              {/* Character Avatar with Super Saiyan Aura */}
              <div className="relative w-28 h-28 mx-auto my-1 flex items-center justify-center anime-character-enter">
                {/* Aura Flame */}
                <div
                  className="absolute inset-0 rounded-full blur-xl anime-aura-glow opacity-90"
                  style={{ background: activeYesHero.glowColor }}
                />
                {/* Electric Sparks */}
                <div className="absolute -top-2 -left-2 text-neon-green text-xl anime-spark">
                  ✦
                </div>
                <div className="absolute -bottom-1 -right-2 text-amber-300 text-xl anime-spark">
                  ⚡
                </div>
                <div className="absolute top-1/2 -right-4 text-neon-cyan text-lg anime-spark">
                  ✦
                </div>

                <Image
                  src={activeYesHero.image}
                  alt={activeYesHero.character}
                  width={112}
                  height={112}
                  unoptimized
                  className="w-full h-full object-contain relative z-10 drop-shadow-[0_0_15px_rgba(255,255,255,0.7)]"
                />
              </div>

              {/* Floating Anime Power Badges */}
              <div className="flex flex-wrap items-center justify-center gap-1.5 mt-3 max-w-xs">
                <span className="anime-badge-left px-2.5 py-1 rounded-full bg-emerald-950/90 border border-neon-green/60 text-[11px] font-black text-neon-green shadow-[0_0_12px_rgba(0,255,136,0.35)]">
                  {activeYesHero.badge1}
                </span>
                <span className="anime-badge-right px-2.5 py-1 rounded-full bg-amber-950/90 border border-amber-400/60 text-[11px] font-black text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.35)]">
                  {activeYesHero.badge2}
                </span>
                <span className="anime-badge-center px-2.5 py-1 rounded-full bg-cyan-950/90 border border-neon-cyan/60 text-[11px] font-black text-neon-cyan shadow-[0_0_12px_rgba(34,211,238,0.35)]">
                  {activeYesHero.badge3}
                </span>
              </div>

              {/* Action Banner Quote */}
              <div className="mt-3 px-3.5 py-2 rounded-xl bg-black/80 border border-zinc-700/80 backdrop-blur-md max-w-xs">
                <p className="text-[11px] font-extrabold text-zinc-100 tracking-wide">
                  {activeYesHero.title}
                </p>
                <p className="text-[9px] text-zinc-400 font-medium mt-0.5">
                  {activeYesHero.subtitle}
                </p>
              </div>

            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            ANIME "NO / REST DAY" OVERLAY (Comical / Zen Recovery Scene)
           ═══════════════════════════════════════════════════════════════ */}
        {animState === 'no_anim' && (
          <div
            onClick={handleSkipNo}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-zinc-950/95 overflow-hidden cursor-pointer select-none"
          >
            {/* 1. Chill Speed Lines & Manga Gloom Stream */}
            <div className="absolute -inset-20 anime-speed-lines-chill opacity-55 pointer-events-none" />
            <div className="absolute inset-0 anime-gloom-overlay opacity-45 pointer-events-none" />

            {/* 2. Zen Expanding Rings */}
            <div className="absolute w-44 h-44 rounded-full border-4 border-sky-400/60 anime-shockwave pointer-events-none" />

            {/* 3. Floating Sleep Zzz's */}
            <span className="absolute top-16 right-20 text-sky-300 font-black text-2xl anime-zzz-1 pointer-events-none">
              Z
            </span>
            <span className="absolute top-12 right-14 text-sky-400 font-black text-xl anime-zzz-2 pointer-events-none">
              z
            </span>
            <span className="absolute top-8 right-10 text-indigo-300 font-black text-sm anime-zzz-3 pointer-events-none">
              z
            </span>

            {/* 4. Main Hero Action Container */}
            <div className="relative z-10 flex flex-col items-center text-center p-4">
              {/* Manga SFX Chill */}
              <div className="text-4xl sm:text-5xl font-black italic tracking-tighter text-sky-300 anime-sfx-text-chill mb-1">
                {activeNoHero.sfxJa}
              </div>

              {/* Recovery Move Title */}
              <div className="text-xl sm:text-2xl font-black uppercase tracking-widest bg-gradient-to-r from-sky-300 via-cyan-200 to-indigo-300 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(56,189,248,0.8)] -rotate-2 mb-3">
                💤 {activeNoHero.sfxEn} 💤
              </div>

              {/* Character Avatar with Comical Sweat Drop */}
              <div className="relative w-28 h-28 mx-auto my-1 flex items-center justify-center anime-character-enter">
                {/* Chill Aura */}
                <div
                  className="absolute inset-0 rounded-full blur-xl opacity-80"
                  style={{ background: activeNoHero.glowColor }}
                />

                {/* Comical Anime Giant Sweat Drop */}
                <div className="absolute -top-3 -right-2 text-3xl anime-sweat-drop z-20">
                  💧
                </div>

                <Image
                  src={activeNoHero.image}
                  alt={activeNoHero.character}
                  width={112}
                  height={112}
                  unoptimized
                  className="w-full h-full object-contain relative z-10 drop-shadow-[0_0_12px_rgba(56,189,248,0.6)]"
                />
              </div>

              {/* Floating Recovery Badges */}
              <div className="flex flex-wrap items-center justify-center gap-1.5 mt-3 max-w-xs">
                <span className="anime-badge-left px-2.5 py-1 rounded-full bg-sky-950/90 border border-sky-400/60 text-[11px] font-black text-sky-300 shadow-[0_0_12px_rgba(56,189,248,0.35)]">
                  {activeNoHero.badge1}
                </span>
                <span className="anime-badge-right px-2.5 py-1 rounded-full bg-indigo-950/90 border border-indigo-400/60 text-[11px] font-black text-indigo-300 shadow-[0_0_12px_rgba(129,140,248,0.35)]">
                  {activeNoHero.badge2}
                </span>
                <span className="anime-badge-center px-2.5 py-1 rounded-full bg-teal-950/90 border border-teal-400/60 text-[11px] font-black text-teal-300 shadow-[0_0_12px_rgba(45,212,191,0.35)]">
                  {activeNoHero.badge3}
                </span>
              </div>

              {/* Recovery Banner Quote */}
              <div className="mt-3 px-3.5 py-2 rounded-xl bg-black/80 border border-zinc-700/80 backdrop-blur-md max-w-xs">
                <p className="text-[11px] font-extrabold text-zinc-100 tracking-wide">
                  {activeNoHero.title}
                </p>
                <p className="text-[9px] text-zinc-400 font-medium mt-0.5">
                  {activeNoHero.subtitle}
                </p>
              </div>

              {/* Progress Countdown and Skip hint */}
              <div className="mt-3.5 flex flex-col items-center gap-1.5 w-full max-w-[200px]">
                <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-sky-400 to-indigo-400 rounded-full animate-[shimmer-effect_2.5s_linear_forwards] w-full" />
                </div>
                <span className="text-[10px] text-zinc-400 font-semibold tracking-wide">
                  Saving rest day... (Tap to skip)
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            STEP 1: Did you hit the gym today? (Initial Modal State)
           ═══════════════════════════════════════════════════════════════ */}
        {!answeredYes ? (
          <div className="text-center py-4 relative z-10">
            {/* Mascot Asking with anime bounce and interactive aura */}
            <div className="relative w-24 h-24 mx-auto mb-3 group">
              <div
                className="absolute inset-0 rounded-full blur-xl transition-all duration-300 group-hover:scale-125 opacity-70"
                style={{ background: questionMascot.glowColor }}
              />
              <Image
                src={questionMascot.image}
                alt={questionMascot.name}
                width={96}
                height={96}
                unoptimized
                className="w-full h-full object-contain relative z-10 transition-transform duration-300 group-hover:scale-110 drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]"
              />
              <span className="absolute -top-1 -right-1 text-2xl font-black text-neon-green drop-shadow-[0_0_8px_rgba(0,255,136,0.6)] animate-bounce select-none z-20">
                ?
              </span>
            </div>

            <div className="flex items-center justify-center gap-1.5 text-base text-emerald-400 font-semibold mb-2">
              <Image
                src="/images/icons/today.png"
                alt="Today"
                width={100}
                height={100}
                unoptimized
                className="size-5"
              />
              <span>{formattedDate}</span>
            </div>

            <h2 className="text-2xl font-black text-zinc-100 tracking-tight mb-1.5">
              Did you hit the gym today?
            </h2>
            <p className="text-zinc-400 text-xs italic mb-6 max-w-xs mx-auto">
              &ldquo;{questionMascot.questionQuote}&rdquo;
            </p>

            {/* Action Buttons with Anime Hype Triggers */}
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={handleTriggerYes}
                className="w-full bg-gradient-to-r from-neon-green via-[#00e077] to-teal-400 text-[#060a0e] font-extrabold py-2.5 px-4 rounded-2xl text-base flex items-center justify-center gap-2 transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.03] active:scale-95 shadow-lg shadow-emerald-500/10 hover:shadow-[0_0_25px_rgba(0,255,136,0.55)] cursor-pointer group relative overflow-hidden"
              >
                {/* Subtle highlight shimmer */}
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                <Check className="w-5 h-5 stroke-[3.5] transition-transform duration-200 group-hover:scale-125 group-hover:rotate-6" />
                <span className="tracking-wide">Yes!</span>
                <Sparkles className="w-4 h-4 text-[#060a0e] opacity-80 animate-pulse" />
              </button>

              <button
                type="button"
                onClick={handleTriggerNo}
                className="w-full bg-zinc-950/50 hover:bg-sky-500/10 hover:text-sky-300 text-zinc-450 font-bold py-2.5 px-4 rounded-2xl text-base flex items-center justify-center gap-2 transition-all duration-200 border border-zinc-850 hover:border-sky-500/40 hover:-translate-y-0.5 hover:scale-[1.03] active:scale-95 hover:shadow-[0_0_20px_rgba(56,189,248,0.25)] cursor-pointer group"
              >
                <Moon className="w-4 h-4 text-zinc-450 transition-transform duration-200 group-hover:scale-110 group-hover:-rotate-12 group-hover:text-sky-300" />
                <span>Rest Day</span>
              </button>
            </div>
          </div>
        ) : (
          /* ═══════════════════════════════════════════════════════════════
              STEP 2: Workout Details Panel (Form Controls)
             ═══════════════════════════════════════════════════════════════ */
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
