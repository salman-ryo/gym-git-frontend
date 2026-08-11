'use client';

import './HeroSection.css';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Flame, Zap, TrendingUp, Activity } from 'lucide-react';
import Image from 'next/image';

/* ─────────────────────────────────────────────
   Sub-components
   ───────────────────────────────────────────── */

/** Floating badge above the headline */
function HeroBadge() {
  return (
    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-neon-green/15 bg-zinc-950/80 backdrop-blur-md md:w-fit" aria-label="Track Your Grind">
      <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shadow-[0_0_8px_#00ff88] animate-[badge-pulse_2s_ease-in-out_infinite]" aria-hidden="true" />
      <span className="text-[11px] font-bold tracking-wider text-neon-green uppercase">Track Your Grind</span>
    </div>
  );
}

/** Typewriter-rotating word in the headline */
const ROTATING_WORDS = ['a developer.', 'an engineer.', 'a lifter.', 'an athlete.'];

function RotatingWord() {
  const [index, setIndex] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = ROTATING_WORDS[index];
    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting && displayed.length < currentWord.length) {
      // Typing forward
      timeout = setTimeout(() => {
        setDisplayed(currentWord.slice(0, displayed.length + 1));
      }, 80);
    } else if (!isDeleting && displayed.length === currentWord.length) {
      // Pause before deleting
      timeout = setTimeout(() => setIsDeleting(true), 1800);
    } else if (isDeleting && displayed.length > 0) {
      // Deleting
      timeout = setTimeout(() => {
        setDisplayed(currentWord.slice(0, displayed.length - 1));
      }, 45);
    } else if (isDeleting && displayed.length === 0) {
      setIsDeleting(false);
      setIndex((index + 1) % ROTATING_WORDS.length);
    }

    return () => clearTimeout(timeout);
  }, [displayed, isDeleting, index]);

  return (
    <span className="hero__rotating-word" aria-live="polite">
      <span className="text-cyan-400">{displayed}</span>
      <span className="text-teal-400" aria-hidden="true">|</span>
    </span>
  );
}

/** Main headline */
function HeroHeadline() {
  return (
    <h1 className="flex flex-col gap-0 text-[clamp(2.2rem,5vw,4rem)] font-black leading-[1.05] tracking-tight m-0">
      <span className="block text-[#fafafa]">TRACK YOUR</span>
      <span className="block">
        <span className="text-[#fafafa]">FITNESS.</span>
      </span>
      <span className="block bg-gradient-to-r from-neon-green via-[#00e077] to-neon-cyan bg-clip-text text-transparent filter drop-shadow-[0_0_15px_rgba(168,85,247,0.3)]">
        COMMIT TO
      </span>
      <span className="block bg-gradient-to-r from-neon-green via-[#00e077] to-neon-cyan bg-clip-text text-transparent filter drop-shadow-[0_0_15px_rgba(168,85,247,0.3)]">
        PROGRESS.
      </span>
    </h1>
  );
}

/** Subtitle paragraph */
function HeroSubtitle() {
  return (
    <p className="text-[clamp(0.95rem,1.5vw,1.1rem)] leading-relaxed text-gray-300 m-0 max-w-[480px]">
      Gym-Git is your GitHub-style fitness tracker.{' '}
      <br className="hidden lg:inline" />
      Log workouts, build streaks, and visualize{' '}
      <br className="hidden lg:inline" />
      progress like <RotatingWord />
    </p>
  );
}

/** CTA buttons */
function HeroCTAs() {
  return (
    <div className="flex items-center gap-4 flex-wrap">
      <Link
        href="/login"
        className="relative inline-flex items-center gap-2 px-7 py-3.5 text-[14.5px] font-semibold text-[#080c10] no-underline rounded-lg bg-gradient-to-r from-neon-green to-teal-500 overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(0,255,136,0.35),0_8px_24px_-8px_rgba(0,255,136,0.25)] active:translate-y-0 focus-visible:outline-2 focus-visible:outline-neon-cyan focus-visible:outline-offset-3 border-none outline-none cursor-pointer group"
      >
        <span className="relative z-10 whitespace-nowrap">Start Your Journey</span>
        <ArrowRight className="w-4 h-4 relative z-10 transition-transform duration-200 group-hover:translate-x-0.5" />
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-[120%] group-hover:animate-[shimmer-effect_0.8s_ease_forwards]" aria-hidden="true" />
      </Link>
    </div>
  );
}

/** Social proof avatars */
function SocialProof() {
  const avatars = [
    { initials: 'AK', bg: '#10b981' },
    { initials: 'RJ', bg: '#8b5cf6' },
    { initials: 'MK', bg: '#f59e0b' },
    { initials: 'SL', bg: '#ef4444' },
    { initials: 'TP', bg: '#3b82f6' },
  ];

  return (
    <div className="flex items-center gap-3 pt-2">
      <div className="flex" aria-hidden="true">
        {avatars.map((a, i) => (
          <div
            key={i}
            className="w-8 h-8 rounded-full flex items-center justify-center border-2 border-[#060a0e] -mr-2 relative flex-shrink-0"
            style={{ backgroundColor: a.bg, zIndex: avatars.length - i }}
          >
            <span className="text-[10px] font-bold text-white leading-none">{a.initials}</span>
          </div>
        ))}
      </div>
      <p className="text-[13px] text-[#52525b] m-0">
        Join <strong className="text-[#a1a1aa] font-bold">2,457+</strong> lifters building consistency
      </p>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main Hero Section
   ───────────────────────────────────────────── */
export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-[calc(var(--nav-height,72px)+32px)] pb-16 overflow-hidden bg-transparent" aria-labelledby="hero-heading">
      {/* Grid background */}
      <div className="hero__grid-bg" aria-hidden="true" />

      {/* Radial gradient overlays */}
      <div className="hero__gradient-tl" aria-hidden="true" />
      <div className="hero__gradient-br" aria-hidden="true" />

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {Array.from({ length: 6 }, (_, i) => (
          <div
            key={i}
            className="hero__particle"
            style={{
              '--particle-x': `${15 + i * 15}%`,
              '--particle-y': `${20 + (i % 3) * 25}%`,
              '--particle-delay': `${i * 0.8}s`,
              '--particle-duration': `${3 + (i % 3)}s`,
            } as React.CSSProperties}
          />
        ))}
      </div>

      <div className="max-w-nav-max-width mx-auto px-6 lg:px-10 relative z-10 grid grid-cols-1 lg:grid-cols-[1fr_1.15fr] gap-12 lg:gap-14 xl:gap-18 items-center">
        {/* ── Left Column ── */}
        <div className="flex flex-col gap-6 lg:gap-7">
          <HeroBadge />
          <HeroHeadline />
          <HeroSubtitle />
          <HeroCTAs />
          <SocialProof />
        </div>

        {/* ── Right Column ── */}
        <div className="relative flex justify-center max-w-[600px] lg:max-w-none mx-auto lg:mx-0 w-full rounded-2xl border-2 border-teal-800 overflow-hidden md:h-[50dvh] md:w-auto shadow-md shadow-cyan-400">
          <Image src="/images/landing/dashboardsection.webp" priority unoptimized width={1080} height={1920} quality={100} alt="Dashboard Mockup" className='object-contain' />
        </div>
      </div>
    </section>
  );
}
