'use client';

import './WhyGymGitSection.css';
import React, { useEffect, useRef, useState } from 'react';
import {
  Flame,
  BarChart3,
  ClipboardList,
  ShieldCheck,
  Users,
  Dumbbell,
  Clock,
  CalendarCheck,
} from 'lucide-react';

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
    icon: <Flame className="w-5.5 h-5.5" />,
    iconColor: '#f59e0b',
    glowColor: 'rgba(245, 158, 11, 0.25)',
    title: 'GITHUB-STYLE STREAKS',
    description:
      'Streaks that actually motivate. Commit to your plan and keep the flame alive.',
  },
  {
    icon: <BarChart3 className="w-5.5 h-5.5" />,
    iconColor: '#8b5cf6',
    glowColor: 'rgba(139, 92, 246, 0.25)',
    title: 'DEEP PROGRESS INSIGHTS',
    description:
      'Visualize your volume, consistency, and performance over time.',
  },
  {
    icon: <ClipboardList className="w-5.5 h-5.5" />,
    iconColor: '#22d3ee',
    glowColor: 'rgba(34, 211, 238, 0.25)',
    title: 'PLAN & LOG SMARTER',
    description:
      'Structured workout plans with easy logging and auto tracking.',
  },
  {
    icon: <ShieldCheck className="w-5.5 h-5.5" />,
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
    icon: <Users className="w-4.5 h-4.5" />,
    iconColor: '#f59e0b',
    value: 2457,
    suffix: '+',
    label: 'Active Lifters',
  },
  {
    icon: <Dumbbell className="w-4.5 h-4.5" />,
    iconColor: '#8b5cf6',
    value: 18329,
    suffix: '+',
    label: 'Workouts Logged',
  },
  {
    icon: <Clock className="w-4.5 h-4.5" />,
    iconColor: '#22d3ee',
    value: 11250,
    suffix: '+',
    label: 'Hours Tracked',
  },
  {
    icon: <CalendarCheck className="w-4.5 h-4.5" />,
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
    <div className="landing-badge">
      <span className="landing-badge-dot" aria-hidden="true" />
      <span className="landing-badge-text">WHY GYM GIT</span>
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
      <span className="text-gradient-neon">YOU.</span>
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
      className="glass-card why-card flex flex-col items-center text-center px-6 pt-9 pb-8 cursor-default group"
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
        <div className="relative z-10 w-12 h-12 rounded-xl flex items-center justify-center bg-[rgba(24,24,27,0.6)] border border-[rgba(63,63,70,0.4)] transition-all duration-300 group-hover:border-current group-hover:shadow-[0_0_12px_var(--card-glow-color,rgba(0,255,136,0.15))]" style={{ color: iconColor }}>{icon}</div>
      </div>

      <h3 className="text-[12.5px] font-extrabold tracking-wider text-[#e4e4e7] mb-2.5 leading-tight">{title}</h3>
      <p className="text-[13px] leading-relaxed text-[#71717a] m-0 max-w-[220px]">{description}</p>

      {/* Bottom neon accent line */}
      <div className="absolute bottom-0 left-1/2 w-0 h-[2px] rounded-[1px] bg-gradient-to-r from-transparent via-[var(--card-icon-color,#00ff88)] to-transparent shadow-[0_0_10px_var(--card-glow-color,rgba(0,255,136,0.3))] -translate-x-1/2 group-hover:w-[60%] transition-all duration-400 ease-out" aria-hidden="true" />
    </article>
  );
}

/** Animated counter hook */
function useCountUp(target: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    let frame: number;
    const start = performance.now();

    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));

      if (progress < 1) {
        frame = requestAnimationFrame(step);
      }
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [hasStarted, target, duration]);

  return { count, ref };
}

/** Individual stat counter card */
function WhyStatCard({ icon, iconColor, value, suffix, label }: StatCounter) {
  const { count, ref } = useCountUp(value, 2200);

  return (
    <div
      ref={ref}
      className="flex items-center gap-3.5 px-[22px] py-5 rounded-xl border border-[rgba(39,39,42,0.5)] bg-[rgba(14,18,24,0.5)] backdrop-blur-sm relative overflow-hidden transition-all duration-300 hover:border-[rgba(0,255,136,0.12)] hover:shadow-[0_8px_32px_-8px_rgba(0,0,0,0.4)] hover:-translate-y-0.5 group"
      style={{ '--stat-color': iconColor } as React.CSSProperties}
    >
      {/* Left color accent bar */}
      <span className="absolute left-0 top-[20%] bottom-[20%] w-[3px] rounded-r-[2px] bg-[var(--stat-color,#00ff88)] shadow-[0_0_8px_var(--stat-color,#00ff88)] opacity-0 group-hover:opacity-70 transition-opacity duration-300" aria-hidden="true" />

      <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-lg bg-[rgba(24,24,27,0.6)] border border-[rgba(63,63,70,0.4)] transition-all duration-300 group-hover:border-current" style={{ color: iconColor }}>
        {icon}
      </div>
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
      <div className="landing-container relative z-10 flex flex-col items-center text-center gap-4 mb-14 md:mb-16">
        <SectionBadge />
        <SectionHeadline />
        <SectionSubtitle />
      </div>

      {/* Feature cards grid */}
      <div className="landing-container relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
        {FEATURES.map((feature, i) => (
          <WhyFeatureCard key={feature.title} {...feature} index={i} />
        ))}
      </div>

      {/* Stats counters row */}
      <div className="landing-container relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5 mt-12 md:mt-14">
        {STATS.map((stat) => (
          <WhyStatCard key={stat.label} {...stat} />
        ))}
      </div>
    </section>
  );
}
