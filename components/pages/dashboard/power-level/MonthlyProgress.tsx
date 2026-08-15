'use client';

import React from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import AnimeTierCard from '../AnimeTierCard';
import { MonthlyPowerStat, getPowerColorTheme, useInView, AnimatedScoreCounter } from './power-chart-utils';

interface MonthlyProgressProps {
  monthlyPowerStats: MonthlyPowerStat[];
}

export default function MonthlyProgress({ monthlyPowerStats }: MonthlyProgressProps) {
  const { ref: containerRef, inView } = useInView(0.15);

  return (
    <div ref={containerRef} className="w-full lg:w-2/3 flex flex-col gap-6">
      <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest text-center border-b border-zinc-800 pb-3">
        Last 12 Months
      </h4>

      <div className="h-64 flex items-end justify-between gap-1.5 px-2">
        {monthlyPowerStats.map((m, idx) => {
          const score = m.scoreData.totalScore;
          const heightPercent = Math.max(6, score);
          const char = m.scoreData.character;
          const compositeKey = `${m.year}-${m.monthIndex}-${idx}`;
          const theme = getPowerColorTheme(score, m.isCurrentMonth);
          const delayMs = idx * 35;

          return (
            <div key={compositeKey} className="flex-1 flex flex-col items-center h-full justify-end group relative">
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
                        className="absolute w-7 h-7 sm:w-10 sm:h-10 flex items-center justify-center overflow-hidden z-20 group-hover:scale-125 pointer-events-none"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={char.image} alt={char.name} className="w-full h-full object-contain" />
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
                          m.isCurrentMonth && score > 0 ? 'relative overflow-hidden' : ''
                        }`}
                      >
                        {m.isCurrentMonth && score > 0 && (
                          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/20 to-transparent animate-pulse" />
                        )}
                      </div>
                    </div>
                    <span className={`text-[9px] uppercase tracking-widest mt-2.5 ${theme.text}`}>
                      {m.month.slice(0, 3)}
                    </span>
                  </div>
                </TooltipTrigger>

                <TooltipContent side="top" className="p-0 border-none bg-transparent shadow-none" sideOffset={12}>
                  <AnimeTierCard
                    title={`${m.month} ${m.year}`}
                    score={score}
                    character={char!}
                    gymDays={m.count}
                    totalHours={m.totalHours}
                    scoreData={m.scoreData}
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
