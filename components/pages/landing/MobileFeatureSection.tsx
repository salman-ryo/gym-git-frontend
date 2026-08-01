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
    <div className="mobile-feat__badge">
      <span className="mobile-feat__badge-dot" aria-hidden="true" />
      <span className="mobile-feat__badge-text">BUILT FOR LIFTERS</span>
    </div>
  );
}

/** Section headline */
function SectionHeadline() {
  return (
    <h2 className="mobile-feat__headline">
      LOG LIKE A DEV.
      <br />
      PROGRESS LIKE
      <br />
      AN <span className="mobile-feat__headline-accent">ATHLETE.</span>
    </h2>
  );
}

/** Feature list */
function FeatureList() {
  return (
    <ul className="mobile-feat__list" role="list">
      {FEATURES.map((feature, i) => (
        <li key={i} className="mobile-feat__list-item-text">
          <CheckCircle2 className="mobile-feat__check-icon" />
          <span>{feature}</span>
        </li>
      ))}
    </ul>
  );
}

/** CTA Button */
function ExploreCTA() {
  return (
    <Link href="#features" className="mobile-feat__cta">
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
    <section className="mobile-feat" aria-labelledby="mobile-feat-heading">
      <div className="mobile-feat__container">
        
        {/* ── Left Column: Visual ── */}
        <div className="mobile-feat__visual">
          <PhoneMockup />
        </div>

        {/* ── Right Column: Copy ── */}
        <div className="mobile-feat__content">
          <SectionBadge />
          <SectionHeadline />
          <FeatureList />
          <div className="mobile-feat__cta-wrap">
            <ExploreCTA />
          </div>
        </div>

      </div>
    </section>
  );
}
