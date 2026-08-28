import type { Metadata, Viewport } from 'next';
import { Inter, Geist } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/lib/auth-context';
import { InventoryProvider } from '@/lib/inventory-context';
import { cn } from "@/lib/utils";
import { LandingBackground } from '@/components/pages/landing';
import Footer from '@/components/layout/Footer';
import { JsonLd, organizationJsonLd, softwareAppJsonLd } from '@/components/seo/JsonLd';

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const siteUrl =
  process.env.NEXT_PUBLIC_APP_URL ||
  (process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : 'https://gym-git.com');

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#030108' },
    { media: '(prefers-color-scheme: light)', color: '#030108' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Gym-Git — GitHub-Style Gym Attendance Tracker & Workout Planner',
    template: '%s | Gym-Git',
  },
  description:
    'Commit to your fitness goals with GitHub-style contribution heatmaps, streak analytics, power level RPG progression, and developer-grade workout tracking.',
  applicationName: 'Gym-Git',
  authors: [{ name: 'Gym-Git Team', url: siteUrl }],
  generator: 'Next.js',
  keywords: [
    'gym tracker',
    'github gym streak',
    'fitness streak tracker',
    'workout contribution graph',
    'developer fitness app',
    'gym attendance tracker',
    'rpg fitness progression',
    'workout logger',
    'git commit fitness',
    'streak freeze gym',
    'fitness heatmap',
  ],
  creator: 'Gym-Git',
  publisher: 'Gym-Git',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    title: 'Gym-Git — Track Your Fitness Like a Developer',
    description:
      'GitHub-style fitness tracker. Log workouts, build streaks, level up your Power Level, and visualize gym consistency.',
    siteName: 'Gym-Git',
    images: [
      {
        url: '/opengraph-image.png',
        secureUrl: `${siteUrl}/opengraph-image.png`,
        width: 1200,
        height: 630,
        type: 'image/png',
        alt: 'Gym-Git — GitHub-Style Gym Attendance Tracker & Workout Planner',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gym-Git — Track Your Fitness Like a Developer',
    description:
      'Commit to your fitness goals with GitHub-style contribution graphs and streak analytics.',
    images: [
      {
        url: '/twitter-image.png',
        width: 1200,
        height: 630,
        alt: 'Gym-Git — Track Your Fitness Like a Developer',
      },
    ],
    creator: '@gymgit',
    site: '@gymgit',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48', type: 'image/x-icon' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '192x192',
        url: '/web-app-manifest-192x192.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '512x512',
        url: '/web-app-manifest-512x512.png',
      },
    ],
  },
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    title: 'Gym-Git',
    statusBarStyle: 'black-translucent',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION || undefined,
  },
  category: 'fitness',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("dark", "font-sans", geist.variable)}>
      <head>
        <JsonLd data={organizationJsonLd} />
        <JsonLd data={softwareAppJsonLd} />
      </head>
      <body className={`${inter.variable} font-sans antialiased bg-zinc-950 text-zinc-100 min-h-screen`}>
        <LandingBackground />

        <AuthProvider>
          <InventoryProvider>
            {children}
            <Footer />
          </InventoryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}