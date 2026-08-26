'use client';

import React, { useEffect, useRef } from 'react';
import { getTierParticleColors } from '@/lib/power-tier-theme';

export interface CharacterPowerParticlesProps {
  isAnimating: boolean;
  score: number;
  size?: 'sm' | 'md' | 'lg';
  tierJustChanged?: boolean;
  className?: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  maxRadius: number;
  color: string;
  glowColor: string;
  type: 'ember' | 'sparkle' | 'wisp' | 'ring';
  rotation: number;
  rotSpeed: number;
  age: number;
  lifespan: number;
  wobbleFreq: number;
  wobbleAmp: number;
  wobblePhase: number;
}

export default function CharacterPowerParticles({
  isAnimating,
  score,
  size = 'md',
  tierJustChanged = false,
  className = '',
}: CharacterPowerParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const spawnTimerRef = useRef<number>(0);
  const isAnimatingRef = useRef(isAnimating);
  const scoreRef = useRef(score);
  const prevTierJustChangedRef = useRef(tierJustChanged);

  // Keep refs up-to-date
  useEffect(() => {
    isAnimatingRef.current = isAnimating;
    scoreRef.current = score;
  }, [isAnimating, score]);

  // Canvas bounds centered around character
  const width = size === 'sm' ? 100 : size === 'lg' ? 240 : 130;
  const height = size === 'sm' ? 120 : size === 'lg' ? 250 : 150;

  // Trigger subtle burst when tierJustChanged changes to true
  useEffect(() => {
    if (tierJustChanged && !prevTierJustChangedRef.current) {
      const colors = getTierParticleColors(scoreRef.current);
      const centerX = width / 2;
      const centerY = height / 2;
      const burstCount = size === 'lg' ? 10 : size === 'md' ? 6 : 4;

      // Spawn subtle shockwave ring around avatar perimeter
      particlesRef.current.push({
        x: centerX,
        y: centerY,
        vx: 0,
        vy: 0,
        radius: size === 'lg' ? 30 : 14,
        maxRadius: size === 'lg' ? 60 : 30,
        color: colors.primary,
        glowColor: colors.glow,
        type: 'ring',
        rotation: 0,
        rotSpeed: 0,
        age: 0,
        lifespan: 0.5,
        wobbleFreq: 0,
        wobbleAmp: 0,
        wobblePhase: 0,
      });

      // Spawn sparks radiating outward from the character perimeter
      for (let i = 0; i < burstCount; i++) {
        const angle = (i / burstCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.3;
        const speed = (size === 'lg' ? 30 : 20) + Math.random() * (size === 'lg' ? 35 : 20);
        const palette = [colors.primary, colors.secondary, colors.accent, '#ffffff'];
        const chosenColor = palette[Math.floor(Math.random() * palette.length)];

        // Start from outer edge of character
        const offsetDist = size === 'lg' ? 45 : size === 'md' ? 18 : 14;
        const px = centerX + Math.cos(angle) * offsetDist;
        const py = centerY + Math.sin(angle) * offsetDist;

        particlesRef.current.push({
          x: px,
          y: py,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 10,
          radius: (size === 'lg' ? 2.5 : 1.6) + Math.random() * 1.2,
          maxRadius: 0,
          color: chosenColor,
          glowColor: colors.glow,
          type: Math.random() > 0.4 ? 'sparkle' : 'ember',
          rotation: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 5,
          age: 0,
          lifespan: 0.4 + Math.random() * 0.3,
          wobbleFreq: 3 + Math.random() * 3,
          wobbleAmp: 6 + Math.random() * 8,
          wobblePhase: Math.random() * Math.PI * 2,
        });
      }
    }
    prevTierJustChangedRef.current = tierJustChanged;
  }, [tierJustChanged, width, height, size]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // Handle high DPI
    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    lastTimeRef.current = performance.now();

    const spawnParticle = (currentScore: number) => {
      const colors = getTierParticleColors(currentScore);
      const centerX = width / 2;
      const centerY = height / 2;

      // Spawn on the outer perimeter (left or right flank, or bottom base)
      const side = Math.random() > 0.5 ? 1 : -1;
      const flankOffset =
        size === 'lg'
          ? 45 + Math.random() * 22
          : size === 'md'
          ? 16 + Math.random() * 12
          : 12 + Math.random() * 10;

      const x = centerX + side * flankOffset;
      const y = centerY + (Math.random() - 0.4) * (size === 'lg' ? 40 : 18);

      // Upward velocity with slight outward drift
      const vy = -(18 + Math.random() * (size === 'lg' ? 35 : 22));
      const vx = side * (4 + Math.random() * (size === 'lg' ? 12 : 8));

      const colorPalette = [colors.primary, colors.secondary, colors.accent, '#ffffff'];
      const chosenColor = colorPalette[Math.floor(Math.random() * colorPalette.length)];

      const randType = Math.random();
      const type: Particle['type'] =
        randType < 0.6 ? 'ember' : randType < 0.85 ? 'sparkle' : 'wisp';

      const baseRadius = size === 'lg' ? 2.6 : size === 'md' ? 1.8 : 1.4;
      const radius = baseRadius * (0.8 + Math.random() * 0.5);

      particlesRef.current.push({
        x,
        y,
        vx,
        vy,
        radius,
        maxRadius: 0,
        color: chosenColor,
        glowColor: colors.glow,
        type,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 4,
        age: 0,
        lifespan: 0.6 + Math.random() * 0.5, // 0.6s to 1.1s
        wobbleFreq: 3 + Math.random() * 3,
        wobbleAmp: (size === 'lg' ? 12 : 7) + Math.random() * 6,
        wobblePhase: Math.random() * Math.PI * 2,
      });
    };

    const render = (time: number) => {
      const dt = Math.min(0.08, (time - lastTimeRef.current) / 1000);
      lastTimeRef.current = time;

      // Controlled, subtle particle spawning when active
      if (isAnimatingRef.current) {
        // Reduced base rate: sm ~5/s, md ~7/s, lg ~12/s
        const baseRate = size === 'lg' ? 12 : size === 'md' ? 7 : 5;
        const scoreMultiplier = 1 + Math.min(0.3, scoreRef.current / 100);
        const spawnInterval = 1 / (baseRate * scoreMultiplier);

        spawnTimerRef.current += dt;
        while (spawnTimerRef.current >= spawnInterval) {
          spawnParticle(scoreRef.current);
          spawnTimerRef.current -= spawnInterval;
        }
      } else {
        spawnTimerRef.current = 0;
      }

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Render & Update particles
      if (particlesRef.current.length > 0) {
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';

        const updatedParticles: Particle[] = [];

        for (let i = 0; i < particlesRef.current.length; i++) {
          const p = particlesRef.current[i];
          p.age += dt;
          const progress = p.age / p.lifespan;

          if (progress >= 1) continue;

          // Physics update
          if (p.type === 'ring') {
            // Expanding shockwave ring
            const currentR = p.radius + (p.maxRadius - p.radius) * Math.sin(progress * (Math.PI / 2));
            const ringAlpha = (1 - progress) * 0.6;

            ctx.save();
            ctx.beginPath();
            ctx.arc(p.x, p.y, currentR, 0, Math.PI * 2);
            ctx.strokeStyle = p.glowColor.replace(/[\d.]+\)$/, `${ringAlpha})`);
            ctx.lineWidth = Math.max(0.5, (1 - progress) * (size === 'lg' ? 2 : 1.5));
            ctx.shadowColor = p.glowColor;
            ctx.shadowBlur = size === 'lg' ? 6 : 4;
            ctx.stroke();
            ctx.restore();

            updatedParticles.push(p);
            continue;
          }

          // Upward movement with slight buoyancy
          p.y += p.vy * dt;
          p.vy -= 8 * dt;

          // Horizontal drift with gentle turbulence
          p.x += (p.vx + Math.sin(p.age * p.wobbleFreq + p.wobblePhase) * (p.wobbleAmp * 0.5)) * dt;
          p.rotation += p.rotSpeed * dt;

          // Alpha curve: Quick fade in, smooth fade out
          let alpha: number;
          if (progress < 0.2) {
            alpha = (progress / 0.2) * 0.85;
          } else {
            alpha = Math.max(0, 0.85 * (1 - (progress - 0.2) / 0.8));
          }

          // Draw by type
          if (p.type === 'ember') {
            const currentR = p.radius * (0.6 + 0.5 * Math.sin(progress * Math.PI));

            // Outer soft glow
            const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, currentR * 2.6);
            glow.addColorStop(0, p.color);
            glow.addColorStop(0.5, p.glowColor.replace(/[\d.]+\)$/, `${alpha * 0.5})`));
            glow.addColorStop(1, 'rgba(0,0,0,0)');

            ctx.fillStyle = glow;
            ctx.beginPath();
            ctx.arc(p.x, p.y, currentR * 2.6, 0, Math.PI * 2);
            ctx.fill();

            // Core
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.9})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, Math.max(0.6, currentR * 0.4), 0, Math.PI * 2);
            ctx.fill();
          } else if (p.type === 'sparkle') {
            // 4-Point Anime Glint Sparkle
            const currentR = p.radius * (0.7 + 0.6 * Math.sin(progress * Math.PI));
            const rInner = currentR * 0.22;

            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation);

            ctx.beginPath();
            for (let k = 0; k < 4; k++) {
              const angle = (k * Math.PI) / 2;
              const x1 = Math.cos(angle) * currentR * 1.5;
              const y1 = Math.sin(angle) * currentR * 1.5;
              const angleMid = angle + Math.PI / 4;
              const x2 = Math.cos(angleMid) * rInner;
              const y2 = Math.sin(angleMid) * rInner;

              if (k === 0) ctx.moveTo(x1, y1);
              else ctx.lineTo(x1, y1);
              ctx.lineTo(x2, y2);
            }
            ctx.closePath();

            ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.9})`;
            ctx.shadowColor = p.color;
            ctx.shadowBlur = currentR * 2.5;
            ctx.fill();
            ctx.restore();
          } else if (p.type === 'wisp') {
            // Upward Ki Stream streak
            const streakLen = p.radius * (size === 'lg' ? 3.5 : 2.5);
            ctx.save();
            ctx.strokeStyle = p.color;
            ctx.lineWidth = Math.max(0.8, p.radius * 0.5);
            ctx.lineCap = 'round';
            ctx.shadowColor = p.glowColor;
            ctx.shadowBlur = 3;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.x, p.y + streakLen);
            ctx.stroke();
            ctx.restore();
          }

          updatedParticles.push(p);
        }

        ctx.restore();
        particlesRef.current = updatedParticles;
      }

      // Continue loop if animating or if there are remaining particles to fade out
      if (isAnimatingRef.current || particlesRef.current.length > 0) {
        animFrameRef.current = requestAnimationFrame(render);
      } else {
        animFrameRef.current = null;
      }
    };

    // Kick off animation loop if animating or particles exist
    if (isAnimating || particlesRef.current.length > 0) {
      if (!animFrameRef.current) {
        lastTimeRef.current = performance.now();
        animFrameRef.current = requestAnimationFrame(render);
      }
    }

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
    };
  }, [isAnimating, width, height, size]);

  // Positioning container class based on size (z-0 to sit behind relative z-10 character image)
  const containerPositionClass =
    size === 'sm'
      ? '-left-[36px] -top-[45px] w-[100px] h-[120px]'
      : size === 'lg'
      ? '-left-[56px] -top-[60px] w-[240px] h-[250px]'
      : '-left-[45px] -top-[55px] w-[130px] h-[150px]';

  return (
    <div
      className={`absolute pointer-events-none z-0 ${containerPositionClass} ${className}`}
      aria-hidden="true"
    >
      {/* Subtle Ambient Pulsing Ki Aura behind avatar when active */}
      {isAnimating && (
        <div
          className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-md animate-pulse pointer-events-none transition-opacity duration-300 ${
            size === 'lg' ? 'w-24 h-24' : size === 'md' ? 'w-12 h-12' : 'w-10 h-10'
          }`}
          style={{
            backgroundColor: getTierParticleColors(score).glow,
            opacity: 0.22,
          }}
        />
      )}

      <canvas
        ref={canvasRef}
        style={{
          width: `${width}px`,
          height: `${height}px`,
        }}
        className="w-full h-full pointer-events-none"
      />
    </div>
  );
}


