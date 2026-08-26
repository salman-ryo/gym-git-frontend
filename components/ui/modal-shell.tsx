'use client';

import React, { useEffect, useCallback } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ModalShellProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | 'full';
  className?: string;
  containerClassName?: string;
  showCloseButton?: boolean;
  showTopAccent?: boolean;
  accentGradient?: string;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: React.ReactNode;
  errorMsg?: string | null;
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
}

const MAX_WIDTH_MAP = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '3xl': 'max-w-3xl',
  '4xl': 'max-w-4xl',
  full: 'max-w-full',
};

/**
 * Standardized Cyberpunk Modal Shell for Gym-Git
 * 
 * Provides unified backdrop blur, frame borders, animated scale entrance,
 * top neon gradient accent bar, close button, and error banner handling.
 */
export function ModalShell({
  isOpen,
  onClose,
  children,
  maxWidth = 'md',
  className,
  containerClassName,
  showCloseButton = true,
  showTopAccent = true,
  accentGradient = 'bg-gradient-to-r from-neon-green via-neon-cyan to-neon-purple',
  title,
  subtitle,
  icon,
  errorMsg,
  closeOnBackdropClick = true,
  closeOnEscape = true,
}: ModalShellProps) {
  // Handle escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (closeOnEscape && e.key === 'Escape') {
        onClose();
      }
    },
    [closeOnEscape, onClose]
  );

  // Lock body scroll when modal is open
  useEffect(() => {
    if (!isOpen) return;

    document.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnBackdropClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={handleBackdropClick}
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-zinc-950/85 backdrop-blur-xl animate-in fade-in duration-200',
        containerClassName
      )}
    >
      <div
        className={cn(
          'relative w-full bg-[#080c10]/95 border border-[rgba(0,255,136,0.2)] rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-7 shadow-[0_0_50px_rgba(0,0,0,0.9)] max-h-[92vh] flex flex-col animate-in scale-in-95 duration-200 overflow-hidden',
          MAX_WIDTH_MAP[maxWidth] || 'max-w-md',
          className
        )}
      >
        {/* Top Gradient Accent Bar */}
        {showTopAccent && (
          <div
            className={cn(
              'absolute top-0 left-0 right-0 h-[3px]',
              accentGradient
            )}
          />
        )}

        {/* Ambient Glow Effects */}
        <div
          className="absolute top-[-20%] left-[20%] w-48 h-48 bg-neon-cyan/10 rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        {/* Close Button */}
        {showCloseButton && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-3 sm:top-5 right-3 sm:right-5 text-zinc-400 hover:text-red-400 p-1.5 sm:p-2 rounded-xl bg-zinc-950/80 border border-zinc-800 hover:border-red-500/40 backdrop-blur-sm transition-all cursor-pointer group z-20"
          >
            <X className="w-4 h-4 transition-transform duration-200 group-hover:rotate-90" />
          </button>
        )}

        {/* Header (if title or icon provided) */}
        {(title || icon) && (
          <div className="flex items-center gap-2.5 sm:gap-3.5 mb-3.5 sm:mb-6 pb-3 sm:pb-4 border-b border-zinc-800/80 relative z-10 shrink-0">
            {icon && <div className="shrink-0">{icon}</div>}
            <div className="min-w-0 flex-1 pr-8 sm:pr-6">
              {typeof title === 'string' ? (
                <h3 className="text-sm sm:text-base font-black tracking-wide bg-gradient-to-r from-neon-green via-[#00e077] to-neon-cyan bg-clip-text text-transparent truncate">
                  {title}
                </h3>
              ) : (
                title
              )}
              {subtitle && (
                typeof subtitle === 'string' ? (
                  <p className="text-[11px] sm:text-xs text-zinc-400 font-medium mt-0.5 truncate sm:whitespace-normal">{subtitle}</p>
                ) : (
                  subtitle
                )
              )}
            </div>
          </div>
        )}

        {/* Standard Error Alert Banner */}
        {errorMsg && (
          <div className="mb-3 sm:mb-4 p-2.5 sm:p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200 shrink-0">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Modal Body Content */}
        <div className="relative z-10 overflow-y-auto no-scrollbar sm:custom-scrollbar flex-1 -mr-1 pr-1">{children}</div>
      </div>
    </div>
  );
}

export default ModalShell;
