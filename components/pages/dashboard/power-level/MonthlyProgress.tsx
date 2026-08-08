'use client';

import React from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import AnimeTierCard from '../AnimeTierCard';
import { MonthlyPowerStat, getPowerColorTheme } from './power-chart-utils';

interface MonthlyProgressProps {
  monthlyPowerStats: MonthlyPowerStat[];
}

export default function MonthlyProgress({ monthlyPowerStats }: MonthlyProgressProps) {
  return (
    <div className="w-full lg:w-2/3 flex flex-col gap-6">
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

          return (
            <div key={compositeKey} className="flex-1 flex flex-col items-center h-full justify-end group relative">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="w-full flex flex-col items-center cursor-pointer relative z-10">
                    {char && (
                      <div
                        style={{ bottom: `calc(${heightPercent}% * 0.76 + 16px)` }}
                        className="absolute w-7 h-7 sm:w-10 sm:h-10 flex items-center justify-center overflow-hidden transition-all duration-300 z-20 group-hover:scale-125"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={char.image} alt={char.name} className="w-full h-full object-contain" />
                      </div>
                    )}
                    <span className={theme.scoreText}>
                      {score}
                    </span>

                    <div
                      className={`w-full max-w-[36px] bg-zinc-900/60 rounded-t-lg overflow-hidden flex flex-col justify-end h-36 p-0.5 border transition-all duration-300 relative ${theme.container}`}
                    >
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className={`w-full rounded-t transition-all duration-500 ${theme.bar}`}
                      />
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
