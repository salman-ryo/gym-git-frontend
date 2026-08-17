# Project Rules Index

> This directory contains all persistent architectural, styling, and testing standards for Gym-Git.

---

## Rule Directory

1. [01-architecture.md](file:///.agent/rules/01-architecture.md)
   - **Scope:** High-level framework setup, Next.js 16 App Router, Supabase Auth SSR session management, Go / Gin REST backend integration (`http://localhost:8080/api/v1`), Global Timezone Engine (`X-Timezone`), full REST API endpoint specifications, domain models (Cycles, Items, Inventory, Roadmap, Lifecycle Events), environment variable validation, and deployment guidelines.
2. [02-code-style.md](file:///.agent/rules/02-code-style.md)
   - **Scope:** TypeScript typing rules, component structure, directory layout, Tailwind CSS v4 `@theme inline` design tokens, RPG inventory rarity borders, roadmap timeline nodes, glassmorphic styling, and UI animations.
3. [03-testing-and-errors.md](file:///.agent/rules/03-testing-and-errors.md)
   - **Scope:** Error handling conventions (`ApiError`, standard envelopes, past log restriction handling), Supabase session refresh strategies, 401 redirect behaviors, client-side error toasts/alerts, and verification standards.
