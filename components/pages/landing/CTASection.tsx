'use client';

import './CTASection.css';
import React from 'react';
import Link from 'next/link';
import { ArrowRight, GitCommit, ShieldCheck, Zap } from 'lucide-react';

/** Glowing Git Branch / Commit Tree SVG Graphic for the Left Side */
function GitCommitTreeGraphic() {
  return (
    <div className="cta-graphic" aria-hidden="true">
      <div className="cta-graphic__glow cta-graphic__glow--purple" />
      <div className="cta-graphic__glow cta-graphic__glow--green" />

      <svg
        className="cta-graphic__svg"
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
      <div className="cta-badge-pill cta-badge-pill--1">
        <GitCommit className="w-3 h-3 text-neon-green" />
        <span>feat: leg_day</span>
      </div>

      <div className="cta-badge-pill cta-badge-pill--2">
        <Zap className="w-3 h-3 text-neon-cyan" />
        <span>PR: 140kg bench</span>
      </div>
    </div>
  );
}

export default function CTASection() {
  return (
    <section className="cta-section transition-all duration-300" aria-labelledby="cta-heading">
      <div className="cta-section__container">
        <div className="cta-card">
          {/* Ambient Inner Lights */}
          <div className="cta-card__glow-left" aria-hidden="true" />
          <div className="cta-card__glow-right" aria-hidden="true" />
          <div className="cta-card__grid-overlay" aria-hidden="true" />

          <div className="cta-card__inner">
            {/* Left Column: Glowing Git Tree Illustration */}
            <div className="cta-card__visual">
              <GitCommitTreeGraphic />
            </div>

            {/* Right Column: Content */}
            <div className="cta-card__content">
              <div className="cta-card__badge">
                <span className="cta-card__badge-dot" />
                <span>START YOUR COMMIT STREAK TODAY</span>
              </div>

              <h2 className="cta-card__headline" id="cta-heading">
                <span className="cta-card__headline-line1">READY TO COMMIT</span>
                <br />
                <span className="cta-card__headline-line2">TO YOUR BEST SELF?</span>
              </h2>

              <p className="cta-card__subtitle">
                Join thousands of lifters who treat their workouts like code. Log sets, build streaks, and level up your physical build.
              </p>

              <div className="cta-card__actions">
                <Link href="/login" className="cta-card__btn-primary">
                  <span>Start Your Journey</span>
                  <ArrowRight className="w-5 h-5 cta-card__btn-icon" />
                  <div className="cta-card__btn-shimmer" aria-hidden="true" />
                </Link>

                <div className="cta-card__meta">
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
