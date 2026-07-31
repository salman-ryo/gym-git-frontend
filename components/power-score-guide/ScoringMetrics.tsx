'use client';

import React from 'react';
import { Swords } from 'lucide-react';

export default function ScoringMetrics() {
  return (
    <div className="w-full lg:w-[280px] xl:w-[320px] shrink-0 flex flex-col gap-4">
      <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2 mb-1">
        <Swords className="w-4 h-4 text-zinc-500" />
        Scoring Metrics
      </h3>

      <div className="flex flex-col gap-3">
        <div className="bg-zinc-900/40 p-4 rounded-xl border border-zinc-800 hover:border-indigo-500/30 transition-colors group">
          <p className="font-black text-[11px] tracking-wider uppercase text-indigo-400 mb-1.5 flex justify-between items-center">
            <span>🎯 Consistency</span>
            <span className="text-zinc-600 group-hover:text-indigo-500/50 transition-colors">45%</span>
          </p>
          <p className="text-[11px] text-zinc-400 leading-relaxed font-medium">
            Days hit vs target frequency. 5 days @ 45m beats 1 day @ 4h.
          </p>
        </div>

        <div className="bg-zinc-900/40 p-4 rounded-xl border border-zinc-800 hover:border-sky-500/30 transition-colors group">
          <p className="font-black text-[11px] tracking-wider uppercase text-sky-400 mb-1.5 flex justify-between items-center">
            <span>⏱️ Optimal Length</span>
            <span className="text-zinc-600 group-hover:text-sky-500/50 transition-colors">25%</span>
          </p>
          <p className="text-[11px] text-zinc-400 leading-relaxed font-medium">
            45m – 90m sweet spot gets 100%. Overlong binge days (&gt;3h) diminish returns.
          </p>
        </div>

        <div className="bg-zinc-900/40 p-4 rounded-xl border border-zinc-800 hover:border-amber-500/30 transition-colors group">
          <p className="font-black text-[11px] tracking-wider uppercase text-amber-400 mb-1.5 flex justify-between items-center">
            <span>🧩 Split Variety</span>
            <span className="text-zinc-600 group-hover:text-amber-500/50 transition-colors">20%</span>
          </p>
          <p className="text-[11px] text-zinc-400 leading-relaxed font-medium">
            Rewards training 3+ distinct workout types (Push, Pull, Legs, etc.) to ensure balanced training.
          </p>
        </div>

        <div className="bg-zinc-900/40 p-4 rounded-xl border border-zinc-800 hover:border-rose-500/30 transition-colors group">
          <p className="font-black text-[11px] tracking-wider uppercase text-rose-400 mb-1.5 flex justify-between items-center">
            <span>🔥 Momentum</span>
            <span className="text-zinc-600 group-hover:text-rose-500/50 transition-colors">10%</span>
          </p>
          <p className="text-[11px] text-zinc-400 leading-relaxed font-medium">
            Active habit sequences & steady weekly attendance multipliers.
          </p>
        </div>
      </div>
    </div>
  );
}
