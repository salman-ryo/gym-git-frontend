import React from 'react';
import { socialLinks } from '@/lib/links';

interface JsonLdProps {
  data: Record<string, unknown>;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Gym-Git',
  url: 'https://gymgit.com',
  logo: 'https://gymgit.com/web-app-manifest-512x512.png',
  description:
    'Gym-Git is a developer-focused fitness tracker that transforms workout logs into GitHub-style contribution graphs and streak analytics.',
  sameAs: [
    socialLinks.github,
    socialLinks.linkedin,
  ],
};

export const softwareAppJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Gym-Git',
  operatingSystem: 'Web, iOS, Android',
  applicationCategory: 'HealthApplication',
  applicationSubCategory: 'Fitness Tracking',
  url: 'https://gymgit.com',
  description:
    'GitHub-style workout tracker. Visualize consistency with contribution graphs, build streaks, level up your power rating, and plan workouts.',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    ratingCount: '2457',
    bestRating: '5',
    worstRating: '1',
  },
  featureList: [
    'GitHub-style commit grid for gym attendance',
    'Power Level RPG progression system',
    'Streak calculation with Rest Day & Streak Freeze protection',
    'Weekly workout planning and volume tracking',
    'Dark-mode developer-first UI',
  ],
};

export const faqPageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is Gym-Git?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Gym-Git is a fitness tracker designed for developers, lifters, and athletes. It uses GitHub-style contribution heatmaps to visualize your gym consistency and build unbreakable workout streaks.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do gym streaks and contribution squares work?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Every time you log a workout session, Gym-Git marks a green contribution cell on your annual heatmap. As you maintain consistency, your streak increments and your Power Level levels up.',
      },
    },
    {
      '@type': 'Question',
      name: 'What happens if I take a rest day or get sick?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Gym-Git supports scheduled Rest Days and Streak Freezes (Shields) so you never lose your hard-earned streak due to necessary recovery or illness.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is Gym-Git free to use?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! Gym-Git offers free workout logging, contribution graphs, streak tracking, and RPG progression.',
      },
    },
  ],
};
