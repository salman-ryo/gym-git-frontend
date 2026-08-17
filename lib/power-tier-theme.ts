/**
 * Centralized Power Tiers & Color Theme System for Gym-Git
 * 
 * Provides unified theme colors, glow effects, particle palettes,
 * and tier classifications across the dashboard, progression path,
 * celebration modals, and power level charts.
 */

export interface PowerTierTheme {
  name: string;
  minScore: number;
  maxScore: number;
  primaryColor: string;
  borderColor: string;
  glowShadow: string;
  badgeClass: string;
}

export interface TierParticlePalette {
  primary: string;
  secondary: string;
  accent: string;
  glow: string;
}

export interface PowerColorThemeConfig {
  bar: string;
  container: string;
  text: string;
  scoreText: string;
}

export const POWER_TIERS: PowerTierTheme[] = [
  {
    name: 'Novice',
    minScore: 0,
    maxScore: 35,
    primaryColor: '#22d3ee',
    borderColor: 'border-cyan-400',
    glowShadow: 'shadow-[0_0_10px_rgba(34,211,238,0.5)]',
    badgeClass: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400',
  },
  {
    name: 'Apprentice',
    minScore: 35,
    maxScore: 55,
    primaryColor: '#34d399',
    borderColor: 'border-emerald-400',
    glowShadow: 'shadow-[0_0_10px_rgba(52,211,153,0.5)]',
    badgeClass: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
  },
  {
    name: 'Adept',
    minScore: 55,
    maxScore: 72,
    primaryColor: '#818cf8',
    borderColor: 'border-indigo-400',
    glowShadow: 'shadow-[0_0_10px_rgba(129,140,248,0.5)]',
    badgeClass: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400',
  },
  {
    name: 'Expert',
    minScore: 72,
    maxScore: 88,
    primaryColor: '#c084fc',
    borderColor: 'border-purple-400',
    glowShadow: 'shadow-[0_0_10px_rgba(192,132,252,0.5)]',
    badgeClass: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
  },
  {
    name: 'Master',
    minScore: 88,
    maxScore: 97,
    primaryColor: '#f43f5e',
    borderColor: 'border-rose-400',
    glowShadow: 'shadow-[0_0_10px_rgba(244,63,94,0.5)]',
    badgeClass: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
  },
  {
    name: 'Legend',
    minScore: 97,
    maxScore: 100,
    primaryColor: '#f59e0b',
    borderColor: 'border-amber-400',
    glowShadow: 'shadow-[0_0_15px_rgba(245,158,11,0.6)]',
    badgeClass: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
  },
];

/**
 * Returns the border and glow style for character portrait nodes (e.g. in ProgressionPath).
 */
export function getTierColor(score: number): string {
  if (score < 35) return 'border-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]';
  if (score < 55) return 'border-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]';
  if (score < 72) return 'border-indigo-400 shadow-[0_0_10px_rgba(129,140,248,0.5)]';
  if (score < 88) return 'border-purple-400 shadow-[0_0_10px_rgba(192,132,252,0.5)]';
  if (score < 97) return 'border-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.5)]';
  return 'border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.6)]';
}

/**
 * Returns complete styling classes for weekly/monthly power score charts.
 */
