# Gym-Git Agent Canonical Entry Point

> **Central Context & Router for AI Software Engineers, Claude Code & Coding Agents**  
> All agents operating on Gym-Git must start here and follow the [Master Operating Procedures](#master-operating-procedures).

---

## 1. Fast Index & Router
* **Central Index & Router:** [.agent/00-INDEX.md](file:///.agent/00-INDEX.md)
* **Architecture & Stack Spec:** [.agent/rules/01-architecture.md](file:///.agent/rules/01-architecture.md)
* **Code Style & Conventions:** [.agent/rules/02-code-style.md](file:///.agent/rules/02-code-style.md)
* **Testing, Errors & Logging:** [.agent/rules/03-testing-and-errors.md](file:///.agent/rules/03-testing-and-errors.md)

### Active Feature Directories & State Trackers
1. **Frontend Auth & Backend Integration:** [.agent/features/frontend-auth-and-backend/STATE.md](file:///.agent/features/frontend-auth-and-backend/STATE.md)
2. **Landing Page & CSS Refactoring:** [.agent/features/landing-and-css-refactor/STATE.md](file:///.agent/features/landing-and-css-refactor/STATE.md)
3. **Core Dashboard & Analytics:** [.agent/features/core-dashboard-and-analytics/STATE.md](file:///.agent/features/core-dashboard-and-analytics/STATE.md)

---

## 2. Tooling & Development Commands

* **Package Manager:** `npm` (Node.js 20+)
* **Development Server:** `npm run dev` (Local Next.js dev server at `http://localhost:3000`)
* **Production Build:** `npm run build`
* **Linting & Code Quality:** `npm run lint`

---

## 3. Master Operating Procedures (MOP)

Every agent operating in this repository **must strictly abide** by the following four core rules:

### 1. Context Read (Context Economy)
* At the start of ANY task, read **ONLY** [.agent/00-INDEX.md](file:///.agent/00-INDEX.md) and the target feature's `STATE.md` file.
* Identify the exact phase file and the 2–3 required context files from the task's **Context Bundle**.
* **Do NOT** blindly load entire specs, large directories, or unrelated features into context.

### 2. No Ghosting
* **Never** leave logic unimplemented or insert placeholder comments like `// TODO: implement logic`, `// left as exercise`, or stubbed return values.
* Deliver complete, production-grade, working code with proper types, edge-case coverage, and null checks.

### 3. Circuit Breaker Rule
* If a task, build, or test fix fails **3 consecutive times**, **STOP IMMEDIATELY**.
* Revert code back to the last working Git commit/state.
* Document the blocker, reproduction steps, and root cause in the target feature's `STATE.md`.
* Ask the human engineer for architectural guidance.

### 4. Post-Execution Hook (MANDATORY)
* Before completing any task or ending your turn, **AUTONOMOUSLY** open the target feature's `STATE.md`.
* Mark finished tasks as `[x]`.
* Append a timestamped entry to the **Execution Log** detailing modified files, verification commands executed, and current status.

---

## 4. Project Context Summary

| Area | Choice / Standard |
| :--- | :--- |
| **Framework** | Next.js 16 (App Router), React 19, TypeScript (Strict) |
| **Styling** | Tailwind CSS v4 (`@theme inline`), CSS Variables, Radix UI / Shadcn primitives |
| **Authentication** | Supabase Auth (`@supabase/ssr`) with HttpOnly Cookie Sessions |
| **Backend API** | Go / Gin REST API at `http://localhost:8080/api/v1` |
| **API Client** | Custom fetch wrapper `utils/api.ts` with automatic Supabase JWT injection & envelope parsing |
| **Package Manager** | `npm` (Node.js 20+) |
| **State Management** | React Context (`lib/auth-context.tsx`), local hooks, URL search params |
