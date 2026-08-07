# Scaffolding & Setup: Landing Page & CSS Architecture

> **Feature:** `landing-and-css-refactor`  
> **Phase:** `00-scaffolding`

---

### Task 0.1: Tailwind CSS v4 Theme Integration & Base CSS

* **Context Bundle:**
  1. [.agent/rules/02-code-style.md](file:///.agent/rules/02-code-style.md)
  2. [refactor_css.md](file:///refactor_css.md)
* **Owns:**
  - `app/globals.css`
  - `postcss.config.mjs`
* **Forbidden:**
  - `utils/api.ts`
  - `lib/gym-service.ts`
* **Acceptance Criteria:**
  - **WHEN** the CSS pipeline compiles, **THE SYSTEM SHALL** register the `@theme inline` variables (`--neon-green`, `--neon-cyan`, `--neon-purple`) as native utility classes.
  - **WHEN** smooth scrolling and custom scrollbars are evaluated, **THE SYSTEM SHALL** apply them globally across dark mode viewports.
