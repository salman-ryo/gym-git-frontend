'use client';

import React, { useState, useRef, useEffect } from 'react';
import { WorkoutType } from '@/lib/types';
import { Clock, Plus, Check, Save, Trash2 } from 'lucide-react';
import { getThemeForWorkout } from '@/components/contribution-graph/theme-utils';

// --- CyberDial Component ---
interface CyberDialProps {
  value: number;
  onChange: (val: number) => void;
  max?: number;
  step?: number;
}

const CyberDial: React.FC<CyberDialProps> = ({ value, onChange, max = 6, step = 0.25 }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min(value / max, 1);
  const strokeDashoffset = circumference - percentage * circumference;

  // Calculate coordinates for the glowing thumb indicator
  const angleInRadians = (percentage * 360 - 90) * (Math.PI / 180);
  const thumbX = 100 + radius * Math.cos(angleInRadians);
  const thumbY = 100 + radius * Math.sin(angleInRadians);

  const handleInteract = (e: React.PointerEvent<SVGSVGElement> | PointerEvent) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;

    // Calculate angle from 12 o'clock
    let angle = Math.atan2(dy, dx) + Math.PI / 2;
    if (angle < 0) angle += 2 * Math.PI;

    let newValue = (angle / (2 * Math.PI)) * max;
    newValue = Math.round(newValue / step) * step;

    // Prevent snapping from 6 directly to 0 if crossing the top boundary awkwardly
    if (newValue > max) newValue = max;
    onChange(newValue);
  };

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (isDragging) handleInteract(e);
    };
    const handlePointerUp = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
    }
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [isDragging, max, step]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="relative flex justify-center items-center my-3 sm:my-6 group">
      {/* Outer Glow Ring */}
      <div className="absolute inset-0 m-auto w-[145px] sm:w-[180px] h-[145px] sm:h-[180px] rounded-full border border-neon-green/10 shadow-[0_0_40px_rgba(0,255,136,0.1)] pointer-events-none transition-all duration-300 group-hover:shadow-[0_0_50px_rgba(0,255,136,0.2)]" />

      <svg
        ref={svgRef}
        width="200"
        height="200"
        viewBox="0 0 200 200"
        className="touch-none cursor-pointer drop-shadow-[0_0_10px_rgba(0,255,136,0.3)] w-[160px] h-[160px] sm:w-[200px] sm:h-[200px]"
        onPointerDown={(e) => {
          setIsDragging(true);
          handleInteract(e);
        }}
      >
        {/* Background Track */}
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke="#0f1720"
          strokeWidth="12"
          className="transition-colors duration-300 group-hover:stroke-[#15202b]"
        />

        {/* Active Neon Track */}
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke="url(#neon-gradient)"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-75 ease-out"
          style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
        />

        {/* Glowing Thumb */}
        <circle
          cx={thumbX}
          cy={thumbY}
          r="8"
          fill="#00ff88"
          className="drop-shadow-[0_0_8px_#00ff88] transition-all duration-75 ease-out"
        />

        <defs>
          <linearGradient id="neon-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00e077" />
            <stop offset="100%" stopColor="#00ff88" />
          </linearGradient>
        </defs>
      </svg>

      {/* Center Digital Display */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-2xl sm:text-3xl font-black text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.5)] tracking-tighter">
          {value === 0 ? 'OFF' : value}
        </span>
        <span className="text-[9px] sm:text-[10px] font-bold text-neon-green uppercase tracking-widest mt-0.5 sm:mt-1">
          Hours
        </span>
      </div>
    </div>
  );
};

// --- Reusable WorkoutLogForm Component ---
export interface WorkoutLogFormProps {
  hours: number;
  setHours: (h: number) => void;
  isCustomHours: boolean;
  setIsCustomHours: (c: boolean) => void;
  customHoursInput: string;
  setCustomHoursInput: (s: string) => void;
  workoutType: WorkoutType;
  setWorkoutType: (type: WorkoutType) => void;
  notes: string;
  setNotes: (notes: string) => void;
  categories: string[];
  onSubmit: () => Promise<void>;
  saving: boolean;
  submitButtonText: string;
  onDelete?: () => Promise<void>;
  deleting?: boolean;
}

