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
          className="px-3.5 sm:px-4 py-1.5 min-h-[32px] sm:min-h-[36px] bg-[#05080c] hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-neon-cyan hover:border-neon-cyan/50 hover:shadow-[0_0_12px_rgba(34,211,238,0.2)] rounded-full text-[10px] uppercase tracking-wider font-bold flex items-center gap-1.5 transition-all duration-200 self-start sm:self-center shrink-0 cursor-pointer"
          title="How Power Score is calculated"
        >
          <HelpCircle className="w-3.5 h-3.5 text-neon-cyan shrink-0" />
          <span>What is it?</span>
        </button>
      </DialogTrigger>

      {/* Explicitly added `fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-full` to force centering */}
      <DialogContent className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[94vw] sm:w-full bg-zinc-950 border border-indigo-500/30 text-zinc-300 shadow-[0_0_50px_rgba(129,140,248,0.15)] sm:max-w-4xl lg:max-w-[1200px] rounded-2xl sm:rounded-3xl overflow-hidden flex flex-col max-h-[90vh] p-0 z-50">

        {/* Explicit Close Button */}
        <DialogClose className="absolute right-3.5 sm:right-5 top-3.5 sm:top-5 z-50 opacity-70 transition-opacity hover:opacity-100 hover:text-indigo-400 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-zinc-800 text-zinc-400 p-1 rounded-lg">
          <X className="h-4 sm:h-5 w-4 sm:w-5" />
          <span className="sr-only">Close</span>
        </DialogClose>

        {/* Sticky Header */}
        <div className="px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4 border-b border-zinc-800 shrink-0 bg-zinc-950/80 backdrop-blur-md z-10 pr-10 sm:pr-12">
          <DialogHeader>
            <DialogTitle className="font-black text-indigo-400 flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm md:text-base uppercase tracking-wider sm:tracking-widest drop-shadow-[0_0_5px_rgba(129,140,248,0.6)]">
              <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.8)] animate-pulse shrink-0" />
              <span>Scientific Power Scoring</span>
            </DialogTitle>
            <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-zinc-400 mt-0.5">
              100 Pts Max • Quality &gt; Junk Volume
            </p>
          </DialogHeader>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-3.5 sm:p-6 custom-scrollbar">
          <TooltipProvider delayDuration={50}>
            <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 h-full">
              <ProgressionPath />
              <ScoringMetrics />
            </div>
          </TooltipProvider>
        </div>
      </DialogContent>
    </Dialog>
  );
}