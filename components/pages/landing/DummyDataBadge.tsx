'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface DummyDataBadgeProps {
  side?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
  badgeClassName?: string;
  message?: string;
}

export default function DummyDataBadge({
  side = 'top',
  className = '',
  badgeClassName = '',
  message = 'This is dummy data since the app is new.',
}: DummyDataBadgeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when tapping or clicking outside on mobile or desktop
  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDownOutside = (event: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDownOutside);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDownOutside);
    };
  }, [isOpen]);

  const handleToggle = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsOpen(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <div
      ref={containerRef}
      className="inline-flex items-center justify-center relative align-middle"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <TooltipProvider delayDuration={0}>
        <Tooltip open={isOpen} onOpenChange={setIsOpen}>
          <TooltipTrigger asChild>
            <button
              type="button"
              className={`relative inline-flex items-center justify-center w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-zinc-900/90 border border-zinc-700/80 text-[9px] sm:text-[10px] font-black text-zinc-400 hover:text-neon-cyan hover:border-neon-cyan/60 hover:bg-zinc-800 active:scale-95 hover:shadow-[0_0_8px_rgba(34,211,238,0.3)] transition-all duration-200 cursor-pointer select-none focus:outline-none focus-visible:ring-1 focus-visible:ring-neon-cyan ${badgeClassName}`}
              aria-label="Notice: Placeholder Data"
              onClick={handleToggle}
              aria-expanded={isOpen}
            >
              {/* Expanded touch target for mobile fingertips */}
              <span className="absolute -inset-2.5 block sm:hidden pointer-events-auto" aria-hidden="true" />
              <span className="leading-none">?</span>
            </button>
          </TooltipTrigger>
          <TooltipContent
            side={side}
            sideOffset={8}
            className={`z-50 max-w-[280px] p-3 rounded-2xl bg-zinc-950/95 border border-zinc-800 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.85),0_0_15px_rgba(34,211,238,0.18)] text-left animate-in fade-in-0 zoom-in-95 ${className}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 relative">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-zinc-700/70 bg-zinc-900 shrink-0 shadow-inner">
                <Image
                  src="/images/anime/question/zoroq.png"
                  alt="Zoro question mark"
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                  unoptimized
                />
              </div>
              <div className="flex flex-col gap-1 min-w-0 pr-4">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_#f59e0b] animate-pulse shrink-0" />
                  <span className="text-[10px] font-black tracking-wider uppercase text-amber-400">
                    DEMO DATA
                  </span>
                </div>
                <p className="text-[11px] leading-snug text-zinc-300 font-medium m-0">
                  {message}
                </p>
              </div>

              {/* Close button for touch / mobile users */}
              <button
                type="button"
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center border border-zinc-800 transition-colors cursor-pointer"
                onClick={() => setIsOpen(false)}
                aria-label="Close notice"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}

