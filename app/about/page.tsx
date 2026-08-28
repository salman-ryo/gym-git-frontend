'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  GitCommit,
  GitPullRequest,
  GitBranch,
  GitMerge,
  Flame,
  Zap,
  Award,
  Terminal,
  Cpu,
  Layers,
  Database,
  Sparkles,
  ChevronRight,
  Code2,
  CheckCircle2,
  Dumbbell,
  HeartPulse,
  ChevronDown,
  HelpCircle,
  BookOpen,
  Scale,
  RefreshCw,
} from 'lucide-react';
import { LandingBackground } from '@/components/pages/landing';
import { animePowerLevels, AnimePower } from '@/assets/anime';
import { socialLinks } from '@/lib/links';
import { JsonLd, aboutPageJsonLd } from '@/components/seo/JsonLd';

/* ─────────────────────────────────────────────
   Data & Content Specifications
   ───────────────────────────────────────────── */

/** Core Version Control to Fitness Mapping */
interface VCConcept {
  gitTerm: string;
  gitIcon: React.ComponentType<{ className?: string }>;
  gymMeaning: string;
  description: string;
  codeSnippet: string;
}

const VC_CONCEPTS: VCConcept[] = [
  {
    gitTerm: 'git commit',
    gitIcon: GitCommit,
    gymMeaning: 'Daily Workout Session Logged',
    description:
      'Just like saving immutable checkpoints of your codebase, each gym session commits your volume, reps, and exercise splits directly into your permanent training history.',
    codeSnippet: 'gymgit commit -m "feat(chest): 4x10 bench press @ 100kg"',
  },
  {
    gitTerm: 'git push origin main',
    gitIcon: GitBranch,
    gymMeaning: 'Showing Up & Defending Your Streak',
    description:
      'Uncommitted local changes don’t count in production. Pushing to origin represents physically showing up, executing your sets, and defending your active commit streak.',
    codeSnippet: 'gymgit push --streak-defended --status active',
  },
  {
    gitTerm: 'Pull Request (PR)',
    gitIcon: GitPullRequest,
    gymMeaning: 'Personal Record Broken',
    description:
      'In software, a PR proposes an upgrade to master. In Gym-Git, a PR represents breaking through plateaus—heavier loads, cleaner form, or more total volume.',
    codeSnippet: 'PR #42 Merged: Squat 1RM increased from 140kg -> 145kg',
  },
  {
    gitTerm: 'git diff',
    gitIcon: Scale,
    gymMeaning: 'Progressive Overload & Volume Delta',
    description:
      'Visualize exact deltas in training tonnage, workout duration, and rep cadence compared to previous cycles to ensure progressive overload.',
    codeSnippet: '+ 1,250 kg weekly volume delta | +5.2% efficiency',
  },
  {
    gitTerm: 'Branch Merges',
    gitIcon: GitMerge,
    gymMeaning: '7-Day Plan Cycle Completion',
    description:
      'Each 7-Day Plan Cycle is a temporary feature branch. When you complete your target workouts and strategic rest days, your cycle merges cleanly into your annual roadmap.',
    codeSnippet: 'Branch cycle/2026-w34 merged cleanly with 100% split accuracy',
  },
  {
    gitTerm: 'Merge Conflicts',
    gitIcon: RefreshCw,
    gymMeaning: 'Overtraining / Unplanned Missed Days',
    description:
      'Skipping recovery or missing days without using a Rest Token creates conflict. Gym-Git’s fault-tolerant engine helps resolve conflicts via Restores and Freezes.',
    codeSnippet: 'Conflict resolved: Rest Token applied to preserve streak',
  },
];

/** 4 Core Architectural Pillars */
interface ArchitecturePillar {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  formula?: string;
  capabilities: { title: string; desc: string }[];
}

