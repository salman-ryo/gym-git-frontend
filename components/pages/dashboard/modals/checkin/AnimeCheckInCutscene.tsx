'use client';

import React from 'react';
import Image from 'next/image';
import { AnimeCutsceneHero } from '@/assets/anime';

export interface AnimeCheckInCutsceneProps {
  animState: 'yes_anim' | 'no_anim';
  activeYesHero: AnimeCutsceneHero;
  activeNoHero: AnimeCutsceneHero;
  onSkipYes: () => void;
  onSkipNo: () => void;
}

/**
 * Fullscreen anime cutscene overlay for Daily Check-In responses:
 * - "YES": Super Saiyan / Ashura high-energy power surge
 * - "NO / REST DAY": Zen comic recovery cutscene with sweat drop & gloom lines
 */
export function AnimeCheckInCutscene({
  animState,
  activeYesHero,
  activeNoHero,
  onSkipYes,
  onSkipNo,
}: AnimeCheckInCutsceneProps) {
  if (animState === 'yes_anim') {
    return (
      <div
        onClick={onSkipYes}
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
        <div className="relative z-10 flex flex-col items-center text-center p-3 sm:p-4 anime-shake">
          {/* Japanese Manga SFX */}
          <div className="text-3xl sm:text-5xl font-black italic tracking-tighter text-amber-300 anime-sfx-text mb-0.5 sm:mb-1">
            {activeYesHero.sfxJa}
          </div>

          {/* English Hype Action Move */}
          <div className="text-lg sm:text-2xl font-black uppercase tracking-widest bg-gradient-to-r from-white via-neon-green to-neon-cyan bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(0,255,136,0.8)] -rotate-3 mb-2 sm:mb-3">
            ⚡ {activeYesHero.sfxEn} ⚡
          </div>

          {/* Character Avatar with Super Saiyan Aura */}
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 mx-auto my-1 flex items-center justify-center anime-character-enter">
            {/* Aura Flame */}
            <div
              className="absolute inset-0 rounded-full blur-xl anime-aura-glow opacity-90"
              style={{ background: activeYesHero.glowColor }}
            />
            {/* Electric Sparks */}
            <div className="absolute -top-2 -left-2 text-neon-green text-lg sm:text-xl anime-spark">
              ✦
            </div>
            <div className="absolute -bottom-1 -right-2 text-amber-300 text-lg sm:text-xl anime-spark">
              ⚡
            </div>
            <div className="absolute top-1/2 -right-4 text-neon-cyan text-base sm:text-lg anime-spark">
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
          <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-1.5 mt-2 sm:mt-3 max-w-xs">
            <span className="anime-badge-left px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-emerald-950/90 border border-neon-green/60 text-[10px] sm:text-[11px] font-black text-neon-green shadow-[0_0_12px_rgba(0,255,136,0.35)]">
              {activeYesHero.badge1}
            </span>
            <span className="anime-badge-right px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-amber-950/90 border border-amber-400/60 text-[10px] sm:text-[11px] font-black text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.35)]">
              {activeYesHero.badge2}
            </span>
            <span className="anime-badge-center px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-cyan-950/90 border border-neon-cyan/60 text-[10px] sm:text-[11px] font-black text-neon-cyan shadow-[0_0_12px_rgba(34,211,238,0.35)]">
              {activeYesHero.badge3}
            </span>
          </div>

          {/* Action Banner Quote */}
          <div className="mt-2.5 sm:mt-3 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-black/80 border border-zinc-700/80 backdrop-blur-md max-w-xs">
            <p className="text-[10.5px] sm:text-[11px] font-extrabold text-zinc-100 tracking-wide truncate">
              {activeYesHero.title}
            </p>
            <p className="text-[8.5px] sm:text-[9px] text-zinc-400 font-medium mt-0.5 line-clamp-1">
              {activeYesHero.subtitle}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 'no_anim'
  return (
    <div
      onClick={onSkipNo}
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
      <div className="relative z-10 flex flex-col items-center text-center p-3 sm:p-4">
        {/* Manga SFX Chill */}
        <div className="text-3xl sm:text-5xl font-black italic tracking-tighter text-sky-300 anime-sfx-text-chill mb-0.5 sm:mb-1">
          {activeNoHero.sfxJa}
        </div>

        {/* Recovery Move Title */}
        <div className="text-lg sm:text-2xl font-black uppercase tracking-widest bg-gradient-to-r from-sky-300 via-cyan-200 to-indigo-300 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(56,189,248,0.8)] -rotate-2 mb-2 sm:mb-3">
          💤 {activeNoHero.sfxEn} 💤
        </div>

        {/* Character Avatar with Comical Sweat Drop */}
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 mx-auto my-1 flex items-center justify-center anime-character-enter">
          {/* Chill Aura */}
          <div
            className="absolute inset-0 rounded-full blur-xl opacity-80"
            style={{ background: activeNoHero.glowColor }}
          />

          {/* Comical Anime Giant Sweat Drop */}
          <div className="absolute -top-3 -right-2 text-2xl sm:text-3xl anime-sweat-drop z-20">
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
        <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-1.5 mt-2 sm:mt-3 max-w-xs">
          <span className="anime-badge-left px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-sky-950/90 border border-sky-400/60 text-[10px] sm:text-[11px] font-black text-sky-300 shadow-[0_0_12px_rgba(56,189,248,0.35)]">
            {activeNoHero.badge1}
          </span>
          <span className="anime-badge-right px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-indigo-950/90 border border-indigo-400/60 text-[10px] sm:text-[11px] font-black text-indigo-300 shadow-[0_0_12px_rgba(129,140,248,0.35)]">
            {activeNoHero.badge2}
          </span>
          <span className="anime-badge-center px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-teal-950/90 border border-teal-400/60 text-[10px] sm:text-[11px] font-black text-teal-300 shadow-[0_0_12px_rgba(45,212,191,0.35)]">
            {activeNoHero.badge3}
          </span>
        </div>

        {/* Recovery Banner Quote */}
        <div className="mt-2.5 sm:mt-3 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-black/80 border border-zinc-700/80 backdrop-blur-md max-w-xs">
          <p className="text-[10.5px] sm:text-[11px] font-extrabold text-zinc-100 tracking-wide truncate">
            {activeNoHero.title}
          </p>
          <p className="text-[8.5px] sm:text-[9px] text-zinc-400 font-medium mt-0.5 line-clamp-1">
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
  );
}

export default AnimeCheckInCutscene;
