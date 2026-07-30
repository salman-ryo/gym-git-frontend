import { Calendar, Target, Timer, Puzzle, Flame } from 'lucide-react';
import { PowerScoreBreakdown } from '@/lib/scientific-power';
import { AnimePower } from '@/assets/anime'; // Adjust path if needed

interface AnimeTierCardProps {
    title: string;
    score: number;
    character: AnimePower;
    gymDays: number;
    totalHours: number;
    scoreData: PowerScoreBreakdown;
}

export default function AnimeTierCard({
    title,
    score,
    character,
    gymDays,
    totalHours,
    scoreData,
}: AnimeTierCardProps) {
    // Helper to safely render progress bars
    const renderProgressBar = (current: number, max: number, colorClass: string) => {
        const percent = Math.min(100, Math.max(0, (current / max) * 100));
        return (
            <div className="w-full h-1 bg-zinc-800 rounded-full mt-1.5 overflow-hidden">
                <div className={`h-full rounded-full ${colorClass}`} style={{ width: `${percent}%` }} />
            </div>
        );
    };

    return (
        <div className="w-[340px] relative overflow-hidden rounded-2xl border border-sky-400/30 bg-gradient-to-b from-sky-950/90 to-zinc-950/95 backdrop-blur-md shadow-[0_0_40px_rgba(14,165,233,0.15)] font-sans">
            {/* Glossy top highlight */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none h-32" />

            {/* Header */}
            <div className="px-5 pt-4 pb-2 relative z-10">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-sky-100 uppercase tracking-wide font-bold text-sm">
                        <Calendar className="w-4 h-4 text-sky-300" />
                        <span>{title}</span>
                    </div>
                    <div className="font-black text-sm">
                        <span className="text-emerald-400">{score}</span>
                        <span className="text-amber-500"> / 100 PTS</span>
                    </div>
                </div>
                {/* Header Separator Line */}
                <div className="h-[2px] w-full bg-gradient-to-r from-amber-200 via-amber-500 to-amber-200 mt-2 opacity-70 rounded-full" />
            </div>

            {/* Main Profile Area */}
            <div className="px-5 py-3 flex gap-4 relative z-10">
                <div className="w-24 h-24 shrink-0 relative flex items-center justify-center">
                    {/* Subtle glow behind character */}
                    <div className="absolute inset-0 bg-sky-400/20 blur-xl rounded-full" />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={character.image}
                        alt={character.name}
                        className="w-full h-full object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] relative z-10"
                    />
                </div>

                <div className="flex-1 flex flex-col justify-center">
                    <h4 className="text-amber-400 font-black text-xl tracking-tight uppercase uppercase shadow-black drop-shadow-md">
                        {character.name} Tier
                    </h4>
                    <p className="text-[10px] text-zinc-300 leading-snug mt-1 line-clamp-4">
                        {character.description}
                    </p>
                    <div className="text-[11px] text-zinc-400 mt-2 font-medium">
                        {gymDays} Gym Days • {totalHours}h Total
                    </div>
                </div>
            </div>

            {/* Water/Wave Separator Simulation */}
            <div className="h-2 w-full border-t border-sky-400/40 shadow-[inset_0_4px_8px_rgba(56,189,248,0.15)] relative z-10 bg-gradient-to-b from-sky-900/20 to-transparent" />

            {/* Stats Grid */}
            <div className="px-4 py-3 grid grid-cols-2 gap-2 relative z-10">
                {/* Consistency */}
                <div className="bg-zinc-900/60 border border-zinc-700/50 rounded-lg p-2.5 hover:bg-zinc-800/80 transition-colors">
                    <div className="flex items-start gap-2">
                        <div className="bg-red-500/20 p-1 rounded-full text-red-400 shrink-0 mt-0.5">
                            <Target className="w-4 h-4" />
                        </div>
                        <div className="w-full">
                            <div className="flex justify-between items-end">
                                <span className="text-zinc-100 font-bold text-xs">Consistency</span>
                                <span className="text-zinc-400 text-[10px]">({scoreData.consistencyScore}/45)</span>
                            </div>
                            <p className="text-[9px] text-zinc-500 mt-0.5">Consistent check-ins,</p>
                            {renderProgressBar(scoreData.consistencyScore, 45, 'bg-red-400')}
                        </div>
                    </div>
                </div>

                {/* Duration */}
                <div className="bg-zinc-900/60 border border-zinc-700/50 rounded-lg p-2.5 hover:bg-zinc-800/80 transition-colors">
                    <div className="flex items-start gap-2">
                        <div className="bg-blue-500/20 p-1 rounded-full text-blue-400 shrink-0 mt-0.5">
                            <Timer className="w-4 h-4" />
                        </div>
                        <div className="w-full">
                            <div className="flex justify-between items-end">
                                <span className="text-zinc-100 font-bold text-xs">Duration</span>
                                <span className="text-zinc-400 text-[10px]">({scoreData.durationQualityScore}/25)</span>
                            </div>
                            <p className="text-[9px] text-zinc-500 mt-0.5">Total gym time,</p>
                            {renderProgressBar(scoreData.durationQualityScore, 25, 'bg-blue-400')}
                        </div>
                    </div>
                </div>

                {/* Variety */}
                <div className="bg-zinc-900/60 border border-zinc-700/50 rounded-lg p-2.5 hover:bg-zinc-800/80 transition-colors">
                    <div className="flex items-start gap-2">
                        <div className="bg-green-500/20 p-1 rounded-full text-green-400 shrink-0 mt-0.5">
                            <Puzzle className="w-4 h-4" />
                        </div>
                        <div className="w-full">
                            <div className="flex justify-between items-end">
                                <span className="text-zinc-100 font-bold text-xs">Variety</span>
                                <span className="text-zinc-400 text-[10px]">({scoreData.varietyScore}/20)</span>
                            </div>
                            <p className="text-[9px] text-zinc-500 mt-0.5">Different activities,</p>
                            {renderProgressBar(scoreData.varietyScore, 20, 'bg-green-400')}
                        </div>
                    </div>
                </div>

                {/* Momentum */}
                <div className="bg-zinc-900/60 border border-zinc-700/50 rounded-lg p-2.5 hover:bg-zinc-800/80 transition-colors">
                    <div className="flex items-start gap-2">
                        <div className="bg-orange-500/20 p-1 rounded-full text-orange-400 shrink-0 mt-0.5">
                            <Flame className="w-4 h-4" />
                        </div>
                        <div className="w-full">
                            <div className="flex justify-between items-end">
                                <span className="text-zinc-100 font-bold text-xs">Momentum</span>
                                <span className="text-zinc-400 text-[10px]">({scoreData.momentumScore}/10)</span>
                            </div>
                            <p className="text-[9px] text-zinc-500 mt-0.5">Daily streak bonus,</p>
                            {renderProgressBar(scoreData.momentumScore, 10, 'bg-orange-400')}
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Text */}
            <div className="bg-zinc-900/80 px-5 py-2.5 border-t border-zinc-800/80 relative z-10 flex items-center justify-between text-zinc-400">
                <p className="text-[11px] italic">
                    {scoreData.evaluationText || "No gym attendance recorded yet."}
                </p>
            </div>
        </div>
    );
}