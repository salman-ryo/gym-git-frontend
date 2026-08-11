# Design Tokens & Global Animations

> **Feature:** `landing-and-css-refactor`  
> **Phase:** `01-globals-theme-tokens`

---

### Task 1.1: Consolidate Common Variables & Keyframes into Globals

* **Context Bundle:**
  1. [.agent/rules/02-code-style.md](file:///.agent/rules/02-code-style.md)
* **Owns:**
  - `app/globals.css`
* **Forbidden:**
  - `components/DailyCheckInModal.tsx`
  - `lib/auth-context.tsx`
* **Acceptance Criteria:**
  - **WHEN** keyframe animations (`badge-pulse`, `float-slow`, `shimmer-effect`) are rendered on landing elements, **THE SYSTEM SHALL** execute GPU-accelerated CSS transforms defined centrally in `app/globals.css`.
  - **WHEN** brand colors are customized via `--brand-primary-rgb`, **THE SYSTEM SHALL** propagate the palette across all glow effects, borders, and gradients.
