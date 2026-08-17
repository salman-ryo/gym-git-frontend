# Dynamic Streak Reward Roadmap System

> **Feature:** `gamification-and-rewards`  
> **Phase:** `04-reward-roadmap`

---

### Task 4.1: Progression Timeline, Milestone States & Claim Celebrations

* **Context Bundle:**
  1. [.agent/rules/01-architecture.md](file:///.agent/rules/01-architecture.md)
  2. [.agent/rules/02-code-style.md](file:///.agent/rules/02-code-style.md)
  3. [lib/types.ts](file:///lib/types.ts)
* **Owns:**
  - `lib/rewards-service.ts`
  - `components/pages/dashboard/rewards/RewardRoadmap.tsx`
  - `components/pages/dashboard/rewards/RoadmapMilestoneNode.tsx`
  - `components/pages/dashboard/rewards/ClaimCelebrationModal.tsx`
* **Forbidden:**
  - `utils/supabase/**`
  - `app/login/page.tsx`
* **Acceptance Criteria:**
  - **WHEN** the Reward Roadmap is rendered, **THE SYSTEM SHALL** fetch dynamic milestones from `GET /api/v1/rewards/roadmap` and display an interactive progression path.
  - **WHEN** rendering milestone nodes, **THE SYSTEM SHALL** evaluate statuses:
    - `LOCKED`: Dimmed card with lock icon and streak requirement.
    - `CLAIMABLE`: Radiant glowing border, pulse animation, and active "CLAIM REWARD" button.
    - `CLAIMED`: Success checkmark with claimed timestamp.
  - **WHEN** user clicks "CLAIM REWARD", **THE SYSTEM SHALL** call `POST /api/v1/rewards/claim`, trigger the `ClaimCelebrationModal` drop popup, and increment inventory balances in real time.
