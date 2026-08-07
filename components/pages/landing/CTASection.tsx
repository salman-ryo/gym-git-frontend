'use client';

import './CTASection.css';
import React from 'react';
import Link from 'next/link';
import { ArrowRight, GitCommit, ShieldCheck, Zap } from 'lucide-react';

/** Glowing Git Branch / Commit Tree SVG Graphic for the Left Side */
function GitCommitTreeGraphic() {
  return (
    <div className="relative w-[260px] h-[260px] lg:w-[280px] lg:h-[280px] flex items-center justify-center group" aria-hidden="true">
      <div className="absolute top-[10%] right-[10%] w-[140px] h-[140px] bg-[#a855f7]/25 blur-[35px] rounded-full" />
      <div className="absolute bottom-[10%] left-[10%] w-[140px] h-[140px] bg-[#00ff88]/20 blur-[35px] rounded-full" />

      <svg
        className="relative z-10 w-full h-full filter drop-shadow-[0_0_12px_rgba(0,255,136,0.2)]"
        viewBox="0 0 280 280"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background Grid Lines inside Graphic */}
        <path
          d="M20 40H260M20 100H260M20 160H260M20 220H260"
          stroke="rgba(255, 255, 255, 0.03)"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
        <path
          d="M40 20V260M100 20V260M160 20V260M220 20V260"
          stroke="rgba(255, 255, 255, 0.03)"
          strokeWidth="1"
          strokeDasharray="4 4"
        />

        {/* Main Branch Trunk (Green) */}
        <path
          d="M70 240V40"
          stroke="url(#trunk-gradient)"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Feature Branch 1 (Cyan) */}
        <path
          d="M70 180 C 130 180, 130 120, 170 120 H 220"
          stroke="url(#cyan-branch)"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Feature Branch 2 (Purple) */}
        <path
          d="M70 120 C 120 120, 140 60, 190 60"
          stroke="url(#purple-branch)"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Merge Line back to Trunk */}
        <path
          d="M220 120 C 240 120, 240 40, 70 40"
          stroke="rgba(0, 255, 136, 0.4)"
          strokeWidth="2"
          strokeDasharray="4 4"
        />

        {/* Commit Nodes */}
        {/* Node 1 - Base Commit */}
        <g className="cta-node cta-node--pulse">
          <circle cx="70" cy="220" r="10" fill="#060a0e" stroke="#00ff88" strokeWidth="3" />
          <circle cx="70" cy="220" r="4" fill="#00ff88" />
        </g>

        {/* Node 2 - Mid Trunk */}
        <g className="cta-node">
          <circle cx="70" cy="150" r="8" fill="#060a0e" stroke="#00ff88" strokeWidth="2.5" />
          <circle cx="70" cy="150" r="3" fill="#00ff88" />
        </g>

        {/* Node 3 - Cyan Branch */}
        <g className="cta-node cta-node--pulse">
          <circle cx="170" cy="120" r="9" fill="#060a0e" stroke="#22d3ee" strokeWidth="2.5" />
          <circle cx="170" cy="120" r="3.5" fill="#22d3ee" />
        </g>

        {/* Node 4 - Purple Branch */}
        <g className="cta-node">
          <circle cx="190" cy="60" r="9" fill="#060a0e" stroke="#a855f7" strokeWidth="2.5" />
          <circle cx="190" cy="60" r="3.5" fill="#a855f7" />
        </g>

        {/* Node 5 - Main Head (Pulsing Green) */}
        <g className="cta-node cta-node--pulse">
          <circle cx="70" cy="50" r="12" fill="#060a0e" stroke="#00ff88" strokeWidth="3" />
          <circle cx="70" cy="50" r="5" fill="#00ff88" />
        </g>

        {/* Gradients */}
        <defs>
          <linearGradient id="trunk-gradient" x1="70" y1="240" x2="70" y2="40" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#00ff88" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#00ff88" stopOpacity="1" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="1" />
          </linearGradient>

          <linearGradient id="cyan-branch" x1="70" y1="180" x2="220" y2="120" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#00ff88" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>

          <linearGradient id="purple-branch" x1="70" y1="120" x2="190" y2="60" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#00ff88" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
        </defs>
      </svg>

      {/* Floating Pill Badges */}
      <div className="absolute z-20 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#121822]/85 border border-white/12 backdrop-blur-sm text-[11px] font-semibold text-zinc-300 shadow-[0_4px_16px_rgba(0,0,0,0.4)] bottom-[12%] right-[5%] border-[#00ff88]/30 animate-[float-slow_4s_ease-in-out_infinite]">
        <GitCommit className="w-3 h-3 text-neon-green" />
        <span>feat: leg_day</span>
      </div>

      <div className="absolute z-20 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#121822]/85 border border-white/12 backdrop-blur-sm text-[11px] font-semibold text-zinc-300 shadow-[0_4px_16px_rgba(0,0,0,0.4)] top-[15%] right-0 border-[#22d3ee]/30 animate-[float-slow_4s_ease-in-out_2s_infinite]">
        <Zap className="w-3 h-3 text-neon-cyan" />
        <span>PR: 140kg bench</span>
      </div>
    </div>
  );
}

