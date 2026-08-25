import type { Metadata } from 'next';
import {
  LandingNavbar,
  HeroSection,
  WhyGymGitSection,
  MobileFeatureSection,
  TestimonialsSection,
  CTASection,
} from '@/components/pages/landing';
import Footer from '@/components/layout/Footer';
import { JsonLd, faqPageJsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'Gym-Git — Track Your Fitness Like a Developer',
  description:
    'GitHub-style fitness tracker. Log workouts, build unbreakable streaks, level up your Power Level, and visualize gym consistency with contribution heatmaps.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Gym-Git — Track Your Fitness Like a Developer',
    description:
      'Commit to your fitness goals with GitHub-style contribution graphs and streak analytics.',
    url: '/',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Gym-Git — Track Your Fitness Like a Developer',
      },
    ],
  },
};

export default function HomePage() {
  return (
    <div className="landing-page relative">
      <JsonLd data={faqPageJsonLd} />

      <LandingNavbar />

      <main style={{ position: 'relative', zIndex: 1 }}>
        <HeroSection />
        <WhyGymGitSection />
        <MobileFeatureSection />
        <TestimonialsSection />
        <CTASection />
      </main>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <Footer />
      </div>
    </div>
  );
}