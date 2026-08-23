'use client';

import React, { useState } from 'react';
import { Shield, Snowflake, Zap, Target } from 'lucide-react';
import Image from 'next/image';

interface ItemIconProps {
  itemId: string;
  imageSrc?: string;
  className?: string;
  size?: number;
}

export const ITEM_IMAGE_MAP: Record<string, string> = {
  RESTORE_SHIELD: '/icons/shield.png',
  STREAK_FREEZE_TOKEN: '/icons/freeze.png',
  XP_BOOST: '/icons/xp-boost.png',
  ACCURACY_CHARM: '/icons/charm.png',
};

export function getItemImageSrc(itemId: string): string {
  if (ITEM_IMAGE_MAP[itemId]) {
    return ITEM_IMAGE_MAP[itemId];
  }
  return `/icons/${itemId.toLowerCase().replace(/_/g, '-')}.png`;
}

export default function ItemIcon({ itemId, imageSrc, className = '', size = 24 }: ItemIconProps) {
  const [imageError, setImageError] = useState(false);
  const resolvedSrc = imageSrc || getItemImageSrc(itemId);

  if (!imageError && resolvedSrc) {
    return (
      <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
        <Image
          src={resolvedSrc}
          alt={itemId}
          width={size}
          height={size}
          className="object-contain"
          onError={() => setImageError(true)}
          unoptimized
        />
      </div>
    );
  }

  // Fallback Lucide icons when PNG asset is not available
  switch (itemId) {
    case 'RESTORE_SHIELD':
      return (
        <div className={`text-neon-cyan drop-shadow-[0_0_8px_rgba(34,211,238,0.5)] ${className}`}>
          <Shield size={size} className="fill-neon-cyan/10" />
        </div>
      );
    case 'STREAK_FREEZE_TOKEN':
      return (
        <div className={`text-sky-400 drop-shadow-[0_0_8px_rgba(56,189,248,0.5)] ${className}`}>
          <Snowflake size={size} className="fill-sky-400/10" />
        </div>
      );
    case 'XP_BOOST':
      return (
        <div className={`text-neon-purple drop-shadow-[0_0_8px_rgba(168,85,247,0.5)] ${className}`}>
          <Zap size={size} className="fill-neon-purple/10" />
        </div>
      );
    case 'ACCURACY_CHARM':
      return (
        <div className={`text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)] ${className}`}>
          <Target size={size} className="fill-amber-400/10" />
        </div>
      );
    default:
      return (
        <div className={`text-zinc-400 ${className}`}>
          <Target size={size} />
        </div>
      );
  }
}
