'use client';

import React, { useState } from 'react';
import { AlertTriangle, AlertCircle, Info, Loader2, X } from 'lucide-react';

interface AdminConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  requiredConfirmationPhrase?: string;
  loading?: boolean;
}

export function AdminConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm Action',
  cancelText = 'Cancel',
  variant = 'warning',
  requiredConfirmationPhrase,
  loading: externalLoading = false,
}: AdminConfirmModalProps) {
  const [typedPhrase, setTypedPhrase] = useState('');
  const [internalLoading, setInternalLoading] = useState(false);

  if (!isOpen) return null;

  const isLoading = externalLoading || internalLoading;
  const isPhraseMatched = !requiredConfirmationPhrase || typedPhrase.trim() === requiredConfirmationPhrase;

  const handleConfirm = async () => {
    if (!isPhraseMatched || isLoading) return;
    try {
      setInternalLoading(true);
      await onConfirm();
      onClose();
    } catch (err) {
      console.error('[AdminConfirmModal] Action failed:', err);
    } finally {
      setInternalLoading(false);
      setTypedPhrase('');
    }
  };

  const handleClose = () => {
    if (isLoading) return;
    setTypedPhrase('');
    onClose();
  };

  const variantStyles = {
    danger: {
      iconBg: 'bg-rose-950/60 border-rose-500/30 text-rose-400',
      icon: AlertCircle,
      buttonBg: 'bg-rose-600 hover:bg-rose-500 text-white shadow-[0_0_20px_rgba(244,63,94,0.4)]',
    },
    warning: {
      iconBg: 'bg-amber-950/60 border-amber-500/30 text-amber-400',
      icon: AlertTriangle,
      buttonBg: 'bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black shadow-[0_0_20px_rgba(245,158,11,0.3)]',
    },
    info: {
      iconBg: 'bg-cyan-950/60 border-cyan-500/30 text-cyan-400',
      icon: Info,
      buttonBg: 'bg-neon-cyan hover:bg-cyan-300 text-zinc-950 font-black shadow-[0_0_20px_rgba(34,211,238,0.3)]',
    },
  }[variant];

  const IconComponent = variantStyles.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl bg-zinc-950 border border-zinc-800 p-6 shadow-2xl overflow-hidden">
        {/* Top close button */}
        <button
          onClick={handleClose}
          disabled={isLoading}
          aria-label="Close dialog"
          className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-300 transition-colors p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-xl border shrink-0 ${variantStyles.iconBg}`}>
            <IconComponent className="w-6 h-6" />
          </div>

          <div className="flex-1">
            <h3 className="text-lg font-black text-white tracking-tight">{title}</h3>
            <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{description}</p>
          </div>
        </div>

        {requiredConfirmationPhrase && (
          <div className="mt-5 p-3 rounded-xl bg-zinc-900/90 border border-zinc-800">
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
              Type <strong className="text-white font-mono font-bold select-all">&quot;{requiredConfirmationPhrase}&quot;</strong> to confirm:
            </label>
            <input
              type="text"
              value={typedPhrase}
              onChange={(e) => setTypedPhrase(e.target.value)}
              placeholder={requiredConfirmationPhrase}
              disabled={isLoading}
              className="w-full bg-zinc-950 border border-zinc-800 focus:border-neon-cyan rounded-lg px-3 py-2 text-xs text-white placeholder:text-zinc-600 focus:outline-none font-mono"
            />
          </div>
        )}

        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-zinc-800/80">
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all text-xs font-semibold"
          >
            {cancelText}
          </button>

          <button
            onClick={handleConfirm}
            disabled={!isPhraseMatched || isLoading}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 disabled:opacity-40 disabled:pointer-events-none ${variantStyles.buttonBg}`}
          >
            {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminConfirmModal;

