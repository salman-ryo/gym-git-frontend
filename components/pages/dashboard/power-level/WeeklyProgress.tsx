'use client';

import React from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import AnimeTierCard from '../AnimeTierCard';
import { WeeklyPowerStat, getPowerColorTheme, useInView, useTieredBarAnimation } from './power-chart-utils';
import CharacterPowerParticles from './CharacterPowerParticles';

interface WeeklyProgressProps {
  weeklyPowerStats: WeeklyPowerStat[];
}

function WeeklyBarColumn({
  w,
  idx,
  inView,
}: {
  w: WeeklyPowerStat;
  idx: number;
  inView: boolean;
}) {
  const targetScore = w.scoreData.totalScore;
  const { currentScore, continuousScore, currentCharacter, isAnimating, tierJustChanged } = useTieredBarAnimation({
    targetScore,
    inView,
    delay: idx * 70,
    stepDuration: 380,
  });

  const heightPercent = continuousScore;
  const theme = getPowerColorTheme(currentScore, w.isCurrentWeek);

  return (
    <div className="flex-1 flex flex-col items-center h-full justify-end group relative">
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="w-full flex flex-col items-center cursor-pointer relative z-10">
            {currentCharacter && (
              <div
                style={{
                  bottom: `calc(${heightPercent}% * 0.76 + 16px)`,
                }}
                className={`absolute w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center overflow-visible z-20 pointer-events-none transition-transform duration-200 ${
                  tierJustChanged
                    ? 'scale-135 drop-shadow-[0_0_12px_rgba(250,204,21,0.9)]'
                    : 'group-hover:scale-125'
                }`}
              >
                {/* Dynamic Ki Particles during animation */}
                <CharacterPowerParticles
                  isAnimating={isAnimating}
                  score={currentScore}
                  size="md"
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
                  w.isCurrentWeek && currentScore > 0 ? 'relative overflow-hidden' : ''
                }`}
              >
                {w.isCurrentWeek && currentScore > 0 && (
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
            score={targetScore}
            character={w.scoreData.character}
            gymDays={w.count}
            totalHours={w.totalHours}
            scoreData={w.scoreData}
          />
        </TooltipContent>
      </Tooltip>
    </div>
  );
}

export default function WeeklyProgress({ weeklyPowerStats }: WeeklyProgressProps) {
  const { ref: containerRef, inView } = useInView(0.15);

  return (
    <div ref={containerRef} className="w-full lg:w-1/3 flex flex-col gap-6">
      <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest text-center border-b border-zinc-800 pb-3">
        Weekly Progress
      </h4>

      <div className="h-64 flex items-end justify-between gap-2 px-2">
        {weeklyPowerStats.map((w, idx) => (
          <WeeklyBarColumn
            key={`${w.weekLabel}-${idx}`}
            w={w}
            idx={idx}
            inView={inView}
          />
        ))}
      </div>
    </div>
  );
}
