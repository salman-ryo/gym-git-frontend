import { LandingNavbar, HeroSection, WhyGymGitSection } from '@/components/pages/landing';

export const metadata = {
  title: 'Gym-Git — Track Your Fitness Like a Developer',
  description:
    'GitHub-style fitness tracker. Log workouts, build streaks, and visualize progress like a developer.',
};

export default function LandingPage() {
  return (
    <div className="landing-page">
      <LandingNavbar />

      <main>
        <HeroSection />
        <WhyGymGitSection />

        {/* Future sections will go here */}
        {/* <StatsSection /> */}
        {/* <CTASection /> */}
        {/* <TestimonialsSection /> */}
        {/* <FooterSection /> */}

        {/* Extra height for scroll test */}
        <section style={{ height: '100vh' }} />
      </main>
    </div>
  );
}
