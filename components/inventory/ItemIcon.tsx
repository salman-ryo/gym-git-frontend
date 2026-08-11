'use client';

import React from 'react';
import { Shield, Snowflake, Zap, Target } from 'lucide-react';
import Image from 'next/image';

interface ItemIconProps {
  itemId: string;
  imageSrc?: string;
  className?: string;
  size?: number;
}

export default function ItemIcon({ itemId, imageSrc, className = '', size = 24 }: ItemIconProps) {
  if (imageSrc) {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <Image
          src={imageSrc}
          alt={itemId}
          width={size}
          height={size}
          className="object-contain"
          unoptimized
        />
      </div>
    );
  }

  // Neon Cyberpunk icon renderers
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
      // Fallback
      return (
        <div className={`text-zinc-400 ${className}`}>
          <Target size={size} />
        </div>
      );
  }
}