const ARCHITECTURE_PILLARS: ArchitecturePillar[] = [
  {
    id: 'heatmap-engine',
    icon: GitCommit,
    accentColor: '#00ff88',
    badge: 'VISUAL CONSISTENCY',
    title: 'The GitHub-Style Heatmap Engine',
    subtitle: 'Multi-View Visualizer: Year, Month & Week',
    description:
      'The human brain is wired for visual pattern recognition. Gym-Git harnesses the powerful psychological motivation of GitHub’s green contribution matrix to turn fitness consistency into a compelling daily visual feedback loop.',
    capabilities: [
      {
        title: 'Multi-Scale Views',
        desc: 'Seamlessly switch between full 52-week Annual overviews, high-density Monthly calendars, and detailed Day-by-Day Weekly tracking.',
      },
      {
        title: 'Dynamic Intensity Ramping',
        desc: 'Heatmap tiles scale dynamically across 4 green saturation levels based on workout duration, volume tonnage, and exercise count.',
      },
      {
        title: 'Integrated State Encoding',
        desc: 'Distinct visual tiles for active training sessions (emerald glow), Ice Pause freezes (cyan frost), scheduled Rest Tokens (slate), and missed days.',
      },
    ],
  },
  {
    id: 'power-algorithm',
    icon: Zap,
    accentColor: '#22d3ee',
    badge: 'SCIENTIFIC FORMULA',
    title: 'The Scientific Power Score (0–100)',
    subtitle: 'Multi-Factor Algorithmic Performance Index',
    description:
      'Unlike arbitrary workout apps that reward only raw minutes, Gym-Git implements a scientifically weighted algorithm that balances consistency, total duration, split variety, and momentum.',
    formula: 'Power Score = Consistency(45) + Duration(25) + Variety(20) + Momentum(10)',
    capabilities: [
      {
        title: 'Consistency Index (45 PTS)',
        desc: 'Calculates the ratio of completed workouts against your target weekly frequency. Prevents burnout by rewarding adherence over overtraining.',
      },
      {
        title: 'Duration & Quality Index (25 PTS)',
        desc: 'Evaluates time under tension and total session minutes within the optimal hypertrophy/endurance window (45–90 minutes).',
      },
      {
        title: 'Split Variety Index (20 PTS)',
        desc: 'Analyzes target muscle distribution across Push, Pull, Legs, and Core to prevent muscle imbalances and encourage holistic training.',
      },
      {
        title: 'Streak Momentum Index (10 PTS)',
        desc: 'Bonus multiplier awarded for uninterrupted weekly cycle completions and adherence to scheduled rest tokens.',
      },
    ],
  },
  {
    id: 'anti-burnout',
    icon: HeartPulse,
    accentColor: '#a855f7',
    badge: 'FAULT TOLERANCE',
    title: 'Anti-Burnout & Sickness Vault',
    subtitle: 'Biological Recovery Is Part of the Architecture',
    description:
      'Toxic fitness apps punish users for getting sick or taking a rest day, causing demoralization and complete drop-off. Gym-Git treats recovery as a first-class engineering requirement.',
    capabilities: [
      {
        title: 'Rest Tokens Economy',
        desc: 'Each 7-Day Plan Cycle allocates 1–3 Rest Tokens based on your chosen split. Taking a scheduled rest day preserves your active streak intact.',
      },
      {
        title: 'Sickness Vault ("Ice Pause")',
        desc: 'When illness, travel, or deload weeks occur, activate the Ice Pause vault to freeze your streak and Power Score safely without penalty.',
      },
      {
        title: 'Streak Broken Recovery Protocol',
        desc: 'Life happens. If a streak lapses, Gym-Git provides a recovery challenge to reclaim your streak momentum instead of forcing a reset to day 1.',
      },
    ],
  },
  {
    id: 'rpg-inventory',
    icon: Award,
    accentColor: '#f59e0b',
    badge: 'GAMIFIED REWARDS',
    title: 'Master Item Inventory & RPG Loot',
    subtitle: 'Collect, Equip, and Level Up Your Training',
    description:
      'Every workout commit and streak milestone has a calculated drop rate for Master RPG items. Items provide unique passive boosts, milestone badges, and cosmetic flair.',
    capabilities: [
      {
        title: '5 Rarity Tiers',
        desc: 'Common (Slate), Uncommon (Emerald), Rare (Cyan), Epic (Purple), and Legendary (Golden Amber) items with distinctive glowing card borders.',
      },
      {
        title: 'Dynamic Milestone Roadmap',
        desc: 'Progress along an infinite roadmap unlocking custom anime avatars, power level multipliers, and streak shield consumable tokens.',
      },
      {
        title: 'Active Effects Bar',
        desc: 'Equip collected artifacts to boost power score gain rates, unlock special cutscene dialogue, or protect against missed day penalties.',
      },
    ],
  },
];

/** Tech Stack Engineering Items */
interface StackItem {
  name: string;
  category: string;
  role: string;
  details: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
}

