'use client';

import './WhyGymGitSection.css';
import React, { useRef } from 'react';
import Image from 'next/image';
import { useAnimatedCounter } from '@/hooks/useAnimatedCounter';
import { useInView } from '@/hooks/useInView';

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
    icon: <Image src="/images/icons/git.png" alt="Git tracking" width={100} height={100} unoptimized className="size-10 md:size-12" />,
    iconColor: '#f59e0b',
    glowColor: 'rgba(245, 158, 11, 0.25)',
    title: 'GITHUB-STYLE STREAKS',
    description:
      'Streaks that actually motivate. Commit to your plan and keep the flame alive.',
  },
  {
    icon: <Image src="/images/icons/progress.png" alt="Progress tracking" width={100} height={100} unoptimized className="size-10 md:size-12" />,
    iconColor: '#8b5cf6',
    glowColor: 'rgba(139, 92, 246, 0.25)',
    title: 'DEEP PROGRESS INSIGHTS',
    description:
      'Visualize your volume, consistency, and performance over time.',
  },
  {
    icon: <Image src="/images/icons/plan.png" alt="Plan tracking" width={100} height={100} unoptimized className="size-10 md:size-12" />,
    iconColor: '#22d3ee',
    glowColor: 'rgba(34, 211, 238, 0.25)',
    title: 'PLAN & LOG SMARTER',
    description:
      'Structured workout plans with easy logging and auto tracking.',
  },
  {
    icon: <Image src="/images/icons/privacy.png" alt="Privacy tracking" width={100} height={100} unoptimized className="size-10 md:size-12" />,
    iconColor: '#00ff88',
    glowColor: 'rgba(0, 255, 136, 0.25)',
    title: 'PRIVACY FIRST BY DESIGN',
    description:
      "Your data's yours. You ask. No selling. Just progress.",
  },
];

interface StatCounter {
  icon: React.ReactNode;
  iconColor: string;
  value: number;
  suffix: string;
  label: string;
}

const STATS: StatCounter[] = [
  {
    icon: <Image src="/images/icons/users.png" alt="Users" width={100} height={100} unoptimized className="size-10" />,
    iconColor: '#f59e0b',
    value: 2457,
    suffix: '+',
    label: 'Active Lifters',
  },
  {
    icon: <Image src="/images/icons/workout.png" alt="Workout" width={100} height={100} unoptimized className="size-10" />,
    iconColor: '#8b5cf6',
    value: 18329,
    suffix: '+',
    label: 'Workouts Logged',
  },
  {
    icon: <Image src="/images/icons/time.png" alt="Time" width={100} height={100} unoptimized className="size-10" />,
    iconColor: '#22d3ee',
    value: 11250,
    suffix: '+',
    label: 'Hours Tracked',
  },
  {
    icon: <Image src="/images/icons/consistency.png" alt="Consistency" width={100} height={100} unoptimized className="size-10" />,
    iconColor: '#00ff88',
    value: 91520,
    suffix: '+',
    label: 'Days of Consistency',
  },
];

/* ─────────────────────────────────────────────
   Sub-components
   ───────────────────────────────────────────── */

/** Section badge */
function SectionBadge() {
  return (
    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-neon-green/15 bg-neon-green/4 backdrop-blur-md">
      <span className="w-1.5 h-1.5 rounded-full bg-neon-green shadow-[0_0_8px_#00ff88] animate-[badge-pulse_2s_ease-in-out_infinite]" aria-hidden="true" />
      <span className="text-[11px] font-bold tracking-wider text-neon-green uppercase">WHY GYM GIT</span>
    </div>
  );
}

/** Section headline */
function SectionHeadline() {
  return (
    <h2 className="text-[clamp(1.8rem,4vw,3rem)] font-black leading-tight tracking-tight m-0" id="why-heading">
      <span className="text-[#fafafa]">BUILT DIFFERENT.</span>
      <br />
      <span className="text-[#fafafa]">BUILT FOR </span>
      <span className="bg-gradient-to-r from-neon-green via-[#00e077] to-neon-cyan bg-clip-text text-transparent">YOU.</span>
    </h2>
  );
}

