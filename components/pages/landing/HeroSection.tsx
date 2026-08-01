'use client';

import './HeroSection.css';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Play, Flame, Zap, TrendingUp, Activity } from 'lucide-react';

/* ─────────────────────────────────────────────
   Sub-components
   ───────────────────────────────────────────── */

/** Floating badge above the headline */
function HeroBadge() {
  return (
    <div className="hero__badge" aria-label="Built for Discipline">
      <span className="hero__badge-dot" aria-hidden="true" />
      <span className="hero__badge-text">BUILT FOR DISCIPLINE</span>
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
    <h1 className="hero__headline">
      <span className="hero__headline-line">TRACK YOUR</span>
      <span className="hero__headline-line">
        <span className="hero__headline-white">FITNESS.</span>
      </span>
      <span className="hero__headline-line hero__headline-accent">
        COMMIT TO
      </span>
      <span className="hero__headline-line hero__headline-accent">
        PROGRESS.
      </span>
    </h1>
  );
}

/** Subtitle paragraph */
function HeroSubtitle() {
  return (
    <p className="hero__subtitle">
      Gym-Git is your GitHub-style fitness tracker.{' '}
      <br className="hero__br-desktop" />
      Log workouts, build streaks, and visualize{' '}
      <br className="hero__br-desktop" />
      progress like a <RotatingWord />
    </p>
  );
}

/** CTA buttons */
function HeroCTAs() {
  return (
    <div className="hero__ctas">
      <Link href="/login" className="hero__cta-primary">
        <span className="hero__cta-primary-text">Start Tracking Now</span>
        <ArrowRight className="hero__cta-primary-arrow" />
        <span className="hero__cta-primary-glow" aria-hidden="true" />
      </Link>
      <a href="#demo" className="hero__cta-secondary">
        <Play className="hero__cta-secondary-icon" />
        <span>View Demo</span>
      </a>
    </div>
  );
}

/** Social proof avatars */
function SocialProof() {
  // Placeholder avatar colors representing different users
  const avatars = [
    { initials: 'AK', bg: '#10b981' },
    { initials: 'RJ', bg: '#8b5cf6' },
    { initials: 'MK', bg: '#f59e0b' },
    { initials: 'SL', bg: '#ef4444' },
    { initials: 'TP', bg: '#3b82f6' },
  ];

  return (
    <div className="hero__social-proof">
      <div className="hero__avatar-stack" aria-hidden="true">
        {avatars.map((a, i) => (
          <div
            key={i}
            className="hero__avatar"
            style={{ backgroundColor: a.bg, zIndex: avatars.length - i }}
          >
            <span className="hero__avatar-text">{a.initials}</span>
          </div>
        ))}
      </div>
      <p className="hero__social-text">
        Join <strong className="hero__social-count">2,457+</strong> lifters building consistency
      </p>
    </div>
  );
}

/* ── Dashboard Mockup (Right Side) ───────────── */

/** Stat card inside the dashboard */
function StatCard({
  label,
  value,
  icon,
  iconColor,
  trend,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  iconColor: string;
  trend?: string;
}) {
  return (
    <div className="hero-dash__stat-card">
      <div className="hero-dash__stat-top">
        <span className="hero-dash__stat-value">{value}</span>
        <span className="hero-dash__stat-icon" style={{ color: iconColor }}>
          {icon}
        </span>
      </div>
      <div className="hero-dash__stat-bottom">
        <span className="hero-dash__stat-label">{label}</span>
        {trend && <span className="hero-dash__stat-trend">{trend}</span>}
      </div>
    </div>
  );
}

