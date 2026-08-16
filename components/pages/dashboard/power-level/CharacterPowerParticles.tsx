'use client';

import React, { useEffect, useState } from 'react';
import { getTierParticleColors } from './power-chart-utils';

interface CharacterPowerParticlesProps {
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
  type: 'dot' | 'star' | 'ember';
  animName: string;
}

const SM_PARTICLES: ParticleConfig[] = [
  { id: 1, top: '-6px', left: '15%', size: 3, delay: '0s', duration: '1.2s', colorType: 'primary', type: 'star', animName: 'particle-float-up-left' },
  { id: 2, top: '-8px', left: '75%', size: 3.5, delay: '0.2s', duration: '1.4s', colorType: 'accent', type: 'star', animName: 'particle-float-up-right' },
  { id: 3, top: '40%', left: '-8px', size: 2.5, delay: '0.1s', duration: '1.1s', colorType: 'secondary', type: 'dot', animName: 'particle-drift-left' },
  { id: 4, top: '45%', left: '98%', size: 3, delay: '0.35s', duration: '1.3s', colorType: 'primary', type: 'ember', animName: 'particle-drift-right' },
  { id: 5, top: '85%', left: '-4px', size: 2, delay: '0.15s', duration: '1.2s', colorType: 'accent', type: 'dot', animName: 'particle-float-up-left' },
  { id: 6, top: '88%', left: '85%', size: 2.5, delay: '0.4s', duration: '1.5s', colorType: 'secondary', type: 'ember', animName: 'particle-float-up-right' },
  { id: 7, top: '-2px', left: '48%', size: 2, delay: '0.5s', duration: '1.0s', colorType: 'white', type: 'dot', animName: 'particle-float-up' },
];

const MD_PARTICLES: ParticleConfig[] = [
  { id: 1, top: '-10px', left: '20%', size: 4, delay: '0s', duration: '1.3s', colorType: 'primary', type: 'star', animName: 'particle-float-up-left' },
  { id: 2, top: '-12px', left: '70%', size: 4.5, delay: '0.25s', duration: '1.5s', colorType: 'accent', type: 'star', animName: 'particle-float-up-right' },
  { id: 3, top: '35%', left: '-12px', size: 3, delay: '0.1s', duration: '1.2s', colorType: 'secondary', type: 'dot', animName: 'particle-drift-left' },
  { id: 4, top: '40%', left: '102%', size: 3.5, delay: '0.4s', duration: '1.4s', colorType: 'primary', type: 'ember', animName: 'particle-drift-right' },
  { id: 5, top: '80%', left: '-8px', size: 2.5, delay: '0.15s', duration: '1.3s', colorType: 'accent', type: 'dot', animName: 'particle-float-up-left' },
  { id: 6, top: '85%', left: '92%', size: 3, delay: '0.45s', duration: '1.6s', colorType: 'secondary', type: 'ember', animName: 'particle-float-up-right' },
  { id: 7, top: '-6px', left: '50%', size: 3, delay: '0.55s', duration: '1.1s', colorType: 'white', type: 'dot', animName: 'particle-float-up' },
  { id: 8, top: '60%', left: '-10px', size: 3, delay: '0.3s', duration: '1.25s', colorType: 'primary', type: 'star', animName: 'particle-drift-left' },
];

