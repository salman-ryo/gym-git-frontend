'use client';

import React, { memo } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import AnimeTierCard from '../AnimeTierCard';
import { MonthlyPowerStat, getPowerColorTheme, useInView, useTieredBarAnimation } from './power-chart-utils';
import CharacterPowerParticles from './CharacterPowerParticles';

interface MonthlyProgressProps {
  monthlyPowerStats: MonthlyPowerStat[];
}

const MonthlyBarColumn = memo(function MonthlyBarColumn({
  m,
  idx,
  inView,
}: {
  m: MonthlyPowerStat;
  idx: number;
  inView: boolean;
}) {
  const targetScore = m.scoreData.totalScore;
  const { currentScore, continuousScore, currentCharacter, isAnimating, tierJustChanged } = useTieredBarAnimation({
    targetScore,
    inView,
    delay: idx * 40,
    stepDuration: 350,
  });

  const heightPercent = continuousScore;
  const compositeKey = `${m.year}-${m.monthIndex}-${idx}`;
  const theme = getPowerColorTheme(currentScore, m.isCurrentMonth);

  return (
    <div key={compositeKey} className="flex-1 flex flex-col items-center h-full justify-end group relative">
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="w-full flex flex-col items-center cursor-pointer relative z-10">
            {currentCharacter && (
              <div
                style={{
                  bottom: `calc(${heightPercent}% * 0.76 + 16px)`,
                }}
                className={`absolute w-7 h-7 sm:w-10 sm:h-10 flex items-center justify-center overflow-visible z-20 pointer-events-none transition-transform duration-200 ${
                  tierJustChanged
                    ? 'scale-135 drop-shadow-[0_0_12px_rgba(250,204,21,0.9)]'
                    : 'group-hover:scale-125'
                }`}
              >
                {/* Dynamic Ki Particles during animation */}
                <CharacterPowerParticles
                  isAnimating={isAnimating}
                  score={currentScore}
                  tierJustChanged={tierJustChanged}
                  size="sm"
                />

                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={currentCharacter.image}
                  alt={currentCharacter.name}
                  className="w-full h-full object-contain group-hover:border-white/50 transition-all duration-300 relative z-10"
                />
              </div>
            )}
            <span className={theme.scoreText}>
              {currentScore}
            </span>

            <div
              className={`w-full max-w-[36px] bg-zinc-900/60 rounded-t-lg overflow-hidden flex flex-col justify-end h-36 p-0.5 border transition-colors duration-200 relative ${theme.container}`}
            >
              <div
                style={{
                  height: `${heightPercent}%`,
                }}
                className={`w-full rounded-t ${theme.bar} ${
                  m.isCurrentMonth && currentScore > 0 ? 'relative overflow-hidden' : ''
                }`}
              >
                {/* Energy beam cap at the top of the rising bar */}
                {isAnimating && currentScore > 0 && (
                  <div className="absolute top-0 inset-x-0 h-1 bg-white shadow-[0_0_8px_#ffffff] z-10 rounded-t" />
                )}
                {m.isCurrentMonth && currentScore > 0 && (
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
            score={targetScore}
            character={m.scoreData.character}
            gymDays={m.count}
            totalHours={m.totalHours}
            scoreData={m.scoreData}
          />
        </TooltipContent>
      </Tooltip>
    </div>
  );
});

function MonthlyProgress({ monthlyPowerStats }: MonthlyProgressProps) {
  const { ref: containerRef, inView } = useInView(0.15);

  return (
    <div ref={containerRef} className="w-full lg:w-2/3 flex flex-col gap-6">
      <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest text-center border-b border-zinc-800 pb-3">
        Last 12 Months
      </h4>

      <div className="h-64 flex items-end justify-between gap-1.5 px-2">
        {monthlyPowerStats.map((m, idx) => (
          <MonthlyBarColumn
            key={`${m.year}-${m.monthIndex}-${idx}`}
            m={m}
            idx={idx}
            inView={inView}
          />
        ))}
      </div>
    </div>
  );
}

export default memo(MonthlyProgress);
