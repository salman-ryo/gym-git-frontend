# Landing Page Components Refactoring

> **Feature:** `landing-and-css-refactor`  
> **Phase:** `02-landing-components-refactor`

---

### Task 2.1: Modernize Landing Sections with Shared Tokens & Tailwind

* **Context Bundle:**
  1. [.agent/rules/02-code-style.md](file:///.agent/rules/02-code-style.md)
* **Owns:**
  - `components/pages/landing/LandingNavbar.tsx` & `.css`
  - `components/pages/landing/HeroSection.tsx` & `.css`
  - `components/pages/landing/WhyGymGitSection.tsx` & `.css`
  - `components/pages/landing/MobileFeatureSection.tsx` & `.css`
  - `components/pages/landing/TestimonialsSection.tsx` & `.css`
  - `components/pages/landing/CTASection.tsx` & `.css`
  - `components/pages/landing/FooterSection.tsx` & `.css`
  - `components/pages/landing/LandingBackground.tsx` & `.css`
* **Forbidden:**
  - `utils/supabase/**`
  - `lib/types.ts`
* **Acceptance Criteria:**
  - **WHEN** the landing page loads, **THE SYSTEM SHALL** render the responsive Cyber-Fitness UI featuring glassmorphic badges, hero CTA buttons, interactive testimonial sliders, and feature breakdowns.
  - **WHEN** viewport changes from mobile (<640px) to desktop (1280px+), **THE SYSTEM SHALL** smoothly transition grid layouts without overflow or layout shift.