const TECH_STACK: StackItem[] = [
  {
    name: 'Next.js 16 (App Router)',
    category: 'Frontend Framework',
    role: 'Server & Client Component Architecture',
    details:
      'Leverages React 19 concurrent features, streaming SSR, and edge rendering for lightning-fast sub-50ms page transitions and instant offline UI responsiveness.',
    icon: Layers,
    accentColor: '#00ff88',
  },
  {
    name: 'Go / Gin REST API',
    category: 'Backend Microservice',
    role: 'High-Throughput Streak & Scoring Engine',
    details:
      'Written in Go for sub-millisecond execution times. Handles streak validation, cryptographic session validation, and complex mathematical score algorithms with zero overhead.',
    icon: Cpu,
    accentColor: '#22d3ee',
  },
  {
    name: 'Supabase Auth & PostgreSQL',
    category: 'Database & Security',
    role: 'HttpOnly SSR Cookie Sessions & Row Level Security',
    details:
      'Bank-grade authentication with HttpOnly session cookies, granular Row Level Security (RLS) policies, and encrypted multi-region database redundancy.',
    icon: Database,
    accentColor: '#38bdf8',
  },
  {
    name: 'Tailwind CSS v4 (@theme inline)',
    category: 'Styling & Design System',
    role: 'Hardware-Accelerated Cyberpunk Theme',
    details:
      'Tailwind CSS v4 with modern CSS variables, OKLCH color spaces, glassmorphism backdrops, and hardware-accelerated 60fps animations.',
    icon: Sparkles,
    accentColor: '#a855f7',
  },
];

/** Comprehensive FAQ */
interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const FAQS: FAQItem[] = [
  {
    category: 'General',
    question: 'What is Gym-Git and why was it created?',
    answer:
      'Gym-Git is an open-source, developer-first fitness tracker that bridges the mental discipline of software engineering with physical resistance training. It was created because traditional workout apps treat logging as a chore rather than a visual art form. By visualizing workouts as GitHub-style commits on an annual heatmap and mapping consistency to anime power levels, Gym-Git turns workout adherence into an addictive, rewarding habit.',
  },
  {
    category: 'Mechanics',
    question: 'How is Gym-Git different from Hevy, Strong, or Strava?',
    answer:
      'While apps like Hevy or Strong focus primarily on raw set/rep logging and Strava focuses on GPS cardio, Gym-Git is built around consistency architecture. Gym-Git incorporates: (1) GitHub-style contribution heatmaps with multi-level volume intensity, (2) A scientific 0–100 Power Score algorithm that prevents burnout, (3) 11 Anime RPG progression ranks, (4) Rest Tokens and an "Ice Pause" Sickness Vault that protect streaks during recovery, and (5) An RPG item inventory loot system.',
  },
  {
    category: 'Algorithm',
    question: 'How does the Scientific Power Score algorithm calculate my tier?',
    answer:
      'The Gym Power Score is calculated across 4 weighted pillars on a 0–100 scale: Consistency Index (45 PTS for hitting target split days), Duration Index (25 PTS for optimal 45–90 min session quality), Variety Index (20 PTS for balanced muscle group coverage), and Momentum Index (10 PTS for streak continuity). Your score directly determines your monthly Anime Hero Tier (from Mumen Rider up to Zoro, Gojo, and Goku).',
  },
  {
    category: 'Recovery',
    question: 'What happens if I get sick, travel, or need a rest day?',
    answer:
      'Gym-Git is anti-burnout by design. You receive customizable Rest Tokens in every 7-Day Plan Cycle (e.g. 2 rest days for a 5-day split), which preserve your streak. If you get sick or travel, you can activate the "Ice Pause" Sickness Vault to freeze your account and streak safely without penalty until you return to the gym.',
  },
  {
    category: 'Privacy & Cost',
    question: 'Is Gym-Git free and how is my personal workout data protected?',
    answer:
      'Gym-Git is 100% free to use. We adhere to a strict privacy-first philosophy: zero advertisements, zero tracking telemetry, and zero selling of biometric or workout data to third-party brokers. All user sessions are secured via Supabase Auth with HttpOnly SSR cookies and PostgreSQL Row Level Security (RLS).',
  },
  {
    category: 'Customization',
    question: 'Can I customize my workout split and training schedule?',
    answer:
      'Yes! Gym-Git supports classic splits like Push/Pull/Legs (PPL), Upper/Lower, Bro Splits, Full Body, and fully custom 7-Day Plan schedules. You can assign specific muscle targets, rest token days, and volume goals to fit your exact training protocol.',
  },
];

/** Knowledge Graph / Glossary Terms for LLM & SEO */
interface GlossaryTerm {
  term: string;
  definition: string;
}

