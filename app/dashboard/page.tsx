import { Metadata } from 'next';
import DashboardClient from './DashboardClient';

export const metadata: Metadata = {
  title: 'Dashboard | Gym-Git',
  description: 'Your scientific fitness dashboard.',
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function DashboardPage() {
  // We can fetch initial data here and pass it down in the future.
  // For now, we mount the client which handles hydration safely.
  
  return (
    <DashboardClient />
  );
}
