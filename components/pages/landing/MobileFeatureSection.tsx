'use client';

import './MobileFeatureSection.css';
import React from 'react';
import { CheckCircle2, ChevronRight, Dumbbell, Smartphone, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

/* ─────────────────────────────────────────────
   Data
   ───────────────────────────────────────────── */
const FEATURES = [
  'Custom workout plans & templates',
  'Exercise library with muscle targeting',
  'Advanced analytics & trends',
  'PR tracking & personal records',
  'Dark theme. Always.',
];

/* ─────────────────────────────────────────────
   Sub-components
   ───────────────────────────────────────────── */

/** Mobile Phone Mockup */
function PhoneMockup() {
  return (
    <div className="mobile-feat__phone-wrapper">
      {/* Background glowing dumbbell and circuits */}
      <div className="mobile-feat__backdrop" aria-hidden="true">
        <div className="mobile-feat__circuit mobile-feat__circuit--left" />
        <div className="mobile-feat__circuit mobile-feat__circuit--right" />
        <div className="mobile-feat__dumbbell-glow" />
        <Dumbbell className="mobile-feat__dumbbell-icon" />
      </div>

      {/* The phone itself */}
      <div className="mobile-feat__phone" aria-hidden="true">
        <div className="mobile-feat__phone-notch" />
        
        {/* Phone Screen Content Mockup */}
        <div className="mobile-feat__screen">
          {/* Header */}
          <div className="mobile-feat__screen-header">
            <div className="mobile-feat__screen-header-top">
              <span className="mobile-feat__time">9:41</span>
              <div className="mobile-feat__status-icons">
                <div className="mobile-feat__icon-signal" />
                <div className="mobile-feat__icon-wifi" />
                <div className="mobile-feat__icon-battery" />
              </div>
            </div>
            <div className="mobile-feat__screen-nav">
              <ChevronLeft className="w-5 h-5" />
              <span className="mobile-feat__screen-title">Log Workout: <span className="text-neon-green">Pull Day</span></span>
            </div>
            <div className="mobile-feat__screen-dropdown">
              <span>Today</span>
              <ChevronRight className="w-4 h-4 rotate-90" />
            </div>
          </div>

          {/* List items */}
          <div className="mobile-feat__screen-list">
            <p className="mobile-feat__screen-section-title">Muscle Groups</p>
            
            <div className="mobile-feat__list-item">
              <div className="mobile-feat__item-icon" style={{ color: '#10b981' }}>💪</div>
              <span className="mobile-feat__item-name">Chest</span>
              <CheckCircle2 className="w-4 h-4 text-zinc-600 ml-auto" />
            </div>
            
            <div className="mobile-feat__list-item">
              <div className="mobile-feat__item-icon" style={{ color: '#8b5cf6' }}>👕</div>
              <span className="mobile-feat__item-name">Back</span>
              <CheckCircle2 className="w-4 h-4 text-neon-purple ml-auto" />
            </div>
            
            <div className="mobile-feat__list-item">
              <div className="mobile-feat__item-icon" style={{ color: '#3b82f6' }}>🦵</div>
              <span className="mobile-feat__item-name">Legs</span>
              <CheckCircle2 className="w-4 h-4 text-neon-blue ml-auto" />
            </div>
            
            <div className="mobile-feat__list-item">
              <div className="mobile-feat__item-icon" style={{ color: '#f59e0b' }}>🏃</div>
              <span className="mobile-feat__item-name">Shoulders</span>
              <CheckCircle2 className="w-4 h-4 text-zinc-600 ml-auto" />
            </div>

            <div className="mobile-feat__list-item mobile-feat__list-item--active">
              <div className="mobile-feat__item-icon" style={{ color: '#a855f7' }}>🦾</div>
              <span className="mobile-feat__item-name">Arms</span>
              <CheckCircle2 className="w-4 h-4 text-neon-purple ml-auto" />
            </div>
            
            <div className="mobile-feat__list-item">
              <div className="mobile-feat__item-icon" style={{ color: '#ef4444' }}>🫀</div>
              <span className="mobile-feat__item-name">Core</span>
              <CheckCircle2 className="w-4 h-4 text-zinc-600 ml-auto" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Section badge */
function SectionBadge() {
  return (
    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-neon-green/15 bg-neon-green/4 backdrop-blur-md">
      <span className="w-1.5 h-1.5 rounded-full bg-neon-green shadow-[0_0_8px_#00ff88] animate-[badge-pulse_2s_ease-in-out_infinite]" aria-hidden="true" />
      <span className="text-[11px] font-bold tracking-wider text-neon-green uppercase">BUILT FOR LIFTERS</span>
    </div>
  );
}

/** Section headline */
function SectionHeadline() {
  return (
    <h2 className="text-[clamp(1.8rem,4.5vw,3rem)] font-black leading-tight tracking-tight text-white mb-6">
      LOG LIKE A DEV.
      <br />
      PROGRESS LIKE
      <br />
      AN <span className="bg-gradient-to-r from-neon-green via-[#00e077] to-neon-cyan bg-clip-text text-transparent">ATHLETE.</span>
    </h2>
  );
}

/** Feature list */
function FeatureList() {
  return (
    <ul className="list-none m-0 p-0 flex flex-col gap-4 mb-8" role="list">
      {FEATURES.map((feature, i) => (
        <li key={i} className="flex items-center gap-3 text-[14.5px] text-[#fafafa] font-medium">
          <CheckCircle2 className="w-4.5 h-4.5 text-neon-green flex-shrink-0" />
          <span>{feature}</span>
        </li>
      ))}
    </ul>
  );
}

/** CTA Button */
function ExploreCTA() {
  return (
    <Link href="#features" className="inline-flex items-center justify-center gap-2 px-6 py-3 text-[14px] font-semibold text-[#fafafa] no-underline rounded-lg border border-[rgba(63,63,70,0.6)] bg-[rgba(24,24,27,0.4)] hover:text-[#fafafa] hover:border-[rgba(0,255,136,0.25)] hover:bg-[rgba(0,255,136,0.04)] hover:shadow-[0_0_16px_rgba(0,255,136,0.08)] transition-all duration-200 outline-none focus-visible:outline-2 focus-visible:outline-neon-green">
      <span>Explore Features</span>
      <ChevronRight className="w-4 h-4" />
    </Link>
  );
}

/* ─────────────────────────────────────────────
   Main Section
   ───────────────────────────────────────────── */
export default function MobileFeatureSection() {
  return (
    <section className="relative py-20 md:py-24 bg-transparent overflow-hidden" aria-labelledby="mobile-feat-heading">
      <div className="max-w-nav-max-width mx-auto px-6 lg:px-10 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-10 items-center">
        
        {/* ── Left Column: Visual ── */}
        <div className="flex justify-center items-center relative">
          <PhoneMockup />
        </div>

        {/* ── Right Column: Copy ── */}
        <div className="flex flex-col items-start">
          <SectionBadge />
          <SectionHeadline />
          <FeatureList />
          <div className="flex items-center">
            <ExploreCTA />
          </div>
        </div>

      </div>
    </section>
  );
}
