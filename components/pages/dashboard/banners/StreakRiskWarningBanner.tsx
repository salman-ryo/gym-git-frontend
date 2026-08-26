'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Dumbbell, X, Clock } from 'lucide-react';
import { StreakWarningEvent } from '@/lib/types';
import './streakbanner.css'; // Import the new advanced CSS

interface StreakRiskWarningBannerProps {
  event: StreakWarningEvent | null;
  currentStreak?: number;
  onLogWorkoutClick: () => void;
}

interface WarningAnimeCharacter {
  id: string;
  name: string;
  image: string;
  themeColor: string; // Used for CSS variables to color the bubble dynamically
  quote: string;
}

const SNOOZE_STORAGE_KEY = 'gymgit_streak_warning_snooze_until';
const SNOOZE_DURATION_MS = 30 * 60 * 1000; // 30 minutes

function isTimeEligibleForReminder(): boolean {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  // 11:30 PM is 23:30. Eligible if current time is 11:30 PM or earlier.
  return hours < 23 || (hours === 23 && minutes <= 30);
}

function getInitialSnooze(): { snoozedUntil: number | null; isSnoozed: boolean } {
  if (typeof window === 'undefined') return { snoozedUntil: null, isSnoozed: false };
  try {
    const stored = localStorage.getItem(SNOOZE_STORAGE_KEY);
    if (stored) {
      const until = parseInt(stored, 10);
      if (!isNaN(until) && until > Date.now()) {
        return { snoozedUntil: until, isSnoozed: true };
      }
      localStorage.removeItem(SNOOZE_STORAGE_KEY);
    }
  } catch {
    // ignore
  }
  return { snoozedUntil: null, isSnoozed: false };
}

const WARNING_ANIME_CHARACTERS: WarningAnimeCharacter[] = [
  {
    id: 'aqua',
    name: 'Aqua',
    image: '/images/anime/aqua.webp',
    themeColor: '#3b82f6', // Water Blue
    quote: "Waaah! You can't just lose your streak now! What are you going to do if it resets? Hurry up and log your workout before I start crying!",
  },
  {
    id: 'deku',
    name: 'Deku',
    image: '/images/anime/deku.webp',
    themeColor: '#22c55e', // Hero Green
    quote: "Plus Ultra! Midnight is approaching fast — log your session and keep the momentum alive!",
  },
  {
    id: 'asta',
    name: 'Asta',
    image: '/images/anime/asta.webp',
    themeColor: '#ef4444', // Anti-magic Red
    quote: "NOT GIVING UP IS MY MAGIC! Don't let your streak die tonight, push past your limits!",
  },
  {
    id: 'levi',
    name: 'Levi Ackerman',
    image: '/images/anime/levi.webp',
    themeColor: '#94a3b8', // Steel/Slate
    quote: "Make a decision with no regrets. Log your workout before midnight or lose your streak.",
  },
  {
    id: 'gojo',
    name: 'Gojo Satoru',
    image: '/images/anime/gojo.webp',
    themeColor: '#38bdf8', // Limitless Sky Blue
    quote: "Throughout heaven and earth, you alone shouldn't lose this streak today. Don't slack off!",
  },
  {
    id: 'goku',
    name: 'Goku',
    image: '/images/anime/goku.webp',
    themeColor: '#f59e0b', // Super Saiyan Amber
    quote: "Hey, I heard your streak is in danger! Don't let your power level drop before midnight!",
  },
  {
    id: 'luffy',
    name: 'Luffy',
    image: '/images/anime/luffy.webp',
    themeColor: '#a855f7', // Haki Purple (Matches your UI)
    quote: "Oi! The day's almost over! Finish your workout so we can celebrate with meat!",
  },
  {
    id: 'muminrider',
    name: 'Mumen Rider',
    image: '/images/anime/muminrider.webp',
    themeColor: '#2dd4bf', // Justice Teal
    quote: "Justice doesn't rest! Even a quick workout will keep your heroic streak intact!",
  },
  {
    id: 'naruto',
    name: 'Naruto Uzumaki',
    image: '/images/anime/naruto.webp',
    themeColor: '#f97316', // Hokage Orange
    quote: "Believe it! A true ninja never breaks their training schedule. Get those reps in!",
  },
  {
    id: 'tanjiro',
    name: 'Tanjiro Kamado',
    image: '/images/anime/tanjiro.webp',
    themeColor: '#10b981', // Breath of Water Emerald
    quote: "Total concentration! Don't let your hard-earned discipline slip away tonight!",
  },
  {
    id: 'zoro',
    name: 'Roronoa Zoro',
    image: '/images/anime/zoro.webp',
    themeColor: '#16a34a', // Swordsman Dark Green
    quote: "Hey! Don't let your streak get sliced in half at midnight. Get in there and train!",
  }
];

