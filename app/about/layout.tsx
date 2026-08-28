import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Gym-Git — GitHub-Style Workout Tracker & Developer Conditioning Protocol',
  description:
    'Discover Gym-Git: Where software engineering discipline meets physical conditioning. Track workouts as code commits on an annual heatmap, level up through 11 anime power tiers, and utilize fault-tolerant streak protection.',
  keywords: [
    'Gym-Git',
    'GitHub fitness tracker',
    'developer workout tracker',
    'commit streaks fitness',
    'contribution graph workout',
    'anime power levels gym',
    'scientific power score',
    'workout consistency app',
    'rest tokens streak protection',
    'fitness for programmers',
    'open source fitness tracker',
  ],
  authors: [{ name: 'Gym-Git Team' }],
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'About Gym-Git — GitHub-Style Workout Tracker & Developer Conditioning Protocol',
    description:
      'Track your workouts like code commits. GitHub-style contribution heatmaps, scientific 0-100 anime power levels, Rest Tokens, and fault-tolerant streak engine.',
    url: '/about',
    siteName: 'Gym-Git',
    type: 'website',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        type: 'image/png',
        alt: 'About Gym-Git — GitHub-Style Fitness Tracker',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Gym-Git — GitHub-Style Workout Tracker',
    description:
      'Where software engineering meets physical conditioning. Commit to your gainz on a GitHub-style heatmap.',
    images: [
      {
        url: '/twitter-image.png',
        width: 1200,
        height: 630,
        alt: 'About Gym-Git — GitHub-Style Workout Tracker',
      },
    ],
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
