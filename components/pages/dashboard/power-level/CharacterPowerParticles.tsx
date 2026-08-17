'use client';

import React, { useEffect, useState } from 'react';
import { getTierParticleColors } from '@/lib/power-tier-theme';

export interface CharacterPowerParticlesProps {
  isAnimating: boolean;
  score: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

interface ParticleConfig {
  id: number;
  top: string;
  left: string;
  size: number;
  delay: string;
  duration: string;
  colorType: 'primary' | 'secondary' | 'accent' | 'white';
  type: 'sparkle' | 'ember' | 'dot' | 'star';
  animName: string;
}

// Particle configurations for small sizes
const SM_PARTICLES: ParticleConfig[] = [
  { id: 1, top: '20%', left: '15%', size: 3, delay: '0s', duration: '1.2s', colorType: 'primary', type: 'sparkle', animName: 'particle-float-up-left' },
  { id: 2, top: '15%', left: '80%', size: 2.5, delay: '0.2s', duration: '1.4s', colorType: 'secondary', type: 'sparkle', animName: 'particle-float-up-right' },
  { id: 3, top: '75%', left: '10%', size: 3, delay: '0.4s', duration: '1.1s', colorType: 'accent', type: 'dot', animName: 'particle-drift-left' },
  { id: 4, top: '70%', left: '85%', size: 2, delay: '0.1s', duration: '1.3s', colorType: 'primary', type: 'ember', animName: 'particle-drift-right' },
  { id: 5, top: '85%', left: '50%', size: 3.5, delay: '0.3s', duration: '1.5s', colorType: 'white', type: 'star', animName: 'particle-float-up' },
];

// Medium sizes
const MD_PARTICLES: ParticleConfig[] = [
  { id: 1, top: '15%', left: '10%', size: 4, delay: '0s', duration: '1.3s', colorType: 'primary', type: 'sparkle', animName: 'particle-float-up-left' },
  { id: 2, top: '10%', left: '85%', size: 3.5, delay: '0.25s', duration: '1.5s', colorType: 'secondary', type: 'sparkle', animName: 'particle-float-up-right' },
  { id: 3, top: '45%', left: '-5%', size: 3, delay: '0.1s', duration: '1.2s', colorType: 'accent', type: 'dot', animName: 'particle-drift-left' },
  { id: 4, top: '50%', left: '100%', size: 3, delay: '0.4s', duration: '1.4s', colorType: 'primary', type: 'dot', animName: 'particle-drift-right' },
  { id: 5, top: '80%', left: '15%', size: 4, delay: '0.3s', duration: '1.6s', colorType: 'secondary', type: 'ember', animName: 'particle-float-up' },
  { id: 6, top: '85%', left: '80%', size: 3.5, delay: '0.15s', duration: '1.3s', colorType: 'accent', type: 'ember', animName: 'particle-float-up' },
  { id: 7, top: '90%', left: '48%', size: 4.5, delay: '0.5s', duration: '1.7s', colorType: 'white', type: 'star', animName: 'particle-float-up' },
  { id: 8, top: '5%', left: '50%', size: 3, delay: '0.2s', duration: '1.1s', colorType: 'primary', type: 'sparkle', animName: 'particle-float-up' },
];

// Large sizes
const LG_PARTICLES: ParticleConfig[] = [
  ...MD_PARTICLES,
  { id: 9, top: '50%', left: '104%', size: 4, delay: '0.45s', duration: '1.45s', colorType: 'accent', type: 'dot', animName: 'particle-drift-right' },
  { id: 10, top: '92%', left: '20%', size: 4, delay: '0.3s', duration: '1.5s', colorType: 'secondary', type: 'ember', animName: 'particle-float-up' },
  { id: 11, top: '90%', left: '75%', size: 4.5, delay: '0.65s', duration: '1.6s', colorType: 'primary', type: 'star', animName: 'particle-float-up' },
];

export default function CharacterPowerParticles({
  isAnimating,
  score,
  size = 'md',
  className = '',
}: CharacterPowerParticlesProps) {
  const [prevAnimating, setPrevAnimating] = useState(isAnimating);
  const [shouldRender, setShouldRender] = useState(isAnimating);

  if (isAnimating !== prevAnimating) {
    setPrevAnimating(isAnimating);
    if (isAnimating) {
      setShouldRender(true);
    }
  }

  useEffect(() => {
    if (!isAnimating) {
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isAnimating]);

  if (!shouldRender) return null;

  const colors = getTierParticleColors(score);
  const particles = size === 'sm' ? SM_PARTICLES : size === 'lg' ? LG_PARTICLES : MD_PARTICLES;

  const getColor = (type: ParticleConfig['colorType']) => {
    switch (type) {
      case 'primary':
        return colors.primary;
      case 'secondary':
        return colors.secondary;
      case 'accent':
        return colors.accent;
      case 'white':
      default:
        return '#ffffff';
    }
  };

  return (
    <div
      className={`absolute inset-0 pointer-events-none z-30 transition-all duration-400 ease-out ${
        isAnimating ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
      } ${className}`}
      aria-hidden="true"
    >
      {particles.map((p) => {
        const color = getColor(p.colorType);
        return (
          <div
            key={p.id}
            className="absolute rounded-full pointer-events-none"
            style={{
              top: p.top,
              left: p.left,
              width: `${p.size}px`,
              height: `${p.size}px`,
              backgroundColor: color,
              boxShadow: `0 0 ${p.size * 2}px ${color}, 0 0 ${p.size * 4}px ${color}`,
              animation: `${p.animName} ${p.duration} ease-in-out infinite`,
              animationDelay: p.delay,
            }}
          />
        );
      })}
    </div>
  );
}