function calculateTimeLeft(): string {
  const now = new Date();
  const midnight = new Date();
  midnight.setHours(23, 59, 59, 999);

  const diffMs = midnight.getTime() - now.getTime();
  if (diffMs <= 0) return '00:00:00';

  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

  const pad = (num: number) => String(num).padStart(2, '0');
  return `${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`;
}

export default function StreakRiskWarningBanner({
  event,
  currentStreak = 0,
  onLogWorkoutClick,
}: StreakRiskWarningBannerProps) {
  const [timeLeft, setTimeLeft] = useState<string>(calculateTimeLeft);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [snoozeState, setSnoozeState] = useState<{ snoozedUntil: number | null; isSnoozed: boolean }>(getInitialSnooze);
  const [canRemindLater, setCanRemindLater] = useState<boolean>(isTimeEligibleForReminder);
  const [character] = useState<WarningAnimeCharacter>(() => {
    // Pick a random character on mount
    return WARNING_ANIME_CHARACTERS[Math.floor(Math.random() * WARNING_ANIME_CHARACTERS.length)];
  });

  // Update countdown, snooze status, and reminder eligibility every second
  useEffect(() => {
    if (!event) return;
    const interval = setInterval(() => {
      const now = Date.now();
      setTimeLeft(calculateTimeLeft());
      setCanRemindLater(isTimeEligibleForReminder());

      if (snoozeState.snoozedUntil) {
        if (now >= snoozeState.snoozedUntil) {
          setSnoozeState({ snoozedUntil: null, isSnoozed: false });
          try {
            localStorage.removeItem(SNOOZE_STORAGE_KEY);
          } catch {
            // ignore
          }
        }
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [event, snoozeState.snoozedUntil]);

  const handleRemindMeLater = () => {
    if (!isTimeEligibleForReminder()) return;
    const snoozeTime = Date.now() + SNOOZE_DURATION_MS;
    try {
      localStorage.setItem(SNOOZE_STORAGE_KEY, snoozeTime.toString());
    } catch {
      // ignore
    }
    setSnoozeState({ snoozedUntil: snoozeTime, isSnoozed: true });
    setIsExpanded(false);
  };

  // Hide the anime banner completely if not at risk, no streak, or currently snoozed
  if (
    !event ||
    !event.is_at_risk ||
    currentStreak <= 0 ||
    snoozeState.isSnoozed
  ) {
    return null;
  }

  // Dynamically generate the character's second sentence based on app state
  const getContextualDialogue = () => {
    if (event.rest_tokens_left === 0) {
      return `I checked your stats—you haven't logged today's workout and you're completely out of rest tokens! You have exactly ${timeLeft} to get it done, or your ${currentStreak}-day streak is going to turn to ash. Get to it!`;
    }
    return `You haven't logged a workout today! You only have ${timeLeft} left before midnight. Keep your ${currentStreak}-day streak alive!`;
  };

  // Set the dynamic color variable for our CSS file
  const bubbleStyle = { '--character-color': character.themeColor } as React.CSSProperties;

  return (
    <div className="anime-mascot-container">

      {/* Avatar Section */}
      <button
        type="button"
        onClick={() => setIsExpanded((prev) => !prev)}
        className="relative shrink-0 outline-none cursor-pointer group"
        aria-label="Toggle character message"
      >
        {/* Glow effect behind avatar */}
        <div
          className="absolute -inset-1.5 sm:-inset-2 rounded-full blur-lg sm:blur-xl opacity-40 group-hover:opacity-70 transition-opacity duration-300"
          style={{ backgroundColor: character.themeColor }}
        />

        {/* Avatar Image */}
        <div
          className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 bg-zinc-950 overflow-hidden shadow-xl transition-transform duration-300 group-hover:scale-105"
          style={{ borderColor: character.themeColor }}
        >
          <Image
            src={character.image}
            alt={character.name}
            fill
            className="object-cover"
            unoptimized
          />
        </div>

        {/* Notification Badge */}
        <span className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-red-600 border-2 border-[#080c13] flex items-center justify-center text-[10px] sm:text-xs text-white shadow-md animate-bounce">
          🔥
        </span>
      </button>

      {/* Speech Bubble Section */}
      {!isExpanded ? (
        /* Collapsed State: Just the tail and typing dots */
        <div
          className="manga-speech-bubble collapsed"
          style={bubbleStyle}
          onClick={() => setIsExpanded(true)}
        >
          <div className="typing-dots">
            <span />
            <span />
            <span />
          </div>
        </div>
      ) : (
        /* Expanded State: Full Character Dialogue */
        <div className="manga-speech-bubble bubble-enter" style={bubbleStyle}>

          {/* Close Button placed discreetly in the corner of the bubble */}
          <button
            onClick={() => setIsExpanded(false)}
            aria-label="Close dialog"
            className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 text-zinc-500 hover:text-zinc-200 p-1.5 rounded-full transition-colors z-10 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Dialogue Content */}
          <div className="relative z-10 space-y-1.5 sm:space-y-3 pb-2 sm:pb-4 pr-6 sm:pr-0">
            <p className="text-xs sm:text-sm font-medium text-zinc-100 italic leading-relaxed">
              &ldquo;{character.quote}&rdquo;
            </p>

            {/* Contextual stat warning spoken by the character */}
            <p className="text-[11px] sm:text-xs text-zinc-300 leading-relaxed">
              {getContextualDialogue()}
            </p>

            <span className="block pt-0.5 sm:pt-1 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-zinc-500">
              — {character.name}
            </span>
          </div>

          {/* App-level Action Buttons contained inside the bubble */}
          <div className="pt-3 sm:pt-4 mt-1 sm:mt-2 border-t border-zinc-800/60 flex flex-col sm:flex-row gap-2 sm:gap-3 relative z-10">
            <button
              onClick={onLogWorkoutClick}
              className="flex-1 py-2 sm:py-2.5 px-3 min-h-[40px] sm:min-h-[44px] rounded-xl bg-white text-zinc-950 font-black text-xs uppercase tracking-wider transition-transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer shadow-md"
              style={{ boxShadow: `0 0 15px ${character.themeColor}40` }}
            >
              <Dumbbell className="w-4 h-4 shrink-0" />
              <span>Log Workout Now</span>
            </button>
            {canRemindLater && (
              <button
                onClick={handleRemindMeLater}
                className="px-3 sm:px-4 py-2 sm:py-2.5 min-h-[40px] sm:min-h-[44px] rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 border border-zinc-800 cursor-pointer"
              >
                <Clock className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                <span>Remind Me Later</span>
              </button>
            )}
            <button
              onClick={() => setIsExpanded(false)}
              className="px-4 py-2 sm:py-2.5 min-h-[40px] sm:min-h-[44px] rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
}