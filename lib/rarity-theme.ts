/**
 * Centralized Item Rarity & RPG Buff Theme Definitions for Gym-Git
 * 
 * Unifies styling, glows, badges, borders, and gradient tokens
 * across InventoryDrawer, RoadmapMilestoneNode, ClaimCelebrationModal, and ActiveEffectsBar.
 */

export type ItemRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface RarityThemeConfig {
  border: string;
  glow: string;
  badge: string;
  text: string;
  background: string;
  gradient: string;
  iconBg: string;
  lockedBorder: string;
  lockedTitle: string;
  lockedBadge: string;
  lockedIconBg: string;
  ring: string;
}

export const RARITY_THEMES: Record<ItemRarity, RarityThemeConfig> = {
  common: {
    border: 'border-zinc-700 bg-zinc-900/40 hover:border-zinc-600',
    glow: '',
    badge: 'bg-zinc-800 border-zinc-700 text-zinc-300',
    text: 'text-zinc-400',
    background: 'bg-zinc-900/40',
    gradient: 'from-zinc-500/20 via-zinc-500/10 to-transparent',
    iconBg: 'bg-zinc-900 border-zinc-800',
    lockedBorder: 'border-zinc-800/50 bg-zinc-900/20',
    lockedTitle: 'text-zinc-600',
    lockedBadge: 'bg-zinc-900/50 border-zinc-800/50 text-zinc-600',
    lockedIconBg: 'bg-zinc-900/30 border-zinc-800/50',
    ring: 'ring-zinc-600',
  },
  rare: {
    border: 'border-neon-cyan/30 bg-neon-cyan/10 hover:border-neon-cyan/50',
    glow: 'hover:shadow-[0_0_15px_rgba(34,211,238,0.2)] shadow-[0_0_20px_rgba(34,211,238,0.15)]',
    badge: 'bg-neon-cyan/10 border-neon-cyan/20 text-neon-cyan',
    text: 'text-neon-cyan font-bold',
    background: 'bg-neon-cyan/10',
    gradient: 'from-cyan-500/30 via-cyan-500/10 to-transparent text-neon-cyan border-neon-cyan/40 shadow-[0_0_30px_rgba(34,211,238,0.2)]',
    iconBg: 'bg-zinc-900 border-neon-cyan/30',
    lockedBorder: 'border-neon-cyan/10 bg-neon-cyan/[0.02]',
    lockedTitle: 'text-neon-cyan/40',
    lockedBadge: 'bg-neon-cyan/5 border-neon-cyan/10 text-neon-cyan/40',
    lockedIconBg: 'bg-zinc-900/50 border-neon-cyan/10',
    ring: 'ring-neon-cyan',
  },
  epic: {
    border: 'border-neon-purple/30 bg-neon-purple/10 hover:border-neon-purple/50',
    glow: 'hover:shadow-[0_0_15px_rgba(168,85,247,0.2)] shadow-[0_0_20px_rgba(168,85,247,0.15)]',
    badge: 'bg-neon-purple/10 border-neon-purple/20 text-neon-purple',
    text: 'text-neon-purple font-extrabold',
    background: 'bg-neon-purple/10',
    gradient: 'from-purple-500/35 via-purple-500/15 to-transparent text-neon-purple border-neon-purple/40 shadow-[0_0_35px_rgba(168,85,247,0.25)]',
    iconBg: 'bg-zinc-900 border-neon-purple/30',
    lockedBorder: 'border-neon-purple/10 bg-neon-purple/[0.02]',
    lockedTitle: 'text-neon-purple/40',
    lockedBadge: 'bg-neon-purple/5 border-neon-purple/10 text-neon-purple/40',
    lockedIconBg: 'bg-zinc-900/50 border-neon-purple/10',
    ring: 'ring-neon-purple',
  },
  legendary: {
    border: 'border-amber-400/30 bg-amber-400/10 hover:border-amber-400/50',
    glow: 'hover:shadow-[0_0_15px_rgba(251,191,36,0.25)] shadow-[0_0_25px_rgba(251,191,36,0.2)]',
    badge: 'bg-amber-400/10 border-amber-400/20 text-amber-400',
    text: 'text-amber-400 font-black animate-pulse',
    background: 'bg-amber-400/10',
    gradient: 'from-amber-400/40 via-amber-400/20 to-transparent text-amber-400 border-amber-400/50 shadow-[0_0_40px_rgba(251,191,36,0.3)]',
    iconBg: 'bg-zinc-900 border-amber-400/30',
    lockedBorder: 'border-amber-400/10 bg-amber-400/[0.02]',
    lockedTitle: 'text-amber-400/40',
    lockedBadge: 'bg-amber-400/5 border-amber-400/10 text-amber-400/40',
    lockedIconBg: 'bg-zinc-900/50 border-amber-400/10',
    ring: 'ring-amber-400',
  },
};

/**
 * Resolves a normalized ItemRarity from any string representation.
 */
export function normalizeRarity(rarity?: string | null): ItemRarity {
  if (!rarity) return 'common';
  const lower = rarity.toLowerCase().trim();
  if (lower in RARITY_THEMES) {
    return lower as ItemRarity;
  }
  return 'common';
}

/**
 * Returns full style properties for a given item rarity and locked state.
 */
export function getRarityStyles(rarity?: string | null, isLocked = false) {
  const norm = normalizeRarity(rarity);
  const theme = RARITY_THEMES[norm];

  if (isLocked) {
    return {
      border: theme.lockedBorder,
      glow: '',
      badge: theme.lockedBadge,
      text: theme.lockedTitle,
      title: theme.lockedTitle,
      background: 'bg-zinc-900/20',
      gradient: 'from-zinc-900/20 to-transparent',
      iconBg: theme.lockedIconBg,
      ring: 'ring-zinc-800',
      lockedText: theme.lockedTitle,
    };
  }

  return {
    border: theme.border,
    glow: theme.glow,
    badge: theme.badge,
    text: theme.text,
    title: theme.text,
    background: theme.background,
    gradient: theme.gradient,
    iconBg: theme.iconBg,
    ring: theme.ring,
    lockedText: theme.lockedTitle,
  };
}

export function getRarityBorderClass(rarity?: string | null, isLocked = false): string {
  return getRarityStyles(rarity, isLocked).border;
}

export function getRarityGlowClass(rarity?: string | null, isLocked = false): string {
  return getRarityStyles(rarity, isLocked).glow;
}

export function getRarityBadgeClass(rarity?: string | null, isLocked = false): string {
  return getRarityStyles(rarity, isLocked).badge;
}

export function getRarityTextClass(rarity?: string | null, isLocked = false): string {
  return getRarityStyles(rarity, isLocked).text;
}

export function getRarityBackgroundClass(rarity?: string | null, isLocked = false): string {
  return getRarityStyles(rarity, isLocked).background;
}

export function getRarityGradientGlow(rarity?: string | null): string {
  const norm = normalizeRarity(rarity);
  return RARITY_THEMES[norm].gradient;
}