export default function CTASection() {
  return (
    <section className="relative py-20 md:py-24 bg-transparent overflow-hidden transition-all duration-300" aria-labelledby="cta-heading">
      <div className="max-w-nav-max-width mx-auto px-6 lg:px-10">
        <div className="cta-card">
          {/* Ambient Inner Lights */}
          <div className="absolute -top-[20%] -left-[10%] w-1/2 h-[140%] bg-[radial-gradient(ellipse_at_center,rgba(0,255,136,0.12)_0%,transparent_70%)] blur-[50px] pointer-events-none" aria-hidden="true" />
          <div className="absolute -bottom-[20%] -right-[10%] w-1/2 h-[140%] bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.15)_0%,transparent_70%)] blur-[50px] pointer-events-none" aria-hidden="true" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" aria-hidden="true" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[320px_1fr] p-10 lg:py-14 lg:px-16 gap-9 lg:gap-14 items-center">
            {/* Left Column: Glowing Git Tree Illustration */}
            <div className="flex justify-center items-center">
              <GitCommitTreeGraphic />
            </div>

            {/* Right Column: Content */}
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#a855f7]/[0.08] border border-[#a855f7]/25 text-[11px] font-bold tracking-wider text-[#c084fc] mb-4 uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-[#a855f7] shadow-[0_0_8px_#a855f7]" />
                <span>START YOUR COMMIT STREAK TODAY</span>
              </div>

              <h2 className="text-[clamp(2rem,4vw,3.1rem)] font-black leading-[1.08] tracking-tight m-0 mb-4" id="cta-heading">
                <span className="text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">READY TO COMMIT</span>
                <br />
                <span className="bg-gradient-to-r from-neon-green via-[#00e077] to-neon-cyan bg-clip-text text-transparent filter drop-shadow-[0_0_15px_rgba(168,85,247,0.3)]">TO YOUR BEST SELF?</span>
              </h2>

              <p className="text-[clamp(0.95rem,1.4vw,1.1rem)] leading-relaxed text-[#94a3b8] mb-8 max-w-[520px]">
                Join thousands of lifters who treat their workouts like code. Log sets, build streaks, and level up your physical build.
              </p>

              <div className="flex flex-col items-center lg:items-start gap-4 w-full">
                <Link href="/login" className="relative inline-flex items-center justify-center gap-2.5 px-9 py-4 text-base font-extrabold text-[#060a0e] rounded-[14px] bg-gradient-to-r from-neon-green to-[#00e077] shadow-[0_0_25px_rgba(0,255,136,0.35),0_8px_20px_-4px_rgba(0,255,136,0.25)] hover:-translate-y-0.5 hover:scale-[1.02] hover:bg-gradient-to-r hover:from-emerald-500 hover:to-neon-green hover:shadow-[0_0_35px_rgba(0,255,136,0.55),0_12px_28px_-4px_rgba(0,255,136,0.35)] transition-all duration-200 border-none outline-none cursor-pointer overflow-hidden group">
                  <span>Start Your Journey</span>
                  <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-[120%] group-hover:animate-[shimmer-effect_0.8s_ease_forwards]" aria-hidden="true" />
                </Link>

                <div className="flex items-center gap-2 text-[13px] text-[#64748b] font-medium">
                  <ShieldCheck className="w-4 h-4 text-neon-green" />
                  <span>No credit card required &bull; Free forever tier</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
