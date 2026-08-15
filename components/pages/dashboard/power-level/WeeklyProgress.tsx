'use client';

import React from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import AnimeTierCard from '../AnimeTierCard';
import { WeeklyPowerStat, getPowerColorTheme, useInView, AnimatedScoreCounter } from './power-chart-utils';

interface WeeklyProgressProps {
  weeklyPowerStats: WeeklyPowerStat[];
}

export default function WeeklyProgress({ weeklyPowerStats }: WeeklyProgressProps) {
  const { ref: containerRef, inView } = useInView(0.15);

  return (
    <div ref={containerRef} className="w-full lg:w-1/3 flex flex-col gap-6">
      <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest text-center border-b border-zinc-800 pb-3">
        Weekly Progress
      </h4>

      <div className="h-64 flex items-end justify-between gap-2 px-2">
        {weeklyPowerStats.map((w, idx) => {
          const score = w.scoreData.totalScore;
          const heightPercent = Math.max(6, score);
          const char = w.scoreData.character;
          const theme = getPowerColorTheme(score, w.isCurrentWeek);
          const delayMs = idx * 60;

          return (
            <div key={`${w.weekLabel}-${idx}`} className="flex-1 flex flex-col items-center h-full justify-end group relative">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="w-full flex flex-col items-center cursor-pointer relative z-10">
                    {char && (
                      <div
                        style={{
                          bottom: inView ? `calc(${heightPercent}% * 0.76 + 16px)` : '16px',
                          opacity: inView ? 1 : 0,
                          transition: `bottom 900ms cubic-bezier(0.16, 1, 0.3, 1) ${delayMs}ms, opacity 500ms ease-out ${delayMs}ms, transform 300ms`,
                        }}
                        className="absolute w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center overflow-hidden z-20 group-hover:scale-125 pointer-events-none"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={char.image} alt={char.name} className="w-full h-full object-contain group-hover:border-white/50 transition-colors" />
                      </div>
                    )}
                    <AnimatedScoreCounter
                      value={score}
                      inView={inView}
                      duration={900}
                      delay={delayMs}
                      className={theme.scoreText}
                    />

                    <div
                      className={`w-full max-w-[36px] bg-zinc-900/60 rounded-t-lg overflow-hidden flex flex-col justify-end h-36 p-0.5 border transition-all duration-300 relative ${theme.container}`}
                    >
                      <div
                        style={{
                          height: inView ? `${heightPercent}%` : '0%',
                          transition: `height 900ms cubic-bezier(0.16, 1, 0.3, 1) ${delayMs}ms`,
                        }}
                        className={`w-full rounded-t ${theme.bar} ${
                          w.isCurrentWeek && score > 0 ? 'relative overflow-hidden' : ''
                        }`}
                      >
                        {w.isCurrentWeek && score > 0 && (
                          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/20 to-transparent animate-pulse" />
                        )}
                      </div>
                    </div>
                    <span className={`text-[9px] uppercase tracking-wider mt-2.5 truncate max-w-[40px] text-center ${theme.text}`}>
                      {w.weekLabel}
                    </span>
                  </div>
                </TooltipTrigger>

                <TooltipContent side="top" className="p-0 border-none bg-transparent shadow-none" sideOffset={12}>
                  <AnimeTierCard
                    title={`WEEK OF ${w.weekLabel}`}
                    score={score}
                    character={char!}
                    gymDays={w.count}
                    totalHours={w.totalHours}
                    scoreData={w.scoreData}
                  />
                </TooltipContent>
              </Tooltip>
            </div>
          );
        })}
      </div>
    </div>
  );
}