export default function WorkoutLogForm({
  hours,
  setHours,
  isCustomHours,
  setIsCustomHours,
  customHoursInput,
  setCustomHoursInput,
  workoutType,
  setWorkoutType,
  notes,
  setNotes,
  categories,
  onSubmit,
  saving,
  submitButtonText,
  onDelete,
  deleting,
}: WorkoutLogFormProps) {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Duration Selector */}
      <div>
        <div className="flex items-center justify-between mb-1 sm:mb-2">
          <label className="text-[11px] sm:text-xs font-black text-zinc-300 flex items-center gap-1.5 uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5 text-neon-green" /> Duration
          </label>
        </div>

        {!isCustomHours ? (
          <CyberDial value={hours} onChange={setHours} max={6} step={0.25} />
        ) : (
          <div className="flex items-center gap-2.5 sm:gap-3 p-3 sm:p-4 my-3 sm:my-6 bg-[#05080c] border border-neon-green/50 rounded-2xl shadow-[0_0_20px_rgba(0,255,136,0.1)] animate-in fade-in">
            <span className="text-xs font-bold text-zinc-400">Time:</span>
            <input
              type="number"
              min="0"
              max="24"
              step="0.25"
              value={customHoursInput}
              onChange={(e) => setCustomHoursInput(e.target.value)}
              placeholder="e.g. 3.5"
              className="flex-1 bg-zinc-900/50 border border-zinc-800 focus:border-neon-green rounded-xl px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-neon-green font-black outline-none transition-all"
            />
            <span className="text-xs font-bold text-zinc-400">hours</span>
          </div>
        )}

        {/* Manual Toggle */}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => setIsCustomHours(!isCustomHours)}
            className={`py-1 sm:py-1.5 px-3.5 sm:px-4 text-[9.5px] sm:text-[10px] font-black rounded-full transition-all border flex items-center gap-1.5 cursor-pointer uppercase tracking-widest ${
              isCustomHours
                ? 'bg-neon-green/10 text-neon-green border-neon-green/30'
                : 'bg-transparent text-zinc-500 border-zinc-800 hover:text-neon-cyan hover:border-neon-cyan/40'
            }`}
          >
            <Plus className="w-3 h-3" />
            <span>{isCustomHours ? 'Return to Dial' : 'Manual Entry'}</span>
          </button>
        </div>
      </div>

      {/* Workout Type Selector */}
      <div>
        <label className="block text-[9.5px] sm:text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1.5 sm:mb-2.5">
          Select Protocol:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 sm:gap-2 max-h-36 overflow-y-auto pr-1 custom-scrollbar">
          {Array.from(new Set(categories.filter((c) => c.toLowerCase() !== 'rest'))).map((type) => {
            const isSelected = workoutType === type;
            const typeTheme = getThemeForWorkout(type);

            return (
              <button
                key={type}
                type="button"
                onClick={() => setWorkoutType(type)}
                className={`py-1.5 sm:py-2 px-2.5 sm:px-3 rounded-xl text-[11px] sm:text-xs font-bold transition-all border flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? typeTheme.filterActive
                    : 'bg-[#05080c] border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                }`}
              >
                <span className="truncate">{type}</span>
                {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-[9.5px] sm:text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1.5 sm:mb-2">
          Session Data
        </label>
        <input
          type="text"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="e.g. 5x5 Heavy Squats, PR Bench, Felt great..."
          className="w-full bg-[#05080c] border border-zinc-800 focus:border-neon-green focus:shadow-[0_0_15px_rgba(0,255,136,0.2)] rounded-xl py-2.5 sm:py-3 px-3 text-xs text-zinc-100 placeholder-zinc-700 outline-none transition-all"
        />
      </div>

      {/* Form Submission Action Buttons */}
      <div className="flex items-center gap-2.5 sm:gap-3 pt-1 sm:pt-2">
        {onDelete && (
          <button
            type="button"
            onClick={onDelete}
            disabled={deleting || saving}
            className="p-3 sm:p-3.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500/60 rounded-2xl text-red-400 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
            title="Clear record"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}

        <button
          type="button"
          onClick={onSubmit}
          disabled={saving || (deleting ?? false)}
          className="flex-1 bg-gradient-to-r from-neon-green via-[#00e077] to-neon-cyan hover:shadow-[0_0_25px_rgba(0,255,136,0.4)] text-[#060a0e] font-black py-3 sm:py-3.5 px-4 rounded-2xl text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
        >
          {saving ? (
            <div className="w-5 h-5 border-2 border-[#060a0e] border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Save className="w-4 h-4 text-[#060a0e]" />
              <span>{submitButtonText}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