/** Contribution graph (simplified visual) */
function ContributionGrid() {
  // Generate a pattern that resembles a contribution graph
  const rows = 7;
  const cols = 20;
  const intensities = [0, 1, 2, 3, 4];

  // Deterministic pattern
  const getIntensity = (r: number, c: number): number => {
    const seed = (r * 31 + c * 17 + 7) % 23;
    if (seed < 5) return 0;
    if (seed < 9) return 1;
    if (seed < 14) return 2;
    if (seed < 18) return 3;
    return 4;
  };

  return (
    <div className="hero-dash__contrib" aria-label="Contribution graph visualization">
      <div className="hero-dash__contrib-header">
        <Activity className="hero-dash__contrib-icon" />
        <span className="hero-dash__contrib-title">ACTIVITY LOGS</span>
      </div>
      <div className="hero-dash__contrib-meta">
        <span className="hero-dash__contrib-info">
          <strong>4,024</strong> reps logged in the last 365 days
        </span>
      </div>
      <div className="hero-dash__contrib-grid" role="img" aria-label="Exercise activity heatmap">
        {Array.from({ length: cols }, (_, c) => (
          <div key={c} className="hero-dash__contrib-col">
            {Array.from({ length: rows }, (_, r) => (
              <div
                key={r}
                className={`hero-dash__contrib-cell hero-dash__contrib-cell--${getIntensity(r, c)}`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/** Power level chart (simplified bar visualization) */
function PowerLevelChart() {
  const bars = [35, 48, 62, 55, 72, 68, 80, 75, 85, 78, 90, 88];
  const labels = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];

  return (
    <div className="hero-dash__power">
      <div className="hero-dash__power-header">
        <Zap className="hero-dash__power-icon" />
        <span className="hero-dash__power-title">POWER LEVELS</span>
      </div>
      <div className="hero-dash__power-chart" role="img" aria-label="Power level chart">
        {bars.map((height, i) => (
          <div key={i} className="hero-dash__power-bar-wrap">
            <div
              className="hero-dash__power-bar"
              style={{ height: `${height}%` }}
            />
            <span className="hero-dash__power-label">{labels[i]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Tab bar for activity section */
function ActivityTabs() {
  const tabs = ['Today', 'Week', 'Daily', 'Month', 'Monthly', 'Quarterly', 'Custom'];
  return (
    <div className="hero-dash__tabs">
      <span className="hero-dash__tabs-label">
        <TrendingUp className="hero-dash__tabs-label-icon" />
        PRIME ACTIVITY
      </span>
      <div className="hero-dash__tabs-list">
        {tabs.map((tab, i) => (
          <button
            key={tab}
            type="button"
            className={`hero-dash__tab ${i === 0 ? 'hero-dash__tab--active' : ''}`}
            tabIndex={-1}
            aria-hidden="true"
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
}

/** Full dashboard mockup */
function DashboardMockup() {
  return (
    <div className="hero-dash" aria-hidden="true">
      {/* Glow backdrop */}
      <div className="hero-dash__glow" />

      {/* Dashboard frame */}
      <div className="hero-dash__frame">
        {/* Header bar */}
        <div className="hero-dash__header">
          <div className="hero-dash__header-dots">
            <span className="hero-dash__dot hero-dash__dot--red" />
            <span className="hero-dash__dot hero-dash__dot--yellow" />
            <span className="hero-dash__dot hero-dash__dot--green" />
          </div>
          <span className="hero-dash__header-title">GRIND STATS</span>
          <div className="hero-dash__header-badge">
            <Flame className="hero-dash__header-flame" />
          </div>
        </div>

        {/* Stats row */}
        <div className="hero-dash__stats-row">
          <StatCard
            label="Current Streak"
            value="9"
            icon={<Flame className="w-4 h-4" />}
            iconColor="#f59e0b"
            trend="🔥"
          />
          <StatCard
            label="Consistency"
            value="92%"
            icon={<TrendingUp className="w-4 h-4" />}
            iconColor="#10b981"
            trend="↑ 5%"
          />
          <StatCard
            label="Power Level"
            value="19.1"
            icon={<Zap className="w-4 h-4" />}
            iconColor="#8b5cf6"
          />
        </div>

        {/* Tabs + Activity */}
        <ActivityTabs />

        {/* Contribution graph */}
        <ContributionGrid />

        {/* Power chart */}
        <PowerLevelChart />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main Hero Section
   ───────────────────────────────────────────── */
export default function HeroSection() {
  return (
    <section className="hero" aria-labelledby="hero-heading">
      {/* Grid background */}
      <div className="hero__grid-bg" aria-hidden="true" />

      {/* Radial gradient overlays */}
      <div className="hero__gradient-tl" aria-hidden="true" />
      <div className="hero__gradient-br" aria-hidden="true" />

      {/* Floating particles */}
      <div className="hero__particles" aria-hidden="true">
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

      <div className="hero__container">
        {/* ── Left Column ── */}
        <div className="hero__content">
          <HeroBadge />
          <HeroHeadline />
          <HeroSubtitle />
          <HeroCTAs />
          <SocialProof />
        </div>

        {/* ── Right Column ── */}
        <div className="hero__visual">
          <DashboardMockup />
        </div>
      </div>
    </section>
  );
}