const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    term: 'Workout Commit',
    definition:
      'An immutable record of a completed gym session containing exercises, sets, reps, weight volume, and duration, visualized as a colored tile on the contribution graph.',
  },
  {
    term: 'Contribution Heatmap',
    definition:
      'A 52-week grid representation of your yearly fitness journey. Tiles glow in varying shades of emerald green based on daily workout intensity and volume tonnage.',
  },
  {
    term: 'Gym Power Score',
    definition:
      'A scientific 0–100 algorithmic index measuring 40-day rolling consistency (45%), workout duration quality (25%), muscle split variety (20%), and streak momentum (10%).',
  },
  {
    term: 'Anime Hero Tier',
    definition:
      'One of 11 gamified RPG status ranks (ranging from Aqua and Mumen Rider to Zoro, Gojo, and Goku) unlocked dynamically based on your current Power Score.',
  },
  {
    term: 'Rest Token',
    definition:
      'A strategic allowance within a 7-Day Plan Cycle that marks an intentional recovery day, preserving active streak momentum without requiring a gym visit.',
  },
  {
    term: 'Ice Pause (Sickness Vault)',
    definition:
      'A freeze state that temporarily locks your active streak, power score, and cycle timers during illness, medical recovery, or deload travel.',
  },
  {
    term: '7-Day Plan Cycle',
    definition:
      'A continuous 7-day feature branch where lifters execute a predefined weekly split (e.g. PPL, Upper/Lower) with automated split accuracy tracking.',
  },
  {
    term: 'Master Item Inventory',
    definition:
      'An RPG collectible system where lifters receive procedural item drops (Common to Legendary) for achieving milestones, logging workouts, and maintaining streaks.',
  },
];

/* ─────────────────────────────────────────────
   Main About Page Component
   ───────────────────────────────────────────── */
