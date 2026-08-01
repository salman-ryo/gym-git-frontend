'use client';

import './WhyGymGitSection.css';
import React from 'react';
import { Flame, BarChart3, ClipboardList, ShieldCheck } from 'lucide-react';

/* ─────────────────────────────────────────────
   Data
   ───────────────────────────────────────────── */
interface FeatureCard {
  icon: React.ReactNode;
  iconColor: string;
  glowColor: string;
  title: string;
  description: string;
}

const FEATURES: FeatureCard[] = [
  {
    icon: <Flame className="why-card__icon-svg" />,
    iconColor: '#f59e0b',
    glowColor: 'rgba(245, 158, 11, 0.25)',
    title: 'GITHUB-STYLE STREAKS',
    description:
      'Streaks that actually motivate. Commit to your plan and keep the flame alive.',
  },
  {
    icon: <BarChart3 className="why-card__icon-svg" />,
    iconColor: '#8b5cf6',
    glowColor: 'rgba(139, 92, 246, 0.25)',
    title: 'DEEP PROGRESS INSIGHTS',
    description:
      'Visualize your volume, consistency, and performance over time.',
  },
  {
    icon: <ClipboardList className="why-card__icon-svg" />,
    iconColor: '#22d3ee',
    glowColor: 'rgba(34, 211, 238, 0.25)',
    title: 'PLAN & LOG SMARTER',
    description:
      'Structured workout plans with easy logging and auto tracking.',
  },
  {
    icon: <ShieldCheck className="why-card__icon-svg" />,
    iconColor: '#00ff88',
    glowColor: 'rgba(0, 255, 136, 0.25)',
    title: 'PRIVACY FIRST BY DESIGN',
    description:
      "Your data's yours. You ask. No selling. Just progress.",
  },
];

/* ─────────────────────────────────────────────
   Sub-components
   ───────────────────────────────────────────── */

/** Section badge */
function SectionBadge() {
  return (
    <div className="why__badge">
      <span className="why__badge-dot" aria-hidden="true" />
      <span className="why__badge-text">WHY GYM GIT</span>
    </div>
  );
}

/** Section headline */
function SectionHeadline() {
  return (
    <h2 className="why__headline" id="why-heading">
      <span className="why__headline-white">BUILT DIFFERENT.</span>
      <br />
      <span className="why__headline-white">BUILT FOR </span>
      <span className="why__headline-accent">YOU.</span>
    </h2>
  );
}

/** Section subtitle */
function SectionSubtitle() {
  return (
    <p className="why__subtitle">
      Tools that help you stay consistent, track deeper,
      <br className="why__br-desktop" />
      and level up every day.
    </p>
  );
}

/** Individual feature card */
function WhyFeatureCard({
  icon,
  iconColor,
  glowColor,
  title,
  description,
  index,
}: FeatureCard & { index: number }) {
  return (
    <article
      className="why-card"
      style={
        {
          '--card-delay': `${index * 0.1}s`,
          '--card-icon-color': iconColor,
          '--card-glow-color': glowColor,
        } as React.CSSProperties
      }
    >
      {/* Glow orb behind the icon */}
      <div className="why-card__icon-wrap">
        <div className="why-card__icon-glow" aria-hidden="true" />
        <div className="why-card__icon-circle">{icon}</div>
      </div>

      <h3 className="why-card__title">{title}</h3>
      <p className="why-card__desc">{description}</p>

      {/* Bottom neon accent line */}
      <div className="why-card__accent-line" aria-hidden="true" />
    </article>
  );
}

/* ─────────────────────────────────────────────
   Main Section
   ───────────────────────────────────────────── */
export default function WhyGymGitSection() {
  return (
    <section className="why" aria-labelledby="why-heading">
      {/* Background grid */}
      <div className="why__grid-bg" aria-hidden="true" />

      {/* Section header */}
      <div className="why__header">
        <SectionBadge />
        <SectionHeadline />
        <SectionSubtitle />
      </div>

      {/* Feature cards grid */}
      <div className="why__cards">
        {FEATURES.map((feature, i) => (
          <WhyFeatureCard key={feature.title} {...feature} index={i} />
        ))}
      </div>
    </section>
  );
}