export function getPowerColorTheme(score: number, isCurrent = false): PowerColorThemeConfig {
  if (score === 0) {
    return {
      bar: 'bg-transparent',
      container: 'border-zinc-800/80 group-hover:border-zinc-700',
      text: 'text-zinc-600 group-hover:text-zinc-500 font-bold',
      scoreText: 'text-zinc-600 group-hover:text-zinc-500 mb-1 transition-all',
    };
  }

  if (score < 35) {
    return {
      bar: isCurrent
        ? 'bg-gradient-to-t from-cyan-600 via-sky-400 to-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.6)]'
        : 'bg-gradient-to-t from-cyan-900/80 to-sky-700/80 group-hover:from-cyan-600 group-hover:to-sky-400',
      container: isCurrent
        ? 'border-cyan-400/80 shadow-[0_0_15px_rgba(34,211,238,0.5)] z-10'
        : 'border-zinc-800/80 group-hover:border-cyan-500/50 group-hover:shadow-[0_0_10px_rgba(34,211,238,0.2)]',
      text: isCurrent
        ? 'text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.8)] font-bold underline underline-offset-4 decoration-cyan-500/50'
        : 'text-zinc-500 group-hover:text-cyan-400 font-bold transition-colors',
      scoreText:
        'text-[10px] font-black text-zinc-500 mb-1 group-hover:text-cyan-400 group-hover:drop-shadow-[0_0_5px_rgba(34,211,238,0.8)] transition-all',
    };
  }

  if (score < 55) {
    return {
      bar: isCurrent
        ? 'bg-gradient-to-t from-emerald-600 via-teal-400 to-emerald-300 shadow-[0_0_15px_rgba(52,211,153,0.6)]'
        : 'bg-gradient-to-t from-emerald-900/80 to-teal-700/80 group-hover:from-emerald-600 group-hover:to-teal-400',
      container: isCurrent
        ? 'border-emerald-400/80 shadow-[0_0_15px_rgba(52,211,153,0.5)] z-10'
        : 'border-zinc-800/80 group-hover:border-emerald-500/50 group-hover:shadow-[0_0_10px_rgba(52,211,153,0.2)]',
      text: isCurrent
        ? 'text-emerald-400 drop-shadow-[0_0_5px_rgba(52,211,153,0.8)] font-bold underline underline-offset-4 decoration-emerald-500/50'
        : 'text-zinc-500 group-hover:text-emerald-400 font-bold transition-colors',
      scoreText:
        'text-[10px] font-black text-zinc-500 mb-1 group-hover:text-emerald-400 group-hover:drop-shadow-[0_0_5px_rgba(52,211,153,0.8)] transition-all',
    };
  }

  if (score < 72) {
    return {
      bar: isCurrent
        ? 'bg-gradient-to-t from-indigo-600 via-violet-400 to-indigo-300 shadow-[0_0_15px_rgba(129,140,248,0.6)]'
        : 'bg-gradient-to-t from-indigo-900/80 to-violet-700/80 group-hover:from-indigo-600 group-hover:to-violet-400',
      container: isCurrent
        ? 'border-indigo-400/80 shadow-[0_0_15px_rgba(129,140,248,0.5)] z-10'
        : 'border-zinc-800/80 group-hover:border-indigo-500/50 group-hover:shadow-[0_0_10px_rgba(129,140,248,0.2)]',
      text: isCurrent
        ? 'text-indigo-400 drop-shadow-[0_0_5px_rgba(129,140,248,0.8)] font-bold underline underline-offset-4 decoration-indigo-500/50'
        : 'text-zinc-500 group-hover:text-indigo-400 font-bold transition-colors',
      scoreText:
        'text-[10px] font-black text-zinc-500 mb-1 group-hover:text-indigo-400 group-hover:drop-shadow-[0_0_5px_rgba(129,140,248,0.8)] transition-all',
    };
  }

  if (score < 88) {
    return {
      bar: isCurrent
        ? 'bg-gradient-to-t from-purple-600 via-fuchsia-400 to-purple-300 shadow-[0_0_15px_rgba(192,132,252,0.6)]'
        : 'bg-gradient-to-t from-purple-900/80 to-fuchsia-700/80 group-hover:from-purple-600 group-hover:to-fuchsia-400',
      container: isCurrent
        ? 'border-purple-400/80 shadow-[0_0_15px_rgba(192,132,252,0.5)] z-10'
        : 'border-zinc-800/80 group-hover:border-purple-500/50 group-hover:shadow-[0_0_10px_rgba(192,132,252,0.2)]',
      text: isCurrent
        ? 'text-purple-400 drop-shadow-[0_0_5px_rgba(192,132,252,0.8)] font-bold underline underline-offset-4 decoration-purple-500/50'
        : 'text-zinc-500 group-hover:text-purple-400 font-bold transition-colors',
      scoreText:
        'text-[10px] font-black text-zinc-500 mb-1 group-hover:text-purple-400 group-hover:drop-shadow-[0_0_5px_rgba(192,132,252,0.8)] transition-all',
    };
  }

  if (score < 97) {
    return {
      bar: isCurrent
        ? 'bg-gradient-to-t from-rose-600 via-pink-400 to-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.6)]'
        : 'bg-gradient-to-t from-rose-900/80 to-pink-700/80 group-hover:from-rose-600 group-hover:to-pink-400',
      container: isCurrent
        ? 'border-rose-400/80 shadow-[0_0_15px_rgba(244,63,94,0.5)] z-10'
        : 'border-zinc-800/80 group-hover:border-rose-500/50 group-hover:shadow-[0_0_10px_rgba(244,63,94,0.2)]',
      text: isCurrent
        ? 'text-rose-400 drop-shadow-[0_0_5px_rgba(244,63,94,0.8)] font-bold underline underline-offset-4 decoration-rose-500/50'
        : 'text-zinc-500 group-hover:text-rose-400 font-bold transition-colors',
      scoreText:
        'text-[10px] font-black text-zinc-500 mb-1 group-hover:text-rose-400 group-hover:drop-shadow-[0_0_5px_rgba(244,63,94,0.8)] transition-all',
    };
  }

  return {
    bar: isCurrent
      ? 'bg-gradient-to-t from-amber-600 via-orange-400 to-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.6)]'
      : 'bg-gradient-to-t from-amber-900/80 to-orange-700/80 group-hover:from-amber-600 group-hover:to-orange-400',
    container: isCurrent
      ? 'border-amber-400/80 shadow-[0_0_15px_rgba(245,158,11,0.5)] z-10'
      : 'border-zinc-800/80 group-hover:border-amber-500/50 group-hover:shadow-[0_0_10px_rgba(245,158,11,0.2)]',
    text: isCurrent
      ? 'text-amber-400 drop-shadow-[0_0_5px_rgba(245,158,11,0.8)] font-bold underline underline-offset-4 decoration-amber-500/50'
      : 'text-zinc-500 group-hover:text-amber-400 font-bold transition-colors',
    scoreText:
      'text-[10px] font-black text-zinc-500 mb-1 group-hover:text-amber-400 group-hover:drop-shadow-[0_0_5px_rgba(245,158,11,0.8)] transition-all',
  };
}

