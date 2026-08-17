'use client';

import React, { useState } from 'react';
import { Snowflake, ShieldAlert } from 'lucide-react';
import { freezeStreak } from '@/lib/streak-service';
import ModalShell from '@/components/ui/modal-shell';

export interface FreezeModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableTokens: number;
  onSuccess: () => Promise<void>;
}

const PRESET_REASONS = [
  { id: 'sick', label: '🤒 Sickness / Flu recovery', defaultText: 'Flu/Sickness recovery' },
  { id: 'injury', label: '🤕 Muscle / Joint injury', defaultText: 'Injury/Rehab pause' },
  { id: 'travel', label: '✈️ Travel / No gym access', defaultText: 'Travel - No gym access' },
  { id: 'other', label: '⚙️ Other reason', defaultText: '' },
];

export default function FreezeModal({
  isOpen,
  onClose,
  availableTokens,
  onSuccess,
}: FreezeModalProps) {
  const maxDays = Math.min(7, availableTokens);
  const [selectedDuration, setSelectedDuration] = useState<number>(maxDays > 0 ? 1 : 0);
  const [selectedReasonId, setSelectedReasonId] = useState<string>('sick');
  const [customReason, setCustomReason] = useState<string>('');
  const [saving, setSaving] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleActivate = async () => {
    if (selectedDuration <= 0) {
      setErrorMsg('Please select a valid duration.');
      return;
    }
    if (selectedDuration > availableTokens) {
      setErrorMsg("You don't have enough Streak Freeze Tokens.");
      return;
    }

    const matchedReason = PRESET_REASONS.find((r) => r.id === selectedReasonId);
    let finalReason = matchedReason?.defaultText || '';
    if (selectedReasonId === 'other') {
      if (!customReason.trim()) {
        setErrorMsg('Please specify your reason.');
        return;
      }
      finalReason = customReason.trim();
    } else if (customReason.trim()) {
      finalReason = `${matchedReason?.defaultText || ''}: ${customReason.trim()}`;
    }

    setSaving(true);
    setErrorMsg(null);
    try {
      await freezeStreak(selectedDuration, finalReason);
      await onSuccess();
      onClose();
    } catch (err: unknown) {
      console.error('Failed to freeze streak:', err);
      setErrorMsg(err instanceof Error ? err.message : 'Failed to activate Ice Pause. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="lg"
      errorMsg={errorMsg}
      accentGradient="bg-gradient-to-r from-neon-cyan via-white to-[#00f3ff]"
      title={
        <h3 className="text-base font-black tracking-wide bg-gradient-to-r from-neon-cyan via-white to-[#00f3ff] bg-clip-text text-transparent">
          Sickness Freeze Vault
        </h3>
      }
      subtitle="Activate Ice Pause to safeguard your current streak from decay while resting."
      icon={
        <div className="w-12 h-12 rounded-2xl bg-neon-cyan/10 border border-neon-cyan/30 flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.2)] animate-pulse">
          <Snowflake className="w-6 h-6 text-neon-cyan" />
        </div>
      }
    >
      <div className="max-h-[70vh] overflow-y-auto pr-1 custom-scrollbar">
        {availableTokens <= 0 ? (
          <div className="p-5 rounded-2xl bg-zinc-950/50 border border-zinc-800/60 flex flex-col items-center text-center space-y-4 my-2">
            <ShieldAlert className="w-10 h-10 text-zinc-600" />
            <div>
              <h4 className="text-xs font-black uppercase text-zinc-300 tracking-wider">No Tokens Available</h4>
              <p className="text-[11px] text-zinc-400 mt-1 max-w-[280px]">
                You do not have any Streak Freeze Tokens. Claim rewards or milestones to acquire freeze tokens.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 font-bold text-xs uppercase transition-all cursor-pointer"
            >
              Close
            </button>
          </div>
        ) : (
          <div className="space-y-6 pt-1">
            {/* Select Duration */}
            <div className="space-y-3">
              <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                Freeze Duration (Days):
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                {Array.from({ length: maxDays }).map((_, idx) => {
                  const day = idx + 1;
                  const isSelected = selectedDuration === day;
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => setSelectedDuration(day)}
                      className={`py-2 px-1 rounded-xl border text-center transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? 'bg-neon-cyan/10 border-neon-cyan text-neon-cyan shadow-[0_0_12px_rgba(34,211,238,0.25)] font-black text-sm scale-105'
                          : 'bg-zinc-950/40 border-zinc-800/80 text-zinc-400 hover:border-zinc-700 text-xs font-semibold'
                      }`}
                    >
                      {day}d
                    </button>
                  );
                })}
              </div>
              <p className="text-[10px] text-zinc-500 mt-1">
                Available: <span className="font-bold text-neon-cyan">{availableTokens} tokens</span>. (You can freeze up to {maxDays} days).
              </p>
            </div>

            {/* Reason Selection */}
            <div className="space-y-3">
              <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                Reason for Ice Pause:
              </label>
              <div className="space-y-2">
                {PRESET_REASONS.map((reason) => {
                  const isSelected = selectedReasonId === reason.id;
                  return (
                    <button
                      key={reason.id}
                      type="button"
                      onClick={() => {
                        setSelectedReasonId(reason.id);
                        setErrorMsg(null);
                      }}
                      className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-neon-cyan/5 border-neon-cyan text-neon-cyan font-bold shadow-[0_0_10px_rgba(34,211,238,0.15)] text-xs'
                          : 'bg-zinc-950/30 border-zinc-850 text-zinc-400 hover:border-zinc-700 text-xs'
                      }`}
                    >
                      <span>{reason.label}</span>
                      <span
                        className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                          isSelected ? 'border-neon-cyan bg-neon-cyan/20' : 'border-zinc-700'
                        }`}
                      >
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan" />}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Additional custom description text */}
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                {selectedReasonId === 'other' ? 'Specify Custom Reason:' : 'Optional Notes:'}
              </label>
              <textarea
                rows={2}
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder={
                  selectedReasonId === 'other'
                    ? 'Describe your injury/sickness...'
                    : 'Write any specific recovery goals or symptoms (optional)...'
                }
                className="w-full bg-zinc-950/80 border border-zinc-850 hover:border-zinc-750 focus:border-neon-cyan focus:outline-none rounded-xl p-3 text-xs text-zinc-200 placeholder-zinc-600 transition-all resize-none"
              />
            </div>

            {/* Summary Info Box */}
            <div className="p-4 rounded-2xl bg-zinc-950/50 border border-zinc-850 flex items-center justify-between text-xs">
              <span className="text-zinc-400">Streak Freeze Cost:</span>
              <span className="font-black text-neon-cyan text-sm shadow-[0_0_10px_rgba(34,211,238,0.1)]">
                {selectedDuration} Token{selectedDuration > 1 ? 's' : ''}
              </span>
            </div>

            {/* Action button */}
            <button
              type="button"
              onClick={handleActivate}
              disabled={saving}
              className="w-full bg-gradient-to-r from-neon-cyan via-white to-[#00f3ff] hover:shadow-[0_0_25px_rgba(34,211,238,0.45)] text-zinc-950 font-black py-3.5 px-4 rounded-2xl text-xs flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 cursor-pointer uppercase tracking-wider"
            >
              {saving ? (
                <div className="w-4 h-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Snowflake className="w-4 h-4 text-zinc-950 shrink-0" />
                  <span>Activate Ice Pause</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </ModalShell>
  );
}
