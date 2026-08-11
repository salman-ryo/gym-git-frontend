'use client';

import './LandingBackground.css';
import React, { useMemo } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  color: 'green' | 'cyan' | 'purple';
}

export default function LandingBackground({ isFrozen = false }: { isFrozen?: boolean }) {
  // Generate 24 floating particles distributed across the page
  const particles = useMemo<Particle[]>(() => {
    const colors: ('green' | 'cyan' | 'purple')[] = isFrozen
      ? ['cyan', 'cyan', 'cyan']
      : ['green', 'cyan', 'purple', 'green', 'green', 'cyan'];
    return Array.from({ length: 24 }, (_, i) => ({
      id: i,
      x: (i * 4.2 + (i % 5) * 7) % 96 + 2, // Percentage left (2% to 98%)
      y: (i * 4.1 + (i % 3) * 12) % 92 + 4, // Percentage top (4% to 96%)
      size: (i % 3 === 0 ? 4 : i % 2 === 0 ? 3 : 2),
      delay: (i * 0.4) % 6,
      duration: 4 + (i % 5) * 1.2,
      color: colors[i % colors.length],
    }));
  }, [isFrozen]);

  return (
    <div className={`fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#060a0e] ${isFrozen ? 'is-frozen' : ''}`} aria-hidden="true">
      {/* ── Animated Cyberpunk Grid Background ── */}
      <div className="landing-bg-layer__grid" />

      {/* ── Floating Neon Ambient Glow Orbs ── */}
      <div className="landing-bg-layer__orb landing-bg-layer__orb--top-left" />
      <div className="landing-bg-layer__orb landing-bg-layer__orb--mid-right" />
      <div className="landing-bg-layer__orb landing-bg-layer__orb--lower-left" />
      <div className="landing-bg-layer__orb landing-bg-layer__orb--bottom-right" />

      {/* ── Page-wide Floating Particles ── */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((p) => (
          <div
            key={p.id}
            className={`landing-bg-layer__particle landing-bg-layer__particle--${p.color}`}
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
