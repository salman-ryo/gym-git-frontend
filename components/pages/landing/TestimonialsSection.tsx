'use client';

import './TestimonialsSection.css';
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

/* ─────────────────────────────────────────────
   Data
   ───────────────────────────────────────────── */
interface Testimonial {
  id: string;
  quote: string;
  name: string;
  handle: string;
  role: string;
  avatarInitials: string;
  avatarColor: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    quote: "Gym-Git changed the way I track my workouts. The streaks keep me accountable every single day.",
    name: 'Aryan Sharma',
    handle: '@aryan_lifts',
    role: 'Powerlifter',
    avatarInitials: 'AS',
    avatarColor: '#10b981', // Emerald
  },
  {
    id: '2',
    quote: "The best tracker I've used. Clean UI, powerful insights, and built for progress.",
    name: 'Rohan Verma',
    handle: '@rohanswole',
    role: 'Calisthenics Athlete',
    avatarInitials: 'RV',
    avatarColor: '#8b5cf6', // Violet
  },
  {
    id: '3',
    quote: "Finally, a fitness app that gets us. It's like GitHub for your gains 💪",
    name: 'Karthik N.',
    handle: '@karthik_codes',
    role: 'Software Engineer',
    avatarInitials: 'KN',
    avatarColor: '#f59e0b', // Amber
  },
];

/* ─────────────────────────────────────────────
   Sub-components
   ───────────────────────────────────────────── */

function SectionBadge() {
  return (
    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-neon-green/15 bg-neon-green/4 backdrop-blur-md">
      <span className="w-1.5 h-1.5 rounded-full bg-neon-green shadow-[0_0_8px_#00ff88] animate-[badge-pulse_2s_ease-in-out_infinite]" aria-hidden="true" />
      <span className="text-[11px] font-bold tracking-wider text-neon-green uppercase">WHAT LIFTERS SAY</span>
    </div>
  );
}

function SectionHeadline() {
  return (
    <h2 className="text-[clamp(1.5rem,3vw,2.25rem)] font-black leading-tight tracking-tight text-[#fafafa] m-0">
      TRUSTED BY DISCIPLINED MINDS
    </h2>
  );
}

function TestimonialCard({ quote, name, handle, role, avatarInitials, avatarColor }: Testimonial) {
  return (
    <article className="relative rounded-2xl border border-zinc-800/50 bg-glass-bg backdrop-blur-md overflow-hidden transition-all duration-350 ease-[cubic-bezier(0.4,0,0.2,1)] hover:border-neon-green/15 hover:bg-glass-bg-scrolled hover:shadow-[0_16px_48px_-12px_rgba(0,0,0,0.5)] hover:-translate-y-1 will-change-transform p-8 flex flex-col justify-between select-none relative group">
      {/* Quote Icon watermark */}
      <div className="absolute top-2 right-6 text-zinc-800 text-[6rem] leading-none font-serif opacity-20 pointer-events-none select-none" aria-hidden="true">"</div>
      
      <p className="text-[14.5px] leading-relaxed text-[#e4e4e7] relative z-10 mb-6 italic">{quote}</p>
      
      <div className="flex items-center gap-3 mt-auto relative z-10">
        <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ backgroundColor: avatarColor }}>
          {avatarInitials}
        </div>
        <div className="flex flex-col gap-0.5 text-left">
          <span className="text-[13.5px] font-bold text-[#fafafa]">{name}</span>
          <span className="text-[11.5px] text-[#71717a] font-medium">{handle}</span>
          <span className="text-[11px] text-neon-green font-semibold tracking-wide uppercase mt-0.5">{role}</span>
        </div>
      </div>
    </article>
  );
}

/* ─────────────────────────────────────────────
   Main Section
   ───────────────────────────────────────────── */
export default function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? TESTIMONIALS.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === TESTIMONIALS.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="relative py-20 md:py-24 bg-transparent overflow-hidden" aria-labelledby="testimonials-heading">
      <div className="max-w-nav-max-width mx-auto px-6 lg:px-10 relative z-10 flex flex-col items-center text-center gap-4 mb-12">
        <SectionBadge />
        <SectionHeadline />
      </div>

      <div className="max-w-nav-max-width mx-auto px-6 lg:px-10 relative z-10 flex items-center gap-6">
        
        {/* Left Arrow */}
        <button 
          className="hidden lg:flex items-center justify-center w-12 h-12 rounded-full bg-[rgba(24,24,27,0.5)] border border-[rgba(63,63,70,0.5)] text-[#a1a1aa] hover:text-[#fafafa] hover:bg-[rgba(39,39,42,0.6)] hover:border-[rgba(161,161,170,0.3)] transition-all cursor-pointer flex-shrink-0"
          onClick={handlePrev}
          aria-label="Previous testimonial"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Carousel / Grid Track */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
          {TESTIMONIALS.map((t) => (
            <TestimonialCard key={t.id} {...t} />
          ))}
        </div>

        {/* Right Arrow */}
        <button 
          className="hidden lg:flex items-center justify-center w-12 h-12 rounded-full bg-[rgba(24,24,27,0.5)] border border-[rgba(63,63,70,0.5)] text-[#a1a1aa] hover:text-[#fafafa] hover:bg-[rgba(39,39,42,0.6)] hover:border-[rgba(161,161,170,0.3)] transition-all cursor-pointer flex-shrink-0"
          onClick={handleNext}
          aria-label="Next testimonial"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

      </div>

      {/* Pagination Dots */}
      <div className="flex items-center justify-center gap-2 mt-8 md:hidden" aria-hidden="true">
        {TESTIMONIALS.map((_, i) => (
          <span 
            key={i} 
            className={`w-2 h-2 rounded-full bg-zinc-700 cursor-pointer transition-all duration-300 ${i === activeIndex ? 'w-6 bg-neon-green' : ''}`}
            onClick={() => setActiveIndex(i)}
          />
        ))}
      </div>
    </section>
  );
}