export default function AboutPage() {
  const [selectedCharacter, setSelectedCharacter] = useState<AnimePower>(animePowerLevels[6]); // Default: Zoro
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="min-h-screen bg-[#060a0e] text-[#fafafa] flex flex-col items-center p-4 sm:p-6 md:p-10 relative overflow-hidden selection:bg-neon-green/20 selection:text-neon-green font-sans">
      {/* ── JSON-LD Structured Metadata for SEO & LLMs ── */}
      <JsonLd data={aboutPageJsonLd} />

      {/* ── Animated Cyberpunk Background ── */}
      <LandingBackground />

      {/* ── Aesthetic Background Watermarks (Preserved from Login Page) ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]" aria-hidden="true">
        {/* Large Dumbbell - Bottom Left */}
        <div className="absolute -bottom-32 -left-32 w-[550px] h-[550px] opacity-15 -rotate-[30deg] mix-blend-screen filter drop-shadow-[0_0_40px_rgba(0,255,136,0.15)]">
          <Image
            src="/images/ggdumbell.webp"
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 550px"
            className="object-contain"
            priority
          />
        </div>

        {/* Large Git Tree - Top Right */}
        <div className="absolute -top-28 -right-20 w-[650px] h-[650px] opacity-15 rotate-[15deg] mix-blend-screen filter drop-shadow-[0_0_40px_rgba(34,211,238,0.15)]">
          <Image
            src="/images/gggit.webp"
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 650px"
            className="object-contain"
            priority
          />
        </div>

        {/* Small Dumbbell - Mid Left */}
        <div className="absolute top-[35%] -left-24 w-[260px] h-[260px] opacity-10 rotate-[45deg] mix-blend-screen hidden xl:block">
          <Image
            src="/images/ggdumbell.webp"
            alt=""
            fill
            sizes="260px"
            className="object-contain"
          />
        </div>

        {/* Small Git Tree - Mid Right */}
        <div className="absolute top-[55%] -right-24 w-[320px] h-[320px] opacity-10 -rotate-[20deg] mix-blend-screen hidden xl:block">
          <Image
            src="/images/gggit.webp"
            alt=""
            fill
            sizes="320px"
            className="object-contain"
          />
        </div>
      </div>

      {/* ── Top Navigation Bar: Quick Return & System Badge ── */}
      <header className="w-full max-w-5xl flex items-center justify-between mb-8 relative z-10 px-2" role="banner">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-medium text-[#a1a1aa] hover:text-[#00ff88] transition-colors group no-underline"
          aria-label="Back to Gym-Git Landing Page"
        >
          <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />
          <span>Back to Landing</span>
        </Link>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-neon-green/20 bg-neon-green/5 backdrop-blur-md shadow-[0_0_15px_rgba(0,255,136,0.1)]">
          <span className="w-2 h-2 rounded-full bg-neon-green shadow-[0_0_10px_#00ff88] animate-[badge-pulse_2s_ease-in-out_infinite]" aria-hidden="true" />
          <span className="text-[11px] font-extrabold tracking-wider text-neon-green uppercase">
            SYSTEM MANIFESTO // v2.0
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-[#080c10] rounded-lg bg-gradient-to-r from-neon-green to-[#00e077] hover:shadow-[0_0_15px_rgba(0,255,136,0.4)] transition-all no-underline"
          >
            <span>Sign In</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* ── Main Semantic Container ── */}
      <main className="w-full max-w-5xl flex flex-col gap-12 sm:gap-14 relative z-10" role="main">

        {/* ── 1. Hero / Header Glassmorphic Cyber Card ── */}
        <section className="w-full bg-[#080c10]/85 border border-[rgba(0,255,136,0.18)] backdrop-blur-2xl rounded-3xl p-6 sm:p-10 md:p-12 shadow-[0_0_60px_-15px_rgba(0,255,136,0.15),0_20px_50px_rgba(0,0,0,0.85)] relative overflow-hidden" aria-labelledby="hero-heading">
          {/* Top Glow Accent Bar */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-neon-green via-neon-cyan to-transparent opacity-90" aria-hidden="true" />

          {/* Ambient Corner Light Orbs */}
          <div className="absolute -top-24 -left-24 w-56 h-56 bg-neon-green/10 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
          <div className="absolute -bottom-24 -right-24 w-56 h-56 bg-neon-purple/15 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-neon-cyan/5 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />

          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 relative z-10">
            {/* Logo Badge */}
            <div className="relative flex-shrink-0">
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-3xl overflow-hidden p-0.5 bg-gradient-to-br from-neon-green/40 via-neon-cyan/30 to-neon-purple/40 shadow-[0_0_35px_rgba(0,255,136,0.25)] group">
                <div className="w-full h-full bg-[#080c10] rounded-[22px] flex items-center justify-center overflow-hidden p-2">
                  <Image
                    src="/web-app-manifest-192x192.png"
                    alt="Gym-Git Logo Mark"
                    width={120}
                    height={120}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    priority
                  />
                </div>
              </div>
              <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-[#060a0e] border border-neon-green/40 text-[9.5px] font-black text-neon-green tracking-wider uppercase shadow-[0_0_10px_rgba(0,255,136,0.2)]">
                SPEC-v2.0
              </div>
            </div>

            {/* Headline & Overview */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                <span className="text-2xl sm:text-3xl font-black tracking-wider text-[#e4e4e7]">GYM</span>
                <span className="text-2xl sm:text-3xl font-black tracking-wider bg-gradient-to-br from-neon-green via-[#00e077] to-neon-cyan bg-clip-text text-transparent">
                  GIT
                </span>
                <span className="text-xs px-2 py-0.5 rounded-md border border-zinc-700 bg-zinc-800/60 text-zinc-400 font-mono">
                  about:system-manifesto
                </span>
              </div>

              <h1 id="hero-heading" className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-4 leading-tight">
                The GitHub-Style Fitness Tracker &amp; Conditioning Protocol
              </h1>

              <p className="text-zinc-300 text-sm sm:text-base leading-relaxed max-w-2xl mb-6">
                Gym-Git bridges the mental discipline and version-control rigor of software engineering with physical human conditioning. By transforming everyday workouts into code-like commits on an annual heatmap, lifters and developers build unbreakable streaks, level up their anime power rating, and track progressive overload with mathematical precision.
              </p>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                <div className="flex items-center gap-1.5 text-xs text-zinc-200 px-3.5 py-1.5 rounded-xl bg-zinc-900/70 border border-zinc-700">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  <span className="font-semibold">GitHub Heatmap Streaks</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-zinc-200 px-3.5 py-1.5 rounded-xl bg-zinc-900/70 border border-zinc-700">
                  <Zap className="w-3.5 h-3.5 text-neon-cyan" />
                  <span className="font-semibold">Scientific Power Scoring (0–100)</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-zinc-200 px-3.5 py-1.5 rounded-xl bg-zinc-900/70 border border-zinc-700">
                  <Award className="w-3.5 h-3.5 text-neon-purple" />
                  <span className="font-semibold">11 Anime Hero Ranks</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-zinc-200 px-3.5 py-1.5 rounded-xl bg-zinc-900/70 border border-zinc-700">
                  <HeartPulse className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="font-semibold">Sickness Vault Freezes</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 2. The Version Control Paradigm for Fitness ── */}
        <section className="space-y-6" aria-labelledby="vc-paradigm-heading">
          <div className="text-center md:text-left flex flex-col gap-1">
            <div className="inline-flex items-center gap-1.5 self-center md:self-start text-[11px] font-extrabold text-neon-green tracking-wider uppercase">
              <GitBranch className="w-3.5 h-3.5" />
              <span>THE CORE PHILOSOPHY</span>
            </div>
            <h2 id="vc-paradigm-heading" className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Version Control For Physical Human Strength
            </h2>
            <p className="text-zinc-400 text-sm max-w-2xl">
              Software engineers spend years mastering Git workflows—branching, committing changes, reviewing pull requests, and maintaining production uptime. Gym-Git maps these battle-tested concepts directly onto resistance training.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {VC_CONCEPTS.map((concept) => {
              const Icon = concept.gitIcon;
              return (
                <article
                  key={concept.gitTerm}
                  className="bg-[#080c10]/85 border border-zinc-800 hover:border-neon-green/30 rounded-2xl p-5 sm:p-6 backdrop-blur-xl flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.6)] group relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-neon-green/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden="true" />

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <code className="text-xs font-mono font-bold text-neon-green px-2.5 py-1 rounded-md bg-neon-green/10 border border-neon-green/20">
                        {concept.gitTerm}
                      </code>
                      <div className="w-8 h-8 rounded-lg bg-zinc-800/80 text-zinc-400 group-hover:text-neon-green group-hover:bg-neon-green/10 flex items-center justify-center transition-colors">
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>

                    <h3 className="text-sm font-bold text-white mb-2">{concept.gymMeaning}</h3>
                    <p className="text-xs text-zinc-400 leading-relaxed mb-4">{concept.description}</p>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#05080c] border border-zinc-800/80 font-mono text-[10.5px] text-zinc-400 truncate">
                    <span className="text-neon-cyan select-none">$ </span>
                    <span>{concept.codeSnippet}</span>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* ── 3. Interactive / Cyberpunk Terminal Simulation ── */}
        <section className="w-full bg-[#05080c]/90 border border-zinc-800/90 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl relative" aria-label="Simulated Gym-Git CLI Terminal">
          {/* Terminal Title Bar */}
          <div className="bg-[#0c1017] px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80 shadow-[0_0_6px_rgba(239,68,68,0.5)]" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80 shadow-[0_0_6px_rgba(234,179,8,0.5)]" />
              <div className="w-3 h-3 rounded-full bg-green-500/80 shadow-[0_0_6px_rgba(34,197,94,0.5)]" />
              <span className="ml-2 text-xs font-mono text-zinc-400 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-neon-green" />
                terminal — gymgit-cli v2.0.4 [production]
              </span>
            </div>
            <span className="text-[11px] font-mono text-zinc-500 hidden sm:inline">
              UTF-8 • go-backend:8080 • latency: 2.1ms
            </span>
          </div>

          {/* Terminal Screen Content */}
          <div className="p-5 sm:p-6 font-mono text-xs sm:text-sm text-zinc-300 space-y-3 overflow-x-auto leading-relaxed">
            <div className="flex items-center gap-2 text-zinc-500">
              <span># Logging session via Gym-Git CLI wrapper to Go microservice</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-neon-green select-none">$</span>
              <span className="text-white">
                gymgit commit --split <span className="text-neon-cyan">&quot;Push Day A&quot;</span> --duration <span className="text-amber-400">75m</span> --tonnage <span className="text-purple-300">14250kg</span> -m <span className="text-emerald-300">&quot;feat(chest): hit new bench PR 100kg x 5&quot;</span>
              </span>
            </div>
            <div className="text-zinc-400 pl-4 border-l-2 border-neon-green/30 space-y-1.5">
              <p className="text-neon-green font-semibold">
                [main 8f19c3b] feat(chest): hit new bench PR 100kg x 5 (14,250 kg total volume)
              </p>
              <p className="text-zinc-300">
                &bull; Exercises Logged: Barbell Bench Press (4x5), Incline Dumbbell Press (3x10), Cable Flyes (3x12), Tricep Dips (3x15)
              </p>
              <p className="text-zinc-300">
                &bull; Heatmap Contribution: <span className="text-neon-green font-bold">Level 4 Tile Committed</span> on 2026-08-28 (Annual Grid Updated)
              </p>
              <p className="text-zinc-300">
                &bull; Streak Continuity: <span className="text-orange-400 font-bold">14 Days Active 🔥</span> | Rest Tokens Remaining: <span className="text-emerald-400 font-bold">2/2</span>
              </p>
              <p className="text-zinc-300">
                &bull; Scientific Power Score: <span className="text-neon-cyan font-bold">88 / 100 PTS</span> &rarr; Character Rank: <span className="text-purple-400 font-bold">Roronoa Zoro Tier ⚔️</span>
              </p>
              <p className="text-amber-300">
                &bull; Master Loot Drop: <span className="text-amber-400 font-bold">[Legendary] Hyperbolic Time Chamber Token</span> added to Master Item Inventory!
              </p>
            </div>
            <div className="flex items-center gap-2 pt-1 text-zinc-500">
              <span className="text-neon-green">$</span>
              <span className="animate-pulse">_</span>
            </div>
          </div>
        </section>

        {/* ── 4. The 4 Core Architectural Systems ── */}
        <section className="space-y-8" aria-labelledby="architecture-heading">
          <div className="text-center md:text-left flex flex-col gap-1">
            <div className="inline-flex items-center gap-1.5 self-center md:self-start text-[11px] font-extrabold text-neon-cyan tracking-wider uppercase">
              <Code2 className="w-3.5 h-3.5" />
              <span>THE 4 CORE ENGINES</span>
            </div>
            <h2 id="architecture-heading" className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Under The Hood: The Gym-Git System Architecture
            </h2>
            <p className="text-zinc-400 text-sm max-w-2xl">
              Engineered with production-grade algorithms designed to eliminate the psychological friction and guilt typical of traditional fitness apps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ARCHITECTURE_PILLARS.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <article
                  key={pillar.id}
                  className="bg-[#080c10]/85 border border-zinc-800 hover:border-zinc-700 rounded-3xl p-6 sm:p-8 flex flex-col justify-between backdrop-blur-2xl shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
                >
                  <div
                    className="absolute top-0 left-0 right-0 h-[2px]"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${pillar.accentColor}, transparent)`,
                    }}
                    aria-hidden="true"
                  />

                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <span
                        className="text-[10.5px] font-black tracking-wider uppercase px-3 py-1 rounded-full border"
                        style={{
                          color: pillar.accentColor,
                          borderColor: `${pillar.accentColor}33`,
                          backgroundColor: `${pillar.accentColor}11`,
                        }}
                      >
                        {pillar.badge}
                      </span>
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{
                          backgroundColor: `${pillar.accentColor}15`,
                          color: pillar.accentColor,
                          boxShadow: `0 0 15px ${pillar.accentColor}22`,
                        }}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold text-white mb-1">{pillar.title}</h3>
                    <h4 className="text-xs font-semibold text-zinc-400 mb-3">{pillar.subtitle}</h4>
                    <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mb-4">{pillar.description}</p>

                    {pillar.formula && (
                      <div className="p-3 rounded-xl bg-[#05080c] border border-neon-cyan/20 font-mono text-xs text-neon-cyan mb-4">
                        <span className="text-zinc-500 block text-[10px] uppercase font-bold mb-1">Scientific Formula:</span>
                        {pillar.formula}
                      </div>
                    )}
                  </div>

                  {/* Capabilities List */}
                  <div className="space-y-3 pt-4 border-t border-zinc-800/60">
                    {pillar.capabilities.map((cap, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-zinc-300">
                        <CheckCircle2
                          className="w-4 h-4 shrink-0 mt-0.5"
                          style={{ color: pillar.accentColor }}
                        />
                        <div>
                          <strong className="text-white font-semibold">{cap.title}: </strong>
                          <span className="text-zinc-400">{cap.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
        </section>


        {/* ── 6. Technical Stack & Infrastructure Specification ── */}
        <section className="space-y-6" aria-labelledby="tech-stack-heading">
          <div className="text-center md:text-left flex flex-col gap-1">
            <div className="inline-flex items-center gap-1.5 self-center md:self-start text-[11px] font-extrabold text-neon-green tracking-wider uppercase">
              <Cpu className="w-3.5 h-3.5" />
              <span>PRODUCTION INFRASTRUCTURE</span>
            </div>
            <h2 id="tech-stack-heading" className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Engineered For Speed, Security &amp; Data Sovereignty
            </h2>
            <p className="text-zinc-400 text-sm max-w-2xl">
              Gym-Git is constructed with the modern enterprise web stack. We don&apos;t compromise on type safety, latency, or encryption.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {TECH_STACK.map((item) => {
              const TechIcon = item.icon;
              return (
                <div
                  key={item.name}
                  className="p-5 rounded-2xl bg-[#080c10]/85 border border-zinc-800 hover:border-zinc-700 backdrop-blur-md flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 group"
                >
                  <div>
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center mb-3 transition-transform group-hover:scale-110"
                      style={{
                        backgroundColor: `${item.accentColor}15`,
                        color: item.accentColor,
                      }}
                    >
                      <TechIcon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block mb-1">
                      {item.category}
                    </span>
                    <h3 className="text-sm font-bold text-white mb-1">{item.name}</h3>
                    <h4 className="text-[11px] font-medium text-neon-green mb-2">{item.role}</h4>
                    <p className="text-xs text-zinc-400 leading-relaxed">{item.details}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── 7. Comprehensive FAQ Section (SEO & LLM Optimized) ── */}
        <section className="space-y-6" aria-labelledby="faq-heading">
          <div className="text-center md:text-left flex flex-col gap-1">
            <div className="inline-flex items-center gap-1.5 self-center md:self-start text-[11px] font-extrabold text-neon-purple tracking-wider uppercase">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>FREQUENTLY ASKED QUESTIONS</span>
            </div>
            <h2 id="faq-heading" className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Everything You Need To Know About Gym-Git
            </h2>
            <p className="text-zinc-400 text-sm max-w-2xl">
              Common questions answered for lifters, software engineers, and automated search agents.
            </p>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={faq.question}
                  className="rounded-2xl border border-zinc-800 bg-[#080c10]/80 overflow-hidden backdrop-blur-xl transition-colors hover:border-zinc-700"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                    aria-expanded={isOpen}
                  >
                    <span className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-neon-green" aria-hidden="true" />
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-zinc-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-neon-green' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-xs sm:text-sm text-zinc-300 leading-relaxed border-t border-zinc-800/60 pt-4">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ── 8. LLM Knowledge Graph & Definitions Glossary ── */}
        <section className="bg-[#080c10]/80 border border-zinc-800/80 rounded-3xl p-6 sm:p-8 backdrop-blur-xl" aria-labelledby="glossary-heading">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-4 h-4 text-neon-green" />
            <h2 id="glossary-heading" className="text-lg sm:text-xl font-bold text-white tracking-tight">
              Gym-Git System Glossary &amp; Entity Ontology
            </h2>
          </div>
          <p className="text-xs text-zinc-400 mb-6 max-w-2xl">
            Formal terminology and system entities utilized across the Gym-Git application ecosystem and API endpoints.
          </p>

          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {GLOSSARY_TERMS.map((item) => (
              <div key={item.term} className="p-3.5 rounded-xl bg-[#05080c] border border-zinc-800/80">
                <dt className="font-bold text-neon-green mb-1">{item.term}</dt>
                <dd className="text-zinc-400 leading-relaxed m-0">{item.definition}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* ── 9. Final Cyberpunk Call-To-Action Card ── */}
        <section className="w-full bg-gradient-to-b from-[#080c10]/90 to-[#05080c]/95 border border-[rgba(0,255,136,0.25)] rounded-3xl p-8 sm:p-12 text-center backdrop-blur-2xl shadow-[0_0_50px_rgba(0,255,136,0.15)] relative overflow-hidden" aria-label="Get Started CTA">
          {/* Top Glow bar */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-neon-green via-neon-cyan to-transparent" aria-hidden="true" />

          {/* Ambient Glow */}
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-neon-green/10 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />

          <div className="max-w-2xl mx-auto space-y-5 relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-neon-green/20 bg-neon-green/5 text-neon-green text-[11px] font-black tracking-wider uppercase">
              <Dumbbell className="w-3.5 h-3.5" />
              READY TO COMMIT TO PRODUCTION?
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Stop Skipping. Start Committing.
            </h2>

            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
              Create your developer lifter profile in seconds. Build the streak of your life with the tools engineered for relentless consistency and progressive overload.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                href="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3.5 px-8 text-sm font-extrabold text-[#080c10] rounded-xl bg-gradient-to-r from-neon-green via-[#00e077] to-neon-cyan shadow-[0_0_25px_rgba(0,255,136,0.35)] hover:shadow-[0_0_35px_rgba(0,255,136,0.55)] hover:-translate-y-0.5 hover:scale-[1.02] active:translate-y-0 transition-all duration-200 no-underline group cursor-pointer"
              >
                <span>Initialize Your Account &amp; Start</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>

              <a
                href={socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3.5 px-6 text-sm font-semibold text-zinc-300 hover:text-white rounded-xl bg-zinc-900/60 border border-zinc-700 hover:border-neon-green/40 hover:bg-neon-green/5 transition-all duration-200 no-underline"
              >
                <span>Star on GitHub</span>
              </a>
            </div>

            {/* Trust footer note */}
            <div className="flex items-center justify-center gap-2 text-xs text-zinc-500 pt-4">
              <ShieldCheck className="w-4 h-4 text-neon-green" />
              <span>Encrypted Session &bull; Supabase Auth &bull; 100% Free &amp; Open Source</span>
            </div>
          </div>
        </section>

      </main>

      {/* ── Page Footer Note ── */}
      <footer className="w-full max-w-5xl text-center text-xs text-zinc-600 mt-12 mb-4 relative z-10" role="contentinfo">
        Gym-Git &copy; {new Date().getFullYear()} &bull; GitHub-Style Workout Tracking &bull; Built with Next.js 16, Tailwind CSS v4, and Go/Gin
      </footer>
    </div>
  );
}
