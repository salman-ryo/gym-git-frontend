import React from 'react';
import Link from 'next/link';

interface AttributionItem {
    id: string;
    assetDescription: string;
    author: string;
    authorUrl: string;
    platform: string;
    platformUrl: string;
}

/* Add any new icon authors or asset credits to this list */
const ATTRIBUTIONS: AttributionItem[] = [
    {
        id: 'kerismaker-icons',
        assetDescription: 'Fitness & Workout UI Icons',
        author: 'kerismaker',
        authorUrl: 'https://www.flaticon.com/authors/kerismaker',
        platform: 'Flaticon',
        platformUrl: 'https://www.flaticon.com/',
    },
    // {
    //     id: 'freepik-icons',
    //     assetDescription: 'Gym Equipment Vectors',
    //     author: 'Freepik',
    //     authorUrl: 'https://www.freepik.com',
    //     platform: 'Freepik',
    //     platformUrl: 'https://www.freepik.com/',
    // },
    // Example for adding more:
    // {
    //   id: 'smashicons-flaticon',
    //   assetDescription: 'Muscle Anatomy Badges',
    //   author: 'Smashicons',
    //   authorUrl: 'https://www.flaticon.com/authors/smashicons',
    //   platform: 'Flaticon',
    //   platformUrl: 'https://www.flaticon.com/',
    // },
];

export const metadata = {
    title: 'Credits & Attributions | Gym-Git',
    description: 'Third-party asset licenses and icon designer attributions.',
};

export default function CreditsPage() {
    return (
        <main className="min-h-screen text-zinc-200 py-16 px-6">
            <div className="max-w-3xl mx-auto">

                {/* Header */}
                <div className="mb-10">
                    <Link
                        href="/"
                        className="text-xs text-zinc-500 hover:text-neon-green transition-colors inline-block mb-4"
                    >
                        &larr; Back to Gym-Git
                    </Link>
                    <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-neon-green via-teal-300 to-emerald-200 bg-clip-text text-transparent mb-2">
                        Third-Party Credits &amp; Attributions
                    </h1>
                    <p className="text-sm text-zinc-400">
                        Gym-Git uses open-source and free community assets. We proudly credit the original creators below in accordance with their respective distribution licenses.
                    </p>
                </div>

                {/* Attributions List */}
                <div className="space-y-4">
                    {ATTRIBUTIONS.map((item) => (
                        <div
                            key={item.id}
                            className="p-4 rounded-xl border border-zinc-800/80 bg-zinc-900/40 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors hover:border-zinc-700"
                        >
                            <div>
                                <p className="text-sm font-semibold text-zinc-100">{item.assetDescription}</p>
                                <p className="text-xs text-zinc-400 mt-0.5">
                                    Created by{' '}
                                    <a
                                        href={item.authorUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-teal-300 hover:underline hover:text-teal-200 font-medium"
                                    >
                                        {item.author}
                                    </a>{' '}
                                    on{' '}
                                    <a
                                        href={item.platformUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-zinc-300 hover:underline hover:text-white"
                                    >
                                        {item.platform}
                                    </a>
                                </p>
                            </div>

                            <a
                                href={item.authorUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[11px] px-3 py-1.5 rounded-lg border border-zinc-700 bg-zinc-800/60 text-zinc-300 hover:text-white hover:border-neon-green/40 hover:bg-neon-green/10 transition-all self-start sm:self-auto"
                            >
                                View Creator Profile &rarr;
                            </a>
                        </div>
                    ))}
                </div>

            </div>
        </main>
    );
}