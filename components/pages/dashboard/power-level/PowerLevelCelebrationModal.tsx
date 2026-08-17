'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { PowerScoreBreakdown } from '@/lib/scientific-power';
import { getPowerColorTheme, useTieredBarAnimation } from './power-chart-utils';
import CharacterPowerParticles from './CharacterPowerParticles';
import { Sparkles, Target, Timer, Puzzle, Flame } from 'lucide-react';
import ModalShell from '@/components/ui/modal-shell';

export interface PowerLevelCelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetScore: number;
  scoreData?: PowerScoreBreakdown;
  autoCloseDelay?: number;
}

export default function PowerLevelCelebrationModal({
  isOpen,
  onClose,
  targetScore,
  scoreData,
  autoCloseDelay = 2200,
}: PowerLevelCelebrationModalProps) {
  const closeTimerRef = useRef<NodeJS.Timeout | null>(null);

  const { currentScore, continuousScore, currentCharacter, isCompleted, isAnimating, tierJustChanged } = useTieredBarAnimation({
    targetScore,
    inView: isOpen,
    delay: 200,
    stepDuration: 440,
  });

  useEffect(() => {
    if (!isOpen) {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
      return;
    }

    if (isCompleted) {
      closeTimerRef.current = setTimeout(() => {
        onClose();
      }, autoCloseDelay);
    }

    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, [isOpen, isCompleted, autoCloseDelay, onClose]);

  if (!isOpen) return null;

  const theme = getPowerColorTheme(currentScore, true);
  const heightPercent = continuousScore;

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="md"
      accentGradient="bg-gradient-to-r from-cyan-400 via-emerald-400 via-indigo-400 to-amber-400"
    >
      {/* Header Badge */}
      <div className="flex flex-col items-center text-center mb-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-400 text-[10px] font-black uppercase tracking-widest mb-2 shadow-[0_0_15px_rgba(34,211,238,0.25)]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Power Level Calibration</span>
        </div>
        <h3 className="text-xl font-black uppercase tracking-wider text-zinc-100">
          {isCompleted ? 'Power Level Updated!' : 'Analyzing Today’s Gains...'}
        </h3>
        <p className="text-xs text-zinc-400 mt-0.5">
          Watch your weekly power score rise from Aqua Tier
        </p>
      </div>

      {/* Main Character Avatar & Rising Bar Display */}
      <div className="relative my-4 flex items-center justify-center gap-6 py-4 bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-4 overflow-hidden">
        {/* Tier Up Flash Background */}
        {tierJustChanged && (
          <div className="absolute inset-0 bg-cyan-400/15 animate-ping pointer-events-none" />
        )}

        {/* Character Avatar Box */}
        <div className="flex flex-col items-center gap-2">
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center">
            {/* Dynamic Glowing Ki Particles during calibration */}
            <CharacterPowerParticles
              isAnimating={isAnimating}
              score={currentScore}
              size="lg"
            />

            {/* Glow behind character */}
            <div
              className={`absolute inset-0 rounded-full blur-xl transition-all duration-500 ${
                currentScore === 0
                  ? 'bg-cyan-500/30'
                  : currentScore < 35
                  ? 'bg-sky-400/30'
                  : currentScore < 55
                  ? 'bg-emerald-400/30'
                  : currentScore < 75
                  ? 'bg-indigo-400/30'
                  : 'bg-amber-400/40'
              }`}
            />

            {/* Character Image */}
            <Image
              src={currentCharacter.image}
              alt={currentCharacter.name}
              width={128}
              height={128}
              unoptimized
              className={`w-full h-full object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.25)] relative z-10 transition-all duration-300 ${
                tierJustChanged ? 'scale-110' : 'scale-100'
              }`}
            />

            {/* Sparkle badge on Tier Up */}
            {tierJustChanged && (
              <div className="absolute -top-1 -right-1 bg-amber-400 text-zinc-950 font-black text-[9px] px-1.5 py-0.5 rounded-md uppercase shadow-lg animate-bounce z-20">
                Level Up!
              </div>
            )}
          </div>

          {/* Character Tier Name */}
          <div className="text-center">
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
              Current Tier
            </span>
            <h4 className="text-sm font-black text-amber-400 uppercase tracking-wide">
              {currentCharacter.name}
            </h4>
          </div>
        </div>

        {/* Animated Power Level Bar Column */}
        <div className="flex flex-col items-center justify-end h-44 w-20 relative">
          {/* Animated Score Counter Number */}
          <div className="text-center mb-2">
            <span className="text-2xl font-black tracking-tight text-white font-mono drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">
              {currentScore}
            </span>
            <span className="text-[10px] text-zinc-400 font-bold ml-1">/ 100</span>
          </div>

          {/* Bar Container */}
          <div
            className={`w-14 bg-zinc-950/90 rounded-xl overflow-hidden flex flex-col justify-end h-32 p-1 border transition-colors duration-300 relative shadow-inner ${theme.container}`}
          >
            {/* Bar Glow */}
            <div
              style={{ height: `${heightPercent}%` }}
              className={`w-full rounded-lg relative overflow-hidden ${theme.bar}`}
            >
              {/* Shimmer Effect inside the rising bar */}
              <div className="absolute inset-0 bg-gradient-to-t from-white/0 via-white/25 to-white/0 animate-pulse" />
            </div>
          </div>

          <span className="text-[9px] font-extrabold uppercase tracking-widest text-zinc-400 mt-2">
            Power Bar
          </span>
        </div>
      </div>

      {/* Character Description Quote */}
      <p className="text-[11px] text-zinc-400 text-center italic line-clamp-2 px-2 mb-4">
        &ldquo;{currentCharacter.description}&rdquo;
      </p>

      {/* Scientific Breakdown Summary Grid */}
      {scoreData && (
        <div className="grid grid-cols-4 gap-1.5 bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-2.5 mb-4 text-center">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-[9px] text-zinc-400 font-bold">
              <Target className="w-3 h-3 text-red-400" />
              <span>Consist.</span>
            </div>
            <span className="text-xs font-black text-white mt-0.5">
              {Math.round((scoreData.consistencyScore / 45) * Math.min(45, (currentScore / (targetScore || 1)) * scoreData.consistencyScore))}/45
            </span>
          </div>

          <div className="flex flex-col items-center border-l border-zinc-800">
            <div className="flex items-center gap-1 text-[9px] text-zinc-400 font-bold">
              <Timer className="w-3 h-3 text-blue-400" />
              <span>Duration</span>
            </div>
            <span className="text-xs font-black text-white mt-0.5">
              {Math.round((scoreData.durationQualityScore / 25) * Math.min(25, (currentScore / (targetScore || 1)) * scoreData.durationQualityScore))}/25
            </span>
          </div>

          <div className="flex flex-col items-center border-l border-zinc-800">
            <div className="flex items-center gap-1 text-[9px] text-zinc-400 font-bold">
              <Puzzle className="w-3 h-3 text-green-400" />
              <span>Variety</span>
            </div>
            <span className="text-xs font-black text-white mt-0.5">
              {Math.round((scoreData.varietyScore / 20) * Math.min(20, (currentScore / (targetScore || 1)) * scoreData.varietyScore))}/20
            </span>
          </div>

          <div className="flex flex-col items-center border-l border-zinc-800">
            <div className="flex items-center gap-1 text-[9px] text-zinc-400 font-bold">
              <Flame className="w-3 h-3 text-orange-400" />
              <span>Momen.</span>
            </div>
            <span className="text-xs font-black text-white mt-0.5">
              {Math.round((scoreData.momentumScore / 10) * Math.min(10, (currentScore / (targetScore || 1)) * scoreData.momentumScore))}/10
            </span>
          </div>
        </div>
      )}

      {/* Action Skip / Continue Button */}
      <button
        type="button"
        onClick={onClose}
        className="w-full py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 text-zinc-200 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5"
      >
        <span>{isCompleted ? 'Continue to Dashboard' : 'Skip Animation'}</span>
      </button>
    </ModalShell>
  );
}
