'use client';

import React from 'react';
import { Zap, HelpCircle, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { TooltipProvider } from '@/components/ui/tooltip';
import ProgressionPath from '@/components/pages/dashboard/power-score-guide/ProgressionPath';
import ScoringMetrics from '@/components/pages/dashboard/power-score-guide/ScoringMetrics';

export default function PowerScoreGuideModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="px-4 py-1.5 bg-[#05080c] hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-neon-cyan hover:border-neon-cyan/50 hover:shadow-[0_0_12px_rgba(34,211,238,0.2)] rounded-full text-[10px] uppercase tracking-wider font-bold flex items-center gap-1.5 transition-all duration-200 self-start sm:self-center shrink-0 cursor-pointer"
          title="How Power Score is calculated"
        >
          <HelpCircle className="w-3.5 h-3.5 text-neon-cyan" />
          <span>What is it?</span>
        </button>
      </DialogTrigger>

      {/* Explicitly added `fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-full` to force centering */}
      <DialogContent className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-full bg-zinc-950 border border-indigo-500/30 text-zinc-300 shadow-[0_0_50px_rgba(129,140,248,0.15)] sm:max-w-4xl lg:max-w-[1200px] overflow-hidden flex flex-col max-h-[90vh] p-0 z-50">

        {/* Explicit Close Button */}
        <DialogClose className="absolute right-5 top-5 z-50 opacity-70 transition-opacity hover:opacity-100 hover:text-indigo-400 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-zinc-800 text-zinc-400">
          <X className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </DialogClose>

        {/* Sticky Header */}
        <div className="px-6 pt-6 pb-4 border-b border-zinc-800 shrink-0 bg-zinc-950/80 backdrop-blur-md z-10 pr-12">
          <DialogHeader>
            <DialogTitle className="font-black text-indigo-400 flex items-center gap-2 text-sm md:text-base uppercase tracking-widest drop-shadow-[0_0_5px_rgba(129,140,248,0.6)]">
              <Zap className="w-5 h-5 text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.8)] animate-pulse" />
              Scientific Power Scoring & Progression
            </DialogTitle>
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">
              100 Pts Max • Quality &gt; Junk Volume
            </p>
          </DialogHeader>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-6">
          <TooltipProvider delayDuration={50}>
            <div className="flex flex-col lg:flex-row gap-8 h-full">
              <ProgressionPath />
              <ScoringMetrics />
            </div>
          </TooltipProvider>
        </div>
      </DialogContent>
    </Dialog>
  );
}