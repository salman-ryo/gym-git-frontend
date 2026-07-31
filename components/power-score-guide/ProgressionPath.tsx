'use client';

import React from 'react';
import { Activity } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { animePowerLevels } from '@/assets/anime';

const getTierColor = (score: number) => {
  if (score < 35) return 'border-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]';
  if (score < 55) return 'border-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]';
  if (score < 72) return 'border-indigo-400 shadow-[0_0_10px_rgba(129,140,248,0.5)]';
  if (score < 88) return 'border-purple-400 shadow-[0_0_10px_rgba(192,132,252,0.5)]';
  if (score < 97) return 'border-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.5)]';
  return 'border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.6)]';
};

export default function ProgressionPath() {
  return (
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
            // Declared ringColor in case it is ever utilized/needed
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
  );
}
