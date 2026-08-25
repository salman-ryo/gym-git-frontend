# Gym-Git — Core Features & Tech Stack

> Commit to your fitness. Track it like code.

Full-stack fitness platform combining developer tooling concepts (GitHub heatmaps, commit streaks) with RPG/anime gamification.

---

## 1. Core Tracking & Gamification

* **GitHub-Style Contribution Heatmap**: Year, month, and week views; intensity-based green cell shading by session duration; category filters; hover tooltips.
* **Scientific Streak Engine**: 7-day sliding compliance window evaluated against user-chosen plans. Rest days do not break streaks. Includes break detection and at-risk warnings.
* **Power Level Progression (0–100 Score)**: Evaluates consistency (45%), session quality (25%), variety (20%), and momentum (10%). Unlocks 6 power tiers and 11 anime character mascots.
* **Inventory & Streak Protection**:
  * *Streak Freeze Token*: Freezes streak during planned absences.
  * *Restore Shield*: Retroactively restores broken streaks within a time window.
  * *Rest Tokens*: Built-in non-workout cycle allowances.
* **Reward Roadmap**: Node-graph progression rewarding consumable items and badges based on streak milestones.
* **Workout Planning & Analytics**: 6 prebuilt splits (PPL, Upper/Lower, etc.) + custom plans. Dashboard tracks lifetime hours, current/longest streaks, monthly aggregations, and plan accuracy.

---

## 2. Platform & Architecture

* **Authentication & Profiles**: Supabase Auth (Email/Password, Google OAuth), JWT sessions, auto client-side timezone detection.
* **Mobile Application**: React Native / Expo companion app sharing the Go backend with deep linking (`gymgit://app`).
* **SEO & Metadata**: Dynamic `sitemap.xml`, `robots.txt`, dynamic OpenGraph image generator, Schema.org JSON-LD, and `llms.txt` crawler manifest.

---

## 3. Technology Stack

* **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, shadcn/ui, Radix UI, Lucide Icons.
* **Backend**: Go 1.22, Gin framework, `golang-jwt`, `lib/pq`.
* **Database & Storage**: PostgreSQL hosted on Supabase with Row-Level Security (RLS) and 7 migration versions.
* **Mobile**: React Native, Expo, Expo Router.