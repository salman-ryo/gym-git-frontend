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
    <div className="testimonials__badge">
      <span className="testimonials__badge-dot" aria-hidden="true" />
      <span className="testimonials__badge-text">WHAT LIFTERS SAY</span>
    </div>
  );
}

function SectionHeadline() {
  return (
    <h2 className="testimonials__headline">
      TRUSTED BY DISCIPLINED MINDS
    </h2>
  );
}

function TestimonialCard({ quote, name, handle, role, avatarInitials, avatarColor }: Testimonial) {
  return (
    <article className="testi-card">
      {/* Quote Icon watermark */}
      <div className="testi-card__quote-mark" aria-hidden="true">"</div>
      
      <p className="testi-card__quote">{quote}</p>
      
      <div className="testi-card__author">
        <div className="testi-card__avatar" style={{ backgroundColor: avatarColor }}>
          {avatarInitials}
        </div>
        <div className="testi-card__author-info">
          <span className="testi-card__name">{name}</span>
          <span className="testi-card__handle">{handle}</span>
          <span className="testi-card__role">{role}</span>
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

  // In a real carousel we would use these, for now we show a CSS grid on desktop
  // and they just exist as UI elements matching the design
  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? TESTIMONIALS.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === TESTIMONIALS.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="testimonials" aria-labelledby="testimonials-heading">
      <div className="testimonials__header">
        <SectionBadge />
        <SectionHeadline />
      </div>

      <div className="testimonials__container">
        
        {/* Left Arrow */}
        <button 
          className="testimonials__nav-btn testimonials__nav-btn--prev"
          onClick={handlePrev}
          aria-label="Previous testimonial"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Carousel / Grid Track */}
        <div className="testimonials__track">
          {TESTIMONIALS.map((t) => (
            <TestimonialCard key={t.id} {...t} />
          ))}
        </div>

        {/* Right Arrow */}
        <button 
          className="testimonials__nav-btn testimonials__nav-btn--next"
          onClick={handleNext}
          aria-label="Next testimonial"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

      </div>

      {/* Pagination Dots */}
      <div className="testimonials__pagination" aria-hidden="true">
        {TESTIMONIALS.map((_, i) => (
          <span 
            key={i} 
            className={`testimonials__dot ${i === activeIndex ? 'testimonials__dot--active' : ''}`}
            onClick={() => setActiveIndex(i)}
          />
        ))}
      </div>
    </section>
  );
}
