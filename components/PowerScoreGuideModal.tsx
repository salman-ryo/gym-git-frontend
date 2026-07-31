'use client';

import React from 'react';
import { Swords, Zap, HelpCircle, Activity, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { animePowerLevels } from '@/assets/anime';

// Helper to color-code characters based on their power level
const getTierColor = (score: number) => {
    if (score < 35) return 'border-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]';
    if (score < 55) return 'border-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]';
    if (score < 72) return 'border-indigo-400 shadow-[0_0_10px_rgba(129,140,248,0.5)]';
    if (score < 88) return 'border-purple-400 shadow-[0_0_10px_rgba(192,132,252,0.5)]';
    if (score < 97) return 'border-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.5)]';
    return 'border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.6)]';
};

export default function PowerScoreGuideModal() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <button
                    type="button"
                    className="px-4 py-1.5 bg-zinc-900/60 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-indigo-400 hover:border-indigo-500/50 hover:shadow-[0_0_10px_rgba(129,140,248,0.2)] rounded-full text-[10px] uppercase tracking-wider font-bold flex items-center gap-1.5 transition-all duration-300 self-start sm:self-center shrink-0"
                    title="How Power Score is calculated"
                >
                    <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
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

                            {/* LEFT SIDE: Horizontal Progression Graph (Roadmap) */}
                            <div className="flex-1 min-w-0 bg-zinc-900/30 border border-zinc-800/80 rounded-2xl p-4 flex flex-col relative overflow-hidden">
                                <div className="flex items-center justify-between mb-4 shrink-0">
                                    <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                                        <Activity className="w-4 h-4 text-indigo-500" />
                                        Power Progression Path
                                    </h3>
                                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider animate-pulse">
                                        Scroll Right &rarr;
                                    </span>
                                </div>

                                {/* Horizontal Scrollable Container */}
                                <div className="overflow-x-auto overflow-y-hidden flex-1 relative rounded-xl border border-zinc-800/50 bg-zinc-950/50 custom-scrollbar">
                                    {/* Inner track that forces horizontal scrolling (min-w determines scroll length) */}
                                    <div className="relative min-w-[1100px] w-full h-[280px] sm:h-[340px]">

                                        {/* The Main Gradient Line (The Path) */}
                                        <div className="absolute top-1/2 left-8 right-8 h-1.5 bg-zinc-800 rounded-full -translate-y-1/2 shadow-[inset_0_1px_3px_rgba(0,0,0,0.6)]">
                                            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-amber-500 opacity-60" />
                                        </div>
                                        {/* Scale markers */}
                                        <div className="absolute top-1/2 left-8 right-8 flex justify-between px-1 -translate-y-1/2 mt-4 opacity-30 pointer-events-none">
                                            {[0, 20, 40, 60, 80, 100].map(mark => (
                                                <span key={mark} className="text-[9px] font-black font-mono">{mark}</span>
                                            ))}
                                        </div>

                                        {/* Character Nodes */}
                                        {animePowerLevels?.map((char, index) => {
                                            // Alternate placement above and below the line to prevent collisions
                                            const isTop = index % 2 === 0;

                                            // Map the 0-100 score to 5%-95% of the container width to keep portraits from clipping the edges
                                            const mappedPosition = 5 + (char.minPower * 0.9);
                                            const ringColor = getTierColor(char.minPower);

                                            return (
                                                <div
                                                    key={char.id}
                                                    className="absolute flex flex-col items-center w-20 transition-all duration-300 hover:z-50"
                                                    style={{
                                                        left: `${mappedPosition}%`,
                                                        top: isTop ? '15%' : '50%',
                                                        transform: 'translateX(-50%)'
                                                    }}
                                                >
                                                    {isTop ? (
                                                        <>
                                                            {/* Top Portrait */}
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <div className="group cursor-help flex flex-col items-center gap-1.5 relative z-10">
                                                                        <div className="text-[10px] font-black text-indigo-400 bg-zinc-950 px-1.5 py-0.5 rounded border border-indigo-500/30">
                                                                            {char.minPower}+
                                                                        </div>
                                                                        <div className={`w-12 h-12 sm:w-16 sm:h-16 transition-transform duration-300 group-hover:scale-125`}>
                                                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                                                            <img src={char.image} alt={char.name} className="w-full h-full object-contain" />
                                                                        </div>
                                                                        <span className="text-[9px] font-black uppercase text-zinc-300 text-center truncate w-full px-1 drop-shadow-md">
                                                                            {char.name}
                                                                        </span>
                                                                    </div>
                                                                </TooltipTrigger>
                                                                <TooltipContent side="top" className="max-w-[220px] bg-zinc-900 border-zinc-700 shadow-xl z-50 p-3">
                                                                    <p className="font-black text-indigo-400 text-xs mb-1 uppercase tracking-wider">{char.name}</p>
                                                                    <p className="text-[11px] text-zinc-300 font-medium leading-relaxed">{char.description}</p>
                                                                </TooltipContent>
                                                            </Tooltip>

                                                            {/* Stem connecting down to the line */}
                                                            <div className="w-0.5 h-6 sm:h-8 bg-zinc-700/80 -mt-1 relative z-0" />
                                                            <div className="w-2.5 h-2.5 rounded-full bg-zinc-400 absolute bottom-[-5px] sm:bottom-[-9px] shadow-[0_0_8px_rgba(255,255,255,0.8)] border border-zinc-900" />
                                                        </>
                                                    ) : (
                                                        <>
                                                            {/* Stem connecting up to the line */}
                                                            <div className="w-2.5 h-2.5 rounded-full bg-zinc-400 absolute top-[-5px] sm:top-[-9px] shadow-[0_0_8px_rgba(255,255,255,0.8)] border border-zinc-900 z-10" />
                                                            <div className="w-0.5 h-6 sm:h-8 bg-zinc-700/80 relative z-0 mb-1.5" />

                                                            {/* Bottom Portrait */}
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <div className="group cursor-help flex flex-col items-center gap-1.5 relative z-10">
                                                                        <span className="text-[9px] font-black uppercase text-zinc-300 text-center truncate w-full px-1 drop-shadow-md">
                                                                            {char.name}
                                                                        </span>
                                                                        <div className={`w-12 h-12 sm:w-16 sm:h-16 transition-transform duration-300 group-hover:scale-125`}>
                                                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                                                            <img src={char.image} alt={char.name} className="w-full h-full object-contain" />
                                                                        </div>
                                                                        <div className="text-[10px] font-black text-indigo-400 bg-zinc-950 px-1.5 py-0.5 rounded border border-indigo-500/30">
                                                                            {char.minPower}+
                                                                        </div>
                                                                    </div>
                                                                </TooltipTrigger>
                                                                <TooltipContent side="bottom" className="max-w-[220px] bg-zinc-900 border-zinc-700 shadow-xl z-50 p-3">
                                                                    <p className="font-black text-indigo-400 text-xs mb-1 uppercase tracking-wider">{char.name}</p>
                                                                    <p className="text-[11px] text-zinc-300 font-medium leading-relaxed">{char.description}</p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* RIGHT SIDE: Scoring Explanation */}
                            <div className="w-full lg:w-[280px] xl:w-[320px] shrink-0 flex flex-col gap-4">
                                <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2 mb-1">
                                    <Swords className="w-4 h-4 text-zinc-500" />
                                    Scoring Metrics
                                </h3>

                                <div className="flex flex-col gap-3">
                                    <div className="bg-zinc-900/40 p-4 rounded-xl border border-zinc-800 hover:border-indigo-500/30 transition-colors group">
                                        <p className="font-black text-[11px] tracking-wider uppercase text-indigo-400 mb-1.5 flex justify-between items-center">
                                            <span>🎯 Consistency</span>
                                            <span className="text-zinc-600 group-hover:text-indigo-500/50 transition-colors">45%</span>
                                        </p>
                                        <p className="text-[11px] text-zinc-400 leading-relaxed font-medium">
                                            Days hit vs target frequency. 5 days @ 45m beats 1 day @ 4h.
                                        </p>
                                    </div>

                                    <div className="bg-zinc-900/40 p-4 rounded-xl border border-zinc-800 hover:border-sky-500/30 transition-colors group">
                                        <p className="font-black text-[11px] tracking-wider uppercase text-sky-400 mb-1.5 flex justify-between items-center">
                                            <span>⏱️ Optimal Length</span>
                                            <span className="text-zinc-600 group-hover:text-sky-500/50 transition-colors">25%</span>
                                        </p>
                                        <p className="text-[11px] text-zinc-400 leading-relaxed font-medium">
                                            45m – 90m sweet spot gets 100%. Overlong binge days (&gt;3h) diminish returns.
                                        </p>
                                    </div>

                                    <div className="bg-zinc-900/40 p-4 rounded-xl border border-zinc-800 hover:border-amber-500/30 transition-colors group">
                                        <p className="font-black text-[11px] tracking-wider uppercase text-amber-400 mb-1.5 flex justify-between items-center">
                                            <span>🧩 Split Variety</span>
                                            <span className="text-zinc-600 group-hover:text-amber-500/50 transition-colors">20%</span>
                                        </p>
                                        <p className="text-[11px] text-zinc-400 leading-relaxed font-medium">
                                            Rewards training 3+ distinct workout types (Push, Pull, Legs, etc.) to ensure balanced training.
                                        </p>
                                    </div>

                                    <div className="bg-zinc-900/40 p-4 rounded-xl border border-zinc-800 hover:border-rose-500/30 transition-colors group">
                                        <p className="font-black text-[11px] tracking-wider uppercase text-rose-400 mb-1.5 flex justify-between items-center">
                                            <span>🔥 Momentum</span>
                                            <span className="text-zinc-600 group-hover:text-rose-500/50 transition-colors">10%</span>
                                        </p>
                                        <p className="text-[11px] text-zinc-400 leading-relaxed font-medium">
                                            Active habit sequences & steady weekly attendance multipliers.
                                        </p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </TooltipProvider>
                </div>
            </DialogContent>
        </Dialog>
    );
}