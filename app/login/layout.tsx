import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In / Sign Up',
  description:
    'Sign in to your Gym-Git account or create a new developer profile to start tracking your gym consistency and commit streaks.',
  alternates: {
    canonical: '/login',
  },
  openGraph: {
    title: 'Sign In / Sign Up | Gym-Git',
    description:
      'Log into your Gym-Git account to track workout streaks, level up your power rating, and visualize gym consistency.',
    url: '/login',
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