/** Section subtitle */
function SectionSubtitle() {
  return (
    <p className="text-[clamp(0.9rem,1.4vw,1.05rem)] leading-relaxed text-[#71717a] m-0 max-w-[440px]">
      Tools that help you stay consistent, track deeper,
      <br className="hidden md:inline" />
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
      className="relative rounded-2xl border border-zinc-800/50 bg-glass-bg backdrop-blur-md overflow-hidden transition-all duration-350 ease-[cubic-bezier(0.4,0,0.2,1)] hover:border-neon-green/15 hover:bg-glass-bg-scrolled hover:shadow-[0_16px_48px_-12px_rgba(0,0,0,0.5)] hover:-translate-y-1 will-change-transform why-card flex flex-col items-center text-center px-6 pt-9 pb-8 cursor-default group"
      style={
        {
          '--card-delay': `${index * 0.1}s`,
          '--card-icon-color': iconColor,
          '--card-glow-color': glowColor,
        } as React.CSSProperties
      }
    >
      {/* Glow orb behind the icon */}
      <div className="relative w-14 h-14 mb-5 flex items-center justify-center">
        <div className="absolute -inset-2 rounded-full bg-[radial-gradient(circle,var(--card-glow-color,rgba(0,255,136,0.25))_0%,transparent_70%)] blur-md opacity-30 group-hover:opacity-70 group-hover:blur-lg transition-all duration-300" aria-hidden="true" />
        <div className="relative z-10">{icon}</div>
      </div>

      <h3 className="text-[12.5px] font-extrabold tracking-wider text-[#e4e4e7] mb-2.5 leading-tight">{title}</h3>
      <p className="text-[13px] leading-relaxed text-[#71717a] m-0 max-w-[220px]">{description}</p>

      {/* Bottom neon accent line */}
      <div className="absolute bottom-0 left-1/2 w-0 h-[2px] rounded-[1px] bg-gradient-to-r from-transparent via-[var(--card-icon-color,#00ff88)] to-transparent shadow-[0_0_10px_var(--card-glow-color,rgba(0,255,136,0.3))] -translate-x-1/2 group-hover:w-[60%] transition-all duration-400 ease-out" aria-hidden="true" />
    </article>
  );
}

/** Individual stat counter card */
function WhyStatCard({ icon, iconColor, value, suffix, label }: StatCounter) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.3, triggerOnce: true });
  const count = useAnimatedCounter(value, { inView, duration: 2200 });

  return (
    <div
      ref={ref}
      className="flex items-center gap-3.5 px-[22px] py-5 rounded-xl border border-[rgba(39,39,42,0.5)] bg-[rgba(14,18,24,0.5)] backdrop-blur-sm relative overflow-hidden transition-all duration-300 hover:border-[rgba(0,255,136,0.12)] hover:shadow-[0_8px_32px_-8px_rgba(0,0,0,0.4)] hover:-translate-y-0.5 group"
      style={{ '--stat-color': iconColor } as React.CSSProperties}
    >
      {/* Left color accent bar */}
      <span className="absolute left-0 top-[20%] bottom-[20%] w-[3px] rounded-r-[2px] bg-[var(--stat-color,#00ff88)] shadow-[0_0_8px_var(--stat-color,#00ff88)] opacity-0 group-hover:opacity-70 transition-opacity duration-300" aria-hidden="true" />

      {icon}
      <div className="flex flex-col gap-0.5">
        <span className="text-[clamp(1.3rem,2.5vw,1.7rem)] font-extrabold text-[#fafafa] leading-tight tracking-tight [font-variant-numeric:tabular-nums]">
          {count.toLocaleString()}
          <span className="text-neon-green font-bold">{suffix}</span>
        </span>
        <span className="text-[12px] font-medium text-[#52525b] tracking-wide">{label}</span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main Section
   ───────────────────────────────────────────── */
export default function WhyGymGitSection() {
  return (
    <section className="relative py-24 md:py-28 overflow-hidden bg-transparent" aria-labelledby="why-heading">
      {/* Background grid */}
      <div className="why__grid-bg" aria-hidden="true" />

      {/* Section header */}
      <div className="max-w-nav-max-width mx-auto px-6 lg:px-10 relative z-10 flex flex-col items-center text-center gap-4 mb-14 md:mb-16">
        <SectionBadge />
        <SectionHeadline />
        <SectionSubtitle />
      </div>

      {/* Feature cards grid */}
      <div className="max-w-nav-max-width mx-auto px-6 lg:px-10 relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
        {FEATURES.map((feature, i) => (
          <WhyFeatureCard key={feature.title} {...feature} index={i} />
        ))}
      </div>

      {/* Stats counters row */}
      <div className="max-w-nav-max-width mx-auto px-6 lg:px-10 relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5 mt-12 md:mt-14">
        {STATS.map((stat) => (
          <WhyStatCard key={stat.label} {...stat} />
        ))}
      </div>
    </section>
  );
}
