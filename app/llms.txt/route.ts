import { NextResponse } from 'next/server';

export const dynamic = 'force-static';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://gym-git.com';

  const content = `# Gym-Git

> GitHub-Style Gym Attendance Tracker & Workout Planner.

Gym-Git helps developers, lifters, and athletes stay consistent in the gym by turning workouts into GitHub-style commit heatmaps, streak analytics, and RPG power progression.

## Core URLs
- [Homepage](${baseUrl}/): Main overview of features, motivation engine, and interactive preview.
- [About Gym-Git](${baseUrl}/about): Deep-dive into developer conditioning protocol, anime power tiers, and architecture.
- [Sign In / Sign Up](${baseUrl}/login): Account registration and single sign-on (Email, Google, GitHub).
- [Credits & Attributions](${baseUrl}/credits): Open-source icons, vectors, and third-party licenses.
- [Privacy Policy](${baseUrl}/privacy): Data protection practices, telemetry handling, and zero data-selling policy.
- [Terms of Service](${baseUrl}/terms): Usage agreement, acceptable use, and physical health disclaimers.

## Key Features & Architecture
- **GitHub-Style Contribution Heatmap**: Visualizes workout attendance as green contribution cells across a 52-week matrix.
- **Streak Analytics & Protection**: Calculates active streaks with support for planned rest days and streak freeze shields.
- **RPG Power Rating & Leveling**: Gamifies gym progress with XP gain, power levels, and collectible items.
- **Developer-Grade Technology Stack**: Next.js App Router, Go/Gin backend API, Supabase Authentication & PostgreSQL.

## Optional & Related Endpoints
- [Sitemap](${baseUrl}/sitemap.xml): Search engine index of all public routes.
- [Robots Configuration](${baseUrl}/robots.txt): Search crawler rules and indexing directives.
`;

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
