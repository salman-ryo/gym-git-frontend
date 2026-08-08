import {
  LandingNavbar,
  HeroSection,
  WhyGymGitSection,
  MobileFeatureSection,
  TestimonialsSection,
  CTASection,
  LandingBackground,
} from '@/components/pages/landing';
import Footer from '@/components/layout/Footer';

export const metadata = {
  title: 'Gym-Git — Track Your Fitness Like a Developer',
  description:
    'GitHub-style fitness tracker. Log workouts, build streaks, and visualize progress like a developer.',
};

export default function HomePage() {
  return (
    <div className="landing-page" style={{ position: 'relative', background: '#060a0e' }}>
      <LandingBackground />
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