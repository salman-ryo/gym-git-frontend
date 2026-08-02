'use client';

import './HeroSection.css';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Play, Flame, Zap, TrendingUp, Activity } from 'lucide-react';
import Image from 'next/image';

/* ─────────────────────────────────────────────
   Sub-components
   ───────────────────────────────────────────── */

/** Floating badge above the headline */
function HeroBadge() {
  return (
    <div className="landing-badge" aria-label="Built for Discipline">
      <span className="landing-badge-dot" aria-hidden="true" />
      <span className="landing-badge-text">BUILT FOR DISCIPLINE</span>
    </div>
  );
}

/** Typewriter-rotating word in the headline */
const ROTATING_WORDS = ['developer.', 'engineer.', 'lifter.', 'athlete.'];

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
      <span className="hero__rotating-text">{displayed}</span>
      <span className="hero__cursor" aria-hidden="true">|</span>
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
      <span className="block text-gradient-neon filter drop-shadow-[0_0_15px_rgba(168,85,247,0.3)]">
        COMMIT TO
      </span>
      <span className="block text-gradient-neon filter drop-shadow-[0_0_15px_rgba(168,85,247,0.3)]">
        PROGRESS.
      </span>
    </h1>
  );
}

/** Subtitle paragraph */
function HeroSubtitle() {
  return (
    <p className="text-[clamp(0.95rem,1.5vw,1.1rem)] leading-relaxed text-[#71717a] m-0 max-w-[480px]">
      Gym-Git is your GitHub-style fitness tracker.{' '}
      <br className="hidden lg:inline" />
      Log workouts, build streaks, and visualize{' '}
      <br className="hidden lg:inline" />
      progress like a <RotatingWord />
    </p>
  );
}

/** CTA buttons */
function HeroCTAs() {
  return (
    <div className="flex items-center gap-4 flex-wrap">
      <Link
        href="/login"
        className="relative inline-flex items-center gap-2 px-7 py-3.5 text-[14.5px] font-semibold text-[#080c10] no-underline rounded-lg bg-gradient-to-r from-neon-green to-[#00e077] overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(0,255,136,0.35),0_8px_24px_-8px_rgba(0,255,136,0.25)] active:translate-y-0 focus-visible:outline-2 focus-visible:outline-neon-cyan focus-visible:outline-offset-3 border-none outline-none cursor-pointer group"
      >
        <span className="relative z-10 whitespace-nowrap">Start Tracking Now</span>
        <ArrowRight className="w-4 h-4 relative z-10 transition-transform duration-200 group-hover:translate-x-0.5" />
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-[120%] group-hover:animate-[shimmer-effect_0.8s_ease_forwards]" aria-hidden="true" />
      </Link>
      <a
        href="#demo"
        className="inline-flex items-center gap-2 px-6 py-3.5 text-[14.5px] font-medium text-[#a1a1aa] no-underline rounded-lg border border-[rgba(63,63,70,0.6)] bg-[rgba(24,24,27,0.4)] hover:text-[#fafafa] hover:border-[rgba(0,255,136,0.25)] hover:bg-[rgba(0,255,136,0.04)] hover:shadow-[0_0_16px_rgba(0,255,136,0.08)] transition-all duration-200 outline-none focus-visible:outline-2 focus-visible:outline-neon-green focus-visible:outline-offset-3"
      >
        <Play className="w-3.5 h-3.5" />
        <span>View Demo</span>
      </a>
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

      <div className="landing-container relative z-10 grid grid-cols-1 lg:grid-cols-[1fr_1.15fr] gap-12 lg:gap-14 xl:gap-18 items-center">
        {/* ── Left Column ── */}
        <div className="flex flex-col gap-6 lg:gap-7">
          <HeroBadge />
          <HeroHeadline />
          <HeroSubtitle />
          <HeroCTAs />
          <SocialProof />
        </div>

        {/* ── Right Column ── */}
        <div className="relative flex justify-center max-w-[600px] lg:max-w-none mx-auto lg:mx-0 w-full rounded-2xl border-2 border-teal-800 overflow-hidden md:h-[65dvh] md:w-auto shadow-md shadow-teal-500/50">
          <Image src="/images/dashboardsection.png" priority width={1080} height={1920} alt="Dashboard Mockup" />
        </div>
      </div>
    </section>
  );
}