/**
 * Returns hex and rgba particle color values for canvas celebrations and character power aura.
 */
export function getTierParticleColors(score: number): TierParticlePalette {
  if (score < 35) {
    return {
      primary: '#22d3ee',
      secondary: '#38bdf8',
      accent: '#a5f3fc',
      glow: 'rgba(34, 211, 238, 0.8)',
    };
  }
  if (score < 55) {
    return {
      primary: '#34d399',
      secondary: '#2dd4bf',
      accent: '#6ee7b7',
      glow: 'rgba(52, 211, 153, 0.8)',
    };
  }
  if (score < 72) {
    return {
      primary: '#818cf8',
      secondary: '#a78bfa',
      accent: '#c7d2fe',
      glow: 'rgba(129, 140, 248, 0.8)',
    };
  }
  if (score < 88) {
    return {
      primary: '#c084fc',
      secondary: '#e879f9',
      accent: '#f5d0fe',
      glow: 'rgba(192, 132, 252, 0.8)',
    };
  }
  if (score < 97) {
    return {
      primary: '#f43f5e',
      secondary: '#fb7185',
      accent: '#fecdd3',
      glow: 'rgba(244, 63, 94, 0.8)',
    };
  }
  return {
    primary: '#f59e0b',
    secondary: '#fbbf24',
    accent: '#fef08a',
    glow: 'rgba(245, 158, 11, 0.9)',
  };
}

/**
 * Returns human-readable tier classification name.
 */
export function getTierName(score: number): string {
  const tier = POWER_TIERS.find((t) => score >= t.minScore && score < t.maxScore);
  return tier ? tier.name : 'Legend';
}

/**
 * Returns badge class for a power score.
 */
export function getTierBadgeClass(score: number): string {
  const tier = POWER_TIERS.find((t) => score >= t.minScore && score < t.maxScore);
  return tier ? tier.badgeClass : 'bg-amber-500/10 border-amber-500/20 text-amber-400';
}
