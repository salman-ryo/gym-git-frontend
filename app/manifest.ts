import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Gym-Git — GitHub-Style Gym Attendance Tracker',
    short_name: 'Gym-Git',
    description: 'Commit to your fitness goals with GitHub-style contribution graphs and streak analytics.',
    start_url: '/',
    display: 'standalone',
    background_color: '#030108',
    theme_color: '#00ff88',
    icons: [
      {
        src: '/favicon-96x96.png',
        sizes: '96x96',
        type: 'image/png',
      },
      {
        src: '/web-app-manifest-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/web-app-manifest-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
