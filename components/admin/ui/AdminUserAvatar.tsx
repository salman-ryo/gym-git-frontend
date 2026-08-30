'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { User as UserIcon } from 'lucide-react';

interface AdminUserAvatarProps {
  src?: string | null;
  name?: string | null;
  email?: string | null;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  shape?: 'circle' | 'rounded';
  className?: string;
  alt?: string;
}

const sizeClasses = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-2xl',
};

const shapeClasses = {
  circle: 'rounded-full',
  rounded: 'rounded-2xl',
};

export function AdminUserAvatar({
  src,
  name,
  email,
  size = 'sm',
  shape = 'circle',
  className,
  alt,
}: AdminUserAvatarProps) {
  const [imageError, setImageError] = useState(false);

  const initial = (name ? name.trim().charAt(0) : email ? email.trim().charAt(0) : '').toUpperCase();
  const avatarUrl = src && !imageError ? src : null;

  return (
    <div
      className={cn(
        'relative overflow-hidden shrink-0 flex items-center justify-center font-black select-none border border-zinc-800 bg-zinc-900',
        sizeClasses[size],
        shapeClasses[shape],
        className
      )}
    >
      {avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={avatarUrl}
          alt={alt || name || email || 'User Avatar'}
          onError={() => setImageError(true)}
          className="w-full h-full object-cover"
        />
      ) : initial ? (
        <div className="w-full h-full bg-gradient-to-tr from-neon-green to-neon-cyan text-zinc-950 flex items-center justify-center font-black">
          {initial}
        </div>
      ) : (
        <div className="w-full h-full bg-zinc-800 text-zinc-400 flex items-center justify-center">
          <UserIcon className="w-1/2 h-1/2" />
        </div>
      )}
    </div>
  );
}

export default AdminUserAvatar;

