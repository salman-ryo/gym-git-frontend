import React from 'react';

interface CyberpunkLoaderProps {
    text?: string;
    fullScreen?: boolean;
    className?: string;
}

export default function CyberpunkLoader({
    text = 'Syncing Neural Logs',
    fullScreen = false,
    className,
}: CyberpunkLoaderProps) {
    // If fullScreen is true, it takes over the whole viewport (great for loading.tsx)
    // Otherwise, it uses the provided className or defaults to a padded container (great for page.tsx)
    const containerClass = fullScreen
        ? 'min-h-screen w-full bg-zinc-950 flex flex-col items-center justify-center z-50'
        : className || 'flex flex-col items-center justify-center w-full py-40';

    return (
        <div className={containerClass}>
            <div className="flex flex-col items-center justify-center space-y-8 animate-in fade-in duration-500">

                {/* Cyberpunk HUD Spinner */}
                <div className="relative w-24 h-24 flex items-center justify-center">
                    {/* Outer glowing ring - Indigo */}
                    <div className="absolute inset-0 rounded-full border-t-2 border-r-2 border-indigo-500/80 animate-[spin_2s_linear_infinite] shadow-[0_0_20px_rgba(129,140,248,0.4)]" />

                    {/* Inner counter-spinning ring - Cyan */}
                    <div className="absolute inset-2 rounded-full border-b-2 border-l-2 border-cyan-400/80 animate-[spin_1.5s_linear_infinite_reverse] shadow-[0_0_15px_rgba(34,211,238,0.4)]" />

                    {/* Core pulsating diamond - Amber (Matches Zap Icon) */}
                    <div className="w-3 h-3 bg-amber-400 rotate-45 shadow-[0_0_15px_rgba(245,158,11,0.8)] animate-pulse" />
                </div>

                {/* Neon Text & Bouncing Dots - Indigo */}
                <div className="flex flex-col items-center gap-3">
                    <span className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] drop-shadow-[0_0_8px_rgba(129,140,248,0.8)] text-center">
                        {text}
                    </span>
                    <div className="flex gap-1.5">
                        <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce shadow-[0_0_8px_#818cf8]" style={{ animationDelay: '0ms' }} />
                        <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce shadow-[0_0_8px_#818cf8]" style={{ animationDelay: '150ms' }} />
                        <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce shadow-[0_0_8px_#818cf8]" style={{ animationDelay: '300ms' }} />
                    </div>
                </div>

            </div>
        </div>
    );
}