const LG_PARTICLES: ParticleConfig[] = [
  { id: 1, top: '-16px', left: '25%', size: 6, delay: '0s', duration: '1.4s', colorType: 'primary', type: 'star', animName: 'particle-float-up-left' },
  { id: 2, top: '-20px', left: '68%', size: 7, delay: '0.2s', duration: '1.6s', colorType: 'accent', type: 'star', animName: 'particle-float-up-right' },
  { id: 3, top: '25%', left: '-20px', size: 5, delay: '0.1s', duration: '1.3s', colorType: 'secondary', type: 'ember', animName: 'particle-drift-left' },
  { id: 4, top: '30%', left: '105%', size: 5.5, delay: '0.35s', duration: '1.5s', colorType: 'primary', type: 'ember', animName: 'particle-drift-right' },
  { id: 5, top: '70%', left: '-18px', size: 4, delay: '0.15s', duration: '1.4s', colorType: 'accent', type: 'dot', animName: 'particle-float-up-left' },
  { id: 6, top: '75%', left: '102%', size: 4.5, delay: '0.5s', duration: '1.7s', colorType: 'secondary', type: 'star', animName: 'particle-float-up-right' },
  { id: 7, top: '-12px', left: '48%', size: 5, delay: '0.6s', duration: '1.2s', colorType: 'white', type: 'star', animName: 'particle-float-up' },
  { id: 8, top: '55%', left: '-16px', size: 4, delay: '0.25s', duration: '1.35s', colorType: 'primary', type: 'dot', animName: 'particle-drift-left' },
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
  // Keep mounted during fade-out
  const [shouldRender, setShouldRender] = useState(isAnimating);

  useEffect(() => {
    if (isAnimating) {
      setShouldRender(true);
    } else {
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 500); // Allow fade-out transition to complete
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
      <style jsx>{`
        @keyframes particle-float-up-left {
          0% {
            transform: translate3d(0, 0, 0) scale(0.6);
            opacity: 0.2;
          }
          50% {
            transform: translate3d(-6px, -10px, 0) scale(1.2);
            opacity: 1;
          }
          100% {
            transform: translate3d(-12px, -20px, 0) scale(0.3);
            opacity: 0;
          }
        }
        @keyframes particle-float-up-right {
          0% {
            transform: translate3d(0, 0, 0) scale(0.6);
            opacity: 0.2;
          }
          50% {
            transform: translate3d(6px, -10px, 0) scale(1.2);
            opacity: 1;
          }
          100% {
            transform: translate3d(12px, -20px, 0) scale(0.3);
            opacity: 0;
          }
        }
        @keyframes particle-float-up {
          0% {
            transform: translate3d(0, 0, 0) scale(0.6);
            opacity: 0.3;
          }
          50% {
            transform: translate3d(0, -12px, 0) scale(1.3);
            opacity: 1;
          }
          100% {
            transform: translate3d(0, -24px, 0) scale(0.2);
            opacity: 0;
          }
        }
        @keyframes particle-drift-left {
          0% {
            transform: translate3d(0, 0, 0) scale(0.7);
            opacity: 0.2;
          }
          50% {
            transform: translate3d(-8px, -6px, 0) scale(1.1);
            opacity: 1;
          }
          100% {
            transform: translate3d(-14px, -12px, 0) scale(0.2);
            opacity: 0;
          }
        }
        @keyframes particle-drift-right {
          0% {
            transform: translate3d(0, 0, 0) scale(0.7);
            opacity: 0.2;
          }
          50% {
            transform: translate3d(8px, -6px, 0) scale(1.1);
            opacity: 1;
          }
          100% {
            transform: translate3d(14px, -12px, 0) scale(0.2);
            opacity: 0;
          }
        }
        @keyframes particle-aura-pulse {
          0%, 100% {
            opacity: 0.4;
            transform: scale(0.95);
          }
          50% {
            opacity: 0.9;
            transform: scale(1.1);
          }
        }
      `}</style>

      {/* Subtle Aura Halo behind the character */}
      <div
        className="absolute -inset-1.5 rounded-full pointer-events-none blur-md transition-all duration-300"
        style={{
          background: `radial-gradient(circle, ${colors.glow} 0%, transparent 70%)`,
          animation: 'particle-aura-pulse 1.2s ease-in-out infinite',
        }}
      />

      {/* Dynamic Floating Particles */}
      {particles.map((p) => {
        const particleColor = getColor(p.colorType);

        return (
          <div
            key={p.id}
            className="absolute flex items-center justify-center pointer-events-none"
            style={{
              top: p.top,
              left: p.left,
              animation: `${p.animName} ${p.duration} ease-out infinite`,
              animationDelay: p.delay,
            }}
          >
            {p.type === 'star' ? (
              // 4-point anime sparkle star
              <svg
                width={p.size * 2}
                height={p.size * 2}
                viewBox="0 0 24 24"
                fill={particleColor}
                style={{
                  filter: `drop-shadow(0 0 ${p.size}px ${colors.glow})`,
                }}
              >
                <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
              </svg>
            ) : p.type === 'ember' ? (
              // Glowing vertical energy ember
              <div
                className="rounded-full"
                style={{
                  width: `${p.size * 0.75}px`,
                  height: `${p.size * 1.5}px`,
                  backgroundColor: particleColor,
                  boxShadow: `0 0 ${p.size * 1.5}px ${colors.glow}`,
                }}
              />
            ) : (
              // Glowing circular ki orb dot
              <div
                className="rounded-full"
                style={{
                  width: `${p.size}px`,
                  height: `${p.size}px`,
                  backgroundColor: particleColor,
                  boxShadow: `0 0 ${p.size * 1.8}px ${colors.glow}`,
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
